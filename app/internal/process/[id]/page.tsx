/**
 * Process Detail Page
 * 
 * Shows full details of a business process instance with timeline and step execution
 */
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { 
  processInstances, 
  projects, 
  leads, 
  clients, 
  events,
  businessProcessStepInstances 
} from '@/lib/db/schema';
import { getActiveBusinessProcessDefinition } from '@/lib/workflow/processEngine';
import { formatDateTime } from '@/lib/internal/ui';
import ProcessDetailClient from './ProcessDetailClient';

// Icons
const Icons = {
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  process: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
};

const statusConfig: Record<string, { label: string; className: string }> = {
  running: { label: 'Running', className: s.badgePrimary },
  completed: { label: 'Completed', className: s.badgeSuccess },
  canceled: { label: 'Canceled', className: s.badgeDefault },
  errored: { label: 'Error', className: s.badgeDanger },
};

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(['admin', 'pm', 'dev']);
  const db = getDb();
  const { id } = await params;

  // Fetch process instance
  const instance = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.id, id))
    .get();

  if (!instance) {
    notFound();
  }

  // Fetch related data
  const project = instance.projectId
    ? await db.select().from(projects).where(eq(projects.id, instance.projectId)).get()
    : null;

  const lead = project?.leadId
    ? await db.select().from(leads).where(eq(leads.id, project.leadId)).get()
    : null;

  const client = project?.clientId
    ? await db.select().from(clients).where(eq(clients.id, project.clientId)).get()
    : null;

  // Fetch events/history
  const history = await db
    .select()
    .from(events)
    .where(eq(events.instanceId, id))
    .orderBy(desc(events.createdAt))
    .all();

  // Fetch step instances
  const stepHistory = await db
    .select()
    .from(businessProcessStepInstances)
    .where(eq(businessProcessStepInstances.processInstanceId, id))
    .orderBy(businessProcessStepInstances.startedAt)
    .all();

  // Get process definition
  const { definition } = await getActiveBusinessProcessDefinition();
  const currentStep = definition.steps.find(s => s.key === instance.currentStepKey);

  // Calculate progress
  const completedStepKeys = stepHistory
    .filter(sh => sh.status === 'completed')
    .map(sh => sh.stepKey);
  
  const mainSteps = definition.steps.filter(
    s => s.type !== 'gateway' && s.type !== 'start_event' && s.type !== 'end_event'
  );
  const progressPercent = Math.round((completedStepKeys.length / mainSteps.length) * 100);

  // Format duration
  const getDuration = () => {
    if (!instance.startedAt) return null;
    const start = new Date(instance.startedAt);
    const end = instance.endedAt ? new Date(instance.endedAt) : new Date();
    const diff = end.getTime() - start.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const config = statusConfig[instance.status] || statusConfig.running;

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <Link href="/internal/process" className={s.backLink}>
            <span className={s.icon}>{Icons.back}</span>
            Back to Processes
          </Link>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>
              <span className={s.icon}>{Icons.process}</span>
              {project?.name || 'Business Process'}
            </h1>
            <p className={s.pageSubtitle}>
              {definition.name} • Started {instance.startedAt 
                ? formatDateTime(new Date(instance.startedAt))
                : 'Unknown'
              }
            </p>
          </div>
        </div>
        <div className={s.pageActions}>
          <span className={`${s.badge} ${config.className}`} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
        <div className={s.cardBody}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-3)' }}>
            <span style={{ fontWeight: 600 }}>Progress</span>
            <span style={{ color: 'var(--int-text-muted)' }}>{progressPercent}%</span>
          </div>
          <div className={s.progressBar}>
            <div 
              className={s.progressFill} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 'var(--int-space-2)',
            fontSize: '0.875rem',
            color: 'var(--int-text-muted)'
          }}>
            <span>{completedStepKeys.length} of {mainSteps.length} steps completed</span>
            {getDuration() && (
              <span>
                <span className={s.icon} style={{ marginRight: '0.25rem' }}>{Icons.clock}</span>
                Duration: {getDuration()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={s.grid2}>
        {/* Left Column - Process Info & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
          {/* Current Step Card */}
          {currentStep && instance.status === 'running' && (
            <div className={`${s.card} ${s.cardHighlight}`}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Current Step</h3>
                <span className={`${s.badge} ${s[`badge${currentStep.lane}`]}`}>
                  {currentStep.lane.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <div className={s.cardBody}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>
                  {currentStep.title}
                </h4>
                {currentStep.description && (
                  <p style={{ margin: '0 0 1rem', color: 'var(--int-text-muted)' }}>
                    {currentStep.description}
                  </p>
                )}
                {currentStep.participant && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--int-text-muted)', fontSize: '0.875rem' }}>
                    <span className={s.icon}>{Icons.user}</span>
                    Assigned to: {currentStep.participant}
                  </div>
                )}
                {currentStep.automationAction && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <code style={{ color: 'rgb(245, 158, 11)' }}>
                      {currentStep.automationAction}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Entities */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Related Information</h3>
            </div>
            <div className={s.cardBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lead && (
                  <div className={s.infoRow}>
                    <span className={s.icon}>{Icons.user}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{lead.name}</div>
                      {lead.email && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                          {lead.email}
                        </div>
                      )}
                    </div>
                    <Link href={`/internal/leads/${lead.id}`} className={s.btnSecondary} style={{ marginLeft: 'auto' }}>
                      View Lead
                    </Link>
                  </div>
                )}
                {client && (
                  <div className={s.infoRow}>
                    <span className={s.icon}>{Icons.building}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{client.name}</div>
                      {client.company && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                          {client.company}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {project && (
                  <div className={s.infoRow}>
                    <span className={s.icon}>{Icons.process}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{project.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                        Status: {project.status}
                      </div>
                    </div>
                    <Link href={`/internal/projects/${project.id}`} className={s.btnSecondary} style={{ marginLeft: 'auto' }}>
                      View Project
                    </Link>
                  </div>
                )}
                {lead?.srsUrl && (
                  <div className={s.infoRow}>
                    <span className={s.icon}>{Icons.link}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>SRS Document</div>
                      <a 
                        href={lead.srsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.875rem', color: 'var(--int-primary)' }}
                      >
                        {lead.srsUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Interactive Timeline */}
        <ProcessDetailClient
          instanceId={instance.id}
          instanceStatus={instance.status}
          currentStepKey={instance.currentStepKey || undefined}
          definition={{
            key: definition.key,
            name: definition.name,
            steps: definition.steps.map(step => ({
              key: step.key,
              title: step.title,
              type: step.type,
              lane: step.lane,
              isManual: step.isManual,
              automationAction: step.automationAction,
              participant: step.participant,
              description: step.description,
              nextStepKeys: step.nextSteps,
            })),
            lanes: definition.lanes.map(lane => ({
              key: lane,
              displayName: lane.replace(/([A-Z])/g, ' $1').trim(),
              participant: lane,
            })),
          }}
          completedSteps={completedStepKeys}
          stepHistory={stepHistory.map(sh => ({
            stepKey: sh.stepKey,
            status: sh.status,
            startedAt: sh.startedAt?.toISOString() || null,
            completedAt: sh.completedAt?.toISOString() || null,
            outputData: sh.outputData ? (typeof sh.outputData === 'string' ? JSON.parse(sh.outputData) : sh.outputData) : null,
          }))}
          userRole={session.user.role || 'viewer'}
        />
      </div>

      {/* Event History */}
      <div className={s.card} style={{ marginTop: 'var(--int-space-6)' }}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Event History</h3>
        </div>
        <div className={s.cardBody}>
          {history.length === 0 ? (
            <p style={{ color: 'var(--int-text-muted)', textAlign: 'center', padding: '2rem' }}>
              No events recorded
            </p>
          ) : (
            <div className={s.eventTimeline}>
              {history.slice(0, 20).map(event => (
                <div key={event.id} className={s.eventItem}>
                  <div className={s.eventDot} />
                  <div className={s.eventContent}>
                    <div className={s.eventType}>{event.type}</div>
                    <div className={s.eventTime}>
                      {formatDateTime(new Date(event.createdAt))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
