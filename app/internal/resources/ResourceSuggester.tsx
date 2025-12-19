'use client';

import { useState } from 'react';
import s from '../styles.module.css';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  skills: string[] | null;
  workload: number; // active tasks
}

interface ResourceSuggesterProps {
  users: User[];
}

export default function ResourceSuggester({ users }: ResourceSuggesterProps) {
  const [requiredSkills, setRequiredSkills] = useState('');
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const findDevelopers = () => {
    if (!requiredSkills.trim()) {
      setSuggestions([]);
      return;
    }

    const skills = requiredSkills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    
    const scoredUsers = users.map(user => {
      let score = 0;
      const userSkills = (user.skills || []).map(s => s.toLowerCase());
      
      // Skill match score
      const matchedSkills = skills.filter(skill => userSkills.some(us => us.includes(skill)));
      score += matchedSkills.length * 10;

      // Workload penalty (fewer tasks is better)
      score -= user.workload * 2;

      // Role bonus (devs are preferred for dev tasks)
      if (user.role === 'dev') score += 5;

      return { ...user, score, matchedSkills };
    });

    // Sort by score descending
    const sorted = scoredUsers
      .filter(u => u.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setSuggestions(sorted);
  };

  return (
    <div className={s.card} style={{ marginTop: '24px' }}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>Smart Resource Allocation</h2>
      </div>
      <div className={s.cardBody}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            className={s.input}
            placeholder="Required skills (e.g. React, Node.js, SQL)..."
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && findDevelopers()}
          />
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={findDevelopers}>
            Find Best Match
          </button>
        </div>

        {suggestions.length > 0 && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {suggestions.map((user, index) => (
              <div key={user.id} style={{ 
                padding: '12px', 
                border: '1px solid var(--int-border)', 
                borderRadius: '8px',
                background: index === 0 ? 'var(--int-bg-alt)' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: 'var(--int-primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                      {user.role} • {user.workload} active tasks
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--int-success)' }}>
                    {(user as any).matchedSkills.length} skill matches
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                    Score: {(user as any).score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
