import Link from 'next/link';
import { eq, desc, and, sql } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, tasks, projects } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default async function InternalUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireInternalSession();
  const { id } = await params;

  const db = getDb();

  const user = await db.select().from(users).where(eq(users.id, id)).get();
  if (!user) {
    return (
      <main className={s.page}>
        <div className={s.container}>
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>{Icons.user} User</h1>
              <p className={s.pageSubtitle}>This user could not be found.</p>
            </div>
            <div className={s.pageActions}>
              <Link href="/internal/team" className={`${s.btn} ${s.btnSecondary}`}>
                {Icons.back} Team
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const [openTasks, recentTasks] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedToUserId, user.id),
          sql`status not in ('done', 'canceled')`
        )
      )
      .get(),
    db
      .select({
        task: tasks,
        project: projects,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.assignedToUserId, user.id))
      .orderBy(desc(tasks.updatedAt))
      .limit(8)
      .all(),
  ]);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Link href="/internal/team" className={s.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Team
              </Link>
            </div>
            <h1 className={s.pageTitle}>
              {Icons.user} {user.name || 'User'}
            </h1>
            <p className={s.pageSubtitle}>{user.email}</p>
          </div>
          <div className={s.pageActions}>
            <Link href={`/internal/tasks?assignee=${user.id}`} className={`${s.btn} ${s.btnSecondary}`}>
              View tasks
            </Link>
          </div>
        </div>

        <section className={s.grid2}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Profile</h2>
            </div>
            <div className={s.cardBody}>
              <div className={s.kpiGrid}>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Role</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{user.role}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Status</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{user.status}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Open tasks</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{openTasks?.count ?? 0}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Created</div>
                  <div className={s.kpiValue} style={{ fontSize: '1.05rem' }}>{formatDateTime(user.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Recent assigned tasks</h2>
            </div>
            <div className={s.cardBody}>
              {recentTasks.length === 0 ? (
                <p className={s.pageSubtitle} style={{ margin: 0 }}>No tasks assigned yet.</p>
              ) : (
                <div className={s.tableContainer}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map(({ task, project }) => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>{project?.name ?? '—'}</td>
                          <td><span className={`${s.badge} ${s.badgeDefault}`}>{task.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <Link href={`/internal/tasks/${task.id}`} className={s.btnSmall}>Open</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
