/**
 * Smart Insights & Alerts Component
 * Real-time warnings, recommendations, and financial insights
 */
'use client';

import s from '../styles.module.css';

export interface InsightAlert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface SmartInsightsProps {
  companyBalance: number;
  monthlyExpenses: number;
  totalRevenue: number;
  totalExpenses: number;
  subscriptions: any[];
  expenses: any[];
  onAlertDismiss?: (alertId: string) => void;
}

export function SmartInsights({
  companyBalance,
  monthlyExpenses,
  totalRevenue,
  totalExpenses,
  subscriptions,
  expenses,
  onAlertDismiss,
}: SmartInsightsProps) {
  const generateInsights = (): InsightAlert[] => {
    const alerts: InsightAlert[] = [];

    // 1. Low Cash Warning
    if (companyBalance < 500000) {
      alerts.push({
        id: 'low-cash',
        type: 'error',
        title: '⚠️ Low Cash Balance',
        message: `Your company balance is only PKR ${(companyBalance / 100000).toFixed(1)}L. Consider adding funds soon.`,
      });
    }

    // 2. Runway Calculation
    const monthlyBurn = monthlyExpenses > 0 ? monthlyExpenses : totalExpenses;
    const runway = monthlyBurn > 0 ? Math.floor(companyBalance / monthlyBurn) : null;

    if (runway !== null && runway < 3) {
      alerts.push({
        id: 'low-runway',
        type: 'warning',
        title: '📉 Limited Runway',
        message: `At current spending, you have ~${runway} month(s) of runway. Plan ahead for sustainability.`,
      });
    }

    // 3. High Burn Rate
    const burnRatePercent = totalRevenue > 0 ? ((monthlyBurn / totalRevenue) * 100).toFixed(0) : null;
    if (burnRatePercent && parseInt(burnRatePercent) > 50) {
      alerts.push({
        id: 'high-burn',
        type: 'warning',
        title: '🔥 High Burn Rate',
        message: `You're spending ${burnRatePercent}% of revenue. Consider optimizing expenses.`,
      });
    }

    // 4. Upcoming Subscriptions
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    const upcomingSubscriptions = subscriptions.filter((sub) => {
      const nextDate = new Date(sub.nextBillingDate);
      return nextDate <= upcomingDate && nextDate > new Date();
    });

    if (upcomingSubscriptions.length > 0) {
      alerts.push({
        id: 'upcoming-bills',
        type: 'info',
        title: '📅 Upcoming Bills',
        message: `${upcomingSubscriptions.length} subscription(s) billing in the next 7 days.`,
      });
    }

    // 5. Growth Opportunity
    if (totalRevenue > 0 && totalExpenses > 0) {
      const profitMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;
      if (profitMargin > 40) {
        alerts.push({
          id: 'strong-margins',
          type: 'success',
          title: '🚀 Strong Profit Margin',
          message: `Excellent! Your profit margin is ${profitMargin.toFixed(0)}%. You're in a strong position.`,
        });
      }
    }

    // 6. Expense Category Alert
    const categoryExpenses = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryExpenses).sort(([, a], [, b]) => (b as number) - (a as number));
    const topCategory = sortedCategories[0] as [string, number] | undefined;
    if (topCategory && topCategory[1] > monthlyBurn * 0.4) {
      alerts.push({
        id: 'high-category',
        type: 'info',
        title: '💸 High Category Spending',
        message: `${topCategory[0].replace(/_/g, ' ')} is your biggest expense. Monitor for optimization.`,
      });
    }

    return alerts;
  };

  const alerts = generateInsights();

  if (alerts.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--int-space-4)',
          background: 'var(--int-success-light)',
          border: '1px solid var(--int-success)',
          borderRadius: 'var(--int-radius)',
          textAlign: 'center',
          color: 'var(--int-success)',
        }}
      >
        <div style={{ fontWeight: 600 }}>✨ All Systems Healthy</div>
        <div style={{ fontSize: 'var(--int-text-sm)', marginTop: 'var(--int-space-1)' }}>
          Great job! Your finances are in good shape.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--int-space-3)' }}>
      {alerts.map((alert) => {
        const typeColors = {
          error: { bg: 'var(--int-error-light)', border: 'var(--int-error)', text: 'var(--int-error)' },
          warning: { bg: 'var(--int-warning-light)', border: 'var(--int-warning)', text: 'var(--int-warning)' },
          info: { bg: 'var(--int-info-light)', border: 'var(--int-info)', text: 'var(--int-info)' },
          success: { bg: 'var(--int-success-light)', border: 'var(--int-success)', text: 'var(--int-success)' },
        };

        const colors = typeColors[alert.type];

        return (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--int-space-3)',
              padding: 'var(--int-space-4)',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 'var(--int-radius)',
              color: colors.text,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-1)' }}>{alert.title}</div>
              <div style={{ fontSize: 'var(--int-text-sm)', marginBottom: alert.action ? 'var(--int-space-2)' : 0 }}>
                {alert.message}
              </div>
              {alert.action && (
                <button
                  onClick={alert.action.onClick}
                  style={{
                    background: 'none',
                    border: `1px solid ${colors.text}`,
                    color: colors.text,
                    padding: 'var(--int-space-1) var(--int-space-2)',
                    borderRadius: 'var(--int-radius-sm)',
                    fontSize: 'var(--int-text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 'var(--int-space-1)',
                  }}
                >
                  {alert.action.label}
                </button>
              )}
            </div>
            {alert.dismissible !== false && (
              <button
                onClick={() => onAlertDismiss?.(alert.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  padding: 0,
                  flex: 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
