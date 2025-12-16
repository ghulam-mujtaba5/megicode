import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireInternalSession, requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import {
  events,
  processDefinitions,
  processInstances,
  projects,
  tasks,
  users,
  milestones,
  projectNotes,
  timeEntries,
  invoices,
  type TaskStatus,
} from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime, projectStatusColor } from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

function nextCurrentStepKey(orderedKeys: string[], tasksByKey: Map<string, { status: string }>) {
  for (const key of orderedKeys) {
    const task = tasksByKey.get(key);
    if (!task) continue;
    if (task.status !== 'done' && task.status !== 'canceled') return key;
  }
  return null;
}

function deriveProjectStatus(currentStepKey: string | null, taskRows: Array<{ status: string }>) {
  if (taskRows.some((t) => t.status === 'blocked')) return 'blocked' as const;
  if (taskRows.every((t) => t.status === 'done' || t.status === 'canceled')) return 'closed' as const;
  if (currentStepKey === 'qa' || currentStepKey === 'testing') return 'in_qa' as const;
  if (taskRows.some((t) => t.status === 'in_progress')) return 'in_progress' as const;
  return 'new' as const;
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await requireInternalSession();
  const db = getDb();
  const isPmOrAdmin = session.user.role === 'pm' || session.user.role === 'admin';

  const project = await db.select().from(projects).where(eq(projects.id, params.id)).get();
  if (!project) notFound();

  const instance = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.projectId, project.id))
    .orderBy(desc(processInstances.startedAt))
    .get();

  const taskRows = instance
    ? await db
        .select()
        .from(tasks)
        .where(eq(tasks.instanceId, instance.id))
        .all()
    : [];

  const userRows = await db.select().from(users).all();
  const usersById = new Map(userRows.map((u) => [u.id, u] as const));

  const eventRows = await db
    .select()
    .from(events)
    .where(eq(events.projectId, project.id))
    .orderBy(desc(events.createdAt))
    .limit(20)
    .all();

  const definitionRow = instance
    ? await db.select().from(processDefinitions).where(eq(processDefinitions.id, instance.processDefinitionId)).get()
    : null;

  const definitionJson = definitionRow
    ? (JSON.parse(definitionRow.json) as { steps: Array<{ key: string; title: string }> })
    : null;

  const milestonesRows = await db.select().from(milestones).where(eq(milestones.projectId, project.id)).orderBy(milestones.dueAt).all();
  
  const notes = await db.select({
    note: projectNotes,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(projectNotes)
  .leftJoin(users, eq(projectNotes.authorUserId, users.id))
  .where(eq(projectNotes.projectId, project.id))
  .orderBy(desc(projectNotes.createdAt))
  .all();

  const projectTime = await db.select().from(timeEntries).where(eq(timeEntries.projectId, project.id)).all();
  const totalMinutes = projectTime.reduce((sum, t) => sum + t.minutes, 0);

  const projectInvoices = await db.select().from(invoices).where(eq(invoices.projectId, project.id)).orderBy(desc(invoices.createdAt)).all();

  async function addMilestone(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const dueAt = formData.get('dueAt') ? new Date(String(formData.get('dueAt'))) : null;

    if (!projectId || !title) return;

    await db.insert(milestones).values({
      id: crypto.randomUUID(),
      projectId,
      title,
      dueAt,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function toggleMilestone(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const completed = formData.get('completed') === 'true';
    const projectId = String(formData.get('projectId') ?? '').trim();

    if (!id) return;

    const now = new Date();
    const isCompleted = formData.get('completed') === 'true';
    await db.update(milestones).set({ 
      completedAt: isCompleted ? null : now 
    }).where(eq(milestones.id, id));

    redirect(`/internal/projects/${projectId}`);
  }

  async function addNote(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();

    if (!projectId || !content) return;

    await db.insert(projectNotes).values({
      id: crypto.randomUUID(),
      projectId,
      authorUserId: session.user.id ?? null,
      content,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateProject(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as typeof project.status;
    const priority = String(formData.get('priority') ?? '').trim() as typeof project.priority;

    if (!projectId) return;

    await db.update(projects).set({ status, priority, updatedAt: new Date() }).where(eq(projects.id, projectId));

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateTask(formData: FormData) {
    'use server';

    const session = await requireInternalSession();
    const db = getDb();

    const taskId = String(formData.get('taskId') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as TaskStatus;
    const assignedToUserId = String(formData.get('assignedToUserId') ?? '').trim() || null;

    if (!taskId) return;

    const taskRow = await db.select().from(tasks).where(eq(tasks.id, taskId)).get();
    if (!taskRow) return;

    const now = new Date();
    const completedAt = status === 'done' ? now : null;

    await db
      .update(tasks)
      .set({
        status,
        assignedToUserId,
        completedAt,
        updatedAt: now,
      })
      .where(eq(tasks.id, taskId));

    // Update instance current step + project status
    const instance = await db.select().from(processInstances).where(eq(processInstances.id, taskRow.instanceId)).get();
    if (instance) {
      const allTasks = await db.select().from(tasks).where(eq(tasks.instanceId, instance.id)).all();
      const defRow = await db.select().from(processDefinitions).where(eq(processDefinitions.id, instance.processDefinitionId)).get();

      const defJson = defRow ? (JSON.parse(defRow.json) as { steps: Array<{ key: string }> }) : null;
      const orderedKeys = defJson?.steps?.map((s) => s.key) ?? allTasks.map((t) => t.key);
      const byKey = new Map(allTasks.map((t) => [t.key, { status: t.status }] as const));
      const currentStepKey = nextCurrentStepKey(orderedKeys, byKey);

      await db.update(processInstances).set({ currentStepKey }).where(eq(processInstances.id, instance.id));

      const projectStatus = deriveProjectStatus(currentStepKey, allTasks);
      await db.update(projects).set({ status: projectStatus, updatedAt: now }).where(eq(projects.id, instance.projectId));

      await db.insert(events).values({
        id: crypto.randomUUID(),
        projectId: instance.projectId,
        instanceId: instance.id,
        type: 'task.updated',
        actorUserId: session.user.id ?? null,
        payloadJson: JSON.stringify({ taskId, status, assignedToUserId }),
        createdAt: now,
      });
    }
  }

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>Project</h1>
        <Link href="/internal/projects">Back</Link>
      </div>

      <section className={commonStyles.card}>
        <div className={commonStyles.grid2}>
          <div>
            <h2>{project.name}</h2>
            <p className={commonStyles.muted}>Created: {formatDateTime(project.createdAt)}</p>
            <p className={commonStyles.muted}>Priority: {project.priority}</p>
          </div>
          <div>
            <p>
              <strong>Status:</strong>{' '}
              <span className={badgeClass(commonStyles, projectStatusColor(project.status))}>{project.status}</span>
            </p>
            <p>
              <strong>Owner:</strong> {project.ownerUserId ? usersById.get(project.ownerUserId)?.email ?? '' : 'Unassigned'}
            </p>
            <p>
              <strong>Due:</strong> {project.dueAt ? formatDateTime(project.dueAt) : ''}
            </p>
          </div>
        </div>
      </section>

      {definitionJson && instance ? (
        <section className={commonStyles.card}>
          <h2>Process</h2>
          <p className={commonStyles.muted}>
            Instance: {instance.id} · Current step: {instance.currentStepKey ?? '—'}
          </p>
          <div className={commonStyles.grid}>
            {definitionJson.steps.map((s) => (
              <div key={s.key} className={commonStyles.row}>
                <div>
                  <strong>{s.title}</strong>
                  <div className={commonStyles.muted}>{s.key}</div>
                </div>
                <div>
                  {instance.currentStepKey === s.key ? (
                    <span className={badgeClass(commonStyles, 'blue')}>current</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className={commonStyles.card}>
        <h2>Tasks</h2>
        {instance ? (
          <p className={commonStyles.muted}>Instance status: {instance.status}</p>
        ) : (
          <p className={commonStyles.muted}>No process instance yet.</p>
        )}

        {taskRows.length ? (
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {taskRows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div>{t.title}</div>
                    <div className={commonStyles.muted}>{t.key}</div>
                  </td>
                  <td>
                    <span className={badgeClass(commonStyles, taskStatusColor(t.status))}>{t.status}</span>
                  </td>
                  <td>{t.assignedToUserId ? usersById.get(t.assignedToUserId)?.email ?? '' : ''}</td>
                  <td>
                    <form action={updateTask} className={commonStyles.grid}>
                      <input type="hidden" name="taskId" value={t.id} />
                      <select
                        className={commonStyles.select}
                        name="status"
                        defaultValue={t.status}
                        aria-label="Task status"
                      >
                        <option value="todo">todo</option>
                        <option value="in_progress">in_progress</option>
                        <option value="blocked">blocked</option>
                        <option value="done">done</option>
                        <option value="canceled">canceled</option>
                      </select>
                      <select
                        className={commonStyles.select}
                        name="assignedToUserId"
                        defaultValue={t.assignedToUserId ?? ''}
                        aria-label="Task assignee"
                      >
                        <option value="">Unassigned</option>
                        {userRows.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.email} ({u.role})
                          </option>
                        ))}
                      </select>
                      <button className={commonStyles.secondaryButton} type="submit">
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={commonStyles.muted}>No tasks generated yet.</p>
        )}
      </section>

      <section className={commonStyles.card}>
        <h2>Event Log</h2>
        <p className={commonStyles.muted}>Latest first. Monitoring and audit for this project.</p>
        <table className={commonStyles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Actor</th>
              <th>Payload</th>
            </tr>
          </thead>
          <tbody>
            {eventRows.map((e) => (
              <tr key={e.id}>
                <td>{formatDateTime(e.createdAt)}</td>
                <td>{e.type}</td>
                <td>{e.actorUserId ? usersById.get(e.actorUserId)?.email ?? e.actorUserId : ''}</td>
                <td>
                  <pre className={commonStyles.pre}>{e.payloadJson ?? ''}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={commonStyles.muted}>Viewer: {session.user.email}</p>
      </section>

      {/* Project Management Actions */}
      {isPmOrAdmin && (
        <section className={commonStyles.card}>
          <h2>Project Settings</h2>
          <form action={updateProject} className={commonStyles.row}>
            <input type="hidden" name="projectId" value={project.id} />
            <label style={{ flex: 1 }}>
              Status
              <select className={commonStyles.select} name="status" defaultValue={project.status}>
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="in_progress">In Progress</option>
                <option value="in_qa">In QA</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>
              Priority
              <select className={commonStyles.select} name="priority" defaultValue={project.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Update</button>
          </form>
        </section>
      )}

      {/* Milestones */}
      <section className={commonStyles.card}>
        <h2>Milestones ({milestonesRows.filter(m => m.completedAt).length}/{milestonesRows.length})</h2>
        {milestonesRows.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {milestonesRows.map((m) => (
              <li key={m.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <form action={toggleMilestone} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="completed" value={String(!!m.completedAt)} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <button type="submit" style={{ 
                    cursor: 'pointer', 
                    background: m.completedAt ? 'var(--success)' : 'transparent',
                    border: '2px solid var(--border-color)',
                    borderRadius: 4,
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}>
                    {m.completedAt && '✓'}
                  </button>
                </form>
                <span style={{ textDecoration: m.completedAt ? 'line-through' : 'none', opacity: m.completedAt ? 0.6 : 1 }}>
                  <strong>{m.title}</strong>
                  {m.dueAt && <span className={commonStyles.muted}> · Due: {formatDateTime(m.dueAt)}</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonStyles.muted}>No milestones defined</p>
        )}
        {isPmOrAdmin && (
          <form action={addMilestone} className={commonStyles.row} style={{ marginTop: 16 }}>
            <input type="hidden" name="projectId" value={project.id} />
            <input className={commonStyles.input} name="title" placeholder="New milestone..." style={{ flex: 1 }} required />
            <input className={commonStyles.input} name="dueAt" type="date" style={{ width: 'auto' }} />
            <button className={commonStyles.secondaryButton} type="submit">Add</button>
          </form>
        )}
      </section>

      {/* Time & Invoices Summary */}
      <div className={commonStyles.grid2}>
        <section className={commonStyles.card}>
          <h2>Time Tracking</h2>
          <p><strong>Total Time:</strong> {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
          <p className={commonStyles.muted}>{projectTime.length} time entries</p>
        </section>

        <section className={commonStyles.card}>
          <h2>Invoices</h2>
          {projectInvoices.length === 0 ? (
            <p className={commonStyles.muted}>No invoices. <Link href="/internal/invoices">Create one</Link></p>
          ) : (
            <table className={commonStyles.table}>
              <thead><tr><th>#</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {projectInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><Link href={`/internal/invoices/${inv.id}`}>{inv.invoiceNumber || 'Draft'}</Link></td>
                    <td><span className={`${commonStyles.badge} ${inv.status === 'paid' ? commonStyles.badgeGreen : commonStyles.badgeYellow}`}>{inv.status}</span></td>
                    <td>${((inv.totalAmount ?? 0) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Project Notes */}
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
          <input type="hidden" name="projectId" value={project.id} />
          <textarea className={commonStyles.textarea} name="content" placeholder="Add a note..." rows={3} required></textarea>
          <button className={commonStyles.secondaryButton} type="submit">Add Note</button>
        </form>
      </section>
    </main>
  );
}
