/**
 * Expense Breakdown Chart & Analysis
 * Visual breakdown of expenses by category with trends
 */
'use client';

import { useMemo } from 'react';
import s from '../styles.module.css';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date | string | number;
  vendor?: string;
}

interface ExpenseCategory {
  name: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

interface ExpenseBreakdownChartProps {
  expenses: Expense[];
  currency?: string;
  showTopExpenses?: boolean;
  maxCategories?: number;
}

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const categoryConfig: Record<string, { color: string; icon: string }> = {
  'infrastructure': { color: '#3B82F6', icon: '🏗️' },
  'domain': { color: '#8B5CF6', icon: '🌐' },
  'hosting': { color: '#06B6D4', icon: '☁️' },
  'software': { color: '#10B981', icon: '💻' },
  'marketing': { color: '#F59E0B', icon: '📢' },
  'utilities': { color: '#EF4444', icon: '⚡' },
  'legal': { color: '#6366F1', icon: '⚖️' },
  'office': { color: '#EC4899', icon: '🏢' },
  'travel': { color: '#14B8A6', icon: '✈️' },
  'equipment': { color: '#F97316', icon: '🖥️' },
  'subscriptions': { color: '#84CC16', icon: '📅' },
  'services': { color: '#A855F7', icon: '🔧' },
  'other': { color: '#6B7280', icon: '📦' },
};

function getCategoryConfig(category: string): { color: string; icon: string } {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');
  return categoryConfig[normalizedCategory] || categoryConfig['other'];
}

export function ExpenseBreakdownChart({
  expenses,
  currency = 'PKR',
  showTopExpenses = true,
  maxCategories = 8,
}: ExpenseBreakdownChartProps) {
  const { categories, totalExpenses, topExpenses } = useMemo(() => {
    const categoryMap = new Map<string, { total: number; count: number }>();
    let total = 0;

    expenses.forEach(expense => {
      const cat = expense.category || 'Other';
      const current = categoryMap.get(cat) || { total: 0, count: 0 };
      categoryMap.set(cat, {
        total: current.total + expense.amount,
        count: current.count + 1,
      });
      total += expense.amount;
    });

    const cats: ExpenseCategory[] = Array.from(categoryMap.entries())
      .map(([name, data]) => {
        const config = getCategoryConfig(name);
        return {
          name,
          total: data.total,
          count: data.count,
          percentage: total > 0 ? (data.total / total) * 100 : 0,
          color: config.color,
          icon: config.icon,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, maxCategories);

    // Top 5 individual expenses
    const top = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { categories: cats, totalExpenses: total, topExpenses: top };
  }, [expenses, maxCategories]);

  if (expenses.length === 0) {
    return (
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>📊 Expense Breakdown</h3>
        </div>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-8)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--int-space-4)' }}>💰</div>
          <p style={{ color: 'var(--int-text-muted)' }}>No expenses recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h3 className={s.cardTitle}>📊 Expense Breakdown</h3>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} totaling {formatMoney(totalExpenses, currency)}
          </p>
        </div>
      </div>

      <div className={s.cardBody}>
        {/* Visual Pie/Donut representation using bar segments */}
        <div style={{ marginBottom: 'var(--int-space-6)' }}>
          {/* Horizontal stacked bar */}
          <div style={{ 
            height: '24px', 
            borderRadius: 'var(--int-radius)', 
            overflow: 'hidden',
            display: 'flex',
            marginBottom: 'var(--int-space-4)'
          }}>
            {categories.map((cat, idx) => (
              <div
                key={cat.name}
                title={`${cat.name}: ${formatMoney(cat.total, currency)} (${cat.percentage.toFixed(1)}%)`}
                style={{
                  width: `${cat.percentage}%`,
                  minWidth: cat.percentage > 0 ? '4px' : '0',
                  height: '100%',
                  background: cat.color,
                  transition: 'width 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 'var(--int-space-3)',
            justifyContent: 'center'
          }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-1)' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '2px', 
                  background: cat.color 
                }} />
                <span style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-secondary)' }}>
                  {cat.icon} {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown List */}
        <div style={{ 
          display: 'grid', 
          gap: 'var(--int-space-3)',
          marginBottom: showTopExpenses ? 'var(--int-space-6)' : 0
        }}>
          {categories.map((cat, idx) => (
            <div 
              key={cat.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--int-space-3)',
                padding: 'var(--int-space-3)',
                background: 'var(--int-bg-secondary)',
                borderRadius: 'var(--int-radius)',
                borderLeft: `4px solid ${cat.color}`
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatMoney(cat.total, currency)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                  <div style={{ 
                    flex: 1, 
                    height: '6px', 
                    background: 'var(--int-border)', 
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${cat.percentage}%`,
                      background: cat.color,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', minWidth: '45px', textAlign: 'right' }}>
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: '2px' }}>
                  {cat.count} transaction{cat.count !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Individual Expenses */}
        {showTopExpenses && topExpenses.length > 0 && (
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)', display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
              <span>🔝</span>
              Top Expenses
            </h4>
            <div style={{ display: 'grid', gap: 'var(--int-space-2)' }}>
              {topExpenses.map((expense, idx) => {
                const config = getCategoryConfig(expense.category);
                return (
                  <div 
                    key={expense.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--int-space-3)',
                      padding: 'var(--int-space-2) var(--int-space-3)',
                      background: idx === 0 ? 'var(--int-primary-light)' : 'transparent',
                      borderRadius: 'var(--int-radius)',
                      border: '1px solid var(--int-border)'
                    }}
                  >
                    <span style={{ 
                      fontWeight: 700, 
                      color: idx === 0 ? 'var(--int-primary)' : 'var(--int-text-muted)',
                      minWidth: '20px'
                    }}>
                      #{idx + 1}
                    </span>
                    <span>{config.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{expense.description}</div>
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                        {expense.category} {expense.vendor ? `• ${expense.vendor}` : ''}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--int-error)' }}>
                      {formatMoney(expense.amount, currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Mini expense summary for dashboard cards
 */
export function ExpenseMiniChart({
  expenses,
  currency = 'PKR',
}: {
  expenses: Expense[];
  currency?: string;
}) {
  const { categories, total } = useMemo(() => {
    const categoryMap = new Map<string, number>();
    let totalAmount = 0;

    expenses.forEach(expense => {
      const cat = expense.category || 'Other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + expense.amount);
      totalAmount += expense.amount;
    });

    const cats = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        ...getCategoryConfig(name),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    return { categories: cats, total: totalAmount };
  }, [expenses]);

  return (
    <div style={{ padding: 'var(--int-space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-2)' }}>
        <span style={{ fontWeight: 600 }}>Total Expenses</span>
        <span style={{ fontWeight: 700, color: 'var(--int-error)' }}>{formatMoney(total, currency)}</span>
      </div>
      
      {/* Mini stacked bar */}
      <div style={{ 
        height: '8px', 
        borderRadius: '4px', 
        overflow: 'hidden',
        display: 'flex',
        marginBottom: 'var(--int-space-2)'
      }}>
        {categories.map(cat => (
          <div
            key={cat.name}
            style={{
              width: `${cat.percentage}%`,
              minWidth: cat.percentage > 0 ? '2px' : '0',
              height: '100%',
              background: cat.color,
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-2)', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <span key={cat.name} style={{ fontSize: 'var(--int-text-xs)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: cat.color }} />
            {cat.icon}
          </span>
        ))}
      </div>
    </div>
  );
}
