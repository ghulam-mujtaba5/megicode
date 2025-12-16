import Link from 'next/link';
import { eq, sql, gte, lte, and, desc } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, invoices, payments, timeEntries, users, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

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

  // Project Profitability (Budget vs Actuals)
  const allProjects = await db.select().from(projects).all();
  const projectStats = await Promise.all(allProjects.map(async (p) => {
    const entries = await db.select().from(timeEntries).where(eq(timeEntries.projectId, p.id)).all();
    const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
    const totalHours = totalMinutes / 60;
    const estimatedCost = totalHours * 100; // $100/hr internal cost assumption
    
    const projectInvoices = await db.select().from(invoices).where(eq(invoices.projectId, p.id)).all();
    const totalInvoiced = projectInvoices.reduce((sum, i) => sum + i.amount, 0); // in cents
    
    return {
      ...p,
      totalHours,
      estimatedCost: estimatedCost * 100, // convert to cents
      totalInvoiced,
      profit: totalInvoiced - (estimatedCost * 100)
    };
  }));

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

        {/* Time Tracking */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Time Tracking</h2>
            <span className={styles.cardIcon}>{Icons.time}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr><td className={styles.cellMain}>Total Time Logged</td><td className={styles.cellValue}>{formatTime(totalTime?.minutes ?? 0)}</td></tr>
                <tr><td className={styles.cellMain}>Last 30 Days</td><td className={styles.cellValue}>{formatTime(time30d?.minutes ?? 0)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Financials */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Financial Summary</h2>
            <span className={styles.cardIcon}>{Icons.money}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                <tr><td className={styles.cellMain}>Total Invoiced</td><td className={styles.cellValue}>${((invoiceStats?.total ?? 0) / 100).toLocaleString()}</td></tr>
                <tr><td className={styles.cellMain}>Total Paid</td><td className={styles.cellValue}>${((invoiceStats?.paid ?? 0) / 100).toLocaleString()}</td></tr>
                <tr><td className={styles.cellMain}>Outstanding</td><td className={styles.cellValue}>${(outstandingInvoices / 100).toLocaleString()}</td></tr>
                <tr><td className={styles.cellMain}>Revenue (90 days)</td><td className={styles.cellValue}>${((payments90d?.total ?? 0) / 100).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Project Profitability */}
        <section className={styles.card} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <span style={{ marginRight: '8px', color: 'var(--int-secondary)' }}>{Icons.barChart}</span>
              Project Profitability
            </h2>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th style={{ textAlign: 'right' }}>Hours</th>
                    <th style={{ textAlign: 'right' }}>Invoiced</th>
                    <th style={{ textAlign: 'right' }}>Est. Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {projectStats.map((p) => (
                    <tr key={p.id}>
                      <td><Link href={`/internal/projects/${p.id}`} className={styles.link}>{p.name}</Link></td>
                      <td style={{ textAlign: 'right' }}>{p.totalHours.toFixed(1)}</td>
                      <td style={{ textAlign: 'right' }}>${(p.totalInvoiced / 100).toLocaleString()}</td>
                      <td style={{ textAlign: 'right', color: p.profit >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                        ${(p.profit / 100).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Contributors</h2>
            <span className={styles.cardIcon}>{Icons.users}</span>
          </div>
          {topContributors.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No time entries yet</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr><th>USER</th><th>TIME LOGGED</th></tr>
                </thead>
                <tbody>
                  {topContributors.map((c, i) => (
                    <tr key={c.userId ?? i}>
                      <td className={styles.cellMain}>{c.userName || 'Unknown'}</td>
                      <td className={styles.cellValue}>{formatTime(c.totalMinutes)}</td>
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
