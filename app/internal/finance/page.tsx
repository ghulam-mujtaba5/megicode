import { sql, eq, desc, and, gte } from 'drizzle-orm';

import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import {
  founders,
  companyAccounts,
  expenses,
  profitDistributions,
  projectFinancials,
  founderContributions,
  subscriptions,
} from '@/lib/db/schema';
import FinanceDashboard from './FinanceDashboard';

export default async function FinanceDashboardPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all financial data in parallel
  const [
    foundersList,
    accountsList,
    totalCompanyBalance,
    monthlyExpensesTotal,
    totalExpensesAll,
    expensesList,
    projectsRevenue,
    subscriptionsList,
    contributionsList,
    distributionsList,
  ] = await Promise.all([
    // Founders
    db.select().from(founders).orderBy(desc(founders.createdAt)),
    
    // Company accounts
    db.select().from(companyAccounts).orderBy(desc(companyAccounts.createdAt)),
    
    // Total company central balance
    db.select({
      total: sql<number>`coalesce(sum(${companyAccounts.currentBalance}), 0)`,
    })
    .from(companyAccounts)
    .where(and(
      eq(companyAccounts.status, 'active'),
      eq(companyAccounts.accountType, 'company_central')
    ))
    .get(),
    
    // Monthly expenses
    db.select({
      total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
    })
    .from(expenses)
    .where(gte(expenses.expenseDate, startOfMonth))
    .get(),
    
    // Total expenses all time
    db.select({
      total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
    })
    .from(expenses)
    .get(),
    
    // All expenses (recent first)
    db.select().from(expenses).orderBy(desc(expenses.expenseDate)).limit(100),
    
    // Project revenue summary
    db.select({
      totalRevenue: sql<number>`coalesce(sum(${projectFinancials.amountReceived}), 0)`,
      totalPending: sql<number>`coalesce(sum(${projectFinancials.amountPending}), 0)`,
      totalProfit: sql<number>`coalesce(sum(${projectFinancials.netProfit}), 0)`,
      companyRetention: sql<number>`coalesce(sum(${projectFinancials.companyRetention}), 0)`,
    })
    .from(projectFinancials)
    .get(),
    
    // Subscriptions
    db.select().from(subscriptions).orderBy(subscriptions.nextBillingDate),
    
    // Founder contributions
    db.select().from(founderContributions).orderBy(desc(founderContributions.contributedAt)).limit(50),
    
    // Profit distributions
    db.select().from(profitDistributions).orderBy(desc(profitDistributions.createdAt)).limit(20),
  ]);

  // Get contribution totals per founder
  const contributionTotals = await db
    .select({
      founderId: founderContributions.founderId,
      total: sql<number>`coalesce(sum(${founderContributions.amount}), 0)`,
    })
    .from(founderContributions)
    .where(eq(founderContributions.status, 'confirmed'))
    .groupBy(founderContributions.founderId);

  const contributionMap = new Map(contributionTotals.map(c => [c.founderId, c.total]));

  // Enhance founders with totals
  const foundersWithTotals = foundersList.map(f => ({
    ...f,
    totalContributions: contributionMap.get(f.id) || 0,
    totalDistributions: 0,
  }));

  const initialData = {
    founders: foundersWithTotals,
    accounts: accountsList,
    expenses: expensesList,
    subscriptions: subscriptionsList,
    distributions: distributionsList,
    contributions: contributionsList,
    totals: {
      companyBalance: totalCompanyBalance?.total || 0,
      totalRevenue: projectsRevenue?.totalRevenue || 0,
      totalExpenses: totalExpensesAll?.total || 0,
      totalProfit: projectsRevenue?.totalProfit || 0,
      monthlyExpenses: monthlyExpensesTotal?.total || 0,
    },
  };

  return <FinanceDashboard initialData={initialData} />;
}
