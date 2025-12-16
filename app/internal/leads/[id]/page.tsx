import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, users, projects, processInstances, tasks, events, leadNotes, leadTags, proposals } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(['admin', 'pm']);
  const { id } = await params;

  const db = getDb();
  const lead = await db.select().from(leads).where(eq(leads.id, id)).get();
  if (!lead) notFound();

  const team = await db.select().from(users).orderBy(desc(users.createdAt)).all();
  const notes = await db.select({
    note: leadNotes,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(leadNotes)
  .leftJoin(users, eq(leadNotes.authorUserId, users.id))
  .where(eq(leadNotes.leadId, id))
  .orderBy(desc(leadNotes.createdAt))
  .all();

  const tags = await db.select().from(leadTags).where(eq(leadTags.leadId, id)).all();
  const leadProposals = await db.select().from(proposals).where(eq(proposals.leadId, id)).orderBy(desc(proposals.createdAt)).all();

  async function addNote(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const leadId = String(formData.get('leadId') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();

    if (!leadId || !content) return;

    await db.insert(leadNotes).values({
      id: crypto.randomUUID(),
      leadId,
      authorUserId: session.user.id ?? null,
      content,
      createdAt: new Date(),
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function addTag(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const leadId = String(formData.get('leadId') ?? '').trim();
    const tag = String(formData.get('tag') ?? '').trim().toLowerCase();

    if (!leadId || !tag) return;

    // Check if tag already exists
    const existing = await db.select().from(leadTags).where(and(eq(leadTags.leadId, leadId), eq(leadTags.tag, tag))).get();
    if (!existing) {
      await db.insert(leadTags).values({
        id: crypto.randomUUID(),
        leadId,
        tag,
      });
    }

    redirect(`/internal/leads/${leadId}`);
  }

  async function removeTag(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const leadId = String(formData.get('leadId') ?? '').trim();

    if (!id) return;

    await db.delete(leadTags).where(eq(leadTags.id, id));
    redirect(`/internal/leads/${leadId}`);
  }

  async function updateStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const leadId = String(formData.get('leadId') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as typeof lead.status;

    if (!leadId) return;

    await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, leadId));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId,
      type: `lead.status_changed`,
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ newStatus: status }),
      createdAt: new Date(),
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function convertToProject(formData: FormData) {
    'use server';

    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const leadId = String(formData.get('leadId') ?? '').trim();
    if (!leadId) notFound();
    const leadRow = await db.select().from(leads).where(eq(leads.id, leadId)).get();
    if (!leadRow) notFound();
    if (leadRow.status === 'converted') {
      redirect(`/internal/projects?fromLead=${leadId}`);
    }

    const projectName = String(formData.get('projectName') ?? '').trim() || `${leadRow.name} Project`;
    const ownerUserId = String(formData.get('ownerUserId') ?? '').trim() || null;
    const priority = String(formData.get('priority') ?? 'medium').trim() || 'medium';
    const dueAtStr = String(formData.get('dueAt') ?? '').trim();
    const dueAt = dueAtStr ? new Date(dueAtStr) : null;

    const now = new Date();
    const projectId = crypto.randomUUID();

    await db.insert(projects).values({
      id: projectId,
      leadId,
      name: projectName,
      ownerUserId,
      status: 'new',
      priority,
      startAt: now,
      dueAt,
      createdAt: now,
      updatedAt: now,
    });

    await db
      .update(leads)
      .set({ status: 'converted', updatedAt: now })
      .where(eq(leads.id, leadId));

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

    // Generate tasks from steps
    for (const step of json.steps) {
      const assignedToUserId =
        step.recommendedRole === 'pm' ? ownerUserId : null;

      await db.insert(tasks).values({
        id: crypto.randomUUID(),
        instanceId,
        key: step.key,
        title: step.title,
        status: 'todo',
        assignedToUserId,
        createdAt: now,
        updatedAt: now,
      });
    }

    await db.insert(events).values([
      {
        id: crypto.randomUUID(),
        leadId,
        projectId,
        type: 'lead.converted',
        actorUserId: session.user.id ?? null,
        payloadJson: JSON.stringify({ projectId }),
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        instanceId,
        type: 'instance.started',
        actorUserId: session.user.id ?? null,
        payloadJson: JSON.stringify({ processDefinitionId }),
        createdAt: now,
      },
    ]);

    redirect(`/internal/projects/${projectId}`);
  }

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Lead</h1>
        <Link href="/internal/leads">Back</Link>
      </div>

      <section className={commonStyles.card}>
        <div className={commonStyles.grid2}>
          <div>
            <h2>{lead.name}</h2>
            <p className={commonStyles.muted}>{lead.email ?? ''}</p>
            <p className={commonStyles.muted}>Created: {formatDateTime(lead.createdAt)}</p>
          </div>
          <div>
            <p>
              <strong>Status:</strong> {lead.status}
            </p>
            <p>
              <strong>Company:</strong> {lead.company ?? ''}
            </p>
            <p>
              <strong>Phone:</strong> {lead.phone ?? ''}
            </p>
            <p>
              <strong>Service:</strong> {lead.service ?? ''}
            </p>
          </div>
        </div>

        {lead.message ? (
          <div>
            <h3>Message</h3>
            <p className={commonStyles.muted}>{lead.message}</p>
          </div>
        ) : null}
      </section>

      <section className={commonStyles.card}>
        <h2>Convert to Project</h2>
        <form action={convertToProject} className={commonStyles.grid}>
          <input type="hidden" name="leadId" value={lead.id} />
          <label>
            Project name
            <input className={commonStyles.input} name="projectName" defaultValue={`${lead.name} Project`} />
          </label>

          <label>
            Owner (PM)
            <select className={commonStyles.select} name="ownerUserId" defaultValue="">
              <option value="">Unassigned</option>
              {team.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email} ({u.role})
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority
            <select className={commonStyles.select} name="priority" defaultValue="medium">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <label>
            Due date
            <input className={commonStyles.input} name="dueAt" type="date" />
          </label>

          <button className={commonStyles.button} type="submit">
            Create Project + Start Process
          </button>
        </form>
      </section>

      {/* Status Update */}
      <section className={commonStyles.card}>
        <h2>Update Status</h2>
        <form action={updateStatus} className={commonStyles.row}>
          <input type="hidden" name="leadId" value={lead.id} />
          <select className={commonStyles.select} name="status" defaultValue={lead.status} style={{ flex: 1 }}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="negotiating">Negotiating</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <button className={commonStyles.secondaryButton} type="submit">Update</button>
        </form>
      </section>

      {/* Tags */}
      <section className={commonStyles.card}>
        <h2>Tags</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {tags.length === 0 ? (
            <span className={commonStyles.muted}>No tags</span>
          ) : (
            tags.map((t) => (
              <form key={t.id} action={removeTag} style={{ display: 'inline' }}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="leadId" value={lead.id} />
                <button 
                  type="submit" 
                  className={`${commonStyles.badge} ${commonStyles.badgeBlue}`}
                  style={{ cursor: 'pointer', border: 'none' }}
                  title="Click to remove"
                >
                  {t.tag} ×
                </button>
              </form>
            ))
          )}
        </div>
        <form action={addTag} className={commonStyles.row}>
          <input type="hidden" name="leadId" value={lead.id} />
          <input className={commonStyles.input} name="tag" placeholder="Add tag..." style={{ flex: 1 }} required />
          <button className={commonStyles.secondaryButton} type="submit">Add</button>
        </form>
      </section>

      {/* Proposals */}
      <section className={commonStyles.card}>
        <h2>Proposals ({leadProposals.length})</h2>
        {leadProposals.length === 0 ? (
          <p className={commonStyles.muted}>No proposals yet. <Link href={`/internal/proposals`}>Create one</Link></p>
        ) : (
          <table className={commonStyles.table}>
            <thead>
              <tr><th>Title</th><th>Status</th><th>Total</th><th>Created</th></tr>
            </thead>
            <tbody>
              {leadProposals.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/internal/proposals/${p.id}`}>{p.title}</Link></td>
                  <td><span className={`${commonStyles.badge} ${p.status === 'accepted' ? commonStyles.badgeGreen : p.status === 'declined' ? commonStyles.badgeRed : commonStyles.badgeBlue}`}>{p.status}</span></td>
                  <td>${((p.totalAmount ?? 0) / 100).toFixed(2)}</td>
                  <td>{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Notes */}
      <section className={commonStyles.card}>
        <h2>Notes ({notes.length})</h2>
        {notes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {notes.map(({ note, authorName, authorEmail }) => (
              <div key={note.id} style={{ borderLeft: '3px solid var(--border-color)', paddingLeft: 12 }}>
                <div className={commonStyles.muted} style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                  <strong>{authorName || authorEmail || 'Unknown'}</strong> · {formatDateTime(note.createdAt)}
                </div>
                <p style={{ margin: 0 }}>{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={commonStyles.muted}>No notes yet</p>
        )}
        <form action={addNote} className={commonStyles.grid}>
          <input type="hidden" name="leadId" value={lead.id} />
          <textarea className={commonStyles.textarea} name="content" placeholder="Add a note..." rows={3} required></textarea>
          <button className={commonStyles.secondaryButton} type="submit">Add Note</button>
        </form>
      </section>
    </main>
  );
}
