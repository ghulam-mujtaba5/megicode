import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, clients, projects } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  invoices: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
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
  paid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  overdue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  add: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
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
  project: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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
  switch (status) {
    case 'paid': return `${styles.badge} ${styles.badgeSuccess}`;
    case 'sent': return `${styles.badge} ${styles.badgeInfo}`;
    case 'overdue': return `${styles.badge} ${styles.badgeDanger}`;
    case 'cancelled': return `${styles.badge} ${styles.badgeDefault}`;
    default: return `${styles.badge} ${styles.badgeWarning}`;
  }
}

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

  // Calculate stats
  const invoiceStats = {
    total: invoicesList.length,
    draft: invoicesList.filter(i => i.invoice.status === 'draft').length,
    sent: invoicesList.filter(i => i.invoice.status === 'sent').length,
    paid: invoicesList.filter(i => i.invoice.status === 'paid').length,
  };

  // Calculate totals
  const totalAmount = invoicesList.reduce((sum, i) => sum + (i.invoice.totalAmount ?? 0), 0) / 100;
  const paidAmount = invoicesList.reduce((sum, i) => sum + (i.invoice.paidAmount ?? 0), 0) / 100;

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

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Invoices</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>${totalAmount.toLocaleString()}</span> total, <span className={styles.highlight}>${paidAmount.toLocaleString()}</span> paid
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.invoices}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{invoiceStats.total}</span>
            <span className={styles.kpiLabel}>Total Invoices</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.draft}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{invoiceStats.draft}</span>
            <span className={styles.kpiLabel}>Drafts</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}>{Icons.sent}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{invoiceStats.sent}</span>
            <span className={styles.kpiLabel}>Sent</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.paid}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{invoiceStats.paid}</span>
            <span className={styles.kpiLabel}>Paid</span>
          </div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Invoices Table */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Invoices</h2>
            <span className={styles.badge}>{invoicesList.length}</span>
          </div>

          {invoicesList.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{Icons.empty}</div>
              <h3>No invoices yet</h3>
              <p>Create your first invoice using the form on the right.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>INVOICE #</th>
                    <th>CLIENT</th>
                    <th>STATUS</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DUE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesList.map(({ invoice, clientName, projectName }) => (
                    <tr key={invoice.id}>
                      <td>
                        <div className={styles.cellMain}>{invoice.invoiceNumber || 'Draft'}</div>
                        {projectName && <div className={styles.cellSub}>{projectName}</div>}
                      </td>
                      <td className={styles.cellMuted}>{clientName || '—'}</td>
                      <td>
                        <span className={getBadgeClass(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className={styles.cellMain}>${((invoice.totalAmount ?? 0) / 100).toLocaleString()}</td>
                      <td className={styles.cellMuted}>${((invoice.paidAmount ?? 0) / 100).toLocaleString()}</td>
                      <td className={styles.cellMuted}>{invoice.dueAt ? formatDateTime(invoice.dueAt) : '—'}</td>
                      <td>
                        <Link href={`/internal/invoices/${invoice.id}`} className={styles.btnSmall}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Create Invoice Form */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Create Invoice</h2>
            <span className={styles.cardIcon}>{Icons.add}</span>
          </div>

          <form action={createInvoice} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.client}</span>
                Client
              </label>
              <select className={styles.select} name="clientId">
                <option value="">— Select Client —</option>
                {clientsList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.project}</span>
                Project
              </label>
              <select className={styles.select} name="projectId">
                <option value="">— Select Project —</option>
                {projectsList.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.calendar}</span>
                Due Date
              </label>
              <input className={styles.input} name="dueAt" type="date" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.notes}</span>
                Notes
              </label>
              <textarea 
                className={styles.textarea} 
                name="notes" 
                rows={3} 
                placeholder="Optional notes..."
              />
            </div>

            <button className={styles.btnPrimary} type="submit">
              <span className={styles.btnIcon}>{Icons.add}</span>
              Create Invoice
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
