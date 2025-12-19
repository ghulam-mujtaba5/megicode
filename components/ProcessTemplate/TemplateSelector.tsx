'use client';

/**
 * Process Template Selector Component
 * 
 * Allows users to browse and select process templates when creating new processes
 */

import { useState, useEffect } from 'react';
import s from '../../app/internal/styles.module.css';

interface ProcessStep {
  key: string;
  title: string;
  type: 'task' | 'gateway' | 'approval' | 'start' | 'end';
}

interface ProcessLane {
  key: string;
  title: string;
  role: string;
  steps: ProcessStep[];
}

interface ProcessTemplate {
  key: string;
  name: string;
  description: string;
  category: string;
  lanes: ProcessLane[];
  estimatedDurationDays?: number;
  isDefault?: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

interface TemplateCategory {
  key: string;
  label: string;
  count: number;
}

interface TemplateSelectorProps {
  onSelect: (template: ProcessTemplate) => void;
  selectedKey?: string;
}

const Icons = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  starOutline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const categoryColors: Record<string, string> = {
  software_development: '#3b82f6',
  web_development: '#10b981',
  mobile_development: '#8b5cf6',
  consulting: '#f59e0b',
  design: '#ec4899',
  maintenance: '#6366f1',
  support: '#14b8a6',
  custom: '#6b7280',
};

const categoryLabels: Record<string, string> = {
  software_development: 'Software Development',
  web_development: 'Web Development',
  mobile_development: 'Mobile Development',
  consulting: 'Consulting',
  design: 'Design',
  maintenance: 'Maintenance',
  support: 'Support',
  custom: 'Custom',
};

export default function TemplateSelector({ onSelect, selectedKey }: TemplateSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ProcessTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<ProcessTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/internal/process/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      
      const data = await response.json();
      setTemplates(data.templates || []);
      
      // Calculate categories
      const categoryMap = new Map<string, number>();
      (data.templates || []).forEach((t: ProcessTemplate) => {
        const count = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, count + 1);
      });
      
      setCategories(Array.from(categoryMap.entries()).map(([key, count]) => ({
        key,
        label: categoryLabels[key] || key,
        count,
      })));
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: ProcessTemplate) => {
    onSelect(template);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className={s.spinner}></div>
        <p style={{ color: 'var(--int-text-muted)', marginTop: '1rem' }}>Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--int-error)' }}>{error}</p>
        <button onClick={fetchTemplates} className={s.btnSecondary} style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <div style={{ 
          position: 'sticky', 
          top: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.input}
              style={{ paddingLeft: '2.5rem' }}
            />
            <span className={s.icon} style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--int-text-muted)',
            }}>
              {Icons.search}
            </span>
          </div>

          {/* Categories */}
          <div className={s.card}>
            <div className={s.cardHeader} style={{ padding: '0.75rem 1rem' }}>
              <h4 className={s.cardTitle} style={{ fontSize: '0.875rem' }}>Categories</h4>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: !selectedCategory ? 'var(--int-primary-bg)' : 'transparent',
                  color: !selectedCategory ? 'var(--int-primary)' : 'var(--int-text)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                <span>All Templates</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.125rem 0.5rem',
                  background: 'var(--int-surface)',
                  borderRadius: '9999px',
                }}>
                  {templates.length}
                </span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    background: selectedCategory === cat.key ? 'var(--int-primary-bg)' : 'transparent',
                    color: selectedCategory === cat.key ? 'var(--int-primary)' : 'var(--int-text)',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: categoryColors[cat.key] || '#6b7280',
                    }} />
                    {cat.label}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.5rem',
                    background: 'var(--int-surface)',
                    borderRadius: '9999px',
                  }}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span style={{ color: 'var(--int-text-muted)', fontSize: '0.875rem' }}>
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--int-surface)', padding: '0.25rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'grid' ? 'var(--int-bg)' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: viewMode === 'grid' ? 'var(--int-primary)' : 'var(--int-text-muted)',
              }}
            >
              {Icons.grid}
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                background: viewMode === 'list' ? 'var(--int-bg)' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: viewMode === 'list' ? 'var(--int-primary)' : 'var(--int-text-muted)',
              }}
            >
              {Icons.list}
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center', padding: '3rem' }}>
              <span className={s.icon} style={{ fontSize: '2rem', color: 'var(--int-text-muted)' }}>{Icons.layers}</span>
              <p style={{ marginTop: '1rem', color: 'var(--int-text-muted)' }}>
                No templates found matching your criteria
              </p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1rem',
          }}>
            {filteredTemplates.map(template => (
              <div
                key={template.key}
                className={s.card}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedKey === template.key ? '2px solid var(--int-primary)' : undefined,
                }}
                onClick={() => handleSelectTemplate(template)}
                onMouseEnter={() => setPreviewTemplate(template)}
                onMouseLeave={() => setPreviewTemplate(null)}
              >
                <div className={s.cardBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      background: categoryColors[template.category] + '20',
                      color: categoryColors[template.category],
                      borderRadius: '0.25rem',
                    }}>
                      {categoryLabels[template.category] || template.category}
                    </span>
                    {template.isDefault && (
                      <span style={{ color: 'var(--int-warning)' }}>{Icons.star}</span>
                    )}
                  </div>
                  
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{template.name}</h4>
                  <p style={{ 
                    margin: '0 0 1rem', 
                    fontSize: '0.875rem', 
                    color: 'var(--int-text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {template.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span className={s.icon}>{Icons.layers}</span>
                      {template.lanes.length} lanes
                    </span>
                    {template.estimatedDurationDays && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className={s.icon}>{Icons.clock}</span>
                        ~{template.estimatedDurationDays}d
                      </span>
                    )}
                  </div>
                  
                  {selectedKey === template.key && (
                    <div style={{ 
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '24px',
                      height: '24px',
                      background: 'var(--int-primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}>
                      {Icons.check}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.card}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Category</th>
                  <th>Lanes</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map(template => (
                  <tr 
                    key={template.key}
                    style={{ 
                      cursor: 'pointer',
                      background: selectedKey === template.key ? 'var(--int-primary-bg)' : undefined,
                    }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <td>
                      <div>
                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {template.name}
                          {template.isDefault && (
                            <span style={{ color: 'var(--int-warning)' }}>{Icons.star}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                          {template.description.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        background: categoryColors[template.category] + '20',
                        color: categoryColors[template.category],
                        borderRadius: '0.25rem',
                      }}>
                        {categoryLabels[template.category] || template.category}
                      </span>
                    </td>
                    <td>{template.lanes.length}</td>
                    <td>{template.estimatedDurationDays ? `~${template.estimatedDurationDays}d` : '-'}</td>
                    <td>
                      {selectedKey === template.key && (
                        <span style={{ color: 'var(--int-primary)' }}>{Icons.check}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {previewTemplate && viewMode === 'grid' && (
        <div style={{ 
          width: '300px',
          flexShrink: 0,
          position: 'sticky',
          top: '1rem',
          alignSelf: 'flex-start',
        }}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h4 className={s.cardTitle}>{previewTemplate.name}</h4>
            </div>
            <div className={s.cardBody}>
              <p style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)', marginBottom: '1rem' }}>
                {previewTemplate.description}
              </p>
              
              <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem' }}>Process Flow</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {previewTemplate.lanes.map((lane, laneIdx) => (
                  <div key={lane.key} style={{ 
                    padding: '0.5rem',
                    background: 'var(--int-surface)',
                    borderRadius: '0.375rem',
                    borderLeft: `3px solid ${categoryColors[previewTemplate.category]}`,
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{lane.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                      {lane.steps.length} steps • {lane.role}
                    </div>
                  </div>
                ))}
              </div>

              {previewTemplate.tags && previewTemplate.tags.length > 0 && (
                <>
                  <h5 style={{ margin: '1rem 0 0.5rem', fontSize: '0.875rem' }}>Tags</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {previewTemplate.tags.map(tag => (
                      <span key={tag} style={{ 
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        background: 'var(--int-surface)',
                        borderRadius: '9999px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
