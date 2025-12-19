import Link from 'next/link';
import { sql, notInArray, eq } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, payments } from '@/lib/db/schema';

const Icons = {
  finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  invoice: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  report: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
};

function formatMoney(cents: number, currency: string = 'USD') {
  const amount = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export default async function FinancePage() {
  await requireRole(['admin', 'pm']);
  const db = getDb();

  const [invoiceStats, outstanding, paid] = await Promise.all([
    db
      .select({
        totalInvoices: sql<number>`count(*)`,
        openInvoices: sql<number>`sum(case when ${notInArray(invoices.status, ['paid', 'canceled'])} then 1 else 0 end)`,
        paidInvoices: sql<number>`sum(case when ${eq(invoices.status, 'paid')} then 1 else 0 end)`,
      })
      .from(invoices)
      .get(),
    db
      .select({
        outstandingCents: sql<number>`coalesce(sum(${invoices.totalAmount}), 0)`,
      })
      .from(invoices)
      .where(notInArray(invoices.status, ['paid', 'canceled']))
      .get(),
    db
      .select({
        paidCents: sql<number>`coalesce(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(eq(payments.status, 'completed'))
      .get(),
  ]);

  return (
    <main className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>
              {Icons.finance} Finance
            </h1>
            <p className={s.pageSubtitle}>Invoices, payments, and quick financial health checks.</p>
          </div>
          <div className={s.pageActions}>
            <Link href="/internal/invoices" className={`${s.btn} ${s.btnPrimary}`}>
              {Icons.invoice} Invoices
            </Link>
            <Link href="/internal/reports" className={`${s.btn} ${s.btnSecondary}`}>
              {Icons.report} Reports
            </Link>
          </div>
        </div>

        <section className={s.grid3}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Invoices</h2>
            </div>
            <div className={s.cardBody}>
              <div className={s.kpiGrid}>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Total</div>
                  <div className={s.kpiValue}>{invoiceStats?.totalInvoices ?? 0}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Open</div>
                  <div className={s.kpiValue}>{invoiceStats?.openInvoices ?? 0}</div>
                </div>
                <div className={s.kpiItem}>
                  <div className={s.kpiLabel}>Paid</div>
                  <div className={s.kpiValue}>{invoiceStats?.paidInvoices ?? 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Outstanding</h2>
            </div>
            <div className={s.cardBody}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {formatMoney(outstanding?.outstandingCents ?? 0)}
              </div>
              <p className={s.pageSubtitle} style={{ marginTop: 8 }}>
                Total across invoices not marked paid/canceled.
              </p>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>Payments Received</h2>
            </div>
            <div className={s.cardBody}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {formatMoney(paid?.paidCents ?? 0)}
              </div>
              <p className={s.pageSubtitle} style={{ marginTop: 8 }}>
                Completed payments total.
              </p>
            </div>
          </div>
        </section>

        <section className={s.card} style={{ marginTop: 24 }}>
          <div className={s.cardBody} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 650 }}>Quick actions</div>
              <div className={s.pageSubtitle} style={{ marginTop: 4 }}>
                Jump to invoices for details, or generate a financial view in Reports.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/internal/invoices" className={`${s.btn} ${s.btnSecondary}`}>View invoices</Link>
              <Link href="/internal/reports" className={`${s.btn} ${s.btnSecondary}`}>View reports</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
