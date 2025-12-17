/**
 * Process Workflow Showcase Page
 * 
 * Modern, interactive visualization of the BPMN business process with:
 * - Interactive swimlane flowchart
 * - Live simulation with play/pause controls
 * - Process statistics and metrics
 * - Step-by-step execution logs
 */
import { requireRole } from '@/lib/internal/auth';
import Link from 'next/link';
import { getActiveBusinessProcessDefinition } from '@/lib/workflow/processEngine';
import ProcessShowcaseClient from './ProcessShowcaseClient';
import s from '../../styles.module.css';
import type { Lane } from '@/lib/workflow/businessProcess';

// Lane display configuration
const LANE_CONFIG: Record<string, { displayName: string; description: string; icon: string }> = {
  Client: {
    displayName: 'Client',
    description: 'Client-facing activities and approvals',
    icon: '👤',
  },
  BusinessDevelopment: {
    displayName: 'Business Development',
    description: 'Sales, qualification, and relationship management',
    icon: '💼',
  },
  AutomationCRM: {
    displayName: 'Automation & CRM',
    description: 'Automated system actions and integrations',
    icon: '⚙️',
  },
  ProjectManagement: {
    displayName: 'Project Management',
    description: 'Project setup, coordination, and delivery',
    icon: '📋',
  },
  Development: {
    displayName: 'Development & QA',
    description: 'Software engineering, testing, and deployment',
    icon: '💻',
  },
};

export default async function ProcessShowcasePage() {
  await requireRole(['admin', 'pm']);

  let definition;
  try {
    // Get the active business process definition
    const result = await getActiveBusinessProcessDefinition();
    definition = result.definition;
  } catch (error) {
    console.error('Error loading process definition:', error);
    return (
      <main className={s.page}>
        <div className={s.pageHeader}>
           <h1 className={s.pageTitle}>Workflow Showcase</h1>
        </div>
        <div className={s.card}>
          <div className={s.cardBody}>
            <p>Failed to load process definition. Please contact support.</p>
          </div>
        </div>
      </main>
    );
  }

  // Transform steps for the visualization
  const steps = definition.steps.map(step => ({
    key: step.key,
    title: step.title,
    type: step.type,
    lane: step.lane,
    nextSteps: step.nextSteps || [],
    description: step.description || '',
    estimatedDurationMinutes: step.estimatedMinutes,
    automations: step.automationAction ? [{ action: step.automationAction }] : undefined,
    gatewayConditions: step.gatewayConditions?.map(gc => ({
      condition: gc.label,
      targetStepKey: gc.targetStepKey,
    })),
  }));

  // Transform lanes
  const lanes: Lane[] = definition.lanes.map(laneKey => ({
    key: laneKey,
    displayName: LANE_CONFIG[laneKey]?.displayName || laneKey,
    participant: laneKey,
  }));

  // Calculate process statistics
  const stats = {
    totalSteps: steps.length,
    automatedSteps: steps.filter(s => s.automations?.length).length,
    manualSteps: steps.filter(s => !s.automations?.length && s.type !== 'gateway' && s.type !== 'start_event' && s.type !== 'end_event').length,
    gateways: steps.filter(s => s.type === 'gateway').length,
    estimatedDuration: steps.reduce((sum, s) => sum + (s.estimatedDurationMinutes || 0), 0),
    laneDistribution: definition.lanes.map(lane => ({
      lane,
      count: steps.filter(s => s.lane === lane).length,
      ...LANE_CONFIG[lane],
    })),
  };

  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div>
          <nav className={s.breadcrumb}>
            <Link href="/internal" className={s.breadcrumbLink}>Dashboard</Link>
            <span className={s.breadcrumbSeparator}>/</span>
            <Link href="/internal/process" className={s.breadcrumbLink}>Processes</Link>
            <span className={s.breadcrumbSeparator}>/</span>
            <span>Workflow Showcase</span>
          </nav>
          <h1 className={s.pageTitle}>Business Process Workflow</h1>
          <p className={s.pageSubtitle}>
            Interactive visualization and simulation of the {definition.name}
          </p>
        </div>
      </div>

      {/* Process Overview Stats */}
      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Process Overview</h2>
          <span className={s.badge}>v{definition.version}</span>
        </div>
        <div className={s.cardBody}>
          <p className={s.text}>{definition.description}</p>
          
          <div className={s.grid4}>
            <div className={s.statCard}>
              <div className={s.statNumber}>{stats.totalSteps}</div>
              <div className={s.statLabel}>Total Steps</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statNumber}>{stats.automatedSteps}</div>
              <div className={s.statLabel}>Automated</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statNumber}>{stats.manualSteps}</div>
              <div className={s.statLabel}>Manual Tasks</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statNumber}>{stats.gateways}</div>
              <div className={s.statLabel}>Decision Points</div>
            </div>
          </div>

          {/* Lane Distribution */}
          <div className={s.sectionTitle}>Lane Distribution</div>
          <div className={s.grid4}>
            {stats.laneDistribution.map(item => (
              <div key={item.lane} className={s.card}>
                <div className={s.cardBody}>
                  <div className={s.flexBetween}>
                    <span className={s.textLg}>{item.icon}</span>
                    <span className={s.badge}>{item.count} steps</span>
                  </div>
                  <h4 className={s.cardTitle}>{item.displayName}</h4>
                  <p className={s.textMuted}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Flowchart & Simulator */}
      <ProcessShowcaseClient 
        steps={steps} 
        lanes={lanes}
        processName={definition.name}
      />

      {/* Process Legend & Key */}
      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Process Elements Guide</h2>
        </div>
        <div className={s.cardBody}>
          <div className={s.grid3}>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>🟢 Start Event</h4>
                <p className={s.textMuted}>
                  The beginning of the process, triggered when a new lead enters the system.
                </p>
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>☐ User Task</h4>
                <p className={s.textMuted}>
                  Manual activities that require human interaction and decision-making.
                </p>
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>⚙️ Service Task</h4>
                <p className={s.textMuted}>
                  Automated system actions like sending emails or updating CRM records.
                </p>
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>◇ Gateway</h4>
                <p className={s.textMuted}>
                  Decision points that route the process based on conditions or outcomes.
                </p>
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>✉️ Message Event</h4>
                <p className={s.textMuted}>
                  Communication triggers like email notifications or client responses.
                </p>
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardBody}>
                <h4 className={s.cardTitle}>🔴 End Event</h4>
                <p className={s.textMuted}>
                  The conclusion of the process when all steps are completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Automations */}
      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Key Automations</h2>
        </div>
        <div className={s.cardBody}>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Lane</th>
                  <th>Automation Action</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {steps.filter(s => s.automations?.length).map(step => (
                  step.automations?.map((auto, idx) => (
                    <tr key={`${step.key}-${idx}`}>
                      <td>{step.title}</td>
                      <td>
                        <span className={s.badge}>
                          {LANE_CONFIG[step.lane]?.icon} {LANE_CONFIG[step.lane]?.displayName || step.lane}
                        </span>
                      </td>
                      <td>
                        <code className={s.code}>{auto.action}</code>
                      </td>
                      <td className={s.textMuted}>
                        {getAutomationDescription(auto.action)}
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function getAutomationDescription(action: string): string {
  const descriptions: Record<string, string> = {
    create_lead_record: 'Creates a new lead record in the CRM system',
    assign_lead_score: 'Calculates and assigns a qualification score to the lead',
    trigger_nurture_sequence: 'Starts an automated email nurture campaign',
    create_followup_task: 'Creates a task for the assigned team member',
    generate_followup_email: 'AI-generates a personalized follow-up email',
    send_followup_email: 'Sends the follow-up email to the prospect',
    trigger_onboarding: 'Initiates the client onboarding workflow',
    send_welcome_email: 'Sends a personalized welcome email to the client',
    share_onboarding_docs: 'Shares onboarding documents and resources',
    generate_project_summary: 'Creates a project summary from requirements',
    create_project_workspace: 'Sets up the project workspace and tools',
    transfer_srs_url: 'Transfers the SRS document URL to the project',
  };
  return descriptions[action] || 'Automated system action';
}
