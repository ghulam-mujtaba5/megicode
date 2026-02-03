/**
 * Skeleton Loader Components
 * Progressive UI loading states
 */
'use client';

import s from '../styles.module.css';

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: 'var(--int-space-4)',
        background: 'var(--int-bg-secondary)',
        borderRadius: 'var(--int-radius)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div style={{ height: '20px', background: 'var(--int-bg-tertiary)', borderRadius: 'var(--int-radius-sm)', marginBottom: 'var(--int-space-3)' }} />
      <div style={{ height: '16px', background: 'var(--int-bg-tertiary)', borderRadius: 'var(--int-radius-sm)', width: '80%' }} />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div
      style={{
        padding: 'var(--int-space-4)',
        background: 'var(--int-bg-secondary)',
        borderRadius: 'var(--int-radius)',
      }}
    >
      <div
        style={{
          height: '14px',
          background: 'var(--int-bg-tertiary)',
          borderRadius: 'var(--int-radius-sm)',
          marginBottom: 'var(--int-space-2)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div
        style={{
          height: '24px',
          background: 'var(--int-bg-tertiary)',
          borderRadius: 'var(--int-radius-sm)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--int-space-2)' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '40px',
            background: 'var(--int-bg-secondary)',
            borderRadius: 'var(--int-radius)',
            animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonOverview() {
  return (
    <div style={{ display: 'grid', gap: 'var(--int-space-6)' }}>
      {/* KPI Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--int-space-4)' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// Global CSS for pulse animation (add to your global styles)
// @keyframes pulse {
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0.5; }
// }
