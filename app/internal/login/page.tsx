'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from '../internal.module.css';

export default function InternalLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [devEmail, setDevEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devEmail) return;
    setLoading(true);
    await signIn('dev-login', { email: devEmail, callbackUrl: '/internal' });
  };

  return (
    <main className={styles.container}>
      <h1>Internal Login</h1>
      <p>Sign in with your Megicode account.</p>
      {error ? (
        <p className={styles.message}>
          {error === 'AccessDenied'
            ? 'Access denied: your email is not allowed.'
            : `Sign-in error: ${error}`}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/internal' })}
        className={styles.button}
      >
        Continue with Google
      </button>

      {/* Dev login - only shown if enabled */}
      {process.env.NODE_ENV === 'development' && (
        <form onSubmit={handleDevLogin} style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Dev Login (set DEV_LOGIN_ENABLED=true in .env.local)
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={devEmail}
            onChange={(e) => setDevEmail(e.target.value)}
            className={styles.input}
            style={{ marginBottom: '0.5rem' }}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Dev Sign In'}
          </button>
        </form>
      )}
    </main>
  );
}
