import Link from 'next/link';
import { desc, eq, sql, notInArray } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { users, tasks } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
};

export default async function TeamPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const teamStats = await db
    .select({
      user: users,
      activeTaskCount: sql<number>`count(case when ${tasks.status} not in ('done', 'canceled') then 1 else null end)`,
      completedTaskCount: sql<number>`count(case when ${tasks.status} = 'done' then 1 else null end)`,
    })
    .from(users)
    .leftJoin(tasks, eq(users.id, tasks.assigneeId))
    .groupBy(users.id)
    .orderBy(desc(sql`count(case when ${tasks.status} not in ('done', 'canceled') then 1 else null end)`))
    .all();

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Team Workload</h1>
          <p className={s.pageSubtitle}>Overview of team members and their active tasks</p>
        </div>
      </div>

      <div className={s.gridAuto}>
        {teamStats.map(({ user, activeTaskCount, completedTaskCount }) => (
          <div key={user.id} className={s.card} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {user.image ? (
                <img src={user.image} alt={user.name || ''} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--int-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--int-text-muted)' }}>
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{user.name || 'Unknown'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--int-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {Icons.mail}
                  <span>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--int-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  <span style={{ 
                    background: 'var(--int-surface-muted)', 
                    padding: '0.1rem 0.5rem', 
                    borderRadius: '4px', 
                    textTransform: 'uppercase', 
                    fontSize: '0.75rem', 
                    fontWeight: 600 
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--int-border)', paddingTop: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-primary)' }}>{activeTaskCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>Active Tasks</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-success)' }}>{completedTaskCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>Completed</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
