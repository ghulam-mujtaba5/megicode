'use client';

/**
 * SLA Dashboard Component
 * 
 * Displays SLA status overview with visual indicators
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../../app/internal/styles.module.css';

interface SLAStatus {
  stepKey: string;
  stepTitle: string;
  status: 'on_track' | 'warning' | 'breached';
  elapsedMinutes: number;
  warningThreshold: number;
  criticalThreshold: number;
  percentUsed: number;
  timeRemaining: number | null;
}

interface SLAProcessSummary {
  processInstanceId: string;
  projectName?: string;
  overallStatus: 'on_track' | 'warning' | 'breached';
  currentStepSLA: SLAStatus | null;
}

interface SLAAnalytics {
  totalProcesses: number;
  onTrackCount: number;
  warningCount: number;
  breachedCount: number;
  onTrackPercentage: number;
  averageComplianceRate: number;
  mostBreachedSteps: Array<{ stepKey: string; stepTitle: string; breachCount: number }>;
}

interface SLADashboardProps {
  compact?: boolean;
}

// Icons
const Icons = {
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function getStatusColor(status: 'on_track' | 'warning' | 'breached'): string {
  switch (status) {
    case 'on_track': return 'var(--int-success)';
    case 'warning': return 'var(--int-warning)';
    case 'breached': return 'var(--int-error)';
    default: return 'var(--int-text-muted)';
  }
}

function getStatusIcon(status: 'on_track' | 'warning' | 'breached'): React.ReactNode {
  switch (status) {
    case 'on_track': return Icons.check;
    case 'warning': return Icons.warning;
    case 'breached': return Icons.x;
    default: return Icons.clock;
  }
}

export default function SLADashboard({ compact = false }: SLADashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<SLAAnalytics | null>(null);
  const [breachedProcesses, setBreachedProcesses] = useState<SLAProcessSummary[]>([]);
  const [warningProcesses, setWarningProcesses] = useState<SLAProcessSummary[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/internal/process/sla');
      if (!response.ok) throw new Error('Failed to fetch SLA data');
      
      const data = await response.json();
      setAnalytics(data.analytics);
      setBreachedProcesses(data.currentStatus.processes.breached || []);
      setWarningProcesses(data.currentStatus.processes.warning || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SLA data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !analytics) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: '2rem' }}>
          <div className={s.spinner}></div>
          <p style={{ color: 'var(--int-text-muted)', marginTop: '1rem' }}>Loading SLA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--int-error)' }}>{error}</p>
          <button onClick={fetchData} className={s.btnSecondary} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    // Compact version for dashboard
    return (
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardHeaderLeft}>
            <div className={s.cardIcon} style={{ color: 'var(--int-primary)' }}>{Icons.clock}</div>
            <h3 className={s.cardTitle}>SLA Status</h3>
          </div>
          <Link href="/internal/process/analytics" className={s.cardHeaderLink}>
            View Details {Icons.arrowRight}
          </Link>
        </div>
        <div className={s.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-success)' }}>
                {analytics?.onTrackCount || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>On Track</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-warning)' }}>
                {analytics?.warningCount || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Warning</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--int-error)' }}>
                {analytics?.breachedCount || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Breached</div>
            </div>
          </div>
          {analytics && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <div className={s.progressBar} style={{ height: '8px' }}>
                <div 
                  className={s.progressFill} 
                  style={{ 
                    width: `${analytics.onTrackPercentage}%`,
                    background: 'var(--int-success)',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '0.5rem' }}>
                {analytics.averageComplianceRate}% SLA Compliance Rate
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
      {/* Header with refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>SLA Monitoring</h2>
          {lastUpdated && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button onClick={fetchData} className={s.btnSecondary} disabled={loading}>
          <span className={s.icon}>{Icons.refresh}</span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className={s.grid4}>
        <div className={s.card}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{analytics?.totalProcesses || 0}</div>
            <div style={{ color: 'var(--int-text-muted)' }}>Total Active</div>
          </div>
        </div>
        <div className={s.card} style={{ borderLeft: '4px solid var(--int-success)' }}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-success)' }}>
              {analytics?.onTrackCount || 0}
            </div>
            <div style={{ color: 'var(--int-text-muted)' }}>On Track</div>
          </div>
        </div>
        <div className={s.card} style={{ borderLeft: '4px solid var(--int-warning)' }}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-warning)' }}>
              {analytics?.warningCount || 0}
            </div>
            <div style={{ color: 'var(--int-text-muted)' }}>Warning</div>
          </div>
        </div>
        <div className={s.card} style={{ borderLeft: '4px solid var(--int-error)' }}>
          <div className={s.cardBody} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-error)' }}>
              {analytics?.breachedCount || 0}
            </div>
            <div style={{ color: 'var(--int-text-muted)' }}>Breached</div>
          </div>
        </div>
      </div>

      {/* Compliance Progress */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>SLA Compliance Rate</h3>
          <span className={`${s.badge} ${analytics && analytics.averageComplianceRate > 90 ? s.badgeSuccess : analytics && analytics.averageComplianceRate > 70 ? s.badgeWarning : s.badgeDanger}`}>
            {analytics?.averageComplianceRate || 0}%
          </span>
        </div>
        <div className={s.cardBody}>
          <div className={s.progressBar} style={{ height: '12px' }}>
            <div 
              className={s.progressFill} 
              style={{ 
                width: `${analytics?.averageComplianceRate || 0}%`,
                background: analytics && analytics.averageComplianceRate > 90 
                  ? 'var(--int-success)' 
                  : analytics && analytics.averageComplianceRate > 70 
                    ? 'var(--int-warning)' 
                    : 'var(--int-error)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Breached Processes */}
      {breachedProcesses.length > 0 && (
        <div className={s.card} style={{ borderLeft: '4px solid var(--int-error)' }}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={s.cardIcon} style={{ color: 'var(--int-error)' }}>{Icons.x}</div>
              <h3 className={s.cardTitle}>SLA Breached</h3>
              <span className={`${s.badge} ${s.badgeDanger}`}>{breachedProcesses.length}</span>
            </div>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {breachedProcesses.slice(0, 5).map((process) => (
                <Link 
                  key={process.processInstanceId}
                  href={`/internal/process/${process.processInstanceId}`}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{process.projectName || 'Unnamed Process'}</div>
                    {process.currentStepSLA && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                        {process.currentStepSLA.stepTitle} - {formatDuration(process.currentStepSLA.elapsedMinutes)} elapsed
                      </div>
                    )}
                  </div>
                  <span className={s.icon}>{Icons.arrowRight}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warning Processes */}
      {warningProcesses.length > 0 && (
        <div className={s.card} style={{ borderLeft: '4px solid var(--int-warning)' }}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={s.cardIcon} style={{ color: 'var(--int-warning)' }}>{Icons.warning}</div>
              <h3 className={s.cardTitle}>Approaching SLA</h3>
              <span className={`${s.badge} ${s.badgeWarning}`}>{warningProcesses.length}</span>
            </div>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {warningProcesses.slice(0, 5).map((process) => (
                <Link 
                  key={process.processInstanceId}
                  href={`/internal/process/${process.processInstanceId}`}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{process.projectName || 'Unnamed Process'}</div>
                    {process.currentStepSLA && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
                        {process.currentStepSLA.stepTitle} - {formatDuration(process.currentStepSLA.timeRemaining || 0)} remaining
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {process.currentStepSLA && (
                      <div style={{ 
                        width: '60px', 
                        height: '6px', 
                        background: 'var(--int-border)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{ 
                          width: `${process.currentStepSLA.percentUsed}%`,
                          height: '100%',
                          background: 'var(--int-warning)',
                        }} />
                      </div>
                    )}
                    <span className={s.icon}>{Icons.arrowRight}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Most Breached Steps */}
      {analytics?.mostBreachedSteps && analytics.mostBreachedSteps.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Steps with Most SLA Breaches</h3>
          </div>
          <div className={s.cardBody}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Breach Count</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.mostBreachedSteps.map((step) => (
                  <tr key={step.stepKey}>
                    <td>{step.stepTitle}</td>
                    <td>
                      <span className={`${s.badge} ${step.breachCount > 5 ? s.badgeDanger : s.badgeWarning}`}>
                        {step.breachCount}
                      </span>
                    </td>
                    <td>
                      <div style={{ 
                        width: '80px', 
                        height: '6px', 
                        background: 'var(--int-border)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{ 
                          width: `${Math.min(100, step.breachCount * 10)}%`,
                          height: '100%',
                          background: step.breachCount > 5 ? 'var(--int-error)' : 'var(--int-warning)',
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
