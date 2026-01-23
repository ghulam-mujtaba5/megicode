import { sql, eq, gte, lte, and, desc } from 'drizzle-orm';

import s from '../../styles.module.css';
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
  invoices,
  payments,
  projects,
} from '@/lib/db/schema';
import FinancialReportsClient from './FinancialReportsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FinancialReportsPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  // Fetch all financial data
  const [
    allExpenses,
    allContributions,
    allDistributions,
    allAccounts,
    allFounders,
    allProjectFinancials,
    allSubscriptions,
    allInvoices,
    allPayments,
    allProjects,
  ] = await Promise.all([
    db.select().from(expenses).orderBy(desc(expenses.expenseDate)),
    db.select().from(founderContributions).orderBy(desc(founderContributions.contributedAt)),
    db.select().from(profitDistributions).orderBy(desc(profitDistributions.createdAt)),
    db.select().from(companyAccounts),
    db.select().from(founders),
    db.select().from(projectFinancials),
    db.select().from(subscriptions),
    db.select().from(invoices),
    db.select().from(payments),
    db.select().from(projects),
  ]);

  // Calculate monthly expense breakdown by category
  const expensesByCategory = allExpenses.reduce((acc, exp) => {
    const category = exp.category || 'misc';
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly expenses for the last 12 months
  const monthlyExpenses: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthExp = allExpenses.filter(exp => {
      const expDate = new Date(exp.expenseDate);
      return expDate >= monthStart && expDate <= monthEnd;
    });
    const total = monthExp.reduce((sum, exp) => sum + exp.amount, 0);
    monthlyExpenses.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: total,
    });
  }

  // Calculate monthly revenue for the last 12 months
  const monthlyRevenue: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthPayments = allPayments.filter(p => {
      if (!p.paidAt) return false;
      const paidDate = new Date(p.paidAt);
      return paidDate >= monthStart && paidDate <= monthEnd && p.status === 'completed';
    });
    const total = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    monthlyRevenue.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: total,
    });
  }

  // Calculate totals
  const totalRevenue = allProjectFinancials.reduce((sum, pf) => sum + (pf.amountReceived || 0), 0);
  const totalPendingRevenue = allProjectFinancials.reduce((sum, pf) => sum + (pf.amountPending || 0), 0);
  const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalContributions = allContributions
    .filter(c => c.status === 'confirmed')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalDistributions = allDistributions
    .filter(d => d.status === 'distributed')
    .reduce((sum, d) => sum + d.distributedAmount, 0);
  const totalCompanyRetention = allDistributions
    .filter(d => d.status === 'distributed')
    .reduce((sum, d) => sum + d.companyRetention, 0);

  // Calculate account balances
  const totalCashBalance = allAccounts
    .filter(a => a.status === 'active')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  // Current month stats
  const currentMonthExpenses = allExpenses
    .filter(exp => new Date(exp.expenseDate) >= startOfMonth)
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  const lastMonthExpenses = allExpenses
    .filter(exp => {
      const expDate = new Date(exp.expenseDate);
      return expDate >= startOfLastMonth && expDate <= endOfLastMonth;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Upcoming subscription payments (next 30 days)
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const upcomingSubscriptions = allSubscriptions
    .filter(sub => {
      if (sub.status !== 'active' || !sub.nextBillingDate) return false;
      const nextDate = new Date(sub.nextBillingDate);
      return nextDate <= thirtyDaysFromNow && nextDate >= now;
    })
    .reduce((sum, sub) => sum + sub.amount, 0);

  // Build report data
  const reportData = {
    // P&L Summary
    profitLoss: {
      totalRevenue,
      totalPendingRevenue,
      totalExpenses,
      grossProfit: totalRevenue - totalExpenses,
      companyRetention: totalCompanyRetention,
      founderDistributions: totalDistributions,
      netProfit: totalRevenue - totalExpenses,
    },
    
    // Balance Sheet
    balanceSheet: {
      assets: {
        cash: totalCashBalance,
        receivables: totalPendingRevenue,
        totalAssets: totalCashBalance + totalPendingRevenue,
      },
      liabilities: {
        upcomingSubscriptions,
        pendingDistributions: allDistributions
          .filter(d => d.status === 'approved' || d.status === 'pending_approval')
          .reduce((sum, d) => sum + d.distributedAmount, 0),
        totalLiabilities: upcomingSubscriptions,
      },
      equity: {
        founderContributions: totalContributions,
        retainedEarnings: totalCompanyRetention,
        totalEquity: totalContributions + totalCompanyRetention,
      },
    },
    
    // Cash Flow
    cashFlow: {
      operatingActivities: {
        revenueReceived: totalRevenue,
        expensesPaid: -totalExpenses,
        netOperating: totalRevenue - totalExpenses,
      },
      financingActivities: {
        founderContributions: totalContributions,
        founderDistributions: -totalDistributions,
        netFinancing: totalContributions - totalDistributions,
      },
      netCashChange: (totalRevenue - totalExpenses) + (totalContributions - totalDistributions),
      endingCash: totalCashBalance,
    },
    
    // Charts Data
    expensesByCategory,
    monthlyExpenses,
    monthlyRevenue,
    
    // Comparison
    comparison: {
      currentMonthExpenses,
      lastMonthExpenses,
      expenseChange: lastMonthExpenses > 0 
        ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
        : 0,
    },
    
    // Founders
    founders: allFounders.map(f => ({
      id: f.id,
      name: f.name,
      sharePercentage: f.profitSharePercentage,
      contributions: allContributions
        .filter(c => c.founderId === f.id && c.status === 'confirmed')
        .reduce((sum, c) => sum + c.amount, 0),
      distributions: allDistributions
        .filter(d => d.status === 'distributed')
        .reduce((sum, d) => sum + Math.round(d.distributedAmount * (f.profitSharePercentage / 100)), 0),
    })),
    
    // Projects
    projectsRevenue: allProjects.map(p => {
      const pf = allProjectFinancials.find(f => f.projectId === p.id);
      return {
        id: p.id,
        name: p.name,
        revenue: pf?.amountReceived || 0,
        pending: pf?.amountPending || 0,
        expenses: pf?.totalExpenses || 0,
        profit: pf?.netProfit || 0,
      };
    }).filter(p => p.revenue > 0 || p.pending > 0),
  };

  return <FinancialReportsClient data={reportData} />;
}
