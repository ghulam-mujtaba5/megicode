'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { LOGO_NAVBAR_LIGHT, LOGO_NAVBAR_DARK } from '@/lib/logo';
import { useTheme } from '@/context/ThemeContext';
import styles from './InternalSidebar.module.css';

const Icons = {
  dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  leads: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  projects: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  tasks: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clients: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  invoice: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  reports: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  tools: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevron: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  chevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  process: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

type NavItem = {
  label: string;
  href?: string;
  icon: () => React.ReactNode;
  roles?: string[];
  children?: NavItem[];
};

export default function InternalSidebar({
  email,
  role,
  isAdmin,
}: {
  email: string;
  role: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const isPm = role === 'pm' || isAdmin;
  const { theme, toggleTheme} = useTheme();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/internal', icon: Icons.dashboard },
    { 
      label: 'Sales', 
      icon: Icons.leads, 
      roles: ['admin', 'pm'],
      children: [
        { label: 'Acquisition', href: '/internal/acquisition', icon: Icons.chart },
        { label: 'Leads', href: '/internal/leads', icon: Icons.leads },
        { label: 'Proposals', href: '/internal/proposals', icon: Icons.invoice },
        { label: 'Clients', href: '/internal/clients', icon: Icons.clients },
      ]
    },
    { 
      label: 'Projects', 
      icon: Icons.projects,
      children: [
        { label: 'All Projects', href: '/internal/projects', icon: Icons.projects },
        { label: 'Processes', href: '/internal/process', icon: Icons.process, roles: ['admin', 'pm'] },
        { label: 'Analytics', href: '/internal/process/analytics', icon: Icons.reports, roles: ['admin', 'pm'] },
        { label: 'Workflow Showcase', href: '/internal/process/showcase', icon: Icons.chart, roles: ['admin', 'pm'] },
        { label: 'Tasks', href: '/internal/tasks', icon: Icons.tasks },
        { label: 'Resources', href: '/internal/resources', icon: Icons.users },
      ]
    },
    { 
      label: 'Financial', 
      icon: Icons.invoice, 
      roles: ['admin', 'pm'],
      children: [
        { label: 'Invoices', href: '/internal/invoices', icon: Icons.invoice },
        { label: 'Reports', href: '/internal/reports', icon: Icons.reports },
      ]
    },
    { 
      label: 'Tools', 
      icon: Icons.tools,
      children: [
        { label: 'Templates', href: '/internal/templates', icon: Icons.projects },
        { label: 'Bug Tracking', href: '/internal/bugs', icon: Icons.tasks },
        { label: 'Suggestions', href: '/internal/suggestions', icon: Icons.tasks },
        { label: 'Team', href: '/internal/team', icon: Icons.users },
      ]
    },
    { 
      label: 'Admin', 
      icon: Icons.settings, 
      roles: ['admin'],
      children: [
        { label: 'Users', href: '/internal/admin/users', icon: Icons.users },
        { label: 'Audit Logs', href: '/internal/admin/audit', icon: Icons.reports },
        { label: 'Integrations', href: '/internal/admin/integrations', icon: Icons.settings },
      ]
    },
  ];

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <Link href="/internal" className={styles.logo}>
            <Image 
              src={LOGO_NAVBAR_LIGHT} 
              alt="Megicode" 
              width={collapsed ? 32 : 140} 
              height={32}
              className={styles.logoLight}
            />
            <Image 
              src={LOGO_NAVBAR_DARK} 
              alt="Megicode" 
              width={collapsed ? 32 : 140} 
              height={32}
              className={styles.logoDark}
            />
          </Link>
          <button 
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icons.chevron />
          </button>
        </div>

        <nav className={styles.nav}>
          {filteredItems.map((item) => {
            // Parent items with children
            if (item.children) {
              const isExpanded = expandedSections.includes(item.label);
              const hasActiveChild = item.children.some(child => child.href && isActive(child.href));
              
              return (
                <div key={item.label} className={styles.navSection}>
                  <button
                    className={`${styles.navItem} ${styles.navParent} ${hasActiveChild ? styles.hasActive : ''}`}
                    onClick={() => toggleSection(item.label)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={styles.icon}>{item.icon()}</span>
                    {!collapsed && (
                      <>
                        <span className={styles.label}>{item.label}</span>
                        <span className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}>
                          <Icons.chevronDown />
                        </span>
                      </>
                    )}
                  </button>
                  
                  {!collapsed && isExpanded && item.children && (
                    <div className={styles.navChildren}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href!}
                          className={`${styles.navChildItem} ${isActive(child.href!) ? styles.active : ''}`}
                        >
                          <span className={styles.icon}>{child.icon()}</span>
                          <span className={styles.label}>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            // Single items without children
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`${styles.navItem} ${isActive(item.href!) ? styles.active : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.icon}>{item.icon()}</span>
                {!collapsed && <span className={styles.label}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              {email.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{email.split('@')[0]}</div>
                <div className={styles.userRole}>{role}</div>
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className={styles.themeBtn}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Icons.sun /> : <Icons.moon />}
            {!collapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/internal/login' })}
            className={styles.logoutBtn}
            title="Sign Out"
          >
            <Icons.logout />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
      {!collapsed && <div className={styles.backdrop} onClick={() => setCollapsed(true)} />}
    </>
  );
}
