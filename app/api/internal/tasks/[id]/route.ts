import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { tasks, projects, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { 
  notifyTaskAssigned, 
  createNotification, 
  NotificationTemplates 
} from '@/lib/notifications';

// GET /api/internal/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const task = await getDb().select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    
    if (!task.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: task[0]
    });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/internal/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await request.json();
    
    // Get existing task first to compare changes
    const existingTask = await getDb().select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);
    
    if (!existingTask.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const oldTask = existingTask[0];
    
    const updated = await getDb().update(tasks)
      .set({
        ...body,
        updatedAt: new Date().getTime()
      })
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const newTask = updated[0];
    
    // Send notifications for relevant changes
    try {
      // Get project name for context
      let projectName: string | undefined;
      if (newTask.projectId) {
        const project = await getDb().select({ name: projects.name })
          .from(projects)
          .where(eq(projects.id, newTask.projectId))
          .limit(1);
        projectName = project[0]?.name;
      }
      
      // Notify if assignee changed
      if (body.assignedToUserId && 
          body.assignedToUserId !== oldTask.assignedToUserId &&
          body.assignedToUserId !== session?.user?.id) {
        await notifyTaskAssigned(
          body.assignedToUserId,
          id,
          newTask.title,
          projectName,
          session?.user?.id
        );
      }
      
      // Notify previous assignee if task was completed by someone else
      if (body.status === 'done' && oldTask.status !== 'done') {
        // Get actor name
        let actorName = 'Someone';
        if (session?.user?.id) {
          const actor = await getDb().select({ name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);
          actorName = actor[0]?.name || actor[0]?.email?.split('@')[0] || 'Someone';
        }
        
        // Notify task creator or project owner (if different from actor)
        if (oldTask.assignedToUserId && oldTask.assignedToUserId !== session?.user?.id) {
          const template = NotificationTemplates.taskCompleted(newTask.title, actorName);
          await createNotification({
            userId: oldTask.assignedToUserId,
            ...template,
            type: template.type as any,
            title: template.title!,
            entityType: 'task',
            entityId: id,
            link: `/internal/tasks/${id}`,
            actorUserId: session?.user?.id,
          });
        }
      }
    } catch (notifyError) {
      console.error('Failed to send task notification:', notifyError);
      // Don't fail the request if notification fails
    }
    
    return NextResponse.json({
      success: true,
      data: newTask
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/internal/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = await getDb().delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task', details: error.message },
      { status: 500 }
    );
  }
}
