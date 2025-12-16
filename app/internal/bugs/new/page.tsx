import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { bugs, projects, events } from '@/lib/db/schema';

export default async function NewBugPage() {
  const session = await requireRole(['admin', 'pm', 'dev', 'qa']);
  const db = getDb();
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt)).all();

  async function createBug(formData: FormData) {
    'use server';

    const session = await requireRole(['admin', 'pm', 'dev', 'qa']);
    const projectId = String(formData.get('projectId') ?? '');
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const stepsToReproduce = String(formData.get('stepsToReproduce') ?? '').trim();
    const environment = String(formData.get('environment') ?? '').trim();
    const severity = String(formData.get('severity') ?? 'medium');

    if (!projectId || !title) return;

    const bugId = crypto.randomUUID();
    const now = new Date();

    const db = getDb();
    await db.insert(bugs).values({
      id: bugId,
      projectId,
      title,
      description,
      stepsToReproduce,
      environment,
      severity: severity as any,
      status: 'open',
      reportedByUserId: session.user.id,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(events).values({
      id: crypto.randomUUID(),
      projectId,
      type: 'bug.reported',
      actorUserId: session.user.id,
      payloadJson: JSON.stringify({ bugId, title, severity }),
      createdAt: now,
    });

    redirect('/internal/bugs');
  }

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Report New Bug</h1>
          <p className={s.pageSubtitle}>Submit a new defect report</p>
        </div>
      </div>

      <div className={s.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={createBug} className={s.card} style={{ padding: '2rem' }}>
          <div className={s.formGroup}>
            <label className={s.label}>Project *</label>
            <select name="projectId" className={s.input} required>
              <option value="">Select Project...</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Title *</label>
            <input type="text" name="title" className={s.input} placeholder="Bug summary" required />
          </div>

          <div className={s.grid2}>
            <div className={s.formGroup}>
              <label className={s.label}>Severity</label>
              <select name="severity" className={s.input}>
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Environment</label>
              <input type="text" name="environment" className={s.input} placeholder="e.g. Production, Staging, Chrome" />
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Description</label>
            <textarea name="description" className={s.textarea} rows={4} placeholder="Detailed description of the issue"></textarea>
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Steps to Reproduce</label>
            <textarea name="stepsToReproduce" className={s.textarea} rows={4} placeholder="1. Go to... 2. Click..."></textarea>
          </div>

          <div className={s.formActions} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/internal/bugs" className={s.buttonSecondary}>
              Cancel
            </Link>
            <button type="submit" className={s.buttonPrimary}>
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
