'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface Account {
  id: string;
  name: string;
  accountType: 'company_central' | 'founder_personal' | 'operations' | 'savings';
  founderId: string | null;
  founderName?: string;
  bankName: string | null;
  accountNumber: string | null;
  walletProvider: string | null;
  currency: string;
  currentBalance: number;
  status: 'active' | 'inactive' | 'frozen';
  isPrimary: boolean;
  notes: string | null;
}

interface Founder {
  id: string;
  name: string;
}

const Icons = {
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  bank: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
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

const accountTypeLabels: Record<string, string> = {
  'company_central': 'Company Central',
  'founder_personal': 'Founder Personal',
  'operations': 'Operations',
  'savings': 'Savings',
};

const accountTypeColors: Record<string, { bg: string; text: string }> = {
  'company_central': { bg: 'var(--int-primary-light)', text: 'var(--int-primary)' },
  'founder_personal': { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--int-success)' },
  'operations': { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--int-warning)' },
  'savings': { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--int-info)' },
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    accountType: 'company_central' as Account['accountType'],
    founderId: '',
    bankName: '',
    accountNumber: '',
    walletProvider: '',
    currency: 'PKR',
    currentBalance: 0,
    isPrimary: false,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [accountsRes, foundersRes] = await Promise.all([
        fetch('/api/internal/finance/accounts'),
        fetch('/api/internal/finance/founders'),
      ]);
      
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      }
      
      if (foundersRes.ok) {
        const data = await foundersRes.json();
        setFounders(data.founders || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingAccount 
        ? `/api/internal/finance/accounts/${editingAccount.id}`
        : '/api/internal/finance/accounts';
      
      const res = await fetch(url, {
        method: editingAccount ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentBalance: Math.round(formData.currentBalance * 100), // Convert to smallest unit
        }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        setEditingAccount(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      accountType: 'company_central',
      founderId: '',
      bankName: '',
      accountNumber: '',
      walletProvider: '',
      currency: 'PKR',
      currentBalance: 0,
      isPrimary: false,
      notes: '',
    });
  }

  function startEdit(account: Account) {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      accountType: account.accountType,
      founderId: account.founderId || '',
      bankName: account.bankName || '',
      accountNumber: account.accountNumber || '',
      walletProvider: account.walletProvider || '',
      currency: account.currency,
      currentBalance: account.currentBalance / 100,
      isPrimary: account.isPrimary,
      notes: account.notes || '',
    });
    setShowForm(true);
  }

  // Group accounts by type
  const companyAccounts = accounts.filter(a => a.accountType === 'company_central');
  const founderAccounts = accounts.filter(a => a.accountType === 'founder_personal');
  const otherAccounts = accounts.filter(a => !['company_central', 'founder_personal'].includes(a.accountType));

  // Calculate totals
  const totalCompanyBalance = companyAccounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const totalFounderBalance = founderAccounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const totalAllBalance = accounts.reduce((acc, a) => acc + a.currentBalance, 0);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <Link href="/internal/finance" className={`${s.btn} ${s.btnGhost}`} style={{ marginBottom: 'var(--int-space-2)' }}>
              {Icons.back} Back to Finance
            </Link>
            <h1 className={s.pageTitle}>
              {Icons.wallet} Accounts Management
            </h1>
            <p className={s.pageSubtitle}>
              Manage bank accounts, wallets, and track balances.
            </p>
          </div>
          <div className={s.pageActions}>
            <button 
              onClick={() => { setShowForm(true); setEditingAccount(null); resetForm(); }}
              className={`${s.btn} ${s.btnPrimary}`}
            >
              {Icons.plus} Add Account
            </button>
          </div>
        </div>

        {/* Balance Overview */}
        <section className={s.grid3} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ color: 'var(--int-primary)', fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalCompanyBalance)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Company Balance</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ color: 'var(--int-success)', fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalFounderBalance)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Founder Accounts Total</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalAllBalance)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Total All Accounts</div>
            </div>
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className={s.modal} onClick={() => setShowForm(false)}>
            <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
              <div className={s.modalHeader}>
                <h2>{editingAccount ? 'Edit Account' : 'Add New Account'}</h2>
                <button onClick={() => setShowForm(false)} className={s.modalClose}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={s.modalBody}>
                  <div className={s.formGroup}>
                    <label className={s.label}>Account Name *</label>
                    <input
                      type="text"
                      className={s.input}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Megicode Main Account"
                      required
                    />
                  </div>
                  
                  <div className={s.formRow}>
                    <div className={s.formGroup}>
                      <label className={s.label}>Account Type *</label>
                      <select
                        className={s.select}
                        value={formData.accountType}
                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value as Account['accountType'] })}
                        required
                      >
                        <option value="company_central">Company Central</option>
                        <option value="founder_personal">Founder Personal</option>
                        <option value="operations">Operations</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                    
                    <div className={s.formGroup}>
                      <label className={s.label}>Currency</label>
                      <select
                        className={s.select}
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      >
                        <option value="PKR">PKR (Pakistani Rupee)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                      </select>
                    </div>
                  </div>

                  {formData.accountType === 'founder_personal' && (
                    <div className={s.formGroup}>
                      <label className={s.label}>Founder *</label>
                      <select
                        className={s.select}
                        value={formData.founderId}
                        onChange={(e) => setFormData({ ...formData, founderId: e.target.value })}
                        required
                      >
                        <option value="">Select Founder</option>
                        {founders.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={s.formRow}>
                    <div className={s.formGroup}>
                      <label className={s.label}>Bank Name</label>
                      <input
                        type="text"
                        className={s.input}
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="e.g., Meezan Bank"
                      />
                    </div>
                    <div className={s.formGroup}>
                      <label className={s.label}>Account # (Last 4 digits)</label>
                      <input
                        type="text"
                        className={s.input}
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="e.g., 1234"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className={s.formGroup}>
                    <label className={s.label}>Wallet Provider (if applicable)</label>
                    <select
                      className={s.select}
                      value={formData.walletProvider}
                      onChange={(e) => setFormData({ ...formData, walletProvider: e.target.value })}
                    >
                      <option value="">Not a wallet</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Sadapay">SadaPay</option>
                      <option value="NayaPay">NayaPay</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={s.formGroup}>
                    <label className={s.label}>Current Balance</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{formData.currency}</span>
                      <input
                        type="number"
                        className={s.input}
                        value={formData.currentBalance}
                        onChange={(e) => setFormData({ ...formData, currentBalance: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                    <p style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                      Enter the current balance in this account
                    </p>
                  </div>

                  <div className={s.formGroup}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isPrimary}
                        onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                      />
                      <span className={s.label} style={{ margin: 0 }}>Primary Account</span>
                    </label>
                  </div>

                  <div className={s.formGroup}>
                    <label className={s.label}>Notes</label>
                    <textarea
                      className={s.textarea}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional notes..."
                      rows={2}
                    />
                  </div>
                </div>
                <div className={s.modalFooter}>
                  <button type="button" onClick={() => setShowForm(false)} className={`${s.btn} ${s.btnSecondary}`}>
                    Cancel
                  </button>
                  <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>
                    {editingAccount ? 'Update Account' : 'Add Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Company Central Accounts */}
        <div className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Company Central Accounts</h2>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>Loading...</div>
            ) : companyAccounts.length === 0 ? (
              <div style={{ padding: 'var(--int-space-6)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                <p>No company central accounts added yet.</p>
                <button 
                  onClick={() => { setShowForm(true); resetForm(); }}
                  className={`${s.btn} ${s.btnPrimary}`}
                  style={{ marginTop: 'var(--int-space-3)' }}
                >
                  Add Company Account
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Bank/Wallet</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companyAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{account.name}</div>
                        {account.isPrimary && (
                          <span className={`${s.badge} ${s.badgeSuccess}`} style={{ fontSize: 'var(--int-text-xs)' }}>Primary</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                          {Icons.bank}
                          <div>
                            <div style={{ fontSize: 'var(--int-text-sm)' }}>{account.bankName || account.walletProvider || '-'}</div>
                            {account.accountNumber && (
                              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>****{account.accountNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)', color: account.currentBalance >= 0 ? 'var(--int-success)' : 'var(--int-danger)' }}>
                        {formatMoney(account.currentBalance, account.currency)}
                      </td>
                      <td>
                        <span className={`${s.badge} ${account.status === 'active' ? s.badgeSuccess : s.badgeWarning}`}>
                          {account.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => startEdit(account)} className={`${s.btn} ${s.btnGhost}`}>{Icons.edit}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Founder Accounts */}
        <div className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Founder Personal Accounts</h2>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {founderAccounts.length === 0 ? (
              <div style={{ padding: 'var(--int-space-6)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                No founder accounts added yet.
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Founder</th>
                    <th>Bank/Wallet</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {founderAccounts.map((account) => (
                    <tr key={account.id}>
                      <td style={{ fontWeight: 600 }}>{account.name}</td>
                      <td>{account.founderName || '-'}</td>
                      <td>
                        <div style={{ fontSize: 'var(--int-text-sm)' }}>{account.bankName || account.walletProvider || '-'}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--int-success)' }}>
                        {formatMoney(account.currentBalance, account.currency)}
                      </td>
                      <td>
                        <button onClick={() => startEdit(account)} className={`${s.btn} ${s.btnGhost}`}>{Icons.edit}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Other Accounts */}
        {otherAccounts.length > 0 && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Other Accounts</h2>
            </div>
            <div className={s.cardBody} style={{ padding: 0 }}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Bank/Wallet</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {otherAccounts.map((account) => (
                    <tr key={account.id}>
                      <td style={{ fontWeight: 600 }}>{account.name}</td>
                      <td>
                        <span className={s.badge} style={{ 
                          background: accountTypeColors[account.accountType]?.bg,
                          color: accountTypeColors[account.accountType]?.text
                        }}>
                          {accountTypeLabels[account.accountType]}
                        </span>
                      </td>
                      <td>{account.bankName || account.walletProvider || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{formatMoney(account.currentBalance, account.currency)}</td>
                      <td>
                        <button onClick={() => startEdit(account)} className={`${s.btn} ${s.btnGhost}`}>{Icons.edit}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
