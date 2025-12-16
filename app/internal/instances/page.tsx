import Link from 'next/link';
import { desc, eq, inArray } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processInstances, projects, tasks, type TaskStatus } from '@/lib/db/schema';
import {
  formatDateTime,
  instanceStatusColor,
  projectStatusColor,
  taskStatusColor,
  type BadgeColor,
} from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

function isTaskOpen(status: TaskStatus) {
  return status !== 'done' && status !== 'canceled';
}

export default async function InstancesPage() {
  await requireInternalSession();
  const db = getDb();

  const instanceRows = await db
    .select({
      instanceId: processInstances.id,
      instanceStatus: processInstances.status,
      currentStepKey: processInstances.currentStepKey,
      startedAt: processInstances.startedAt,
      endedAt: processInstances.endedAt,
      projectId: projects.id,
      projectName: projects.name,
      projectStatus: projects.status,
    })
    .from(processInstances)
    .innerJoin(projects, eq(processInstances.projectId, projects.id))
    .orderBy(desc(processInstances.startedAt))
    .all();

  const instanceIds = instanceRows.map((r) => r.instanceId);
  const nowMs = Date.now();

  const taskRows =
    instanceIds.length === 0
      ? []
      : await db
          .select({
            instanceId: tasks.instanceId,
            status: tasks.status,
            dueAt: tasks.dueAt,
          })
          .from(tasks)
          .where(inArray(tasks.instanceId, instanceIds))
          .all();

  const statsByInstance = new Map<
    string,
    { total: number; open: number; overdue: number; blocked: number }
  >();

  for (const row of taskRows) {
    const current = statsByInstance.get(row.instanceId) ?? {
      total: 0,
      open: 0,
      overdue: 0,
      blocked: 0,
    };

    current.total += 1;
    if (isTaskOpen(row.status)) {
      current.open += 1;
      if (row.status === 'blocked') current.blocked += 1;
      if (row.dueAt && row.dueAt.getTime() < nowMs) current.overdue += 1;
    }

    statsByInstance.set(row.instanceId, current);
  }

  return (
    <main className={commonStyles.page}>
      <section className={commonStyles.card}>
        <div className={commonStyles.row}>
          <h1>Instances</h1>
          <span className={commonStyles.muted}>Total: {instanceRows.length}</span>
        </div>

        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Instance</th>
              <th>Step</th>
              <th>Tasks</th>
              <th>Overdue</th>
              <th>Started</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {instanceRows.map((row) => {
              const stats =
                statsByInstance.get(row.instanceId) ?? ({ total: 0, open: 0, overdue: 0, blocked: 0 } as const);

              return (
                <tr key={row.instanceId}>
                  <td>
                    <div>{row.projectName}</div>
                    <div className={commonStyles.muted}>
                      <span className={badgeClass(commonStyles, projectStatusColor(row.projectStatus))}>
                        {row.projectStatus}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={badgeClass(commonStyles, instanceStatusColor(row.instanceStatus))}>
                      {row.instanceStatus}
                    </span>
                    {stats.blocked > 0 && (
                      <div className={commonStyles.muted}>
                        <span className={badgeClass(commonStyles, taskStatusColor('blocked'))}>
                          blocked: {stats.blocked}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className={commonStyles.muted}>{row.currentStepKey ?? ''}</td>
                  <td>
                    {stats.open}/{stats.total}
                  </td>
                  <td>
                    {stats.overdue > 0 ? (
                      <span className={badgeClass(commonStyles, taskStatusColor('blocked'))}>
                        {stats.overdue}
                      </span>
                    ) : (
                      <span className={commonStyles.muted}>0</span>
                    )}
                  </td>
                  <td>{formatDateTime(row.startedAt)}</td>
                  <td>
                    <Link href={`/internal/projects/${row.projectId}`}>Open</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
