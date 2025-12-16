import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import s from '../../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { events, users } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default async function AuditLogPage() {
  await requireRole(['admin']);
  const db = getDb();

  const auditLogs = await db
    .select({
      event: events,
      actor: users,
    })
    .from(events)
    .leftJoin(users, eq(events.actorUserId, users.id))
    .orderBy(desc(events.createdAt))
    .limit(100)
    .all();

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Audit Log</h1>
          <p className={s.pageSubtitle}>System-wide activity tracking (Last 100 events)</p>
        </div>
      </div>

      <section className={s.card} style={{ margin: '0 24px' }}>
        <div className={s.tableContainer}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Actor</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(({ event, actor }) => (
                <tr key={event.id}>
                  <td style={{ whiteSpace: 'nowrap', width: '180px' }}>
                    {formatDateTime(event.createdAt)}
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      background: 'var(--int-surface-muted)', 
                      padding: '0.2rem 0.4rem', 
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {event.type}
                    </span>
                  </td>
                  <td>
                    {actor ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {actor.image ? (
                          <img src={actor.image} alt={actor.name || ''} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                        ) : (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--int-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {Icons.user}
                          </div>
                        )}
                        <span>{actor.name || actor.email}</span>
                      </div>
                    ) : (
                      <span className={s.textMuted}>System / Unknown</span>
                    )}
                  </td>
                  <td>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--int-text-muted)', 
                      maxWidth: '400px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {event.payloadJson}
                    </div>
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className={s.emptyState}>
                    <div className={s.emptyStateIcon}>{Icons.activity}</div>
                    <p className={s.emptyStateText}>No activity recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
