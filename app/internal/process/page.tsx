/**
 * Process Management Page
 * 
 * Lists all business process instances with filtering and actions
 */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processInstances, projects, leads } from '@/lib/db/schema';
import { getActiveBusinessProcessDefinition } from '@/lib/workflow/processEngine';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  process: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  running: { label: 'Running', className: s.badgePrimary, icon: Icons.play },
  completed: { label: 'Completed', className: s.badgeSuccess, icon: Icons.check },
  canceled: { label: 'Canceled', className: s.badgeDefault, icon: Icons.x },
  errored: { label: 'Error', className: s.badgeDanger, icon: Icons.x },
};

export default async function ProcessPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();
  const params = await searchParams;

  const { id: defId, definition } = await getActiveBusinessProcessDefinition();

  // Fetch all process instances with related data
  const allInstances = await db
    .select({
      instance: processInstances,
      project: projects,
      lead: leads,
    })
    .from(processInstances)
    .leftJoin(projects, eq(processInstances.projectId, projects.id))
    .leftJoin(leads, eq(projects.leadId, leads.id))
    .where(eq(processInstances.processDefinitionId, defId))
    .orderBy(desc(processInstances.startedAt))
    .all();

  // Filter by status if provided
  const statusFilter = params.status;
  const filteredInstances = statusFilter && ['running', 'completed', 'canceled'].includes(statusFilter)
    ? allInstances.filter(r => r.instance.status === statusFilter)
    : allInstances;

  // Stats
  const stats = {
    total: allInstances.length,
    running: allInstances.filter(r => r.instance.status === 'running').length,
    completed: allInstances.filter(r => r.instance.status === 'completed').length,
    canceled: allInstances.filter(r => r.instance.status === 'canceled').length,
    errored: 0, // Schema doesn't support 'errored' status
  };

  // Get step titles from definition
  const getStepTitle = (stepKey: string) => {
    const step = definition.steps.find(s => s.key === stepKey);
    return step?.title || stepKey;
  };

  const getStepLane = (stepKey: string) => {
    const step = definition.steps.find(s => s.key === stepKey);
    return step?.lane || 'Unknown';
  };

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>
              <span className={s.icon}>{Icons.process}</span>
              Business Processes
            </h1>
            <p className={s.pageSubtitle}>
              {definition.name} • {stats.total} total instances
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
        <Link 
          href="/internal/process"
          className={`${s.card} ${s.cardHoverable} ${!statusFilter ? s.cardActive : ''}`}
        >
          <div className={s.cardBody}>
            <div className={s.statNumber}>{stats.total}</div>
            <div className={s.statLabel}>Total</div>
          </div>
        </Link>
        <Link 
          href="/internal/process?status=running"
          className={`${s.card} ${s.cardHoverable} ${statusFilter === 'running' ? s.cardActive : ''}`}
        >
          <div className={s.cardBody}>
            <div className={`${s.statNumber} ${s.textPrimary}`}>{stats.running}</div>
            <div className={s.statLabel}>Running</div>
          </div>
        </Link>
        <Link 
          href="/internal/process?status=completed"
          className={`${s.card} ${s.cardHoverable} ${statusFilter === 'completed' ? s.cardActive : ''}`}
        >
          <div className={s.cardBody}>
            <div className={`${s.statNumber} ${s.textSuccess}`}>{stats.completed}</div>
            <div className={s.statLabel}>Completed</div>
          </div>
        </Link>
        <Link 
          href="/internal/process?status=errored"
          className={`${s.card} ${s.cardHoverable} ${statusFilter === 'errored' ? s.cardActive : ''}`}
        >
          <div className={s.cardBody}>
            <div className={`${s.statNumber} ${s.textDanger}`}>{stats.errored}</div>
            <div className={s.statLabel}>Errors</div>
          </div>
        </Link>
      </div>

      {/* Processes Table */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>
            {statusFilter ? `${statusConfig[statusFilter]?.label || 'All'} Processes` : 'All Processes'}
          </h2>
          {statusFilter && (
            <Link href="/internal/process" className={s.btnSecondary}>
              Clear Filter
            </Link>
          )}
        </div>
        <div className={s.cardBody}>
          {filteredInstances.length === 0 ? (
            <div className={s.emptyState}>
              <span className={s.emptyIcon}>{Icons.process}</span>
              <p>No processes found</p>
            </div>
          ) : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Project / Lead</th>
                  <th>Current Step</th>
                  <th>Lane</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstances.map(({ instance, project, lead }) => {
                  const config = statusConfig[instance.status] || statusConfig.running;
                  const stepTitle = instance.currentStepKey 
                    ? getStepTitle(instance.currentStepKey)
                    : '-';
                  const lane = instance.currentStepKey
                    ? getStepLane(instance.currentStepKey)
                    : '-';

                  return (
                    <tr key={instance.id}>
                      <td>
                        <div className={s.cellStack}>
                          <span className={s.cellTitle}>
                            {project?.name || 'Untitled Process'}
                          </span>
                          {lead && (
                            <span className={s.cellSubtitle}>
                              {lead.name}
                              {lead.company && ` • ${lead.company}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={s.stepName}>{stepTitle}</span>
                      </td>
                      <td>
                        <span className={`${s.badge} ${s[`badge${lane}`]}`}>
                          {lane.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </td>
                      <td>
                        <span className={`${s.badge} ${config.className}`}>
                          {config.label}
                        </span>
                      </td>
                      <td>
                        <span className={s.cellSubtitle}>
                          {instance.startedAt 
                            ? formatDateTime(new Date(instance.startedAt))
                            : '-'
                          }
                        </span>
                      </td>
                      <td>
                        <div className={s.actionCell}>
                          <Link 
                            href={`/internal/process/${instance.id}`}
                            className={s.btnIcon}
                            title="View Process"
                          >
                            {Icons.arrowRight}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
