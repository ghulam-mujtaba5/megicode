'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

// Icons
const Icons = {
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
};

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
}

interface TaskStats {
  total: number;
  inProgress: number;
  blocked: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ResourcesClientProps {
  users: Array<User & { taskStats: TaskStats; tasks: Task[]; projectCount: number; workloadLevel: string; workloadColor: string; roleBg: string; roleColor: string }>;
}

export default function ResourcesClient({ users }: ResourcesClientProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      blocked: '#ef4444',
      done: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {users.map((user) => (
        <div key={user.id} className={s.card}>
          <button
            onClick={() => toggleUser(user.id)}
            className={s.cardHeader}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '1rem',
              borderLeftWidth: '4px',
              borderLeftStyle: 'solid',
              borderLeftColor: user.workloadColor,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'var(--int-bg-alt)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}>
                {(user.name || user.email).substring(0, 2).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {user.name || user.email.split('@')[0]}
                  <span
                    className={s.badge}
                    style={{ marginLeft: '0.5rem', background: user.roleBg, color: user.roleColor, fontSize: '0.625rem' }}
                  >
                    {user.role || 'viewer'}
                  </span>
                </div>
                <div className={s.textMuted} style={{ fontSize: '0.75rem' }}>{user.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.taskStats.total}</div>
                  <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Tasks</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '14px', height: '14px', opacity: 0.6 }}>{Icons.folder}</span>
                    {user.projectCount}
                  </div>
                  <div className={s.textMuted} style={{ fontSize: '0.625rem' }}>Projects</div>
                </div>
                <span
                  className={s.badge}
                  style={{ background: user.workloadColor, color: '#fff' }}
                >
                  {user.workloadLevel}
                </span>
              </div>
            </div>
            <span
              style={{
                transform: expandedUsers.has(user.id) ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
                width: '20px',
                height: '20px',
                color: 'var(--int-text-muted)',
              }}
            >
              {Icons.chevronDown}
            </span>
          </button>
          
          {expandedUsers.has(user.id) && (
            <div className={s.cardBody} style={{ padding: 0, borderTop: '1px solid var(--int-border)' }}>
              {user.tasks.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                  No active tasks
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {user.tasks.map((task, idx) => (
                    <li
                      key={task.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: idx < user.tasks.length - 1 ? '1px solid var(--int-border)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Link
                        href={`/internal/tasks/${task.id}`}
                        style={{
                          flex: 1,
                          color: 'inherit',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                        }}
                      >
                        {task.title}
                      </Link>
                      <span
                        className={s.badge}
                        style={{
                          background: getStatusColor(task.status),
                          color: '#fff',
                          fontSize: '0.625rem',
                          flexShrink: 0,
                        }}
                      >
                        {task.status.replace(/_/g, ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--int-border)' }}>
                <Link href={`/internal/tasks?assignee=${user.id}`} className={s.btnSecondary} style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                  View All Tasks
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
