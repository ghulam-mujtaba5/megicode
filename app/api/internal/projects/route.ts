import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    const body = await request.json();
    
    const { name, description, clientId, leadId, status, priority, startAt, dueAt } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newProject = await getDb().insert(projects).values({
      id: nanoid(),
      name,
      description,
      clientId,
      leadId,
      status: status || 'new',
      priority: priority || 'medium',
      startAt: startAt ? new Date(startAt).getTime() : null,
      dueAt: dueAt ? new Date(dueAt).getTime() : null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
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

