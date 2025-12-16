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
  const isPm = role === 'pm' || isAdmin;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/internal" className={styles.brand}>
          Megicode Internal
        </Link>
        <nav className={styles.nav}>
          {isPm && (
            <Link href="/internal/leads" className={styles.link}>
              Leads
            </Link>
          )}
          {isPm && (
            <Link href="/internal/clients" className={styles.link}>
              Clients
            </Link>
          )}
          <Link href="/internal/projects" className={styles.link}>
            Projects
          </Link>
          <Link href="/internal/tasks" className={styles.link}>
            Tasks
          </Link>
          {isPm && (
            <Link href="/internal/proposals" className={styles.link}>
              Proposals
            </Link>
          )}
          {isPm && (
            <Link href="/internal/invoices" className={styles.link}>
              Invoices
            </Link>
          )}
          {isPm && (
            <Link href="/internal/reports" className={styles.link}>
              Reports
            </Link>
          )}
          {isAdmin && (
            <>
              <Link href="/internal/admin/users" className={styles.link}>
                Users
              </Link>
              <Link href="/internal/admin/process" className={styles.link}>
                Process
              </Link>
            </>
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
