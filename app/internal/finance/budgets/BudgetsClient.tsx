'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface BudgetCategory {
  id: string;
  budgetId: string;
  category: string | null;
  allocatedAmount: number;
  alertThreshold: number;
  notes: string | null;
  actualSpending: number;
  percentUsed: number;
}

interface Budget {
  id: string;
  name: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  status: 'active' | 'draft' | 'closed';
  notes: string | null;
  createdAt: Date | string | null;
  categories: BudgetCategory[];
  totalAllocated: number;
  totalSpent: number;
}

interface BudgetsClientProps {
  budgets: Budget[];
  categoryOptions: string[];
  activeBudgetId: string | null;
}

const Icons = {
  budget: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  x: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const categoryLabels: Record<string, string> = {
  domain: 'Domain',
  hosting: 'Hosting',
  software_subscription: 'Software Subscription',
  hardware: 'Hardware',
  marketing: 'Marketing',
  legal: 'Legal',
  office: 'Office',
  payroll: 'Payroll',
  utilities: 'Utilities',
  travel: 'Travel',
  misc: 'Miscellaneous',
};

const categoryColors: Record<string, string> = {
  domain: '#8b5cf6',
  hosting: '#06b6d4',
  software_subscription: '#3b82f6',
  hardware: '#6366f1',
  marketing: '#ec4899',
  legal: '#f59e0b',
  office: '#84cc16',
  payroll: '#22c55e',
  utilities: '#f97316',
  travel: '#14b8a6',
  misc: '#94a3b8',
};

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toFixed(0)}`;
}

export default function BudgetsClient({ 
  budgets, 
  categoryOptions, 
  activeBudgetId 
}: BudgetsClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(
    budgets.find(b => b.id === activeBudgetId) || budgets[0] || null
  );

  // Form state for new budget
  const [newBudget, setNewBudget] = useState({
    name: '',
    period: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    totalBudget: '',
    status: 'draft' as 'draft' | 'active',
    categories: [] as { category: string; amount: string; alertThreshold: string }[],
  });

  const handleAddCategory = () => {
    setNewBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { category: '', amount: '', alertThreshold: '80' }],
    }));
  };

  const handleRemoveCategory = (index: number) => {
    setNewBudget(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (index: number, field: string, value: string) => {
    setNewBudget(prev => ({
      ...prev,
      categories: prev.categories.map((c, i) => i === index ? { ...c, [field]: value } : c),
    }));
  };

  const handleCreateBudget = async () => {
    // In real implementation, this would call an API
    alert('Budget creation API would be called here');
    setShowCreateModal(false);
  };

  const activeBudget = budgets.find(b => b.id === activeBudgetId);
  const overBudgetCategories = selectedBudget?.categories.filter(c => c.percentUsed >= c.alertThreshold) || [];

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <Link href="/internal/finance" className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
              {Icons.back}
            </Link>
            <div>
              <h1 className={s.pageTitle}>{Icons.budget} Budget Management</h1>
              <p className={s.pageSubtitle}>
                Create budgets and track spending against allocations
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className={`${s.btn} ${s.btnPrimary}`}
          >
            {Icons.plus} New Budget
          </button>
        </div>

        {/* Alert for over-budget categories */}
        {overBudgetCategories.length > 0 && (
          <div className={s.card} style={{ 
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: 'var(--int-space-6)'
          }}>
            <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
              <span style={{ color: 'var(--int-danger)' }}>{Icons.warning}</span>
              <div>
                <strong style={{ color: 'var(--int-danger)' }}>
                  {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies' : 'y'} over budget threshold
                </strong>
                <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                  {overBudgetCategories.map(c => categoryLabels[c.category || 'misc'] || c.category).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={s.grid3}>
          {/* Budget List */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Budgets</h2>
            </div>
            <div className={s.cardBody} style={{ padding: 0 }}>
              {budgets.length === 0 ? (
                <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                  No budgets created yet
                </div>
              ) : (
                budgets.map(budget => (
                  <div
                    key={budget.id}
                    onClick={() => setSelectedBudget(budget)}
                    style={{
                      padding: 'var(--int-space-4)',
                      borderBottom: '1px solid var(--int-border)',
                      cursor: 'pointer',
                      background: selectedBudget?.id === budget.id ? 'var(--int-surface-elevated)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-2)' }}>
                      <span style={{ fontWeight: 600 }}>{budget.name}</span>
                      <span 
                        className={s.badge}
                        style={{
                          background: budget.status === 'active' ? 'var(--int-success-light)' : 
                                      budget.status === 'draft' ? 'var(--int-warning-light)' : 'var(--int-surface-elevated)',
                          color: budget.status === 'active' ? 'var(--int-success)' : 
                                 budget.status === 'draft' ? 'var(--int-warning)' : 'var(--int-text-muted)',
                        }}
                      >
                        {budget.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                      {budget.period} • {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginTop: 'var(--int-space-2)',
                      fontSize: 'var(--int-text-sm)'
                    }}>
                      <span>Allocated: {formatMoney(budget.totalAllocated)}</span>
                      <span style={{ color: budget.totalSpent > budget.totalBudget ? 'var(--int-danger)' : 'var(--int-text)' }}>
                        Spent: {formatMoney(budget.totalSpent)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Budget Details */}
          <div style={{ gridColumn: 'span 2' }}>
            {selectedBudget ? (
              <div className={s.card}>
                <div className={s.cardHeader}>
                  <div>
                    <h2 className={s.cardTitle}>{selectedBudget.name}</h2>
                    <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', margin: 0 }}>
                      {new Date(selectedBudget.startDate).toLocaleDateString()} - {new Date(selectedBudget.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--int-space-4)', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>Total Budget</div>
                      <div style={{ fontSize: 'var(--int-text-xl)', fontWeight: 700 }}>{formatMoney(selectedBudget.totalBudget)}</div>
                    </div>
                  </div>
                </div>
                <div className={s.cardBody}>
                  {/* Overall Progress */}
                  <div style={{ marginBottom: 'var(--int-space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-2)' }}>
                      <span style={{ fontWeight: 600 }}>Overall Spending</span>
                      <span>
                        {formatMoney(selectedBudget.totalSpent)} / {formatMoney(selectedBudget.totalBudget)}
                        <span style={{ 
                          marginLeft: 'var(--int-space-2)', 
                          color: (selectedBudget.totalSpent / selectedBudget.totalBudget * 100) > 100 
                            ? 'var(--int-danger)' 
                            : 'var(--int-text-muted)'
                        }}>
                          ({((selectedBudget.totalSpent / selectedBudget.totalBudget) * 100).toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div style={{ 
                      height: '12px', 
                      background: 'var(--int-surface-elevated)', 
                      borderRadius: 'var(--int-radius)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%',
                        width: `${Math.min(100, (selectedBudget.totalSpent / selectedBudget.totalBudget) * 100)}%`,
                        background: (selectedBudget.totalSpent / selectedBudget.totalBudget * 100) > 100 
                          ? 'var(--int-danger)' 
                          : (selectedBudget.totalSpent / selectedBudget.totalBudget * 100) > 80 
                            ? 'var(--int-warning)' 
                            : 'var(--int-success)',
                        borderRadius: 'var(--int-radius)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <h3 style={{ fontWeight: 600, marginBottom: 'var(--int-space-4)' }}>Category Allocations</h3>
                  {selectedBudget.categories.length === 0 ? (
                    <div style={{ color: 'var(--int-text-muted)', textAlign: 'center', padding: 'var(--int-space-6)' }}>
                      No categories allocated for this budget
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-4)' }}>
                      {selectedBudget.categories.map(cat => {
                        const isOverThreshold = cat.percentUsed >= cat.alertThreshold;
                        const isOverBudget = cat.percentUsed >= 100;
                        
                        return (
                          <div key={cat.id} style={{ 
                            padding: 'var(--int-space-4)',
                            background: 'var(--int-surface-elevated)',
                            borderRadius: 'var(--int-radius)',
                            border: isOverBudget ? '1px solid var(--int-danger)' : '1px solid var(--int-border)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-2)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                                <span style={{ 
                                  width: '12px', 
                                  height: '12px', 
                                  borderRadius: '3px',
                                  background: categoryColors[cat.category || 'misc'] || '#94a3b8'
                                }} />
                                <span style={{ fontWeight: 600 }}>
                                  {categoryLabels[cat.category || 'misc'] || cat.category}
                                </span>
                                {isOverThreshold && (
                                  <span style={{ color: isOverBudget ? 'var(--int-danger)' : 'var(--int-warning)' }}>
                                    {Icons.warning}
                                  </span>
                                )}
                              </div>
                              <span style={{ 
                                fontWeight: 500,
                                color: isOverBudget ? 'var(--int-danger)' : 'var(--int-text)'
                              }}>
                                {formatMoney(cat.actualSpending)} / {formatMoney(cat.allocatedAmount)}
                              </span>
                            </div>
                            <div style={{ 
                              height: '8px', 
                              background: 'var(--int-surface)', 
                              borderRadius: 'var(--int-radius-sm)',
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                height: '100%',
                                width: `${Math.min(100, cat.percentUsed)}%`,
                                background: isOverBudget 
                                  ? 'var(--int-danger)' 
                                  : isOverThreshold 
                                    ? 'var(--int-warning)' 
                                    : categoryColors[cat.category || 'misc'] || '#94a3b8',
                                borderRadius: 'var(--int-radius-sm)',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              marginTop: 'var(--int-space-2)',
                              fontSize: 'var(--int-text-xs)',
                              color: 'var(--int-text-muted)'
                            }}>
                              <span>{cat.percentUsed.toFixed(1)}% used</span>
                              <span>Alert at {cat.alertThreshold}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Notes */}
                  {selectedBudget.notes && (
                    <div style={{ marginTop: 'var(--int-space-6)' }}>
                      <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-2)' }}>Notes</h4>
                      <p style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                        {selectedBudget.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={s.card}>
                <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-12)' }}>
                  <p style={{ color: 'var(--int-text-muted)' }}>Select a budget to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Create New Budget</h2>
              <button onClick={() => setShowCreateModal(false)} className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
                {Icons.x}
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.grid2}>
                <div className={s.formGroup}>
                  <label className={s.label}>Budget Name</label>
                  <input
                    type="text"
                    className={s.input}
                    value={newBudget.name}
                    onChange={e => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Q1 2025 Budget"
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.label}>Period</label>
                  <select
                    className={s.select}
                    value={newBudget.period}
                    onChange={e => setNewBudget(prev => ({ ...prev, period: e.target.value as 'monthly' | 'quarterly' | 'yearly' }))}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className={s.grid2}>
                <div className={s.formGroup}>
                  <label className={s.label}>Total Budget (PKR)</label>
                  <input
                    type="number"
                    className={s.input}
                    value={newBudget.totalBudget}
                    onChange={e => setNewBudget(prev => ({ ...prev, totalBudget: e.target.value }))}
                    placeholder="500000"
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.label}>Status</label>
                  <select
                    className={s.select}
                    value={newBudget.status}
                    onChange={e => setNewBudget(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              {/* Category Allocations */}
              <div style={{ marginTop: 'var(--int-space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-4)' }}>
                  <label className={s.label} style={{ margin: 0 }}>Category Allocations</label>
                  <button onClick={handleAddCategory} className={`${s.btn} ${s.btnGhost}`} type="button">
                    {Icons.plus} Add Category
                  </button>
                </div>
                
                {newBudget.categories.length === 0 ? (
                  <div style={{ color: 'var(--int-text-muted)', textAlign: 'center', padding: 'var(--int-space-4)' }}>
                    No categories added yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                    {newBudget.categories.map((cat, index) => (
                      <div key={index} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 120px 80px auto',
                        gap: 'var(--int-space-2)',
                        alignItems: 'center'
                      }}>
                        <select
                          className={s.select}
                          value={cat.category}
                          onChange={e => handleCategoryChange(index, 'category', e.target.value)}
                        >
                          <option value="">Select category</option>
                          {categoryOptions.map(opt => (
                            <option key={opt} value={opt}>{categoryLabels[opt] || opt}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className={s.input}
                          value={cat.amount}
                          onChange={e => handleCategoryChange(index, 'amount', e.target.value)}
                          placeholder="Amount"
                        />
                        <input
                          type="number"
                          className={s.input}
                          value={cat.alertThreshold}
                          onChange={e => handleCategoryChange(index, 'alertThreshold', e.target.value)}
                          placeholder="Alert %"
                        />
                        <button 
                          onClick={() => handleRemoveCategory(index)} 
                          className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                          type="button"
                          style={{ color: 'var(--int-danger)' }}
                        >
                          {Icons.trash}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={s.modalFooter}>
              <button onClick={() => setShowCreateModal(false)} className={`${s.btn} ${s.btnGhost}`}>
                Cancel
              </button>
              <button onClick={handleCreateBudget} className={`${s.btn} ${s.btnPrimary}`}>
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
