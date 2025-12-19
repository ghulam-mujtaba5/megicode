'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import s from '../styles.module.css';

type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

type NotificationAction = {
  label: string;
  url: string;
  style?: 'primary' | 'secondary' | 'danger';
};

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message?: string | null;
  priority: NotificationPriority;
  link?: string | null;
  isRead: boolean;
  createdAt: string; // JSON serialized
  actions?: NotificationAction[] | null;
};

type ApiResponse = {
  notifications: NotificationRow[];
  unreadCount: number;
  pagination?: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

const Icons = {
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

function badgeForPriority(priority: NotificationPriority) {
  switch (priority) {
    case 'urgent':
      return `${s.badge} ${s.badgeError}`;
    case 'high':
      return `${s.badge} ${s.badgeWarning}`;
    case 'normal':
      return `${s.badge} ${s.badgePrimary}`;
    case 'low':
    default:
      return `${s.badge} ${s.badgeDefault}`;
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationsClient() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ limit: '50' });
    if (filter === 'unread') params.set('isRead', 'false');
    return params.toString();
  }, [filter]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/notifications?${queryString}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch notifications (${res.status})`);
      const data = (await res.json()) as ApiResponse;
      setItems(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const patch = useCallback(async (body: unknown) => {
    setBusy(true);
    try {
      const res = await fetch('/api/internal/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Failed to update notifications (${res.status})`);
      await fetchList();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [fetchList]);

  const clearAll = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/internal/notifications', { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to clear notifications (${res.status})`);
      await fetchList();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [fetchList]);

  return (
    <>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>
            {Icons.bell} Notifications
            {unreadCount > 0 && (
              <span className={`${s.badge} ${s.badgePrimary}`}>{unreadCount} unread</span>
            )}
          </h1>
          <p className={s.pageSubtitle}>Review alerts, assignments, and system updates.</p>
        </div>
        <div className={s.pageActions}>
          <button
            className={`${s.btn} ${s.btnSecondary}`}
            onClick={() => void patch({ action: 'markAllRead' })}
            disabled={busy || unreadCount === 0}
          >
            Mark all read
          </button>
          <button
            className={`${s.btn} ${s.btnDanger}`}
            onClick={() => void clearAll()}
            disabled={busy || items.length === 0}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className={s.tabs} aria-label="Notification filter">
        <button
          className={`${s.tab} ${filter === 'all' ? s.tabActive : ''}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          All
        </button>
        <button
          className={`${s.tab} ${filter === 'unread' ? s.tabActive : ''}`}
          onClick={() => setFilter('unread')}
          type="button"
        >
          Unread
        </button>
      </div>

      <section className={s.card}>
        <div className={s.cardBody}>
          {loading ? (
            <div className={s.pageSubtitle}>Loading notifications…</div>
          ) : items.length === 0 ? (
            <div className={s.pageSubtitle}>
              No notifications. (This is the rare moment the internet is quiet.)
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map((n) => {
                const primaryUrl = n.link || n.actions?.[0]?.url || null;
                return (
                  <div
                    key={n.id}
                    style={{
                      border: '1px solid var(--int-border)',
                      borderRadius: 'var(--int-radius-lg)',
                      padding: 14,
                      background: n.isRead ? 'var(--int-surface)' : 'var(--int-surface-hover)',
                      display: 'grid',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span className={badgeForPriority(n.priority)}>{n.priority}</span>
                        {!n.isRead && (
                          <span className={`${s.badge} ${s.badgeInfo}`}>
                            <span className={s.badgeDot} /> unread
                          </span>
                        )}
                        <span className={s.pageSubtitle} style={{ margin: 0 }}>
                          {formatDateTime(n.createdAt)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {!n.isRead && (
                          <button
                            className={`${s.btn} ${s.btnSecondary}`}
                            style={{ padding: '8px 10px' }}
                            onClick={() => void patch({ action: 'markRead', notificationId: n.id })}
                            disabled={busy}
                            type="button"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          className={`${s.btn} ${s.btnGhost}`}
                          style={{ padding: '8px 10px' }}
                          onClick={() => void patch({ action: 'dismiss', notificationId: n.id })}
                          disabled={busy}
                          type="button"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>

                    <div style={{ fontWeight: 650 }}>{n.title}</div>
                    {n.message && (
                      <div className={s.pageSubtitle} style={{ margin: 0 }}>
                        {n.message}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                      {primaryUrl && (
                        <Link href={primaryUrl} className={`${s.btn} ${s.btnPrimary}`} style={{ padding: '8px 10px' }}>
                          Open
                        </Link>
                      )}
                      {(n.actions || []).slice(0, 3).map((a, idx) => {
                        const cls =
                          a.style === 'danger'
                            ? `${s.btn} ${s.btnDanger}`
                            : a.style === 'primary'
                              ? `${s.btn} ${s.btnPrimary}`
                              : `${s.btn} ${s.btnSecondary}`;
                        return (
                          <Link
                            key={`${n.id}-a-${idx}`}
                            href={a.url}
                            className={cls}
                            style={{ padding: '8px 10px' }}
                          >
                            {a.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
