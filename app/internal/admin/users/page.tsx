import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const ROLES = ['admin', 'pm', 'dev', 'qa', 'viewer'] as const;

// Icons
const Icons = {
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  admin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  pm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  dev: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  qa: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  roles: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

function getRoleBadgeClass(role: string) {
  switch (role) {
    case 'admin': return `${styles.badge} ${styles.badgeDanger}`;
    case 'pm': return `${styles.badge} ${styles.badgeInfo}`;
    case 'dev': return `${styles.badge} ${styles.badgeSuccess}`;
    case 'qa': return `${styles.badge} ${styles.badgeWarning}`;
    default: return `${styles.badge} ${styles.badgeDefault}`;
  }
}

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  const db = getDb();

  const usersList = await db.select().from(users).orderBy(desc(users.createdAt)).all();

  // Calculate stats
  const userStats = {
    total: usersList.length,
    admins: usersList.filter(u => u.role === 'admin').length,
    pms: usersList.filter(u => u.role === 'pm').length,
    devs: usersList.filter(u => u.role === 'dev').length,
  };

  async function updateRole(formData: FormData) {
    'use server';
    const session = await requireRole(['admin']);
    const db = getDb();

    const userId = String(formData.get('userId') ?? '').trim();
    const role = String(formData.get('role') ?? '').trim() as typeof users.$inferSelect.role;

    if (!userId || !ROLES.includes(role)) return;

    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      type: 'user.role_changed',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ userId, newRole: role }),
      createdAt: new Date(),
    });

    redirect('/internal/admin/users');
  }

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>{usersList.length}</span> users in your organization
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.users}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{userStats.total}</span>
            <span className={styles.kpiLabel}>Total Users</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiRed}`}>
          <div className={styles.kpiIcon}>{Icons.admin}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{userStats.admins}</span>
            <span className={styles.kpiLabel}>Admins</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.pm}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{userStats.pms}</span>
            <span className={styles.kpiLabel}>PMs</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.dev}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{userStats.devs}</span>
            <span className={styles.kpiLabel}>Developers</span>
          </div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* All Users */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Users</h2>
            <span className={styles.badge}>{usersList.length}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.cellMain}>{user.name || 'No name'}</div>
                      <div className={styles.cellSub}>{user.email}</div>
                    </td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                    </td>
                    <td className={styles.cellMuted}>{formatDateTime(user.createdAt)}</td>
                    <td>
                      <form action={updateRole} className={styles.inlineForm}>
                        <input type="hidden" name="userId" value={user.id} />
                        <select className={styles.selectSmall} name="role" defaultValue={user.role}>
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button className={styles.btnSmall} type="submit">Set</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Role Descriptions */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Role Permissions</h2>
            <span className={styles.cardIcon}>{Icons.roles}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr><th>ROLE</th><th>PERMISSIONS</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className={`${styles.badge} ${styles.badgeDanger}`}>admin</span></td>
                  <td className={styles.cellMuted}>Full access: manage users, approve proposals, access all data</td>
                </tr>
                <tr>
                  <td><span className={`${styles.badge} ${styles.badgeInfo}`}>pm</span></td>
                  <td className={styles.cellMuted}>Create leads, proposals, projects; manage tasks; view reports</td>
                </tr>
                <tr>
                  <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>dev</span></td>
                  <td className={styles.cellMuted}>View and update assigned tasks; log time; add comments</td>
                </tr>
                <tr>
                  <td><span className={`${styles.badge} ${styles.badgeWarning}`}>qa</span></td>
                  <td className={styles.cellMuted}>View projects and tasks; create bug reports</td>
                </tr>
                <tr>
                  <td><span className={`${styles.badge} ${styles.badgeDefault}`}>viewer</span></td>
                  <td className={styles.cellMuted}>Read-only access to projects and dashboard</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
