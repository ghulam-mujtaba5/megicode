import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { proposals, leads, clients, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  proposals: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  draft: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  sent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  accepted: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  declined: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  add: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  title: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  lead: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  ),
  client: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  cost: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  amount: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  notes: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
};

function getBadgeClass(status: string) {
  if (status === 'accepted') return `${styles.badge} ${styles.badgeSuccess}`;
  if (status === 'declined') return `${styles.badge} ${styles.badgeDanger}`;
  if (status === 'sent' || status === 'approved') return `${styles.badge} ${styles.badgeInfo}`;
  if (status === 'pending_approval') return `${styles.badge} ${styles.badgeWarning}`;
  return `${styles.badge} ${styles.badgeDefault}`;
}

export default async function ProposalsPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  const rows = await db.select().from(proposals).orderBy(desc(proposals.createdAt)).all();
  const leadsRows = await db.select().from(leads).all();
  const clientsRows = await db.select().from(clients).all();

  const leadsById = new Map(leadsRows.map((l) => [l.id, l]));
  const clientsById = new Map(clientsRows.map((c) => [c.id, c]));

  // Calculate stats
  const proposalStats = {
    total: rows.length,
    draft: rows.filter(p => p.status === 'draft').length,
    sent: rows.filter(p => p.status === 'sent' || p.status === 'approved').length,
    accepted: rows.filter(p => p.status === 'accepted').length,
  };

  // Calculate total value
  const totalValue = rows.reduce((sum, p) => sum + (p.totalAmount ?? 0), 0) / 100;

  async function createProposal(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);

    const title = String(formData.get('title') ?? '').trim();
    const leadId = String(formData.get('leadId') ?? '').trim() || null;
    const clientId = String(formData.get('clientId') ?? '').trim() || null;
    const costModel = String(formData.get('costModel') ?? 'fixed').trim() as 'fixed' | 'hourly' | 'retainer';
    const totalAmount = Math.round(parseFloat(String(formData.get('totalAmount') ?? '0')) * 100);
    const summary = String(formData.get('summary') ?? '').trim() || null;

    if (!title) return;

    const now = new Date();
    const proposalId = crypto.randomUUID();

    const db = getDb();
    await db.insert(proposals).values({
      id: proposalId,
      title,
      leadId,
      clientId,
      costModel,
      totalAmount,
      summary,
      status: 'draft',
      createdByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId,
      type: 'proposal.created',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ proposalId, title }),
      createdAt: now,
    });

    redirect(`/internal/proposals/${proposalId}`);
  }

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Proposals</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>{rows.length}</span> proposals worth <span className={styles.highlight}>${totalValue.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.proposals}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{proposalStats.total}</span>
            <span className={styles.kpiLabel}>Total Proposals</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.draft}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{proposalStats.draft}</span>
            <span className={styles.kpiLabel}>Drafts</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.sent}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{proposalStats.sent}</span>
            <span className={styles.kpiLabel}>Sent</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.accepted}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{proposalStats.accepted}</span>
            <span className={styles.kpiLabel}>Accepted</span>
          </div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Proposals Table */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Proposals</h2>
            <span className={styles.badge}>{rows.length}</span>
          </div>

          {rows.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{Icons.empty}</div>
              <h3>No proposals yet</h3>
              <p>Create your first proposal using the form on the right.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>TITLE</th>
                    <th>CLIENT/LEAD</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => {
                    const lead = p.leadId ? leadsById.get(p.leadId) : null;
                    const client = p.clientId ? clientsById.get(p.clientId) : null;
                    return (
                      <tr key={p.id}>
                        <td className={styles.cellMain}>{p.title}</td>
                        <td className={styles.cellMuted}>{client?.name || lead?.name || '—'}</td>
                        <td className={styles.cellMain}>${((p.totalAmount ?? 0) / 100).toLocaleString()}</td>
                        <td>
                          <span className={getBadgeClass(p.status)}>
                            {p.status.replace('_', ' ').charAt(0).toUpperCase() + p.status.replace('_', ' ').slice(1)}
                          </span>
                        </td>
                        <td className={styles.cellMuted}>{formatDateTime(p.createdAt)}</td>
                        <td>
                          <Link href={`/internal/proposals/${p.id}`} className={styles.btnSmall}>
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Create Proposal Form */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Create Proposal</h2>
            <span className={styles.cardIcon}>{Icons.add}</span>
          </div>

          <form action={createProposal} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.title}</span>
                Title *
              </label>
              <input 
                className={styles.input} 
                name="title" 
                required 
                placeholder="e.g. Web App Development Proposal" 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.lead}</span>
                Lead
              </label>
              <select className={styles.select} name="leadId" defaultValue="">
                <option value="">None</option>
                {leadsRows.filter((l) => l.status !== 'converted').map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.email || 'no email'})</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.client}</span>
                Client
              </label>
              <select className={styles.select} name="clientId" defaultValue="">
                <option value="">None</option>
                {clientsRows.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.cost}</span>
                Cost Model
              </label>
              <select className={styles.select} name="costModel" defaultValue="fixed">
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly (T&M)</option>
                <option value="retainer">Retainer</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.amount}</span>
                Total Amount ($)
              </label>
              <input 
                className={styles.input} 
                name="totalAmount" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="0.00" 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.notes}</span>
                Summary
              </label>
              <textarea 
                className={styles.textarea} 
                name="summary" 
                placeholder="Brief overview of the proposal..."
                rows={3}
              />
            </div>

            <button className={styles.btnPrimary} type="submit">
              <span className={styles.btnIcon}>{Icons.add}</span>
              Create Proposal
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
