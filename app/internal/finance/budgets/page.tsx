import { getDb } from '@/lib/db';
import { budgets, budgetCategories, expenses } from '@/lib/db/schema';
import { eq, desc, gte, lte, and, sql } from 'drizzle-orm';
import BudgetsClient from './BudgetsClient';

export const metadata = {
  title: 'Budget Management | Internal Portal',
  description: 'Create and manage budgets with category allocations',
};

export default async function BudgetsPage() {
  let budgetWithCategories = [];
  let categoryOptions: string[] = [];
  let activeBudgetId: string | null = null;
  let error: string | null = null;

  try {
    const db = getDb();
    
    // Fetch all budgets
    const allBudgets = await db.select().from(budgets)
      .orderBy(desc(budgets.periodStart));

    // Fetch all budget categories
    const categories = await db.select().from(budgetCategories);

    // Get current active budget
    const today = new Date();
    const activeBudget = allBudgets.find(b => 
      b.periodStart <= today && b.periodEnd >= today && b.status === 'active'
    );

    // Fetch actual spending for active budget period
    let actualSpending: Record<string, number> = {};
    
    if (activeBudget) {
      const periodExpenses = await db.select({
        category: expenses.category,
        total: sql<number>`SUM(${expenses.amount})`,
      })
        .from(expenses)
        .where(and(
          gte(expenses.expenseDate, activeBudget.periodStart),
          lte(expenses.expenseDate, activeBudget.periodEnd)
        ))
        .groupBy(expenses.category);

      actualSpending = Object.fromEntries(
        periodExpenses.map(e => [e.category || 'misc', e.total || 0])
      );
    }

    // Build budget with category spending data
    budgetWithCategories = allBudgets.map(budget => {
      const budgetCats = categories.filter(c => c.budgetId === budget.id);
      const isActiveBudget = budget.id === activeBudget?.id;
      
      return {
        id: budget.id,
        name: budget.name,
        period: budget.periodType,
        startDate: budget.periodStart ? new Date(budget.periodStart).toISOString().split('T')[0] : '',
        endDate: budget.periodEnd ? new Date(budget.periodEnd).toISOString().split('T')[0] : '',
        totalBudget: budget.totalBudget,
        currency: budget.currency,
        status: budget.status,
        notes: budget.notes,
        createdAt: budget.createdAt,
        categories: budgetCats.map(cat => ({
          ...cat,
          actualSpending: isActiveBudget ? (actualSpending[cat.category || 'misc'] || 0) : 0,
          percentUsed: cat.allocatedAmount > 0 
            ? ((isActiveBudget ? actualSpending[cat.category || 'misc'] || 0 : 0) / cat.allocatedAmount) * 100 
            : 0,
        })),
        totalAllocated: budgetCats.reduce((sum, c) => sum + c.allocatedAmount, 0),
        totalSpent: isActiveBudget 
          ? Object.values(actualSpending).reduce((sum, v) => sum + v, 0) 
          : 0,
      };
    });

    activeBudgetId = allBudgets.find(b => 
      b.periodStart <= new Date() && b.periodEnd >= new Date() && b.status === 'active'
    )?.id || null;

    // Calculate category options from past expenses
    const expenseCategories = await db.select({
      category: expenses.category,
    })
      .from(expenses)
      .groupBy(expenses.category);

    categoryOptions = [...new Set(expenseCategories.map(e => e.category || 'misc'))];
  } catch (err: any) {
    // Handle missing tables during build - data will be fetched on client
    if (err?.message?.includes('no such table')) {
      error = 'Database tables not yet initialized. Data will load on client.';
      categoryOptions = ['domain', 'hosting', 'software_subscription', 'hardware', 'marketing', 'legal', 'office', 'travel', 'utilities', 'contractor', 'product_development', 'project_cost', 'misc'];
    } else {
      throw err;
    }
  }

  return (
    <BudgetsClient 
      budgets={budgetWithCategories}
      categoryOptions={categoryOptions}
      activeBudgetId={activeBudgetId}
      initialError={error}
    />
  );
}
