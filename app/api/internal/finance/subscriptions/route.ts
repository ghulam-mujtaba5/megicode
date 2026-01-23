import { NextResponse } from 'next/server';
import { eq, sql, lte, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import type { Subscription } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Fetch all subscriptions
export async function GET(request: Request) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') as Subscription['status'] | null;
    const upcoming = searchParams.get('upcoming'); // Get subscriptions due soon
    
    const conditions = [];
    
    if (status) {
      conditions.push(eq(subscriptions.status, status));
    }
    
    if (upcoming) {
      const daysAhead = parseInt(upcoming) || 30;
      const futureDate = new Date(Date.now() + (daysAhead * 24 * 60 * 60 * 1000));
      conditions.push(lte(subscriptions.nextBillingDate, futureDate));
      conditions.push(eq(subscriptions.status, 'active'));
    }
    
    const subs = await db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        provider: subscriptions.provider,
        description: subscriptions.description,
        category: subscriptions.category,
        amount: subscriptions.amount,
        currency: subscriptions.currency,
        billingCycle: subscriptions.billingCycle,
        startDate: subscriptions.startDate,
        nextBillingDate: subscriptions.nextBillingDate,
        endDate: subscriptions.endDate,
        autoRenew: subscriptions.autoRenew,
        status: subscriptions.status,
        loginUrl: subscriptions.loginUrl,
        accountEmail: subscriptions.accountEmail,
        notes: subscriptions.notes,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
      })
      .from(subscriptions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(subscriptions.nextBillingDate);
    
    // Get summary
    const [summary] = await db
      .select({
        totalMonthly: sql<number>`COALESCE(SUM(CASE WHEN ${subscriptions.billingCycle} = 'monthly' AND ${subscriptions.status} = 'active' THEN ${subscriptions.amount} ELSE 0 END), 0)`,
        totalYearly: sql<number>`COALESCE(SUM(CASE WHEN ${subscriptions.billingCycle} = 'yearly' AND ${subscriptions.status} = 'active' THEN ${subscriptions.amount} ELSE 0 END), 0)`,
        activeCount: sql<number>`SUM(CASE WHEN ${subscriptions.status} = 'active' THEN 1 ELSE 0 END)`,
      })
      .from(subscriptions);
    
    return NextResponse.json({ 
      subscriptions: subs,
      summary: {
        ...summary,
        // Calculate monthly equivalent
        monthlyEquivalent: (summary?.totalMonthly || 0) + Math.round((summary?.totalYearly || 0) / 12),
      }
    });
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

// POST - Create a new subscription
export async function POST(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    const subscriptionId = nanoid();
    
    await db.insert(subscriptions).values({
      id: subscriptionId,
      name: body.name,
      provider: body.provider,
      description: body.description || null,
      category: body.category,
      amount: body.amount,
      currency: body.currency || 'PKR',
      billingCycle: body.billingCycle,
      startDate: body.startDate ? new Date(body.startDate) : now,
      nextBillingDate: body.nextBillingDate ? new Date(body.nextBillingDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      autoRenew: body.autoRenew ?? true,
      status: 'active',
      loginUrl: body.loginUrl || null,
      accountEmail: body.accountEmail || null,
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json({ success: true, id: subscriptionId });
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
