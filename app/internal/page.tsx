import Link from 'next/link';
import { desc, eq, sql, and } from 'drizzle-orm';

import { requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, projects, tasks, processInstances } from '@/lib/db/schema';
import commonStyles from './internalCommon.module.css';
import styles from './internal.module.css';

function KPICard({ label, value, href, color }: { label: string; value: number | string; href?: string; color?: string }) {
  const content = (
    <div className={styles.kpiCard} style={{ borderLeftColor: color || '#4573df' }}>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function InternalDashboardPage() {
  const session = await requireInternalSession();
  const db = getDb();
  const userId = session.user.id;
  const userRole = session.user.role ?? 'viewer';
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // KPIs
  const [leadStats, projectStats, taskStats, instanceStats] = await Promise.all([
    db.select({
      total: sql<number>`count(*)`,
      new: sql<number>`sum(case when status = 'new' then 1 else 0 end)`,
      inReview: sql<number>`sum(case when status = 'in_review' then 1 else 0 end)`,
      approved: sql<number>`sum(case when status = 'approved' then 1 else 0 end)`,
      converted: sql<number>`sum(case when status = 'converted' then 1 else 0 end)`,
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
      overdue: sql<number>`sum(case when status not in ('done', 'canceled') and due_at < ${now.getTime()} then 1 else 0 end)`,
      dueSoon: sql<number>`sum(case when status not in ('done', 'canceled') and due_at >= ${now.getTime()} and due_at <= ${in48h.getTime()} then 1 else 0 end)`,
    }).from(tasks).where(userId ? eq(tasks.assignedToUserId, userId) : sql`1=1`).get(),
    db.select({
      running: sql<number>`sum(case when status = 'running' then 1 else 0 end)`,
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    }).from(processInstances).get(),
  ]);

  // My tasks
  const myTasks = userId
    ? await db.select().from(tasks)
        .where(and(eq(tasks.assignedToUserId, userId), sql`status not in ('done', 'canceled')`))
        .orderBy(tasks.dueAt).limit(10).all()
    : [];

  // Recent leads (PM/Admin)
  const recentLeads = ['admin', 'pm'].includes(userRole)
    ? await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5).all()
    : [];

  // Projects needing attention
  const attentionProjects = ['admin', 'pm'].includes(userRole)
    ? await db.select().from(projects).where(sql`status in ('blocked', 'in_qa')`).orderBy(desc(projects.updatedAt)).limit(5).all()
    : [];

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Dashboard</h1>
        <span className={commonStyles.muted}>Welcome, {session.user.email}</span>
      </div>

      {/* KPI Grid */}
      <section className={styles.kpiGrid}>
        <KPICard label="New Leads" value={leadStats?.new ?? 0} href="/internal/leads?status=new" color="#6ea8ff" />
        <KPICard label="In Review" value={leadStats?.inReview ?? 0} href="/internal/leads?status=in_review" color="#fbbf24" />
        <KPICard label="Approved" value={leadStats?.approved ?? 0} href="/internal/leads?status=approved" color="#10b981" />
        <KPICard label="Active Projects" value={projectStats?.active ?? 0} href="/internal/projects" color="#4573df" />
        <KPICard label="Blocked" value={projectStats?.blocked ?? 0} href="/internal/projects?status=blocked" color="#ef4444" />
        <KPICard label="Running Instances" value={instanceStats?.running ?? 0} href="/internal/instances" color="#8b5cf6" />
      </section>

      {/* Alerts */}
      {((taskStats?.overdue ?? 0) > 0 || (taskStats?.blocked ?? 0) > 0) && (
        <section className={`${commonStyles.card} ${styles.alertCard}`}>
          <h2>⚠️ Alerts</h2>
          <div className={styles.alertGrid}>
            {(taskStats?.overdue ?? 0) > 0 && (
              <div className={styles.alertItem} style={{ borderColor: '#ef4444' }}>
                <strong>{taskStats?.overdue}</strong> overdue task(s)
              </div>
            )}
            {(taskStats?.blocked ?? 0) > 0 && (
              <div className={styles.alertItem} style={{ borderColor: '#fbbf24' }}>
                <strong>{taskStats?.blocked}</strong> blocked task(s)
              </div>
            )}
            {(taskStats?.dueSoon ?? 0) > 0 && (
              <div className={styles.alertItem} style={{ borderColor: '#6ea8ff' }}>
                <strong>{taskStats?.dueSoon}</strong> task(s) due in 48h
              </div>
            )}
          </div>
        </section>
      )}

      <div className={commonStyles.grid2}>
        {/* My Tasks */}
        <section className={commonStyles.card}>
          <div className={commonStyles.row}>
            <h2>My Tasks</h2>
            <Link href="/internal/tasks">View all</Link>
          </div>
          {myTasks.length > 0 ? (
            <ul className={styles.taskList}>
              {myTasks.map((t) => (
                <li key={t.id} className={styles.taskItem}>
                  <span className={`${commonStyles.badge} ${t.status === 'blocked' ? commonStyles.badgeYellow : t.status === 'in_progress' ? commonStyles.badgeBlue : commonStyles.badgeGray}`}>
                    {t.status}
                  </span>
                  <Link href={`/internal/tasks/${t.id}`}>{t.title}</Link>
                  {t.dueAt && <span className={commonStyles.muted}>{new Date(t.dueAt).toLocaleDateString()}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className={commonStyles.muted}>No pending tasks</p>
          )}
        </section>

        {/* Recent Leads (PM/Admin) */}
        {['admin', 'pm'].includes(userRole) && (
          <section className={commonStyles.card}>
            <div className={commonStyles.row}>
              <h2>Recent Leads</h2>
              <Link href="/internal/leads">View all</Link>
            </div>
            {recentLeads.length > 0 ? (
              <ul className={styles.taskList}>
                {recentLeads.map((l) => (
                  <li key={l.id} className={styles.taskItem}>
                    <span className={`${commonStyles.badge} ${l.status === 'new' ? commonStyles.badgeBlue : l.status === 'approved' ? commonStyles.badgeGreen : commonStyles.badgeGray}`}>
                      {l.status}
                    </span>
                    <Link href={`/internal/leads/${l.id}`}>{l.name}</Link>
                    <span className={commonStyles.muted}>{l.company || ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={commonStyles.muted}>No leads yet</p>
            )}
          </section>
        )}
      </div>

      {/* Projects Needing Attention */}
      {['admin', 'pm'].includes(userRole) && attentionProjects.length > 0 && (
        <section className={commonStyles.card}>
          <h2>Projects Needing Attention</h2>
          <table className={commonStyles.table}>
            <thead><tr><th>Project</th><th>Status</th><th>Priority</th><th></th></tr></thead>
            <tbody>
              {attentionProjects.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><span className={`${commonStyles.badge} ${p.status === 'blocked' ? commonStyles.badgeYellow : commonStyles.badgeBlue}`}>{p.status}</span></td>
                  <td>{p.priority}</td>
                  <td><Link href={`/internal/projects/${p.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Quick Actions */}
      <section className={commonStyles.card}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActions}>
          {['admin', 'pm'].includes(userRole) && (
            <>
              <Link href="/internal/leads" className={commonStyles.button}>+ New Lead</Link>
              <Link href="/internal/clients" className={commonStyles.secondaryButton}>Clients</Link>
              <Link href="/internal/proposals" className={commonStyles.secondaryButton}>Proposals</Link>
            </>
          )}
          <Link href="/internal/tasks" className={commonStyles.secondaryButton}>My Tasks</Link>
          <Link href="/internal/projects" className={commonStyles.secondaryButton}>Projects</Link>
          {userRole === 'admin' && (
            <>
              <Link href="/internal/admin/users" className={commonStyles.secondaryButton}>Users</Link>
              <Link href="/internal/invoices" className={commonStyles.secondaryButton}>Invoices</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

