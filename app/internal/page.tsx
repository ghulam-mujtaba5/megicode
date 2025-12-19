import Link from 'next/link';
import { desc, eq, sql, and, lte, gte, isNotNull } from 'drizzle-orm';

import { requireActiveUser } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, processInstances, invoices, clients, milestones, users, timeEntries } from '@/lib/db/schema';
import s from './styles.module.css';
import DashboardClient, { type DashboardData, type UpcomingDeadline } from './DashboardClient';

// Icons as inline SVGs for the dashboard
const Icons = {
  leads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  projects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  workflow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  clients: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>,
  invoices: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  trendUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
  trendDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/><polyline points="17,18 23,18 23,12"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

export default async function InternalDashboardPage() {
  const session = await requireActiveUser();
  const db = getDb();
  const userId = session.user.id;
  const userRole = session.user.role ?? 'viewer';
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const todayStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // KPIs
  const [leadStats, projectStats, taskStats, instanceStats, clientStats, invoiceStats, userStats, timeStats] = await Promise.all([
    db.select({
      total: sql<number>`count(*)`,
      new: sql<number>`sum(case when status = 'new' then 1 else 0 end)`,
      inReview: sql<number>`sum(case when status = 'in_review' then 1 else 0 end)`,
      approved: sql<number>`sum(case when status = 'approved' then 1 else 0 end)`,
      converted: sql<number>`sum(case when status = 'converted' then 1 else 0 end)`,
      totalBudget: sql<number>`sum(estimated_budget)`,
    }).from(leads).get(),
    db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`sum(case when status in ('new', 'in_progress', 'in_qa') then 1 else 0 end)`,
      blocked: sql<number>`sum(case when status = 'blocked' then 1 else 0 end)`,
      delivered: sql<number>`sum(case when status = 'delivered' then 1 else 0 end)`,
    }).from(projects).get(),
    db.select({
      total: sql<number>`count(*)`,
      todo: sql<number>`sum(case when status = 'todo' then 1 else 0 end)`,
      inProgress: sql<number>`sum(case when status = 'in_progress' then 1 else 0 end)`,
      blocked: sql<number>`sum(case when status = 'blocked' then 1 else 0 end)`,
      done: sql<number>`sum(case when status = 'done' then 1 else 0 end)`,
      overdue: sql<number>`sum(case when status not in ('done', 'canceled') and due_at < ${now.getTime()} then 1 else 0 end)`,
      dueSoon: sql<number>`sum(case when status not in ('done', 'canceled') and due_at >= ${now.getTime()} and due_at <= ${in48h.getTime()} then 1 else 0 end)`,
      completedLast30Days: sql<number>`sum(case when status = 'done' and completed_at >= ${now.getTime() - 30 * 24 * 60 * 60 * 1000} then 1 else 0 end)`,
    }).from(tasks).where(userId ? eq(tasks.assignedToUserId, userId) : sql`1=1`).get(),
    db.select({
      running: sql<number>`sum(case when status = 'running' then 1 else 0 end)`,
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    }).from(processInstances).get(),
    db.select({ total: sql<number>`count(*)` }).from(clients).get(),
    db.select({
      total: sql<number>`count(*)`,
      pending: sql<number>`sum(case when status in ('draft', 'sent') then 1 else 0 end)`,
      paid: sql<number>`sum(case when status = 'paid' then 1 else 0 end)`,
      overdue: sql<number>`sum(case when status = 'overdue' then 1 else 0 end)`,
      totalBilled: sql<number>`sum(total_amount)`,
    }).from(invoices).get(),
    db.select({
      totalCapacity: sql<number>`sum(capacity)`,
    }).from(users).where(eq(users.status, 'active')).get(),
    db.select({
      totalDuration: sql<number>`sum(duration_minutes)`,
    }).from(timeEntries).where(gte(timeEntries.date, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))).get(),
  ]);

  // My tasks
  const myTasks = userId
    ? await db.select().from(tasks)
        .where(and(eq(tasks.assignedToUserId, userId), sql`status not in ('done', 'canceled')`))
        .orderBy(tasks.dueAt).limit(6).all()
    : [];

  // Recent leads (PM/Admin)
  const recentLeads = ['admin', 'pm'].includes(userRole)
    ? await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5).all()
    : [];

  // Projects needing attention
  const attentionProjects = ['admin', 'pm'].includes(userRole)
    ? await db.select().from(projects).where(sql`status in ('blocked', 'in_qa')`).orderBy(desc(projects.updatedAt)).limit(4).all()
    : [];

  // Renewal reminders - projects with contracts expiring within 30 days
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingRenewals = ['admin', 'pm'].includes(userRole)
    ? await db.select()
        .from(projects)
        .where(
          and(
            isNotNull(projects.contractRenewalAt),
            lte(projects.contractRenewalAt, thirtyDaysFromNow),
            gte(projects.contractRenewalAt, now)
          )
        )
        .orderBy(projects.contractRenewalAt)
        .limit(5)
        .all()
    : [];

  // ========== ENHANCED DASHBOARD DATA ==========
  // Upcoming deadlines (tasks + milestones + renewals)
  const upcomingTaskDeadlines = await db.select({
    id: tasks.id,
    title: tasks.title,
    dueAt: tasks.dueAt,
    projectId: tasks.projectId,
  }).from(tasks)
    .where(and(
      isNotNull(tasks.dueAt),
      gte(tasks.dueAt, now),
      sql`status not in ('done', 'canceled')`
    ))
    .orderBy(tasks.dueAt)
    .limit(10)
    .all();

  const upcomingMilestones = await db.select({
    id: milestones.id,
    title: milestones.title,
    dueAt: milestones.dueAt,
    projectId: milestones.projectId,
  }).from(milestones)
    .where(and(
      isNotNull(milestones.dueAt),
      gte(milestones.dueAt, now),
      sql`status not in ('completed', 'canceled')`
    ))
    .orderBy(milestones.dueAt)
    .limit(10)
    .all();

  // Get project names for deadlines
  const allProjects = await db.select({ id: projects.id, name: projects.name }).from(projects).all();
  const projectMap = new Map(allProjects.map(p => [p.id, p.name]));

  // Combine and sort all deadlines
  const upcomingDeadlines = [
    ...upcomingTaskDeadlines.map(t => ({
      type: 'task' as const,
      id: t.id,
      title: t.title,
      date: new Date(t.dueAt!),
      projectId: t.projectId ?? undefined,
      projectName: t.projectId ? projectMap.get(t.projectId) : undefined,
    })),
    ...upcomingMilestones.map(m => ({
      type: 'milestone' as const,
      id: m.id,
      title: m.title,
      date: new Date(m.dueAt!),
      projectId: m.projectId ?? undefined,
      projectName: m.projectId ? projectMap.get(m.projectId) : undefined,
    })),
    ...upcomingRenewals.map(p => ({
      type: 'renewal' as const,
      id: p.id,
      title: `${p.name} - Contract Renewal`,
      date: new Date(p.contractRenewalAt!),
      projectId: p.id,
      projectName: p.name,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 15);

  // Workflow stages for pipeline visualization
  const workflowStages = [
    { name: 'Request Intake', count: leadStats?.new ?? 0, avgDays: 2 },
    { name: 'Requirements Review', count: leadStats?.inReview ?? 0, avgDays: 5 },
    { name: 'Proposal/Approval', count: leadStats?.approved ?? 0, avgDays: 7 },
    { name: 'Project Setup', count: Math.floor((projectStats?.active ?? 0) * 0.2), avgDays: 3 },
    { name: 'Development/QA', count: Math.floor((projectStats?.active ?? 0) * 0.6), avgDays: 21 },
    { name: 'Delivery', count: projectStats?.delivered ?? 0, avgDays: 2 },
  ];

  // Calculate completion rate BEFORE using in dashboardData
  const taskTotal = (taskStats?.total ?? 0);
  const taskDone = (taskStats?.done ?? 0);
  const completionRate = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 0;

  // Calculate Utilization Rate
  const totalCapacityHours = (userStats?.totalCapacity ?? 0); // Weekly capacity
  const totalWorkedHours = (timeStats?.totalDuration ?? 0) / 60; // Last 7 days
  const utilizationRate = totalCapacityHours > 0 ? Math.round((totalWorkedHours / totalCapacityHours) * 100) : 0;

  // Calculate Project Velocity (Tasks completed in last 30 days)
  const projectVelocity = taskStats?.completedLast30Days ?? 0;

  // Calculate Budget Burn
  const totalBudget = (leadStats?.totalBudget ?? 0);
  const totalBilled = (invoiceStats?.totalBilled ?? 0);
  const budgetBurn = totalBudget > 0 ? Math.round((totalBilled / totalBudget) * 100) : 0;

  // Generate trend data (simulated for demo - would use actual historical data)
  const generateTrend = (base: number): number[] => {
    return Array.from({ length: 7 }, (_, i) => 
      Math.max(0, base + Math.floor((Math.random() - 0.5) * base * 0.3 * (i + 1) / 7))
    );
  };

  // Prepare enhanced dashboard data
  const dashboardData: DashboardData = {
    kpis: {
      activeProjects: projectStats?.active ?? 0,
      totalProjects: projectStats?.total ?? 0,
      blockedProjects: projectStats?.blocked ?? 0,
      openTasks: (taskStats?.todo ?? 0) + (taskStats?.inProgress ?? 0),
      inProgressTasks: taskStats?.inProgress ?? 0,
      completionRate,
      totalClients: clientStats?.total ?? 0,
      runningWorkflows: instanceStats?.running ?? 0,
      completedWorkflows: instanceStats?.completed ?? 0,
      overdueTasks: taskStats?.overdue ?? 0,
      blockedTasks: taskStats?.blocked ?? 0,
      overdueInvoices: invoiceStats?.overdue ?? 0,
      utilizationRate,
      projectVelocity,
      budgetBurn,
    },
    trends: {
      projectsTrend: generateTrend(projectStats?.active ?? 5),
      tasksTrend: generateTrend(taskStats?.total ?? 20),
      leadsTrend: generateTrend(leadStats?.total ?? 10),
      revenueTrend: generateTrend(50),
    },
    myTasks: myTasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueAt: t.dueAt ? new Date(t.dueAt) : null,
      projectName: t.projectId ? projectMap.get(t.projectId) : undefined,
    })),
    recentLeads: recentLeads.map(l => ({
      id: l.id,
      company: l.company,
      name: l.name,
      status: l.status,
      createdAt: new Date(l.createdAt),
      email: l.email ?? undefined,
    })),
    attentionProjects: attentionProjects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      priority: p.priority,
      progress: undefined, // Would calculate from tasks
      health: undefined,
      updatedAt: new Date(p.updatedAt),
    })),
    workflowStages,
    upcomingDeadlines,
  };

  // Alerts count
  const alertsCount = (taskStats?.overdue ?? 0) + (taskStats?.blocked ?? 0) + (invoiceStats?.overdue ?? 0);

  const getFirstName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      new: s.badgePrimary,
      in_review: s.badgeWarning,
      approved: s.badgeSuccess,
      converted: s.badgeSuccess,
      todo: s.badgeDefault,
      in_progress: s.badgePrimary,
      blocked: s.badgeDanger,
      done: s.badgeSuccess,
      draft: s.badgeDefault,
      sent: s.badgePrimary,
      paid: s.badgeSuccess,
      overdue: s.badgeDanger,
    };
    return map[status] || s.badgeDefault;
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, string> = {
      critical: s.badgeDanger,
      high: s.badgeWarning,
      medium: s.badgePrimary,
      low: s.badgeDefault,
    };
    return map[priority] || s.badgeDefault;
  };

  return (
    <main className={s.page}>
      {/* Header Section */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>
              Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, {getFirstName(session.user.email || 'User')}
            </h1>
            <p className={s.pageSubtitle}>{todayStr}</p>
          </div>
          <div className={s.headerActions}>
            {/* Actions removed */}
          </div>
        </div>
      </div>

      {/* Alerts Banner */}
      {alertsCount > 0 && (
        <div className={s.alertBanner}>
          <div className={s.alertBannerIcon}>{Icons.warning}</div>
          <div className={s.alertBannerContent}>
            <strong>Attention Required</strong>
            <span>
              {(taskStats?.overdue ?? 0) > 0 && `${taskStats?.overdue} overdue task(s)`}
              {(taskStats?.blocked ?? 0) > 0 && ` • ${taskStats?.blocked} blocked task(s)`}
              {(invoiceStats?.overdue ?? 0) > 0 && ` • ${invoiceStats?.overdue} overdue invoice(s)`}
            </span>
          </div>
          <Link href="/internal/tasks" className={s.alertBannerAction}>Review Now</Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className={s.kpiSection}>
        <div className={s.kpiGrid}>
          <Link href="/internal/projects" className={`${s.kpiCard} ${s.kpiCardSuccess}`}>
            <div className={s.kpiIcon}>{Icons.projects}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{projectStats?.active ?? 0}</span>
              <span className={s.kpiLabel}>Active Projects</span>
            </div>
            <div className={s.kpiMeta}>
              <span className={s.kpiMetaItem}>
                <span className={s.kpiMetaValue}>{projectStats?.total ?? 0}</span> total
              </span>
              {(projectStats?.blocked ?? 0) > 0 && (
                <span className={`${s.kpiMetaItem} ${s.kpiMetaDanger}`}>
                  <span className={s.kpiMetaValue}>{projectStats?.blocked}</span> blocked
                </span>
              )}
            </div>
            <div className={s.kpiArrow}>{Icons.arrowRight}</div>
          </Link>

          <Link href="/internal/tasks" className={`${s.kpiCard} ${s.kpiCardWarning}`}>
            <div className={s.kpiIcon}>{Icons.tasks}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{(taskStats?.todo ?? 0) + (taskStats?.inProgress ?? 0)}</span>
              <span className={s.kpiLabel}>Open Tasks</span>
            </div>
            <div className={s.kpiMeta}>
              <span className={s.kpiMetaItem}>
                <span className={s.kpiMetaValue}>{taskStats?.inProgress ?? 0}</span> in progress
              </span>
              <span className={s.kpiMetaItem}>
                <span className={s.kpiMetaValue}>{completionRate}%</span> done
              </span>
            </div>
            <div className={s.kpiArrow}>{Icons.arrowRight}</div>
          </Link>

          <Link href="/internal/clients" className={`${s.kpiCard} ${s.kpiCardInfo}`}>
            <div className={s.kpiIcon}>{Icons.clients}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{clientStats?.total ?? 0}</span>
              <span className={s.kpiLabel}>Total Clients</span>
            </div>
            <div className={s.kpiMeta}>
              <span className={s.kpiMetaItem}>Active accounts</span>
            </div>
            <div className={s.kpiArrow}>{Icons.arrowRight}</div>
          </Link>

          <Link href="/internal/process" className={`${s.kpiCard} ${s.kpiCardPurple}`}>
            <div className={s.kpiIcon}>{Icons.workflow}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{instanceStats?.running ?? 0}</span>
              <span className={s.kpiLabel}>Running Workflows</span>
            </div>
            <div className={s.kpiMeta}>
              <span className={s.kpiMetaItem}>
                <span className={s.kpiMetaValue}>{instanceStats?.completed ?? 0}</span> completed
              </span>
            </div>
            <div className={s.kpiArrow}>{Icons.arrowRight}</div>
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={s.dashboardGrid}>
        {/* My Tasks Section */}
        <section className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={s.cardIcon}>{Icons.tasks}</div>
              <h2 className={s.cardTitle}>My Tasks</h2>
              {myTasks.length > 0 && <span className={s.badge}>{myTasks.length}</span>}
            </div>
            <Link href="/internal/tasks" className={s.cardHeaderLink}>
              View All {Icons.arrowRight}
            </Link>
          </div>
          <div className={s.cardBody}>
            {myTasks.length > 0 ? (
              <div className={s.taskList}>
                {myTasks.map((t) => (
                  <Link key={t.id} href={`/internal/tasks/${t.id}`} className={s.taskItem}>
                    <div className={s.taskItemContent}>
                      <span className={`${s.badge} ${getStatusBadge(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <span className={s.taskTitle}>{t.title}</span>
                    </div>
                    <div className={s.taskItemMeta}>
                      {t.priority && (
                        <span className={`${s.badgeOutline} ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                      )}
                      {t.dueAt && (
                        <span className={s.taskDue}>
                          {Icons.calendar}
                          {new Date(t.dueAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={s.emptyState}>
                <div className={s.emptyStateIcon}>{Icons.tasks}</div>
                <p className={s.emptyStateText}>No pending tasks</p>
                <Link href="/internal/tasks" className={s.btnOutline}>
                  Browse All Tasks
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Projects Needing Attention */}
        {['admin', 'pm'].includes(userRole) && attentionProjects.length > 0 && (
          <section className={`${s.card} ${s.cardWide}`}>
            <div className={s.cardHeader}>
              <div className={s.cardHeaderLeft}>
                <div className={`${s.cardIcon} ${s.cardIconWarning}`}>{Icons.warning}</div>
                <h2 className={s.cardTitle}>Projects Needing Attention</h2>
              </div>
              <Link href="/internal/projects" className={s.cardHeaderLink}>
                View All {Icons.arrowRight}
              </Link>
            </div>
            <div className={s.cardBody}>
              <div className={s.tableContainer}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {attentionProjects.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className={s.projectName}>{p.name}</span>
                        </td>
                        <td>
                          <span className={`${s.badge} ${getStatusBadge(p.status)}`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <span className={`${s.badgeOutline} ${getPriorityBadge(p.priority)}`}>
                            {p.priority}
                          </span>
                        </td>
                        <td className={s.textMuted}>
                          {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td>
                          <Link href={`/internal/projects/${p.id}`} className={s.tableAction}>
                            Open {Icons.arrowRight}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Renewal Reminders (PM/Admin) */}
        {['admin', 'pm'].includes(userRole) && upcomingRenewals.length > 0 && (
          <section className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardHeaderLeft}>
                <div className={`${s.cardIcon} ${s.cardIconWarning}`}>{Icons.refresh}</div>
                <h2 className={s.cardTitle}>Renewal Reminders</h2>
                <span className={s.badge}>{upcomingRenewals.length}</span>
              </div>
              <Link href="/internal/projects" className={s.cardHeaderLink}>
                View All {Icons.arrowRight}
              </Link>
            </div>
            <div className={s.cardBody}>
              <div className={s.leadList}>
                {upcomingRenewals.map((p) => {
                  const daysUntil = p.contractRenewalAt 
                    ? Math.ceil((p.contractRenewalAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  const isUrgent = daysUntil <= 7;
                  
                  return (
                    <Link key={p.id} href={`/internal/projects/${p.id}`} className={s.leadItem}>
                      <div className={s.leadAvatar} style={{ background: isUrgent ? 'var(--int-error)' : 'var(--int-warning)' }}>
                        {Icons.refresh}
                      </div>
                      <div className={s.leadContent}>
                        <span className={s.leadName}>{p.name}</span>
                        <span className={s.leadCompany}>
                          {p.contractRenewalAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`${s.badge} ${isUrgent ? s.badgeDanger : s.badgeWarning}`}>
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className={`${s.card} ${s.cardQuickActions}`}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Quick Actions</h2>
          </div>
          <div className={s.cardBody}>
            <div className={s.quickActionsGrid}>
              {['admin', 'pm'].includes(userRole) && (
                <>
                  <Link href="/internal/leads/pipeline" className={s.quickActionItem}>
                    <div className={`${s.quickActionIcon} ${s.quickActionIconSuccess}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </div>
                    <span>Pipeline</span>
                  </Link>
                  <Link href="/internal/clients" className={s.quickActionItem}>
                    <div className={`${s.quickActionIcon} ${s.quickActionIconSuccess}`}>{Icons.clients}</div>
                    <span>Clients</span>
                  </Link>
                  <Link href="/internal/proposals" className={s.quickActionItem}>
                    <div className={`${s.quickActionIcon} ${s.quickActionIconInfo}`}>{Icons.invoices}</div>
                    <span>Proposals</span>
                  </Link>
                  <Link href="/internal/process/analytics" className={s.quickActionItem}>
                    <div className={`${s.quickActionIcon} ${s.quickActionIconPurple}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    </div>
                    <span>Analytics</span>
                  </Link>
                </>
              )}
              <Link href="/internal/tasks" className={s.quickActionItem}>
                <div className={`${s.quickActionIcon} ${s.quickActionIconInfo}`}>{Icons.tasks}</div>
                <span>Tasks</span>
              </Link>
              <Link href="/internal/projects" className={s.quickActionItem}>
                <div className={`${s.quickActionIcon} ${s.quickActionIconPurple}`}>{Icons.projects}</div>
                <span>Projects</span>
              </Link>
              {userRole === 'admin' && (
                <>
                  <Link href="/internal/admin/users" className={s.quickActionItem}>
                    <div className={`${s.quickActionIcon} ${s.quickActionIconPrimary}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <span>Users</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Interactive Dashboard */}
      <section className={s.enhancedDashboardSection}>
        <div className={s.sectionHeader}>
          <h2>Interactive Dashboard</h2>
          <p className={s.sectionSubtitle}>Comprehensive view with sparklines and workflow insights</p>
        </div>
        <DashboardClient 
          data={dashboardData}
          userName={getFirstName(session.user.email || 'User')}
          userRole={userRole}
        />
      </section>
    </main>
  );
}

