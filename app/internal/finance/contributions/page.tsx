'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles.module.css';

interface Founder {
  id: string;
  name: string;
  totalContributions: number;
}

interface Account {
  id: string;
  name: string;
}

interface Contribution {
  id: string;
  founderId: string;
  founderName: string;
  contributionType: string;
  amount: number;
  currency: string;
  purpose: string;
  toAccountId: string | null;
  accountName: string | null;
  contributedAt: string; // Date object from API
  notes: string | null;
  status: string;
  createdAt: string;
}

interface FounderSummary {
  founderId: string;
  founderName: string;
  totalContributions: number;
  contributionCount: number;
}

const CONTRIBUTION_TYPES = [
  { value: 'initial_investment', label: 'Initial Investment' },
  { value: 'additional_capital', label: 'Additional Capital' },
  { value: 'loan_to_company', label: 'Loan to Company' },
  { value: 'expense_reimbursement', label: 'Expense Reimbursement' },
];

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [summary, setSummary] = useState<FounderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    founderId: '',
    contributionType: 'initial_investment',
    amount: '',
    currency: 'PKR',
    purpose: '',
    toAccountId: '',
    contributedAt: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contribRes, foundersRes, accountsRes] = await Promise.all([
        fetch('/api/internal/finance/contributions'),
        fetch('/api/internal/finance/founders'),
        fetch('/api/internal/finance/accounts'),
      ]);

      const contribData = await contribRes.json();
      const foundersData = await foundersRes.json();
      const accountsData = await accountsRes.json();

      setContributions(contribData.contributions || []);
      setSummary(contribData.summary || []);
      setFounders(foundersData.founders || []);
      setAccounts(accountsData.accounts || []);
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

  const formatDate = (dateStr: string | number) => {
    const date = typeof dateStr === 'number' ? new Date(dateStr) : new Date(dateStr);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/internal/finance/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderId: formData.founderId,
          contributionType: formData.contributionType,
          amount: Math.round(parseFloat(formData.amount) * 100),
          currency: formData.currency,
          purpose: formData.purpose,
          toAccountId: formData.toAccountId || null,
          contributedAt: formData.contributedAt,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          founderId: '',
          contributionType: 'initial_investment',
          amount: '',
          currency: 'PKR',
          purpose: '',
          toAccountId: '',
          contributedAt: new Date().toISOString().split('T')[0],
          notes: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create contribution:', error);
    }
  };

  const totalContributions = summary.reduce((sum, s) => sum + s.totalContributions, 0);

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
          <h1 className={styles.pageTitle}>Founder Contributions</h1>
          <p className={styles.pageSubtitle}>
            Track capital investments and contributions from founders
          </p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => setShowModal(true)}
        >
          + Record Contribution
        </button>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Contributions</div>
          <div className={styles.statValue}>{formatCurrency(totalContributions)}</div>
          <div className={styles.statChange}>all founders</div>
        </div>
        {summary.map((s) => (
          <div key={s.founderId} className={styles.statCard}>
            <div className={styles.statLabel}>{s.founderName}</div>
            <div className={styles.statValue}>{formatCurrency(s.totalContributions)}</div>
            <div className={styles.statChange}>{s.contributionCount} contributions</div>
          </div>
        ))}
      </div>

      {/* Contribution Balance */}
      {summary.length === 2 && (
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Contribution Balance</h2>
          </div>
          <div style={{ padding: '1rem' }}>
            {(() => {
              const [f1, f2] = summary;
              const diff = Math.abs(f1.totalContributions - f2.totalContributions);
              const higher = f1.totalContributions > f2.totalContributions ? f1 : f2;
              const lower = f1.totalContributions > f2.totalContributions ? f2 : f1;
              
              if (diff === 0) {
                return (
                  <div style={{ color: '#10b981', fontWeight: 500 }}>
                    ✓ Contributions are perfectly balanced
                  </div>
                );
              }
              
              return (
                <div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>{higher.founderName}</strong> has contributed {formatCurrency(diff)} more than <strong>{lower.founderName}</strong>
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    To balance: {lower.founderName} needs to contribute {formatCurrency(diff / 2)} more,
                    or {higher.founderName} needs to receive {formatCurrency(diff / 2)} back
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Contributions List */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Contribution History</h2>
        </div>
        
        {contributions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No contributions recorded yet</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              Record the initial domain investment to get started
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Founder</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Deposited To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contrib) => (
                <tr key={contrib.id}>
                  <td>{formatDate(contrib.contributedAt)}</td>
                  <td style={{ fontWeight: 600 }}>{contrib.founderName}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: contrib.contributionType === 'initial_investment' ? '#3b82f620' : '#10b98120',
                      color: contrib.contributionType === 'initial_investment' ? '#3b82f6' : '#10b981',
                    }}>
                      {CONTRIBUTION_TYPES.find(t => t.value === contrib.contributionType)?.label || contrib.contributionType}
                    </span>
                  </td>
                  <td>{contrib.purpose || '-'}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>
                    +{formatCurrency(contrib.amount)}
                  </td>
                  <td>{contrib.accountName || '-'}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: contrib.status === 'confirmed' ? '#10b98120' : '#f59e0b20',
                      color: contrib.status === 'confirmed' ? '#10b981' : '#f59e0b',
                    }}>
                      {contrib.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Add Initial Investment Notice */}
      {contributions.length === 0 && (
        <div className={styles.card} style={{ marginTop: '1.5rem', borderColor: '#3b82f640' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle} style={{ color: '#3b82f6' }}>💡 Initial Investment</h2>
          </div>
          <div style={{ padding: '1rem', fontSize: '14px' }}>
            <p style={{ marginBottom: '0.5rem' }}>Based on your information, here's the initial investment breakdown:</p>
            <ul style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
              <li>Total domain cost: <strong>PKR 2,807</strong></li>
              <li>Azan contributed: <strong>PKR 935</strong></li>
              <li>Ghulam Mujtaba contributed: <strong>PKR 1,872</strong> (2807 - 935)</li>
            </ul>
            <p style={{ opacity: 0.7 }}>
              Click "Record Contribution" to add these initial investments.
            </p>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Record Contribution</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Founder *</label>
                  <select
                    className={styles.select}
                    value={formData.founderId}
                    onChange={(e) => setFormData({ ...formData, founderId: e.target.value })}
                    required
                  >
                    <option value="">Select founder...</option>
                    {founders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type *</label>
                  <select
                    className={styles.select}
                    value={formData.contributionType}
                    onChange={(e) => setFormData({ ...formData, contributionType: e.target.value })}
                    required
                  >
                    {CONTRIBUTION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
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
                    placeholder="e.g., 1872"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date *</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.contributedAt}
                    onChange={(e) => setFormData({ ...formData, contributedAt: e.target.value })}
                    required
                  />
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Purpose *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g., Initial domain purchase contribution"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Deposited To Account</label>
                  <select
                    className={styles.select}
                    value={formData.toAccountId}
                    onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                  >
                    <option value="">Not deposited yet</option>
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
                  Record Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
