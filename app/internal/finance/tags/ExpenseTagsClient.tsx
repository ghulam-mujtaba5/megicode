'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface ExpenseTag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  createdAt: string | null;
  usageCount: number;
}

interface TaggedExpense {
  id: string;
  description: string | null;
  amount: number;
  date: string;
}

interface ExpenseTagsClientProps {
  tags: ExpenseTag[];
  recentTaggedExpenses: TaggedExpense[];
  tagExpenseMap: Record<string, string[]>;
}

const Icons = {
  tag: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
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
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
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
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

const defaultColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
];

function formatMoney(amountInSmallestUnit: number) {
  const amount = (amountInSmallestUnit || 0) / 100;
  return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ExpenseTagsClient({ 
  tags: initialTags, 
  recentTaggedExpenses,
  tagExpenseMap 
}: ExpenseTagsClientProps) {
  const [tags, setTags] = useState(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<ExpenseTag | null>(null);
  const [selectedTag, setSelectedTag] = useState<ExpenseTag | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: defaultColors[0],
    description: '',
  });

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setFormData({ name: '', color: defaultColors[Math.floor(Math.random() * defaultColors.length)], description: '' });
    setEditingTag(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (tag: ExpenseTag) => {
    setFormData({
      name: tag.name,
      color: tag.color || defaultColors[0],
      description: tag.description || '',
    });
    setEditingTag(tag);
    setShowCreateModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Tag name is required');
      return;
    }

    // In real implementation, this would call an API
    if (editingTag) {
      // Update existing tag
      setTags(prev => prev.map(t => 
        t.id === editingTag.id 
          ? { ...t, name: formData.name, color: formData.color, description: formData.description }
          : t
      ));
    } else {
      // Create new tag
      const newTag: ExpenseTag = {
        id: `tag_${Date.now()}`,
        name: formData.name,
        color: formData.color,
        description: formData.description,
        createdAt: new Date().toISOString(),
        usageCount: 0,
      };
      setTags(prev => [...prev, newTag]);
    }

    setShowCreateModal(false);
    setEditingTag(null);
  };

  const handleDelete = async (tag: ExpenseTag) => {
    if (!confirm(`Delete tag "${tag.name}"? This will remove the tag from all expenses.`)) {
      return;
    }
    
    // In real implementation, this would call an API
    setTags(prev => prev.filter(t => t.id !== tag.id));
    if (selectedTag?.id === tag.id) {
      setSelectedTag(null);
    }
  };

  // Get expenses for selected tag
  const selectedTagExpenses = selectedTag 
    ? recentTaggedExpenses.filter(e => tagExpenseMap[selectedTag.id]?.includes(e.id))
    : [];

  // Total amount tagged with this tag
  const selectedTagTotal = selectedTagExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <Link href="/internal/finance/expenses" className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
              {Icons.back}
            </Link>
            <div>
              <h1 className={s.pageTitle}>{Icons.tag} Expense Tags</h1>
              <p className={s.pageSubtitle}>
                Organize expenses with custom tags for better tracking
              </p>
            </div>
          </div>
          <button onClick={handleOpenCreate} className={`${s.btn} ${s.btnPrimary}`}>
            {Icons.plus} New Tag
          </button>
        </div>

        {/* Stats */}
        <div className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Tags
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {tags.length}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Tags In Use
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {tags.filter(t => t.usageCount > 0).length}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Usages
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {tags.reduce((sum, t) => sum + t.usageCount, 0)}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Most Used
              </div>
              <div style={{ fontSize: 'var(--int-text-lg)', fontWeight: 700 }}>
                {tags.length > 0 ? tags.reduce((a, b) => a.usageCount > b.usageCount ? a : b).name : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.cardBody}>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: 'var(--int-space-3)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--int-text-muted)'
              }}>
                {Icons.search}
              </span>
              <input
                type="text"
                className={s.input}
                placeholder="Search tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 'var(--int-space-10)' }}
              />
            </div>
          </div>
        </div>

        <div className={s.grid3}>
          {/* Tag List */}
          <div className={s.card} style={{ gridColumn: 'span 2' }}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>All Tags ({filteredTags.length})</h2>
            </div>
            <div className={s.cardBody}>
              {filteredTags.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                  {searchQuery ? 'No tags match your search' : 'No tags created yet'}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--int-space-4)' }}>
                  {filteredTags.map(tag => (
                    <div
                      key={tag.id}
                      onClick={() => setSelectedTag(tag)}
                      style={{
                        padding: 'var(--int-space-4)',
                        background: selectedTag?.id === tag.id ? 'var(--int-surface-elevated)' : 'var(--int-surface)',
                        border: `2px solid ${selectedTag?.id === tag.id ? tag.color || 'var(--int-primary)' : 'var(--int-border)'}`,
                        borderRadius: 'var(--int-radius)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--int-space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: tag.color || '#94a3b8',
                          }} />
                          <span style={{ fontWeight: 600 }}>{tag.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--int-space-1)' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(tag); }}
                            className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                            style={{ padding: '4px' }}
                          >
                            {Icons.edit}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(tag); }}
                            className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                            style={{ padding: '4px', color: 'var(--int-danger)' }}
                          >
                            {Icons.trash}
                          </button>
                        </div>
                      </div>
                      {tag.description && (
                        <p style={{ 
                          fontSize: 'var(--int-text-xs)', 
                          color: 'var(--int-text-muted)', 
                          marginBottom: 'var(--int-space-2)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {tag.description}
                        </p>
                      )}
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                        Used {tag.usageCount} time{tag.usageCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tag Details / Preview */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>
                {selectedTag ? `Tag: ${selectedTag.name}` : 'Tag Details'}
              </h2>
            </div>
            <div className={s.cardBody}>
              {selectedTag ? (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--int-space-3)',
                    marginBottom: 'var(--int-space-4)',
                    padding: 'var(--int-space-4)',
                    background: 'var(--int-surface-elevated)',
                    borderRadius: 'var(--int-radius)'
                  }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: selectedTag.color || '#94a3b8',
                    }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{selectedTag.name}</div>
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                        {selectedTag.color}
                      </div>
                    </div>
                  </div>

                  {selectedTag.description && (
                    <div style={{ marginBottom: 'var(--int-space-4)' }}>
                      <label style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Description</label>
                      <p style={{ margin: 'var(--int-space-1) 0 0' }}>{selectedTag.description}</p>
                    </div>
                  )}

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 'var(--int-space-4)',
                    marginBottom: 'var(--int-space-4)'
                  }}>
                    <div>
                      <label style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Usage Count</label>
                      <div style={{ fontWeight: 600, fontSize: 'var(--int-text-lg)' }}>{selectedTag.usageCount}</div>
                    </div>
                    <div>
                      <label style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Total Amount</label>
                      <div style={{ fontWeight: 600, fontSize: 'var(--int-text-lg)' }}>{formatMoney(selectedTagTotal)}</div>
                    </div>
                  </div>

                  {selectedTagExpenses.length > 0 && (
                    <div>
                      <label style={{ 
                        fontSize: 'var(--int-text-xs)', 
                        color: 'var(--int-text-muted)',
                        marginBottom: 'var(--int-space-2)',
                        display: 'block'
                      }}>
                        Recent Expenses with this tag
                      </label>
                      {selectedTagExpenses.slice(0, 5).map(expense => (
                        <div key={expense.id} style={{
                          padding: 'var(--int-space-2)',
                          borderBottom: '1px solid var(--int-border)',
                          fontSize: 'var(--int-text-sm)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              maxWidth: '60%'
                            }}>
                              {expense.description || 'No description'}
                            </span>
                            <span style={{ fontWeight: 600 }}>{formatMoney(expense.amount)}</span>
                          </div>
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                  Select a tag to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>{editingTag ? 'Edit Tag' : 'Create New Tag'}</h2>
              <button onClick={() => setShowCreateModal(false)} className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
                {Icons.x}
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.formGroup}>
                <label className={s.label}>Tag Name *</label>
                <input
                  type="text"
                  className={s.input}
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Recurring, Essential, Tax Deductible"
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Color</label>
                <div style={{ display: 'flex', gap: 'var(--int-space-2)', flexWrap: 'wrap' }}>
                  {defaultColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: color,
                        border: formData.color === color ? '3px solid var(--int-text)' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  style={{ marginTop: 'var(--int-space-2)', width: '100%', height: '36px', cursor: 'pointer' }}
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Description (optional)</label>
                <textarea
                  className={s.input}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of when to use this tag"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Preview */}
              <div style={{ marginTop: 'var(--int-space-4)' }}>
                <label className={s.label}>Preview</label>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 'var(--int-space-2)',
                  padding: 'var(--int-space-2) var(--int-space-3)',
                  background: `${formData.color}20`,
                  border: `1px solid ${formData.color}`,
                  borderRadius: 'var(--int-radius)',
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    background: formData.color,
                  }} />
                  <span style={{ color: formData.color, fontWeight: 500 }}>
                    {formData.name || 'Tag Name'}
                  </span>
                </div>
              </div>
            </div>
            <div className={s.modalFooter}>
              <button onClick={() => setShowCreateModal(false)} className={`${s.btn} ${s.btnGhost}`}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={`${s.btn} ${s.btnPrimary}`}>
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
