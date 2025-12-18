'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

const Icons = {
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
};

interface Project {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  totalInvoiced: number;
}

interface ReportsClientProps {
  projects: Project[];
}

export default function ReportsClient({ projects }: ReportsClientProps) {
  const [showAll, setShowAll] = useState(false);
  const displayProjects = showAll ? projects : projects.slice(0, 10);

  return (
    <section className={s.card} style={{ gridColumn: '1 / -1' }}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>
          <span style={{ marginRight: '8px', color: 'var(--int-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
          </span>
          Project Statistics
        </h2>
        {projects.length > 10 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className={s.btnSecondary}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {showAll ? 'Show Less' : `Show All (${projects.length})`}
            <span style={{ 
              transform: showAll ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
              width: '16px',
              height: '16px',
            }}>
              {Icons.chevronDown}
            </span>
          </button>
        )}
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        <div className={s.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th style={{ textAlign: 'right' }}>Total Tasks</th>
                <th style={{ textAlign: 'right' }}>Completed</th>
                <th style={{ textAlign: 'right' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {displayProjects.map((p) => {
                const progress = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
                return (
                  <tr key={p.id}>
                    <td><Link href={`/internal/projects/${p.id}`} className={s.link}>{p.name}</Link></td>
                    <td style={{ textAlign: 'right' }}>{p.totalTasks}</td>
                    <td style={{ textAlign: 'right' }}>{p.completedTasks}</td>
                    <td style={{ textAlign: 'right', color: progress >= 80 ? 'var(--int-success)' : progress >= 50 ? 'var(--int-warning)' : 'var(--int-secondary)' }}>
                      {progress}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
