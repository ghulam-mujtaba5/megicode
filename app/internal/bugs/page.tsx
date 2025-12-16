import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { bugs, projects, users, type BugSeverity, type BugStatus } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  bug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 14v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2"/><path d="M12 14a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2h-1"/><path d="M12 14a4 4 0 0 0-4-4h0a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2h1"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4 10l2 2"/><path d="M20 10l-2 2"/><path d="M4 18l2-2"/><path d="M20 18l-2-2"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
};

function getSeverityColor(severity: BugSeverity) {
  switch (severity) {
    case 'critical': return 'var(--int-danger)';
    case 'high': return 'var(--int-warning)';
    case 'medium': return 'var(--int-info)';
    case 'low': return 'var(--int-success)';
    default: return 'var(--int-text-muted)';
  }
}

function getStatusColor(status: BugStatus) {
  switch (status) {
    case 'open': return 'var(--int-danger)';
    case 'in_progress': return 'var(--int-warning)';
    case 'resolved': return 'var(--int-success)';
    case 'closed': return 'var(--int-text-muted)';
    case 'wont_fix': return 'var(--int-text-muted)';
    default: return 'var(--int-text-muted)';
  }
}

export default async function BugsPage() {
  await requireRole(['admin', 'pm', 'dev', 'qa']);
  const db = getDb();

  const allBugs = await db
    .select({
      bug: bugs,
      project: projects,
      reporter: users,
    })
    .from(bugs)
    .leftJoin(projects, eq(bugs.projectId, projects.id))
    .leftJoin(users, eq(bugs.reportedByUserId, users.id))
    .orderBy(desc(bugs.createdAt))
    .all();

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Bug Tracker</h1>
          <p className={s.pageSubtitle}>Track and manage software defects</p>
        </div>
        <div className={s.pageActions}>
          <Link href="/internal/bugs/new" className={s.buttonPrimary}>
            {Icons.plus} Report Bug
          </Link>
        </div>
      </div>

      <section className={s.card} style={{ margin: '0 24px' }}>
        <div className={s.tableContainer}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Bug</th>
                <th>Project</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBugs.map(({ bug, project, reporter }) => (
                <tr key={bug.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{bug.title}</div>
                    {bug.environment && (
                      <div className={s.textMuted} style={{ fontSize: '0.8rem' }}>
                        Env: {bug.environment}
                      </div>
                    )}
                  </td>
                  <td>
                    {project ? (
                      <Link href={`/internal/projects/${project.id}`} className={s.link}>
                        {project.name}
                      </Link>
                    ) : (
                      <span className={s.textMuted}>-</span>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(bug.severity as BugSeverity), 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.8rem'
                    }}>
                      {bug.severity}
                    </span>
                  </td>
                  <td>
                    <span className={s.badge} style={{ 
                      background: getStatusColor(bug.status as BugStatus), 
                      color: '#fff' 
                    }}>
                      {bug.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {reporter ? reporter.name || reporter.email : <span className={s.textMuted}>Unknown</span>}
                  </td>
                  <td>{formatDateTime(bug.createdAt)}</td>
                  <td>
                    <Link href={`/internal/bugs/${bug.id}`} className={s.buttonIcon}>
                      {Icons.arrowRight}
                    </Link>
                  </td>
                </tr>
              ))}
              {allBugs.length === 0 && (
                <tr>
                  <td colSpan={7} className={s.emptyState}>
                    <div className={s.emptyStateIcon}>{Icons.bug}</div>
                    <p className={s.emptyStateText}>No bugs reported</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
