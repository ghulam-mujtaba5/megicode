/**
 * Advanced Financial Analytics & Metrics
 * Real-time financial insights and KPI components
 */
'use client';

import { useMemo } from 'react';
import {
  calculateMonthlyMRR,
  calculateAnnualMRRImpact,
  calculateCashBurn,
  calculateExpenseByCategory,
  calculateRunwayMonths,
  calculateAverageDailyBurn,
  calculateProjectedMonthlyExpenses,
  formatCurrency,
} from '@/lib/finance/form-validation';
import { StatCard } from './AdvancedUIComponents';
import s from '../styles.module.css';

interface FinancialMetricsProps {
  companyBalance: number;
  totalRevenue: number;
  totalExpenses: number;
  monthlyExpenses: number;
  totalProfit: number;
  subscriptions: any[];
  expenses: any[];
  currency?: string;
}

export function FinancialMetrics({
  companyBalance,
  totalRevenue,
  totalExpenses,
  monthlyExpenses,
  totalProfit,
  subscriptions,
  expenses,
  currency = 'PKR',
}: FinancialMetricsProps) {
  const metrics = useMemo(() => {
    const monthlyMRR = calculateMonthlyMRR(subscriptions);
    const annualMRRImpact = calculateAnnualMRRImpact(monthlyMRR);
    const monthlyCashBurn = calculateCashBurn(monthlyExpenses, totalRevenue / 12);
    const expenseByCategory = calculateExpenseByCategory(expenses);
    const runwayMonths = calculateRunwayMonths(companyBalance, Math.abs(monthlyCashBurn));
    const dailyBurn = calculateAverageDailyBurn(totalExpenses, 365);
    const projectedMonthlyExp = calculateProjectedMonthlyExpenses(dailyBurn);

    return {
      monthlyMRR,
      annualMRRImpact,
      monthlyCashBurn,
      expenseByCategory,
      runwayMonths,
      dailyBurn,
      projectedMonthlyExp,
    };
  }, [subscriptions, expenses, totalRevenue, monthlyExpenses, totalExpenses, companyBalance]);

  return (
    <div style={{ display: 'grid', gap: 'var(--int-space-6)' }}>
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--int-space-4)' }}>
        <StatCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(metrics.monthlyMRR, currency)}
          variant="success"
          trend="up"
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Annual MRR Impact"
          value={formatCurrency(metrics.annualMRRImpact, currency)}
          variant="info"
        />
        <StatCard
          title="Monthly Cash Burn"
          value={formatCurrency(Math.abs(metrics.monthlyCashBurn), currency)}
          variant={metrics.monthlyCashBurn > 0 ? 'error' : 'success'}
          trend={metrics.monthlyCashBurn > 0 ? 'down' : 'up'}
        />
        <StatCard
          title="Runway (Months)"
          value={metrics.runwayMonths === Infinity ? '∞' : metrics.runwayMonths.toFixed(1)}
          variant={metrics.runwayMonths > 12 ? 'success' : metrics.runwayMonths > 6 ? 'warning' : 'error'}
        />
      </div>

      {/* Expense Category Breakdown */}
      {Object.keys(metrics.expenseByCategory).length > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Expense Breakdown by Category</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
              {Object.entries(metrics.expenseByCategory)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([category, amount]) => (
                  <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{category.replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                        {((amount as number) / totalExpenses * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--int-error)' }}>
                        -{formatCurrency(amount as number, currency)}
                      </div>
                    </div>
                    <div style={{ width: '100px', height: '4px', background: 'var(--int-border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${((amount as number) / totalExpenses) * 100}%`,
                          background: 'var(--int-error)',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Health Summary */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Financial Health Summary</h3>
        </div>
        <div className={s.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--int-space-4)' }}>
            <div style={{ padding: 'var(--int-space-4)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Current Balance
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-text-primary)' }}>
                {formatCurrency(companyBalance, currency)}
              </div>
              {companyBalance < 0 && (
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-error)', marginTop: 'var(--int-space-1)' }}>
                  ⚠️ Negative balance
                </div>
              )}
            </div>

            <div style={{ padding: 'var(--int-space-4)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Average Daily Burn
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-error)' }}>
                {formatCurrency(metrics.dailyBurn, currency)}/day
              </div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                Projected monthly: {formatCurrency(metrics.projectedMonthlyExp, currency)}
              </div>
            </div>

            <div style={{ padding: 'var(--int-space-4)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Profit (All Time)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success)' }}>
                {formatCurrency(totalProfit, currency)}
              </div>
              {totalProfit > 0 ? (
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-success)', marginTop: 'var(--int-space-1)' }}>
                  ✓ Profitable
                </div>
              ) : (
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-warning)', marginTop: 'var(--int-space-1)' }}>
                  ⚠️ Not yet profitable
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Key Insights & Recommendations</h3>
        </div>
        <div className={s.cardBody}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--int-space-3)' }}>
            {metrics.runwayMonths < 3 && (
              <li style={{ padding: 'var(--int-space-3)', background: 'var(--int-error-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-error)', display: 'flex', gap: 'var(--int-space-2)' }}>
                <span style={{ flex: 'none' }}>🚨</span>
                <span>Critical: Only {metrics.runwayMonths.toFixed(1)} months of runway remaining</span>
              </li>
            )}
            {metrics.monthlyCashBurn > 0 && (
              <li style={{ padding: 'var(--int-space-3)', background: 'var(--int-warning-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-warning)', display: 'flex', gap: 'var(--int-space-2)' }}>
                <span style={{ flex: 'none' }}>⚠️</span>
                <span>Negative cash flow: {formatCurrency(Math.abs(metrics.monthlyCashBurn), currency)} monthly burn</span>
              </li>
            )}
            {metrics.monthlyMRR > 0 && (
              <li style={{ padding: 'var(--int-space-3)', background: 'var(--int-success-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-success)', display: 'flex', gap: 'var(--int-space-2)' }}>
                <span style={{ flex: 'none' }}>✓</span>
                <span>Strong MRR: {formatCurrency(metrics.monthlyMRR, currency)} recurring revenue provides predictable cash flow</span>
              </li>
            )}
            {totalProfit > 0 && (
              <li style={{ padding: 'var(--int-space-3)', background: 'var(--int-success-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-success)', display: 'flex', gap: 'var(--int-space-2)' }}>
                <span style={{ flex: 'none' }}>💰</span>
                <span>Cumulative profit of {formatCurrency(totalProfit, currency)} shows strong overall performance</span>
              </li>
            )}
            {Object.keys(metrics.expenseByCategory).length > 0 && (
              <li style={{ padding: 'var(--int-space-3)', background: 'var(--int-info-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-info)', display: 'flex', gap: 'var(--int-space-2)' }}>
                <span style={{ flex: 'none' }}>ℹ️</span>
                <span>
                  {Object.entries(metrics.expenseByCategory)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 1)
                    .map(([cat]) => `Highest expense category: ${cat.replace(/_/g, ' ')}`)}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Cash Flow Projection Component
 */
interface CashFlowProjectionProps {
  currentBalance: number;
  monthlyExpenses: number;
  monthlyRevenue: number;
  months?: number;
  currency?: string;
}

export function CashFlowProjection({
  currentBalance,
  monthlyExpenses,
  monthlyRevenue,
  months = 12,
  currency = 'PKR',
}: CashFlowProjectionProps) {
  const projections = useMemo(() => {
    const monthlyNetCash = monthlyRevenue - monthlyExpenses;
    const data: Array<{ month: number; balance: number; revenue: number; expenses: number }> = [];
    let currentCash = currentBalance;

    for (let i = 1; i <= months; i++) {
      currentCash += monthlyNetCash;
      data.push({
        month: i,
        balance: currentCash,
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
      });
    }

    return data;
  }, [currentBalance, monthlyExpenses, monthlyRevenue, months]);

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>12-Month Cash Flow Projection</h3>
      </div>
      <div className={s.cardBody}>
        <div style={{ overflowX: 'auto' }}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
                <th style={{ textAlign: 'right' }}>Expenses</th>
                <th style={{ textAlign: 'right' }}>Net Cash Flow</th>
                <th style={{ textAlign: 'right' }}>Projected Balance</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((proj) => (
                <tr key={proj.month}>
                  <td style={{ fontWeight: 600 }}>Month {proj.month}</td>
                  <td style={{ textAlign: 'right', color: 'var(--int-success)' }}>{formatCurrency(proj.revenue, currency)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--int-error)' }}>-{formatCurrency(proj.expenses, currency)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: proj.revenue - proj.expenses > 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                    {formatCurrency(proj.revenue - proj.expenses, currency)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: proj.balance > 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                    {formatCurrency(proj.balance, currency)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        fontSize: 'var(--int-text-xs)',
                        fontWeight: 600,
                        background: proj.balance > 0 ? 'var(--int-success-light)' : 'var(--int-error-light)',
                        color: proj.balance > 0 ? 'var(--int-success)' : 'var(--int-error)',
                      }}
                    >
                      {proj.balance > 0 ? 'Healthy' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
