import Link from 'next/link';
import { eq, sql, gte, lte, and, desc } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, users, events, processInstances, milestones, invoices } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';
import ReportsClient from './ReportsClient';
import ProcessAnalyticsClient from './ProcessAnalyticsClient';

// Icons
const Icons = {
  reports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  conversion: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  tasks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  revenue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  outstanding: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  leads: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  time: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  money: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  barChart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
};

export default async function ReportsPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Lead metrics
  const totalLeads = await db.select({ count: sql<number>`count(*)` }).from(leads).get();
  const newLeads30d = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, thirtyDaysAgo)).get();
  const convertedLeads = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'converted')).get();
  const rejectedLeads = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'rejected')).get();

  // Project metrics
  const totalProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).get();
  const inProgressProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'in_progress')).get();
  const closedProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'closed')).get();

  // Task metrics
  const totalTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).get();
  const doneTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.status, 'done')).get();
  const blockedTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.status, 'blocked')).get();

  // Process Instance Metrics (BPMN Workflow)
  const allInstances = await db.select().from(processInstances).all();
  const runningInstances = allInstances.filter(i => i.status === 'running').length;
  const completedInstances = allInstances.filter(i => i.status === 'completed');
  const canceledInstances = allInstances.filter(i => i.status === 'canceled').length;
  
  // Calculate average cycle time for completed instances
  const completedWithDuration = completedInstances.filter(i => i.startedAt && i.endedAt);
  const avgCycleTime = completedWithDuration.length > 0
    ? Math.round(completedWithDuration.reduce((sum, i) => {
        const start = new Date(i.startedAt!);
        const end = new Date(i.endedAt!);
        return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / completedWithDuration.length)
    : 0;

  // Throughput: completed instances in the last 30 days
  const completedLast30 = completedInstances.filter(i => {
    if (!i.endedAt) return false;
    const endDate = new Date(i.endedAt);
    return endDate >= thirtyDaysAgo;
  }).length;

  // Milestone metrics
  const allMilestones = await db.select().from(milestones).all();
  const completedMilestones = allMilestones.filter(m => m.completedAt !== null).length;
  const overdueMilestones = allMilestones.filter(m => {
    if (m.completedAt) return false;
    if (!m.dueAt) return false;
    return new Date(m.dueAt) < now;
  }).length;
  const onTimeMilestones = allMilestones.filter(m => {
    if (!m.completedAt) return false;
    if (!m.dueAt || !m.completedAt) return false;
    return new Date(m.completedAt) <= new Date(m.dueAt);
  }).length;

  // Task statistics by status
  const todoTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.status, 'todo')).get();
  const inProgressTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.status, 'in_progress')).get();
  const completedTasks30d = await db.select({ count: sql<number>`count(*)` }).from(tasks)
    .where(and(eq(tasks.status, 'done'), gte(tasks.updatedAt, thirtyDaysAgo))).get();
  const overdueTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks)
    .where(and(sql`${tasks.status} != 'done'`, sql`${tasks.dueAt} < datetime('now')`)).get();

  // Lead statistics by status
  const newLeadsStatus = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'new')).get();
  const inReviewLeads = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'in_review')).get();
  const approvedLeads = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'approved')).get();

  // Project statuses
  const blockedProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'blocked')).get();
  const inQaProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'in_qa')).get();
  const deliveredProjects = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'closed')).get();
  // Project Statistics
  const allProjects = await db.select().from(projects).all();
  const projectStatsProfit = await Promise.all(allProjects.map(async (p) => {
    const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, p.id)).all();
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    const totalProjectTasks = projectTasks.length;
    
    return {
      ...p,
      totalTasks: totalProjectTasks,
      completedTasks,
      totalInvoiced: 0,
    };
  }));

  // Recently completed process instances for the table
  const recentCompletedInstances = completedInstances
    .filter(i => i.endedAt)
    .sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime())
    .slice(0, 5)
    .map(instance => {
      const project = allProjects.find(p => p.id === instance.projectId);
      const cycleTime = instance.startedAt && instance.endedAt
        ? Math.round((new Date(instance.endedAt).getTime() - new Date(instance.startedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        id: instance.id,
        projectName: project?.name || 'Unknown Project',
        cycleTime,
        startedAt: instance.startedAt ? new Date(instance.startedAt) : new Date(),
        endedAt: instance.endedAt ? new Date(instance.endedAt) : null,
      };
    });

  // Calculate rates before using them
  const conversionRate = totalLeads?.count ? Math.round(((convertedLeads?.count ?? 0) / totalLeads.count) * 100) : 0;
  const taskCompletionRate = totalTasks?.count ? Math.round(((doneTasks?.count ?? 0) / totalTasks.count) * 100) : 0;

  // Calculate on-time delivery rate
  const onTimeDeliveryRate = allMilestones.length > 0
    ? Math.round((onTimeMilestones / Math.max(completedMilestones, 1)) * 100)
    : 100;

  // Calculate overdue items total
  const totalOverdueItems = (overdueTasks?.count ?? 0) + overdueMilestones;

  // Prepare process analytics data
  const processAnalyticsData = {
    kpis: {
      leadConversionRate: conversionRate,
      taskCompletionRate,
      onTimeDeliveryRate,
      avgCycleTime,
      throughput: completedLast30,
      activeProjects: inProgressProjects?.count ?? 0,
      runningInstances,
      overdueItems: totalOverdueItems,
    },
    leadStats: {
      total: totalLeads?.count ?? 0,
      new: newLeadsStatus?.count ?? 0,
      inReview: inReviewLeads?.count ?? 0,
      approved: approvedLeads?.count ?? 0,
      converted: convertedLeads?.count ?? 0,
      rejected: rejectedLeads?.count ?? 0,
      last30Days: newLeads30d?.count ?? 0,
    },
    projectStats: {
      total: totalProjects?.count ?? 0,
      active: inProgressProjects?.count ?? 0,
      blocked: blockedProjects?.count ?? 0,
      delivered: deliveredProjects?.count ?? 0,
      inQa: inQaProjects?.count ?? 0,
    },
    taskStats: {
      total: totalTasks?.count ?? 0,
      todo: todoTasks?.count ?? 0,
      inProgress: inProgressTasks?.count ?? 0,
      blocked: blockedTasks?.count ?? 0,
      done: doneTasks?.count ?? 0,
      overdue: overdueTasks?.count ?? 0,
      completedLast30: completedTasks30d?.count ?? 0,
    },
    instanceStats: {
      total: allInstances.length,
      running: runningInstances,
      completed: completedInstances.length,
      canceled: canceledInstances,
      avgDuration: avgCycleTime,
    },
    milestoneStats: {
      total: allMilestones.length,
      completed: completedMilestones,
      onTime: onTimeMilestones,
      overdue: overdueMilestones,
    },
    tasksByStatus: [
      { status: 'todo', count: todoTasks?.count ?? 0 },
      { status: 'in_progress', count: inProgressTasks?.count ?? 0 },
      { status: 'blocked', count: blockedTasks?.count ?? 0 },
      { status: 'done', count: doneTasks?.count ?? 0 },
    ],
    leadConversionData: [], // Would need monthly aggregation
    recentCompletedInstances,
  };

  // Top contributors by task completion
  const topContributors = await db.select({
    userId: tasks.assignedToUserId,
    userName: users.name,
    completedTasks: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'done' THEN 1 END)`,
  })
  .from(tasks)
  .leftJoin(users, eq(tasks.assignedToUserId, users.id))
  .where(sql`${tasks.assignedToUserId} IS NOT NULL`)
  .groupBy(tasks.assignedToUserId, users.name)
  .orderBy(desc(sql`COUNT(CASE WHEN ${tasks.status} = 'done' THEN 1 END)`))
  .limit(5)
  .all();

  // Recent activity
  const recentEvents = await db.select({
    event: events,
    userName: users.name,
  })
  .from(events)
  .leftJoin(users, eq(events.actorUserId, users.id))
  .orderBy(desc(events.createdAt))
  .limit(20)
  .all();

  // Invoice stats - calculate from actual invoices table
  const paidInvoices = await db.select({ sum: sql<number>`COALESCE(SUM(total_amount), 0)` }).from(invoices).where(eq(invoices.status, 'paid')).get();
  const allInvoicesTotal = await db.select({ sum: sql<number>`COALESCE(SUM(total_amount), 0)` }).from(invoices).get();
  const invoiceStats = { paid: paidInvoices?.sum ?? 0, total: allInvoicesTotal?.sum ?? 0 };
  const outstandingInvoices = (invoiceStats?.total ?? 0) - (invoiceStats?.paid ?? 0);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reports & Analytics</h1>
          <p className={styles.pageSubtitle}>
            Overview of your business metrics and performance indicators
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.conversion}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{conversionRate}%</span>
            <span className={styles.kpiLabel}>Lead Conversion</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.tasks}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{taskCompletionRate}%</span>
            <span className={styles.kpiLabel}>Task Completion</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.revenue}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>${((invoiceStats?.paid ?? 0) / 100).toLocaleString()}</span>
            <span className={styles.kpiLabel}>Total Revenue</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.outstanding}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>${(outstandingInvoices / 100).toLocaleString()}</span>
            <span className={styles.kpiLabel}>Outstanding</span>
          </div>
        </div>
      </div>

      {/* BPMN Process Analytics - Full Width Section */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Process Analytics (BPMN Workflow)</h2>
          <span className={styles.cardIcon}>{Icons.barChart}</span>
        </div>
        <div className={styles.cardBody} style={{ padding: '1.5rem' }}>
          <ProcessAnalyticsClient data={processAnalyticsData} />
        </div>
      </section>

      <div className={styles.twoColumnGrid}>
        {/* Lead Pipeline */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Lead Pipeline</h2>
            <span className={styles.cardIcon}>{Icons.leads}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr><td className={styles.cellMain}>Total Leads</td><td className={styles.cellValue}>{totalLeads?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>New (30 days)</td><td className={styles.cellValue}>{newLeads30d?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Converted</td><td className={styles.cellValue}>{convertedLeads?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Rejected</td><td className={styles.cellValue}>{rejectedLeads?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Conversion Rate</td><td className={styles.cellValue}>{conversionRate}%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Project Status */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Project Status</h2>
            <span className={styles.cardIcon}>{Icons.projects}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr><td className={styles.cellMain}>Total Projects</td><td className={styles.cellValue}>{totalProjects?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>In Progress</td><td className={styles.cellValue}>{inProgressProjects?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Closed</td><td className={styles.cellValue}>{closedProjects?.count ?? 0}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Task Status */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Task Overview</h2>
            <span className={styles.cardIcon}>{Icons.tasks}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr><td className={styles.cellMain}>Total Tasks</td><td className={styles.cellValue}>{totalTasks?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Completed</td><td className={styles.cellValue}>{doneTasks?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Blocked</td><td className={styles.cellValue}>{blockedTasks?.count ?? 0}</td></tr>
                <tr><td className={styles.cellMain}>Completion Rate</td><td className={styles.cellValue}>{taskCompletionRate}%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Project Profitability */}
        <ReportsClient projects={projectStatsProfit} />

        {/* Top Task Completers */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Task Completers</h2>
            <span className={styles.cardIcon}>{Icons.users}</span>
          </div>
          {topContributors.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No completed tasks yet</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr><th>USER</th><th>COMPLETED TASKS</th></tr>
                </thead>
                <tbody>
                  {topContributors.map((c, i) => (
                    <tr key={c.userId ?? i}>
                      <td className={styles.cellMain}>{c.userName || 'Unknown'}</td>
                      <td className={styles.cellValue}>{c.completedTasks ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Activity Log */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
          <span className={styles.cardIcon}>{Icons.activity}</span>
        </div>
        {recentEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr><th>EVENT</th><th>USER</th><th>TIME</th></tr>
              </thead>
              <tbody>
                {recentEvents.map(({ event, userName }) => (
                  <tr key={event.id}>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeDefault}`}>{event.type}</span>
                    </td>
                    <td className={styles.cellMain}>{userName || 'System'}</td>
                    <td className={styles.cellMuted}>{formatDateTime(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
