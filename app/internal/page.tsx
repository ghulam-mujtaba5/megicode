import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import styles from './internal.module.css';

export default async function InternalHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/internal/login');
  }

  return (
    <main className={styles.container}>
      <h1>Internal Dashboard</h1>
      <p>
        Signed in as <strong>{session?.user?.email ?? 'unknown'}</strong>
      </p>
      <p>Role: {session?.user?.role ?? 'viewer'}</p>
    </main>
  );
}
