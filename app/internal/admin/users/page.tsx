import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const ROLES = ['admin', 'pm', 'dev', 'qa', 'viewer'] as const;

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  const db = getDb();

  const usersList = await db.select().from(users).orderBy(desc(users.createdAt)).all();

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



  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return commonStyles.badgeRed;
      case 'pm': return commonStyles.badgeBlue;
      case 'dev': return commonStyles.badgeGreen;
      case 'qa': return commonStyles.badgeYellow;
      default: return commonStyles.badgeGray;
    }
  };

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>User Management</h1>
        <span className={commonStyles.muted}>Total: {usersList.length}</span>
      </div>

      <section className={commonStyles.card}>
        <h2>All Users</h2>
        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user.id}>
                <td>
                  <div>{user.name || 'No name'}</div>
                  <div className={commonStyles.muted}>{user.email}</div>
                </td>
                <td>
                  <span className={`${commonStyles.badge} ${roleColor(user.role)}`}>{user.role}</span>
                </td>
                <td>{formatDateTime(user.createdAt)}</td>
                <td>
                  <form action={updateRole} style={{ display: 'flex', gap: 4 }}>
                    <input type="hidden" name="userId" value={user.id} />
                    <select className={commonStyles.select} name="role" defaultValue={user.role} style={{ fontSize: '0.85rem', padding: '4px 8px' }}>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button className={commonStyles.secondaryButton} type="submit" style={{ marginLeft: 4, padding: '4px 8px', fontSize: '0.85rem' }}>Set</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={commonStyles.card}>
        <h2>Role Descriptions</h2>
        <table className={commonStyles.table}>
          <thead>
            <tr><th>Role</th><th>Permissions</th></tr>
          </thead>
          <tbody>
            <tr><td><span className={`${commonStyles.badge} ${commonStyles.badgeRed}`}>admin</span></td><td>Full access: manage users, approve proposals, access all data</td></tr>
            <tr><td><span className={`${commonStyles.badge} ${commonStyles.badgeBlue}`}>pm</span></td><td>Create leads, proposals, projects; manage tasks; view reports</td></tr>
            <tr><td><span className={`${commonStyles.badge} ${commonStyles.badgeGreen}`}>dev</span></td><td>View and update assigned tasks; log time; add comments</td></tr>
            <tr><td><span className={`${commonStyles.badge} ${commonStyles.badgeYellow}`}>qa</span></td><td>View projects and tasks; create bug reports</td></tr>
            <tr><td><span className={`${commonStyles.badge} ${commonStyles.badgeGray}`}>viewer</span></td><td>Read-only access to projects and dashboard</td></tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
