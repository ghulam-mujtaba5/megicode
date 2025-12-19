import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, clients, projects } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

const Icons = {
  invoice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
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

export default async function InvoicesPage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const rows = await db
    .select({
      invoice: invoices,
      client: clients,
      project: projects,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .orderBy(desc(invoices.createdAt))
    .all();

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>
            <span className={s.icon}>{Icons.invoice}</span>
            Invoices
          </h1>
          <p className={s.pageSubtitle}>Track billing, due dates, and payments</p>
        </div>
      </div>

      <section className={s.card} style={{ margin: '0 24px' }}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>All Invoices</h2>
        </div>
        <div className={s.cardBody}>
          {rows.length === 0 ? (
            <div className={s.emptyState}>
              <span className={s.emptyIcon}>{Icons.invoice}</span>
              <p>No invoices found</p>
            </div>
          ) : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ invoice, client, project }) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link href={`/internal/invoices/${invoice.id}`} className={s.linkPrimary}>
                        {invoice.invoiceNumber}
                      </Link>
                      {invoice.title && <div className={s.cellSubtitle}>{invoice.title}</div>}
                    </td>
                    <td>{client?.company || client?.name || '-'}</td>
                    <td>{project?.name || '-'}</td>
                    <td>
                      <span className={badgeClass(invoice.status)}>{invoice.status}</span>
                    </td>
                    <td>{invoice.dueAt ? formatDateTime(invoice.dueAt) : '-'}</td>
                    <td>{money(invoice.totalAmount, invoice.currency ?? 'USD')}</td>
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
