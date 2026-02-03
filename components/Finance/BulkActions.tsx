/**
 * Bulk Actions Component
 * Multi-select with batch operations
 */
'use client';

import { useState } from 'react';
import s from '../styles.module.css';

interface BulkActionItem<T> {
  label: string;
  icon?: string;
  action: (selectedIds: string[]) => Promise<void> | void;
  variant?: 'default' | 'danger' | 'warning';
  confirmMessage?: string;
}

interface BulkActionsProps<T> {
  selectedCount: number;
  actions: BulkActionItem<T>[];
  onClearSelection: () => void;
  isLoading?: boolean;
}

export function BulkActions<T>({
  selectedCount,
  actions,
  onClearSelection,
  isLoading = false,
}: BulkActionsProps<T>) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (selectedCount === 0) return null;

  const handleAction = async (action: BulkActionItem<T>, selectedIds: string[]) => {
    if (action.confirmMessage && !confirm(action.confirmMessage)) return;

    setIsProcessing(true);
    try {
      await action.action(selectedIds);
    } finally {
      setIsProcessing(false);
    }
  };

  const variantStyles = {
    default: { bg: 'var(--int-primary)', text: 'white' },
    danger: { bg: 'var(--int-error)', text: 'white' },
    warning: { bg: 'var(--int-warning)', text: 'white' },
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--int-space-3)',
        padding: 'var(--int-space-3)',
        background: 'var(--int-bg-secondary)',
        borderRadius: 'var(--int-radius)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-2)', flexWrap: 'wrap' }}>
        {actions.map((action, idx) => {
          const style = variantStyles[action.variant || 'default'];
          return (
            <button
              key={idx}
              onClick={() => handleAction(action as any, [])}
              disabled={isProcessing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--int-space-1)',
                padding: 'var(--int-space-1) var(--int-space-3)',
                background: style.bg,
                color: style.text,
                border: 'none',
                borderRadius: 'var(--int-radius-sm)',
                fontSize: 'var(--int-text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={onClearSelection}
        disabled={isProcessing}
        style={{
          marginLeft: 'auto',
          padding: 'var(--int-space-1) var(--int-space-3)',
          background: 'none',
          border: '1px solid var(--int-border)',
          borderRadius: 'var(--int-radius-sm)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Clear
      </button>
    </div>
  );
}

// Hook for managing bulk selection
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (id: string) => selectedIds.has(id);

  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isIndeterminate,
  };
}

// Checkbox for bulk selection
interface BulkCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function BulkCheckbox({ checked, indeterminate, onChange, label }: BulkCheckboxProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate || false;
          }
        }}
        style={{
          cursor: 'pointer',
          width: '18px',
          height: '18px',
        }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
