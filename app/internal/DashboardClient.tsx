'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import s from './styles.module.css';

// Import process widgets
import { SLAStatusWidget, WorkloadWidget, BottleneckAlertWidget, AutomationWidget } from '@/components/ProcessWidgets/ProcessWidgets';

// Types for dashboard data - Uses string IDs to match database schema
export interface TaskSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: Date | null;
  projectName?: string;
}

export interface LeadSummary {
  id: string;
  company: string;
  name: string;
  status: string;
  createdAt: Date;
  email?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  priority: string;
  progress?: number;
  health?: string;
  updatedAt: Date;
}

export interface WorkflowStage {
  name: string;
  count: number;
  avgDays: number;
}

export interface UpcomingDeadline {
  type: 'task' | 'milestone' | 'renewal';
  id: string;
  title: string;
  date: Date;
  projectId?: string;
  projectName?: string;
}

export interface DashboardData {
  kpis: {
    activeProjects: number;
    totalProjects: number;
    blockedProjects: number;
    openTasks: number;
    inProgressTasks: number;
    completionRate: number;
    totalClients: number;
    runningWorkflows: number;
    completedWorkflows: number;
    overdueTasks: number;
    blockedTasks: number;
    overdueInvoices: number;
    utilizationRate: number;
    projectVelocity: number;
    budgetBurn: number;
  };
  trends: {
    projectsTrend: number[];
    tasksTrend: number[];
    leadsTrend: number[];
    revenueTrend: number[];
  };
  myTasks: TaskSummary[];
  recentLeads: LeadSummary[];
  attentionProjects: ProjectSummary[];
  workflowStages: WorkflowStage[];
  upcomingDeadlines: UpcomingDeadline[];
}

interface DashboardClientProps {
  data: DashboardData;
  userName: string;
  userRole: string;
}

// SVG Icons
const Icons = {
  projects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  workflow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  clients: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
  trendUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
  trendDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/><polyline points="17,18 23,18 23,12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  speed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"/></svg>,
  flame: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.3.9.6 1.635 1.9 2.8z"/></svg>,
};

// Sparkline component for trend visualization
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ 
  data, 
  color, 
  height = 40 
}) => {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const width = 100;
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * (height - 4) - 2
  }));
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#gradient-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
    </svg>
  );
};

// Progress Ring component
const ProgressRing: React.FC<{ 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}> = ({ value, size = 60, strokeWidth = 6, color = 'var(--int-primary)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <svg width={size} height={size}>
      <circle
        stroke="var(--int-bg-tertiary)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          strokeDasharray: circumference,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%'
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fontWeight="600"
        fill="var(--int-text-primary)"
      >
        {value}%
      </text>
    </svg>
  );
};

// Mini workflow visualization
const WorkflowMini: React.FC<{ stages: WorkflowStage[] }> = ({ stages }) => {
  const maxCount = Math.max(...stages.map(s => s.count), 1);
  
  return (
    <div className={s.workflowMini}>
      {stages.map((stage, index) => (
        <React.Fragment key={stage.name}>
          <div className={s.workflowMiniStage}>
            <div 
              className={s.workflowMiniBar}
              style={{ 
                height: `${Math.max(20, (stage.count / maxCount) * 100)}%`,
                background: index === stages.length - 1 ? 'var(--int-success)' : 'var(--int-primary)'
              }}
            />
            <span className={s.workflowMiniCount}>{stage.count}</span>
            <span className={s.workflowMiniLabel}>{stage.name.split(' ')[0]}</span>
          </div>
          {index < stages.length - 1 && (
            <div className={s.workflowMiniArrow}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Activity feed item types
type ActivityType = 'task' | 'project' | 'lead' | 'milestone';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

export default function DashboardClient({ data, userName, userRole }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'workflow'>('overview');
  const [showAllDeadlines, setShowAllDeadlines] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate trends
  const getTrendDirection = (trend: number[]): 'up' | 'down' | 'neutral' => {
    if (trend.length < 2) return 'neutral';
    const recent = trend.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlier = trend.slice(0, 3);
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    if (avg > earlierAvg * 1.1) return 'up';
    if (avg < earlierAvg * 0.9) return 'down';
    return 'neutral';
  };

  const projectsTrendDir = getTrendDirection(data.trends.projectsTrend);
  const tasksTrendDir = getTrendDirection(data.trends.tasksTrend);

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = currentTime;
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: 'var(--int-text-secondary)',
      in_progress: 'var(--int-primary)',
      blocked: 'var(--int-error)',
      done: 'var(--int-success)',
      new: 'var(--int-info)',
      in_review: 'var(--int-warning)',
      approved: 'var(--int-success)',
    };
    return colors[status] || 'var(--int-text-secondary)';
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      critical: 'var(--int-error)',
      high: 'var(--int-warning)',
      medium: 'var(--int-primary)',
      low: 'var(--int-text-secondary)',
    };
    return colors[priority] || 'var(--int-text-secondary)';
  };

  const displayedDeadlines = showAllDeadlines 
    ? data.upcomingDeadlines 
    : data.upcomingDeadlines.slice(0, 5);

  return (
    <div className={s.dashboardEnhanced}>
      {/* Tab Navigation */}
      <div className={s.dashboardTabs}>
        <button
          className={`${s.dashboardTab} ${activeTab === 'overview' ? s.dashboardTabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className={s.dashboardTabIcon}>{Icons.activity}</span>
          Overview
        </button>
        <button
          className={`${s.dashboardTab} ${activeTab === 'tasks' ? s.dashboardTabActive : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span className={s.dashboardTabIcon}>{Icons.tasks}</span>
          My Tasks
        </button>
        <button
          className={`${s.dashboardTab} ${activeTab === 'workflow' ? s.dashboardTabActive : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          <span className={s.dashboardTabIcon}>{Icons.workflow}</span>
          Workflow
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={s.dashboardContent}
          >
            {/* Enhanced KPI Cards with Sparklines */}
            <div className={s.kpiCardsEnhanced}>
              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconProjects}`}>{Icons.projects}</div>
                  <div className={s.kpiTrendBadge} data-trend={projectsTrendDir}>
                    {projectsTrendDir === 'up' ? Icons.trendUp : projectsTrendDir === 'down' ? Icons.trendDown : null}
                    {projectsTrendDir !== 'neutral' && (
                      <span>{projectsTrendDir === 'up' ? '+12%' : '-8%'}</span>
                    )}
                  </div>
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.activeProjects}</div>
                <div className={s.kpiLabelEnhanced}>Active Projects</div>
                <div className={s.kpiSparkline}>
                  <Sparkline data={data.trends.projectsTrend} color="var(--int-success)" />
                </div>
                <div className={s.kpiMeta}>
                  <span>{data.kpis.totalProjects} total</span>
                  {data.kpis.blockedProjects > 0 && (
                    <span className={s.kpiMetaDanger}>{data.kpis.blockedProjects} blocked</span>
                  )}
                </div>
                <Link href="/internal/projects" className={s.kpiCardLink}>
                  View Projects {Icons.arrowRight}
                </Link>
              </motion.div>

              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconTasks}`}>{Icons.tasks}</div>
                  <ProgressRing value={data.kpis.completionRate} size={48} strokeWidth={5} />
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.openTasks}</div>
                <div className={s.kpiLabelEnhanced}>Open Tasks</div>
                <div className={s.kpiSparkline}>
                  <Sparkline data={data.trends.tasksTrend} color="var(--int-warning)" />
                </div>
                <div className={s.kpiMeta}>
                  <span>{data.kpis.inProgressTasks} in progress</span>
                  {data.kpis.overdueTasks > 0 && (
                    <span className={s.kpiMetaDanger}>{data.kpis.overdueTasks} overdue</span>
                  )}
                </div>
                <Link href="/internal/tasks" className={s.kpiCardLink}>
                  View Tasks {Icons.arrowRight}
                </Link>
              </motion.div>

              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconWorkflow}`}>{Icons.workflow}</div>
                  <div className={s.kpiStatusDot} data-status="running" />
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.runningWorkflows}</div>
                <div className={s.kpiLabelEnhanced}>Running Workflows</div>
                <div className={s.kpiMiniWorkflow}>
                  <WorkflowMini stages={data.workflowStages} />
                </div>
                <div className={s.kpiMeta}>
                  <span>{data.kpis.completedWorkflows} completed</span>
                </div>
                <Link href="/internal/admin/process" className={s.kpiCardLink}>
                  View Workflow {Icons.arrowRight}
                </Link>
              </motion.div>

              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconClients}`}>{Icons.clients}</div>
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.totalClients}</div>
                <div className={s.kpiLabelEnhanced}>Total Clients</div>
                <div className={s.kpiSparkline}>
                  <Sparkline data={data.trends.leadsTrend} color="var(--int-info)" />
                </div>
                <div className={s.kpiMeta}>
                  <span>Active accounts</span>
                </div>
                <Link href="/internal/clients" className={s.kpiCardLink}>
                  View Clients {Icons.arrowRight}
                </Link>
              </motion.div>

              {/* New KPIs */}
              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconTasks}`}>{Icons.speed}</div>
                  <ProgressRing value={data.kpis.utilizationRate} size={48} strokeWidth={5} color="var(--int-primary)" />
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.utilizationRate}%</div>
                <div className={s.kpiLabelEnhanced}>Utilization Rate</div>
                <div className={s.kpiMeta}>
                  <span>Resource efficiency</span>
                </div>
                <Link href="/internal/resources" className={s.kpiCardLink}>
                  View Resources {Icons.arrowRight}
                </Link>
              </motion.div>

              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconProjects}`}>{Icons.chart}</div>
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.projectVelocity}</div>
                <div className={s.kpiLabelEnhanced}>Project Velocity</div>
                <div className={s.kpiMeta}>
                  <span>Tasks/30 days</span>
                </div>
                <Link href="/internal/projects" className={s.kpiCardLink}>
                  View Details {Icons.arrowRight}
                </Link>
              </motion.div>

              <motion.div 
                className={s.kpiCardEnhanced}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={s.kpiCardHeader}>
                  <div className={`${s.kpiIconEnhanced} ${s.kpiIconWorkflow}`}>{Icons.flame}</div>
                  <ProgressRing value={data.kpis.budgetBurn} size={48} strokeWidth={5} color="var(--int-error)" />
                </div>
                <div className={s.kpiValueLarge}>{data.kpis.budgetBurn}%</div>
                <div className={s.kpiLabelEnhanced}>Budget Burn</div>
                <div className={s.kpiMeta}>
                  <span>Total budget used</span>
                </div>
                <Link href="/internal/finance" className={s.kpiCardLink}>
                  View Finance {Icons.arrowRight}
                </Link>
              </motion.div>
            </div>

            {/* Two-column layout */}
            <div className={s.dashboardTwoCol}>
              {/* Upcoming Deadlines */}
              <div className={s.dashboardCard}>
                <div className={s.dashboardCardHeader}>
                  <h3>
                    <span className={s.dashboardCardIcon}>{Icons.calendar}</span>
                    Upcoming Deadlines
                  </h3>
                  {data.upcomingDeadlines.length > 5 && (
                    <button 
                      className={s.btnText}
                      onClick={() => setShowAllDeadlines(!showAllDeadlines)}
                    >
                      {showAllDeadlines ? 'Show Less' : `Show All (${data.upcomingDeadlines.length})`}
                    </button>
                  )}
                </div>
                <div className={s.dashboardCardBody}>
                  {displayedDeadlines.length > 0 ? (
                    <div className={s.deadlineList}>
                      {displayedDeadlines.map((item, index) => {
                        const daysUntil = Math.ceil((item.date.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysUntil < 0;
                        const isUrgent = daysUntil <= 2 && daysUntil >= 0;
                        
                        return (
                          <motion.div
                            key={`${item.type}-${item.id}`}
                            className={`${s.deadlineItem} ${isOverdue ? s.deadlineOverdue : ''} ${isUrgent ? s.deadlineUrgent : ''}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className={s.deadlineIcon} data-type={item.type}>
                              {item.type === 'task' ? Icons.tasks : 
                               item.type === 'milestone' ? Icons.target : 
                               Icons.refresh}
                            </div>
                            <div className={s.deadlineContent}>
                              <span className={s.deadlineTitle}>{item.title}</span>
                              {item.projectName && (
                                <span className={s.deadlineProject}>{item.projectName}</span>
                              )}
                            </div>
                            <div className={s.deadlineDate}>
                              <span className={`${s.deadlineBadge} ${isOverdue ? s.badgeDanger : isUrgent ? s.badgeWarning : s.badgeDefault}`}>
                                {formatRelativeTime(item.date)}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={s.emptyState}>
                      <div className={s.emptyStateIcon}>{Icons.calendar}</div>
                      <p>No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Needing Attention */}
              {['admin', 'pm'].includes(userRole) && data.attentionProjects.length > 0 && (
                <div className={s.dashboardCard}>
                  <div className={s.dashboardCardHeader}>
                    <h3>
                      <span className={`${s.dashboardCardIcon} ${s.iconWarning}`}>{Icons.warning}</span>
                      Projects Needing Attention
                    </h3>
                    <Link href="/internal/projects" className={s.btnText}>
                      View All {Icons.arrowRight}
                    </Link>
                  </div>
                  <div className={s.dashboardCardBody}>
                    <div className={s.attentionList}>
                      {data.attentionProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link href={`/internal/projects/${project.id}`} className={s.attentionItem}>
                            <div className={s.attentionHeader}>
                              <span className={s.attentionName}>{project.name}</span>
                              <span 
                                className={s.attentionStatus}
                                style={{ color: getStatusColor(project.status) }}
                              >
                                {project.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className={s.attentionMeta}>
                              <span 
                                className={s.attentionPriority}
                                style={{ color: getPriorityColor(project.priority) }}
                              >
                                {project.priority} priority
                              </span>
                              {project.progress !== undefined && (
                                <div className={s.attentionProgress}>
                                  <div 
                                    className={s.attentionProgressBar}
                                    style={{ width: `${project.progress}%` }}
                                  />
                                  <span>{project.progress}%</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className={s.quickActionsBar}>
              <h3>Quick Actions</h3>
              <div className={s.quickActionsRow}>
                <Link href="/internal/tasks" className={s.quickActionBtn}>
                  <span className={s.quickActionBtnIcon}>{Icons.tasks}</span>
                  New Task
                </Link>
                {['admin', 'pm'].includes(userRole) && (
                  <>
                    <Link href="/internal/projects" className={s.quickActionBtn}>
                      <span className={s.quickActionBtnIcon}>{Icons.projects}</span>
                      New Project
                    </Link>
                    <Link href="/internal/clients" className={s.quickActionBtn}>
                      <span className={s.quickActionBtnIcon}>{Icons.clients}</span>
                      Add Client
                    </Link>
                  </>
                )}
                <Link href="/internal/reports" className={s.quickActionBtn}>
                  <span className={s.quickActionBtnIcon}>{Icons.activity}</span>
                  View Reports
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={s.dashboardContent}
          >
            {/* Task Summary Cards */}
            <div className={s.taskSummaryCards}>
              <div className={s.taskSummaryCard} data-status="todo">
                <div className={s.taskSummaryIcon}>{Icons.clock}</div>
                <div className={s.taskSummaryValue}>
                  {data.myTasks.filter(t => t.status === 'todo').length}
                </div>
                <div className={s.taskSummaryLabel}>To Do</div>
              </div>
              <div className={s.taskSummaryCard} data-status="in_progress">
                <div className={s.taskSummaryIcon}>{Icons.zap}</div>
                <div className={s.taskSummaryValue}>
                  {data.myTasks.filter(t => t.status === 'in_progress').length}
                </div>
                <div className={s.taskSummaryLabel}>In Progress</div>
              </div>
              <div className={s.taskSummaryCard} data-status="blocked">
                <div className={s.taskSummaryIcon}>{Icons.warning}</div>
                <div className={s.taskSummaryValue}>
                  {data.myTasks.filter(t => t.status === 'blocked').length}
                </div>
                <div className={s.taskSummaryLabel}>Blocked</div>
              </div>
              <div className={s.taskSummaryCard} data-status="done">
                <div className={s.taskSummaryIcon}>{Icons.check}</div>
                <div className={s.taskSummaryValue}>{data.kpis.completionRate}%</div>
                <div className={s.taskSummaryLabel}>Complete</div>
              </div>
            </div>

            {/* Task List */}
            <div className={s.dashboardCard}>
              <div className={s.dashboardCardHeader}>
                <h3>My Tasks</h3>
                <Link href="/internal/tasks" className={s.btnText}>
                  View All {Icons.arrowRight}
                </Link>
              </div>
              <div className={s.dashboardCardBody}>
                {data.myTasks.length > 0 ? (
                  <div className={s.taskListEnhanced}>
                    {data.myTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link href={`/internal/tasks/${task.id}`} className={s.taskItemEnhanced}>
                          <div 
                            className={s.taskStatusIndicator}
                            style={{ background: getStatusColor(task.status) }}
                          />
                          <div className={s.taskItemContent}>
                            <span className={s.taskItemTitle}>{task.title}</span>
                            {task.projectName && (
                              <span className={s.taskItemProject}>{task.projectName}</span>
                            )}
                          </div>
                          <div className={s.taskItemMeta}>
                            <span 
                              className={s.taskItemPriority}
                              style={{ color: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                            {task.dueAt && (
                              <span className={s.taskItemDue}>
                                {Icons.calendar}
                                {formatRelativeTime(task.dueAt)}
                              </span>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}>{Icons.tasks}</div>
                    <p>No pending tasks assigned to you</p>
                    <Link href="/internal/tasks" className={s.btnOutline}>
                      Browse All Tasks
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'workflow' && (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={s.dashboardContent}
          >
            {/* Workflow Overview */}
            <div className={s.workflowOverview}>
              <div className={s.workflowHeader}>
                <h3>BPMN Workflow Pipeline</h3>
                <Link href="/internal/admin/process" className={s.btnText}>
                  Manage Workflows {Icons.arrowRight}
                </Link>
              </div>
              
              {/* Full-width Workflow Visualization */}
              <div className={s.workflowStagesContainer}>
                {data.workflowStages.map((stage, index) => (
                  <React.Fragment key={stage.name}>
                    <motion.div
                      className={s.workflowStageCard}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={s.workflowStageHeader}>
                        <span className={s.workflowStageNumber}>{index + 1}</span>
                        <span className={s.workflowStageName}>{stage.name}</span>
                      </div>
                      <div className={s.workflowStageStats}>
                        <div className={s.workflowStageStat}>
                          <span className={s.workflowStageValue}>{stage.count}</span>
                          <span className={s.workflowStageLabel}>Items</span>
                        </div>
                        <div className={s.workflowStageStat}>
                          <span className={s.workflowStageValue}>{stage.avgDays}d</span>
                          <span className={s.workflowStageLabel}>Avg Time</span>
                        </div>
                      </div>
                      <div 
                        className={s.workflowStageProgress}
                        style={{ 
                          width: `${Math.min(100, (stage.count / Math.max(...data.workflowStages.map(s => s.count), 1)) * 100)}%`,
                          background: index === data.workflowStages.length - 1 ? 'var(--int-success)' : 'var(--int-primary)'
                        }}
                      />
                    </motion.div>
                    {index < data.workflowStages.length - 1 && (
                      <div className={s.workflowStageArrow}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Workflow Stats */}
            <div className={s.workflowStats}>
              <div className={s.workflowStatCard}>
                <div className={s.workflowStatIcon}>{Icons.zap}</div>
                <div className={s.workflowStatContent}>
                  <span className={s.workflowStatValue}>{data.kpis.runningWorkflows}</span>
                  <span className={s.workflowStatLabel}>Running</span>
                </div>
              </div>
              <div className={s.workflowStatCard}>
                <div className={s.workflowStatIcon}>{Icons.check}</div>
                <div className={s.workflowStatContent}>
                  <span className={s.workflowStatValue}>{data.kpis.completedWorkflows}</span>
                  <span className={s.workflowStatLabel}>Completed</span>
                </div>
              </div>
              <div className={s.workflowStatCard}>
                <div className={s.workflowStatIcon}>{Icons.clock}</div>
                <div className={s.workflowStatContent}>
                  <span className={s.workflowStatValue}>
                    {data.workflowStages.reduce((sum, s) => sum + s.avgDays, 0)}d
                  </span>
                  <span className={s.workflowStatLabel}>Avg Cycle</span>
                </div>
              </div>
              <div className={s.workflowStatCard}>
                <div className={s.workflowStatIcon}>{Icons.target}</div>
                <div className={s.workflowStatContent}>
                  <span className={s.workflowStatValue}>
                    {data.kpis.completedWorkflows > 0 
                      ? Math.round((data.kpis.completedWorkflows / (data.kpis.completedWorkflows + data.kpis.runningWorkflows)) * 100)
                      : 0}%
                  </span>
                  <span className={s.workflowStatLabel}>Success Rate</span>
                </div>
              </div>
            </div>

            {/* Recent Leads (for PM/Admin) */}
            {['admin', 'pm'].includes(userRole) && data.recentLeads.length > 0 && (
              <div className={s.dashboardCard}>
                <div className={s.dashboardCardHeader}>
                  <h3>
                    <span className={s.dashboardCardIcon}>{Icons.user}</span>
                    Recent Leads
                  </h3>
                  <Link href="/internal/leads" className={s.btnText}>
                    View All {Icons.arrowRight}
                  </Link>
                </div>
                <div className={s.dashboardCardBody}>
                  <div className={s.leadListEnhanced}>
                    {data.recentLeads.map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/internal/leads/${lead.id}`} className={s.leadItemEnhanced}>
                          <div className={s.leadAvatar}>
                            {lead.company.charAt(0)}
                          </div>
                          <div className={s.leadContent}>
                            <span className={s.leadCompany}>{lead.company}</span>
                            <span className={s.leadName}>{lead.name}</span>
                          </div>
                          <div className={s.leadMeta}>
                            <span 
                              className={s.leadStatus}
                              style={{ color: getStatusColor(lead.status) }}
                            >
                              {lead.status.replace('_', ' ')}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Process Workflow Widgets (for PM/Admin) */}
            {['admin', 'pm'].includes(userRole) && (
              <div style={{ marginTop: 'var(--int-space-6)' }}>
                <h3 style={{ marginBottom: 'var(--int-space-4)' }}>
                  <span className={s.dashboardCardIcon}>{Icons.workflow}</span>
                  Process Management
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <SLAStatusWidget />
                  <WorkloadWidget />
                  <BottleneckAlertWidget />
                  <AutomationWidget />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
