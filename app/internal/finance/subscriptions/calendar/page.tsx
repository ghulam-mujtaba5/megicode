import { eq, gte, lte, and, asc } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import SubscriptionCalendarClient from './SubscriptionCalendarClient';

export default async function SubscriptionCalendarPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  
  // Fetch all active subscriptions
  const allSubscriptions = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.status, 'active'))
    .orderBy(asc(subscriptions.nextBillingDate));

  return <SubscriptionCalendarClient subscriptions={allSubscriptions} />;
}
