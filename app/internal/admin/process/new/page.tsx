import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ProcessDefinitionJson } from '@/lib/types/json-types';

import s from '../../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processDefinitions } from '@/lib/db/schema';

const DEFAULT_JSON = `{
  "steps": [
    {
      "key": "step_1",
      "title": "First Step",
      "role": "pm"
    },
    {
      "key": "step_2",
      "title": "Second Step",
      "role": "dev"
    }
  ]
}`;

export default async function NewProcessPage() {
  await requireRole(['admin']);

  async function createProcess(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const key = String(formData.get('key') ?? '').trim();
    const jsonStr = String(formData.get('json') ?? '').trim();

    if (!key || !jsonStr) return;

    // Parse and validate JSON
    let parsedJson: ProcessDefinitionJson;
    try {
      parsedJson = JSON.parse(jsonStr);
    } catch (e) {
      // In a real app, we'd return an error state. For now, just return.
      return;
    }

    // Get next version
    const existing = await db
      .select()
      .from(processDefinitions)
      .where(eq(processDefinitions.key, key))
      .orderBy(desc(processDefinitions.version))
      .limit(1)
      .get();

    const version = (existing?.version ?? 0) + 1;

    // Deactivate old versions
    if (existing) {
      await db
        .update(processDefinitions)
        .set({ isActive: false })
        .where(eq(processDefinitions.key, key));
    }

    await db.insert(processDefinitions).values({
      id: crypto.randomUUID(),
      key,
      version,
      isActive: true,
      json: parsedJson,
      createdAt: new Date(),
    });

    redirect('/internal/admin/process');
  }

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>New Process Definition</h1>
          <p className={s.pageSubtitle}>Define a new workflow process using JSON</p>
        </div>
      </div>

      <div className={s.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={createProcess} className={s.card} style={{ padding: '2rem' }}>
          <div className={s.formGroup}>
            <label className={s.label}>Process Key *</label>
            <input 
              type="text" 
              name="key" 
              className={s.input} 
              placeholder="e.g. software_dev_lifecycle" 
              required 
              pattern="[a-z0-9_]+"
              title="Lowercase letters, numbers, and underscores only"
            />
            <p className={s.textMuted} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Unique identifier for this process type. Lowercase, no spaces.
            </p>
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Definition JSON *</label>
            <textarea 
              name="json" 
              className={s.textarea} 
              rows={15} 
              defaultValue={DEFAULT_JSON}
              required
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            ></textarea>
            <p className={s.textMuted} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Must be valid JSON containing a &quot;steps&quot; array.
            </p>
          </div>

          <div className={s.formActions} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/internal/admin/process" className={s.buttonSecondary}>
              Cancel
            </Link>
            <button type="submit" className={s.buttonPrimary}>
              Create Definition
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

import { desc, eq } from 'drizzle-orm';
