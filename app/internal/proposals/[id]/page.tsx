import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole, requireInternalSession } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { proposals, proposalItems, leads, clients, events, projects, processInstances, tasks } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';

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
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Proposal: {proposal.title}</h1>
        <Link href="/internal/proposals">Back</Link>
      </div>

      <div className={commonStyles.grid2}>
        {/* Proposal Info */}
        <section className={commonStyles.card}>
          <h2>Details</h2>
          <div className={commonStyles.grid}>
            <p><strong>Status:</strong> <span className={`${commonStyles.badge} ${proposal.status === 'accepted' ? commonStyles.badgeGreen : proposal.status === 'declined' ? commonStyles.badgeRed : commonStyles.badgeBlue}`}>{proposal.status}</span></p>
            <p><strong>Cost Model:</strong> {proposal.costModel}</p>
            <p><strong>Total:</strong> ${((proposal.totalAmount ?? 0) / 100).toFixed(2)}</p>
            <p><strong>Lead:</strong> {lead ? <Link href={`/internal/leads/${lead.id}`}>{lead.name}</Link> : '—'}</p>
            <p><strong>Client:</strong> {client ? <Link href={`/internal/clients/${client.id}`}>{client.name}</Link> : '—'}</p>
            <p><strong>Created:</strong> {formatDateTime(proposal.createdAt)}</p>
            {proposal.sentAt && <p><strong>Sent:</strong> {formatDateTime(proposal.sentAt)}</p>}
            {proposal.acceptedAt && <p><strong>Accepted:</strong> {formatDateTime(proposal.acceptedAt)}</p>}
          </div>
          {proposal.summary && (
            <div>
              <h3>Summary</h3>
              <p className={commonStyles.muted}>{proposal.summary}</p>
            </div>
          )}
        </section>

        {/* Status Actions */}
        <section className={commonStyles.card}>
          <h2>Actions</h2>
          <form action={updateStatus} className={commonStyles.grid}>
            <input type="hidden" name="id" value={proposal.id} />
            <label>
              Change Status
              <select className={commonStyles.select} name="status" defaultValue={proposal.status}>
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                {isAdmin && <option value="approved">Approved</option>}
                <option value="sent">Sent</option>
                <option value="revised">Revised</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Update Status</button>
          </form>

          {proposal.status === 'accepted' && (
            <form action={convertToProject} className={commonStyles.grid} style={{ marginTop: 20 }}>
              <input type="hidden" name="proposalId" value={proposal.id} />
              <label>
                Project Name
                <input className={commonStyles.input} name="projectName" defaultValue={`${proposal.title} Project`} required />
              </label>
              <button className={commonStyles.button} type="submit">Create Project from Proposal</button>
            </form>
          )}
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
          <p className={commonStyles.muted}>No line items yet</p>
        )}

        <h3>Add Item</h3>
        <form action={addItem} className={commonStyles.grid}>
          <input type="hidden" name="proposalId" value={proposal.id} />
          <label>
            Description *
            <input className={commonStyles.input} name="description" required placeholder="e.g. Frontend Development" />
          </label>
          <div className={commonStyles.row}>
            <label style={{ flex: 1 }}>
              Quantity
              <input className={commonStyles.input} name="quantity" type="number" min="1" defaultValue="1" />
            </label>
            <label style={{ flex: 1 }}>
              Unit Price ($)
              <input className={commonStyles.input} name="unitPrice" type="number" step="0.01" min="0" placeholder="0.00" />
            </label>
          </div>
          <button className={commonStyles.secondaryButton} type="submit">Add Item</button>
        </form>
      </section>
    </main>
  );
}
