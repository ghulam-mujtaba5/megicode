import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, invoiceItems, clients, projects, payments, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';
import {
  safeValidateFormData,
  invoiceAddItemFormSchema,
  recordPaymentFormSchema,
  invoiceUpdateStatusFormSchema,
  invoiceSendFormSchema,
} from '@/lib/validations';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  folder: (
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
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin', 'pm']);
  const { id } = await params;
  const db = getDb();

  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).get();
  if (!invoice) notFound();

  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)).all();
  const paymentsList = await db.select().from(payments).where(eq(payments.invoiceId, id)).orderBy(desc(payments.paidAt)).all();
  const client = invoice.clientId ? await db.select().from(clients).where(eq(clients.id, invoice.clientId)).get() : null;
  const project = invoice.projectId ? await db.select().from(projects).where(eq(projects.id, invoice.projectId)).get() : null;

  async function addItem(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(invoiceAddItemFormSchema, formData);
    if (!result.success) return;
    const { invoiceId, description, quantity, unitPrice } = result.data;

    await db.insert(invoiceItems).values({
      id: crypto.randomUUID(),
      invoiceId,
      description,
      quantity,
      unitPrice,
    });

    // Recalculate total
    const allItems = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId)).all();
    const total = allItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    await db.update(invoices).set({ totalAmount: total, updatedAt: new Date() }).where(eq(invoices.id, invoiceId));

    redirect(`/internal/invoices/${invoiceId}`);
  }

  async function recordPayment(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(recordPaymentFormSchema, formData);
    if (!result.success) return;
    const { invoiceId, amount, method, referenceNumber: reference, paidAt } = result.data;

    const now = new Date();
    await db.insert(payments).values({
      id: crypto.randomUUID(),
      invoiceId,
      amount,
      method,
      reference,
      paidAt,
      createdAt: now,
    });

    // Update paidAmount
    const allPayments = await db.select().from(payments).where(eq(payments.invoiceId, invoiceId)).all();
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const inv = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
    const newStatus = totalPaid >= (inv?.totalAmount ?? 0) ? 'paid' : inv?.status ?? 'draft';
    
    await db.update(invoices).set({ paidAmount: totalPaid, status: newStatus, updatedAt: now }).where(eq(invoices.id, invoiceId));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId: inv?.projectId,
      type: 'payment.received',
      actorUserId: session.user.id ?? null,
      payloadJson: { invoiceId, amount },
      createdAt: now,
    });

    redirect(`/internal/invoices/${invoiceId}`);
  }

  async function updateStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(invoiceUpdateStatusFormSchema, formData);
    if (!result.success) return;
    const { id, status } = result.data;

    const now = new Date();
    const updates: Record<string, unknown> = { status, updatedAt: now };
    if (status === 'sent') updates.sentAt = now;

    await db.update(invoices).set(updates).where(eq(invoices.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId: invoice.projectId,
      type: `invoice.${status}`,
      actorUserId: session.user.id ?? null,
      payloadJson: { invoiceId: id, status },
      createdAt: now,
    });

    redirect(`/internal/invoices/${id}`);
  }

  async function sendInvoice(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(invoiceSendFormSchema, formData);
    if (!result.success) return;
    const { id } = result.data;

    const now = new Date();
    await db.update(invoices).set({ status: 'sent', sentAt: now, updatedAt: now }).where(eq(invoices.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId: invoice.projectId,
      type: 'invoice.sent',
      actorUserId: session.user.id ?? null,
      payloadJson: { invoiceId: id, method: 'email_simulation' },
      createdAt: now,
    });

    redirect(`/internal/invoices/${id}`);
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const paymentsTotal = paymentsList.reduce((sum, p) => sum + p.amount, 0);
  const balance = itemsTotal - paymentsTotal;

  const statusColor = (s: string) => {
    switch (s) {
      case 'paid': return styles.badgeSuccess;
      case 'sent': return styles.badgeInfo;
      case 'overdue': return styles.badgeError;
      case 'cancelled': return styles.badgeDefault;
      default: return styles.badgeWarning;
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/invoices" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Invoice</span>
            </div>
            <h1 className={styles.pageTitle}>{invoice.invoiceNumber || 'Draft Invoice'}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(invoice.createdAt)}</p>
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Invoice Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={`${styles.badge} ${statusColor(invoice.status)}`}>{invoice.status}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Due Date</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.calendar}</span>
                      <span>{invoice.dueAt ? formatDateTime(invoice.dueAt) : <span className={styles.textMuted}>No due date</span>}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Client</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.briefcase}</span>
                      {client ? <Link href={`/internal/clients/${client.id}`} className={styles.link}>{client.name}</Link> : <span className={styles.textMuted}>—</span>}
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Project</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.folder}</span>
                      {project ? <Link href={`/internal/projects/${project.id}`} className={styles.link}>{project.name}</Link> : <span className={styles.textMuted}>—</span>}
                    </div>
                  </div>
                </div>
                
                {invoice.notes && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--int-border)' }}>
                    <p className={styles.label}>Notes</p>
                    <p style={{ color: 'var(--int-text-secondary)', lineHeight: 1.6 }}>{invoice.notes}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Line Items */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Line Items</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {items.length > 0 ? (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th style={{ textAlign: 'right' }}>Qty</th>
                          <th style={{ textAlign: 'right' }}>Unit Price</th>
                          <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.description}</td>
                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>${(item.unitPrice / 100).toFixed(2)}</td>
                            <td style={{ textAlign: 'right' }}>${((item.quantity * item.unitPrice) / 100).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: 'var(--int-bg-alt)', fontWeight: 600 }}>
                          <td colSpan={3} style={{ textAlign: 'right' }}>Total</td>
                          <td style={{ textAlign: 'right' }}>${(itemsTotal / 100).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No line items yet.
                  </div>
                )}
                
                <div style={{ padding: '24px', borderTop: '1px solid var(--int-border)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Add Item</h3>
                  <form action={addItem} className={styles.form}>
                    <input type="hidden" name="invoiceId" value={invoice.id} />
                    <div className={styles.inputGroup}>
                      <input className={styles.input} name="description" required placeholder="Description" style={{ flex: 2 }} />
                      <input className={styles.input} name="quantity" type="number" min="1" defaultValue="1" placeholder="Qty" style={{ flex: 0.5 }} />
                      <input className={styles.input} name="unitPrice" type="number" step="0.01" min="0" placeholder="Price ($)" style={{ flex: 0.5 }} />
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* Payments */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Payments</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {paymentsList.length > 0 ? (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsList.map((p) => (
                          <tr key={p.id}>
                            <td>{formatDateTime(p.paidAt)}</td>
                            <td>${(p.amount / 100).toFixed(2)}</td>
                            <td>{p.method || '—'}</td>
                            <td>{p.reference || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No payments recorded.
                  </div>
                )}
                
                <div style={{ padding: '24px', borderTop: '1px solid var(--int-border)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Record Payment</h3>
                  <form action={recordPayment} className={styles.form}>
                    <input type="hidden" name="invoiceId" value={invoice.id} />
                    <div className={styles.grid2}>
                      <div>
                        <label className={styles.formLabel}>Amount ($) *</label>
                        <input className={styles.input} name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Payment Date</label>
                        <input className={styles.input} name="paidAt" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Method</label>
                        <select className={styles.select} name="method">
                          <option value="">— Select —</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="check">Check</option>
                          <option value="paypal">PayPal</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={styles.formLabel}>Reference #</label>
                        <input className={styles.input} name="referenceNumber" placeholder="Transaction ID" />
                      </div>
                    </div>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ marginTop: '16px', width: '100%' }}>
                      Record Payment
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.form}>
            
            {/* Financial Summary */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Summary</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ marginBottom: '16px' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Total Amount</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${(itemsTotal / 100).toFixed(2)}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Paid Amount</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success)' }}>${(paymentsTotal / 100).toFixed(2)}</div>
                </div>
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--int-border)' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Balance Due</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: balance > 0 ? 'var(--int-error)' : 'var(--int-text)' }}>
                    ${(balance / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Actions</h2>
              </div>
              <div className={styles.cardBody}>
                {invoice.status === 'draft' && (
                  <form action={sendInvoice} style={{ marginBottom: '16px' }}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%' }}>
                      {Icons.send} Send Invoice
                    </button>
                    <p className={styles.textMuted} style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '8px' }}>
                      Marks as sent & logs event
                    </p>
                  </form>
                )}

                <form action={updateStatus} className={styles.form}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <div>
                    <label className={styles.formLabel}>Update Status</label>
                    <select className={styles.select} name="status" defaultValue={invoice.status}>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    Update Status
                  </button>
                </form>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
