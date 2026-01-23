'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import s from '../../../styles.module.css';

interface Subscription {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  category: string;
  startDate: Date | string | number;
  nextBillingDate: Date | string | number | null;
  endDate: Date | string | number | null;
  autoRenew: boolean;
  status: string;
  loginUrl: string | null;
  accountEmail: string | null;
  notes: string | null;
}

const Icons = {
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  chevronLeft: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
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
  misc: 'Misc',
};

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toFixed(0)}`;
}

export default function SubscriptionCalendarClient({ subscriptions }: { subscriptions: Subscription[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [year, month, daysInMonth, firstDayOfMonth]);

  // Get subscriptions for a specific day
  const getSubscriptionsForDay = (day: number) => {
    return subscriptions.filter(sub => {
      if (!sub.nextBillingDate) return false;
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate.getDate() === day && 
             billingDate.getMonth() === month && 
             billingDate.getFullYear() === year;
    });
  };

  // Get all subscriptions for current month
  const monthlySubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      if (!sub.nextBillingDate) return false;
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate.getMonth() === month && billingDate.getFullYear() === year;
    }).sort((a, b) => {
      const dateA = new Date(a.nextBillingDate!);
      const dateB = new Date(b.nextBillingDate!);
      return dateA.getTime() - dateB.getTime();
    });
  }, [subscriptions, month, year]);

  // Calculate total for the month
  const monthlyTotal = monthlySubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  // Get upcoming (next 7 days)
  const upcomingSubs = useMemo(() => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return subscriptions.filter(sub => {
      if (!sub.nextBillingDate) return false;
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate >= today && billingDate <= weekFromNow;
    });
  }, [subscriptions]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day: number) => 
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <Link href="/internal/finance/subscriptions" className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
              {Icons.back}
            </Link>
            <div>
              <h1 className={s.pageTitle}>{Icons.calendar} Subscription Calendar</h1>
              <p className={s.pageSubtitle}>
                Visual overview of upcoming subscription payments
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
            <button 
              onClick={() => setViewMode('month')}
              className={`${s.btn} ${viewMode === 'month' ? s.btnPrimary : s.btnGhost}`}
            >
              Calendar
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`${s.btn} ${viewMode === 'list' ? s.btnPrimary : s.btnGhost}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Alerts */}
        {upcomingSubs.length > 0 && (
          <div className={s.card} style={{ 
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: 'var(--int-space-6)'
          }}>
            <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
              <span style={{ color: 'var(--int-warning)' }}>{Icons.alert}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: 'var(--int-warning)' }}>
                  {upcomingSubs.length} payment{upcomingSubs.length > 1 ? 's' : ''} due in the next 7 days
                </strong>
                <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                  Total: {formatMoney(upcomingSubs.reduce((sum, sub) => sum + sub.amount, 0))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={s.grid3}>
          {/* Calendar / List View */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
                  <button onClick={() => navigateMonth('prev')} className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
                    {Icons.chevronLeft}
                  </button>
                  <h2 className={s.cardTitle} style={{ minWidth: '200px', textAlign: 'center' }}>
                    {monthNames[month]} {year}
                  </h2>
                  <button onClick={() => navigateMonth('next')} className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
                    {Icons.chevronRight}
                  </button>
                </div>
                <div style={{ 
                  padding: 'var(--int-space-2) var(--int-space-4)',
                  background: 'var(--int-surface-elevated)',
                  borderRadius: 'var(--int-radius)',
                  fontWeight: 600
                }}>
                  Monthly Total: <span style={{ color: 'var(--int-warning)' }}>{formatMoney(monthlyTotal)}</span>
                </div>
              </div>
              <div className={s.cardBody}>
                {viewMode === 'month' ? (
                  <>
                    {/* Day headers */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(7, 1fr)', 
                      gap: '1px',
                      marginBottom: 'var(--int-space-2)'
                    }}>
                      {dayNames.map(day => (
                        <div key={day} style={{ 
                          textAlign: 'center', 
                          fontWeight: 600, 
                          fontSize: 'var(--int-text-sm)',
                          color: 'var(--int-text-muted)',
                          padding: 'var(--int-space-2)'
                        }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(7, 1fr)', 
                      gap: '1px',
                      background: 'var(--int-border)',
                      border: '1px solid var(--int-border)',
                      borderRadius: 'var(--int-radius)'
                    }}>
                      {calendarDays.map((day, index) => {
                        const daySubs = day ? getSubscriptionsForDay(day) : [];
                        const hasPayments = daySubs.length > 0;
                        const dayTotal = daySubs.reduce((sum, sub) => sum + sub.amount, 0);
                        
                        return (
                          <div
                            key={index}
                            style={{
                              minHeight: '100px',
                              padding: 'var(--int-space-2)',
                              background: isToday(day!) 
                                ? 'var(--int-primary-light)' 
                                : hasPayments 
                                  ? 'var(--int-warning-light)' 
                                  : 'var(--int-surface)',
                              position: 'relative',
                            }}
                          >
                            {day && (
                              <>
                                <div style={{ 
                                  fontWeight: isToday(day) ? 700 : 400,
                                  color: isToday(day) ? 'var(--int-primary)' : 'var(--int-text)',
                                  marginBottom: 'var(--int-space-2)'
                                }}>
                                  {day}
                                </div>
                                {hasPayments && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {daySubs.slice(0, 3).map(sub => (
                                      <div
                                        key={sub.id}
                                        style={{
                                          fontSize: '10px',
                                          padding: '2px 4px',
                                          background: categoryColors[sub.category] || '#94a3b8',
                                          color: 'white',
                                          borderRadius: '2px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                        title={`${sub.name}: ${formatMoney(sub.amount)}`}
                                      >
                                        {sub.name}
                                      </div>
                                    ))}
                                    {daySubs.length > 3 && (
                                      <div style={{ fontSize: '10px', color: 'var(--int-text-muted)' }}>
                                        +{daySubs.length - 3} more
                                      </div>
                                    )}
                                    <div style={{ 
                                      fontSize: '10px', 
                                      fontWeight: 600, 
                                      color: 'var(--int-warning)',
                                      marginTop: '2px'
                                    }}>
                                      {formatMoney(dayTotal)}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* List View */
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subscription</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Cycle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySubscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                            No payments scheduled for {monthNames[month]} {year}
                          </td>
                        </tr>
                      ) : (
                        monthlySubscriptions.map(sub => {
                          const billingDate = new Date(sub.nextBillingDate!);
                          const isPast = billingDate < today;
                          return (
                            <tr key={sub.id} style={{ opacity: isPast ? 0.6 : 1 }}>
                              <td style={{ fontWeight: 600 }}>
                                {billingDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                                {isPast && <span style={{ marginLeft: 'var(--int-space-2)', color: 'var(--int-success)' }}>{Icons.check}</span>}
                              </td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{sub.name}</div>
                                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{sub.provider}</div>
                              </td>
                              <td>
                                <span 
                                  className={s.badge}
                                  style={{ 
                                    background: `${categoryColors[sub.category]}20`,
                                    color: categoryColors[sub.category]
                                  }}
                                >
                                  {categoryLabels[sub.category] || sub.category}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600, color: 'var(--int-warning)' }}>
                                {formatMoney(sub.amount, sub.currency)}
                              </td>
                              <td>
                                <span className={s.badge}>{sub.billingCycle}</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
            {/* Monthly Summary */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Monthly Summary</h3>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)' }}>Total Payments</span>
                    <span style={{ fontWeight: 600 }}>{monthlySubscriptions.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--int-text-muted)' }}>Total Amount</span>
                    <span style={{ fontWeight: 700, color: 'var(--int-warning)' }}>{formatMoney(monthlyTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>By Category</h3>
              </div>
              <div className={s.cardBody}>
                {Object.entries(
                  monthlySubscriptions.reduce((acc, sub) => {
                    const cat = sub.category || 'misc';
                    acc[cat] = (acc[cat] || 0) + sub.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
                  <div key={category} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--int-space-2)',
                    padding: 'var(--int-space-2) 0',
                    borderBottom: '1px solid var(--int-border)'
                  }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '2px', 
                      background: categoryColors[category] || '#94a3b8',
                    }} />
                    <span style={{ flex: 1, fontSize: 'var(--int-text-sm)' }}>{categoryLabels[category] || category}</span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--int-text-sm)' }}>{formatMoney(amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Next 7 Days</h3>
              </div>
              <div className={s.cardBody}>
                {upcomingSubs.length === 0 ? (
                  <div style={{ color: 'var(--int-text-muted)', textAlign: 'center', padding: 'var(--int-space-4)' }}>
                    No payments in the next 7 days
                  </div>
                ) : (
                  upcomingSubs.map(sub => (
                    <div key={sub.id} style={{ 
                      padding: 'var(--int-space-3)',
                      borderBottom: '1px solid var(--int-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--int-text-sm)' }}>{sub.name}</div>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                          {new Date(sub.nextBillingDate!).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--int-warning)' }}>{formatMoney(sub.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
