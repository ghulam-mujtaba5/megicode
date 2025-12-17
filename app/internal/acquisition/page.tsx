/**
 * Client Acquisition & Onboarding Dashboard
 * 
 * Complete implementation of the Megicode Client Acquisition workflow
 * following the BPMN process definition:
 * 
 * 1. Lead Submission → Lead Record Creation → Lead Scoring
 * 2. If score qualifies → Follow-up emails → Review → Schedule Discovery
 * 3. Discovery Call → Gather Requirements → Proposal Draft
 * 4. Proposal Approval → Send to Client / Modify
 * 5. Client Review → Accept/Decline
 * 6. Contract Signing → Onboarding Automation
 * 7. Project Setup → Assign Team → Kickoff Meeting
 */
import Link from 'next/link';
import { desc, eq, and, or, sql, isNull, InferSelectModel } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, proposals, projects, processInstances, clients, events, tasks } from '@/lib/db/schema';

type Lead = InferSelectModel<typeof leads>;
type Proposal = InferSelectModel<typeof proposals>;
type Project = InferSelectModel<typeof projects>;
type ProcessInstance = InferSelectModel<typeof processInstances>;
import { getActiveBusinessProcessDefinition } from '@/lib/workflow/processEngine';
import { formatDateTime } from '@/lib/internal/ui';
import AcquisitionPipelineClient from './AcquisitionPipelineClient';

// Icons
const Icons = {
  pipeline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  leads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  discovery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  proposal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  contract: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><path d="M12 17l-1 2-2-1"/></svg>,
  onboarding: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
  project: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

// Pipeline stages matching the BPMN workflow
const PIPELINE_STAGES = [
  { key: 'new_leads', label: 'New Leads', icon: Icons.leads, description: 'Fresh leads awaiting scoring', color: 'blue' },
  { key: 'qualified', label: 'Qualified', icon: Icons.star, description: 'High-score leads ready for outreach', color: 'green' },
  { key: 'discovery', label: 'Discovery', icon: Icons.discovery, description: 'Scheduled or completed discovery calls', color: 'cyan' },
  { key: 'proposal', label: 'Proposal', icon: Icons.proposal, description: 'Proposals being prepared or sent', color: 'orange' },
  { key: 'negotiation', label: 'Negotiation', icon: Icons.contract, description: 'Client reviewing proposal', color: 'purple' },
  { key: 'onboarding', label: 'Onboarding', icon: Icons.onboarding, description: 'Contract signed, onboarding started', color: 'teal' },
  { key: 'active_project', label: 'Active Project', icon: Icons.project, description: 'Project kicked off', color: 'green' },
];

export default async function AcquisitionPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  // Get process definition for workflow context
  const { definition } = await getActiveBusinessProcessDefinition();

  // Fetch all leads with related data
  const allLeads = await db.select().from(leads).where(isNull(leads.deletedAt)).orderBy(desc(leads.createdAt)).all();
  
  // Fetch all proposals
  const allProposals = await db.select().from(proposals).orderBy(desc(proposals.createdAt)).all();
  
  // Fetch all projects
  const allProjects = await db.select().from(projects).where(isNull(projects.deletedAt)).orderBy(desc(projects.createdAt)).all();
  
  // Fetch running process instances
  const runningInstances = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.status, 'running'))
    .all();

  // Fetch recent events for activity feed
  const recentEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt))
    .limit(20)
    .all();

  // Calculate pipeline metrics
  const pipelineData = calculatePipelineData(allLeads, allProposals, allProjects, runningInstances);

  // Calculate conversion metrics
  const metrics = {
    totalLeads: allLeads.length,
    leadsThisMonth: allLeads.filter(l => {
      const date = new Date(l.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    conversionRate: allLeads.length > 0 
      ? Math.round((allLeads.filter(l => l.status === 'converted').length / allLeads.length) * 100) 
      : 0,
    activeDeals: allProposals.filter(p => ['sent', 'pending_approval'].includes(p.status)).length,
    totalPipelineValue: allProposals
      .filter(p => ['draft', 'sent', 'pending_approval'].includes(p.status))
      .reduce((sum, p) => sum + (p.totalAmount || 0), 0) / 100,
    avgDealSize: allProposals.filter(p => p.status === 'accepted').length > 0
      ? allProposals.filter(p => p.status === 'accepted').reduce((sum, p) => sum + (p.totalAmount || 0), 0) / 
        allProposals.filter(p => p.status === 'accepted').length / 100
      : 0,
    runningProcesses: runningInstances.length,
    awaitingAction: runningInstances.filter(i => {
      const step = definition.steps.find(s => s.key === i.currentStepKey);
      return step?.isManual === true;
    }).length,
  };

  // Get urgent items (leads/proposals needing attention)
  const urgentItems = getUrgentItems(allLeads, allProposals, runningInstances, definition);

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>
              <span className={s.icon}>{Icons.pipeline}</span>
              Client Acquisition & Onboarding
            </h1>
            <p className={s.pageSubtitle}>
              Complete workflow management from lead to active project
            </p>
          </div>
        </div>
        <div className={s.pageActions}>
          <Link href="/internal/leads/import" className={s.btnSecondary}>
            <span className={s.icon}>{Icons.plus}</span>
            Import Leads
          </Link>
          <Link href="/internal/process/showcase" className={s.btnPrimary}>
            <span className={s.icon}>{Icons.chart}</span>
            View Workflow
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <section className={s.kpiSection}>
        <div className={s.kpiGrid}>
          <div className={`${s.kpiCard} ${s.kpiCardPrimary}`}>
            <div className={s.kpiIcon}>{Icons.leads}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{metrics.totalLeads}</span>
              <span className={s.kpiLabel}>Total Leads</span>
              <span className={s.kpiSubtext}>+{metrics.leadsThisMonth} this month</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardSuccess}`}>
            <div className={s.kpiIcon}>{Icons.check}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{metrics.conversionRate}%</span>
              <span className={s.kpiLabel}>Conversion Rate</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardWarning}`}>
            <div className={s.kpiIcon}>{Icons.proposal}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>${metrics.totalPipelineValue.toLocaleString()}</span>
              <span className={s.kpiLabel}>Pipeline Value</span>
              <span className={s.kpiSubtext}>{metrics.activeDeals} active deals</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardInfo}`}>
            <div className={s.kpiIcon}>{Icons.play}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{metrics.runningProcesses}</span>
              <span className={s.kpiLabel}>Active Workflows</span>
              <span className={s.kpiSubtext}>{metrics.awaitingAction} awaiting action</span>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Action Items */}
      {urgentItems.length > 0 && (
        <section className={s.card} style={{ marginBottom: 'var(--int-space-6)', borderLeft: '4px solid var(--int-warning)' }}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={`${s.cardIcon} ${s.cardIconWarning}`}>{Icons.alert}</div>
              <h2 className={s.cardTitle}>Requires Your Attention</h2>
              <span className={`${s.badge} ${s.badgeWarning}`}>{urgentItems.length}</span>
            </div>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            <div className={s.dataList}>
              {urgentItems.slice(0, 5).map((item, idx) => (
                <Link key={idx} href={item.href} className={s.dataListItem}>
                  <span className={`${s.icon} ${s[`text${item.priority}`]}`}>{item.icon}</span>
                  <div className={s.dataListContent}>
                    <div className={s.dataListTitle}>{item.title}</div>
                    <div className={s.dataListMeta}>{item.description}</div>
                  </div>
                  <span className={`${s.badge} ${s[`badge${item.priority}`]}`}>{item.actionLabel}</span>
                  <span className={s.icon}>{Icons.arrowRight}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pipeline View */}
      <section className={s.card} style={{ marginBottom: 'var(--int-space-6)' }}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={`${s.cardIcon} ${s.cardIconPrimary}`}>{Icons.pipeline}</div>
            <h2 className={s.cardTitle}>Acquisition Pipeline</h2>
          </div>
          <Link href="/internal/leads/board" className={s.btnSecondary} style={{ marginLeft: 'auto' }}>
            Open Kanban Board
          </Link>
        </div>
        <div className={s.cardBody}>
          <AcquisitionPipelineClient 
            stages={PIPELINE_STAGES}
            data={pipelineData}
            definition={{
              key: definition.key,
              name: definition.name,
              lanes: definition.lanes,
            }}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={s.grid2}>
        {/* Recent Activity */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={`${s.cardIcon} ${s.cardIconInfo}`}>{Icons.clock}</div>
              <h2 className={s.cardTitle}>Recent Activity</h2>
            </div>
            <Link href="/internal/reports" className={s.btnSecondary}>
              View All
            </Link>
          </div>
          <div className={s.cardBody} style={{ padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
            {recentEvents.length === 0 ? (
              <p style={{ padding: 'var(--int-space-6)', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                No recent activity
              </p>
            ) : (
              <div className={s.eventTimeline}>
                {recentEvents.map(event => (
                  <div key={event.id} className={s.eventItem}>
                    <div className={s.eventDot} />
                    <div className={s.eventContent}>
                      <div className={s.eventType}>{formatEventType(event.type)}</div>
                      <div className={s.eventTime}>{formatDateTime(new Date(event.createdAt))}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={`${s.cardIcon} ${s.cardIconSuccess}`}>{Icons.play}</div>
              <h2 className={s.cardTitle}>Quick Actions</h2>
            </div>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
              <Link href="/internal/leads" className={s.actionCard}>
                <span className={s.icon}>{Icons.leads}</span>
                <div>
                  <h4>Manage Leads</h4>
                  <p>View, score, and qualify leads</p>
                </div>
                <span className={s.icon}>{Icons.arrowRight}</span>
              </Link>
              <Link href="/internal/proposals" className={s.actionCard}>
                <span className={s.icon}>{Icons.proposal}</span>
                <div>
                  <h4>Create Proposal</h4>
                  <p>Draft and send client proposals</p>
                </div>
                <span className={s.icon}>{Icons.arrowRight}</span>
              </Link>
              <Link href="/internal/process" className={s.actionCard}>
                <span className={s.icon}>{Icons.play}</span>
                <div>
                  <h4>Active Workflows</h4>
                  <p>Monitor running processes</p>
                </div>
                <span className={s.icon}>{Icons.arrowRight}</span>
              </Link>
              <Link href="/internal/clients" className={s.actionCard}>
                <span className={s.icon}>{Icons.onboarding}</span>
                <div>
                  <h4>Client Directory</h4>
                  <p>View all clients</p>
                </div>
                <span className={s.icon}>{Icons.arrowRight}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps Overview */}
      <section className={s.card} style={{ marginTop: 'var(--int-space-6)' }}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={`${s.cardIcon} ${s.cardIconPrimary}`}>{Icons.chart}</div>
            <h2 className={s.cardTitle}>Workflow Steps</h2>
          </div>
          <Link href="/internal/process/showcase" className={s.btnSecondary}>
            Interactive View
          </Link>
        </div>
        <div className={s.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--int-space-4)' }}>
            {definition.lanes.map(lane => {
              const laneSteps = definition.steps.filter(step => step.lane === lane);
              const colors: Record<string, string> = {
                Client: 'Primary',
                BusinessDevelopment: 'Success',
                AutomationCRM: 'Warning',
                ProjectManagement: 'Info',
              };
              return (
                <div key={lane} style={{ background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius-lg)', padding: 'var(--int-space-4)' }}>
                  <h4 style={{ margin: '0 0 var(--int-space-3)', display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                    <span className={`${s.badge} ${s[`badge${colors[lane] || 'Default'}`]}`}>
                      {laneSteps.length}
                    </span>
                    {lane.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.875rem' }}>
                    {laneSteps.slice(0, 5).map(step => (
                      <li key={step.key} style={{ padding: 'var(--int-space-1) 0', color: 'var(--int-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: step.isManual ? 'var(--int-primary)' : 'var(--int-success)' }} />
                        {step.title}
                      </li>
                    ))}
                    {laneSteps.length > 5 && (
                      <li style={{ padding: 'var(--int-space-1) 0', color: 'var(--int-text-muted)', fontStyle: 'italic' }}>
                        +{laneSteps.length - 5} more...
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

// Helper functions
function calculatePipelineData(
  leads: Lead[],
  proposals: Proposal[],
  projects: Project[],
  instances: ProcessInstance[]
) {
  return {
    new_leads: leads.filter(l => l.status === 'new'),
    qualified: leads.filter(l => l.status === 'in_review'),
    discovery: leads.filter(l => {
      // Leads with proposals in draft or leads approved but no proposal sent
      const hasProposal = proposals.some(p => p.leadId === l.id);
      return l.status === 'approved' && !hasProposal;
    }),
    proposal: proposals.filter(p => ['draft', 'pending_approval', 'approved'].includes(p.status)),
    negotiation: proposals.filter(p => p.status === 'sent'),
    onboarding: leads.filter(l => l.status === 'converted' && !projects.some(p => p.leadId === l.id && p.status !== 'new')),
    active_project: projects.filter(p => ['in_progress', 'in_qa'].includes(p.status)),
  };
}

function getUrgentItems(
  leads: Lead[],
  proposals: Proposal[],
  instances: ProcessInstance[],
  definition: any
) {
  const items: any[] = [];

  // New leads older than 24 hours without action
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  leads.filter(l => l.status === 'new' && new Date(l.createdAt).getTime() < dayAgo).forEach(lead => {
    items.push({
      title: lead.name,
      description: 'New lead waiting for review',
      href: `/internal/leads/${lead.id}`,
      icon: Icons.leads,
      priority: 'Warning',
      actionLabel: 'Review',
    });
  });

  // Proposals awaiting approval
  proposals.filter(p => p.status === 'pending_approval').forEach(proposal => {
    items.push({
      title: proposal.title,
      description: 'Proposal pending internal approval',
      href: `/internal/proposals/${proposal.id}`,
      icon: Icons.proposal,
      priority: 'Warning',
      actionLabel: 'Approve',
    });
  });

  // Process instances awaiting manual action
  instances.forEach(inst => {
    const step = definition.steps.find((s: any) => s.key === inst.currentStepKey);
    if (step?.isManual) {
      items.push({
        title: step.title,
        description: `Workflow step requires action`,
        href: `/internal/process/${inst.id}`,
        icon: Icons.play,
        priority: 'Primary',
        actionLabel: 'Continue',
      });
    }
  });

  return items;
}

function formatEventType(type: string): string {
  const labels: Record<string, string> = {
    'lead.created': 'New Lead Created',
    'lead.updated': 'Lead Updated',
    'lead.status_changed': 'Lead Status Changed',
    'proposal.created': 'Proposal Created',
    'proposal.sent': 'Proposal Sent',
    'proposal.accepted': 'Proposal Accepted',
    'process.started': 'Workflow Started',
    'process.completed': 'Workflow Completed',
    'step.completed': 'Step Completed',
    'email.followup_sent': 'Follow-up Email Sent',
    'email.welcome_sent': 'Welcome Email Sent',
    'automation.nurture_triggered': 'Nurture Sequence Started',
  };
  return labels[type] || type.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
