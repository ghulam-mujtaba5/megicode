'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import styles from './InternalNavCommon.module.css';
import { LOGO_NAVBAR_LIGHT } from '@/lib/logo';

// Simple icon components
const Icons = {
  leads: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  clients: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M9 8h1" />
      <path d="M9 12h1" />
      <path d="M9 16h1" />
      <path d="M14 8h1" />
      <path d="M14 12h1" />
      <path d="M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  ),
  projects: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  tasks: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  proposals: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  invoices: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  reports: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  process: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function InternalNavClient({
  email,
  role,
  isAdmin,
}: {
  email: string;
  role: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const isPm = role === 'pm' || isAdmin;

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');
  
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/internal" className={styles.brand}>
          <img src={LOGO_NAVBAR_LIGHT} alt="Megicode" className={styles.brandImage} />
          <span>Megicode</span>
        </Link>
        <nav className={styles.nav}>
          {isPm && (
            <Link 
              href="/internal/leads" 
              className={`${styles.link} ${isActive('/internal/leads') ? styles.linkActive : ''}`}
            >
              <Icons.leads />
              Leads
            </Link>
          )}
          {isPm && (
            <Link 
              href="/internal/clients" 
              className={`${styles.link} ${isActive('/internal/clients') ? styles.linkActive : ''}`}
            >
              <Icons.clients />
              Clients
            </Link>
          )}
          <Link 
            href="/internal/projects" 
            className={`${styles.link} ${isActive('/internal/projects') ? styles.linkActive : ''}`}
          >
            <Icons.projects />
            Projects
          </Link>
          <Link 
            href="/internal/tasks" 
            className={`${styles.link} ${isActive('/internal/tasks') ? styles.linkActive : ''}`}
          >
            <Icons.tasks />
            Tasks
          </Link>
          {isPm && (
            <Link 
              href="/internal/proposals" 
              className={`${styles.link} ${isActive('/internal/proposals') ? styles.linkActive : ''}`}
            >
              <Icons.proposals />
              Proposals
            </Link>
          )}
          {isPm && (
            <Link 
              href="/internal/invoices" 
              className={`${styles.link} ${isActive('/internal/invoices') ? styles.linkActive : ''}`}
            >
              <Icons.invoices />
              Invoices
            </Link>
          )}
          {isPm && (
            <Link 
              href="/internal/reports" 
              className={`${styles.link} ${isActive('/internal/reports') ? styles.linkActive : ''}`}
            >
              <Icons.reports />
              Reports
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/internal/admin/users" 
              className={`${styles.link} ${isActive('/internal/admin/users') ? styles.linkActive : ''}`}
            >
              <Icons.users />
              Users
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/internal/admin/process" 
              className={`${styles.link} ${isActive('/internal/admin/process') ? styles.linkActive : ''}`}
            >
              <Icons.process />
              Process
            </Link>
          )}
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.userSection}>
          <div className={styles.avatar}>{getInitials(email)}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{email.split('@')[0]}</span>
            <span className={styles.userRole}>{role}</span>
          </div>
        </div>
        <button type="button" className={styles.button} onClick={() => signOut({ callbackUrl: '/' })}>
          <Icons.logout />
          Sign out
        </button>
      </div>
    </header>
  );
}
