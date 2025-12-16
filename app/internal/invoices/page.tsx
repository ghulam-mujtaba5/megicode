import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, clients, projects } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

export default async function InvoicesPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  const invoicesList = await db.select({
    invoice: invoices,
    clientName: clients.name,
    projectName: projects.name,
  })
  .from(invoices)
  .leftJoin(clients, eq(invoices.clientId, clients.id))
  .leftJoin(projects, eq(invoices.projectId, projects.id))
  .orderBy(desc(invoices.createdAt))
  .all();

  const clientsList = await db.select().from(clients).all();
  const projectsList = await db.select().from(projects).all();

  async function createInvoice(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const clientId = String(formData.get('clientId') ?? '').trim() || null;
    const projectId = String(formData.get('projectId') ?? '').trim() || null;
    const dueAt = formData.get('dueAt') ? new Date(String(formData.get('dueAt'))) : null;
    const notes = String(formData.get('notes') ?? '').trim() || null;

    const now = new Date();
    
    // Generate invoice number: INV-YYYYMM-XXXX
    const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const existing = await db.select().from(invoices).all();
    const sequence = existing.filter(i => i.invoiceNumber?.startsWith(prefix)).length + 1;
    const invoiceNumber = `${prefix}-${String(sequence).padStart(4, '0')}`;

    const id = crypto.randomUUID();
    await db.insert(invoices).values({
      id,
      invoiceNumber,
      title: `Invoice ${invoiceNumber}`,
      clientId,
      projectId,
      status: 'draft',
      totalAmount: 0,
      paidAmount: 0,
      currency: 'USD',
      dueAt,
      notes,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/invoices/${id}`);
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'paid': return commonStyles.badgeGreen;
      case 'sent': return commonStyles.badgeBlue;
      case 'overdue': return commonStyles.badgeRed;
      case 'cancelled': return commonStyles.badgeGray;
      default: return commonStyles.badgeYellow;
    }
  };

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Invoices</h1>
      </div>

      {/* Create Invoice */}
      <section className={commonStyles.card}>
        <h2>Create Invoice</h2>
        <form action={createInvoice} className={commonStyles.grid}>
          <label>
            Client
            <select className={commonStyles.select} name="clientId">
              <option value="">— None —</option>
              {clientsList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Project
            <select className={commonStyles.select} name="projectId">
              <option value="">— None —</option>
              {projectsList.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            Due Date
            <input className={commonStyles.input} name="dueAt" type="date" />
          </label>
          <label>
            Notes
            <textarea className={commonStyles.textarea} name="notes" rows={2} placeholder="Optional notes"></textarea>
          </label>
          <button className={commonStyles.button} type="submit">Create Invoice</button>
        </form>
      </section>

      {/* Invoices List */}
      <section className={commonStyles.card}>
        <h2>All Invoices</h2>
        {invoicesList.length === 0 ? (
          <p className={commonStyles.muted}>No invoices yet</p>
        ) : (
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Project</th>
                <th>Status</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList.map(({ invoice, clientName, projectName }) => (
                <tr key={invoice.id}>
                  <td><Link href={`/internal/invoices/${invoice.id}`}>{invoice.invoiceNumber || 'Draft'}</Link></td>
                  <td>{clientName || '—'}</td>
                  <td>{projectName || '—'}</td>
                  <td><span className={`${commonStyles.badge} ${statusColor(invoice.status)}`}>{invoice.status}</span></td>
                  <td>${((invoice.totalAmount ?? 0) / 100).toFixed(2)}</td>
                  <td>${((invoice.paidAmount ?? 0) / 100).toFixed(2)}</td>
                  <td>{invoice.dueAt ? formatDateTime(invoice.dueAt) : '—'}</td>
                  <td><Link href={`/internal/invoices/${invoice.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
