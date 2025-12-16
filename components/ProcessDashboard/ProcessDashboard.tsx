/**
 * ProcessDashboard Component
 * 
 * Displays analytics and overview of all business processes
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from './ProcessDashboard.module.css';

// Icons
const Icons = {
  process: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  running: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  completed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  canceled: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
};

interface ProcessAnalytics {
  dateRange: {
    start: string;
    end: string;
  };
  processDefinition: {
    key: string;
    name: string;
    version: string;
  };
  overview: {
    total: number;
    running: number;
    completed: number;
    canceled: number;
    errored: number;
    completionRate: number;
    avgCompletionTimeMs: number;
    avgCompletionTimeFormatted: string;
  };
  stepAnalytics: Array<{
    stepKey: string;
    title: string;
    lane: string;
    isManual: boolean;
    automationAction?: string;
    metrics: {
      total: number;
      completed: number;
      errors: number;
      successRate: number;
      avgDurationMs: number;
      avgDurationFormatted: string;
    };
  }>;
  laneAnalytics: Array<{
    lane: string;
    total: number;
    completed: number;
    avgDurationMs: number;
  }>;
  automationAnalytics: Array<{
    actionType: string;
    total: number;
    success: number;
    failed: number;
    successRate: number;
  }>;
  bottlenecks: Array<{
    stepKey: string;
    title: string;
    lane: string;
    waitingCount: number;
  }>;
  trend: Array<{
    date: string;
    started: number;
    completed: number;
  }>;
}

interface ProcessInstance {
  id: string;
  definitionId: string;
  projectId?: string;
  status: string;
  currentStepKey?: string;
  currentStepTitle?: string;
  currentLane?: string;
  startedAt: string;
  project?: {
    name: string;
    lead?: {
      name: string;
      company?: string;
    };
  };
}

export function ProcessDashboard() {
  const [analytics, setAnalytics] = useState<ProcessAnalytics | null>(null);
  const [instances, setInstances] = useState<ProcessInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, instancesRes] = await Promise.all([
        fetch('/api/internal/process/analytics'),
        fetch('/api/internal/process'),
      ]);

      if (!analyticsRes.ok || !instancesRes.ok) {
        throw new Error('Failed to fetch process data');
      }

      const analyticsData = await analyticsRes.json();
      const instancesData = await instancesRes.json();

      setAnalytics(analyticsData);
      setInstances(instancesData.instances || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={s.loading}>
        <span className={s.spinner} />
        <span>Loading process data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.error}>
        <span className={s.icon}>{Icons.error}</span>
        <span>{error}</span>
        <button onClick={fetchData} className={s.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  const runningInstances = instances.filter(i => i.status === 'running');

  return (
    <div className={s.dashboard}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h2 className={s.title}>
            <span className={s.icon}>{Icons.process}</span>
            Business Process Dashboard
          </h2>
          {analytics && (
            <p className={s.subtitle}>
              {analytics.processDefinition.name} v{analytics.processDefinition.version}
            </p>
          )}
        </div>
        <button onClick={fetchData} className={s.refreshBtn} title="Refresh">
          <span className={s.icon}>{Icons.refresh}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <div className={`${s.statIcon} ${s.total}`}>{Icons.process}</div>
            <div className={s.statContent}>
              <span className={s.statValue}>{analytics.overview.total}</span>
              <span className={s.statLabel}>Total Processes</span>
            </div>
          </div>

          <div className={s.statCard}>
            <div className={`${s.statIcon} ${s.running}`}>{Icons.running}</div>
            <div className={s.statContent}>
              <span className={s.statValue}>{analytics.overview.running}</span>
              <span className={s.statLabel}>Running</span>
            </div>
          </div>

          <div className={s.statCard}>
            <div className={`${s.statIcon} ${s.completed}`}>{Icons.completed}</div>
            <div className={s.statContent}>
              <span className={s.statValue}>{analytics.overview.completed}</span>
              <span className={s.statLabel}>Completed</span>
            </div>
          </div>

          <div className={s.statCard}>
            <div className={`${s.statIcon} ${s.rate}`}>{Icons.chart}</div>
            <div className={s.statContent}>
              <span className={s.statValue}>{analytics.overview.completionRate}%</span>
              <span className={s.statLabel}>Success Rate</span>
            </div>
          </div>

          <div className={s.statCard}>
            <div className={`${s.statIcon} ${s.time}`}>{Icons.clock}</div>
            <div className={s.statContent}>
              <span className={s.statValue}>
                {analytics.overview.avgCompletionTimeFormatted || 'N/A'}
              </span>
              <span className={s.statLabel}>Avg. Duration</span>
            </div>
          </div>

          {analytics.overview.errored > 0 && (
            <div className={s.statCard}>
              <div className={`${s.statIcon} ${s.error}`}>{Icons.error}</div>
              <div className={s.statContent}>
                <span className={s.statValue}>{analytics.overview.errored}</span>
                <span className={s.statLabel}>Errors</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Processes */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Active Processes</h3>
          <Link href="/internal/process" className={s.viewAllLink}>
            View All
            <span className={s.icon}>{Icons.arrowRight}</span>
          </Link>
        </div>

        {runningInstances.length === 0 ? (
          <div className={s.emptyState}>
            <span className={s.icon}>{Icons.completed}</span>
            <span>No active processes</span>
          </div>
        ) : (
          <div className={s.instancesList}>
            {runningInstances.slice(0, 5).map(instance => (
              <Link
                key={instance.id}
                href={`/internal/process/${instance.id}`}
                className={s.instanceCard}
              >
                <div className={s.instanceHeader}>
                  <span className={s.instanceName}>
                    {instance.project?.name || 'Untitled Process'}
                  </span>
                  <span className={`${s.instanceStatus} ${s[instance.status]}`}>
                    {instance.status}
                  </span>
                </div>
                {instance.project?.lead && (
                  <div className={s.instanceMeta}>
                    <span>{instance.project.lead.name}</span>
                    {instance.project.lead.company && (
                      <span> • {instance.project.lead.company}</span>
                    )}
                  </div>
                )}
                <div className={s.instanceStep}>
                  <span className={`${s.laneBadge} ${s[instance.currentLane || '']}`}>
                    {instance.currentLane}
                  </span>
                  <span className={s.stepTitle}>{instance.currentStepTitle}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottlenecks */}
      {analytics && analytics.bottlenecks.length > 0 && (
        <div className={s.section}>
          <h3 className={s.sectionTitle}>Current Bottlenecks</h3>
          <div className={s.bottlenecksList}>
            {analytics.bottlenecks.map(bottleneck => (
              <div key={bottleneck.stepKey} className={s.bottleneckCard}>
                <div className={s.bottleneckCount}>{bottleneck.waitingCount}</div>
                <div className={s.bottleneckContent}>
                  <span className={s.bottleneckTitle}>{bottleneck.title}</span>
                  <span className={`${s.laneBadge} ${s[bottleneck.lane]}`}>
                    {bottleneck.lane}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Performance */}
      {analytics && analytics.automationAnalytics.length > 0 && (
        <div className={s.section}>
          <h3 className={s.sectionTitle}>Automation Performance</h3>
          <div className={s.automationGrid}>
            {analytics.automationAnalytics.map(auto => (
              <div key={auto.actionType} className={s.automationCard}>
                <div className={s.automationHeader}>
                  <code className={s.automationName}>{auto.actionType}</code>
                  <span className={`${s.successRate} ${
                    auto.successRate >= 90 ? s.good : 
                    auto.successRate >= 70 ? s.ok : s.bad
                  }`}>
                    {auto.successRate}%
                  </span>
                </div>
                <div className={s.automationStats}>
                  <span className={s.automationStat}>
                    {auto.success} / {auto.total} successful
                  </span>
                  {auto.failed > 0 && (
                    <span className={`${s.automationStat} ${s.failed}`}>
                      {auto.failed} failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessDashboard;
