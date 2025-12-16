import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { clients, clientContacts, projects, proposals, invoices, meetings, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(['admin', 'pm']);
  const { id } = await params;
  const db = getDb();

  const client = await db.select().from(clients).where(eq(clients.id, id)).get();
  if (!client) notFound();

  const contacts = await db.select().from(clientContacts).where(eq(clientContacts.clientId, id)).all();
  const clientProjects = await db.select().from(projects).where(eq(projects.leadId, id)).orderBy(desc(projects.createdAt)).all();
  const clientProposals = await db.select().from(proposals).where(eq(proposals.clientId, id)).orderBy(desc(proposals.createdAt)).all();
  const clientInvoices = await db.select().from(invoices).where(eq(invoices.clientId, id)).orderBy(desc(invoices.createdAt)).all();
  const clientMeetings = await db.select().from(meetings).where(eq(meetings.clientId, id)).orderBy(desc(meetings.scheduledAt)).limit(10).all();

  async function addContact(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const clientId = String(formData.get('clientId') ?? '').trim();
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim() || null;
    const phone = String(formData.get('phone') ?? '').trim() || null;
    const role = String(formData.get('role') ?? '').trim() || null;
    const isPrimary = formData.get('isPrimary') === 'on';

    if (!name || !clientId) return;

    await db.insert(clientContacts).values({
      id: crypto.randomUUID(),
      clientId,
      name,
      email,
      phone,
      role,
      isPrimary,
      createdAt: new Date(),
    });

    redirect(`/internal/clients/${clientId}`);
  }

  async function updateClient(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as 'active' | 'inactive' | 'churned';
    const notes = String(formData.get('notes') ?? '').trim() || null;

    if (!id) return;

    const now = new Date();
    await db.update(clients).set({ status, notes, updatedAt: now }).where(eq(clients.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      type: 'client.updated',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ clientId: id, status }),
      createdAt: now,
    });

    redirect(`/internal/clients/${id}`);
  }

  const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Client: {client.name}</h1>
        <Link href="/internal/clients">Back to Clients</Link>
      </div>

      <div className={commonStyles.grid2}>
        {/* Client Info */}
        <section className={commonStyles.card}>
          <h2>Details</h2>
          <div className={commonStyles.grid}>
            <p><strong>Company:</strong> {client.company || '—'}</p>
            <p><strong>Website:</strong> {client.website ? <a href={client.website} target="_blank" rel="noopener">{client.website}</a> : '—'}</p>
            <p><strong>Industry:</strong> {client.industry || '—'}</p>
            <p><strong>Billing Email:</strong> {client.billingEmail || '—'}</p>
            <p><strong>Timezone:</strong> {client.timezone || '—'}</p>
            <p><strong>Status:</strong> <span className={`${commonStyles.badge} ${client.status === 'active' ? commonStyles.badgeGreen : client.status === 'churned' ? commonStyles.badgeRed : commonStyles.badgeGray}`}>{client.status}</span></p>
            <p><strong>Created:</strong> {formatDateTime(client.createdAt)}</p>
          </div>

          <h3>Update Status</h3>
          <form action={updateClient} className={commonStyles.grid}>
            <input type="hidden" name="id" value={client.id} />
            <label>
              Status
              <select className={commonStyles.select} name="status" defaultValue={client.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="churned">Churned</option>
              </select>
            </label>
            <label>
              Notes
              <textarea className={commonStyles.textarea} name="notes" defaultValue={client.notes || ''} />
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Update</button>
          </form>
        </section>

        {/* Contacts */}
        <section className={commonStyles.card}>
          <h2>Contacts</h2>
          {contacts.length > 0 ? (
            <table className={commonStyles.table}>
              <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th></tr></thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name} {c.isPrimary && <span className={commonStyles.badge}>Primary</span>}</td>
                    <td>{c.role || '—'}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={commonStyles.muted}>No contacts yet</p>
          )}

          <h3>Add Contact</h3>
          <form action={addContact} className={commonStyles.grid}>
            <input type="hidden" name="clientId" value={client.id} />
            <label>Name * <input className={commonStyles.input} name="name" required /></label>
            <label>Email <input className={commonStyles.input} name="email" type="email" /></label>
            <label>Phone <input className={commonStyles.input} name="phone" /></label>
            <label>Role <input className={commonStyles.input} name="role" placeholder="CEO, PO, Finance..." /></label>
            <label className={commonStyles.row}>
              <input type="checkbox" name="isPrimary" /> Primary Contact
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Add Contact</button>
          </form>
        </section>
      </div>

      {/* Financial Summary */}
      <section className={commonStyles.card}>
        <h2>Financial Summary</h2>
        <div className={commonStyles.grid2}>
          <div>
            <p><strong>Total Invoiced:</strong> ${(totalInvoiced / 100).toFixed(2)}</p>
            <p><strong>Total Paid:</strong> ${(totalPaid / 100).toFixed(2)}</p>
            <p><strong>Outstanding:</strong> ${((totalInvoiced - totalPaid) / 100).toFixed(2)}</p>
          </div>
          <div>
            <p><strong>Projects:</strong> {clientProjects.length}</p>
            <p><strong>Proposals:</strong> {clientProposals.length}</p>
            <p><strong>Invoices:</strong> {clientInvoices.length}</p>
          </div>
        </div>
      </section>

      {/* Recent Meetings */}
      {clientMeetings.length > 0 && (
        <section className={commonStyles.card}>
          <h2>Recent Meetings</h2>
          <table className={commonStyles.table}>
            <thead><tr><th>Title</th><th>Scheduled</th><th>Duration</th></tr></thead>
            <tbody>
              {clientMeetings.map((m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{formatDateTime(m.scheduledAt)}</td>
                  <td>{m.durationMinutes ? `${m.durationMinutes} min` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
