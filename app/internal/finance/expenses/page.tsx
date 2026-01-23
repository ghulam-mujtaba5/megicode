'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  category: string;
  projectId: string | null;
  projectName?: string;
  productName: string | null;
  paidByFounderId: string | null;
  paidByFounderName?: string;
  paidFromAccountId: string | null;
  paidFromAccountName?: string;
  isRecurring: boolean;
  recurringInterval: string | null;
  status: string;
  receiptUrl: string | null;
  vendor: string | null;
  expenseDate: number;
}

interface Founder {
  id: string;
  name: string;
}

interface Account {
  id: string;
  name: string;
  currentBalance: number;
  currency: string;
}

interface Project {
  id: string;
  name: string;
}

const Icons = {
  expense: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  filter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const expenseCategories = [
  { value: 'domain', label: 'Domain' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'software_subscription', label: 'Software Subscription' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'legal', label: 'Legal' },
  { value: 'office', label: 'Office' },
  { value: 'travel', label: 'Travel' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'product_development', label: 'Product Development' },
  { value: 'project_cost', label: 'Project Cost' },
  { value: 'misc', label: 'Miscellaneous' },
];

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toFixed(0)}`;
}

function formatDate(timestamp: number | null) {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    currency: 'PKR',
    category: 'misc',
    projectId: '',
    productName: '',
    paidByFounderId: '',
    paidFromAccountId: '',
    isRecurring: false,
    recurringInterval: '',
    vendor: '',
    receiptUrl: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [expensesRes, foundersRes, accountsRes, projectsRes] = await Promise.all([
        fetch('/api/internal/finance/expenses'),
        fetch('/api/internal/finance/founders'),
        fetch('/api/internal/finance/accounts'),
        fetch('/api/internal/projects'),
      ]);
      
      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data.expenses || []);
      }
      if (foundersRes.ok) {
        const data = await foundersRes.json();
        setFounders(data.founders || []);
      }
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      }
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
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
      const url = editingExpense 
        ? `/api/internal/finance/expenses/${editingExpense.id}`
        : '/api/internal/finance/expenses';
      
      const res = await fetch(url, {
        method: editingExpense ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Math.round(formData.amount * 100),
          expenseDate: new Date(formData.expenseDate).getTime(),
        }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        setEditingExpense(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      amount: 0,
      currency: 'PKR',
      category: 'misc',
      projectId: '',
      productName: '',
      paidByFounderId: '',
      paidFromAccountId: '',
      isRecurring: false,
      recurringInterval: '',
      vendor: '',
      receiptUrl: '',
      expenseDate: new Date().toISOString().split('T')[0],
    });
  }

  function startEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount / 100,
      currency: expense.currency,
      category: expense.category,
      projectId: expense.projectId || '',
      productName: expense.productName || '',
      paidByFounderId: expense.paidByFounderId || '',
      paidFromAccountId: expense.paidFromAccountId || '',
      isRecurring: expense.isRecurring,
      recurringInterval: expense.recurringInterval || '',
      vendor: expense.vendor || '',
      receiptUrl: expense.receiptUrl || '',
      expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
    });
    setShowForm(true);
  }

  // Filter expenses
  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const thisMonthExpenses = filteredExpenses.filter(e => {
    const d = new Date(e.expenseDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((acc, e) => acc + e.amount, 0);

  // Group by category for summary
  const categoryTotals = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Check if any expenses were paid from pocket
  const pocketExpenses = filteredExpenses.filter(e => e.paidByFounderId && !e.paidFromAccountId);
  const totalPocketExpenses = pocketExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <Link href="/internal/finance" className={`${s.btn} ${s.btnGhost}`} style={{ marginBottom: 'var(--int-space-2)' }}>
              {Icons.back} Back to Finance
            </Link>
            <h1 className={s.pageTitle}>
              {Icons.expense} Expenses Management
            </h1>
            <p className={s.pageSubtitle}>
              Track company expenses, project costs, and subscription payments.
            </p>
          </div>
          <div className={s.pageActions}>
            <button 
              onClick={() => { setShowForm(true); setEditingExpense(null); resetForm(); }}
              className={`${s.btn} ${s.btnPrimary}`}
            >
              {Icons.plus} Add Expense
            </button>
          </div>
        </div>

        {/* Pocket Expenses Warning */}
        {totalPocketExpenses > 0 && (
          <div style={{ 
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--int-radius-lg)',
            padding: 'var(--int-space-4) var(--int-space-6)',
            marginBottom: 'var(--int-space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--int-space-3)',
          }}>
            <span style={{ color: 'var(--int-warning)' }}>{Icons.alert}</span>
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--int-warning)' }}>Pending Reimbursements</strong>
              <p style={{ margin: 0, fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                {formatMoney(totalPocketExpenses)} paid from founders&apos; pockets needs reimbursement.
              </p>
            </div>
            <Link href="/internal/finance/transfers/new?type=reimbursement" className={`${s.btn} ${s.btnWarning}`}>
              Process Reimbursement
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <section className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ color: 'var(--int-danger)', fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalExpenses)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Total Expenses</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ color: 'var(--int-warning)', fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(thisMonthExpenses)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>This Month</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {filteredExpenses.length}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Total Records</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ color: 'var(--int-warning)', fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalPocketExpenses)}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>To Reimburse</div>
            </div>
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className={s.modal} onClick={() => setShowForm(false)}>
            <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className={s.modalHeader}>
                <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
                <button onClick={() => setShowForm(false)} className={s.modalClose}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={s.modalBody} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <div className={s.formGroup}>
                    <label className={s.label}>Expense Title *</label>
                    <input
                      type="text"
                      className={s.input}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., megicode.com Domain Renewal"
                      required
                    />
                  </div>

                  <div className={s.formRow}>
                    <div className={s.formGroup}>
                      <label className={s.label}>Amount *</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                        <select
                          className={s.select}
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          style={{ width: '100px' }}
                        >
                          <option value="PKR">PKR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                        <input
                          type="number"
                          className={s.input}
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className={s.formGroup}>
                      <label className={s.label}>Date *</label>
                      <input
                        type="date"
                        className={s.input}
                        value={formData.expenseDate}
                        onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className={s.formRow}>
                    <div className={s.formGroup}>
                      <label className={s.label}>Category *</label>
                      <select
                        className={s.select}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        {expenseCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className={s.formGroup}>
                      <label className={s.label}>Vendor/Paid To</label>
                      <input
                        type="text"
                        className={s.input}
                        value={formData.vendor}
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                        placeholder="e.g., Namecheap"
                      />
                    </div>
                  </div>

                  <div className={s.formGroup}>
                    <label className={s.label}>Description</label>
                    <textarea
                      className={s.textarea}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Additional details about this expense..."
                      rows={2}
                    />
                  </div>

                  <div className={s.formGroup}>
                    <label className={s.label}>Link to Project (if project-specific)</label>
                    <select
                      className={s.select}
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    >
                      <option value="">Not project-specific (Company expense)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {formData.category === 'product_development' && (
                    <div className={s.formGroup}>
                      <label className={s.label}>Product Name</label>
                      <input
                        type="text"
                        className={s.input}
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder="e.g., Megicode Mobile App"
                      />
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--int-border)', margin: 'var(--int-space-4) 0' }} />
                  
                  <p style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)' }}>Payment Source</p>

                  <div className={s.formRow}>
                    <div className={s.formGroup}>
                      <label className={s.label}>Paid from Company Account</label>
                      <select
                        className={s.select}
                        value={formData.paidFromAccountId}
                        onChange={(e) => setFormData({ ...formData, paidFromAccountId: e.target.value, paidByFounderId: e.target.value ? '' : formData.paidByFounderId })}
                      >
                        <option value="">Not from company account</option>
                        {accounts.filter(a => a.currentBalance !== undefined).map((a) => (
                          <option key={a.id} value={a.id}>{a.name} ({formatMoney(a.currentBalance, a.currency)})</option>
                        ))}
                      </select>
                    </div>
                    <div className={s.formGroup}>
                      <label className={s.label}>OR Paid from Founder&apos;s Pocket</label>
                      <select
                        className={s.select}
                        value={formData.paidByFounderId}
                        onChange={(e) => setFormData({ ...formData, paidByFounderId: e.target.value, paidFromAccountId: e.target.value ? '' : formData.paidFromAccountId })}
                      >
                        <option value="">Not from pocket</option>
                        {founders.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                      {formData.paidByFounderId && !formData.paidFromAccountId && (
                        <p style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-warning)', marginTop: 'var(--int-space-1)' }}>
                          This will need reimbursement later
                        </p>
                      )}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--int-border)', margin: 'var(--int-space-4) 0' }} />

                  <div className={s.formGroup}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      />
                      <span>This is a recurring expense</span>
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <div className={s.formGroup}>
                      <label className={s.label}>Recurring Interval</label>
                      <select
                        className={s.select}
                        value={formData.recurringInterval}
                        onChange={(e) => setFormData({ ...formData, recurringInterval: e.target.value })}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  )}

                  <div className={s.formGroup}>
                    <label className={s.label}>Receipt/Proof URL</label>
                    <input
                      type="url"
                      className={s.input}
                      value={formData.receiptUrl}
                      onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className={s.modalFooter}>
                  <button type="button" onClick={() => setShowForm(false)} className={`${s.btn} ${s.btnSecondary}`}>
                    Cancel
                  </button>
                  <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter & Expenses List */}
        <div className={s.card}>
          <div className={s.cardHeader} style={{ flexWrap: 'wrap', gap: 'var(--int-space-3)' }}>
            <h2 className={s.cardTitle}>All Expenses</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
              {Icons.filter}
              <select
                className={s.select}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Categories</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>Loading...</div>
            ) : filteredExpenses.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                <p>No expenses recorded yet.</p>
                <button 
                  onClick={() => { setShowForm(true); resetForm(); }}
                  className={`${s.btn} ${s.btnPrimary}`}
                  style={{ marginTop: 'var(--int-space-4)' }}
                >
                  {Icons.plus} Add First Expense
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Paid From</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{expense.title}</div>
                        {expense.vendor && (
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{expense.vendor}</div>
                        )}
                        {expense.projectName && (
                          <span className={s.badge} style={{ marginTop: 'var(--int-space-1)', fontSize: 'var(--int-text-xs)' }}>
                            {expense.projectName}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={s.badge}>{expense.category.replace('_', ' ')}</span>
                        {expense.isRecurring && (
                          <span className={`${s.badge}`} style={{ marginLeft: 'var(--int-space-1)', fontSize: 'var(--int-text-xs)', background: 'var(--int-info-light)', color: 'var(--int-info)' }}>
                            {expense.recurringInterval}
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--int-danger)' }}>
                        -{formatMoney(expense.amount, expense.currency)}
                      </td>
                      <td>
                        {expense.paidFromAccountName ? (
                          <span style={{ fontSize: 'var(--int-text-sm)' }}>{expense.paidFromAccountName}</span>
                        ) : expense.paidByFounderName ? (
                          <div>
                            <span style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-warning)' }}>{expense.paidByFounderName}&apos;s pocket</span>
                            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-warning)' }}>Needs reimbursement</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--int-text-muted)' }}>-</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                        {formatDate(expense.expenseDate)}
                      </td>
                      <td>
                        <button onClick={() => startEdit(expense)} className={`${s.btn} ${s.btnGhost}`}>{Icons.edit}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className={s.card} style={{ marginTop: 'var(--int-space-6)' }}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Category Breakdown</h2>
            </div>
            <div className={s.cardBody}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--int-space-4)' }}>
                {Object.entries(categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, total]) => (
                    <div key={cat} style={{ 
                      padding: 'var(--int-space-4)',
                      background: 'var(--int-bg-alt)',
                      borderRadius: 'var(--int-radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{cat.replace('_', ' ')}</span>
                      <span style={{ fontWeight: 600, color: 'var(--int-danger)' }}>{formatMoney(total)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
