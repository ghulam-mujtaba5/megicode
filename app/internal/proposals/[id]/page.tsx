import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole, requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { proposals, proposalItems, leads, clients, events, projects, processInstances, tasks } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  fileText: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
};

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(['admin', 'pm']);
  const { id } = await params;
  const db = getDb();
  const isAdmin = session.user.role === 'admin';

  const proposal = await db.select().from(proposals).where(eq(proposals.id, id)).get();
  if (!proposal) notFound();

  const items = await db.select().from(proposalItems).where(eq(proposalItems.proposalId, id)).orderBy(proposalItems.sortOrder).all();
  const lead = proposal.leadId ? await db.select().from(leads).where(eq(leads.id, proposal.leadId)).get() : null;
  const client = proposal.clientId ? await db.select().from(clients).where(eq(clients.id, proposal.clientId)).get() : null;

  async function addItem(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const proposalId = String(formData.get('proposalId') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const quantity = parseInt(String(formData.get('quantity') ?? '1'), 10);
    const unitPrice = Math.round(parseFloat(String(formData.get('unitPrice') ?? '0')) * 100);

    if (!description || !proposalId) return;

    const maxSort = await db.select().from(proposalItems).where(eq(proposalItems.proposalId, proposalId)).all();
    const sortOrder = maxSort.length;

    await db.insert(proposalItems).values({
      id: crypto.randomUUID(),
      proposalId,
      description,
      quantity,
      unitPrice,
      sortOrder,
    });

    // Recalc total
    const allItems = await db.select().from(proposalItems).where(eq(proposalItems.proposalId, proposalId)).all();
    const total = allItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    await db.update(proposals).set({ totalAmount: total, updatedAt: new Date() }).where(eq(proposals.id, proposalId));

    redirect(`/internal/proposals/${proposalId}`);
  }

  async function deleteItem(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();
    const itemId = String(formData.get('itemId') ?? '').trim();
    const proposalId = String(formData.get('proposalId') ?? '').trim();

    if (!itemId || !proposalId) return;

    await db.delete(proposalItems).where(eq(proposalItems.id, itemId));

    // Recalc total
    const allItems = await db.select().from(proposalItems).where(eq(proposalItems.proposalId, proposalId)).all();
    const total = allItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    await db.update(proposals).set({ totalAmount: total, updatedAt: new Date() }).where(eq(proposals.id, proposalId));

    redirect(`/internal/proposals/${proposalId}`);
  }

  async function updateStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as typeof proposal.status;

    if (!id) return;

    const now = new Date();
    const updates: Partial<typeof proposal> = { status, updatedAt: now };

    if (status === 'approved') updates.approvedByUserId = session.user.id ?? null;
    if (status === 'sent') updates.sentAt = now;
    if (status === 'accepted') updates.acceptedAt = now;

    await db.update(proposals).set(updates).where(eq(proposals.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId: proposal.leadId,
      type: `proposal.${status}`,
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ proposalId: id, status }),
      createdAt: now,
    });

    redirect(`/internal/proposals/${id}`);
  }

  async function approveProposal(formData: FormData) {
    'use server';
    const session = await requireRole(['admin']);
    const db = getDb();
    const id = String(formData.get('id') ?? '').trim();
    if (!id) return;

    const now = new Date();
    await db.update(proposals).set({ 
        status: 'approved', 
        approvedByUserId: session.user.id,
        updatedAt: now 
    }).where(eq(proposals.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId: proposal.leadId,
      type: 'proposal.approved',
      actorUserId: session.user.id,
      payloadJson: JSON.stringify({ proposalId: id }),
      createdAt: now,
    });
    redirect(`/internal/proposals/${id}`);
  }

  async function sendProposal(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();
    const id = String(formData.get('id') ?? '').trim();
    if (!id) return;

    const now = new Date();
    await db.update(proposals).set({ 
        status: 'sent', 
        sentAt: now,
        updatedAt: now 
    }).where(eq(proposals.id, id));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId: proposal.leadId,
      type: 'proposal.sent',
      actorUserId: session.user.id,
      payloadJson: JSON.stringify({ proposalId: id }),
      createdAt: now,
    });
    redirect(`/internal/proposals/${id}`);
  }

  async function convertToProject(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const proposalId = String(formData.get('proposalId') ?? '').trim();
    const projectName = String(formData.get('projectName') ?? '').trim();

    if (!proposalId || !projectName) return;

    const prop = await db.select().from(proposals).where(eq(proposals.id, proposalId)).get();
    if (!prop || prop.status !== 'accepted') return;

    const now = new Date();
    const projectId = crypto.randomUUID();

    await db.insert(projects).values({
      id: projectId,
      leadId: prop.leadId,
      name: projectName,
      ownerUserId: session.user.id ?? null,
      status: 'new',
      priority: 'medium',
      startAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Mark lead as converted if exists
    if (prop.leadId) {
      await db.update(leads).set({ status: 'converted', updatedAt: now }).where(eq(leads.id, prop.leadId));
    }

    // Start process
    const { id: processDefinitionId, json } = await ensureActiveDefaultProcessDefinition();
    const instanceId = crypto.randomUUID();
    const firstStepKey = json.steps[0]?.key ?? null;

    await db.insert(processInstances).values({
      id: instanceId,
      processDefinitionId,
      projectId,
      status: 'running',
      currentStepKey: firstStepKey,
      startedAt: now,
    });

    for (const step of json.steps) {
      await db.insert(tasks).values({
        id: crypto.randomUUID(),
        instanceId,
        key: step.key,
        title: step.title,
        status: 'todo',
        assignedToUserId: step.recommendedRole === 'pm' ? session.user.id : null,
        createdAt: now,
        updatedAt: now,
      });
    }

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId,
      type: 'project.created_from_proposal',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ proposalId, projectId }),
      createdAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/proposals" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Proposal</span>
            </div>
            <h1 className={styles.pageTitle}>{proposal.title}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(proposal.createdAt)}</p>
          </div>
          <div className={styles.headerActions}>
            {proposal.status === 'pending_approval' && isAdmin && (
              <form action={approveProposal}>
                <input type="hidden" name="id" value={proposal.id} />
                <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                  {Icons.check} Approve
                </button>
              </form>
            )}
            {proposal.status === 'approved' && (
              <form action={sendProposal}>
                <input type="hidden" name="id" value={proposal.id} />
                <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                  {Icons.send} Send to Client
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Proposal Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={`${styles.badge} ${
                      proposal.status === 'accepted' ? styles.badgeSuccess : 
                      proposal.status === 'declined' ? styles.badgeError : 
                      proposal.status === 'sent' ? styles.badgeInfo :
                      styles.badgeDefault
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <div>
                    <p className={styles.label}>Cost Model</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.dollar}</span>
                      <span>{proposal.costModel}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Lead</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.user}</span>
                      {lead ? <Link href={`/internal/leads/${lead.id}`} className={styles.link}>{lead.name}</Link> : <span className={styles.textMuted}>—</span>}
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Client</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--int-text-muted)' }}>{Icons.briefcase}</span>
                      {client ? <Link href={`/internal/clients/${client.id}`} className={styles.link}>{client.name}</Link> : <span className={styles.textMuted}>—</span>}
                    </div>
                  </div>
                </div>
                
                {proposal.summary && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--int-border)' }}>
                    <p className={styles.label}>Summary</p>
                    <p style={{ color: 'var(--int-text-secondary)', lineHeight: 1.6 }}>{proposal.summary}</p>
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
                          <th style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.description}</td>
                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>${(item.unitPrice / 100).toFixed(2)}</td>
                            <td style={{ textAlign: 'right' }}>${((item.quantity * item.unitPrice) / 100).toFixed(2)}</td>
                            <td>
                              <form action={deleteItem}>
                                <input type="hidden" name="itemId" value={item.id} />
                                <input type="hidden" name="proposalId" value={proposal.id} />
                                <button className={styles.btnIcon} type="submit" style={{ color: 'var(--int-error)' }}>
                                  {Icons.trash}
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: 'var(--int-bg-alt)', fontWeight: 600 }}>
                          <td colSpan={3} style={{ textAlign: 'right' }}>Total</td>
                          <td style={{ textAlign: 'right' }}>${(itemsTotal / 100).toFixed(2)}</td>
                          <td></td>
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
                    <input type="hidden" name="proposalId" value={proposal.id} />
                    <div className={styles.inputGroup}>
                      <input className={styles.input} name="description" required placeholder="Description (e.g. Frontend Development)" style={{ flex: 2 }} />
                      <input className={styles.input} name="quantity" type="number" min="1" defaultValue="1" placeholder="Qty" style={{ flex: 0.5 }} />
                      <input className={styles.input} name="unitPrice" type="number" step="0.01" min="0" placeholder="Price ($)" style={{ flex: 0.5 }} />
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.form}>
            
            {/* Actions */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Actions</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={updateStatus} className={styles.form}>
                  <input type="hidden" name="id" value={proposal.id} />
                  <div>
                    <label className={styles.formLabel}>Change Status</label>
                    <select className={styles.select} name="status" defaultValue={proposal.status}>
                      <option value="draft">Draft</option>
                      <option value="pending_approval">Pending Approval</option>
                      {isAdmin && <option value="approved">Approved</option>}
                      <option value="sent">Sent</option>
                      <option value="revised">Revised</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    Update Status
                  </button>
                </form>

                {proposal.status === 'accepted' && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--int-border)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Convert to Project</h3>
                    <form action={convertToProject} className={styles.form}>
                      <input type="hidden" name="proposalId" value={proposal.id} />
                      <div>
                        <label className={styles.formLabel}>Project Name</label>
                        <input className={styles.input} name="projectName" defaultValue={`${proposal.title} Project`} required />
                      </div>
                      <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%' }}>
                        {Icons.check} Create Project
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Timeline</h2>
              </div>
              <div className={styles.cardBody}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span className={styles.textMuted}>Created</span>
                    <span>{formatDateTime(proposal.createdAt)}</span>
                  </li>
                  {proposal.sentAt && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span className={styles.textMuted}>Sent</span>
                      <span>{formatDateTime(proposal.sentAt)}</span>
                    </li>
                  )}
                  {proposal.acceptedAt && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <span className={styles.textMuted}>Accepted</span>
                      <span>{formatDateTime(proposal.acceptedAt)}</span>
                    </li>
                  )}
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--int-border)', fontSize: '0.9rem' }}>
                    <span className={styles.textMuted}>Last Updated</span>
                    <span>{formatDateTime(proposal.updatedAt)}</span>
                  </li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
