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
  skills: string[] | null;
  capacity: number | null;
  createdAt: Date;
  updatedAt: Date;
};

const ROLE_OPTIONS: UserRow['role'][] = ['admin', 'pm', 'dev', 'qa', 'viewer'];
const STATUS_OPTIONS: UserRow['status'][] = ['active', 'pending', 'disabled'];

const ROLE_LABELS: Record<UserRow['role'], string> = {
  admin: 'Admin',
  pm: 'Project Manager',
  dev: 'Developer',
  qa: 'QA Tester',
  viewer: 'Viewer',
};

function statusBadgeClass(status: UserRow['status']) {
  if (status === 'active') return `${s.badge} ${s.badgeSuccess}`;
  if (status === 'pending') return `${s.badge} ${s.badgeWarning}`;
  return `${s.badge} ${s.badgeError}`;
}

function roleBadgeClass(role: UserRow['role']) {
  if (role === 'admin') return `${s.badge} ${s.badgeError}`;
  if (role === 'pm') return `${s.badge} ${s.badgePrimary}`;
  if (role === 'dev') return `${s.badge} ${s.badgeInfo}`;
  if (role === 'qa') return `${s.badge} ${s.badgeWarning}`;
  return `${s.badge} ${s.badgeNeutral}`;
}

export default function UsersAdminClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [savingIds, setSavingIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Search and filter
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Selected users for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);
  
  // Create user form
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer' as UserRow['role'],
    status: 'pending' as UserRow['status'],
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => 
        u.email.toLowerCase().includes(q) || 
        (u.name && u.name.toLowerCase().includes(q))
      );
    }
    if (filterRole) {
      result = result.filter(u => u.role === filterRole);
    }
    if (filterStatus) {
      result = result.filter(u => u.status === filterStatus);
    }
    return result;
  }, [users, search, filterRole, filterStatus]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const disabled = users.filter((u) => u.status === 'disabled').length;
    return { total, active, pending, disabled };
  }, [users]);

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess(null);
    } else {
      setSuccess(msg);
      setError(null);
    }
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);
  };

  const updateLocal = (userId: string, patch: Partial<UserRow>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
  };

  // Save user changes (role/status quick update)
  const saveUser = async (userId: string, data: { role?: string; status?: string; name?: string }) => {
    setError(null);
    setSavingIds((prev) => new Set(prev).add(userId));

    try {
      const res = await fetch('/api/internal/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || `Request failed (${res.status})`);
      }

      updateLocal(userId, { ...data, updatedAt: new Date() } as Partial<UserRow>);
      showMessage('User updated successfully');
    } catch (e) {
      showMessage(e instanceof Error ? e.message : 'Failed to update user', true);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  // Create new user
  const createUser = async () => {
    if (!newUser.email) {
      showMessage('Email is required', true);
      return;
    }

    setSavingIds(prev => new Set(prev).add('creating'));
    try {
      const res = await fetch('/api/internal/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || `Request failed (${res.status})`);
      }

      const { data } = await res.json();
      setUsers(prev => [data, ...prev]);
      setShowCreateModal(false);
      setNewUser({ email: '', name: '', role: 'viewer', status: 'pending' });
      showMessage('User created successfully');
    } catch (e) {
      showMessage(e instanceof Error ? e.message : 'Failed to create user', true);
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete('creating');
        return next;
      });
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    setSavingIds(prev => new Set(prev).add(userId));
    try {
      const res = await fetch(`/api/internal/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || `Request failed (${res.status})`);
      }

      setUsers(prev => prev.filter(u => u.id !== userId));
      setShowDeleteModal(false);
      setDeletingUser(null);
      showMessage('User deleted successfully');
    } catch (e) {
      showMessage(e instanceof Error ? e.message : 'Failed to delete user', true);
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  // Bulk actions
  const bulkUpdateStatus = async (status: UserRow['status']) => {
    if (selectedIds.size === 0) return;
    
    const promises = Array.from(selectedIds).map(id => saveUser(id, { status }));
    await Promise.all(promises);
    setSelectedIds(new Set());
  };

  const toggleSelect = (userId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const openEditModal = (user: UserRow) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const saveEditingUser = async () => {
    if (!editingUser) return;
    await saveUser(editingUser.id, {
      name: editingUser.name || undefined,
      role: editingUser.role,
      status: editingUser.status,
    });
    setShowEditModal(false);
    setEditingUser(null);
  };

  return (
    <>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className={s.card} style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
          <div style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>Total Users</div>
        </div>
        <div className={s.card} style={{ padding: '16px', textAlign: 'center', borderLeft: '3px solid var(--int-success)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-success)' }}>{stats.active}</div>
          <div style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>Active</div>
        </div>
        <div className={s.card} style={{ padding: '16px', textAlign: 'center', borderLeft: '3px solid var(--int-warning)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-warning)' }}>{stats.pending}</div>
          <div style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>Pending</div>
        </div>
        <div className={s.card} style={{ padding: '16px', textAlign: 'center', borderLeft: '3px solid var(--int-error)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--int-error)' }}>{stats.disabled}</div>
          <div style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>Disabled</div>
        </div>
      </div>

      <section className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>User Management</h2>
          <button
            type="button"
            className={`${s.btn} ${s.btnPrimary}`}
            onClick={() => setShowCreateModal(true)}
          >
            + Add User
          </button>
        </div>

        <div className={s.cardBody}>
          {/* Messages */}
          {error && (
            <div style={{ padding: '12px', marginBottom: '16px', background: 'var(--int-error-light)', borderRadius: '8px', color: 'var(--int-error)' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '12px', marginBottom: '16px', background: 'var(--int-success-light)', borderRadius: '8px', color: 'var(--int-success)' }}>
              {success}
            </div>
          )}

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
            >
              <option value="">All Roles</option>
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '12px', background: 'var(--int-bg-secondary)', borderRadius: '8px', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{selectedIds.size} selected</span>
              <button className={`${s.btn} ${s.btnSm}`} onClick={() => bulkUpdateStatus('active')} style={{ marginLeft: 'auto' }}>
                Activate All
              </button>
              <button className={`${s.btn} ${s.btnSm}`} onClick={() => bulkUpdateStatus('pending')}>
                Set Pending
              </button>
              <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => bulkUpdateStatus('disabled')}>
                Disable All
              </button>
              <button className={`${s.btn} ${s.btnSecondary}`} onClick={() => setSelectedIds(new Set())}>
                Clear
              </button>
            </div>
          )}

          {/* Users Table */}
          <div className={s.tableContainer}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAll}
                    />
                  </th>
                  <th style={{ width: '280px' }}>User</th>
                  <th style={{ width: '140px' }}>Role</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '160px' }}>Created</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--int-text-muted)' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const saving = savingIds.has(u.id);
                    return (
                      <tr key={u.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(u.id)}
                            onChange={() => toggleSelect(u.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {u.image ? (
                              <img 
                                src={u.image} 
                                alt="" 
                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: '50%', 
                                background: 'var(--int-primary-light)', 
                                color: 'var(--int-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}>
                                {(u.name || u.email)[0].toUpperCase()}
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{u.name || u.email.split('@')[0]}</strong>
                              <span style={{ color: 'var(--int-text-muted)', fontSize: '0.8rem' }}>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                            value={u.role}
                            onChange={(e) => saveUser(u.id, { role: e.target.value })}
                            disabled={saving}
                            className={roleBadgeClass(u.role)}
                            style={{ border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={u.status}
                            onChange={(e) => saveUser(u.id, { status: e.target.value })}
                            disabled={saving}
                            className={statusBadgeClass(u.status)}
                            style={{ border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className={`${s.btn} ${s.btnSecondary}`}
                              onClick={() => openEditModal(u)}
                              disabled={saving}
                              title="Edit User"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={`${s.btn} ${s.btnDanger}`}
                              onClick={() => { setDeletingUser(u); setShowDeleteModal(true); }}
                              disabled={saving}
                              title="Delete User"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: '12px', color: 'var(--int-text-muted)', fontSize: '0.85rem' }}>
            Set status to <strong>active</strong> to approve a user. Users log in via Google OAuth.
          </p>
        </div>
      </section>

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className={s.card} style={{ width: '100%', maxWidth: '480px', margin: '16px' }}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Add New User</h3>
              <button className={`${s.btn} ${s.btnGhost}`} onClick={() => setShowCreateModal(false)}>X</button>
            </div>
            <div className={s.cardBody}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', marginTop: '4px' }}>
                    User will be able to log in with this email via Google OAuth
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRow['role'] }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as UserRow['status'] }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  >
                    {STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button className={`${s.btn} ${s.btnSecondary}`} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  className={`${s.btn} ${s.btnPrimary}`}
                  onClick={createUser}
                  disabled={savingIds.has('creating')}
                >
                  {savingIds.has('creating') ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className={s.card} style={{ width: '100%', maxWidth: '480px', margin: '16px' }}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Edit User</h3>
              <button className={`${s.btn} ${s.btnGhost}`} onClick={() => { setShowEditModal(false); setEditingUser(null); }}>X</button>
            </div>
            <div className={s.cardBody}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)', background: 'var(--int-bg-secondary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="John Doe"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as UserRow['role'] } : null)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, status: e.target.value as UserRow['status'] } : null)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--int-border)' }}
                  >
                    {STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button className={`${s.btn} ${s.btnSecondary}`} onClick={() => { setShowEditModal(false); setEditingUser(null); }}>
                  Cancel
                </button>
                <button
                  className={`${s.btn} ${s.btnPrimary}`}
                  onClick={saveEditingUser}
                  disabled={savingIds.has(editingUser.id)}
                >
                  {savingIds.has(editingUser.id) ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className={s.card} style={{ width: '100%', maxWidth: '400px', margin: '16px' }}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle} style={{ color: 'var(--int-error)' }}>Delete User</h3>
            </div>
            <div className={s.cardBody}>
              <p style={{ marginBottom: '16px' }}>
                Are you sure you want to delete <strong>{deletingUser.name || deletingUser.email}</strong>?
              </p>
              <p style={{ color: 'var(--int-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                This action cannot be undone. The user will lose access immediately.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className={`${s.btn} ${s.btnSecondary}`} onClick={() => { setShowDeleteModal(false); setDeletingUser(null); }}>
                  Cancel
                </button>
                <button
                  className={`${s.btn} ${s.btnDanger}`}
                  onClick={() => deleteUser(deletingUser.id)}
                  disabled={savingIds.has(deletingUser.id)}
                >
                  {savingIds.has(deletingUser.id) ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
