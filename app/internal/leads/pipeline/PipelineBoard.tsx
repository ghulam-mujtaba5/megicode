'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../styles.module.css';
import { updateLeadStatus } from '../actions';

type Lead = {
  id: string;
  name: string;
  company: string | null;
  status: string;
  estimatedBudget: number | null;
  priority: string | null;
  createdAt: Date;
};

type PipelineBoardProps = {
  leads: Lead[];
};

const COLUMNS = [
  { id: 'new', label: 'New', color: 'var(--int-primary)' },
  { id: 'in_review', label: 'In Review', color: 'var(--int-warning)' },
  { id: 'approved', label: 'Approved', color: 'var(--int-success)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--int-error)' },
  { id: 'converted', label: 'Converted', color: 'var(--int-info)' },
];

export default function PipelineBoard({ leads: initialLeads }: PipelineBoardProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === status) return;

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));

    try {
      await updateLeadStatus(leadId, status);
      router.refresh();
    } catch (error) {
      // Revert on error
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: lead.status } : l));
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, 1fr)`, gap: '16px', alignItems: 'start', overflowX: 'auto', paddingBottom: '20px' }}>
      {COLUMNS.map(column => (
        <div 
          key={column.id}
          className={styles.card}
          style={{ background: 'var(--int-bg-alt)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={styles.cardHeader} style={{ borderTop: `4px solid ${column.color}` }}>
            <h3 className={styles.cardTitle} style={{ fontSize: '1rem' }}>
              {column.label}
              <span className={styles.badge} style={{ marginLeft: 'auto' }}>
                {leads.filter(l => l.status === column.id).length}
              </span>
            </h3>
          </div>
          <div className={styles.cardBody} style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads
              .filter(l => l.status === column.id)
              .map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className={styles.card}
                  style={{ 
                    padding: '12px', 
                    cursor: 'grab', 
                    background: 'var(--int-surface)',
                    border: '1px solid var(--int-border)',
                    boxShadow: 'var(--int-shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Link href={`/internal/leads/${lead.id}`} style={{ fontWeight: 600, color: 'var(--int-text)', textDecoration: 'none' }}>
                      {lead.name}
                    </Link>
                    {lead.priority && (
                      <span className={`${styles.badge} ${styles.badgeSm} ${
                        lead.priority === 'high' || lead.priority === 'critical' ? styles.badgeError :
                        lead.priority === 'medium' ? styles.badgeWarning :
                        styles.badgeInfo
                      }`}>
                        {lead.priority}
                      </span>
                    )}
                  </div>
                  {lead.company && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--int-text-muted)', marginBottom: '8px' }}>
                      {lead.company}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--int-text-secondary)' }}>
                    <span>
                      {lead.estimatedBudget ? `$${(lead.estimatedBudget / 100).toLocaleString()}` : '-'}
                    </span>
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
