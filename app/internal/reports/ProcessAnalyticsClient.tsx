'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

// Icons
const Icons = {
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  trendUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  workflow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  funnel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

interface ProcessAnalyticsData {
  kpis: {
    leadConversionRate: number;
    taskCompletionRate: number;
    onTimeDeliveryRate: number;
    avgCycleTime: number;
    throughput: number;
    activeProjects: number;
    runningInstances: number;
    overdueItems: number;
  };
  leadStats: {
    total: number;
    new: number;
    inReview: number;
    approved: number;
    converted: number;
    rejected: number;
    last30Days: number;
  };
  projectStats: {
    total: number;
    active: number;
    blocked: number;
    delivered: number;
    onHold: number;
  };
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    blocked: number;
    done: number;
    overdue: number;
    completedLast30: number;
  };
  instanceStats: {
    total: number;
    running: number;
    completed: number;
    paused: number;
    avgDuration: number;
  };
  milestoneStats: {
    total: number;
    completed: number;
    onTime: number;
    overdue: number;
  };
  tasksByStatus: Array<{ status: string; count: number }>;
  leadConversionData: Array<{ month: string; total: number; converted: number }>;
  recentCompletedInstances: Array<{
    id: string;
    projectName: string;
    cycleTime: number;
    startedAt: Date;
    endedAt: Date | null;
  }>;
}

interface ProcessAnalyticsClientProps {
  data: ProcessAnalyticsData;
}

type ActiveTab = 'workflow' | 'funnel' | 'performance' | 'bottlenecks';

export default function ProcessAnalyticsClient({ data }: ProcessAnalyticsClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workflow');

  // BPMN Workflow Stages from the process
  const workflowStages = [
    { name: 'Request Intake', key: 'intake', count: data.leadStats.new, color: 'var(--int-info)' },
    { name: 'Requirements Review', key: 'review', count: data.leadStats.inReview, color: 'var(--int-warning)' },
    { name: 'Proposal & Approval', key: 'proposal', count: data.leadStats.approved, color: 'var(--int-secondary)' },
    { name: 'Project Setup', key: 'setup', count: data.projectStats.active, color: 'var(--int-primary)' },
    { name: 'Development & QA', key: 'dev', count: data.instanceStats.running, color: 'var(--int-info)' },
    { name: 'Delivery', key: 'delivery', count: data.projectStats.delivered, color: 'var(--int-success)' },
  ];

  // Calculate bottlenecks
  const bottlenecks = [
    { 
      stage: 'Blocked Tasks', 
      count: data.taskStats.blocked, 
      severity: data.taskStats.blocked > 5 ? 'critical' : data.taskStats.blocked > 0 ? 'warning' : 'ok',
      suggestion: 'Review blocked tasks and remove blockers',
    },
    { 
      stage: 'Overdue Items', 
      count: data.kpis.overdueItems, 
      severity: data.kpis.overdueItems > 10 ? 'critical' : data.kpis.overdueItems > 0 ? 'warning' : 'ok',
      suggestion: 'Prioritize overdue tasks and milestones',
    },
    { 
      stage: 'Paused Instances', 
      count: data.instanceStats.paused, 
      severity: data.instanceStats.paused > 2 ? 'critical' : data.instanceStats.paused > 0 ? 'warning' : 'ok',
      suggestion: 'Review paused workflows and resume or close',
    },
    { 
      stage: 'Pending Leads', 
      count: data.leadStats.new + data.leadStats.inReview, 
      severity: (data.leadStats.new + data.leadStats.inReview) > 10 ? 'warning' : 'ok',
      suggestion: 'Process pending leads to prevent backlog',
    },
  ];

  const getStageWidth = (count: number) => {
    const maxCount = Math.max(...workflowStages.map(s => s.count), 1);
    return Math.max((count / maxCount) * 100, 20);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        background: 'var(--int-bg-alt)',
        padding: '0.25rem',
        borderRadius: '12px',
        width: 'fit-content',
      }}>
        {[
          { id: 'workflow' as ActiveTab, label: 'Workflow Stages', icon: Icons.workflow },
          { id: 'funnel' as ActiveTab, label: 'Conversion Funnel', icon: Icons.funnel },
          { id: 'performance' as ActiveTab, label: 'Performance', icon: Icons.trendUp },
          { id: 'bottlenecks' as ActiveTab, label: 'Bottlenecks', icon: Icons.warning },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--int-bg)' : 'transparent',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--int-text)' : 'var(--int-text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ width: '16px', height: '16px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workflow Stages Tab */}
      {activeTab === 'workflow' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px', color: 'var(--int-primary)' }}>{Icons.workflow}</span>
              BPMN Workflow Stages
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
              Live process status
            </span>
          </div>
          <div className={s.cardBody}>
            {/* Workflow Pipeline Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {workflowStages.map((stage, index) => (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Stage number */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: stage.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </div>
                  
                  {/* Stage info and bar */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{stage.name}</span>
                      <span style={{ fontWeight: 700, color: stage.color }}>{stage.count}</span>
                    </div>
                    <div style={{
                      height: '12px',
                      background: 'var(--int-bg-alt)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${getStageWidth(stage.count)}%`,
                        height: '100%',
                        background: stage.color,
                        borderRadius: '6px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  
                  {/* Arrow to next stage */}
                  {index < workflowStages.length - 1 && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      color: 'var(--int-text-muted)',
                      opacity: 0.5,
                      flexShrink: 0,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Workflow Summary */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--int-bg-alt)',
              borderRadius: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-primary)' }}>
                  {data.instanceStats.running}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Active Workflows</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success)' }}>
                  {data.instanceStats.completed}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-info)' }}>
                  {data.kpis.avgCycleTime}d
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Avg Cycle Time</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-warning)' }}>
                  {data.kpis.throughput}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Monthly Throughput</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Funnel Tab */}
      {activeTab === 'funnel' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px', color: 'var(--int-primary)' }}>{Icons.funnel}</span>
              Lead to Delivery Funnel
            </h3>
          </div>
          <div className={s.cardBody}>
            {/* Funnel Visualization */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem',
            }}>
              {[
                { label: 'Total Leads', value: data.leadStats.total, color: 'var(--int-info)', width: 100 },
                { label: 'In Review', value: data.leadStats.inReview, color: 'var(--int-warning)', width: 85 },
                { label: 'Approved', value: data.leadStats.approved, color: 'var(--int-secondary)', width: 70 },
                { label: 'Converted to Project', value: data.leadStats.converted, color: 'var(--int-primary)', width: 55 },
                { label: 'Delivered', value: data.projectStats.delivered, color: 'var(--int-success)', width: 40 },
              ].map((step, index) => (
                <div 
                  key={step.label}
                  style={{
                    width: `${step.width}%`,
                    padding: '1rem',
                    background: step.color,
                    borderRadius: '8px',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{step.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{step.value}</span>
                </div>
              ))}
            </div>

            {/* Conversion Rates */}
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}>
              <div className={s.card} style={{ padding: '1rem', textAlign: 'center', background: 'var(--int-bg-alt)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-success)' }}>
                  {data.kpis.leadConversionRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Lead → Project</div>
              </div>
              <div className={s.card} style={{ padding: '1rem', textAlign: 'center', background: 'var(--int-bg-alt)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-success)' }}>
                  {data.projectStats.total > 0 
                    ? Math.round((data.projectStats.delivered / data.projectStats.total) * 100)
                    : 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Project → Delivery</div>
              </div>
              <div className={s.card} style={{ padding: '1rem', textAlign: 'center', background: 'var(--int-bg-alt)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-warning)' }}>
                  {data.leadStats.total > 0
                    ? Math.round((data.leadStats.rejected / data.leadStats.total) * 100)
                    : 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Rejection Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Task Performance */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Task Performance</h3>
            </div>
            <div className={s.cardBody}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Todo', value: data.taskStats.todo, color: 'var(--int-text-muted)' },
                  { label: 'In Progress', value: data.taskStats.inProgress, color: 'var(--int-info)' },
                  { label: 'Blocked', value: data.taskStats.blocked, color: 'var(--int-error)' },
                  { label: 'Completed', value: data.taskStats.done, color: 'var(--int-success)' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: '1rem', background: 'var(--int-bg-alt)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Task completion bar */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Overall Completion</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{data.kpis.taskCompletionRate}%</span>
                </div>
                <div style={{ height: '16px', background: 'var(--int-bg-alt)', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${(data.taskStats.done / Math.max(data.taskStats.total, 1)) * 100}%`, background: 'var(--int-success)' }} />
                  <div style={{ width: `${(data.taskStats.inProgress / Math.max(data.taskStats.total, 1)) * 100}%`, background: 'var(--int-info)' }} />
                  <div style={{ width: `${(data.taskStats.blocked / Math.max(data.taskStats.total, 1)) * 100}%`, background: 'var(--int-error)' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--int-success)' }} />
                    Done
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--int-info)' }} />
                    In Progress
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--int-error)' }} />
                    Blocked
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Completions */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Recently Completed Workflows</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Last 30 days</span>
            </div>
            <div className={s.cardBody}>
              {data.recentCompletedInstances.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                  No completed workflows in the last 30 days
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--int-border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Project</th>
                      <th style={{ textAlign: 'center', padding: '0.75rem' }}>Cycle Time</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCompletedInstances.map((instance) => (
                      <tr key={instance.id} style={{ borderBottom: '1px solid var(--int-border)' }}>
                        <td style={{ padding: '0.75rem' }}>{instance.projectName}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span className={s.badge} style={{ 
                            background: instance.cycleTime <= data.kpis.avgCycleTime ? 'var(--int-success)' : 'var(--int-warning)',
                            color: '#fff',
                          }}>
                            {instance.cycleTime} days
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--int-text-muted)' }}>
                          {instance.endedAt ? new Date(instance.endedAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottlenecks Tab */}
      {activeTab === 'bottlenecks' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '20px', height: '20px', color: 'var(--int-warning)' }}>{Icons.warning}</span>
              Process Bottlenecks & Issues
            </h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bottlenecks.map((bottleneck) => (
                <div
                  key={bottleneck.stage}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `1px solid ${
                      bottleneck.severity === 'critical' ? 'var(--int-error)' :
                      bottleneck.severity === 'warning' ? 'var(--int-warning)' :
                      'var(--int-success)'
                    }`,
                    background: bottleneck.severity === 'critical' ? 'rgba(239, 68, 68, 0.05)' :
                      bottleneck.severity === 'warning' ? 'rgba(245, 158, 11, 0.05)' :
                      'rgba(16, 185, 129, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {bottleneck.severity === 'critical' && (
                        <span style={{ width: '20px', height: '20px', color: 'var(--int-error)' }}>{Icons.warning}</span>
                      )}
                      {bottleneck.severity === 'warning' && (
                        <span style={{ width: '20px', height: '20px', color: 'var(--int-warning)' }}>{Icons.clock}</span>
                      )}
                      {bottleneck.severity === 'ok' && (
                        <span style={{ width: '20px', height: '20px', color: 'var(--int-success)' }}>{Icons.check}</span>
                      )}
                      <span style={{ fontWeight: 600 }}>{bottleneck.stage}</span>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      background: bottleneck.severity === 'critical' ? 'var(--int-error)' :
                        bottleneck.severity === 'warning' ? 'var(--int-warning)' :
                        'var(--int-success)',
                      color: '#fff',
                    }}>
                      {bottleneck.count}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                    {bottleneck.suggestion}
                  </p>
                </div>
              ))}
            </div>

            {/* Health Score */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              background: 'var(--int-bg-alt)',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '0.5rem' }}>
                Process Health Score
              </div>
              {(() => {
                const criticalCount = bottlenecks.filter(b => b.severity === 'critical').length;
                const warningCount = bottlenecks.filter(b => b.severity === 'warning').length;
                const score = Math.max(0, 100 - (criticalCount * 25) - (warningCount * 10));
                const color = score >= 80 ? 'var(--int-success)' : score >= 50 ? 'var(--int-warning)' : 'var(--int-error)';
                
                return (
                  <>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color }}>{score}</div>
                    <div style={{ fontSize: '0.875rem', color }}>
                      {score >= 80 ? 'Healthy' : score >= 50 ? 'Needs Attention' : 'Critical'}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
