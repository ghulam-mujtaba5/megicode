'use client';

/**
 * Process Workflow Widgets
 * 
 * A collection of compact dashboard widgets for the main portal dashboard
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../../app/internal/styles.module.css';

// ==============================
// SHARED ICONS
// ==============================
const Icons = {
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
};

// ==============================
// SLA STATUS WIDGET
// ==============================
interface SLAWidgetData {
  onTrackCount: number;
  warningCount: number;
  breachedCount: number;
  complianceRate: number;
}

export function SLAStatusWidget() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SLAWidgetData | null>(null);

  useEffect(() => {
    fetch('/api/internal/process/sla')
      .then(res => res.json())
      .then(result => {
        setData({
          onTrackCount: result.analytics?.onTrackCount || 0,
          warningCount: result.analytics?.warningCount || 0,
          breachedCount: result.analytics?.breachedCount || 0,
          complianceRate: result.analytics?.averageComplianceRate || 0,
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className={s.spinner} style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardHeaderLeft}>
          <div className={s.cardIcon} style={{ color: 'var(--int-primary)' }}>{Icons.clock}</div>
          <h3 className={s.cardTitle}>SLA Status</h3>
        </div>
        <Link href="/internal/process/analytics" className={s.cardHeaderLink}>
          Details {Icons.arrowRight}
        </Link>
      </div>
      <div className={s.cardBody}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success)' }}>
              {data?.onTrackCount || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)' }}>On Track</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-warning)' }}>
              {data?.warningCount || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)' }}>Warning</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-error)' }}>
              {data?.breachedCount || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)' }}>Breached</div>
          </div>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <div className={s.progressBar} style={{ height: '6px' }}>
            <div 
              className={s.progressFill} 
              style={{ 
                width: `${data?.complianceRate || 0}%`,
                background: (data?.complianceRate || 0) > 80 ? 'var(--int-success)' : 'var(--int-warning)',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)', marginTop: '0.25rem', textAlign: 'center' }}>
            {data?.complianceRate || 0}% Compliance
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// WORKLOAD WIDGET
// ==============================
interface WorkloadMember {
  id: string;
  name: string;
  activeSteps: number;
  workloadScore: number;
  isOverloaded: boolean;
}

export function WorkloadWidget() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<WorkloadMember[]>([]);

  useEffect(() => {
    fetch('/api/internal/process/assignment?type=workload')
      .then(res => res.json())
      .then(result => {
        setMembers((result.overview?.members || []).slice(0, 5));
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className={s.spinner} style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardHeaderLeft}>
          <div className={s.cardIcon} style={{ color: 'var(--int-primary)' }}>{Icons.users}</div>
          <h3 className={s.cardTitle}>Team Workload</h3>
        </div>
      </div>
      <div className={s.cardBody}>
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: '1rem' }}>
            No active assignments
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {members.map(member => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%',
                  background: 'var(--int-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{member.name}</div>
                  <div style={{ 
                    height: '4px', 
                    background: 'var(--int-border)', 
                    borderRadius: '2px',
                    marginTop: '0.25rem',
                  }}>
                    <div style={{ 
                      width: `${Math.min(100, member.workloadScore)}%`,
                      height: '100%',
                      borderRadius: '2px',
                      background: member.isOverloaded ? 'var(--int-error)' : member.workloadScore > 70 ? 'var(--int-warning)' : 'var(--int-success)',
                    }} />
                  </div>
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 500,
                  color: member.isOverloaded ? 'var(--int-error)' : 'var(--int-text-muted)',
                }}>
                  {member.activeSteps}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================
// AUTOMATION STATUS WIDGET
// ==============================
interface AutomationStats {
  totalRules: number;
  activeRules: number;
  executionsToday: number;
  lastExecution?: string;
}

export function AutomationWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AutomationStats | null>(null);

  useEffect(() => {
    fetch('/api/internal/process/automation?type=rules')
      .then(res => res.json())
      .then(result => {
        const rules = result.rules || [];
        setStats({
          totalRules: rules.length,
          activeRules: rules.filter((r: any) => r.isActive).length,
          executionsToday: result.executionsToday || 0,
          lastExecution: result.lastExecution,
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className={s.spinner} style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardHeaderLeft}>
          <div className={s.cardIcon} style={{ color: 'var(--int-warning)' }}>{Icons.zap}</div>
          <h3 className={s.cardTitle}>Automation</h3>
        </div>
        <span className={`${s.badge} ${s.badgeSuccess}`}>
          {stats?.activeRules || 0} active
        </span>
      </div>
      <div className={s.cardBody}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-primary)' }}>
              {stats?.totalRules || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Total Rules</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-success)' }}>
              {stats?.executionsToday || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// BOTTLENECK ALERT WIDGET
// ==============================
interface BottleneckAlert {
  stepKey: string;
  stepTitle: string;
  bottleneckScore: number;
  activeInstances: number;
}

export function BottleneckAlertWidget() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<BottleneckAlert[]>([]);

  useEffect(() => {
    fetch('/api/internal/process/bottlenecks?type=steps')
      .then(res => res.json())
      .then(result => {
        const steps = result.analysis?.steps || [];
        setAlerts(
          steps
            .filter((s: any) => s.bottleneckScore >= 60)
            .sort((a: any, b: any) => b.bottleneckScore - a.bottleneckScore)
            .slice(0, 3)
        );
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className={s.spinner} style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardHeaderLeft}>
          <div className={s.cardIcon} style={{ color: 'var(--int-error)' }}>{Icons.activity}</div>
          <h3 className={s.cardTitle}>Bottlenecks</h3>
        </div>
        {alerts.length > 0 && (
          <span className={`${s.badge} ${s.badgeDanger}`}>{alerts.length}</span>
        )}
      </div>
      <div className={s.cardBody}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <span style={{ color: 'var(--int-success)' }}>{Icons.check}</span>
            <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)', marginTop: '0.5rem' }}>
              No bottlenecks detected
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alerts.map(alert => (
              <div 
                key={alert.stepKey}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(239, 68, 68, 0.05)',
                  borderRadius: '0.375rem',
                  borderLeft: `3px solid ${alert.bottleneckScore >= 80 ? 'var(--int-error)' : 'var(--int-warning)'}`,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{alert.stepTitle}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)' }}>
                    {alert.activeInstances} active
                  </div>
                </div>
                <div style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  background: alert.bottleneckScore >= 80 ? 'var(--int-error)' : 'var(--int-warning)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {alert.bottleneckScore}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================
// TEMPLATES WIDGET
// ==============================
interface TemplateInfo {
  key: string;
  name: string;
  category: string;
  usageCount: number;
}

export function TemplatesWidget() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);

  useEffect(() => {
    fetch('/api/internal/process/templates')
      .then(res => res.json())
      .then(result => {
        setTemplates((result.templates || []).slice(0, 4).map((t: any) => ({
          key: t.key,
          name: t.name,
          category: t.category,
          usageCount: t.usageCount || 0,
        })));
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div className={s.spinner} style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardHeaderLeft}>
          <div className={s.cardIcon} style={{ color: 'var(--int-primary)' }}>{Icons.layers}</div>
          <h3 className={s.cardTitle}>Templates</h3>
        </div>
        <Link href="/internal/process/new" className={s.cardHeaderLink}>
          New Process {Icons.arrowRight}
        </Link>
      </div>
      <div className={s.cardBody}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {templates.map(template => (
            <div 
              key={template.key}
              style={{ 
                padding: '0.75rem',
                background: 'var(--int-surface)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{template.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--int-text-muted)' }}>
                {template.category.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==============================
// COMBINED WIDGET GRID
// ==============================
export function ProcessWidgetsGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
      <SLAStatusWidget />
      <WorkloadWidget />
      <BottleneckAlertWidget />
      <AutomationWidget />
    </div>
  );
}
