import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { subscriptions, companyAccounts, expenses } from '@/lib/db/schema';
import type { Expense, Subscription } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Get a single subscription
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { id } = await params;
    
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// PUT - Update a subscription or process renewal
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const now = new Date();
    
    // If processing a renewal/payment
    if (body.action === 'process_payment') {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));
      
      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      
      // Create expense record for the payment
      const expenseId = nanoid();
      await db.insert(expenses).values({
        id: expenseId,
        category: subscription.category,
        title: `${subscription.name} - ${subscription.billingCycle} renewal`,
        description: `Subscription payment for ${subscription.provider}`,
        amount: subscription.amount,
        currency: subscription.currency,
        expenseDate: now,
        paidByFounderId: body.paidByFounderId || null,
        paidFromAccountId: body.paidFromAccountId || null,
        vendor: subscription.provider,
        receiptUrl: body.receiptUrl || null,
        isRecurring: true,
        recurringInterval: subscription.billingCycle as Expense['recurringInterval'],
        status: 'paid',
        createdByUserId: body.createdByUserId || null,
        createdAt: now,
        updatedAt: now,
      });
      
      // Deduct from account if specified
      if (body.paidFromAccountId) {
        await db
          .update(companyAccounts)
          .set({
            currentBalance: sql`${companyAccounts.currentBalance} - ${subscription.amount}`,
            updatedAt: now,
          })
          .where(eq(companyAccounts.id, body.paidFromAccountId));
      }
      
      // Calculate next billing date
      let nextBillingDate: Date;
      const currentDate = new Date(subscription.nextBillingDate || now);
      
      switch (subscription.billingCycle) {
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'quarterly':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          currentDate.setMonth(currentDate.getMonth() + 1);
      }
      nextBillingDate = currentDate;
      
      // Update subscription
      await db
        .update(subscriptions)
        .set({
          nextBillingDate: nextBillingDate,
          updatedAt: now,
        })
        .where(eq(subscriptions.id, id));
      
      return NextResponse.json({ 
        success: true, 
        expenseId,
        nextBillingDate: nextBillingDate.toISOString(),
      });
    }
    
    // Regular update
    const updateData: Partial<Subscription> = {
      updatedAt: now,
    };
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.provider !== undefined) updateData.provider = body.provider;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.billingCycle !== undefined) updateData.billingCycle = body.billingCycle;
    if (body.nextBillingDate !== undefined) updateData.nextBillingDate = new Date(body.nextBillingDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.autoRenew !== undefined) updateData.autoRenew = body.autoRenew;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.loginUrl !== undefined) updateData.loginUrl = body.loginUrl;
    if (body.accountEmail !== undefined) updateData.accountEmail = body.accountEmail;
    if (body.notes !== undefined) updateData.notes = body.notes;
    
    await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE - Cancel a subscription
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    
    // Soft delete by setting status to cancelled
    await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled', 
        updatedAt: new Date() 
      })
      .where(eq(subscriptions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
