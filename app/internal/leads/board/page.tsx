import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, type LeadStatus } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const STATUS_COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New', color: 'var(--int-primary)' },
  { id: 'in_review', label: 'In Review', color: 'var(--int-warning)' },
  { id: 'approved', label: 'Approved', color: 'var(--int-success)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--int-danger)' },
  { id: 'converted', label: 'Converted', color: 'var(--int-info)' },
];

export default async function LeadsBoardPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).all();

  const leadsByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = allLeads.filter((l) => l.status === col.id);
    return acc;
  }, {} as Record<LeadStatus, typeof allLeads>);

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Leads Kanban Board</h1>
          <p className={s.pageSubtitle}>Visual pipeline management</p>
        </div>
        <div className={s.pageActions}>
          <Link href="/internal/leads" className={s.buttonSecondary}>
            List View
          </Link>
          <Link href="/internal/leads/new" className={s.buttonPrimary}>
            New Lead
          </Link>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '1rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {STATUS_COLUMNS.map((col) => (
          <div key={col.id} style={{ 
            background: 'var(--int-surface-muted)', 
            borderRadius: 'var(--int-radius-md)', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `2px solid ${col.color}`,
              paddingBottom: '0.5rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{col.label}</h3>
              <span style={{ 
                background: 'var(--int-bg)', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '1rem', 
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {leadsByStatus[col.id].length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {leadsByStatus[col.id].map((lead) => (
                <Link 
                  key={lead.id} 
                  href={`/internal/leads/${lead.id}`}
                  className={s.card}
                  style={{ 
                    display: 'block', 
                    padding: '1rem', 
                    textDecoration: 'none',
                    color: 'inherit',
                    borderLeft: `4px solid ${col.color}`
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{lead.name}</div>
                  {lead.company && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--int-text-muted)', marginBottom: '0.5rem' }}>
                      {lead.company}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatDateTime(lead.createdAt)}</span>
                  </div>
                </Link>
              ))}
              {leadsByStatus[col.id].length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem 0', 
                  color: 'var(--int-text-muted)', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  No leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
