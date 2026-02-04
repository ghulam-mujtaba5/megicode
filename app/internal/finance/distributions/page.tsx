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
  grossAmount: number;
  deductions: number;
  netAmount: number;
  toAccountId: string | null;
  accountName: string | null;
  status: 'pending' | 'transferred' | 'hold';
}

interface Distribution {
  id: string;
  projectId: string | null;
  period: string | null;
  totalProfit: number;
  companyRetention: number;
  distributedAmount: number;
  currency: string;
  status: 'calculated' | 'pending_approval' | 'approved' | 'distributed' | 'cancelled';
  calculatedAt: string;
  distributedAt: string | null;
  notes: string | null;
  createdAt: string;
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
    totalProfit: '',
    period: '',
    projectId: '',
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
    }).format(amount);
  };

  const formatDate = (dateStr: string | number | null) => {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'number' ? new Date(dateStr) : new Date(dateStr);
    return date.toLocaleDateString('en-PK', {
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
          totalProfit: Math.round(parseFloat(formData.totalProfit) * 100),
          period: formData.period || null,
          projectId: formData.projectId || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ totalProfit: '', period: '', projectId: '', notes: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create distribution:', error);
    }
  };

  const handlePayFounder = async (distributionId: string, founderId: string, toAccountId: string, sourceAccountId?: string) => {
    try {
      const response = await fetch(`/api/internal/finance/distributions/${distributionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay_founder',
          founderId,
          toAccountId,
          sourceAccountId: sourceAccountId || null,
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
    const total = parseFloat(formData.totalProfit || '0') * 100;
    const retention = settings?.companyRetentionPercentage || 10;
    const retained = Math.round((total * retention) / 100);
    const distributable = total - retained;
    
    return {
      totalProfit: total,
      companyRetention: retained,
      distributedAmount: distributable,
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
      calculated: '#f59e0b',
      pending_approval: '#f59e0b',
      approved: '#3b82f6',
      distributed: '#10b981',
      transferred: '#10b981',
      cancelled: '#ef4444',
      hold: '#6b7280',
    };
    
    const labels: Record<string, string> = {
      pending: 'Pending',
      calculated: 'Calculated',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      distributed: 'Distributed',
      transferred: 'Transferred',
      cancelled: 'Cancelled',
      hold: 'On Hold',
    };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `${colors[status] || '#6b7280'}20`,
        color: colors[status] || '#6b7280',
      }}>
        {labels[status] || status}
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
          <div className={styles.statChange}>of total profit</div>
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
                      {formatDate(dist.calculatedAt)}
                      {dist.period && <span style={{ opacity: 0.6 }}> • Period: {dist.period}</span>}
                      {dist.projectId && <span style={{ opacity: 0.6 }}> • Project</span>}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>
                      Total: {formatCurrency(dist.totalProfit)} → 
                      Retained: {formatCurrency(dist.companyRetention)} → 
                      Distributed: {formatCurrency(dist.distributedAmount)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusBadge(dist.status)}
                    {dist.status === 'calculated' && (
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
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Total Profit</div>
                        <div style={{ fontWeight: 600 }}>{formatCurrency(dist.totalProfit)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Company Retention</div>
                        <div style={{ fontWeight: 600, color: '#3b82f6' }}>{formatCurrency(dist.companyRetention)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>Distributed Amount</div>
                        <div style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(dist.distributedAmount)}</div>
                      </div>
                    </div>
                    
                    <h4 style={{ marginBottom: '0.5rem' }}>Founder Payouts</h4>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Founder</th>
                          <th>Share %</th>
                          <th>Gross Amount</th>
                          <th>Deductions</th>
                          <th>Net Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dist.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.founderName}</td>
                            <td>{item.sharePercentage}%</td>
                            <td>{formatCurrency(item.grossAmount)}</td>
                            <td style={{ color: item.deductions > 0 ? '#ef4444' : undefined }}>
                              {item.deductions > 0 ? `-${formatCurrency(item.deductions)}` : '-'}
                            </td>
                            <td style={{ fontWeight: 600 }}>{formatCurrency(item.netAmount)}</td>
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
                                  <option value="">Transfer to...</option>
                                  {accounts
                                    .filter(a => a.founderId === item.founderId || a.accountType === 'founder_personal')
                                    .map(a => (
                                      <option key={a.id} value={a.id}>{a.name}</option>
                                    ))
                                  }
                                </select>
                              ) : (
                                <span style={{ fontSize: '12px', opacity: 0.6 }}>
                                  {item.accountName ? `Paid to ${item.accountName}` : 'Transferred'}
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
                  <label className={styles.label}>Total Profit (PKR) *</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.totalProfit}
                    onChange={(e) => setFormData({ ...formData, totalProfit: e.target.value })}
                    placeholder="e.g., 50000"
                    step="0.01"
                    required
                  />
                  <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                    Enter the total profit to be distributed (after expenses)
                  </p>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Period (optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g., 2026-01 or Q1-2026"
                  />
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
              {parseFloat(formData.totalProfit || '0') > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Distribution Preview</h4>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Total Profit:</span>
                      <strong>{formatCurrency(preview.totalProfit)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Company Retention ({settings?.companyRetentionPercentage || 10}%):</span>
                      <strong style={{ color: '#3b82f6' }}>{formatCurrency(preview.companyRetention)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Distributable to Founders:</span>
                      <strong style={{ color: '#10b981' }}>{formatCurrency(preview.distributedAmount)}</strong>
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
