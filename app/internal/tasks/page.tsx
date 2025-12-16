import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { tasks, processInstances, projects } from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

export default async function MyTasksPage() {
  const session = await requireInternalSession();
  const userId = session.user.id;

  const db = getDb();

  if (!userId) {
    return (
      <main className={commonStyles.page}>
        <section className={commonStyles.card}>
          <h1>My Tasks</h1>
          <p className={commonStyles.muted}>Your user id is missing. Sign out and sign in again.</p>
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
    <main className={commonStyles.page}>
      <section className={commonStyles.card}>
        <div className={commonStyles.row}>
          <h1>My Tasks</h1>
          <span className={commonStyles.muted}>Total: {myTasks.length}</span>
        </div>

        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Project</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {myTasks.map((t) => {
              const instance = instancesById.get(t.instanceId);
              const project = instance ? projectsById.get(instance.projectId) : null;
              return (
                <tr key={t.id}>
                  <td>
                    <Link href={`/internal/tasks/${t.id}`}>
                      <div>{t.title}</div>
                      <div className={commonStyles.muted}>{t.key}</div>
                    </Link>
                  </td>
                  <td>
                    <span className={badgeClass(commonStyles, taskStatusColor(t.status))}>{t.status}</span>
                  </td>
                  <td>
                    {project ? <Link href={`/internal/projects/${project.id}`}>{project.name}</Link> : '—'}
                  </td>
                  <td>{formatDateTime(t.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
