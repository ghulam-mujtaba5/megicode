import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { expenses, companyAccounts } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';

// PUT - Update an expense
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
    
    // Get the original expense to check for amount/account changes
    const [originalExpense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id));
    
    if (!originalExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    // Handle balance adjustments if amount or account changed
    if (!body.paidByFounderId && body.paidFromAccountId) {
      // If original was from an account, restore that balance
      if (originalExpense.paidFromAccountId && !originalExpense.paidByFounderId) {
        await db
          .update(companyAccounts)
          .set({
            currentBalance: sql`${companyAccounts.currentBalance} + ${originalExpense.amount}`,
            updatedAt: now,
          })
          .where(eq(companyAccounts.id, originalExpense.paidFromAccountId));
      }
      
      // Deduct from new account
      await db
        .update(companyAccounts)
        .set({
          currentBalance: sql`${companyAccounts.currentBalance} - ${body.amount}`,
          updatedAt: now,
        })
        .where(eq(companyAccounts.id, body.paidFromAccountId));
    }
    
    await db
      .update(expenses)
      .set({
        title: body.title,
        description: body.description || null,
        category: body.category,
        amount: body.amount,
        currency: body.currency,
        expenseDate: body.expenseDate ? new Date(body.expenseDate) : undefined,
        projectId: body.projectId || null,
        productName: body.productName || null,
        paidFromAccountId: body.paidFromAccountId || null,
        paidByFounderId: body.paidByFounderId || null,
        vendor: body.vendor || null,
        receiptUrl: body.receiptUrl || null,
        isRecurring: body.isRecurring || false,
        recurringInterval: body.recurringInterval || null,
        nextDueAt: body.nextDueAt ? new Date(body.nextDueAt) : null,
        status: body.status,
        updatedAt: now,
      })
      .where(eq(expenses.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// DELETE - Remove an expense and restore account balance
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { id } = await params;
    
    // Get the expense to restore balance if needed
    const [expense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id));
    
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    // Restore account balance if it was paid from an account
    if (expense.paidFromAccountId && !expense.paidByFounderId) {
      await db
        .update(companyAccounts)
        .set({
          currentBalance: sql`${companyAccounts.currentBalance} + ${expense.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(companyAccounts.id, expense.paidFromAccountId));
    }
    
    // Soft delete by setting status to rejected
    await db
      .update(expenses)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(expenses.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
