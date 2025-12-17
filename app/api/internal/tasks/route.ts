import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

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
    const body = await request.json();
    
    const { title, description, instanceId, key, projectId, assignedToUserId, status, priority, dueAt } = body;
    
    if (!title || !instanceId || !key) {
      return NextResponse.json(
        { error: 'Task title, instanceId, and key are required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newTask = await getDb().insert(tasks).values({
      id: nanoid(),
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


