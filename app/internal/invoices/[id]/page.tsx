import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc, sql } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { invoices, invoiceItems, clients, projects, payments, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(['admin', 'pm']);
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

    const invoiceId = String(formData.get('invoiceId') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const quantity = parseInt(String(formData.get('quantity') ?? '1'), 10);
    const unitPrice = Math.round(parseFloat(String(formData.get('unitPrice') ?? '0')) * 100);

    if (!description || !invoiceId) return;

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

    const invoiceId = String(formData.get('invoiceId') ?? '').trim();
    const amount = Math.round(parseFloat(String(formData.get('amount') ?? '0')) * 100);
    const method = String(formData.get('method') ?? '').trim() || null;
    const reference = String(formData.get('referenceNumber') ?? '').trim() || null;
    const paidAt = formData.get('paidAt') ? new Date(String(formData.get('paidAt'))) : new Date();

    if (!invoiceId || amount <= 0) return;

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
      payloadJson: JSON.stringify({ invoiceId, amount }),
      createdAt: now,
    });

    redirect(`/internal/invoices/${invoiceId}`);
  }

  async function updateStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as typeof invoice.status;
    if (!id) return;

    const now = new Date();
    const updates: Partial<typeof invoice> = { status, updatedAt: now };
    if (status === 'sent') updates.sentAt = now;

    await db.update(invoices).set(updates).where(eq(invoices.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId: invoice.projectId,
      type: `invoice.${status}`,
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ invoiceId: id, status }),
      createdAt: now,
    });

    redirect(`/internal/invoices/${id}`);
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const paymentsTotal = paymentsList.reduce((sum, p) => sum + p.amount, 0);
  const balance = itemsTotal - paymentsTotal;

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
        <h1>{invoice.invoiceNumber || 'Invoice'}</h1>
        <Link href="/internal/invoices">Back</Link>
      </div>

      <div className={commonStyles.grid2}>
        {/* Invoice Info */}
        <section className={commonStyles.card}>
          <h2>Details</h2>
          <div className={commonStyles.grid}>
            <p><strong>Status:</strong> <span className={`${commonStyles.badge} ${statusColor(invoice.status)}`}>{invoice.status}</span></p>
            <p><strong>Client:</strong> {client ? <Link href={`/internal/clients/${client.id}`}>{client.name}</Link> : '—'}</p>
            <p><strong>Project:</strong> {project ? <Link href={`/internal/projects/${project.id}`}>{project.name}</Link> : '—'}</p>
            <p><strong>Total:</strong> ${(itemsTotal / 100).toFixed(2)}</p>
            <p><strong>Paid:</strong> ${(paymentsTotal / 100).toFixed(2)}</p>
            <p><strong>Balance:</strong> ${(balance / 100).toFixed(2)}</p>
            <p><strong>Due:</strong> {invoice.dueAt ? formatDateTime(invoice.dueAt) : '—'}</p>
            <p><strong>Created:</strong> {formatDateTime(invoice.createdAt)}</p>
            {invoice.sentAt && <p><strong>Sent:</strong> {formatDateTime(invoice.sentAt)}</p>}
          </div>
          {invoice.notes && <p className={commonStyles.muted}>{invoice.notes}</p>}
        </section>

        {/* Actions */}
        <section className={commonStyles.card}>
          <h2>Actions</h2>
          <form action={updateStatus} className={commonStyles.grid}>
            <input type="hidden" name="id" value={invoice.id} />
            <label>
              Update Status
              <select className={commonStyles.select} name="status" defaultValue={invoice.status}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Update</button>
          </form>
        </section>
      </div>

      {/* Line Items */}
      <section className={commonStyles.card}>
        <h2>Line Items</h2>
        {items.length > 0 ? (
          <table className={commonStyles.table}>
            <thead>
              <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.unitPrice / 100).toFixed(2)}</td>
                  <td>${((item.quantity * item.unitPrice) / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}><strong>Total</strong></td>
                <td><strong>${(itemsTotal / 100).toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className={commonStyles.muted}>No line items</p>
        )}

        <h3>Add Item</h3>
        <form action={addItem} className={commonStyles.grid}>
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <label>
            Description *
            <input className={commonStyles.input} name="description" required />
          </label>
          <div className={commonStyles.row}>
            <label style={{ flex: 1 }}>
              Qty
              <input className={commonStyles.input} name="quantity" type="number" min="1" defaultValue="1" />
            </label>
            <label style={{ flex: 1 }}>
              Unit Price ($)
              <input className={commonStyles.input} name="unitPrice" type="number" step="0.01" min="0" />
            </label>
          </div>
          <button className={commonStyles.secondaryButton} type="submit">Add Item</button>
        </form>
      </section>

      {/* Payments */}
      <section className={commonStyles.card}>
        <h2>Payments</h2>
        {paymentsList.length > 0 ? (
          <table className={commonStyles.table}>
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr>
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
        ) : (
          <p className={commonStyles.muted}>No payments recorded</p>
        )}

        <h3>Record Payment</h3>
        <form action={recordPayment} className={commonStyles.grid}>
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <label>
            Amount ($) *
            <input className={commonStyles.input} name="amount" type="number" step="0.01" min="0.01" required />
          </label>
          <label>
            Method
            <select className={commonStyles.select} name="method">
              <option value="">— Select —</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="check">Check</option>
              <option value="paypal">PayPal</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Reference #
            <input className={commonStyles.input} name="referenceNumber" placeholder="Transaction ID" />
          </label>
          <label>
            Payment Date
            <input className={commonStyles.input} name="paidAt" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </label>
          <button className={commonStyles.button} type="submit">Record Payment</button>
        </form>
      </section>
    </main>
  );
}
