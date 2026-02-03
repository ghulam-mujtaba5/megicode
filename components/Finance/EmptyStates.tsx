/**
 * Enhanced Empty States Component
 * Contextual guidance and CTAs for empty states
 */
'use client';

import s from '../styles.module.css';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'success' | 'info';
}

export function EmptyState({ icon, title, description, action, variant = 'default' }: EmptyStateProps) {
  const bgColors = {
    default: 'var(--int-bg-secondary)',
    success: 'var(--int-success-light)',
    info: 'var(--int-info-light)',
  };

  const textColors = {
    default: 'var(--int-text-muted)',
    success: 'var(--int-success)',
    info: 'var(--int-info)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--int-space-12)',
        background: bgColors[variant],
        borderRadius: 'var(--int-radius)',
        textAlign: 'center',
        minHeight: '300px',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: 'var(--int-space-4)', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontSize: 'var(--int-text-lg)', fontWeight: 600, marginBottom: 'var(--int-space-2)', color: textColors[variant] }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--int-text-sm)',
          color: 'var(--int-text-muted)',
          marginBottom: action ? 'var(--int-space-4)' : 0,
          maxWidth: '400px',
        }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className={`${s.btn} ${s.btnPrimary}`}
          style={{ marginTop: 'var(--int-space-2)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Convenience exports for common empty states
export function NoFoundersEmpty({ onAddClick }: { onAddClick: () => void }) {
  return (
    <EmptyState
      icon="👥"
      title="No Founders Yet"
      description="Start by adding your founding team members to track contributions and profit sharing."
      action={{ label: 'Add First Founder', onClick: onAddClick }}
    />
  );
}

export function NoAccountsEmpty({ onAddClick }: { onAddClick: () => void }) {
  return (
    <EmptyState
      icon="🏦"
      title="No Accounts Created"
      description="Add your bank accounts, wallets, or other financial accounts to track balances."
      action={{ label: 'Create Account', onClick: onAddClick }}
    />
  );
}

export function NoExpensesEmpty({ onRecordClick }: { onRecordClick: () => void }) {
  return (
    <EmptyState
      icon="💰"
      title="No Expenses Yet"
      description="Start tracking your business expenses to monitor spending and create a financial history."
      action={{ label: 'Record Expense', onClick: onRecordClick }}
    />
  );
}

export function NoSubscriptionsEmpty({ onAddClick }: { onAddClick: () => void }) {
  return (
    <EmptyState
      icon="📋"
      title="No Subscriptions"
      description="Log your recurring subscriptions to track monthly commitments."
      action={{ label: 'Add Subscription', onClick: onAddClick }}
    />
  );
}
