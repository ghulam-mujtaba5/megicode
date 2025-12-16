import Link from 'next/link';
import { desc, eq, inArray, sql } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { tasks, processInstances, projects } from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  project: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
};

function getBadgeClass(color: BadgeColor) {
  const map: Record<BadgeColor, string> = {
    blue: s.badgePrimary,
    green: s.badgeSuccess,
    yellow: s.badgeWarning,
    red: s.badgeDanger,
    gray: s.badgeDefault,
  };
  return `${s.badge} ${map[color] || s.badgeDefault}`;
}

export default async function MyTasksPage() {
  const session = await requireInternalSession();
  const userId = session.user.id;

  const db = getDb();

  if (!userId) {
    return (
      <main className={s.page}>
        <div className={s.pageHeader}>
          <div className={s.pageHeaderContent}>
            <h1 className={s.pageTitle}>My Tasks</h1>
          </div>
        </div>
        <section className={`${s.card} ${s.mt3}`} style={{ margin: '0 24px' }}>
          <div className={s.emptyState}>
            <div className={s.emptyStateIcon}>{Icons.tasks}</div>
            <p className={s.emptyStateText}>User ID Missing</p>
            <p className={s.textMuted}>Sign out and sign in again to view your tasks.</p>
          </div>
        </section>
      </main>
    );
  }

  const myTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.assignedToUserId, userId))
    .orderBy(desc(tasks.updatedAt))
    .all();

  // Get task stats
  const taskStats = {
    total: myTasks.length,
    todo: myTasks.filter(t => t.status === 'todo').length,
    inProgress: myTasks.filter(t => t.status === 'in_progress').length,
    blocked: myTasks.filter(t => t.status === 'blocked').length,
    done: myTasks.filter(t => t.status === 'done').length,
  };

  const instanceIds = Array.from(new Set(myTasks.map((t) => t.instanceId)));
  const instances = instanceIds.length
    ? await db.select().from(processInstances).where(inArray(processInstances.id, instanceIds)).all()
    : [];

  const projectIds = Array.from(new Set(instances.map((i) => i.projectId)));
  const projectRows = projectIds.length
    ? await db.select().from(projects).where(inArray(projects.id, projectIds)).all()
    : [];

  const instancesById = new Map(instances.map((i) => [i.id, i] as const));
  const projectsById = new Map(projectRows.map((p) => [p.id, p] as const));

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>My Tasks</h1>
            <p className={s.pageSubtitle}>{taskStats.total} tasks assigned to you</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <section className={s.kpiSection}>
        <div className={s.kpiGrid}>
          <div className={`${s.kpiCard} ${s.kpiCardPrimary}`}>
            <div className={s.kpiIcon}>{Icons.tasks}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{taskStats.total}</span>
              <span className={s.kpiLabel}>Total Tasks</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardWarning}`}>
            <div className={s.kpiIcon}>{Icons.tasks}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{taskStats.todo}</span>
              <span className={s.kpiLabel}>To Do</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardInfo}`}>
            <div className={s.kpiIcon}>{Icons.clock}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{taskStats.inProgress}</span>
              <span className={s.kpiLabel}>In Progress</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardSuccess}`}>
            <div className={s.kpiIcon}>{Icons.tasks}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{taskStats.done}</span>
              <span className={s.kpiLabel}>Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks List */}
      <div className={s.dashboardGrid} style={{ gridTemplateColumns: '1fr' }}>
        <section className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={s.cardIcon}>{Icons.tasks}</div>
              <h2 className={s.cardTitle}>All Tasks</h2>
              <span className={s.badge}>{taskStats.total}</span>
            </div>
          </div>
          <div className={s.cardBody}>
            {myTasks.length > 0 ? (
              <div className={s.tableContainer}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Project</th>
                      <th>Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTasks.map((t) => {
                      const instance = instancesById.get(t.instanceId);
                      const project = instance ? projectsById.get(instance.projectId) : null;
                      return (
                        <tr key={t.id}>
                          <td>
                            <div className={s.leadContent}>
                              <span className={s.leadName}>{t.title}</span>
                              <span className={s.leadCompany}>{t.key}</span>
                            </div>
                          </td>
                          <td>
                            <span className={getBadgeClass(taskStatusColor(t.status))}>
                              {t.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                            {t.priority && (
                              <span className={`${s.badgeOutline} ${
                                t.priority === 'critical' ? s.badgeDanger :
                                t.priority === 'high' ? s.badgeWarning :
                                t.priority === 'medium' ? s.badgePrimary :
                                s.badgeDefault
                              }`}>
                                {t.priority}
                              </span>
                            )}
                          </td>
                          <td>
                            {project ? (
                              <Link href={`/internal/projects/${project.id}`} className={s.textPrimary}>
                                {project.name}
                              </Link>
                            ) : (
                              <span className={s.textMuted}>—</span>
                            )}
                          </td>
                          <td className={s.textMuted}>{formatDateTime(t.updatedAt)}</td>
                          <td>
                            <Link href={`/internal/tasks/${t.id}`} className={s.tableAction}>
                              Open {Icons.arrowRight}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={s.emptyState}>
                <div className={s.emptyStateIcon}>{Icons.tasks}</div>
                <p className={s.emptyStateText}>No tasks assigned</p>
                <p className={s.textMuted}>Tasks will appear here when assigned to you</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
