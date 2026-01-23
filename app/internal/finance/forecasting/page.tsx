import { getDb } from '@/lib/db';
import { companyAccounts, subscriptions, expenses, founders, founderContributions, founderDistributionItems, invoices } from '@/lib/db/schema';
import { eq, gte, sql, desc } from 'drizzle-orm';
import ForecastingClient from './ForecastingClient';

export const metadata = {
  title: 'Balance Forecasting | Internal Portal',
  description: 'Predict future account balances based on recurring transactions',
};

export default async function ForecastingPage() {
  let accounts = [];
  let activeSubscriptions = [];
  let pendingInvoices = [];
  let forecastData = {
    monthlySubscriptionCost: 0,
    monthlyExpenseAvg: 0,
    monthlyContributionAvg: 0,
    monthlyDistributionAvg: 0,
    expectedIncome: 0,
    categoryAverages: {} as Record<string, number>,
  };
  let error: string | null = null;

  try {
    const db = getDb();
    
    // Fetch all active accounts
    accounts = await db.select().from(companyAccounts)
      .where(eq(companyAccounts.status, 'active'));

    // Fetch active subscriptions for recurring outflows
    activeSubscriptions = await db.select().from(subscriptions)
      .where(eq(subscriptions.status, 'active'));

    // Fetch recent expenses to calculate average spending patterns (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentExpenses = await db.select({
      category: expenses.category,
      amount: expenses.amount,
      expenseDate: expenses.expenseDate,
      isRecurring: expenses.isRecurring,
      recurringInterval: expenses.recurringInterval,
    }).from(expenses)
      .where(gte(expenses.expenseDate, sixMonthsAgo));

    // Fetch founders for contribution/distribution patterns
    const foundersList = await db.select({
      id: founders.id,
      name: founders.name,
      profitSharePercentage: founders.profitSharePercentage,
    }).from(founders)
      .where(eq(founders.status, 'active'));

    // Fetch recent contributions (last 6 months)
    const recentContributions = await db.select().from(founderContributions)
      .where(gte(founderContributions.contributedAt, sixMonthsAgo));

    // Fetch recent distributions (last 6 months)
    const recentDistributions = await db.select().from(founderDistributionItems)
      .where(eq(founderDistributionItems.status, 'transferred'));

    // Fetch pending/expected invoices
    pendingInvoices = await db.select({
      id: invoices.id,
      projectId: invoices.projectId,
      invoiceNumber: invoices.invoiceNumber,
      totalAmount: invoices.totalAmount,
      currency: invoices.currency,
      dueAt: invoices.dueAt,
      status: invoices.status,
    }).from(invoices)
      .where(eq(invoices.status, 'sent'))
      .orderBy(invoices.dueAt);

    // Calculate monthly expense averages by category
    const categoryAverages = recentExpenses.reduce((acc, exp) => {
      const cat = exp.category || 'misc';
      if (!acc[cat]) {
        acc[cat] = { total: 0, count: 0 };
      }
      acc[cat].total += exp.amount || 0;
      acc[cat].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // Calculate monthly averages
    const monthlyExpenseAvg = Object.entries(categoryAverages).reduce((sum, [_, data]) => {
      return sum + (data.total / 6); // Average per month over 6 months
    }, 0);

    // Calculate recurring subscription costs by period
    const monthlySubscriptionCost = activeSubscriptions.reduce((sum, sub) => {
      switch (sub.billingCycle) {
        case 'monthly': return sum + sub.amount;
        case 'quarterly': return sum + (sub.amount / 3);
        case 'yearly': return sum + (sub.amount / 12);
        default: return sum;
      }
    }, 0);

    // Calculate contribution and distribution averages
    const monthlyContributionAvg = recentContributions.reduce((sum, c) => sum + (c.amount || 0), 0) / 6;
    const monthlyDistributionAvg = recentDistributions.reduce((sum, d) => sum + (d.netAmount || 0), 0) / 6;

    // Expected income from pending invoices
    const expectedIncome = pendingInvoices.reduce((sum, inv) => {
      return sum + (inv.totalAmount || 0);
    }, 0);

    forecastData = {
      monthlySubscriptionCost,
      monthlyExpenseAvg,
      monthlyContributionAvg,
      monthlyDistributionAvg,
      expectedIncome,
      categoryAverages: Object.fromEntries(
        Object.entries(categoryAverages).map(([k, v]) => [k, v.total / 6])
      ),
    };
  } catch (err: any) {
    // Handle missing tables during build - data will be fetched on client
    if (err?.message?.includes('no such table')) {
      error = 'Database tables not yet initialized. Data will load on client.';
    } else {
      throw err;
    }
  }

  return (
    <ForecastingClient
      accounts={accounts.map(a => ({
        id: a.id,
        name: a.name,
        type: a.accountType,
        balance: a.currentBalance,
        currency: a.currency,
        isActive: a.status === 'active',
      }))}
      subscriptions={activeSubscriptions.map(s => ({
        id: s.id,
        name: s.name,
        amount: s.amount,
        currency: s.currency,
        billingCycle: s.billingCycle as 'monthly' | 'quarterly' | 'yearly' | 'one_time',
        nextBillingDate: s.nextBillingDate ? new Date(s.nextBillingDate).toISOString() : null,
        category: s.category,
      }))}
      forecastData={forecastData}
      pendingInvoices={pendingInvoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber || '',
        amount: inv.totalAmount || 0,
        dueDate: inv.dueAt ? new Date(inv.dueAt).toISOString() : null,
        currency: inv.currency,
      }))}
      initialError={error}
    />
  );
}
