import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { auditEvents } from '@/lib/db/schema';

export async function logAuditEvent(
  action: string,
  target: string,
  payload?: Record<string, any>
) {
  try {
    const session = await getServerSession(authOptions);
    const actorUserId = session?.user?.id;

    if (!actorUserId) {
      console.warn('Audit log attempted without authenticated user');
      return;
    }

    await db.insert(auditEvents).values({
      id: randomUUID(),
      actorUserId,
      action,
      target,
      payloadJson: payload ?? null, // Pass object directly, Drizzle handles JSON
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // We don't throw here to avoid breaking the main action
  }
}
