'use client';

/**
 * Bottleneck Analysis Dashboard Component
 * 
 * Visualizes workflow bottlenecks and provides optimization recommendations
 */

import { useState, useEffect } from 'react';
import s from '../../app/internal/styles.module.css';

interface StepMetrics {
  stepKey: string;
  stepTitle: string;
  totalInstances: number;
  completedInstances: number;
  activeInstances: number;
  averageDurationMinutes: number;
  medianDurationMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  slaBreachCount: number;
  slaBreachRate: number;
  bottleneckScore: number;
}

interface LaneMetrics {
  laneKey: string;
  laneTitle: string;
  role: string;
  steps: StepMetrics[];
  averageDurationMinutes: number;
  slaBreachRate: number;
  bottleneckScore: number;
}

interface ResourceUtilization {
  userId: string;
  userName: string;
  role: string;
  activeSteps: number;
  completedSteps: number;
  averageCompletionTime: number;
  workloadScore: number;
  isOverloaded: boolean;
}

interface Recommendation {
  id: string;
  type: 'step_optimization' | 'resource_rebalancing' | 'sla_adjustment' | 'automation_candidate' | 'parallel_execution';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  targetKey?: string;
  estimatedImprovement?: string;
}

interface BottleneckAnalysis {
  timestamp: string;
  steps: StepMetrics[];
  lanes: LaneMetrics[];
  resources: ResourceUtilization[];
  recommendations: Recommendation[];
  overallHealthScore: number;
}

const Icons = {
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  bulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  arrowUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  arrowDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${Math.round(minutes % 60)}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function getHealthColor(score: number): string {
  if (score >= 80) return 'var(--int-success)';
  if (score >= 60) return 'var(--int-warning)';
  return 'var(--int-error)';
}

function getBottleneckLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Critical', color: 'var(--int-error)' };
  if (score >= 60) return { label: 'High', color: 'var(--int-warning)' };
  if (score >= 40) return { label: 'Moderate', color: 'var(--int-primary)' };
  return { label: 'Low', color: 'var(--int-success)' };
}

function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'var(--int-error)';
    case 'medium': return 'var(--int-warning)';
    case 'low': return 'var(--int-text-muted)';
  }
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: active ? 'var(--int-primary)' : 'transparent',
        color: active ? 'white' : 'var(--int-text)',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
      }}
    >
      <span className={s.icon}>{icon}</span>
      {label}
    </button>
  );
}

export default function BottleneckAnalysisDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BottleneckAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'lanes' | 'resources' | 'recommendations'>('steps');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/internal/process/bottlenecks?type=full');
      if (!response.ok) throw new Error('Failed to fetch bottleneck data');
      
      const data = await response.json();
      setAnalysis(data.analysis);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !analysis) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: '2rem' }}>
          <div className={s.spinner}></div>
          <p style={{ color: 'var(--int-text-muted)', marginTop: '1rem' }}>Analyzing workflow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.card}>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--int-error)' }}>{error}</p>
          <button onClick={fetchData} className={s.btnSecondary} style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const topBottlenecks = [...(analysis.steps || [])].sort((a, b) => b.bottleneckScore - a.bottleneckScore).slice(0, 5);
  const overloadedResources = (analysis.resources || []).filter(r => r.isOverloaded);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Bottleneck Analysis</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>
            Identify workflow inefficiencies and optimization opportunities
          </p>
        </div>
        <button onClick={fetchData} className={s.btnSecondary} disabled={loading}>
          <span className={s.icon}>{Icons.refresh}</span>
          {loading ? 'Analyzing...' : 'Re-analyze'}
        </button>
      </div>

      {/* Health Score Card */}
      <div className={s.card} style={{ borderLeft: `4px solid ${getHealthColor(analysis.overallHealthScore)}` }}>
        <div className={s.cardBody}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>Overall Workflow Health</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getHealthColor(analysis.overallHealthScore) }}>
                {analysis.overallHealthScore}%
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{topBottlenecks.filter(b => b.bottleneckScore >= 60).length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Bottlenecks</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{overloadedResources.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Overloaded</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{(analysis.recommendations || []).filter(r => r.priority === 'high').length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>High Priority</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--int-surface)', padding: '0.5rem', borderRadius: '0.75rem' }}>
        <TabButton active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} icon={Icons.activity} label="Steps" />
        <TabButton active={activeTab === 'lanes'} onClick={() => setActiveTab('lanes')} icon={Icons.trending} label="Lanes" />
        <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={Icons.users} label="Resources" />
        <TabButton active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} icon={Icons.bulb} label="Recommendations" />
      </div>

      {/* Steps Analysis */}
      {activeTab === 'steps' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Step Performance Analysis</h3>
          </div>
          <div className={s.cardBody}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Avg Duration</th>
                  <th>Active</th>
                  <th>SLA Breach Rate</th>
                  <th>Bottleneck Score</th>
                </tr>
              </thead>
              <tbody>
                {(analysis.steps || []).map((step) => {
                  const level = getBottleneckLevel(step.bottleneckScore);
                  return (
                    <tr key={step.stepKey}>
                      <td style={{ fontWeight: 500 }}>{step.stepTitle}</td>
                      <td>{formatDuration(step.averageDurationMinutes)}</td>
                      <td>
                        <span className={`${s.badge} ${step.activeInstances > 3 ? s.badgeWarning : s.badgeDefault}`}>
                          {step.activeInstances}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          color: step.slaBreachRate > 20 ? 'var(--int-error)' : step.slaBreachRate > 10 ? 'var(--int-warning)' : 'var(--int-success)' 
                        }}>
                          {step.slaBreachRate.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            background: 'var(--int-border)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}>
                            <div style={{ 
                              width: `${step.bottleneckScore}%`,
                              height: '100%',
                              background: level.color,
                            }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: level.color }}>{level.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lanes Analysis */}
      {activeTab === 'lanes' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Lane Performance Analysis</h3>
          </div>
          <div className={s.cardBody}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(analysis.lanes || []).map((lane) => {
                const level = getBottleneckLevel(lane.bottleneckScore);
                return (
                  <div key={lane.laneKey} style={{ 
                    padding: '1rem', 
                    background: 'var(--int-surface)', 
                    borderRadius: '0.5rem',
                    borderLeft: `4px solid ${level.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{lane.laneTitle}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--int-text-muted)' }}>{lane.role}</div>
                      </div>
                      <span className={`${s.badge}`} style={{ background: level.color, color: 'white' }}>
                        {level.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatDuration(lane.averageDurationMinutes)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Avg Duration</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{lane.slaBreachRate.toFixed(1)}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>SLA Breach Rate</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{lane.steps.length}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>Steps</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Resources Analysis */}
      {activeTab === 'resources' && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Resource Utilization</h3>
          </div>
          <div className={s.cardBody}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Role</th>
                  <th>Active Steps</th>
                  <th>Completed</th>
                  <th>Avg Completion</th>
                  <th>Workload</th>
                </tr>
              </thead>
              <tbody>
                {(analysis.resources || []).map((resource) => (
                  <tr key={resource.userId}>
                    <td style={{ fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {resource.userName}
                        {resource.isOverloaded && (
                          <span style={{ color: 'var(--int-error)' }}>{Icons.arrowUp}</span>
                        )}
                      </span>
                    </td>
                    <td>{resource.role}</td>
                    <td>
                      <span className={`${s.badge} ${resource.activeSteps > 5 ? s.badgeDanger : s.badgeDefault}`}>
                        {resource.activeSteps}
                      </span>
                    </td>
                    <td>{resource.completedSteps}</td>
                    <td>{formatDuration(resource.averageCompletionTime)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '80px', 
                          height: '8px', 
                          background: 'var(--int-border)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            width: `${Math.min(100, resource.workloadScore)}%`,
                            height: '100%',
                            background: resource.isOverloaded ? 'var(--int-error)' : resource.workloadScore > 70 ? 'var(--int-warning)' : 'var(--int-success)',
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem' }}>{resource.workloadScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {activeTab === 'recommendations' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(analysis.recommendations || []).length === 0 ? (
            <div className={s.card}>
              <div className={s.cardBody} style={{ textAlign: 'center', padding: '2rem' }}>
                <span className={s.icon} style={{ fontSize: '2rem', color: 'var(--int-success)' }}>{Icons.zap}</span>
                <p style={{ marginTop: '1rem', color: 'var(--int-text-muted)' }}>
                  No recommendations at this time. Your workflow is performing well!
                </p>
              </div>
            </div>
          ) : (
            (analysis.recommendations || []).map((rec) => (
              <div key={rec.id} className={s.card} style={{ borderLeft: `4px solid ${getPriorityColor(rec.priority)}` }}>
                <div className={s.cardBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={s.icon} style={{ color: 'var(--int-primary)' }}>{Icons.bulb}</span>
                      <h4 style={{ margin: 0, fontWeight: 600 }}>{rec.title}</h4>
                    </div>
                    <span className={`${s.badge}`} style={{ 
                      background: getPriorityColor(rec.priority), 
                      color: rec.priority === 'low' ? 'var(--int-text)' : 'white' 
                    }}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', color: 'var(--int-text-muted)' }}>{rec.description}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                    <div>
                      <strong>Impact:</strong> {rec.impact}
                    </div>
                    {rec.estimatedImprovement && (
                      <div>
                        <strong>Est. Improvement:</strong> {rec.estimatedImprovement}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
