import Link from 'next/link';
import { eq } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { bugs, projects, users } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  bug: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3 3 0 1 1 6 0v1" />
      <path d="M12 20v-6" />
      <path d="M6 13H2" />
      <path d="M22 13h-4" />
      <path d="M6 16H3" />
      <path d="M21 16h-3" />
      <path d="M8 13v7" />
      <path d="M16 13v7" />
      <path d="M9 10h6" />
    </svg>
  ),
};

function badgeForSeverity(sev: string) {
  switch (sev) {
    case 'critical':
      return `${s.badge} ${s.badgeError}`;
    case 'high':
      return `${s.badge} ${s.badgeWarning}`;
    case 'medium':
      return `${s.badge} ${s.badgePrimary}`;
    case 'low':
    default:
      return `${s.badge} ${s.badgeDefault}`;
  }
}

function badgeForStatus(st: string) {
  switch (st) {
    case 'resolved':
    case 'closed':
      return `${s.badge} ${s.badgeSuccess}`;
    case 'in_progress':
      return `${s.badge} ${s.badgeInfo}`;
    case 'wont_fix':
      return `${s.badge} ${s.badgeDefault}`;
    case 'open':
    default:
      return `${s.badge} ${s.badgeWarning}`;
  }
}

export default async function BugDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin', 'pm', 'dev', 'qa']);
  const { id } = await params;

  const db = getDb();

  const row = await db
    .select({
      bug: bugs,
      project: projects,
    })
    .from(bugs)
    .leftJoin(projects, eq(bugs.projectId, projects.id))
    .where(eq(bugs.id, id))
    .get();

  const bug = row?.bug;

  if (!bug) {
    return (
      <main className={s.page}>
        <div className={s.container}>
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>{Icons.bug} Bug</h1>
              <p className={s.pageSubtitle}>This bug report could not be found.</p>
            </div>
            <div className={s.pageActions}>
              <Link href="/internal/bugs" className={`${s.btn} ${s.btnSecondary}`}>
                {Icons.back} Bugs
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const project = row?.project;
  const [reporter, assignee] = await Promise.all([
    bug.reportedByUserId
      ? db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, bug.reportedByUserId)).get()
      : Promise.resolve(null),
    bug.assignedToUserId
      ? db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, bug.assignedToUserId)).get()
      : Promise.resolve(null),
  ]);

  const reporterName = reporter?.name ?? reporter?.email ?? bug.reportedByUserId ?? '—';
  const assigneeName = assignee?.name ?? assignee?.email ?? bug.assignedToUserId ?? '—';

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Link href="/internal/bugs" className={s.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Bugs
              </Link>
            </div>
            <h1 className={s.pageTitle}>
              {Icons.bug} {bug.title}
            </h1>
            <p className={s.pageSubtitle}>
              {project ? (
                <>
                  Project: <Link href={`/internal/projects/${project.id}`} className={s.link}>{project.name}</Link>
                </>
              ) : (
                'Project: —'
              )}
            </p>
          </div>
          <div className={s.pageActions}>
            <span className={badgeForSeverity(bug.severity)}>{bug.severity}</span>
            <span className={badgeForStatus(bug.status)}>{bug.status}</span>
          </div>
        </div>

        <section className={s.grid2}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Details</h2>
            </div>
            <div className={s.cardBody}>
              <div className={s.kpiGrid}>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Reported by</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{reporterName}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Assigned to</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{assigneeName}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Created</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{formatDateTime(bug.createdAt)}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Updated</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{formatDateTime(bug.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Description</h2>
            </div>
            <div className={s.cardBody}>
              {bug.description ? (
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{bug.description}</p>
              ) : (
                <p className={s.pageSubtitle} style={{ margin: 0 }}>No description provided.</p>
              )}

              {bug.stepsToReproduce && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 650, marginBottom: 6 }}>Steps to reproduce</div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{bug.stepsToReproduce}</p>
                </div>
              )}

              {bug.environment && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 650, marginBottom: 6 }}>Environment</div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{bug.environment}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
