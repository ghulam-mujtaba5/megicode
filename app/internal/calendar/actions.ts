
'use server';

import { getDb } from '@/lib/db';
import { userAvailability } from '@/lib/db/schema';
import { requireInternalSession } from '@/lib/internal/auth';
import { revalidatePath } from 'next/cache';

export async function addAvailability(formData: FormData) {
  const session = await requireInternalSession();
  const db = getDb();

  const type = formData.get('type') as string;
  const startDateStr = formData.get('startDate') as string;
  const endDateStr = formData.get('endDate') as string;
  const reason = formData.get('reason') as string;

  if (!type || !startDateStr || !endDateStr) return;

  await db.insert(userAvailability).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    type: type as any,
    startDate: new Date(startDateStr),
    endDate: new Date(endDateStr),
    reason: reason || null,
    status: 'approved', // Auto-approve for now
    createdAt: new Date(),
  });

  revalidatePath('/internal/calendar');
}
