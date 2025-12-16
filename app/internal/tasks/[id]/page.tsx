import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc, and } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireInternalSession, requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { tasks, taskComments, taskChecklists, timeEntries, processInstances, projects, users, events, attachments } from '@/lib/db/schema';
import { formatDateTime, taskStatusColor, type BadgeColor } from '@/lib/internal/ui';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
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

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireInternalSession();
  const { id } = await params;
  const db = getDb();
  const userId = session.user.id;

  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!task) notFound();

  const comments = await db.select({
    comment: taskComments,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(taskComments)
  .leftJoin(users, eq(taskComments.authorUserId, users.id))
  .where(eq(taskComments.taskId, id))
  .orderBy(desc(taskComments.createdAt))
  .all();

  const checklists = await db.select().from(taskChecklists).where(eq(taskChecklists.taskId, id)).orderBy(taskChecklists.sortOrder).all();
  const timeEntriesList = await db.select({
    entry: timeEntries,
    userName: users.name,
  })
  .from(timeEntries)
  .leftJoin(users, eq(timeEntries.userId, users.id))
  .where(eq(timeEntries.taskId, id))
  .orderBy(desc(timeEntries.createdAt))
  .all();

  const instance = await db.select().from(processInstances).where(eq(processInstances.id, task.instanceId)).get();
  const project = instance?.projectId ? await db.select().from(projects).where(eq(projects.id, instance.projectId)).get() : null;
  const assignedUser = task.assignedToUserId ? await db.select().from(users).where(eq(users.id, task.assignedToUserId)).get() : null;
  const usersList = await db.select().from(users).all();

  const attachmentsList = await db.select({
    attachment: attachments,
    uploaderName: users.name,
  })
  .from(attachments)
  .leftJoin(users, eq(attachments.uploadedByUserId, users.id))
  .where(and(eq(attachments.entityType, 'task'), eq(attachments.entityId, id)))
  .orderBy(desc(attachments.createdAt))
  .all();

  async function updateTask(formData: FormData) {
    'use server';
    await requireInternalSession();
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const status = String(formData.get('status') ?? '').trim() as typeof task.status;
    const assignedToUserId = String(formData.get('assignedToUserId') ?? '').trim() || null;
    const dueAt = formData.get('dueAt') ? new Date(String(formData.get('dueAt'))) : null;

    if (!id) return;

    const now = new Date();
    const completedAt = status === 'done' ? now : null;

    await db.update(tasks).set({
      status,
      assignedToUserId,
      dueAt,
      completedAt,
      updatedAt: now,
    }).where(eq(tasks.id, id));

    redirect(`/internal/tasks/${id}`);
  }

  async function addComment(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const taskId = String(formData.get('taskId') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();

    if (!taskId || !content) return;

    await db.insert(taskComments).values({
      id: crypto.randomUUID(),
      taskId,
      authorUserId: session.user.id ?? null,
      content,
      createdAt: new Date(),
    });

    redirect(`/internal/tasks/${taskId}`);
  }

  async function addChecklistItem(formData: FormData) {
    'use server';
    await requireInternalSession();
    const db = getDb();

    const taskId = String(formData.get('taskId') ?? '').trim();
    const title = String(formData.get('label') ?? '').trim();

    if (!taskId || !title) return;

    const existing = await db.select().from(taskChecklists).where(eq(taskChecklists.taskId, taskId)).all();

    await db.insert(taskChecklists).values({
      id: crypto.randomUUID(),
      taskId,
      title,
      isCompleted: false,
      sortOrder: existing.length,
    });

    redirect(`/internal/tasks/${taskId}`);
  }

  async function toggleChecklist(formData: FormData) {
    'use server';
    await requireInternalSession();
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const isCompleted = formData.get('checked') === 'true';

    if (!id) return;

    await db.update(taskChecklists).set({ isCompleted: !isCompleted }).where(eq(taskChecklists.id, id));

    const item = await db.select().from(taskChecklists).where(eq(taskChecklists.id, id)).get();
    if (item) {
      redirect(`/internal/tasks/${item.taskId}`);
    }
  }

  async function addTimeEntry(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const taskId = String(formData.get('taskId') ?? '').trim();
    const minutes = parseInt(String(formData.get('minutes') ?? '0'), 10);
    const description = String(formData.get('description') ?? '').trim() || null;
    const date = formData.get('date') ? new Date(String(formData.get('date'))) : new Date();

    if (!taskId || minutes <= 0) return;

    const t = await db.select().from(tasks).where(eq(tasks.id, taskId)).get();
    const inst = t ? await db.select().from(processInstances).where(eq(processInstances.id, t.instanceId)).get() : null;

    await db.insert(timeEntries).values({
      id: crypto.randomUUID(),
      taskId,
      projectId: inst?.projectId ?? null,
      userId: session.user.id ?? null,
      minutes,
      description,
      date,
      createdAt: new Date(),
    });

    redirect(`/internal/tasks/${taskId}`);
  }

  async function addAttachment(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const taskId = String(formData.get('taskId') ?? '').trim();
    const filename = String(formData.get('filename') ?? '').trim();
    const url = String(formData.get('url') ?? '').trim();

    if (!taskId || !filename || !url) return;

    await db.insert(attachments).values({
      id: crypto.randomUUID(),
      entityType: 'task',
      entityId: taskId,
      filename,
      url,
      uploadedByUserId: session.user.id ?? null,
      createdAt: new Date(),
    });

    redirect(`/internal/tasks/${taskId}`);
  }

  const totalMinutes = timeEntriesList.reduce((sum, t) => sum + t.entry.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const checkedCount = checklists.filter(c => c.isCompleted).length;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/tasks" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Task</span>
            </div>
            <h1 className={styles.pageTitle}>{task.title}</h1>
            <p className={styles.pageSubtitle}>Key: {task.key}</p>
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={badgeClass(taskStatusColor(task.status))}>{task.status}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Assigned To</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--int-text-muted)' }}>
                        {Icons.user}
                      </div>
                      <span>{assignedUser?.name || assignedUser?.email || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Project</p>
                    {project ? (
                      <Link href={`/internal/projects/${project.id}`} style={{ color: 'var(--int-primary)', fontWeight: 500 }}>
                        {project.name}
                      </Link>
                    ) : (
                      <span className={styles.textMuted}>—</span>
                    )}
                  </div>
                  <div>
                    <p className={styles.label}>Due Date</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {task.dueAt && <span style={{ color: 'var(--int-text-muted)' }}>{Icons.calendar}</span>}
                      <span>{task.dueAt ? formatDateTime(task.dueAt) : <span className={styles.textMuted}>No due date</span>}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Checklist ({checkedCount}/{checklists.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {checklists.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {checklists.map((item) => (
                      <li key={item.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <form action={toggleChecklist} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="checked" value={String(item.isCompleted)} />
                          <button type="submit" style={{ 
                            cursor: 'pointer', 
                            background: item.isCompleted ? 'var(--int-success)' : 'transparent',
                            border: `2px solid ${item.isCompleted ? 'var(--int-success)' : 'var(--int-border)'}`,
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.2s'
                          }}>
                            {item.isCompleted && Icons.check}
                          </button>
                        </form>
                        <span style={{ 
                          textDecoration: item.isCompleted ? 'line-through' : 'none', 
                          opacity: item.isCompleted ? 0.6 : 1,
                          color: item.isCompleted ? 'var(--int-text-muted)' : 'var(--int-text)'
                        }}>
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.textMuted} style={{ marginBottom: '24px' }}>No checklist items</p>
                )}
                <form action={addChecklistItem} className={styles.form}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <div className={styles.inputGroup}>
                    <input className={styles.input} name="label" placeholder="Add checklist item..." required />
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
                  </div>
                </form>
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
                        <div style={{ color: 'var(--int-primary)' }}>{Icons.paperclip}</div>
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
                  <input type="hidden" name="taskId" value={task.id} />
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

            {/* Comments */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Comments ({comments.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addComment} className={styles.form} style={{ marginBottom: '24px' }}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <div className={styles.inputGroup}>
                    <textarea 
                      className={styles.textarea} 
                      name="content" 
                      placeholder="Write a comment..." 
                      rows={3} 
                      required 
                      style={{ minHeight: '80px', borderBottomLeftRadius: 'var(--int-radius)', borderBottomRightRadius: 0 }}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1px' }}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: '100%' }}>
                      {Icons.send} Post Comment
                    </button>
                  </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {comments.length === 0 ? (
                    <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No comments yet</p>
                  ) : (
                    comments.map(({ comment, authorName, authorEmail }) => (
                      <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
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
                            <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>{formatDateTime(comment.createdAt)}</span>
                          </div>
                          <div style={{ background: 'var(--int-bg-alt)', padding: '12px', borderRadius: 'var(--int-radius)', fontSize: '0.95rem' }}>
                            {comment.content}
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
            
            {/* Update Task */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Update Task</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={updateTask} className={styles.form}>
                  <input type="hidden" name="id" value={task.id} />
                  
                  <div>
                    <label className={styles.formLabel}>Status</label>
                    <select className={styles.select} name="status" defaultValue={task.status}>
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>Assigned To</label>
                    <select className={styles.select} name="assignedToUserId" defaultValue={task.assignedToUserId ?? ''}>
                      <option value="">— Unassigned —</option>
                      {usersList.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>Due Date</label>
                    <input className={styles.input} name="dueAt" type="date" defaultValue={task.dueAt?.toISOString().split('T')[0] ?? ''} />
                  </div>

                  <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%', marginTop: '8px' }}>
                    Update
                  </button>
                </form>
              </div>
            </section>

            {/* Time Tracking */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Time Tracking</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--int-primary)' }}>{Icons.clock}</div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{hours}h {mins}m</div>
                    <div className={styles.textMuted}>Total time logged</div>
                  </div>
                </div>

                <form action={addTimeEntry} className={styles.form} style={{ marginBottom: '24px' }}>
                  <input type="hidden" name="taskId" value={task.id} />
                  
                  <div className={styles.grid2} style={{ gap: '12px' }}>
                    <div>
                      <label className={styles.formLabel}>Minutes *</label>
                      <input className={styles.input} name="minutes" type="number" min="1" required placeholder="60" />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Date</label>
                      <input className={styles.input} name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  
                  <div>
                    <label className={styles.formLabel}>Description</label>
                    <input className={styles.input} name="description" placeholder="What did you work on?" />
                  </div>

                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    Log Time
                  </button>
                </form>

                {timeEntriesList.length > 0 && (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeEntriesList.map(({ entry, userName }) => (
                          <tr key={entry.id}>
                            <td>{formatDateTime(entry.date)}</td>
                            <td>{Math.floor(entry.minutes / 60)}h {entry.minutes % 60}m</td>
                            <td>{userName || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
