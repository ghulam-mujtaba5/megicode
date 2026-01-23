import Link from 'next/link';
import { sql, eq, desc, and, gte, lte } from 'drizzle-orm';

import s from '../styles.module.css';
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

const Icons = {
  finance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  expense: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  distribution: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  project: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  subscription: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  trendUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

function formatDate(date: Date | number | null) {
  if (!date) return '-';
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function FinanceDashboardPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  const now = new Date();
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all financial data in parallel
  const [
    foundersList,
    accountsList,
    totalCompanyBalance,
    monthlyExpenses,
    totalExpenses,
    recentExpenses,
    projectsRevenue,
    upcomingSubscriptions,
    contributionsList,
  ] = await Promise.all([
    // Founders
    db.select().from(founders).where(eq(founders.status, 'active')),
    
    // Company accounts
    db.select().from(companyAccounts).where(eq(companyAccounts.status, 'active')),
    
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
    
    // Recent expenses
    db.select().from(expenses).orderBy(desc(expenses.expenseDate)).limit(5),
    
    // Project revenue summary
    db.select({
      totalRevenue: sql<number>`coalesce(sum(${projectFinancials.amountReceived}), 0)`,
      totalPending: sql<number>`coalesce(sum(${projectFinancials.amountPending}), 0)`,
      totalProfit: sql<number>`coalesce(sum(${projectFinancials.netProfit}), 0)`,
      companyRetention: sql<number>`coalesce(sum(${projectFinancials.companyRetention}), 0)`,
    })
    .from(projectFinancials)
    .get(),
    
    // Upcoming subscription payments (next 30 days)
    db.select().from(subscriptions)
    .where(and(
      eq(subscriptions.status, 'active'),
      lte(subscriptions.nextBillingDate, thirtyDaysFromNow)
    ))
    .orderBy(subscriptions.nextBillingDate)
    .limit(5),
    
    // Founder contributions
    db.select({
      founderId: founderContributions.founderId,
      total: sql<number>`coalesce(sum(${founderContributions.amount}), 0)`,
    })
    .from(founderContributions)
    .where(eq(founderContributions.status, 'confirmed'))
    .groupBy(founderContributions.founderId),
  ]);

  // Calculate founder contribution map
  const founderContributionMap = new Map(contributionsList.map(c => [c.founderId, c.total]));

  // Calculate if company account needs funds
  const companyBalance = totalCompanyBalance?.total || 0;
  const monthlyExpenseAmount = monthlyExpenses?.total || 0;
  const needsFunding = companyBalance < monthlyExpenseAmount * 2; // Less than 2 months runway

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>
              {Icons.finance} Financial Management
            </h1>
            <p className={s.pageSubtitle}>
              Complete overview of Megicode&apos;s finances, accounts, expenses, and profit distribution.
            </p>
          </div>
          <div className={s.pageActions}>
            <Link href="/internal/finance/expenses/new" className={`${s.btn} ${s.btnPrimary}`}>
              {Icons.plus} Add Expense
            </Link>
            <Link href="/internal/finance/transfers/new" className={`${s.btn} ${s.btnSecondary}`}>
              {Icons.arrowRight} Transfer Funds
            </Link>
          </div>
        </div>

        {/* Low Balance Alert */}
        {needsFunding && companyBalance > 0 && (
          <div className={s.alertBanner} style={{ 
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--int-radius-lg)',
            padding: 'var(--int-space-4) var(--int-space-6)',
            marginBottom: 'var(--int-space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--int-space-3)',
          }}>
            <span style={{ color: 'var(--int-danger)' }}>{Icons.alert}</span>
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--int-danger)' }}>Low Company Balance</strong>
              <p style={{ margin: 0, fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                Company central account has less than 2 months of runway. Consider adding funds.
              </p>
            </div>
            <Link href="/internal/finance/contributions/new" className={`${s.btn} ${s.btnDanger}`}>
              Add Funds
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <section className={s.grid4} style={{ marginBottom: 'var(--int-space-8)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-primary)', marginBottom: 'var(--int-space-2)' }}>{Icons.wallet}</div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: 'var(--int-text)' }}>
                {formatMoney(companyBalance)}
              </div>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>Company Balance</div>
            </div>
          </div>
          
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-success)', marginBottom: 'var(--int-space-2)' }}>{Icons.trendUp}</div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: 'var(--int-text)' }}>
                {formatMoney(projectsRevenue?.totalRevenue || 0)}
              </div>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>Total Revenue</div>
            </div>
          </div>
          
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-danger)', marginBottom: 'var(--int-space-2)' }}>{Icons.trendDown}</div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: 'var(--int-text)' }}>
                {formatMoney(totalExpenses?.total || 0)}
              </div>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>Total Expenses</div>
            </div>
          </div>
          
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-info)', marginBottom: 'var(--int-space-2)' }}>{Icons.distribution}</div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: 'var(--int-text)' }}>
                {formatMoney(projectsRevenue?.totalProfit || 0)}
              </div>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>Net Profit</div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--int-space-6)' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
            {/* Founders */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>{Icons.users} Founders</h2>
                <Link href="/internal/finance/founders" className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
                  Manage {Icons.arrowRight}
                </Link>
              </div>
              <div className={s.cardBody} style={{ padding: 0 }}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Share %</th>
                      <th>Contributions</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--int-text-muted)' }}>
                          No founders added yet. <Link href="/internal/finance/founders/new">Add founders</Link>
                        </td>
                      </tr>
                    ) : (
                      foundersList.map((founder) => (
                        <tr key={founder.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{founder.name}</div>
                            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{founder.email}</div>
                          </td>
                          <td>
                            <span className={s.badge} style={{ background: 'var(--int-primary-light)', color: 'var(--int-primary)' }}>
                              {founder.profitSharePercentage}%
                            </span>
                          </td>
                          <td>{formatMoney(founderContributionMap.get(founder.id) || 0)}</td>
                          <td>
                            <span className={`${s.badge} ${s.badgeSuccess}`}>Active</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Company Accounts */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>{Icons.wallet} Accounts</h2>
                <Link href="/internal/finance/accounts" className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
                  Manage {Icons.arrowRight}
                </Link>
              </div>
              <div className={s.cardBody} style={{ padding: 0 }}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Bank/Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--int-text-muted)' }}>
                          No accounts added yet. <Link href="/internal/finance/accounts/new">Add account</Link>
                        </td>
                      </tr>
                    ) : (
                      accountsList.map((account) => (
                        <tr key={account.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{account.name}</div>
                            {account.accountNumber && (
                              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                                ****{account.accountNumber}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={s.badge} style={{ 
                              background: account.accountType === 'company_central' ? 'var(--int-primary-light)' : 'var(--int-surface-elevated)',
                              color: account.accountType === 'company_central' ? 'var(--int-primary)' : 'var(--int-text-muted)'
                            }}>
                              {account.accountType.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: account.currentBalance >= 0 ? 'var(--int-success)' : 'var(--int-danger)' }}>
                            {formatMoney(account.currentBalance, account.currency)}
                          </td>
                          <td style={{ color: 'var(--int-text-muted)' }}>
                            {account.bankName || account.walletProvider || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>{Icons.expense} Recent Expenses</h2>
                <Link href="/internal/finance/expenses" className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
                  View All {Icons.arrowRight}
                </Link>
              </div>
              <div className={s.cardBody} style={{ padding: 0 }}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Expense</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--int-text-muted)' }}>
                          No expenses recorded yet.
                        </td>
                      </tr>
                    ) : (
                      recentExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{expense.title}</div>
                            {expense.vendor && (
                              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                                {expense.vendor}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={s.badge}>{expense.category.replace('_', ' ')}</span>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--int-danger)' }}>
                            -{formatMoney(expense.amount, expense.currency)}
                          </td>
                          <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                            {formatDate(expense.expenseDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
            {/* Quick Actions */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>Quick Actions</h2>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                  <Link href="/internal/finance/expenses/new" className={`${s.btn} ${s.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
                    {Icons.expense} Record Expense
                  </Link>
                  <Link href="/internal/finance/contributions/new" className={`${s.btn} ${s.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
                    {Icons.plus} Add Contribution
                  </Link>
                  <Link href="/internal/finance/distributions/new" className={`${s.btn} ${s.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
                    {Icons.distribution} Distribute Profit
                  </Link>
                  <Link href="/internal/finance/subscriptions" className={`${s.btn} ${s.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
                    {Icons.subscription} Manage Subscriptions
                  </Link>
                </div>
              </div>
            </div>

            {/* Profit Summary */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>Profit Summary</h2>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)' }}>Total Revenue</span>
                    <span style={{ fontWeight: 600 }}>{formatMoney(projectsRevenue?.totalRevenue || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)' }}>Total Expenses</span>
                    <span style={{ fontWeight: 600, color: 'var(--int-danger)' }}>-{formatMoney(totalExpenses?.total || 0)}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--int-border)', margin: '0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>Net Profit</span>
                    <span style={{ fontWeight: 700, color: 'var(--int-success)', fontSize: 'var(--int-text-lg)' }}>
                      {formatMoney(projectsRevenue?.totalProfit || 0)}
                    </span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--int-border)', margin: '0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Company Retention (10%)</span>
                    <span style={{ fontSize: 'var(--int-text-sm)' }}>{formatMoney(projectsRevenue?.companyRetention || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Pending Payments</span>
                    <span style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-warning)' }}>{formatMoney(projectsRevenue?.totalPending || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Subscriptions */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>{Icons.subscription} Upcoming Payments</h2>
              </div>
              <div className={s.cardBody}>
                {upcomingSubscriptions.length === 0 ? (
                  <p style={{ color: 'var(--int-text-muted)', textAlign: 'center' }}>No upcoming payments</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                    {upcomingSubscriptions.map((sub) => (
                      <div key={sub.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--int-space-2) 0',
                        borderBottom: '1px solid var(--int-border)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--int-text-sm)' }}>{sub.name}</div>
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                            Due: {formatDate(sub.nextBillingDate)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--int-warning)' }}>
                          {formatMoney(sub.amount, sub.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h2 className={s.cardTitle}>This Month</h2>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)' }}>Expenses</span>
                    <span style={{ fontWeight: 600, color: 'var(--int-danger)' }}>
                      {formatMoney(monthlyExpenseAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <section className={s.grid4} style={{ marginTop: 'var(--int-space-8)' }}>
          <Link href="/internal/finance/founders" className={`${s.card} ${s.cardHoverable}`}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-primary)', marginBottom: 'var(--int-space-3)' }}>{Icons.users}</div>
              <div style={{ fontWeight: 600 }}>Founders</div>
              <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: 'var(--int-space-2) 0 0' }}>
                Manage founders & shares
              </p>
            </div>
          </Link>
          
          <Link href="/internal/finance/accounts" className={`${s.card} ${s.cardHoverable}`}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-success)', marginBottom: 'var(--int-space-3)' }}>{Icons.wallet}</div>
              <div style={{ fontWeight: 600 }}>Accounts</div>
              <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: 'var(--int-space-2) 0 0' }}>
                Bank accounts & wallets
              </p>
            </div>
          </Link>
          
          <Link href="/internal/finance/expenses" className={`${s.card} ${s.cardHoverable}`}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-danger)', marginBottom: 'var(--int-space-3)' }}>{Icons.expense}</div>
              <div style={{ fontWeight: 600 }}>Expenses</div>
              <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: 'var(--int-space-2) 0 0' }}>
                Track all expenses
              </p>
            </div>
          </Link>
          
          <Link href="/internal/finance/distributions" className={`${s.card} ${s.cardHoverable}`}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-6)' }}>
              <div style={{ color: 'var(--int-info)', marginBottom: 'var(--int-space-3)' }}>{Icons.distribution}</div>
              <div style={{ fontWeight: 600 }}>Distributions</div>
              <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: 'var(--int-space-2) 0 0' }}>
                Profit distributions
              </p>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
