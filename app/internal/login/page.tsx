'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import styles from '../internal.module.css';

export default function InternalLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

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
    </main>
  );
}
