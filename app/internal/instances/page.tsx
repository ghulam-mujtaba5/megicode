import Link from 'next/link';
import { desc, eq, inArray, sql } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import s from '../styles.module.css';
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
import WorkflowVisualization from './WorkflowVisualization';

// Icons
const Icons = {
  workflow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  trendUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

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

  // Calculate aggregate metrics
  const runningCount = instanceRows.filter(r => r.instanceStatus === 'running').length;
  const completedCount = instanceRows.filter(r => r.instanceStatus === 'completed').length;
  const canceledCount = instanceRows.filter(r => r.instanceStatus === 'canceled').length;
  const totalOverdue = Array.from(statsByInstance.values()).reduce((sum, s) => sum + s.overdue, 0);
  const totalBlocked = Array.from(statsByInstance.values()).reduce((sum, s) => sum + s.blocked, 0);

  // Calculate average completion time
  const completedInstances = instanceRows.filter(r => r.instanceStatus === 'completed' && r.endedAt);
  const avgCompletionDays = completedInstances.length > 0
    ? Math.round(
        completedInstances.reduce((sum, r) => {
          const duration = r.endedAt!.getTime() - r.startedAt.getTime();
          return sum + (duration / (1000 * 60 * 60 * 24));
        }, 0) / completedInstances.length
      )
    : 0;

  return (
    <main className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.pageHeaderLeft}>
            <h1 className={s.pageTitle}>
              <span style={{ width: '28px', height: '28px', marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }}>{Icons.workflow}</span>
              Process Instances
            </h1>
            <p className={s.pageSubtitle}>
              Track and manage workflow execution across all projects
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div className={s.card} style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid var(--int-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '20px', height: '20px', color: 'var(--int-primary)' }}>{Icons.workflow}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-primary)' }}>{runningCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Running</div>
        </div>

        <div className={s.card} style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid var(--int-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '20px', height: '20px', color: 'var(--int-success)' }}>{Icons.check}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-success)' }}>{completedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Completed</div>
        </div>

        <div className={s.card} style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid var(--int-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '20px', height: '20px', color: 'var(--int-warning)' }}>{Icons.pause}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-warning)' }}>{canceledCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Canceled</div>
        </div>

        <div className={s.card} style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid var(--int-info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '20px', height: '20px', color: 'var(--int-info)' }}>{Icons.clock}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{avgCompletionDays}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Avg Days</div>
        </div>

        {(totalOverdue > 0 || totalBlocked > 0) && (
          <div className={s.card} style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid var(--int-error)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px', color: 'var(--int-error)' }}>{Icons.warning}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-error)' }}>{totalOverdue + totalBlocked}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Issues</div>
          </div>
        )}
      </section>

      {/* Alert Banner */}
      {totalOverdue > 0 && (
        <div style={{ 
          background: 'var(--int-error-light, rgba(239, 68, 68, 0.1))', 
          border: '1px solid var(--int-error)', 
          borderRadius: '12px', 
          padding: '1rem 1.25rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ width: '24px', height: '24px', color: 'var(--int-error)' }}>{Icons.warning}</span>
          <div style={{ flex: 1 }}>
            <strong style={{ color: 'var(--int-error)' }}>{totalOverdue} overdue task(s)</strong>
            <span style={{ color: 'var(--int-text-muted)', marginLeft: '0.5rem' }}>
              across active instances require attention
            </span>
          </div>
          <Link href="/internal/tasks?status=overdue" className={s.btnDanger} style={{ flexShrink: 0 }}>
            View Tasks
          </Link>
        </div>
      )}

      {/* Process Instance Cards with Workflow Visualization */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Active Workflows</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
            {instanceRows.length} total instance{instanceRows.length !== 1 ? 's' : ''}
          </span>
        </div>

        {instanceRows.length === 0 ? (
          <div className={s.card} style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: 'var(--int-text-muted)' }}>
              {Icons.workflow}
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>No process instances</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: '1rem' }}>
              Process instances are created when leads are converted to projects
            </p>
            <Link href="/internal/leads" className={s.btnPrimary}>
              View Leads
            </Link>
          </div>
        ) : (
          instanceRows.map((row) => {
            const stats = statsByInstance.get(row.instanceId) ?? { total: 0, open: 0, overdue: 0, blocked: 0 };
            
            return (
              <WorkflowVisualization
                key={row.instanceId}
                instance={{
                  instanceId: row.instanceId,
                  instanceStatus: row.instanceStatus,
                  currentStepKey: row.currentStepKey,
                  startedAt: row.startedAt,
                  endedAt: row.endedAt,
                  projectId: row.projectId,
                  projectName: row.projectName,
                  projectStatus: row.projectStatus,
                }}
                taskStats={stats}
              />
            );
          })
        )}
      </section>

      {/* Traditional Table View */}
      <section className={commonStyles.card} style={{ marginTop: '2rem' }}>
        <div className={commonStyles.row} style={{ padding: '1rem', borderBottom: '1px solid var(--int-border)' }}>
          <h2 style={{ margin: 0 }}>Instance Details</h2>
          <span className={commonStyles.muted}>Detailed view of all instances</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Instance</th>
                <th>Current Step</th>
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
                      <div style={{ fontWeight: 500 }}>{row.projectName}</div>
                      <div className={commonStyles.muted} style={{ marginTop: '0.25rem' }}>
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
                        <div className={commonStyles.muted} style={{ marginTop: '0.25rem' }}>
                          <span className={badgeClass(commonStyles, taskStatusColor('blocked'))}>
                            blocked: {stats.blocked}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={commonStyles.muted} style={{ fontSize: '0.875rem' }}>
                        {row.currentStepKey?.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim() ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{stats.open}</span>
                      <span className={commonStyles.muted}>/{stats.total}</span>
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
                    <td className={commonStyles.muted}>{formatDateTime(row.startedAt)}</td>
                    <td>
                      <Link href={`/internal/projects/${row.projectId}`} className={s.btnSecondary}>
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
