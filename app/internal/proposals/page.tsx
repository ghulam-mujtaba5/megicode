import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { proposals, leads, clients, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

function statusBadge(status: string, styles: typeof commonStyles) {
  if (status === 'accepted') return `${styles.badge} ${styles.badgeGreen}`;
  if (status === 'declined') return `${styles.badge} ${styles.badgeRed}`;
  if (status === 'sent' || status === 'approved') return `${styles.badge} ${styles.badgeBlue}`;
  if (status === 'pending_approval') return `${styles.badge} ${styles.badgeYellow}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

export default async function ProposalsPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  const rows = await db.select().from(proposals).orderBy(desc(proposals.createdAt)).all();
  const leadsRows = await db.select().from(leads).all();
  const clientsRows = await db.select().from(clients).all();

  const leadsById = new Map(leadsRows.map((l) => [l.id, l]));
  const clientsById = new Map(clientsRows.map((c) => [c.id, c]));

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
    <main className={commonStyles.page}>
      <div className={commonStyles.grid2}>
        <section className={commonStyles.card}>
          <div className={commonStyles.row}>
            <h1>Proposals</h1>
            <span className={commonStyles.muted}>Total: {rows.length}</span>
          </div>

          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Client/Lead</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const lead = p.leadId ? leadsById.get(p.leadId) : null;
                const client = p.clientId ? clientsById.get(p.clientId) : null;
                return (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{client?.name || lead?.name || '—'}</td>
                    <td>${((p.totalAmount ?? 0) / 100).toFixed(2)}</td>
                    <td><span className={statusBadge(p.status, commonStyles)}>{p.status}</span></td>
                    <td>{formatDateTime(p.createdAt)}</td>
                    <td><Link href={`/internal/proposals/${p.id}`}>Open</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className={commonStyles.card}>
          <h2>Create Proposal</h2>
          <form action={createProposal} className={commonStyles.grid}>
            <label>
              Title *
              <input className={commonStyles.input} name="title" required placeholder="e.g. Web App Development Proposal" />
            </label>
            <label>
              Lead
              <select className={commonStyles.select} name="leadId" defaultValue="">
                <option value="">None</option>
                {leadsRows.filter((l) => l.status !== 'converted').map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.email || 'no email'})</option>
                ))}
              </select>
            </label>
            <label>
              Client
              <select className={commonStyles.select} name="clientId" defaultValue="">
                <option value="">None</option>
                {clientsRows.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Cost Model
              <select className={commonStyles.select} name="costModel" defaultValue="fixed">
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly (T&M)</option>
                <option value="retainer">Retainer</option>
              </select>
            </label>
            <label>
              Total Amount ($)
              <input className={commonStyles.input} name="totalAmount" type="number" step="0.01" min="0" placeholder="0.00" />
            </label>
            <label>
              Summary
              <textarea className={commonStyles.textarea} name="summary" placeholder="Brief overview of the proposal..." />
            </label>
            <button className={commonStyles.button} type="submit">Create Proposal</button>
          </form>
        </section>
      </div>
    </main>
  );
}
