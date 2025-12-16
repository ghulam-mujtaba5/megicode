import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { clients, clientContacts, projects, proposals, invoices, meetings, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

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
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <line x1="9" y1="22" x2="9" y2="22.01"/>
      <line x1="15" y1="22" x2="15" y2="22.01"/>
      <line x1="12" y1="22" x2="12" y2="22.01"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="4" y1="10" x2="20" y2="10"/>
      <line x1="4" y1="14" x2="20" y2="14"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
};

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
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/clients" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Client</span>
            </div>
            <h1 className={styles.pageTitle}>{client.name}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(client.createdAt)}</p>
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Client Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Company</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.building}</span>
                      <span>{client.company || <span className={styles.textMuted}>—</span>}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Website</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.globe}</span>
                      {client.website ? (
                        <a href={client.website} target="_blank" rel="noopener" className={styles.link}>{client.website}</a>
                      ) : (
                        <span className={styles.textMuted}>—</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Industry</p>
                    <span>{client.industry || <span className={styles.textMuted}>—</span>}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Billing Email</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.mail}</span>
                      <span>{client.billingEmail || <span className={styles.textMuted}>—</span>}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Timezone</p>
                    <span>{client.timezone || <span className={styles.textMuted}>—</span>}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={`${styles.badge} ${client.status === 'active' ? styles.badgeSuccess : client.status === 'churned' ? styles.badgeError : styles.badgeDefault}`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contacts */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Contacts</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {contacts.length > 0 ? (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {c.name}
                                {c.isPrimary && <span className={styles.badge} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Primary</span>}
                              </div>
                            </td>
                            <td>{c.role || '—'}</td>
                            <td>{c.email || '—'}</td>
                            <td>{c.phone || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No contacts yet.
                  </div>
                )}
                
                <div style={{ padding: '24px', borderTop: '1px solid var(--int-border)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Add Contact</h3>
                  <form action={addContact} className={styles.form}>
                    <input type="hidden" name="clientId" value={client.id} />
                    <div className={styles.grid2}>
                      <div>
                        <label className={styles.formLabel}>Name *</label>
                        <input className={styles.input} name="name" required placeholder="John Doe" />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Email</label>
                        <input className={styles.input} name="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Phone</label>
                        <input className={styles.input} name="phone" placeholder="+1 555..." />
                      </div>
                      <div>
                        <label className={styles.formLabel}>Role</label>
                        <input className={styles.input} name="role" placeholder="CEO, PO, Finance..." />
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="isPrimary" />
                        <span>Primary Contact</span>
                      </label>
                    </div>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ marginTop: '16px' }}>
                      {Icons.plus} Add Contact
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* Recent Meetings */}
            {clientMeetings.length > 0 && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Recent Meetings</h2>
                </div>
                <div className={styles.cardBody} style={{ padding: 0 }}>
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Scheduled</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
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
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className={styles.form}>
            
            {/* Financial Summary */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Financial Summary</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ marginBottom: '16px' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Total Invoiced</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${(totalInvoiced / 100).toFixed(2)}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Total Paid</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-success)' }}>${(totalPaid / 100).toFixed(2)}</div>
                </div>
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--int-border)' }}>
                  <div className={styles.textMuted} style={{ fontSize: '0.9rem' }}>Outstanding</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: (totalInvoiced - totalPaid) > 0 ? 'var(--int-error)' : 'var(--int-text)' }}>
                    ${((totalInvoiced - totalPaid) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Overview</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>Projects</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{clientProjects.length}</div>
                  </div>
                  <div>
                    <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>Proposals</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{clientProposals.length}</div>
                  </div>
                  <div>
                    <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>Invoices</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{clientInvoices.length}</div>
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
                <form action={updateClient} className={styles.form}>
                  <input type="hidden" name="id" value={client.id} />
                  <div>
                    <label className={styles.formLabel}>Status</label>
                    <select className={styles.select} name="status" defaultValue={client.status}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="churned">Churned</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Notes</label>
                    <textarea className={styles.textarea} name="notes" defaultValue={client.notes || ''} rows={3} />
                  </div>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    Update Client
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
