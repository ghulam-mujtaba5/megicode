import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, users, projects, processInstances, tasks, events } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  await requireRole(['admin', 'pm']);

  const db = getDb();
  const lead = await db.select().from(leads).where(eq(leads.id, params.id)).get();
  if (!lead) notFound();

  const team = await db.select().from(users).orderBy(desc(users.createdAt)).all();

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
    </main>
  );
}
