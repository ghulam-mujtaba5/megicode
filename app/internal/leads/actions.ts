'use server';

import { getDb } from '@/lib/db';
import { leads, events } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  // Validate status
  const validStatuses = ['new', 'in_review', 'approved', 'rejected', 'converted'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status');
  }

  await db.update(leads)
    .set({ 
      status: newStatus as any, 
      updatedAt: new Date() 
    })
    .where(eq(leads.id, leadId));

  await db.insert(events).values({
    id: crypto.randomUUID(),
    leadId,
    type: 'lead.status_changed',
    actorUserId: session.user.id ?? null,
    payloadJson: { newStatus, source: 'pipeline_board' },
    createdAt: new Date(),
  });

  revalidatePath('/internal/leads');
  revalidatePath('/internal/leads/pipeline');
  revalidatePath(`/internal/leads/${leadId}`);
}
