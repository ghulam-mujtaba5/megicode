/**
 * Enhanced Search & Filter Components
 * Fuzzy search, saved filters, smart presets
 */
'use client';

import { useMemo, useState } from 'react';
import s from '../styles.module.css';

// Fuzzy search implementation
function fuzzyMatch(query: string, text: string): boolean {
  query = query.toLowerCase();
  text = text.toLowerCase();
  let queryIdx = 0;
  for (let i = 0; i < text.length; i++) {
    if (query[queryIdx] === text[i]) {
      queryIdx++;
      if (queryIdx === query.length) return true;
    }
  }
  return false;
}

function fuzzySearch<T>(items: T[], query: string, searchFields: (keyof T)[]): T[] {
  if (!query) return items;
  return items.filter((item) => searchFields.some((field) => fuzzyMatch(query, String(item[field]))));
}

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
}

export function SearchBox({ value, onChange, placeholder = 'Search...', onFocus }: SearchBoxProps) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--int-space-2) var(--int-space-3) var(--int-space-2) var(--int-space-4)',
          border: '1px solid var(--int-border)',
          borderRadius: 'var(--int-radius-sm)',
          fontSize: 'var(--int-text-sm)',
          background: 'var(--int-bg-secondary)',
        }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--int-text-muted)"
        strokeWidth="2"
        style={{
          position: 'absolute',
          left: 'var(--int-space-2)',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 'var(--int-space-2)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--int-text-muted)',
            padding: 'var(--int-space-1)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  icon?: string;
}

interface FilterRowProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
}

export function FilterRow({ label, value, onChange, options }: FilterRowProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-2)', alignItems: 'center' }}>
      <label style={{ fontSize: 'var(--int-text-sm)', fontWeight: 600 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: 'var(--int-space-2)',
          border: '1px solid var(--int-border)',
          borderRadius: 'var(--int-radius-sm)',
          background: 'var(--int-bg-secondary)',
          fontSize: 'var(--int-text-sm)',
        }}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  presets?: FilterPreset[];
  onSavePreset?: (name: string, filters: Record<string, any>) => void;
  children?: React.ReactNode;
}

export function AdvancedFilter({
  isOpen,
  onClose,
  onApply,
  presets = [],
  onSavePreset,
  children,
}: AdvancedFilterProps) {
  const [filterName, setFilterName] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--int-bg)',
          borderRadius: 'var(--int-radius)',
          padding: 'var(--int-space-6)',
          maxWidth: '500px',
          width: '90%',
          zIndex: 100,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-4)' }}>
          <h2 style={{ fontWeight: 600, margin: 0 }}>🔍 Advanced Filters</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {presets.length > 0 && (
          <div style={{ marginBottom: 'var(--int-space-4)' }}>
            <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-2)', fontSize: 'var(--int-text-sm)' }}>
              Quick Presets
            </div>
            <div style={{ display: 'flex', gap: 'var(--int-space-2)', flexWrap: 'wrap' }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onApply(preset.filters);
                    onClose();
                  }}
                  style={{
                    padding: 'var(--int-space-1) var(--int-space-3)',
                    borderRadius: 'var(--int-radius-sm)',
                    border: '1px solid var(--int-border)',
                    background: 'var(--int-bg-secondary)',
                    cursor: 'pointer',
                    fontSize: 'var(--int-text-xs)',
                    fontWeight: 600,
                  }}
                >
                  {preset.icon && <span style={{ marginRight: 'var(--int-space-1)' }}>{preset.icon}</span>}
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 'var(--int-space-4)', marginBottom: 'var(--int-space-6)' }}>{children}</div>

        {onSavePreset && (
          <div style={{ marginBottom: 'var(--int-space-4)', paddingTop: 'var(--int-space-4)', borderTop: '1px solid var(--int-border)' }}>
            <label style={{ fontSize: 'var(--int-text-sm)', fontWeight: 600, display: 'block', marginBottom: 'var(--int-space-2)' }}>
              Save as Preset
            </label>
            <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Preset name"
                style={{
                  flex: 1,
                  padding: 'var(--int-space-2)',
                  border: '1px solid var(--int-border)',
                  borderRadius: 'var(--int-radius-sm)',
                  fontSize: 'var(--int-text-sm)',
                }}
              />
              <button
                onClick={() => {
                  if (filterName.trim()) {
                    onSavePreset(filterName, {});
                    setFilterName('');
                  }
                }}
                style={{
                  padding: 'var(--int-space-2) var(--int-space-3)',
                  background: 'var(--int-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--int-radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--int-space-2)', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--int-space-2) var(--int-space-4)',
              border: '1px solid var(--int-border)',
              background: 'var(--int-bg)',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApply({});
              onClose();
            }}
            style={{
              padding: 'var(--int-space-2) var(--int-space-4)',
              background: 'var(--int-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// Hook for fuzzy search
export function useFuzzySearch<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
) {
  return useMemo(() => fuzzySearch(items, query, searchFields), [items, query, searchFields]);
}
