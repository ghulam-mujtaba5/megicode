'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles.module.css';

interface Founder {
  id: string;
  name: string;
  profitSharePercentage: number;
}

interface Account {
  id: string;
  name: string;
  accountType: string;
  founderId: string | null;
  currentBalance: number;
}

interface DistributionItem {
  id: string;
  founderId: string;
  founderName: string;
  sharePercentage: number;
  amount: number;
  paidToAccountId: string | null;
  accountName: string | null;
  status: string;
  paidAt: number | null;
}

interface Distribution {
  id: string;
  projectId: string | null;
  periodStart: number | null;
  periodEnd: number | null;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  retentionPercentage: number;
  retainedAmount: number;
  distributableAmount: number;
  sourceAccountId: string | null;
  status: string;
  notes: string | null;
  createdAt: number;
  items: DistributionItem[];
}

interface Settings {
  companyRetentionPercentage: number;
  defaultCurrency: string;
}

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution | null>(null);
  
  // Form state for new distribution
  const [formData, setFormData] = useState({
    grossProfit: '',
    totalExpenses: '',
    projectId: '',
    sourceAccountId: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [distRes, foundersRes, accountsRes, settingsRes] = await Promise.all([
        fetch('/api/internal/finance/distributions'),
        fetch('/api/internal/finance/founders'),
        fetch('/api/internal/finance/accounts'),
        fetch('/api/internal/finance/settings'),
      ]);

      const distData = await distRes.json();
      const foundersData = await foundersRes.json();
      const accountsData = await accountsRes.json();
      const settingsData = await settingsRes.json();

      setDistributions(distData.distributions || []);
      setFounders(foundersData.founders || []);
      setAccounts(accountsData.accounts || []);
      setSettings(settingsData.settings || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCreateDistribution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/internal/finance/distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossProfit: Math.round(parseFloat(formData.grossProfit) * 100),
          totalExpenses: Math.round(parseFloat(formData.totalExpenses || '0') * 100),
          projectId: formData.projectId || null,
          sourceAccountId: formData.sourceAccountId || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ grossProfit: '', totalExpenses: '', projectId: '', sourceAccountId: '', notes: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create distribution:', error);
    }
  };

  const handlePayFounder = async (distributionId: string, founderId: string, accountId: string) => {
    try {
      const response = await fetch(`/api/internal/finance/distributions/${distributionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay_founder',
          founderId,
          paidToAccountId: accountId,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to pay founder:', error);
    }
  };

  const handleDeleteDistribution = async (id: string) => {
    if (!confirm('Are you sure you want to delete this distribution?')) return;
    
    try {
      const response = await fetch(`/api/internal/finance/distributions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete distribution:', error);
    }
  };

  // Calculate preview
  const calculatePreview = () => {
    const gross = parseFloat(formData.grossProfit || '0') * 100;
    const expenses = parseFloat(formData.totalExpenses || '0') * 100;
    const net = gross - expenses;
    const retention = settings?.companyRetentionPercentage || 10;
    const retained = Math.round((net * retention) / 100);
    const distributable = net - retained;
    
    return {
      netProfit: net,
      retainedAmount: retained,
      distributableAmount: distributable,
      founderShares: founders.map(f => ({
        name: f.name,
        percentage: f.profitSharePercentage,
        amount: Math.round((distributable * f.profitSharePercentage) / 100),
      })),
    };
  };

  const preview = calculatePreview();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      partial: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444',
      paid: '#10b981',
    };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `${colors[status]}20`,
        color: colors[status],
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
          <h1 className={styles.pageTitle}>Profit Distribution</h1>
          <p className={styles.pageSubtitle}>
            Distribute project earnings to founders • {settings?.companyRetentionPercentage || 10}% company retention
          </p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => setShowModal(true)}
        >
          + New Distribution
        </button>
      </div>

      {/* Info Cards */}
      <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Company Retention</div>
          <div className={styles.statValue}>{settings?.companyRetentionPercentage || 10}%</div>
          <div className={styles.statChange}>of net profit</div>
        </div>
        {founders.map(founder => (
          <div key={founder.id} className={styles.statCard}>
            <div className={styles.statLabel}>{founder.name}</div>
            <div className={styles.statValue}>{founder.profitSharePercentage}%</div>
            <div className={styles.statChange}>profit share</div>
          </div>
        ))}
      </div>

      {/* Distributions List */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Distribution History</h2>
        </div>
        
        {distributions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No distributions yet</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              Create your first distribution to divide project profits among founders
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {distributions.map((dist) => (
              <div 
                key={dist.id} 
                className={styles.card}
                style={{ 
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedDistribution(selectedDistribution?.id === dist.id ? null : dist)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {formatDate(dist.createdAt)}
                      {dist.projectId && <span style={{ opacity: 0.6 }}> • Project: {dist.projectId}</span>}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>
                      Gross: {formatCurrency(dist.grossProfit)} → Net: {formatCurrency(dist.netProfit)} → 
                      Distributable: {formatCurrency(dist.distributableAmount)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusBadge(dist.status)}
                    {dist.status === 'pending' && (
                      <button
                        className={styles.secondaryButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDistribution(dist.id);
                        }}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Expanded View */}
                {selectedDistribution?.id === dist.id && (
                  <div style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Gross Profit</div>
                        <div style={{ fontWeight: 600 }}>{formatCurrency(dist.grossProfit)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Expenses</div>
                        <div style={{ fontWeight: 600, color: '#ef4444' }}>-{formatCurrency(dist.totalExpenses)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Company Retention ({dist.retentionPercentage}%)</div>
                        <div style={{ fontWeight: 600, color: '#3b82f6' }}>{formatCurrency(dist.retainedAmount)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Distributable</div>
                        <div style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(dist.distributableAmount)}</div>
                      </div>
                    </div>
                    
                    <h4 style={{ marginBottom: '0.5rem' }}>Founder Payouts</h4>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Founder</th>
                          <th>Share %</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dist.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.founderName}</td>
                            <td>{item.sharePercentage}%</td>
                            <td>{formatCurrency(item.amount)}</td>
                            <td>{getStatusBadge(item.status)}</td>
                            <td>
                              {item.status === 'pending' ? (
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handlePayFounder(dist.id, item.founderId, e.target.value);
                                    }
                                  }}
                                  defaultValue=""
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '12px',
                                  }}
                                >
                                  <option value="">Pay to account...</option>
                                  {accounts
                                    .filter(a => a.founderId === item.founderId || a.accountType === 'company_central')
                                    .map(a => (
                                      <option key={a.id} value={a.id}>{a.name}</option>
                                    ))
                                  }
                                </select>
                              ) : (
                                <span style={{ fontSize: '12px', opacity: 0.6 }}>
                                  Paid to {item.accountName} on {item.paidAt ? formatDate(item.paidAt) : '-'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {dist.notes && (
                      <div style={{ marginTop: '1rem', fontSize: '14px', opacity: 0.7 }}>
                        <strong>Notes:</strong> {dist.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create Profit Distribution</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateDistribution}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Gross Profit (PKR) *</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.grossProfit}
                    onChange={(e) => setFormData({ ...formData, grossProfit: e.target.value })}
                    placeholder="e.g., 50000"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Total Expenses (PKR)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.totalExpenses}
                    onChange={(e) => setFormData({ ...formData, totalExpenses: e.target.value })}
                    placeholder="e.g., 5000"
                    step="0.01"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Source Account</label>
                  <select
                    className={styles.select}
                    value={formData.sourceAccountId}
                    onChange={(e) => setFormData({ ...formData, sourceAccountId: e.target.value })}
                  >
                    <option value="">Select account...</option>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes about this distribution..."
                    rows={2}
                  />
                </div>
              </div>
              
              {/* Preview */}
              {parseFloat(formData.grossProfit || '0') > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Distribution Preview</h4>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Net Profit:</span>
                      <strong>{formatCurrency(preview.netProfit)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Company Retention ({settings?.companyRetentionPercentage || 10}%):</span>
                      <strong style={{ color: '#3b82f6' }}>{formatCurrency(preview.retainedAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Distributable:</span>
                      <strong style={{ color: '#10b981' }}>{formatCurrency(preview.distributableAmount)}</strong>
                    </div>
                    <hr style={{ opacity: 0.2, marginBottom: '8px' }} />
                    {preview.founderShares.map((share, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>{share.name} ({share.percentage}%):</span>
                        <strong>{formatCurrency(share.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Create Distribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
