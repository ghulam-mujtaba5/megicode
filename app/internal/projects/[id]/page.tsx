import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { desc, eq, and } from 'drizzle-orm';

import styles from '../../styles.module.css';
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
  attachments,
  type TaskStatus,
} from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime, projectStatusColor } from '@/lib/internal/ui';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
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
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
  paperclip: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  )
};

function badgeClass(color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeInfo}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeSuccess}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeWarning}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeError}`;
  return `${styles.badge} ${styles.badgeDefault}`;
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

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireInternalSession();
  const { id } = await params;
  const db = getDb();
  const isPmOrAdmin = session.user.role === 'pm' || session.user.role === 'admin';

  const project = await db.select().from(projects).where(eq(projects.id, id)).get();
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
  
  const attachmentsList = await db.select({
    attachment: attachments,
    uploaderName: users.name,
  })
  .from(attachments)
  .leftJoin(users, eq(attachments.uploadedByUserId, users.id))
  .where(and(eq(attachments.entityType, 'project'), eq(attachments.entityId, id)))
  .orderBy(desc(attachments.createdAt))
  .all();

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

  async function addAttachment(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const filename = String(formData.get('filename') ?? '').trim();
    const url = String(formData.get('url') ?? '').trim();

    if (!projectId || !filename || !url) return;

    await db.insert(attachments).values({
      id: crypto.randomUUID(),
      entityType: 'project',
      entityId: projectId,
      filename,
      url,
      uploadedByUserId: session.user.id ?? null,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

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
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/projects" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Project</span>
            </div>
            <h1 className={styles.pageTitle}>{project.name}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(project.createdAt)}</p>
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Project Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={badgeClass(projectStatusColor(project.status))}>{project.status}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Priority</p>
                    <span className={`${styles.badge} ${
                      project.priority === 'urgent' ? styles.badgeError :
                      project.priority === 'high' ? styles.badgeWarning :
                      project.priority === 'medium' ? styles.badgeInfo :
                      styles.badgeDefault
                    }`}>
                      {project.priority}
                    </span>
                  </div>
                  <div>
                    <p className={styles.label}>Owner</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--int-text-muted)' }}>
                        {Icons.user}
                      </div>
                      <span>{project.ownerUserId ? usersById.get(project.ownerUserId)?.email ?? '' : 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Due Date</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {project.dueAt && <span style={{ color: 'var(--int-text-muted)' }}>{Icons.calendar}</span>}
                      <span>{project.dueAt ? formatDateTime(project.dueAt) : <span className={styles.textMuted}>No due date</span>}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Visualization */}
            {definitionJson && instance && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Process Flow</h2>
                  <span className={styles.textMuted} style={{ fontSize: '0.85rem' }}>Instance: {instance.id.substring(0, 8)}...</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                    {definitionJson.steps.map((s, i) => {
                      const isCurrent = instance.currentStepKey === s.key;
                      const isPast = false; // Logic to determine if past would require more complex state
                      // Simplified: if task for this step is done, it's past? Not necessarily true if parallel.
                      // For now, just highlight current.
                      
                      return (
                        <div key={s.key} style={{ 
                          flex: '0 0 160px', 
                          padding: '12px', 
                          borderRadius: 'var(--int-radius)',
                          background: isCurrent ? 'var(--int-primary-light)' : 'var(--int-bg-alt)',
                          border: isCurrent ? '1px solid var(--int-primary)' : '1px solid transparent',
                          opacity: isCurrent ? 1 : 0.7
                        }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '4px' }}>Step {i + 1}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isCurrent ? 'var(--int-primary)' : 'var(--int-text)' }}>{s.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '4px' }}>{s.key}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Tasks */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Tasks</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {taskRows.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No tasks generated yet.
                  </div>
                ) : (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Status</th>
                          <th>Assignee</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskRows.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{t.title}</div>
                              <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>{t.key}</div>
                            </td>
                            <td>
                              <span className={badgeClass(taskStatusColor(t.status))}>{t.status}</span>
                            </td>
                            <td>
                              {t.assignedToUserId ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    {Icons.user}
                                  </div>
                                  <span style={{ fontSize: '0.9rem' }}>{usersById.get(t.assignedToUserId)?.email?.split('@')[0] ?? ''}</span>
                                </div>
                              ) : (
                                <span className={styles.textMuted}>Unassigned</span>
                              )}
                            </td>
                            <td>
                              <form action={updateTask} style={{ display: 'flex', gap: '8px' }}>
                                <input type="hidden" name="taskId" value={t.id} />
                                <select
                                  className={styles.select}
                                  name="status"
                                  defaultValue={t.status}
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                                >
                                  <option value="todo">Todo</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="blocked">Blocked</option>
                                  <option value="done">Done</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                                <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} type="submit">
                                  Update
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Milestones */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Milestones ({milestonesRows.filter(m => m.completedAt).length}/{milestonesRows.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {milestonesRows.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {milestonesRows.map((m) => (
                      <li key={m.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <form action={toggleMilestone} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="completed" value={String(!!m.completedAt)} />
                          <input type="hidden" name="projectId" value={project.id} />
                          <button type="submit" style={{ 
                            cursor: 'pointer', 
                            background: m.completedAt ? 'var(--int-success)' : 'transparent',
                            border: `2px solid ${m.completedAt ? 'var(--int-success)' : 'var(--int-border)'}`,
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.2s'
                          }}>
                            {m.completedAt && Icons.check}
                          </button>
                        </form>
                        <span style={{ 
                          textDecoration: m.completedAt ? 'line-through' : 'none', 
                          opacity: m.completedAt ? 0.6 : 1,
                          color: m.completedAt ? 'var(--int-text-muted)' : 'var(--int-text)'
                        }}>
                          <strong style={{ fontWeight: 500 }}>{m.title}</strong>
                          {m.dueAt && <span className={styles.textMuted} style={{ fontSize: '0.9rem', marginLeft: '8px' }}>Due: {formatDateTime(m.dueAt)}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.textMuted} style={{ marginBottom: '24px' }}>No milestones defined</p>
                )}
                
                {isPmOrAdmin && (
                  <form action={addMilestone} className={styles.form}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.inputGroup}>
                      <input className={styles.input} name="title" placeholder="New milestone..." required />
                      <input className={styles.input} name="dueAt" type="date" style={{ maxWidth: '150px' }} />
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Attachments */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Attachments ({attachmentsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {attachmentsList.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {attachmentsList.map(({ attachment, uploaderName }) => (
                      <li key={attachment.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ color: 'var(--int-primary)' }}>{Icons.file}</div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontWeight: 500, color: 'var(--int-text)', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {attachment.filename}
                          </a>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                            Added by {uploaderName || 'Unknown'} • {formatDateTime(attachment.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.textMuted} style={{ marginBottom: '24px' }}>No attachments</p>
                )}
                
                <form action={addAttachment} className={styles.form}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className={styles.grid2} style={{ gap: '12px', marginBottom: '12px' }}>
                    <input className={styles.input} name="filename" placeholder="File name / Label" required />
                    <input className={styles.input} name="url" placeholder="URL (Drive, Dropbox...)" required />
                  </div>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    {Icons.plus} Add Link Attachment
                  </button>
                </form>
              </div>
            </section>

            {/* Notes */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Notes ({notes.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addNote} className={styles.form} style={{ marginBottom: '24px' }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className={styles.inputGroup}>
                    <textarea 
                      className={styles.textarea} 
                      name="content" 
                      placeholder="Add a note..." 
                      rows={3} 
                      required 
                      style={{ minHeight: '80px', borderBottomLeftRadius: 'var(--int-radius)', borderBottomRightRadius: 0 }}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1px' }}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: '100%' }}>
                      {Icons.send} Add Note
                    </button>
                  </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {notes.length === 0 ? (
                    <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No notes yet</p>
                  ) : (
                    notes.map(({ note, authorName, authorEmail }) => (
                      <div key={note.id} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--int-text-secondary)', flexShrink: 0
                        }}>
                          {Icons.user}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{authorName || authorEmail || 'Unknown'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>{formatDateTime(note.createdAt)}</span>
                          </div>
                          <div style={{ background: 'var(--int-bg-alt)', padding: '12px', borderRadius: 'var(--int-radius)', fontSize: '0.95rem' }}>
                            {note.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.form}>
            
            {/* Project Settings */}
            {isPmOrAdmin && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Settings</h2>
                </div>
                <div className={styles.cardBody}>
                  <form action={updateProject} className={styles.form}>
                    <input type="hidden" name="projectId" value={project.id} />
                    
                    <div>
                      <label className={styles.formLabel}>Status</label>
                      <select className={styles.select} name="status" defaultValue={project.status}>
                        <option value="new">New</option>
                        <option value="active">Active</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_qa">In QA</option>
                        <option value="blocked">Blocked</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.formLabel}>Priority</label>
                      <select className={styles.select} name="priority" defaultValue={project.priority}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%', marginTop: '8px' }}>
                      Update Settings
                    </button>
                  </form>
                </div>
              </section>
            )}

            {/* Time Tracking */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Time Tracking</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--int-primary)' }}>{Icons.clock}</div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                    <div className={styles.textMuted}>Total time logged</div>
                  </div>
                </div>
                <p className={styles.textMuted} style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                  {projectTime.length} time entries recorded
                </p>
              </div>
            </section>

            {/* Invoices */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Invoices</h2>
                <Link href="/internal/invoices" className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                  {Icons.plus}
                </Link>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {projectInvoices.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No invoices.
                  </div>
                ) : (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead><tr><th>#</th><th>Status</th><th>Total</th></tr></thead>
                      <tbody>
                        {projectInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td><Link href={`/internal/invoices/${inv.id}`} style={{ color: 'var(--int-primary)' }}>{inv.invoiceNumber || 'Draft'}</Link></td>
                            <td><span className={`${styles.badge} ${inv.status === 'paid' ? styles.badgeSuccess : styles.badgeWarning}`}>{inv.status}</span></td>
                            <td>${((inv.totalAmount ?? 0) / 100).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Event Log */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Activity Log</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
                <table className={styles.table}>
                  <tbody>
                    {eventRows.map((e) => (
                      <tr key={e.id}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{e.type}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{formatDateTime(e.createdAt)}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--int-text-secondary)' }}>
                            {e.actorUserId ? usersById.get(e.actorUserId)?.email?.split('@')[0] ?? 'System' : 'System'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
