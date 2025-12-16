'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import styles from './InternalNavCommon.module.css';

export default function InternalNavClient({
  email,
  role,
  isAdmin,
}: {
  email: string;
  role: string;
  isAdmin: boolean;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/internal" className={styles.brand}>
          Megicode Internal
        </Link>
        <nav className={styles.nav}>
          <Link href="/internal/leads" className={styles.link}>
            Leads
          </Link>
          <Link href="/internal/projects" className={styles.link}>
            Projects
          </Link>
          <Link href="/internal/instances" className={styles.link}>
            Instances
          </Link>
          <Link href="/internal/tasks" className={styles.link}>
            My Tasks
          </Link>
          {isAdmin && (
            <Link href="/internal/admin/process" className={styles.link}>
              Process
            </Link>
          )}
        </nav>
      </div>

      <div className={styles.right}>
        <span className={styles.user}>
          {email} ({role})
        </span>
        <button type="button" className={styles.button} onClick={() => signOut({ callbackUrl: '/' })}>
          Sign out
        </button>
      </div>
    </header>
  );
}
