'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface Founder {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profitSharePercentage: number;
  status: 'active' | 'inactive';
  joinedAt: Date | string | number;
  notes: string | null;
  totalContributions?: number;
  totalDistributions?: number;
}

const Icons = {
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
};

function formatMoney(amountInSmallestUnit: number, currency: string = 'PKR') {
  const amount = (amountInSmallestUnit || 0) / 100;
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toFixed(0)}`;
}

function formatDate(timestamp: Date | string | number | null) {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profitSharePercentage: 50,
    notes: '',
  });

  useEffect(() => {
    fetchFounders();
  }, []);

  async function fetchFounders() {
    try {
      const res = await fetch('/api/internal/finance/founders');
      if (res.ok) {
        const data = await res.json();
        setFounders(data.founders || []);
      }
    } catch (error) {
      console.error('Failed to fetch founders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingFounder 
        ? `/api/internal/finance/founders/${editingFounder.id}`
        : '/api/internal/finance/founders';
      
      const res = await fetch(url, {
        method: editingFounder ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchFounders();
        setShowForm(false);
        setEditingFounder(null);
        setFormData({ name: '', email: '', phone: '', profitSharePercentage: 50, notes: '' });
      }
    } catch (error) {
      console.error('Failed to save founder:', error);
    }
  }

  function startEdit(founder: Founder) {
    setEditingFounder(founder);
    setFormData({
      name: founder.name,
      email: founder.email || '',
      phone: founder.phone || '',
      profitSharePercentage: founder.profitSharePercentage,
      notes: founder.notes || '',
    });
    setShowForm(true);
  }

  // Calculate total share percentage
  const totalSharePercentage = founders.reduce((acc, f) => acc + f.profitSharePercentage, 0);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <Link href="/internal/finance" className={`${s.btn} ${s.btnGhost}`} style={{ marginBottom: 'var(--int-space-2)' }}>
              {Icons.back} Back to Finance
            </Link>
            <h1 className={s.pageTitle}>
              {Icons.users} Founders Management
            </h1>
            <p className={s.pageSubtitle}>
              Manage company founders, profit shares, and track contributions.
            </p>
          </div>
          <div className={s.pageActions}>
            <button 
              onClick={() => { setShowForm(true); setEditingFounder(null); setFormData({ name: '', email: '', phone: '', profitSharePercentage: 50, notes: '' }); }}
              className={`${s.btn} ${s.btnPrimary}`}
            >
              {Icons.plus} Add Founder
            </button>
          </div>
        </div>

        {/* Share Distribution Overview */}
        <section className={s.grid3} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ fontSize: 'var(--int-text-3xl)', fontWeight: 700 }}>{founders.length}</div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Active Founders</div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ 
                fontSize: 'var(--int-text-3xl)', 
                fontWeight: 700,
                color: totalSharePercentage === 100 ? 'var(--int-success)' : 'var(--int-warning)'
              }}>
                {totalSharePercentage}%
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Total Shares Allocated</div>
              {totalSharePercentage !== 100 && (
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-warning)', marginTop: 'var(--int-space-1)' }}>
                  Should equal 100%
                </div>
              )}
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-5)' }}>
              <div style={{ fontSize: 'var(--int-text-3xl)', fontWeight: 700 }}>
                {formatMoney(founders.reduce((acc, f) => acc + (f.totalContributions || 0), 0))}
              </div>
              <div style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>Total Contributions</div>
            </div>
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className={s.modal} onClick={() => setShowForm(false)}>
            <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className={s.modalHeader}>
                <h2>{editingFounder ? 'Edit Founder' : 'Add New Founder'}</h2>
                <button onClick={() => setShowForm(false)} className={s.modalClose}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={s.modalBody}>
                  <div className={s.formGroup}>
                    <label className={s.label}>Full Name *</label>
                    <input
                      type="text"
                      className={s.input}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Ghulam Mujtaba"
                      required
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label}>Email</label>
                    <input
                      type="email"
                      className={s.input}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="founder@megicode.com"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label}>Phone</label>
                    <input
                      type="tel"
                      className={s.input}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label}>Profit Share Percentage *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-3)' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.profitSharePercentage}
                        onChange={(e) => setFormData({ ...formData, profitSharePercentage: parseInt(e.target.value) })}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontWeight: 600, minWidth: '50px' }}>{formData.profitSharePercentage}%</span>
                    </div>
                    <p style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                      Percentage of distributable profit this founder receives
                    </p>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label}>Notes</label>
                    <textarea
                      className={s.textarea}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional notes about this founder..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className={s.modalFooter}>
                  <button type="button" onClick={() => setShowForm(false)} className={`${s.btn} ${s.btnSecondary}`}>
                    Cancel
                  </button>
                  <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>
                    {editingFounder ? 'Update Founder' : 'Add Founder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Founders List */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>All Founders</h2>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                Loading founders...
              </div>
            ) : founders.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                <p>No founders added yet.</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className={`${s.btn} ${s.btnPrimary}`}
                  style={{ marginTop: 'var(--int-space-4)' }}
                >
                  {Icons.plus} Add First Founder
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Founder</th>
                    <th>Contact</th>
                    <th>Profit Share</th>
                    <th>Contributions</th>
                    <th>Distributions</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {founders.map((founder) => (
                    <tr key={founder.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 'var(--int-text-base)' }}>{founder.name}</div>
                        <span className={`${s.badge} ${founder.status === 'active' ? s.badgeSuccess : s.badgeWarning}`}>
                          {founder.status}
                        </span>
                      </td>
                      <td>
                        {founder.email && <div style={{ fontSize: 'var(--int-text-sm)' }}>{founder.email}</div>}
                        {founder.phone && <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{founder.phone}</div>}
                        {!founder.email && !founder.phone && <span style={{ color: 'var(--int-text-muted)' }}>-</span>}
                      </td>
                      <td>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--int-space-2)' 
                        }}>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            background: 'var(--int-border)', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${founder.profitSharePercentage}%`, 
                              height: '100%', 
                              background: 'var(--int-primary)',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontWeight: 600 }}>{founder.profitSharePercentage}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--int-success)', fontWeight: 600 }}>
                        {formatMoney(founder.totalContributions || 0)}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatMoney(founder.totalDistributions || 0)}
                      </td>
                      <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                        {formatDate(founder.joinedAt)}
                      </td>
                      <td>
                        <button 
                          onClick={() => startEdit(founder)}
                          className={`${s.btn} ${s.btnGhost}`}
                          title="Edit"
                        >
                          {Icons.edit}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className={s.card} style={{ marginTop: 'var(--int-space-6)' }}>
          <div className={s.cardBody}>
            <h3 style={{ marginBottom: 'var(--int-space-3)' }}>How Profit Sharing Works</h3>
            <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', lineHeight: 1.6 }}>
              <p><strong>1. Project Revenue</strong> - When a project is completed and payment is received.</p>
              <p><strong>2. Expense Deduction</strong> - Project-specific expenses are deducted from revenue.</p>
              <p><strong>3. Company Retention</strong> - 10% (configurable) is retained in the company account for operations.</p>
              <p><strong>4. Profit Distribution</strong> - Remaining profit is distributed to founders based on their share percentage.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
