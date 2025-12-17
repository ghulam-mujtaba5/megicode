'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { z } from 'zod';
import { logAuditEvent } from '@/lib/audit';

const updateTaskTitleSchema = z.object({
  taskId: z.string(),
  title: z.string().min(1),
});

export async function updateTaskTitle(taskId: string, title: string) {
  const parsed = updateTaskTitleSchema.safeParse({ taskId, title });
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  try {
    const db = getDb();
    const oldTask = await db.select().from(tasks).where(eq(tasks.id, parsed.data.taskId)).get();

    await db
      .update(tasks)
      .set({ title: parsed.data.title, updatedAt: new Date() })
      .where(eq(tasks.id, parsed.data.taskId));

    if (oldTask && oldTask.title !== parsed.data.title) {
      await logAuditEvent('TASK_UPDATED', `task:${taskId}`, {
        changes: { title: { from: oldTask.title, to: parsed.data.title } },
      });
    }

    revalidatePath('/internal/tasks');
    revalidatePath(`/internal/tasks/${taskId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update task title:', error);
    return { error: 'Failed to update task title' };
  }
}
