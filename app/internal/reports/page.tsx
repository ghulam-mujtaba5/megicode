import { eq, sql, gte, lte, and, desc } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, invoices, payments, timeEntries, users, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

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

  // Financial metrics
  const invoiceStats = await db.select({
    total: sql<number>`COALESCE(SUM(${invoices.totalAmount}), 0)`,
    paid: sql<number>`COALESCE(SUM(${invoices.paidAmount}), 0)`,
  }).from(invoices).get();

  const payments90d = await db.select({
    total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
  }).from(payments).where(gte(payments.paidAt, ninetyDaysAgo)).get();

  // Time tracking
  const totalTime = await db.select({
    minutes: sql<number>`COALESCE(SUM(${timeEntries.minutes}), 0)`,
  }).from(timeEntries).get();

  const time30d = await db.select({
    minutes: sql<number>`COALESCE(SUM(${timeEntries.minutes}), 0)`,
  }).from(timeEntries).where(gte(timeEntries.date, thirtyDaysAgo)).get();

  // Top contributors by time
  const topContributors = await db.select({
    userId: timeEntries.userId,
    userName: users.name,
    totalMinutes: sql<number>`SUM(${timeEntries.minutes})`,
  })
  .from(timeEntries)
  .leftJoin(users, eq(timeEntries.userId, users.id))
  .groupBy(timeEntries.userId, users.name)
  .orderBy(desc(sql`SUM(${timeEntries.minutes})`))
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

  const conversionRate = totalLeads?.count ? Math.round(((convertedLeads?.count ?? 0) / totalLeads.count) * 100) : 0;
  const taskCompletionRate = totalTasks?.count ? Math.round(((doneTasks?.count ?? 0) / totalTasks.count) * 100) : 0;
  const outstandingInvoices = (invoiceStats?.total ?? 0) - (invoiceStats?.paid ?? 0);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Reports & Analytics</h1>
      </div>

      {/* KPI Overview */}
      <section className={commonStyles.card}>
        <h2>Key Performance Indicators</h2>
        <div className={commonStyles.kpiGrid}>
          <div className={commonStyles.kpiCard}>
            <div className={commonStyles.kpiValue}>{conversionRate}%</div>
            <div className={commonStyles.kpiLabel}>Lead Conversion Rate</div>
          </div>
          <div className={commonStyles.kpiCard}>
            <div className={commonStyles.kpiValue}>{taskCompletionRate}%</div>
            <div className={commonStyles.kpiLabel}>Task Completion Rate</div>
          </div>
          <div className={commonStyles.kpiCard}>
            <div className={commonStyles.kpiValue}>${((invoiceStats?.paid ?? 0) / 100).toLocaleString()}</div>
            <div className={commonStyles.kpiLabel}>Total Revenue</div>
          </div>
          <div className={commonStyles.kpiCard}>
            <div className={commonStyles.kpiValue}>${(outstandingInvoices / 100).toLocaleString()}</div>
            <div className={commonStyles.kpiLabel}>Outstanding</div>
          </div>
        </div>
      </section>

      <div className={commonStyles.grid2}>
        {/* Lead Pipeline */}
        <section className={commonStyles.card}>
          <h2>Lead Pipeline</h2>
          <table className={commonStyles.table}>
            <tbody>
              <tr><td>Total Leads</td><td><strong>{totalLeads?.count ?? 0}</strong></td></tr>
              <tr><td>New (30 days)</td><td><strong>{newLeads30d?.count ?? 0}</strong></td></tr>
              <tr><td>Converted</td><td><strong>{convertedLeads?.count ?? 0}</strong></td></tr>
              <tr><td>Rejected</td><td><strong>{rejectedLeads?.count ?? 0}</strong></td></tr>
              <tr><td>Conversion Rate</td><td><strong>{conversionRate}%</strong></td></tr>
            </tbody>
          </table>
        </section>

        {/* Project Status */}
        <section className={commonStyles.card}>
          <h2>Project Status</h2>
          <table className={commonStyles.table}>
            <tbody>
              <tr><td>Total Projects</td><td><strong>{totalProjects?.count ?? 0}</strong></td></tr>
              <tr><td>In Progress</td><td><strong>{inProgressProjects?.count ?? 0}</strong></td></tr>
              <tr><td>Closed</td><td><strong>{closedProjects?.count ?? 0}</strong></td></tr>
            </tbody>
          </table>
        </section>

        {/* Task Status */}
        <section className={commonStyles.card}>
          <h2>Task Overview</h2>
          <table className={commonStyles.table}>
            <tbody>
              <tr><td>Total Tasks</td><td><strong>{totalTasks?.count ?? 0}</strong></td></tr>
              <tr><td>Completed</td><td><strong>{doneTasks?.count ?? 0}</strong></td></tr>
              <tr><td>Blocked</td><td><strong>{blockedTasks?.count ?? 0}</strong></td></tr>
              <tr><td>Completion Rate</td><td><strong>{taskCompletionRate}%</strong></td></tr>
            </tbody>
          </table>
        </section>

        {/* Time Tracking */}
        <section className={commonStyles.card}>
          <h2>Time Tracking</h2>
          <table className={commonStyles.table}>
            <tbody>
              <tr><td>Total Time Logged</td><td><strong>{formatTime(totalTime?.minutes ?? 0)}</strong></td></tr>
              <tr><td>Last 30 Days</td><td><strong>{formatTime(time30d?.minutes ?? 0)}</strong></td></tr>
            </tbody>
          </table>
        </section>

        {/* Financials */}
        <section className={commonStyles.card}>
          <h2>Financial Summary</h2>
          <table className={commonStyles.table}>
            <tbody>
              <tr><td>Total Invoiced</td><td><strong>${((invoiceStats?.total ?? 0) / 100).toLocaleString()}</strong></td></tr>
              <tr><td>Total Paid</td><td><strong>${((invoiceStats?.paid ?? 0) / 100).toLocaleString()}</strong></td></tr>
              <tr><td>Outstanding</td><td><strong>${(outstandingInvoices / 100).toLocaleString()}</strong></td></tr>
              <tr><td>Revenue (90 days)</td><td><strong>${((payments90d?.total ?? 0) / 100).toLocaleString()}</strong></td></tr>
            </tbody>
          </table>
        </section>

        {/* Top Contributors */}
        <section className={commonStyles.card}>
          <h2>Top Contributors (by Time)</h2>
          {topContributors.length === 0 ? (
            <p className={commonStyles.muted}>No time entries yet</p>
          ) : (
            <table className={commonStyles.table}>
              <thead>
                <tr><th>User</th><th>Time Logged</th></tr>
              </thead>
              <tbody>
                {topContributors.map((c, i) => (
                  <tr key={c.userId ?? i}>
                    <td>{c.userName || 'Unknown'}</td>
                    <td>{formatTime(c.totalMinutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Activity Log */}
      <section className={commonStyles.card}>
        <h2>Recent Activity</h2>
        {recentEvents.length === 0 ? (
          <p className={commonStyles.muted}>No recent activity</p>
        ) : (
          <table className={commonStyles.table}>
            <thead>
              <tr><th>Event</th><th>User</th><th>Time</th></tr>
            </thead>
            <tbody>
              {recentEvents.map(({ event, userName }) => (
                <tr key={event.id}>
                  <td>
                    <span className={`${commonStyles.badge} ${commonStyles.badgeGray}`}>{event.type}</span>
                  </td>
                  <td>{userName || 'System'}</td>
                  <td className={commonStyles.muted}>{formatDateTime(event.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
