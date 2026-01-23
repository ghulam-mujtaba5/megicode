import { NextResponse } from 'next/server';
import { eq, desc, sql, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { expenses, companyAccounts, founders } from '@/lib/db/schema';
import type { ExpenseCategory, ExpenseStatus } from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import { nanoid } from 'nanoid';

// GET - Fetch all expenses with filters
export async function GET(request: Request) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') as ExpenseCategory | null;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status') as ExpenseStatus | null;
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Build dynamic conditions
    const conditions = [];
    
    if (category) {
      conditions.push(eq(expenses.category, category));
    }
    if (projectId) {
      conditions.push(eq(expenses.projectId, projectId));
    }
    if (status) {
      conditions.push(eq(expenses.status, status));
    }
    
    // Query with joins
    const expensesList = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        description: expenses.description,
        category: expenses.category,
        amount: expenses.amount,
        currency: expenses.currency,
        expenseDate: expenses.expenseDate,
        projectId: expenses.projectId,
        productName: expenses.productName,
        paidFromAccountId: expenses.paidFromAccountId,
        accountName: companyAccounts.name,
        paidByFounderId: expenses.paidByFounderId,
        payerName: founders.name,
        vendor: expenses.vendor,
        receiptUrl: expenses.receiptUrl,
        isRecurring: expenses.isRecurring,
        recurringInterval: expenses.recurringInterval,
        nextDueAt: expenses.nextDueAt,
        status: expenses.status,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .leftJoin(companyAccounts, eq(expenses.paidFromAccountId, companyAccounts.id))
      .leftJoin(founders, eq(expenses.paidByFounderId, founders.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(expenses.expenseDate))
      .limit(limit);
    
    // Get summary stats
    const [summary] = await db
      .select({
        totalExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
        expenseCount: sql<number>`COUNT(*)`,
        pendingReimbursement: sql<number>`COALESCE(SUM(CASE WHEN ${expenses.paidByFounderId} IS NOT NULL AND ${expenses.status} = 'approved' THEN ${expenses.amount} ELSE 0 END), 0)`,
      })
      .from(expenses)
      .where(eq(expenses.status, 'approved'));
    
    return NextResponse.json({
      expenses: expensesList,
      summary,
    });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST - Create a new expense
export async function POST(request: Request) {
  try {
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const body = await request.json();
    
    const now = new Date();
    const expenseId = nanoid();
    
    // If paying from an account, check and update balance
    if (body.paidFromAccountId && !body.paidByFounderId) {
      const [account] = await db
        .select({ currentBalance: companyAccounts.currentBalance })
        .from(companyAccounts)
        .where(eq(companyAccounts.id, body.paidFromAccountId));
      
      if (account) {
        const newBalance = account.currentBalance - body.amount;
        await db
          .update(companyAccounts)
          .set({
            currentBalance: newBalance,
            updatedAt: now,
          })
          .where(eq(companyAccounts.id, body.paidFromAccountId));
      }
    }
    
    await db.insert(expenses).values({
      id: expenseId,
      title: body.title,
      description: body.description || null,
      category: body.category,
      amount: body.amount,
      currency: body.currency || 'PKR',
      expenseDate: body.expenseDate ? new Date(body.expenseDate) : now,
      projectId: body.projectId || null,
      productName: body.productName || null,
      paidFromAccountId: body.paidFromAccountId || null,
      paidByFounderId: body.paidByFounderId || null,
      vendor: body.vendor || null,
      receiptUrl: body.receiptUrl || null,
      isRecurring: body.isRecurring || false,
      recurringInterval: body.recurringInterval || null,
      nextDueAt: body.nextDueAt ? new Date(body.nextDueAt) : null,
      status: body.status || 'paid',
      createdByUserId: body.createdByUserId || null,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json({ success: true, id: expenseId });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
