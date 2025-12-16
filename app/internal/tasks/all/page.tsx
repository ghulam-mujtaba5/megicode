import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { tasks, projects, users } from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  project: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
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

export default async function AllTasksPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const allTasks = await db
    .select({
      task: tasks,
      project: projects,
      assignee: users,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .orderBy(desc(tasks.createdAt))
    .all();

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>All Tasks</h1>
          <p className={s.pageSubtitle}>Global task overview across all projects</p>
        </div>
        <div className={s.pageActions}>
          <Link href="/internal/tasks" className={s.buttonSecondary}>
            My Tasks
          </Link>
        </div>
      </div>

      <section className={s.card} style={{ margin: '0 24px' }}>
        <div className={s.tableContainer}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map(({ task, project, assignee }) => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    {task.description && (
                      <div className={s.textMuted} style={{ fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.description}
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
                    {assignee ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {assignee.image ? (
                          <img src={assignee.image} alt={assignee.name || ''} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                        ) : (
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--int-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {Icons.user}
                          </div>
                        )}
                        <span>{assignee.name || assignee.email}</span>
                      </div>
                    ) : (
                      <span className={s.textMuted}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className={getBadgeClass(taskStatusColor(task.status))}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {task.dueAt ? formatDateTime(task.dueAt) : <span className={s.textMuted}>-</span>}
                  </td>
                  <td>
                    <Link href={`/internal/tasks/${task.id}`} className={s.buttonIcon}>
                      {Icons.arrowRight}
                    </Link>
                  </td>
                </tr>
              ))}
              {allTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className={s.emptyState}>
                    <div className={s.emptyStateIcon}>{Icons.tasks}</div>
                    <p className={s.emptyStateText}>No tasks found</p>
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
