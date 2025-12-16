'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './users.module.css';

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
  jobTitle: string | null;
  createdAt: Date;
};

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdate = async (userId: string, field: 'role' | 'status', value: string) => {
    setLoadingId(userId);
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const payload = {
        userId,
        role: field === 'role' ? value : user.role,
        status: field === 'status' ? value : user.status,
      };

      const res = await fetch('/api/internal/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Job Title</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.userInfo}>
                  {user.image && <img src={user.image} alt="" className={styles.avatar} />}
                  <div>
                    <div className={styles.name}>{user.name || 'No Name'}</div>
                    <div className={styles.email}>{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdate(user.id, 'role', e.target.value)}
                  disabled={loadingId === user.id}
                  className={styles.select}
                >
                  <option value="viewer">Viewer</option>
                  <option value="dev">Developer</option>
                  <option value="pm">Project Manager</option>
                  <option value="qa">QA</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleUpdate(user.id, 'status', e.target.value)}
                  disabled={loadingId === user.id}
                  className={`${styles.select} ${styles[`status-${user.status}`]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </td>
              <td>{user.jobTitle || '-'}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
