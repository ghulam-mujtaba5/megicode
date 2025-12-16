import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc, and } from 'drizzle-orm';

import commonStyles from '../../internalCommon.module.css';
import { requireInternalSession, requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { tasks, taskComments, taskChecklists, timeEntries, processInstances, projects, users, events } from '@/lib/db/schema';
import { formatDateTime, taskStatusColor, type BadgeColor } from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
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

  const totalMinutes = timeEntriesList.reduce((sum, t) => sum + t.entry.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const checkedCount = checklists.filter(c => c.isCompleted).length;

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>{task.title}</h1>
        <Link href="/internal/tasks">Back</Link>
      </div>

      <div className={commonStyles.grid2}>
        {/* Task Info */}
        <section className={commonStyles.card}>
          <h2>Details</h2>
          <div className={commonStyles.grid}>
            <p><strong>Key:</strong> {task.key}</p>
            <p><strong>Status:</strong> <span className={badgeClass(commonStyles, taskStatusColor(task.status))}>{task.status}</span></p>
            <p><strong>Assigned:</strong> {assignedUser?.name || assignedUser?.email || 'Unassigned'}</p>
            <p><strong>Project:</strong> {project ? <Link href={`/internal/projects/${project.id}`}>{project.name}</Link> : '—'}</p>
            {task.dueAt && <p><strong>Due:</strong> {formatDateTime(task.dueAt)}</p>}
            {task.completedAt && <p><strong>Completed:</strong> {formatDateTime(task.completedAt)}</p>}
            <p><strong>Time Logged:</strong> {hours}h {mins}m</p>
            <p><strong>Checklist:</strong> {checkedCount}/{checklists.length}</p>
          </div>
        </section>

        {/* Update Task */}
        <section className={commonStyles.card}>
          <h2>Update Task</h2>
          <form action={updateTask} className={commonStyles.grid}>
            <input type="hidden" name="id" value={task.id} />
            <label>
              Status
              <select className={commonStyles.select} name="status" defaultValue={task.status}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
            <label>
              Assigned To
              <select className={commonStyles.select} name="assignedToUserId" defaultValue={task.assignedToUserId ?? ''}>
                <option value="">— Unassigned —</option>
                {usersList.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </label>
            <label>
              Due Date
              <input className={commonStyles.input} name="dueAt" type="date" defaultValue={task.dueAt?.toISOString().split('T')[0] ?? ''} />
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Update</button>
          </form>
        </section>
      </div>

      {/* Checklist */}
      <section className={commonStyles.card}>
        <h2>Checklist ({checkedCount}/{checklists.length})</h2>
        {checklists.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {checklists.map((item) => (
              <li key={item.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <form action={toggleChecklist} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="checked" value={String(item.isCompleted)} />
                  <button type="submit" style={{ 
                    cursor: 'pointer', 
                    background: item.isCompleted ? 'var(--success)' : 'transparent',
                    border: '2px solid var(--border-color)',
                    borderRadius: 4,
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}>
                    {item.isCompleted && '✓'}
                  </button>
                </form>
                <span style={{ textDecoration: item.isCompleted ? 'line-through' : 'none', opacity: item.isCompleted ? 0.6 : 1 }}>{item.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonStyles.muted}>No checklist items</p>
        )}
        <form action={addChecklistItem} className={commonStyles.row} style={{ marginTop: 16 }}>
          <input type="hidden" name="taskId" value={task.id} />
          <input className={commonStyles.input} name="label" placeholder="New item..." style={{ flex: 1 }} required />
          <button className={commonStyles.secondaryButton} type="submit">Add</button>
        </form>
      </section>

      {/* Time Entries */}
      <section className={commonStyles.card}>
        <h2>Time Tracking ({hours}h {mins}m total)</h2>
        {timeEntriesList.length > 0 ? (
          <table className={commonStyles.table}>
            <thead>
              <tr><th>Date</th><th>Time</th><th>User</th><th>Description</th></tr>
            </thead>
            <tbody>
              {timeEntriesList.map(({ entry, userName }) => (
                <tr key={entry.id}>
                  <td>{formatDateTime(entry.date)}</td>
                  <td>{Math.floor(entry.minutes / 60)}h {entry.minutes % 60}m</td>
                  <td>{userName || '—'}</td>
                  <td>{entry.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={commonStyles.muted}>No time logged</p>
        )}
        <h3>Log Time</h3>
        <form action={addTimeEntry} className={commonStyles.grid}>
          <input type="hidden" name="taskId" value={task.id} />
          <div className={commonStyles.row}>
            <label style={{ flex: 1 }}>
              Minutes *
              <input className={commonStyles.input} name="minutes" type="number" min="1" required placeholder="60" />
            </label>
            <label style={{ flex: 1 }}>
              Date
              <input className={commonStyles.input} name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </label>
          </div>
          <label>
            Description
            <input className={commonStyles.input} name="description" placeholder="What did you work on?" />
          </label>
          <button className={commonStyles.secondaryButton} type="submit">Log Time</button>
        </form>
      </section>

      {/* Comments */}
      <section className={commonStyles.card}>
        <h2>Comments ({comments.length})</h2>
        {comments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map(({ comment, authorName, authorEmail }) => (
              <div key={comment.id} style={{ borderLeft: '3px solid var(--border-color)', paddingLeft: 12 }}>
                <div className={commonStyles.muted} style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                  <strong>{authorName || authorEmail || 'Unknown'}</strong> · {formatDateTime(comment.createdAt)}
                </div>
                <p style={{ margin: 0 }}>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={commonStyles.muted}>No comments yet</p>
        )}
        <form action={addComment} className={commonStyles.grid} style={{ marginTop: 16 }}>
          <input type="hidden" name="taskId" value={task.id} />
          <textarea className={commonStyles.textarea} name="content" placeholder="Write a comment..." rows={3} required></textarea>
          <button className={commonStyles.secondaryButton} type="submit">Post Comment</button>
        </form>
      </section>
    </main>
  );
}
