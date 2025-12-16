import Link from 'next/link';
import { desc } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { projectStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  active: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  completed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  onHold: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="10" y1="15" x2="10" y2="9"/>
      <line x1="14" y1="15" x2="14" y2="9"/>
    </svg>
  ),
  planning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

function getBadgeClass(color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeInfo}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeSuccess}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeWarning}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeDanger}`;
  return `${styles.badge} ${styles.badgeDefault}`;
}

export default async function ProjectsPage() {
  await requireInternalSession();

  const db = getDb();
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt)).all();
  const userRows = await db.select().from(users).all();
  const usersById = new Map(userRows.map((u) => [u.id, u] as const));

  // Calculate stats
  const projectStats = {
    total: rows.length,
    active: rows.filter(p => p.status === 'active').length,
    completed: rows.filter(p => p.status === 'completed').length,
    onHold: rows.filter(p => p.status === 'on_hold').length,
  };

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>{rows.length}</span> projects in your workspace
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.projects}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{projectStats.total}</span>
            <span className={styles.kpiLabel}>Total Projects</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.active}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{projectStats.active}</span>
            <span className={styles.kpiLabel}>Active</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.completed}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{projectStats.completed}</span>
            <span className={styles.kpiLabel}>Completed</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.onHold}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{projectStats.onHold}</span>
            <span className={styles.kpiLabel}>On Hold</span>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>All Projects</h2>
          <span className={styles.badge}>{rows.length}</span>
        </div>

        {rows.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{Icons.empty}</div>
            <h3>No projects yet</h3>
            <p>Projects will appear here once they are created from proposals.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>PROJECT</th>
                  <th>STATUS</th>
                  <th>OWNER</th>
                  <th>CREATED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const owner = p.ownerUserId ? usersById.get(p.ownerUserId) : null;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.cellMain}>{p.name}</div>
                        <div className={styles.cellSub}>Priority: {p.priority}</div>
                      </td>
                      <td>
                        <span className={getBadgeClass(projectStatusColor(p.status))}>
                          {p.status.replace('_', ' ').charAt(0).toUpperCase() + p.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className={styles.cellMuted}>{owner?.email ?? '-'}</td>
                      <td className={styles.cellMuted}>{formatDateTime(p.createdAt)}</td>
                      <td>
                        <Link href={`/internal/projects/${p.id}`} className={styles.btnSmall}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
