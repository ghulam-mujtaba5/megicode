import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { 
  profitDistributions, 
  founderDistributionItems, 
  founders, 
  companyAccounts,
  financialTransactions
} from '@/lib/db/schema';
import type { ProfitDistribution, FounderDistributionItem } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Get a single distribution with items
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { id } = await params;
    
    const [distribution] = await db
      .select()
      .from(profitDistributions)
      .where(eq(profitDistributions.id, id));
    
    if (!distribution) {
      return NextResponse.json({ error: 'Distribution not found' }, { status: 404 });
    }
    
    // Get distribution items with founder info
    const items = await db
      .select({
        id: founderDistributionItems.id,
        founderId: founderDistributionItems.founderId,
        founderName: founders.name,
        grossAmount: founderDistributionItems.grossAmount,
        deductions: founderDistributionItems.deductions,
        netAmount: founderDistributionItems.netAmount,
        toAccountId: founderDistributionItems.toAccountId,
        status: founderDistributionItems.status,
      })
      .from(founderDistributionItems)
      .leftJoin(founders, eq(founderDistributionItems.founderId, founders.id))
      .where(eq(founderDistributionItems.distributionId, id));
    
    return NextResponse.json({ distribution, items });
  } catch (error) {
    console.error('Failed to fetch distribution:', error);
    return NextResponse.json({ error: 'Failed to fetch distribution' }, { status: 500 });
  }
}

// PUT - Update distribution or process payment
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
    
    // If processing individual founder payment
    if (body.action === 'pay_founder') {
      const { founderId, toAccountId, sourceAccountId } = body;
      
      // Get the distribution item
      const [item] = await db
        .select()
        .from(founderDistributionItems)
        .where(
          sql`${founderDistributionItems.distributionId} = ${id} AND ${founderDistributionItems.founderId} = ${founderId}`
        );
      
      if (!item) {
        return NextResponse.json({ error: 'Distribution item not found' }, { status: 404 });
      }
      
      const paymentAmount = item.netAmount;
      
      // Update the target account balance (founder's account)
      if (toAccountId) {
        await db
          .update(companyAccounts)
          .set({
            currentBalance: sql`${companyAccounts.currentBalance} + ${paymentAmount}`,
            updatedAt: now,
          })
          .where(eq(companyAccounts.id, toAccountId));
      }
      
      // Deduct from source account if specified
      if (sourceAccountId) {
        await db
          .update(companyAccounts)
          .set({
            currentBalance: sql`${companyAccounts.currentBalance} - ${paymentAmount}`,
            updatedAt: now,
          })
          .where(eq(companyAccounts.id, sourceAccountId));
      }
      
      // Mark item as transferred and record account
      await db
        .update(founderDistributionItems)
        .set({
          status: 'transferred',
          toAccountId: toAccountId,
        })
        .where(eq(founderDistributionItems.id, item.id));
      
      // Record transaction - we need accountId and balanceAfter
      // First, get current account balance
      if (toAccountId) {
        const [targetAccount] = await db
          .select()
          .from(companyAccounts)
          .where(eq(companyAccounts.id, toAccountId));
        
        if (targetAccount) {
          await db.insert(financialTransactions).values({
            id: nanoid(),
            transactionType: 'distribution',
            accountId: toAccountId,
            amount: paymentAmount, // Credit (positive)
            balanceAfter: targetAccount.currentBalance,
            currency: 'PKR',
            description: `Profit distribution to founder`,
            distributionId: id,
            transactionDate: now,
            createdAt: now,
          });
        }
      }
      
      // Check if all items are transferred, update distribution status
      const [pendingCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(founderDistributionItems)
        .where(
          sql`${founderDistributionItems.distributionId} = ${id} AND ${founderDistributionItems.status} = 'pending'`
        );
      
      if (pendingCount.count === 0) {
        await db
          .update(profitDistributions)
          .set({ status: 'distributed', distributedAt: now, updatedAt: now })
          .where(eq(profitDistributions.id, id));
      } else {
        // Some still pending - mark as approved (in progress)
        await db
          .update(profitDistributions)
          .set({ status: 'approved', updatedAt: now })
          .where(eq(profitDistributions.id, id));
      }
      
      return NextResponse.json({ success: true, action: 'founder_paid' });
    }
    
    // Regular update - only update allowed fields
    const updateData: Partial<ProfitDistribution> = {
      updatedAt: now,
    };
    
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.status !== undefined) updateData.status = body.status;
    
    await db
      .update(profitDistributions)
      .set(updateData)
      .where(eq(profitDistributions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update distribution:', error);
    return NextResponse.json({ error: 'Failed to update distribution' }, { status: 500 });
  }
}

// DELETE - Cancel a distribution (only if not processed)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    
    // Check if any payments have been made
    const [paidCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(founderDistributionItems)
      .where(
        sql`${founderDistributionItems.distributionId} = ${id} AND ${founderDistributionItems.status} = 'paid'`
      );
    
    if (paidCount.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete distribution with processed payments' 
      }, { status: 400 });
    }
    
    // Delete items first
    await db
      .delete(founderDistributionItems)
      .where(eq(founderDistributionItems.distributionId, id));
    
    // Delete distribution
    await db
      .delete(profitDistributions)
      .where(eq(profitDistributions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete distribution:', error);
    return NextResponse.json({ error: 'Failed to delete distribution' }, { status: 500 });
  }
}
