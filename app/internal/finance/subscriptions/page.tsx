'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles.module.css';

interface Subscription {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  category: string;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: Date | string;
  nextBillingDate: Date | string | null;
  endDate: Date | string | null;
  autoRenew: boolean;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  loginUrl: string | null;
  accountEmail: string | null;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Summary {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  monthlyEquivalent: number;
}

const CATEGORIES = [
  'domain',
  'hosting',
  'software_subscription',
  'hardware',
  'marketing',
  'legal',
  'office',
  'travel',
  'utilities',
  'contractor',
  'product_development',
  'project_cost',
  'misc',
];

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one_time', label: 'One Time' },
];

const DEFAULT_REMINDER_DAYS = 7;

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    description: '',
    category: 'domain',
    amount: '',
    currency: 'PKR',
    billingCycle: 'yearly',
    startDate: '',
    nextBillingDate: '',
    autoRenew: true,
    loginUrl: '',
    accountEmail: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subsRes = await fetch('/api/internal/finance/subscriptions');
      const subsData = await subsRes.json();

      setSubscriptions(subsData.subscriptions || []);
      setSummary(subsData.summary || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'PKR') => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatDate = (timestamp: Date | string | null) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimestamp = (date: Date | string | null): number => {
    if (!date) return 0;
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  };

  const getDaysUntilDue = (nextBillingDate: Date | string | null) => {
    if (!nextBillingDate) return Infinity;
    const now = Date.now();
    const due = getTimestamp(nextBillingDate);
    const diff = due - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (sub: Subscription) => {
    const daysUntil = getDaysUntilDue(sub.nextBillingDate);
    
    if (sub.status === 'cancelled') {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: '#ef444420',
          color: '#ef4444',
        }}>
          Cancelled
        </span>
      );
    }

    if (sub.status === 'paused') {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: '#6b728020',
          color: '#6b7280',
        }}>
          Paused
        </span>
      );
    }

    if (sub.status === 'expired') {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: '#9ca3af20',
          color: '#9ca3af',
        }}>
          Expired
        </span>
      );
    }
    
    if (daysUntil < 0) {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: '#ef444420',
          color: '#ef4444',
        }}>
          Overdue
        </span>
      );
    }
    
    if (daysUntil <= DEFAULT_REMINDER_DAYS) {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: '#f59e0b20',
          color: '#f59e0b',
        }}>
          Due in {daysUntil} days
        </span>
      );
    }
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: '#10b98120',
        color: '#10b981',
      }}>
        Active
      </span>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSub 
        ? `/api/internal/finance/subscriptions/${editingSub.id}`
        : '/api/internal/finance/subscriptions';
      
      const response = await fetch(url, {
        method: editingSub ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          provider: formData.provider,
          description: formData.description || null,
          category: formData.category,
          amount: Math.round(parseFloat(formData.amount) * 100),
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
          nextBillingDate: formData.nextBillingDate ? new Date(formData.nextBillingDate).toISOString() : null,
          autoRenew: formData.autoRenew,
          loginUrl: formData.loginUrl || null,
          accountEmail: formData.accountEmail || null,
          notes: formData.notes || null,
          status: 'active',
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingSub(null);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      const response = await fetch(`/api/internal/finance/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      description: '',
      category: 'domain',
      amount: '',
      currency: 'PKR',
      billingCycle: 'yearly',
      startDate: '',
      nextBillingDate: '',
      autoRenew: true,
      loginUrl: '',
      accountEmail: '',
      notes: '',
    });
  };

  const openEditModal = (sub: Subscription) => {
    setEditingSub(sub);
    const startDateStr = sub.startDate instanceof Date 
      ? sub.startDate.toISOString().split('T')[0]
      : new Date(sub.startDate).toISOString().split('T')[0];
    const nextBillingStr = sub.nextBillingDate 
      ? (sub.nextBillingDate instanceof Date 
          ? sub.nextBillingDate.toISOString().split('T')[0]
          : new Date(sub.nextBillingDate).toISOString().split('T')[0])
      : '';
    
    setFormData({
      name: sub.name,
      provider: sub.provider || '',
      description: sub.description || '',
      category: sub.category,
      amount: (sub.amount / 100).toString(),
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      startDate: startDateStr,
      nextBillingDate: nextBillingStr,
      autoRenew: sub.autoRenew,
      loginUrl: sub.loginUrl || '',
      accountEmail: sub.accountEmail || '',
      notes: sub.notes || '',
    });
    setShowModal(true);
  };

  // Separate upcoming and regular subscriptions
  const upcomingSubs = subscriptions.filter(s => 
    s.status === 'active' && getDaysUntilDue(s.nextBillingDate) <= 30
  ).sort((a, b) => getTimestamp(a.nextBillingDate) - getTimestamp(b.nextBillingDate));
  
  const regularSubs = subscriptions.filter(s => 
    s.status === 'active' && getDaysUntilDue(s.nextBillingDate) > 30
  );
  
  const cancelledSubs = subscriptions.filter(s => s.status === 'cancelled' || s.status === 'paused' || s.status === 'expired');

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Subscriptions</h1>
          <p className={styles.pageSubtitle}>
            Manage recurring expenses and renewals • {summary?.activeCount || 0} active subscriptions
          </p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => {
            resetForm();
            setEditingSub(null);
            setShowModal(true);
          }}
        >
          + Add Subscription
        </button>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Monthly Total</div>
          <div className={styles.statValue}>{formatCurrency(summary?.totalMonthly || 0)}</div>
          <div className={styles.statChange}>per month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Yearly Total</div>
          <div className={styles.statValue}>{formatCurrency(summary?.totalYearly || 0)}</div>
          <div className={styles.statChange}>per year</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Monthly Equivalent</div>
          <div className={styles.statValue}>{formatCurrency(summary?.monthlyEquivalent || 0)}</div>
          <div className={styles.statChange}>all subscriptions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Upcoming (30 days)</div>
          <div className={styles.statValue} style={{ color: upcomingSubs.length > 0 ? '#f59e0b' : 'inherit' }}>
            {upcomingSubs.length}
          </div>
          <div className={styles.statChange}>renewals</div>
        </div>
      </div>

      {/* Upcoming Renewals */}
      {upcomingSubs.length > 0 && (
        <div className={styles.card} style={{ marginBottom: '1.5rem', borderColor: '#f59e0b40' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle} style={{ color: '#f59e0b' }}>⚠️ Upcoming Renewals</h2>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingSubs.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'capitalize' }}>
                      {sub.category.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td>{sub.provider || '-'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(sub.amount)}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{sub.billingCycle}</div>
                  </td>
                  <td>{formatDate(sub.nextBillingDate)}</td>
                  <td>{getStatusBadge(sub)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={styles.secondaryButton}
                        onClick={() => openEditModal(sub)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Subscriptions */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>All Subscriptions</h2>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No subscriptions yet</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              Add your first subscription to track recurring expenses
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Cycle</th>
                <th>Next Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...regularSubs, ...cancelledSubs].map((sub) => (
                <tr key={sub.id} style={{ opacity: sub.status === 'cancelled' ? 0.5 : 1 }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.name}</div>
                    {sub.provider && (
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>{sub.provider}</div>
                    )}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{sub.category.replace(/_/g, ' ')}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(sub.amount)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{sub.billingCycle.replace(/_/g, ' ')}</td>
                  <td>{formatDate(sub.nextBillingDate)}</td>
                  <td>{getStatusBadge(sub)}</td>
                  <td>
                    {sub.status === 'active' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={styles.secondaryButton}
                          onClick={() => openEditModal(sub)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.secondaryButton}
                          onClick={() => handleCancel(sub.id)}
                          style={{ padding: '4px 8px', fontSize: '12px', color: '#ef4444' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingSub ? 'Edit Subscription' : 'Add Subscription'}</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., megicode.com domain"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Provider</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g., Namecheap, Vercel"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    className={styles.select}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amount (PKR) *</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., 2807"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Billing Cycle *</label>
                  <select
                    className={styles.select}
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    required
                  >
                    {BILLING_CYCLES.map(cycle => (
                      <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date *</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Next Due Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.nextBillingDate}
                    onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Login URL</label>
                  <input
                    type="url"
                    className={styles.input}
                    value={formData.loginUrl}
                    onChange={(e) => setFormData({ ...formData, loginUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Account Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={formData.accountEmail}
                    onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                    placeholder="account@example.com"
                  />
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Description</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.autoRenew}
                      onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    />
                    Auto-renew enabled
                  </label>
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={2}
                  />
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingSub ? 'Update Subscription' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
