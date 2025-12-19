'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import s from '../styles.module.css';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  skills: string[] | null;
}

interface TeamStats {
  user: User;
  activeTaskCount: number;
  completedTaskCount: number;
}

interface TeamClientProps {
  teamStats: TeamStats[];
  updateSkillsAction: (userId: string, skills: string[]) => Promise<void>;
}

// Icons
const Icons = {
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

export default function TeamClient({ teamStats, updateSkillsAction }: TeamClientProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editSkills, setEditSkills] = useState<string>('');
  const router = useRouter();

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditSkills(user.skills ? user.skills.join(', ') : '');
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditSkills('');
  };

  const saveSkills = async (userId: string) => {
    const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);
    await updateSkillsAction(userId, skillsArray);
    setEditingUserId(null);
    router.refresh();
  };

  return (
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
            <div style={{ flex: 1 }}>
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

          {/* Skills Section */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--int-text-secondary)' }}>Skills</span>
              {editingUserId === user.id ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => saveSkills(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--int-success)' }}>{Icons.save}</button>
                  <button onClick={cancelEditing} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--int-error)' }}>{Icons.x}</button>
                </div>
              ) : (
                <button onClick={() => startEditing(user)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--int-primary)' }}>{Icons.edit}</button>
              )}
            </div>
            
            {editingUserId === user.id ? (
              <input 
                type="text" 
                value={editSkills} 
                onChange={(e) => setEditSkills(e.target.value)}
                className={s.input}
                placeholder="React, Node.js, SQL..."
                autoFocus
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <span key={i} style={{ background: 'var(--int-bg-alt)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid var(--int-border)' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', fontStyle: 'italic' }}>No skills listed</span>
                )}
              </div>
            )}
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
  );
}
