'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface ReportData {
  profitLoss: {
    totalRevenue: number;
    totalPendingRevenue: number;
    totalExpenses: number;
    grossProfit: number;
    companyRetention: number;
    founderDistributions: number;
    netProfit: number;
  };
  balanceSheet: {
    assets: {
      cash: number;
      receivables: number;
      totalAssets: number;
    };
    liabilities: {
      upcomingSubscriptions: number;
      pendingDistributions: number;
      totalLiabilities: number;
    };
    equity: {
      founderContributions: number;
      retainedEarnings: number;
      totalEquity: number;
    };
  };
  cashFlow: {
    operatingActivities: {
      revenueReceived: number;
      expensesPaid: number;
      netOperating: number;
    };
    financingActivities: {
      founderContributions: number;
      founderDistributions: number;
      netFinancing: number;
    };
    netCashChange: number;
    endingCash: number;
  };
  expensesByCategory: Record<string, number>;
  monthlyExpenses: { month: string; amount: number }[];
  monthlyRevenue: { month: string; amount: number }[];
  comparison: {
    currentMonthExpenses: number;
    lastMonthExpenses: number;
    expenseChange: number;
  };
  founders: {
    id: string;
    name: string;
    sharePercentage: number;
    contributions: number;
    distributions: number;
  }[];
  projectsRevenue: {
    id: string;
    name: string;
    revenue: number;
    pending: number;
    expenses: number;
    profit: number;
  }[];
}

type ReportTab = 'overview' | 'pnl' | 'balance' | 'cashflow' | 'expenses' | 'projects';

const Icons = {
  reports: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  dollar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  pieChart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  barChart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  domain: '#8b5cf6',
  hosting: '#06b6d4',
  software_subscription: '#3b82f6',
  hardware: '#6366f1',
  marketing: '#ec4899',
  legal: '#f59e0b',
  office: '#84cc16',
  travel: '#14b8a6',
  utilities: '#f97316',
  contractor: '#ef4444',
  product_development: '#8b5cf6',
  project_cost: '#0ea5e9',
  misc: '#94a3b8',
};

const categoryLabels: Record<string, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  software_subscription: 'Software',
  hardware: 'Hardware',
  marketing: 'Marketing',
  legal: 'Legal',
  office: 'Office',
  travel: 'Travel',
  utilities: 'Utilities',
  contractor: 'Contractor',
  product_development: 'Product Dev',
  project_cost: 'Project Cost',
  misc: 'Misc',
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

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export default function FinancialReportsClient({ data }: { data: ReportData }) {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  // Calculate max values for charts
  const maxMonthlyExpense = useMemo(() => 
    Math.max(...data.monthlyExpenses.map(m => m.amount), 1),
    [data.monthlyExpenses]
  );
  
  const maxMonthlyRevenue = useMemo(() => 
    Math.max(...data.monthlyRevenue.map(m => m.amount), 1),
    [data.monthlyRevenue]
  );

  const totalCategoryExpenses = useMemo(() =>
    Object.values(data.expensesByCategory).reduce((sum, v) => sum + v, 0) || 1,
    [data.expensesByCategory]
  );

  const tabs: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: Icons.reports },
    { id: 'pnl', label: 'P&L Statement', icon: Icons.dollar },
    { id: 'balance', label: 'Balance Sheet', icon: Icons.wallet },
    { id: 'cashflow', label: 'Cash Flow', icon: Icons.activity },
    { id: 'expenses', label: 'Expense Analysis', icon: Icons.pieChart },
    { id: 'projects', label: 'Project Revenue', icon: Icons.barChart },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ['Megicode Financial Report'],
      ['Generated:', new Date().toISOString()],
      [],
      ['PROFIT & LOSS'],
      ['Total Revenue', data.profitLoss.totalRevenue / 100],
      ['Total Expenses', data.profitLoss.totalExpenses / 100],
      ['Gross Profit', data.profitLoss.grossProfit / 100],
      ['Net Profit', data.profitLoss.netProfit / 100],
      [],
      ['BALANCE SHEET'],
      ['Cash', data.balanceSheet.assets.cash / 100],
      ['Receivables', data.balanceSheet.assets.receivables / 100],
      ['Total Assets', data.balanceSheet.assets.totalAssets / 100],
      ['Total Liabilities', data.balanceSheet.liabilities.totalLiabilities / 100],
      ['Total Equity', data.balanceSheet.equity.totalEquity / 100],
      [],
      ['EXPENSES BY CATEGORY'],
      ...Object.entries(data.expensesByCategory).map(([cat, amt]) => [categoryLabels[cat] || cat, amt / 100]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `megicode-financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <>
      {/* KPI Cards */}
      <div className={s.kpiGrid}>
        <div className={`${s.kpiCard} ${s.kpiSuccess}`}>
          <div className={s.kpiIcon}>{Icons.trendUp}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(data.profitLoss.totalRevenue)}</div>
            <div className={s.kpiLabel}>Total Revenue</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiDanger}`}>
          <div className={s.kpiIcon}>{Icons.trendDown}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(data.profitLoss.totalExpenses)}</div>
            <div className={s.kpiLabel}>Total Expenses</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiPrimary}`}>
          <div className={s.kpiIcon}>{Icons.dollar}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(data.profitLoss.netProfit)}</div>
            <div className={s.kpiLabel}>Net Profit</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiInfo}`}>
          <div className={s.kpiIcon}>{Icons.wallet}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(data.cashFlow.endingCash)}</div>
            <div className={s.kpiLabel}>Cash Balance</div>
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className={s.grid2} style={{ marginTop: 'var(--int-space-6)' }}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{Icons.barChart} Monthly Revenue (12 months)</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', paddingTop: 'var(--int-space-4)' }}>
              {data.monthlyRevenue.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: `${Math.max((m.amount / maxMonthlyRevenue) * 160, 4)}px`,
                      background: 'var(--int-success)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                    title={`${m.month}: ${formatMoney(m.amount)}`}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--int-text-muted)', marginTop: '4px' }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{Icons.barChart} Monthly Expenses (12 months)</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', paddingTop: 'var(--int-space-4)' }}>
              {data.monthlyExpenses.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: `${Math.max((m.amount / maxMonthlyExpense) * 160, 4)}px`,
                      background: 'var(--int-error)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                    title={`${m.month}: ${formatMoney(m.amount)}`}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--int-text-muted)', marginTop: '4px' }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Categories Pie Chart */}
      <div className={s.grid2} style={{ marginTop: 'var(--int-space-6)' }}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{Icons.pieChart} Expense Breakdown</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--int-space-3)' }}>
              {Object.entries(data.expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percent = (amount / totalCategoryExpenses) * 100;
                  return (
                    <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)', minWidth: '180px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '2px', 
                        background: categoryColors[category] || '#94a3b8',
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 'var(--int-text-sm)', flex: 1 }}>{categoryLabels[category] || category}</span>
                      <span style={{ fontSize: 'var(--int-text-sm)', fontWeight: 600 }}>{percent.toFixed(1)}%</span>
                    </div>
                  );
                })}
            </div>
            {/* Simple bar representation */}
            <div style={{ marginTop: 'var(--int-space-4)', height: '24px', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
              {Object.entries(data.expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div
                    key={category}
                    style={{
                      width: `${(amount / totalCategoryExpenses) * 100}%`,
                      height: '100%',
                      background: categoryColors[category] || '#94a3b8',
                    }}
                    title={`${categoryLabels[category] || category}: ${formatMoney(amount)}`}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Month-over-Month</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
              <div>
                <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)', marginBottom: 'var(--int-space-1)' }}>This Month Expenses</div>
                <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>{formatMoney(data.comparison.currentMonthExpenses)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)', marginBottom: 'var(--int-space-1)' }}>Last Month Expenses</div>
                <div style={{ fontSize: 'var(--int-text-xl)', fontWeight: 600 }}>{formatMoney(data.comparison.lastMonthExpenses)}</div>
              </div>
              <div style={{ 
                padding: 'var(--int-space-3)', 
                borderRadius: 'var(--int-radius)', 
                background: data.comparison.expenseChange <= 0 ? 'var(--int-success-light)' : 'var(--int-error-light)',
                color: data.comparison.expenseChange <= 0 ? 'var(--int-success)' : 'var(--int-error)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--int-space-2)',
              }}>
                {data.comparison.expenseChange <= 0 ? Icons.trendDown : Icons.trendUp}
                {formatPercent(data.comparison.expenseChange)} from last month
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderProfitLoss = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>{Icons.dollar} Profit & Loss Statement</h3>
        <span className={s.badge}>All Time</span>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        <table className={s.table}>
          <tbody>
            <tr style={{ background: 'var(--int-surface-elevated)' }}>
              <td colSpan={2} style={{ fontWeight: 700, fontSize: 'var(--int-text-base)' }}>Revenue</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Project Revenue (Received)</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-success)' }}>{formatMoney(data.profitLoss.totalRevenue)}</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Pending Revenue</td>
              <td style={{ textAlign: 'right', color: 'var(--int-warning)' }}>{formatMoney(data.profitLoss.totalPendingRevenue)}</td>
            </tr>
            <tr style={{ borderTop: '2px solid var(--int-border)' }}>
              <td style={{ fontWeight: 700 }}>Total Revenue</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-lg)', color: 'var(--int-success)' }}>{formatMoney(data.profitLoss.totalRevenue)}</td>
            </tr>
            
            <tr style={{ background: 'var(--int-surface-elevated)' }}>
              <td colSpan={2} style={{ fontWeight: 700, fontSize: 'var(--int-text-base)' }}>Operating Expenses</td>
            </tr>
            {Object.entries(data.expensesByCategory).map(([category, amount]) => (
              <tr key={category}>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>{categoryLabels[category] || category}</td>
                <td style={{ textAlign: 'right', color: 'var(--int-error)' }}>({formatMoney(amount)})</td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid var(--int-border)' }}>
              <td style={{ fontWeight: 700 }}>Total Expenses</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-lg)', color: 'var(--int-error)' }}>({formatMoney(data.profitLoss.totalExpenses)})</td>
            </tr>
            
            <tr style={{ background: 'var(--int-primary-light)' }}>
              <td style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>Gross Profit</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-xl)', color: data.profitLoss.grossProfit >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                {formatMoney(data.profitLoss.grossProfit)}
              </td>
            </tr>
            
            <tr style={{ background: 'var(--int-surface-elevated)' }}>
              <td colSpan={2} style={{ fontWeight: 700, fontSize: 'var(--int-text-base)' }}>Distributions</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Company Retention (10%)</td>
              <td style={{ textAlign: 'right', color: 'var(--int-info)' }}>{formatMoney(data.profitLoss.companyRetention)}</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Founder Distributions</td>
              <td style={{ textAlign: 'right', color: 'var(--int-text-muted)' }}>({formatMoney(data.profitLoss.founderDistributions)})</td>
            </tr>
            
            <tr style={{ background: 'var(--int-success-light)', borderTop: '3px solid var(--int-success)' }}>
              <td style={{ fontWeight: 700, fontSize: 'var(--int-text-xl)' }}>Net Profit</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-2xl)', color: data.profitLoss.netProfit >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                {formatMoney(data.profitLoss.netProfit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className={s.grid2}>
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>{Icons.wallet} Assets</h3>
        </div>
        <div className={s.cardBody} style={{ padding: 0 }}>
          <table className={s.table}>
            <tbody>
              <tr style={{ background: 'var(--int-surface-elevated)' }}>
                <td colSpan={2} style={{ fontWeight: 700 }}>Current Assets</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Cash & Bank Accounts</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.assets.cash)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Accounts Receivable</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.assets.receivables)}</td>
              </tr>
              <tr style={{ background: 'var(--int-success-light)', borderTop: '2px solid var(--int-success)' }}>
                <td style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>Total Assets</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-xl)', color: 'var(--int-success)' }}>
                  {formatMoney(data.balanceSheet.assets.totalAssets)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Liabilities & Equity</h3>
        </div>
        <div className={s.cardBody} style={{ padding: 0 }}>
          <table className={s.table}>
            <tbody>
              <tr style={{ background: 'var(--int-surface-elevated)' }}>
                <td colSpan={2} style={{ fontWeight: 700 }}>Liabilities</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Upcoming Subscriptions</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.liabilities.upcomingSubscriptions)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Pending Distributions</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.liabilities.pendingDistributions)}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--int-border)' }}>
                <td style={{ fontWeight: 600 }}>Total Liabilities</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-error)' }}>{formatMoney(data.balanceSheet.liabilities.totalLiabilities)}</td>
              </tr>
              
              <tr style={{ background: 'var(--int-surface-elevated)' }}>
                <td colSpan={2} style={{ fontWeight: 700 }}>Equity</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Founder Contributions</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.equity.founderContributions)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 'var(--int-space-8)' }}>Retained Earnings</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(data.balanceSheet.equity.retainedEarnings)}</td>
              </tr>
              <tr style={{ background: 'var(--int-primary-light)', borderTop: '2px solid var(--int-primary)' }}>
                <td style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>Total Equity</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-xl)', color: 'var(--int-primary)' }}>
                  {formatMoney(data.balanceSheet.equity.totalEquity)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>{Icons.activity} Cash Flow Statement</h3>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        <table className={s.table}>
          <tbody>
            <tr style={{ background: 'var(--int-surface-elevated)' }}>
              <td colSpan={2} style={{ fontWeight: 700, fontSize: 'var(--int-text-base)' }}>Operating Activities</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Revenue Received</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-success)' }}>+{formatMoney(data.cashFlow.operatingActivities.revenueReceived)}</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Expenses Paid</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-error)' }}>{formatMoney(data.cashFlow.operatingActivities.expensesPaid)}</td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--int-border)' }}>
              <td style={{ fontWeight: 600 }}>Net Operating Cash Flow</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: data.cashFlow.operatingActivities.netOperating >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                {formatMoney(data.cashFlow.operatingActivities.netOperating)}
              </td>
            </tr>
            
            <tr style={{ background: 'var(--int-surface-elevated)' }}>
              <td colSpan={2} style={{ fontWeight: 700, fontSize: 'var(--int-text-base)' }}>Financing Activities</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Founder Contributions</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-success)' }}>+{formatMoney(data.cashFlow.financingActivities.founderContributions)}</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: 'var(--int-space-8)' }}>Founder Distributions</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--int-error)' }}>{formatMoney(data.cashFlow.financingActivities.founderDistributions)}</td>
            </tr>
            <tr style={{ borderTop: '1px solid var(--int-border)' }}>
              <td style={{ fontWeight: 600 }}>Net Financing Cash Flow</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: data.cashFlow.financingActivities.netFinancing >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                {formatMoney(data.cashFlow.financingActivities.netFinancing)}
              </td>
            </tr>
            
            <tr style={{ background: 'var(--int-info-light)', borderTop: '2px solid var(--int-info)' }}>
              <td style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>Net Cash Change</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-xl)', color: data.cashFlow.netCashChange >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                {formatMoney(data.cashFlow.netCashChange)}
              </td>
            </tr>
            
            <tr style={{ background: 'var(--int-success-light)', borderTop: '3px solid var(--int-success)' }}>
              <td style={{ fontWeight: 700, fontSize: 'var(--int-text-xl)' }}>Ending Cash Balance</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--int-text-2xl)', color: 'var(--int-success)' }}>
                {formatMoney(data.cashFlow.endingCash)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <>
      <div className={s.grid2}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{Icons.pieChart} Expense Breakdown by Category</h3>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>% of Total</th>
                  <th>Visual</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.expensesByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const percent = (amount / totalCategoryExpenses) * 100;
                    return (
                      <tr key={category}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                            <div style={{ 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '2px', 
                              background: categoryColors[category] || '#94a3b8',
                            }} />
                            {categoryLabels[category] || category}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatMoney(amount)}</td>
                        <td>{percent.toFixed(1)}%</td>
                        <td style={{ width: '150px' }}>
                          <div style={{ width: '100%', height: '8px', background: 'var(--int-border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${percent}%`, 
                              height: '100%', 
                              background: categoryColors[category] || '#94a3b8',
                              borderRadius: '4px',
                            }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ background: 'var(--int-surface-elevated)', fontWeight: 700 }}>
                  <td>Total</td>
                  <td>{formatMoney(totalCategoryExpenses)}</td>
                  <td>100%</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{Icons.barChart} Monthly Expense Trend</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '250px', paddingTop: 'var(--int-space-4)' }}>
              {data.monthlyExpenses.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '10px', color: 'var(--int-text-muted)', marginBottom: '4px', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                    {formatMoney(m.amount)}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '50px',
                      height: `${Math.max((m.amount / maxMonthlyExpense) * 180, 4)}px`,
                      background: `linear-gradient(180deg, var(--int-error) 0%, var(--int-error-light) 100%)`,
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                    title={`${m.month}: ${formatMoney(m.amount)}`}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--int-text-muted)', marginTop: '8px' }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderProjects = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>{Icons.barChart} Revenue by Project</h3>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {data.projectsRevenue.length === 0 ? (
          <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
            No project revenue data available
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Revenue</th>
                <th>Pending</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {data.projectsRevenue.map(project => {
                const margin = project.revenue > 0 ? (project.profit / project.revenue) * 100 : 0;
                return (
                  <tr key={project.id}>
                    <td style={{ fontWeight: 600 }}>{project.name}</td>
                    <td style={{ color: 'var(--int-success)' }}>{formatMoney(project.revenue)}</td>
                    <td style={{ color: 'var(--int-warning)' }}>{formatMoney(project.pending)}</td>
                    <td style={{ color: 'var(--int-error)' }}>({formatMoney(project.expenses)})</td>
                    <td style={{ fontWeight: 700, color: project.profit >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                      {formatMoney(project.profit)}
                    </td>
                    <td>
                      <span className={`${s.badge} ${margin >= 30 ? s.badgeSuccess : margin >= 15 ? s.badgeWarning : s.badgeError}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'pnl': return renderProfitLoss();
      case 'balance': return renderBalanceSheet();
      case 'cashflow': return renderCashFlow();
      case 'expenses': return renderExpenses();
      case 'projects': return renderProjects();
      default: return renderOverview();
    }
  };

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <Link href="/internal/finance" className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
              {Icons.back}
            </Link>
            <div>
              <h1 className={s.pageTitle}>{Icons.reports} Financial Reports</h1>
              <p className={s.pageSubtitle}>
                Comprehensive financial analysis, P&L statements, and expense breakdowns
              </p>
            </div>
          </div>
          <button onClick={handleExportCSV} className={`${s.btn} ${s.btnSecondary}`}>
            {Icons.download} Export CSV
          </button>
        </div>

        {/* Tabs */}
        <div className={s.tabs} style={{ marginBottom: 'var(--int-space-6)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${s.tab} ${activeTab === tab.id ? s.tabActive : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </main>
  );
}
