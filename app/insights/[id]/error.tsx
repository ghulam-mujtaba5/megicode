'use client';

import Image from 'next/image';
import Link from 'next/link';

import { LOGO_ICON } from '@/lib/logo';

export default function ArticleError({ reset }: { reset: () => void }) {
  return (
    <div
      style={{
        background: 'var(--surface-page)',
        minHeight: '100vh',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Image
        src={LOGO_ICON}
        alt="Megicode Logo"
        width={80}
        height={80}
        style={{ marginBottom: '2rem' }}
      />
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: 'var(--ink)',
        }}
      >
        We couldn&rsquo;t load this article
      </h1>
      <p
        style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: 'var(--ink-soft)',
          textAlign: 'center',
        }}
      >
        Something went wrong on our side. Try again, or head back to Insights.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: 'var(--brand-blue, #4573df)',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/insights"
          style={{
            background: 'transparent',
            color: 'var(--brand-blue, #4573df)',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
            border: '1px solid var(--line-blueprint-strong, #b8c9ee)',
          }}
        >
          Back to Insights
        </Link>
      </div>
    </div>
  );
}
