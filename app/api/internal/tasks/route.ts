import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { tasks, projects } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { notifyTaskAssigned } from '@/lib/notifications';

// GET /api/internal/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    
    let conditions: any[] = [];
    
    if (status) {
      conditions.push(eq(tasks.status, status as any));
    }
    if (projectId) {
      conditions.push(eq(tasks.projectId, projectId));
    }
    if (assigneeId) {
      conditions.push(eq(tasks.assigneeId, assigneeId));
    }
    
    let query = getDb().select().from(tasks).orderBy(desc(tasks.createdAt));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const allTasks = await query;
    
    return NextResponse.json({
      success: true,
      data: allTasks,
      count: allTasks.length
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { title, description, instanceId, key, projectId, assignedToUserId, status, priority, dueAt } = body;
    
    if (!title || !instanceId || !key) {
      return NextResponse.json(
        { error: 'Task title, instanceId, and key are required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    const taskId = nanoid();
    
    const newTask = await getDb().insert(tasks).values({
      id: taskId,
      title,
      description,
      instanceId,
      key,
      projectId,
      assignedToUserId,
      status: status || 'todo',
      priority: priority || 'medium',
      dueAt: dueAt ? new Date(dueAt).getTime() : null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    // Send notification if task is assigned
    if (assignedToUserId && assignedToUserId !== session?.user?.id) {
      try {
        let projectName: string | undefined;
        if (projectId) {
          const project = await getDb().select({ name: projects.name })
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1);
          projectName = project[0]?.name;
        }
        
        await notifyTaskAssigned(
          assignedToUserId,
          taskId,
          title,
          projectName,
          session?.user?.id
        );
      } catch (notifyError) {
        console.error('Failed to send task assignment notification:', notifyError);
        // Don't fail the request if notification fails
      }
    }
    
    return NextResponse.json({
      success: true,
      data: newTask[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task', details: error.message },
      { status: 500 }
    );
  }
}


