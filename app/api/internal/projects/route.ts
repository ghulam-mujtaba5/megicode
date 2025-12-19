import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createNotification, NotificationTemplates } from '@/lib/notifications';

// GET /api/internal/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query = getDb().select().from(projects).orderBy(desc(projects.createdAt));
    
    if (status) {
      query = query.where(eq(projects.status, status as any)) as any;
    }
    
    const allProjects = await query;
    
    return NextResponse.json({
      success: true,
      data: allProjects,
      count: allProjects.length
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { name, description, clientId, leadId, status, priority, startAt, dueAt, ownerUserId } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    const projectId = nanoid();
    
    const newProject = await getDb().insert(projects).values({
      id: projectId,
      name,
      description,
      clientId,
      leadId,
      ownerUserId,
      status: status || 'new',
      priority: priority || 'medium',
      startAt: startAt ? new Date(startAt).getTime() : null,
      dueAt: dueAt ? new Date(dueAt).getTime() : null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    // Send notification to project owner if different from creator
    if (ownerUserId && ownerUserId !== session?.user?.id) {
      try {
        const template = NotificationTemplates.projectCreated(name);
        await createNotification({
          userId: ownerUserId,
          type: template.type as any,
          title: template.title!,
          message: template.message,
          priority: template.priority as any,
          entityType: 'project',
          entityId: projectId,
          link: `/internal/projects/${projectId}`,
          actorUserId: session?.user?.id,
        });
      } catch (notifyError) {
        console.error('Failed to send project creation notification:', notifyError);
      }
    }

    // Also notify all admins about new project
    try {
      const db = getDb();
      const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin')).all();
      
      for (const admin of admins) {
        if (admin.id !== session?.user?.id) {
          const template = NotificationTemplates.projectCreated(name);
          await createNotification({
            userId: admin.id,
            type: template.type as any,
            title: template.title!,
            message: template.message,
            priority: template.priority as any,
            entityType: 'project',
            entityId: projectId,
            link: `/internal/projects/${projectId}`,
            actorUserId: session?.user?.id,
          });
        }
      }
    } catch (notifyError) {
      console.error('Failed to send admin notifications:', notifyError);
    }
    
    return NextResponse.json({
      success: true,
      data: newProject[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}

