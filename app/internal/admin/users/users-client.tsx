'use client';

import { useMemo, useState } from 'react';

import s from '../../styles.module.css';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'admin' | 'pm' | 'dev' | 'qa' | 'viewer';
  status: 'active' | 'pending' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
};

const ROLE_OPTIONS: UserRow['role'][] = ['admin', 'pm', 'dev', 'qa', 'viewer'];
const STATUS_OPTIONS: UserRow['status'][] = ['active', 'pending', 'disabled'];

function statusBadgeClass(status: UserRow['status']) {
  if (status === 'active') return `${s.badge} ${s.badgeSuccess}`;
  if (status === 'pending') return `${s.badge} ${s.badgeWarning}`;
  return `${s.badge} ${s.badgeError}`;
}

export default function UsersAdminClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [savingIds, setSavingIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const disabled = users.filter((u) => u.status === 'disabled').length;
    return { total, active, pending, disabled };
  }, [users]);

  const updateLocal = (userId: string, patch: Partial<UserRow>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
  };

  const saveUser = async (userId: string) => {
    setError(null);
    setSavingIds((prev) => new Set(prev).add(userId));

    try {
      const u = users.find((x) => x.id === userId);
      if (!u) return;

      const res = await fetch('/api/internal/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role: u.role,
          status: u.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      // Update updatedAt locally for a nicer UX.
      updateLocal(userId, { updatedAt: new Date() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update user');
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <section className={s.card}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>User Directory</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className={`${s.badge} ${s.badgeInfo}`}>Total: {stats.total}</span>
          <span className={`${s.badge} ${s.badgeSuccess}`}>Active: {stats.active}</span>
          <span className={`${s.badge} ${s.badgeWarning}`}>Pending: {stats.pending}</span>
          <span className={`${s.badge} ${s.badgeError}`}>Disabled: {stats.disabled}</span>
        </div>
      </div>

      <div className={s.cardBody}>
        {error && (
          <div className={s.card} style={{ padding: '12px', marginBottom: '12px', borderColor: 'var(--int-error)' }}>
            <strong style={{ color: 'var(--int-error)' }}>Error:</strong> {error}
          </div>
        )}

        <div className={s.tableContainer}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: '280px' }}>User</th>
                <th style={{ width: '120px' }}>Role</th>
                <th style={{ width: '140px' }}>Status</th>
                <th style={{ width: '200px' }}>Updated</th>
                <th style={{ width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const saving = savingIds.has(u.id);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>{u.name || u.email.split('@')[0]}</strong>
                        <span style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateLocal(u.id, { role: e.target.value as UserRow['role'] })}
                        disabled={saving}
                        style={{ width: '100%' }}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span className={statusBadgeClass(u.status)}>{u.status}</span>
                        <select
                          value={u.status}
                          onChange={(e) => updateLocal(u.id, { status: e.target.value as UserRow['status'] })}
                          disabled={saving}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--int-text-muted)' }}>
                      {new Date(u.updatedAt).toLocaleString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={s.button}
                        onClick={() => saveUser(u.id)}
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '12px', color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>
          Tip: set status to <strong>active</strong> to approve a user. Non-admin users with status
          not active are redirected to onboarding.
        </p>
      </div>
    </section>
  );
}
