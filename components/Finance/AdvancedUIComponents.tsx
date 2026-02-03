/**
 * Advanced UI Components for Financial Dashboard
 * Notifications, Alerts, Cards with modern design
 */
'use client';

import { useEffect, useState } from 'react';
import s from '../styles.module.css';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoClose?: number; // ms
}

const notificationIcons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

export function Notification({ type, message, title, dismissible = true, onDismiss, autoClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onDismiss]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'var(--int-success-light)',
    error: 'var(--int-error-light)',
    warning: 'var(--int-warning-light)',
    info: 'var(--int-info-light)',
  };

  const textColors = {
    success: 'var(--int-success)',
    error: 'var(--int-error)',
    warning: 'var(--int-warning)',
    info: 'var(--int-info)',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--int-space-3)',
        padding: 'var(--int-space-4)',
        background: bgColors[type],
        color: textColors[type],
        borderRadius: 'var(--int-radius)',
        border: `1px solid ${textColors[type]}20`,
        marginBottom: 'var(--int-space-4)',
      }}
    >
      <div style={{ flex: 'none', marginTop: '2px' }}>{notificationIcons[type]}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-1)' }}>{title}</div>}
        <div style={{ fontSize: 'var(--int-text-sm)' }}>{message}</div>
      </div>
      {dismissible && (
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            padding: 0,
            flex: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon, variant = 'primary', trend }: StatCardProps) {
  const variantColors = {
    primary: 'var(--int-primary)',
    success: 'var(--int-success)',
    warning: 'var(--int-warning)',
    error: 'var(--int-error)',
    info: 'var(--int-info)',
  };

  const trendIcons = {
    up: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    down: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    ),
    neutral: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
  };

  return (
    <div
      className={s.card}
      style={{
        padding: 'var(--int-space-5)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--int-space-3)' }}>
        <h3 style={{ fontSize: 'var(--int-text-sm)', fontWeight: 600, color: 'var(--int-text-muted)', margin: 0 }}>
          {title}
        </h3>
        {icon && <div style={{ color: variantColors[variant], opacity: 0.7 }}>{icon}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--int-space-3)' }}>
        <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--int-text-primary)' }}>
          {value}
        </div>
        {change && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--int-space-1)',
              padding: 'var(--int-space-1) var(--int-space-2)',
              borderRadius: 'var(--int-radius)',
              background: change.isPositive ? 'var(--int-success-light)' : 'var(--int-error-light)',
              color: change.isPositive ? 'var(--int-success)' : 'var(--int-error)',
              fontSize: 'var(--int-text-xs)',
              fontWeight: 600,
              marginBottom: '0.25rem',
            }}
          >
            {trendIcons[change.isPositive ? 'up' : 'down']}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
    </div>
  );
}

interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onSort?: (column: keyof any) => void;
  sortBy?: keyof any;
  sortDirection?: 'asc' | 'desc';
  selectable?: boolean;
  onSelect?: (selected: T[]) => void;
  rowActions?: (row: T) => React.ReactNode;
  emptyStateIcon?: React.ReactNode;
  emptyStateText?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onSort,
  sortBy,
  sortDirection = 'asc',
  selectable = false,
  onSelect,
  rowActions,
  emptyStateIcon,
  emptyStateText = 'No data available',
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(data.map((d, i) => d.id || i)) : new Set();
    setSelected(newSelected);
    onSelect?.(Array.from(newSelected).map((id) => data.find((d, i) => (d.id || i) === id)!));
  };

  const handleSelectRow = (id: string | number | undefined, checked: boolean) => {
    const newSelected = new Set(selected);
    if (checked && id !== undefined) {
      newSelected.add(id);
    } else if (id !== undefined) {
      newSelected.delete(id);
    }
    setSelected(newSelected);
    onSelect?.(Array.from(newSelected).map((id) => data.find((d, i) => (d.id || i) === id)!));
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: 'var(--int-space-12)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
        {emptyStateIcon && (
          <div style={{ marginBottom: 'var(--int-space-4)', opacity: 0.5, fontSize: '2rem' }}>{emptyStateIcon}</div>
        )}
        <p>{emptyStateText}</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={s.table}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  className={s.checkbox}
                  checked={selected.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                  cursor: col.sortable ? 'pointer' : 'default',
                }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span style={{ fontSize: '0.75rem' }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={selected.has(row.id || idx)}
                    onChange={(e) => handleSelectRow(row.id || idx, e.target.checked)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={String(col.key)} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] || '-')}
                </td>
              ))}
              {rowActions && <td style={{ textAlign: 'center' }}>{rowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  filters: { name: string; label: string; type: 'select' | 'date' | 'number'; options?: any[] }[];
}

export function FilterModal({ isOpen, onClose, onApply, filters }: FilterModalProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  if (!isOpen) return null;

  return (
    <div className={s.modal} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className={s.modalHeader}>
          <h2>Advanced Filters</h2>
          <button onClick={onClose} className={s.modalClose}>
            ✕
          </button>
        </div>
        <div className={s.modalBody}>
          {filters.map((filter) => (
            <div key={filter.name} className={s.formGroup}>
              <label className={s.label}>{filter.label}</label>
              {filter.type === 'select' && (
                <select
                  className={s.select}
                  value={values[filter.name] || ''}
                  onChange={(e) => setValues({ ...values, [filter.name]: e.target.value })}
                >
                  <option value="">All</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'date' && (
                <input
                  type="date"
                  className={s.input}
                  value={values[filter.name] || ''}
                  onChange={(e) => setValues({ ...values, [filter.name]: e.target.value })}
                />
              )}
              {filter.type === 'number' && (
                <input
                  type="number"
                  className={s.input}
                  value={values[filter.name] || ''}
                  onChange={(e) => setValues({ ...values, [filter.name]: e.target.value })}
                  placeholder="Enter value"
                />
              )}
            </div>
          ))}
        </div>
        <div className={s.modalFooter}>
          <button onClick={onClose} className={`${s.btn} ${s.btnSecondary}`}>
            Cancel
          </button>
          <button
            onClick={() => {
              onApply(values);
              onClose();
            }}
            className={`${s.btn} ${s.btnPrimary}`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
