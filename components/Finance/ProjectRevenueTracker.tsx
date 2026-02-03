/**
 * Project Revenue Tracker
 * Track project payments, milestones, and revenue recognition
 * Perfect for tracking projects like Aesthetic Clinic SaaS
 */
'use client';

import { useState, useMemo } from 'react';
import s from '../styles.module.css';

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'paid';
  dueDate: Date | string | number | null;
  completedAt: Date | string | number | null;
  paidAt: Date | string | number | null;
}

interface ProjectFinancials {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  totalContractValue: number;
  amountReceived: number;
  amountPending: number;
  directCosts: number;
  netProfit: number;
  profitMargin: number;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  startDate: Date | string | number | null;
  estimatedEndDate: Date | string | number | null;
  milestones: Milestone[];
}

interface ProjectRevenueTrackerProps {
  projects: ProjectFinancials[];
  currency?: string;
  onRecordPayment?: (projectId: string, milestoneId: string, amount: number) => void;
  onUpdateMilestone?: (projectId: string, milestoneId: string, status: string) => void;
}

function formatMoney(amount: number, currency: string = 'PKR') {
  const value = amount || 0;
  if (currency === 'PKR') {
    return `Rs. ${value.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

function formatDate(timestamp: Date | string | number | null) {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusColors = {
  pending: { bg: 'var(--int-bg-secondary)', text: 'var(--int-text-muted)', label: 'Pending' },
  in_progress: { bg: 'var(--int-info-light)', text: 'var(--int-info)', label: 'In Progress' },
  completed: { bg: 'var(--int-primary-light)', text: 'var(--int-primary)', label: 'Completed' },
  invoiced: { bg: 'var(--int-warning-light)', text: 'var(--int-warning)', label: 'Invoiced' },
  paid: { bg: 'var(--int-success-light)', text: 'var(--int-success)', label: 'Paid' },
  active: { bg: 'var(--int-info-light)', text: 'var(--int-info)', label: 'Active' },
  on_hold: { bg: 'var(--int-warning-light)', text: 'var(--int-warning)', label: 'On Hold' },
  cancelled: { bg: 'var(--int-error-light)', text: 'var(--int-error)', label: 'Cancelled' },
};

export function ProjectRevenueTracker({
  projects,
  currency = 'PKR',
  onRecordPayment,
  onUpdateMilestone,
}: ProjectRevenueTrackerProps) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    if (filter === 'active') return projects.filter(p => p.status === 'active');
    return projects.filter(p => p.status === 'completed');
  }, [projects, filter]);

  const totals = useMemo(() => {
    return {
      totalContractValue: projects.reduce((sum, p) => sum + p.totalContractValue, 0),
      totalReceived: projects.reduce((sum, p) => sum + p.amountReceived, 0),
      totalPending: projects.reduce((sum, p) => sum + p.amountPending, 0),
      totalProfit: projects.reduce((sum, p) => sum + p.netProfit, 0),
    };
  }, [projects]);

  const toggleProject = (projectId: string) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  if (projects.length === 0) {
    return (
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>📊 Project Revenue Tracker</h3>
        </div>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-8)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--int-space-4)' }}>📁</div>
          <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
            No projects with financials yet.
          </p>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
            Add project financials to track revenue and payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h3 className={s.cardTitle}>📊 Project Revenue Tracker</h3>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Track payments, milestones, and revenue across all projects
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: 'var(--int-space-2) var(--int-space-3)',
                background: filter === f ? 'var(--int-primary)' : 'transparent',
                color: filter === f ? 'white' : 'var(--int-text-secondary)',
                border: filter === f ? 'none' : '1px solid var(--int-border)',
                borderRadius: 'var(--int-radius-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 'var(--int-text-sm)',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className={s.cardBody}>
        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 'var(--int-space-4)',
          marginBottom: 'var(--int-space-6)'
        }}>
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-bg-secondary)', 
            borderRadius: 'var(--int-radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
              Total Contract Value
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {formatMoney(totals.totalContractValue, currency)}
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-success-light)', 
            borderRadius: 'var(--int-radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-success)', marginBottom: 'var(--int-space-1)' }}>
              Received
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--int-success)' }}>
              {formatMoney(totals.totalReceived, currency)}
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-warning-light)', 
            borderRadius: 'var(--int-radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-warning)', marginBottom: 'var(--int-space-1)' }}>
              Pending
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--int-warning)' }}>
              {formatMoney(totals.totalPending, currency)}
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-primary-light)', 
            borderRadius: 'var(--int-radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-primary)', marginBottom: 'var(--int-space-1)' }}>
              Net Profit
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--int-primary)' }}>
              {formatMoney(totals.totalProfit, currency)}
            </div>
          </div>
        </div>

        {/* Project List */}
        <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
          {filteredProjects.map(project => {
            const isExpanded = expandedProjectId === project.id;
            const progressPercent = project.totalContractValue > 0 
              ? Math.round((project.amountReceived / project.totalContractValue) * 100) 
              : 0;
            const statusStyle = statusColors[project.status];

            return (
              <div 
                key={project.id}
                style={{ 
                  border: '1px solid var(--int-border)', 
                  borderRadius: 'var(--int-radius)',
                  overflow: 'hidden'
                }}
              >
                {/* Project Header */}
                <button
                  onClick={() => toggleProject(project.id)}
                  style={{
                    width: '100%',
                    padding: 'var(--int-space-4)',
                    background: 'var(--int-bg-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)', marginBottom: 'var(--int-space-1)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>{project.projectName}</span>
                        <span style={{
                          padding: '2px 8px',
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          borderRadius: '12px',
                          fontSize: 'var(--int-text-xs)',
                          fontWeight: 600
                        }}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                        {project.clientName}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>
                        {formatMoney(project.totalContractValue, currency)}
                      </div>
                      <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                        contract value
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginLeft: 'var(--int-space-4)', 
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ marginTop: 'var(--int-space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--int-text-xs)', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--int-success)' }}>
                        Received: {formatMoney(project.amountReceived, currency)}
                      </span>
                      <span style={{ color: 'var(--int-warning)' }}>
                        Pending: {formatMoney(project.amountPending, currency)}
                      </span>
                    </div>
                    <div style={{ 
                      height: '8px', 
                      background: 'var(--int-border)', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(90deg, var(--int-success) 0%, var(--int-primary) 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: '4px' }}>
                      {progressPercent}% collected
                    </div>
                  </div>
                </button>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: 'var(--int-space-4)', borderTop: '1px solid var(--int-border)' }}>
                    {/* Financial Summary */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                      gap: 'var(--int-space-3)',
                      marginBottom: 'var(--int-space-4)'
                    }}>
                      <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Direct Costs</div>
                        <div style={{ fontWeight: 600, color: 'var(--int-error)' }}>
                          {formatMoney(project.directCosts, currency)}
                        </div>
                      </div>
                      <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Net Profit</div>
                        <div style={{ fontWeight: 600, color: 'var(--int-success)' }}>
                          {formatMoney(project.netProfit, currency)}
                        </div>
                      </div>
                      <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Profit Margin</div>
                        <div style={{ fontWeight: 600, color: project.profitMargin >= 50 ? 'var(--int-success)' : 'var(--int-warning)' }}>
                          {project.profitMargin.toFixed(1)}%
                        </div>
                      </div>
                      <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-bg-secondary)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Timeline</div>
                        <div style={{ fontWeight: 600 }}>
                          {formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {project.milestones && project.milestones.length > 0 && (
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)' }}>
                          Milestones & Payments
                        </h4>
                        <div style={{ display: 'grid', gap: 'var(--int-space-2)' }}>
                          {project.milestones.map((milestone, idx) => {
                            const msStatus = statusColors[milestone.status] || statusColors.pending;
                            return (
                              <div 
                                key={milestone.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--int-space-3)',
                                  padding: 'var(--int-space-3)',
                                  background: 'var(--int-bg-secondary)',
                                  borderRadius: 'var(--int-radius)',
                                  borderLeft: `3px solid ${msStatus.text}`
                                }}
                              >
                                <div style={{ 
                                  width: '24px', 
                                  height: '24px', 
                                  borderRadius: '50%', 
                                  background: msStatus.bg,
                                  color: msStatus.text,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 'var(--int-text-xs)'
                                }}>
                                  {idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600 }}>{milestone.title}</div>
                                  {milestone.description && (
                                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                                      {milestone.description}
                                    </div>
                                  )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontWeight: 700 }}>
                                    {formatMoney(milestone.amount, currency)}
                                  </div>
                                  <span style={{
                                    padding: '2px 6px',
                                    background: msStatus.bg,
                                    color: msStatus.text,
                                    borderRadius: '8px',
                                    fontSize: 'var(--int-text-xs)',
                                    fontWeight: 600
                                  }}>
                                    {msStatus.label}
                                  </span>
                                </div>
                                {onRecordPayment && milestone.status !== 'paid' && (
                                  <button
                                    onClick={() => onRecordPayment(project.id, milestone.id, milestone.amount)}
                                    title="Record Payment"
                                    style={{
                                      padding: 'var(--int-space-2)',
                                      background: 'var(--int-success)',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 'var(--int-radius-sm)',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 5v14M5 12h14" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Project Revenue Summary Card
 */
export function ProjectRevenueSummaryCard({
  project,
  currency = 'PKR',
}: {
  project: ProjectFinancials;
  currency?: string;
}) {
  const progressPercent = project.totalContractValue > 0 
    ? Math.round((project.amountReceived / project.totalContractValue) * 100) 
    : 0;

  return (
    <div style={{ 
      padding: 'var(--int-space-4)', 
      background: 'var(--int-bg-secondary)', 
      borderRadius: 'var(--int-radius)',
      border: '1px solid var(--int-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-3)' }}>
        <div>
          <div style={{ fontWeight: 600 }}>{project.projectName}</div>
          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{project.clientName}</div>
        </div>
        <div style={{ fontWeight: 700 }}>{formatMoney(project.totalContractValue, currency)}</div>
      </div>
      
      <div style={{ 
        height: '6px', 
        background: 'var(--int-border)', 
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: 'var(--int-space-2)'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${progressPercent}%`,
          background: 'var(--int-success)',
          borderRadius: '3px'
        }} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--int-text-xs)' }}>
        <span style={{ color: 'var(--int-success)' }}>{progressPercent}% collected</span>
        <span style={{ color: 'var(--int-warning)' }}>
          {formatMoney(project.amountPending, currency)} pending
        </span>
      </div>
    </div>
  );
}
