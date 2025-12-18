'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

// Icons
const Icons = {
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  flag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  fileText: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
};

// BPMN Workflow Steps based on megicode_delivery_process.bpmn
const WORKFLOW_STEPS = [
  {
    id: 'request_intake',
    name: 'Request Intake',
    key: 'StartEvent_ClientRequest',
    lane: 'Client',
    type: 'start',
    icon: Icons.fileText,
    description: 'Client submits request/SRS via website or email',
  },
  {
    id: 'auto_capture',
    name: 'Auto-Capture Lead',
    key: 'ServiceTask_CaptureRequest',
    lane: 'System',
    type: 'service',
    icon: Icons.settings,
    description: 'System creates lead record automatically',
  },
  {
    id: 'review_requirements',
    name: 'Review Requirements',
    key: 'UserTask_ReviewRequirements',
    lane: 'PM',
    type: 'user',
    icon: Icons.fileText,
    description: 'PM reviews and analyzes requirements, estimates budget/timeline',
  },
  {
    id: 'create_proposal',
    name: 'Create Proposal',
    key: 'UserTask_CreateProposal',
    lane: 'PM',
    type: 'user',
    icon: Icons.send,
    description: 'Generate formal proposal with scope, timeline, budget',
  },
  {
    id: 'approval_decision',
    name: 'Approval Decision',
    key: 'Gateway_ApprovalDecision',
    lane: 'PM',
    type: 'gateway',
    icon: Icons.flag,
    description: 'Decision point: approve or reject project',
  },
  {
    id: 'create_project',
    name: 'Initialize Project',
    key: 'ServiceTask_CreateProjectInstance',
    lane: 'System',
    type: 'service',
    icon: Icons.settings,
    description: 'System creates project and process instance',
  },
  {
    id: 'link_client',
    name: 'Link Client',
    key: 'ServiceTask_LinkClient',
    lane: 'System',
    type: 'service',
    icon: Icons.users,
    description: 'Find or create client record, link to project',
  },
  {
    id: 'select_tech',
    name: 'Select Tech Stack',
    key: 'UserTask_SelectTechStack',
    lane: 'PM',
    type: 'user',
    icon: Icons.code,
    description: 'Choose technologies: languages, frameworks, databases',
  },
  {
    id: 'define_milestones',
    name: 'Define Milestones',
    key: 'UserTask_DefineMilestones',
    lane: 'PM',
    type: 'user',
    icon: Icons.flag,
    description: 'Create milestone records with target dates',
  },
  {
    id: 'plan_gantt',
    name: 'Plan Timeline (Gantt)',
    key: 'UserTask_PlanGantt',
    lane: 'PM',
    type: 'user',
    icon: Icons.calendar,
    description: 'Visualize project timeline and dependencies',
  },
  {
    id: 'check_resources',
    name: 'Check Team Capacity',
    key: 'UserTask_CheckResources',
    lane: 'PM',
    type: 'user',
    icon: Icons.users,
    description: 'Review team workload and utilization',
  },
  {
    id: 'create_tasks',
    name: 'Create & Assign Tasks',
    key: 'UserTask_CreateTasks',
    lane: 'PM',
    type: 'user',
    icon: Icons.fileText,
    description: 'Break down project into tasks, assign to team',
  },
  {
    id: 'dev_qa_cycle',
    name: 'Development & QA',
    key: 'SubProcess_DevQACycle',
    lane: 'Dev/QA',
    type: 'subprocess',
    icon: Icons.code,
    description: 'Iterative development and testing cycle',
  },
  {
    id: 'monitor_progress',
    name: 'Monitor Progress',
    key: 'UserTask_MonitorProgress',
    lane: 'PM',
    type: 'user',
    icon: Icons.clock,
    description: 'Track task completion, identify blockers',
  },
  {
    id: 'track_metrics',
    name: 'Update Metrics',
    key: 'ServiceTask_TrackMetrics',
    lane: 'System',
    type: 'service',
    icon: Icons.settings,
    description: 'Auto-calculate KPIs and dashboard metrics',
  },
  {
    id: 'final_delivery',
    name: 'Final Review & Deploy',
    key: 'UserTask_FinalDelivery',
    lane: 'PM',
    type: 'user',
    icon: Icons.truck,
    description: 'Verify milestones, deploy to production',
  },
  {
    id: 'send_notification',
    name: 'Send Notification',
    key: 'ServiceTask_SendDeliveryEmail',
    lane: 'System',
    type: 'service',
    icon: Icons.send,
    description: 'Email client with delivery confirmation',
  },
  {
    id: 'delivered',
    name: 'Project Delivered',
    key: 'EndEvent_Delivered',
    lane: 'PM',
    type: 'end',
    icon: Icons.check,
    description: 'Project live and delivered to client',
  },
];

interface Instance {
  instanceId: string;
  instanceStatus: string;
  currentStepKey: string | null;
  startedAt: Date;
  endedAt: Date | null;
  projectId: string;
  projectName: string;
  projectStatus: string;
}

interface TaskStats {
  total: number;
  open: number;
  overdue: number;
  blocked: number;
}

interface WorkflowVisualizationProps {
  instance: Instance;
  taskStats: TaskStats;
}

export default function WorkflowVisualization({ instance, taskStats }: WorkflowVisualizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Find current step index
  const currentStepIndex = WORKFLOW_STEPS.findIndex(
    (step) => step.key === instance.currentStepKey
  );
  const isCompleted = instance.instanceStatus === 'completed';

  // Calculate progress percentage
  const progressPercent = isCompleted 
    ? 100 
    : currentStepIndex >= 0 
      ? Math.round(((currentStepIndex + 1) / WORKFLOW_STEPS.length) * 100)
      : 0;

  // Get step status
  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (isCompleted || index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  // Get step colors
  const getStepColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed': return { bg: 'var(--int-success)', border: 'var(--int-success)', text: '#fff' };
      case 'current': return { bg: 'var(--int-primary)', border: 'var(--int-primary)', text: '#fff' };
      case 'pending': return { bg: 'var(--int-bg-alt)', border: 'var(--int-border)', text: 'var(--int-text-muted)' };
    }
  };

  // Get lane color
  const getLaneColor = (lane: string) => {
    switch (lane) {
      case 'Client': return '#8b5cf6';
      case 'System': return '#06b6d4';
      case 'PM': return '#f59e0b';
      case 'Dev/QA': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Calculate estimated time remaining
  const getEstimatedCompletion = () => {
    if (isCompleted) return 'Completed';
    const remainingSteps = WORKFLOW_STEPS.length - currentStepIndex - 1;
    const avgDaysPerStep = 2; // Assume average 2 days per step
    const daysRemaining = remainingSteps * avgDaysPerStep;
    if (daysRemaining <= 0) return 'Almost done';
    if (daysRemaining === 1) return '~1 day remaining';
    if (daysRemaining < 7) return `~${daysRemaining} days remaining`;
    return `~${Math.ceil(daysRemaining / 7)} weeks remaining`;
  };

  return (
    <div className={s.card} style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className={s.cardHeader} style={{ borderBottom: '1px solid var(--int-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: isCompleted ? 'var(--int-success)' : 'var(--int-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}>
            {isCompleted ? Icons.check : Icons.play}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
              <Link href={`/internal/projects/${instance.projectId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {instance.projectName}
              </Link>
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
              <span>Started: {new Date(instance.startedAt).toLocaleDateString()}</span>
              {instance.endedAt && <span>Ended: {new Date(instance.endedAt).toLocaleDateString()}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={s.badge} style={{
              background: isCompleted ? 'var(--int-success)' : instance.instanceStatus === 'paused' ? 'var(--int-warning)' : 'var(--int-primary)',
              color: '#fff',
            }}>
              {instance.instanceStatus}
            </span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--int-border)',
                background: 'var(--int-bg)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ padding: '1rem', background: 'var(--int-bg-alt)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Workflow Progress: {progressPercent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
            {getEstimatedCompletion()}
          </div>
        </div>
        <div style={{
          height: '8px',
          background: 'var(--int-border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: isCompleted ? 'var(--int-success)' : 'var(--int-primary)',
            transition: 'width 0.5s ease',
          }} />
        </div>
        
        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--int-text-muted)' }}>Tasks: </span>
            <span style={{ fontWeight: 600 }}>{taskStats.open}/{taskStats.total}</span>
          </div>
          {taskStats.overdue > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--int-error)' }}>
              <span>⚠ {taskStats.overdue} overdue</span>
            </div>
          )}
          {taskStats.blocked > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--int-warning)' }}>
              <span>🚫 {taskStats.blocked} blocked</span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Workflow Visualization */}
      {showDetails && (
        <div style={{ padding: '1.5rem' }}>
          {/* Lane Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['Client', 'System', 'PM', 'Dev/QA'].map((lane) => (
              <div key={lane} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: getLaneColor(lane),
                }} />
                <span>{lane}</span>
              </div>
            ))}
          </div>

          {/* Workflow Steps Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}>
            {WORKFLOW_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const colors = getStepColor(status);
              const isHovered = hoveredStep === step.id;

              return (
                <div
                  key={step.id}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    position: 'relative',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${colors.border}`,
                    background: colors.bg,
                    color: colors.text,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {/* Lane Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '4px',
                    borderRadius: '0 0 4px 4px',
                    background: getLaneColor(step.lane),
                  }} />

                  {/* Step Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: step.type === 'gateway' ? '8px' : step.type === 'start' || step.type === 'end' ? '50%' : '6px',
                    background: status === 'pending' ? 'var(--int-border)' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    transform: step.type === 'gateway' ? 'rotate(45deg)' : 'none',
                  }}>
                    <span style={{ 
                      width: '16px', 
                      height: '16px',
                      transform: step.type === 'gateway' ? 'rotate(-45deg)' : 'none',
                    }}>
                      {step.icon}
                    </span>
                  </div>

                  {/* Step Name */}
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    marginBottom: '0.25rem',
                  }}>
                    {step.name}
                  </div>

                  {/* Step Type Badge */}
                  <div style={{
                    fontSize: '0.625rem',
                    opacity: 0.8,
                    textTransform: 'uppercase',
                  }}>
                    {step.type}
                  </div>

                  {/* Status Indicator */}
                  {status === 'current' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fff',
                      animation: 'pulse 2s infinite',
                    }} />
                  )}

                  {/* Tooltip */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      padding: '0.75rem',
                      background: 'var(--int-bg)',
                      border: '1px solid var(--int-border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      width: '200px',
                      zIndex: 100,
                      color: 'var(--int-text)',
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.5rem' }}>
                        {step.description}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        fontSize: '0.625rem',
                        color: 'var(--int-text-muted)',
                      }}>
                        <span style={{
                          padding: '0.125rem 0.375rem',
                          background: getLaneColor(step.lane),
                          color: '#fff',
                          borderRadius: '4px',
                        }}>
                          {step.lane}
                        </span>
                        <span style={{
                          padding: '0.125rem 0.375rem',
                          background: 'var(--int-bg-alt)',
                          borderRadius: '4px',
                        }}>
                          {step.type}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Details */}
          {currentStepIndex >= 0 && !isCompleted && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--int-bg-alt)',
              borderRadius: '12px',
              border: '1px solid var(--int-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--int-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}>
                  {WORKFLOW_STEPS[currentStepIndex].icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.125rem' }}>
                    Current Step ({currentStepIndex + 1} of {WORKFLOW_STEPS.length})
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {WORKFLOW_STEPS[currentStepIndex].name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)', marginTop: '0.25rem' }}>
                    {WORKFLOW_STEPS[currentStepIndex].description}
                  </div>
                </div>
                <Link
                  href={`/internal/projects/${instance.projectId}`}
                  className={s.btnPrimary}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Continue
                  <span style={{ width: '16px', height: '16px' }}>{Icons.arrowRight}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
