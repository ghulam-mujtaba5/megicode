'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  nextBillingDate: string | null;
  category: string;
}

interface PendingInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string | null;
  currency: string;
}

interface ForecastData {
  monthlySubscriptionCost: number;
  monthlyExpenseAvg: number;
  monthlyContributionAvg: number;
  monthlyDistributionAvg: number;
  expectedIncome: number;
  categoryAverages: Record<string, number>;
}

interface ForecastingClientProps {
  accounts: Account[];
  subscriptions: Subscription[];
  forecastData: ForecastData;
  pendingInvoices: PendingInvoice[];
}

const Icons = {
  forecast: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-5 5" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  trendUp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  money: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
};

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toFixed(0)}`;
}

function formatShortMoney(amountInSmallestUnit: number) {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toFixed(0);
}

export default function ForecastingClient({ 
  accounts, 
  subscriptions, 
  forecastData, 
  pendingInvoices 
}: ForecastingClientProps) {
  const [forecastMonths, setForecastMonths] = useState(6);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [scenario, setScenario] = useState<'conservative' | 'moderate' | 'optimistic'>('moderate');

  // Calculate total current balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Get selected account balance
  const startingBalance = selectedAccount === 'all' 
    ? totalBalance 
    : accounts.find(a => a.id === selectedAccount)?.balance || 0;

  // Scenario multipliers
  const scenarioMultipliers = {
    conservative: { income: 0.7, expense: 1.2 },
    moderate: { income: 1.0, expense: 1.0 },
    optimistic: { income: 1.3, expense: 0.8 },
  };

  const multiplier = scenarioMultipliers[scenario];

  // Calculate monthly net flow
  const monthlyInflow = (forecastData.monthlyContributionAvg + (forecastData.expectedIncome / 3)) * multiplier.income;
  const monthlyOutflow = (forecastData.monthlySubscriptionCost + forecastData.monthlyExpenseAvg + forecastData.monthlyDistributionAvg) * multiplier.expense;
  const monthlyNetFlow = monthlyInflow - monthlyOutflow;

  // Generate forecast data for chart
  const forecastPoints = useMemo(() => {
    const points: { month: string; balance: number; inflow: number; outflow: number }[] = [];
    let runningBalance = startingBalance;
    const today = new Date();

    for (let i = 0; i <= forecastMonths; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: i > 11 ? '2-digit' : undefined });
      
      // Add some variance
      const variance = 1 + (Math.sin(i * 0.5) * 0.1);
      const periodInflow = i === 0 ? 0 : monthlyInflow * variance;
      const periodOutflow = i === 0 ? 0 : monthlyOutflow * variance;
      
      if (i > 0) {
        runningBalance += periodInflow - periodOutflow;
      }

      points.push({
        month: monthName,
        balance: Math.max(0, runningBalance),
        inflow: periodInflow,
        outflow: periodOutflow,
      });
    }

    return points;
  }, [startingBalance, forecastMonths, monthlyInflow, monthlyOutflow]);

  // Find if/when balance goes negative
  const negativeMonth = forecastPoints.findIndex(p => p.balance <= 0);
  const lowestPoint = Math.min(...forecastPoints.map(p => p.balance));
  const highestPoint = Math.max(...forecastPoints.map(p => p.balance));
  const endBalance = forecastPoints[forecastPoints.length - 1]?.balance || 0;

  // Calculate subscription costs by month for the forecast period
  const upcomingSubscriptionPayments = useMemo(() => {
    const payments: { month: string; subscriptions: { name: string; amount: number }[]; total: number }[] = [];
    const today = new Date();

    for (let i = 0; i < forecastMonths; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + i + 1, 0);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });

      const monthSubs: { name: string; amount: number }[] = [];
      
      subscriptions.forEach(sub => {
        if (!sub.nextBillingDate) return;
        
        let checkDate = new Date(sub.nextBillingDate);
        
        // Check if this subscription bills in this month
        while (checkDate <= monthEnd) {
          if (checkDate >= monthDate && checkDate <= monthEnd) {
            monthSubs.push({ name: sub.name, amount: sub.amount });
            break;
          }
          
          // Advance to next billing cycle
          switch (sub.billingCycle) {
            case 'monthly':
              checkDate.setMonth(checkDate.getMonth() + 1);
              break;
            case 'quarterly':
              checkDate.setMonth(checkDate.getMonth() + 3);
              break;
            case 'yearly':
              checkDate.setFullYear(checkDate.getFullYear() + 1);
              break;
            default:
              checkDate = new Date(monthEnd.getTime() + 1); // Skip one-time
          }
        }
      });

      payments.push({
        month: monthName,
        subscriptions: monthSubs,
        total: monthSubs.reduce((sum, s) => sum + s.amount, 0),
      });
    }

    return payments;
  }, [subscriptions, forecastMonths]);

  // Chart dimensions
  const chartHeight = 300;
  const chartWidth = 800;
  const padding = { top: 40, right: 40, bottom: 40, left: 80 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => padding.left + (index / (forecastPoints.length - 1)) * innerWidth;
  const yScale = (value: number) => {
    const min = Math.min(0, lowestPoint);
    const max = highestPoint * 1.1;
    return chartHeight - padding.bottom - ((value - min) / (max - min)) * innerHeight;
  };

  // Generate path
  const linePath = forecastPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(point.balance)}`
  ).join(' ');

  const areaPath = linePath + ` L ${xScale(forecastPoints.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

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
              <h1 className={s.pageTitle}>{Icons.forecast} Balance Forecasting</h1>
              <p className={s.pageSubtitle}>
                Predict future account balances based on historical patterns and scheduled payments
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.cardBody} style={{ display: 'flex', gap: 'var(--int-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className={s.formGroup} style={{ margin: 0 }}>
              <label className={s.label}>Account</label>
              <select 
                className={s.select}
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <option value="all">All Accounts</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div className={s.formGroup} style={{ margin: 0 }}>
              <label className={s.label}>Forecast Period</label>
              <select 
                className={s.select}
                value={forecastMonths}
                onChange={(e) => setForecastMonths(Number(e.target.value))}
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
              </select>
            </div>
            <div className={s.formGroup} style={{ margin: 0 }}>
              <label className={s.label}>Scenario</label>
              <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
                {(['conservative', 'moderate', 'optimistic'] as const).map(s_name => (
                  <button
                    key={s_name}
                    onClick={() => setScenario(s_name)}
                    className={`${s.btn} ${scenario === s_name ? s.btnPrimary : s.btnGhost}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {s_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        {negativeMonth > 0 && (
          <div className={s.card} style={{ 
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: 'var(--int-space-6)'
          }}>
            <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
              <span style={{ color: 'var(--int-danger)' }}>{Icons.warning}</span>
              <div>
                <strong style={{ color: 'var(--int-danger)' }}>
                  Balance Warning: Predicted to reach zero in {forecastPoints[negativeMonth]?.month}
                </strong>
                <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                  Consider reducing expenses or increasing income to maintain positive balance
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Current Balance
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(startingBalance)}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Projected ({forecastMonths}mo)
              </div>
              <div style={{ 
                fontSize: 'var(--int-text-2xl)', 
                fontWeight: 700,
                color: endBalance > startingBalance ? 'var(--int-success)' : 'var(--int-danger)'
              }}>
                {formatMoney(endBalance)}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Monthly Net Flow
              </div>
              <div style={{ 
                fontSize: 'var(--int-text-2xl)', 
                fontWeight: 700,
                color: monthlyNetFlow > 0 ? 'var(--int-success)' : 'var(--int-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--int-space-2)'
              }}>
                {monthlyNetFlow > 0 ? Icons.trendUp : Icons.trendDown}
                {monthlyNetFlow > 0 ? '+' : ''}{formatMoney(monthlyNetFlow)}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Monthly Burn Rate
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: 'var(--int-warning)' }}>
                {formatMoney(monthlyOutflow)}
              </div>
            </div>
          </div>
        </div>

        <div className={s.grid3}>
          {/* Chart */}
          <div className={s.card} style={{ gridColumn: 'span 2' }}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Balance Projection</h2>
              <div style={{ display: 'flex', gap: 'var(--int-space-4)', fontSize: 'var(--int-text-sm)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-1)' }}>
                  <span style={{ width: 12, height: 3, background: 'var(--int-primary)', borderRadius: 2 }} />
                  Balance
                </span>
              </div>
            </div>
            <div className={s.cardBody}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
                  const y = padding.top + innerHeight * percent;
                  const value = highestPoint * 1.1 * (1 - percent);
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke="var(--int-border)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding.left - 10}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize="11"
                        fill="var(--int-text-muted)"
                      >
                        {formatShortMoney(value)}
                      </text>
                    </g>
                  );
                })}

                {/* Area fill */}
                <path
                  d={areaPath}
                  fill="url(#balanceGradient)"
                />

                {/* Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--int-primary)"
                  strokeWidth="3"
                />

                {/* Data points */}
                {forecastPoints.map((point, i) => (
                  <g key={i}>
                    <circle
                      cx={xScale(i)}
                      cy={yScale(point.balance)}
                      r="5"
                      fill="var(--int-primary)"
                      stroke="var(--int-surface)"
                      strokeWidth="2"
                    />
                    <text
                      x={xScale(i)}
                      y={chartHeight - 15}
                      textAnchor="middle"
                      fontSize="11"
                      fill="var(--int-text-muted)"
                    >
                      {point.month}
                    </text>
                  </g>
                ))}

                {/* Zero line */}
                <line
                  x1={padding.left}
                  y1={yScale(0)}
                  x2={chartWidth - padding.right}
                  y2={yScale(0)}
                  stroke="var(--int-danger)"
                  strokeWidth="1"
                  strokeDasharray="8 4"
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--int-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--int-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Cash Flow Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Monthly Cash Flow</h3>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-1)' }}>
                      <span style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Inflows</span>
                      <span style={{ color: 'var(--int-success)', fontWeight: 600 }}>+{formatMoney(monthlyInflow)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                      Contributions: {formatMoney(forecastData.monthlyContributionAvg)}<br/>
                      Expected Income: {formatMoney(forecastData.expectedIncome / 3)}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--int-border)', paddingTop: 'var(--int-space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-1)' }}>
                      <span style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Outflows</span>
                      <span style={{ color: 'var(--int-danger)', fontWeight: 600 }}>-{formatMoney(monthlyOutflow)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                      Subscriptions: {formatMoney(forecastData.monthlySubscriptionCost)}<br/>
                      Expenses: {formatMoney(forecastData.monthlyExpenseAvg)}<br/>
                      Distributions: {formatMoney(forecastData.monthlyDistributionAvg)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Invoices */}
            {pendingInvoices.length > 0 && (
              <div className={s.card}>
                <div className={s.cardHeader}>
                  <h3 className={s.cardTitle}>Expected Income</h3>
                </div>
                <div className={s.cardBody}>
                  {pendingInvoices.slice(0, 5).map(inv => (
                    <div key={inv.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: 'var(--int-space-2) 0',
                      borderBottom: '1px solid var(--int-border)',
                      fontSize: 'var(--int-text-sm)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{inv.invoiceNumber}</div>
                        {inv.dueDate && (
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                            Due: {new Date(inv.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <span style={{ color: 'var(--int-success)', fontWeight: 600 }}>
                        {formatMoney(inv.amount, inv.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Subscriptions by Month */}
        <div className={s.card} style={{ marginTop: 'var(--int-space-6)' }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Subscription Payment Schedule</h2>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(forecastMonths, 6)}, 1fr)`, gap: 'var(--int-space-4)' }}>
              {upcomingSubscriptionPayments.slice(0, 6).map((month, i) => (
                <div key={i} style={{ 
                  padding: 'var(--int-space-4)',
                  background: 'var(--int-surface-elevated)',
                  borderRadius: 'var(--int-radius)',
                  border: '1px solid var(--int-border)'
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: 'var(--int-space-3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{month.month}</span>
                    <span style={{ color: 'var(--int-warning)' }}>{formatMoney(month.total)}</span>
                  </div>
                  {month.subscriptions.length === 0 ? (
                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                      No scheduled payments
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-2)' }}>
                      {month.subscriptions.map((sub, j) => (
                        <div key={j} style={{ 
                          fontSize: 'var(--int-text-xs)',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            maxWidth: '60%'
                          }}>
                            {sub.name}
                          </span>
                          <span style={{ fontWeight: 500 }}>{formatMoney(sub.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
