/**
 * Process Analytics Dashboard
 * 
 * Visual analytics for the workflow process including:
 * - Health score gauge
 * - Conversion funnel
 * - Bottleneck analysis
 * - Daily trends chart
 */
'use client';

import { useState, useEffect } from 'react';
import styles from './ProcessAnalytics.module.css';

interface AnalyticsData {
  period: string;
  summary: {
    totalInstances: number;
    completed: number;
    running: number;
    failed: number;
    cancelled: number;
    completionRate: number;
    failureRate: number;
    avgDurationHours: number;
    healthScore: number;
  };
  conversion: {
    leadToProposal: number;
    proposalToProject: number;
    overallConversion: number;
    leads: number;
    proposals: number;
    projects: number;
  };
  bottlenecks: Array<{
    stepKey: string;
    count: number;
    stuckCount: number;
    avgDurationMinutes: number;
  }>;
  dailyStats: Array<{
    date: string;
    started: number;
    completed: number;
  }>;
}

interface ProcessAnalyticsDashboardProps {
  initialPeriod?: string;
}

// Icons
const Icons = {
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  loader: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32"/></svg>,
};

export default function ProcessAnalyticsDashboard({ 
  initialPeriod = '30d' 
}: ProcessAnalyticsDashboardProps) {
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/internal/process/analytics?period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.icon}>{Icons.alert}</span>
          <span>{error || 'No data available'}</span>
        </div>
      </div>
    );
  }

  const { summary, conversion, bottlenecks, dailyStats } = data;
  const maxDaily = Math.max(...dailyStats.map(d => Math.max(d.started, d.completed)), 1);

  // Health score color
  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>{Icons.activity}</span>
          Process Analytics
        </h2>
        <div className={styles.periodSelector}>
          {['7d', '30d', '90d', 'all'].map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'all' ? 'All Time' : p.replace('d', ' Days')}
            </button>
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div className={styles.healthSection}>
        <div className={styles.healthGauge}>
          <svg viewBox="0 0 120 60" className={styles.gauge}>
            {/* Background arc */}
            <path
              d="M 10 55 A 50 50 0 0 1 110 55"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d="M 10 55 A 50 50 0 0 1 110 55"
              fill="none"
              stroke={getHealthColor(summary.healthScore)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${summary.healthScore * 1.57} 157`}
            />
          </svg>
          <div className={styles.healthValue}>
            <span className={styles.healthNumber}>{summary.healthScore}</span>
            <span className={styles.healthLabel}>Health Score</span>
          </div>
        </div>
        <div className={styles.healthMeta}>
          <div className={styles.healthItem}>
            <span className={styles.itemLabel}>Completion Rate</span>
            <span className={styles.itemValue}>{summary.completionRate}%</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.itemLabel}>Avg Duration</span>
            <span className={styles.itemValue}>{summary.avgDurationHours}h</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.itemLabel}>Active Now</span>
            <span className={styles.itemValue}>{summary.running}</span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
            <span style={{ color: '#2563eb' }}>{Icons.activity}</span>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{summary.totalInstances}</span>
            <span className={styles.statLabel}>Total Instances</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7' }}>
            <span style={{ color: '#16a34a' }}>{Icons.check}</span>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{summary.completed}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
            <span style={{ color: '#d97706' }}>{Icons.clock}</span>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{summary.running}</span>
            <span className={styles.statLabel}>Running</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
            <span style={{ color: '#dc2626' }}>{Icons.alert}</span>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{summary.failed}</span>
            <span className={styles.statLabel}>Failed</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.icon}>{Icons.target}</span>
          Conversion Funnel
        </h3>
        <div className={styles.funnel}>
          <div className={styles.funnelStage} style={{ width: '100%' }}>
            <div className={styles.funnelBar} style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}>
              <span className={styles.funnelCount}>{conversion.leads}</span>
            </div>
            <span className={styles.funnelLabel}>Leads</span>
          </div>
          <div className={styles.funnelArrow}>
            <span className={styles.conversionRate}>{conversion.leadToProposal}%</span>
          </div>
          <div className={styles.funnelStage} style={{ width: `${Math.max(30, conversion.leadToProposal)}%` }}>
            <div className={styles.funnelBar} style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}>
              <span className={styles.funnelCount}>{conversion.proposals}</span>
            </div>
            <span className={styles.funnelLabel}>Proposals</span>
          </div>
          <div className={styles.funnelArrow}>
            <span className={styles.conversionRate}>{conversion.proposalToProject}%</span>
          </div>
          <div className={styles.funnelStage} style={{ width: `${Math.max(20, conversion.overallConversion)}%` }}>
            <div className={styles.funnelBar} style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}>
              <span className={styles.funnelCount}>{conversion.projects}</span>
            </div>
            <span className={styles.funnelLabel}>Projects</span>
          </div>
        </div>
        <div className={styles.overallConversion}>
          Overall Conversion: <strong>{conversion.overallConversion}%</strong>
        </div>
      </div>

      {/* Daily Trends */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.icon}>{Icons.trending}</span>
          7-Day Trend
        </h3>
        <div className={styles.chart}>
          {dailyStats.map((day, i) => (
            <div key={day.date} className={styles.chartDay}>
              <div className={styles.chartBars}>
                <div 
                  className={styles.chartBar} 
                  style={{ 
                    height: `${(day.started / maxDaily) * 100}%`,
                    background: '#3b82f6' 
                  }}
                  title={`Started: ${day.started}`}
                />
                <div 
                  className={styles.chartBar} 
                  style={{ 
                    height: `${(day.completed / maxDaily) * 100}%`,
                    background: '#10b981' 
                  }}
                  title={`Completed: ${day.completed}`}
                />
              </div>
              <span className={styles.chartLabel}>
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#3b82f6' }} />
            Started
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#10b981' }} />
            Completed
          </span>
        </div>
      </div>

      {/* Bottlenecks */}
      {bottlenecks.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>{Icons.alert}</span>
            Bottlenecks Detected
          </h3>
          <div className={styles.bottleneckList}>
            {bottlenecks.map((bottleneck, i) => (
              <div key={bottleneck.stepKey} className={styles.bottleneckItem}>
                <div className={styles.bottleneckRank}>{i + 1}</div>
                <div className={styles.bottleneckContent}>
                  <span className={styles.bottleneckName}>
                    {bottleneck.stepKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <div className={styles.bottleneckMeta}>
                    {bottleneck.stuckCount > 0 && (
                      <span className={styles.stuckBadge}>
                        {bottleneck.stuckCount} stuck
                      </span>
                    )}
                    <span className={styles.durationBadge}>
                      ~{bottleneck.avgDurationMinutes} min avg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
