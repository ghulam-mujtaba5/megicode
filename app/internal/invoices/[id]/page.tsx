import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, invoiceItems, payments, clients, projects } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
};

function money(amountCents: number, currency = 'USD') {
  const amount = (amountCents ?? 0) / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function badgeClass(status: string) {
  if (status === 'paid') return `${s.badge} ${s.badgeSuccess}`;
  if (status === 'sent' || status === 'pending') return `${s.badge} ${s.badgeInfo}`;
  if (status === 'overdue') return `${s.badge} ${s.badgeDanger}`;
  if (status === 'canceled') return `${s.badge} ${s.badgeDefault}`;
  return `${s.badge} ${s.badgeWarning}`;
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin', 'pm']);
  const { id } = await params;
  const db = getDb();

  const row = await db
    .select({
      invoice: invoices,
      client: clients,
      project: projects,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .where(eq(invoices.id, id))
    .get();

  if (!row) notFound();

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(invoiceItems.sortOrder)
    .all();

  const paymentRows = await db
    .select()
    .from(payments)
    .where(eq(payments.invoiceId, id))
    .orderBy(desc(payments.createdAt))
    .all();

  const invoice = row.invoice;

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <Link href="/internal/invoices" className={s.btnGhost} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            {Icons.back} Back to Invoices
          </Link>
          <h1 className={s.pageTitle}>
            {invoice.invoiceNumber}
            <span className={badgeClass(invoice.status)} style={{ marginLeft: 12 }}>
              {invoice.status}
            </span>
          </h1>
          <p className={s.pageSubtitle}>
            Total {money(invoice.totalAmount, invoice.currency ?? 'USD')}
            {invoice.dueAt ? ` • Due ${formatDateTime(invoice.dueAt)}` : ''}
          </p>
        </div>
      </div>

      <div className={s.grid2} style={{ margin: '0 24px', gap: 'var(--int-space-6)' }}>
        <section className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Invoice Details</h2>
          </div>
          <div className={s.cardBody}>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Client</span>
              <span className={s.detailValue}>{row.client?.company || row.client?.name || '-'}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Project</span>
              <span className={s.detailValue}>{row.project?.name || '-'}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Issued</span>
              <span className={s.detailValue}>{invoice.issuedAt ? formatDateTime(invoice.issuedAt) : '-'}</span>
            </div>
            <div className={s.detailRow}>
              <span className={s.detailLabel}>Paid</span>
              <span className={s.detailValue}>{invoice.paidAt ? formatDateTime(invoice.paidAt) : 'Not paid'}</span>
            </div>
          </div>
        </section>

        <section className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Payments</h2>
          </div>
          <div className={s.cardBody}>
            {paymentRows.length === 0 ? (
              <div className={s.emptyState}>
                <p>No payments recorded for this invoice.</p>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((p) => (
                    <tr key={p.id}>
                      <td>{money(p.amount, p.currency ?? invoice.currency ?? 'USD')}</td>
                      <td>{p.method ?? '-'}</td>
                      <td>{p.status}</td>
                      <td>{p.paidAt ? formatDateTime(p.paidAt) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <section className={s.card} style={{ margin: '24px' }}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Invoice Items</h2>
        </div>
        <div className={s.cardBody}>
          {items.length === 0 ? (
            <div className={s.emptyState}>
              <p>No invoice items found.</p>
            </div>
          ) : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.description}</td>
                    <td>{it.quantity}</td>
                    <td>{money(it.unitPrice, invoice.currency ?? 'USD')}</td>
                    <td>{money(it.amount, invoice.currency ?? 'USD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
