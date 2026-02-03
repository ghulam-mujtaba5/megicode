/**
 * Keyboard Shortcuts for Financial Dashboard
 * Enhanced navigation with keyboard commands
 */
'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  label: string;
  description: string;
  action: () => void;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        // Allow Escape key in inputs
        if (e.key === 'Escape') {
          (e.target as HTMLInputElement).blur();
        }
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlKey = shortcut.ctrl ? e.ctrlKey || e.metaKey : false;
        const shiftKey = shortcut.shift ? e.shiftKey : false;
        const altKey = shortcut.alt ? e.altKey : false;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        const matchesCtrl = shortcut.ctrl ? ctrlKey : !e.ctrlKey && !e.metaKey;
        const matchesShift = shortcut.shift ? shiftKey : !e.shiftKey;
        const matchesAlt = shortcut.alt ? altKey : !e.altKey;

        if (keyMatch && matchesCtrl && matchesShift && matchesAlt) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Keyboard Shortcuts Cheat Sheet Component
interface KeyboardCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardCheatSheet({ isOpen, onClose, shortcuts }: KeyboardCheatSheetProps) {
  if (!isOpen) return null;

  const getKeyDisplay = (shortcut: KeyboardShortcut) => {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99,
        }}
      />
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
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-6)' }}>
          <h2 style={{ fontWeight: 600, margin: 0 }}>⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--int-text-muted)',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: 'var(--int-space-3)' }}>
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--int-space-3)',
                background: 'var(--int-bg-secondary)',
                borderRadius: 'var(--int-radius-sm)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--int-text-sm)' }}>{shortcut.label}</div>
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                  {shortcut.description}
                </div>
              </div>
              <div
                style={{
                  background: 'var(--int-primary)',
                  color: 'white',
                  padding: 'var(--int-space-1) var(--int-space-2)',
                  borderRadius: 'var(--int-radius-sm)',
                  fontSize: 'var(--int-text-xs)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  marginLeft: 'var(--int-space-3)',
                }}
              >
                {getKeyDisplay(shortcut)}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-4)', margin: 0 }}>
          💡 Tip: Press <kbd>?</kbd> anytime to open this menu
        </p>
      </div>
    </>
  );
}

// Export preset shortcuts for common financial actions
export const FINANCIAL_DASHBOARD_SHORTCUTS = {
  newExpense: (onNewExpense: () => void): KeyboardShortcut => ({
    key: 'e',
    ctrl: true,
    label: 'New Expense',
    description: 'Quickly record a new expense',
    action: onNewExpense,
  }),
  newFounder: (onNewFounder: () => void): KeyboardShortcut => ({
    key: 'f',
    ctrl: true,
    label: 'New Founder',
    description: 'Add a new founder to the system',
    action: onNewFounder,
  }),
  search: (onSearch: () => void): KeyboardShortcut => ({
    key: '/',
    label: 'Search',
    description: 'Focus on search field',
    action: onSearch,
  }),
  help: (onHelp: () => void): KeyboardShortcut => ({
    key: '?',
    label: 'Help',
    description: 'Open keyboard shortcuts menu',
    action: onHelp,
  }),
  refresh: (onRefresh: () => void): KeyboardShortcut => ({
    key: 'r',
    ctrl: true,
    label: 'Refresh',
    description: 'Refresh all data',
    action: onRefresh,
  }),
};
