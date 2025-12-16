import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import commonStyles from '../../../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { processDefinitions } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

import type { ProcessDefinitionJson, LegacyProcessDefinition } from '@/lib/types/json-types';

type Step = { key: string; title: string; type: 'task' | 'approval' | 'notification'; assigneeRole?: string; next?: string };

export default async function ProcessDefinitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin']);
  const { id } = await params;
  const db = getDb();

  const definition = await db.select().from(processDefinitions).where(eq(processDefinitions.id, id)).get();
  if (!definition) notFound();

  const json = definition.json as LegacyProcessDefinition;
  const steps = json.steps ?? [];

  async function addStep(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const key = String(formData.get('key') ?? '').trim().toLowerCase().replace(/\s+/g, '_');
    const title = String(formData.get('title') ?? '').trim();
    const recommendedRole = String(formData.get('recommendedRole') ?? '').trim() || undefined;

    if (!id || !key || !title) return;

    const def = await db.select().from(processDefinitions).where(eq(processDefinitions.id, id)).get();
    if (!def) return;

    const currentJson = def.json as LegacyProcessDefinition;
    const newSteps = [...currentJson.steps, { key, title, type: 'task' as const, assigneeRole: recommendedRole }];
    const newJson: LegacyProcessDefinition = { steps: newSteps };

    await db.update(processDefinitions).set({ 
      json: newJson,
      version: (def.version || 0) + 1
    }).where(eq(processDefinitions.id, id));

    redirect(`/internal/admin/process/${id}`);
  }

  async function removeStep(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const stepKey = String(formData.get('stepKey') ?? '').trim();

    if (!id || !stepKey) return;

    const def = await db.select().from(processDefinitions).where(eq(processDefinitions.id, id)).get();
    if (!def) return;

    const currentJson = def.json as LegacyProcessDefinition;
    const newSteps = currentJson.steps.filter(s => s.key !== stepKey);
    const newJson: LegacyProcessDefinition = { steps: newSteps };

    await db.update(processDefinitions).set({ 
      json: newJson,
      version: (def.version || 0) + 1
    }).where(eq(processDefinitions.id, id));

    redirect(`/internal/admin/process/${id}`);
  }

  async function moveStep(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const stepKey = String(formData.get('stepKey') ?? '').trim();
    const direction = String(formData.get('direction') ?? '').trim() as 'up' | 'down';

    if (!id || !stepKey) return;

    const def = await db.select().from(processDefinitions).where(eq(processDefinitions.id, id)).get();
    if (!def) return;

    const currentJson = def.json as LegacyProcessDefinition;
    const idx = currentJson.steps.findIndex(s => s.key === stepKey);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= currentJson.steps.length) return;

    const newSteps = [...currentJson.steps];
    [newSteps[idx], newSteps[newIdx]] = [newSteps[newIdx], newSteps[idx]];
    const newJson: LegacyProcessDefinition = { steps: newSteps };

    await db.update(processDefinitions).set({ 
      json: newJson, 
      version: (def.version || 0) + 1
    }).where(eq(processDefinitions.id, id));

    redirect(`/internal/admin/process/${id}`);
  }

  async function setActive(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    if (!id) return;

    // Deactivate all first
    await db.update(processDefinitions).set({ isActive: false });
    // Activate this one
    await db.update(processDefinitions).set({ isActive: true }).where(eq(processDefinitions.id, id));

    redirect(`/internal/admin/process/${id}`);
  }

  const roleColor = (role?: string) => {
    switch (role) {
      case 'pm': return commonStyles.badgeBlue;
      case 'dev': return commonStyles.badgeGreen;
      case 'qa': return commonStyles.badgeYellow;
      case 'admin': return commonStyles.badgeRed;
      default: return commonStyles.badgeGray;
    }
  };

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.row}>
        <h1>{definition.key}</h1>
        <Link href="/internal/admin/process">Back</Link>
      </div>

      <div className={commonStyles.grid2}>
        {/* Definition Info */}
        <section className={commonStyles.card}>
          <h2>Details</h2>
          <div className={commonStyles.grid}>
            <p><strong>Key:</strong> {definition.key}</p>
            <p><strong>Version:</strong> {definition.version}</p>
            <p><strong>Status:</strong> <span className={`${commonStyles.badge} ${definition.isActive ? commonStyles.badgeGreen : commonStyles.badgeGray}`}>{definition.isActive ? 'Active' : 'Inactive'}</span></p>
            <p><strong>Created:</strong> {formatDateTime(definition.createdAt)}</p>
          </div>
          {!definition.isActive && (
            <form action={setActive} style={{ marginTop: 16 }}>
              <input type="hidden" name="id" value={definition.id} />
              <button className={commonStyles.button} type="submit">Set as Active Definition</button>
            </form>
          )}
        </section>

        {/* Add Step */}
        <section className={commonStyles.card}>
          <h2>Add Step</h2>
          <form action={addStep} className={commonStyles.grid}>
            <input type="hidden" name="id" value={definition.id} />
            <label>
              Step Key *
              <input className={commonStyles.input} name="key" required placeholder="e.g. code_review" />
            </label>
            <label>
              Title *
              <input className={commonStyles.input} name="title" required placeholder="e.g. Code Review" />
            </label>
            <label>
              Recommended Role
              <select className={commonStyles.select} name="recommendedRole">
                <option value="">— Any —</option>
                <option value="pm">PM</option>
                <option value="dev">Dev</option>
                <option value="qa">QA</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button className={commonStyles.secondaryButton} type="submit">Add Step</button>
          </form>
        </section>
      </div>

      {/* Steps */}
      <section className={commonStyles.card}>
        <h2>Workflow Steps ({steps.length})</h2>
        {steps.length === 0 ? (
          <p className={commonStyles.muted}>No steps defined</p>
        ) : (
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Key</th>
                <th>Title</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, idx) => (
                <tr key={step.key}>
                  <td>{idx + 1}</td>
                  <td className={commonStyles.muted}>{step.key}</td>
                  <td><strong>{step.title}</strong></td>
                  <td>
                    {step.recommendedRole && (
                      <span className={`${commonStyles.badge} ${roleColor(step.recommendedRole)}`}>{step.recommendedRole}</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {idx > 0 && (
                        <form action={moveStep}>
                          <input type="hidden" name="id" value={definition.id} />
                          <input type="hidden" name="stepKey" value={step.key} />
                          <input type="hidden" name="direction" value="up" />
                          <button className={commonStyles.secondaryButton} type="submit" style={{ padding: '2px 8px' }}>↑</button>
                        </form>
                      )}
                      {idx < steps.length - 1 && (
                        <form action={moveStep}>
                          <input type="hidden" name="id" value={definition.id} />
                          <input type="hidden" name="stepKey" value={step.key} />
                          <input type="hidden" name="direction" value="down" />
                          <button className={commonStyles.secondaryButton} type="submit" style={{ padding: '2px 8px' }}>↓</button>
                        </form>
                      )}
                      <form action={removeStep}>
                        <input type="hidden" name="id" value={definition.id} />
                        <input type="hidden" name="stepKey" value={step.key} />
                        <button className={commonStyles.secondaryButton} type="submit" style={{ padding: '2px 8px', background: 'var(--danger)', color: 'white' }}>×</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* JSON Preview */}
      <section className={commonStyles.card}>
        <h2>JSON Definition</h2>
        <pre className={commonStyles.pre} style={{ fontSize: '0.85rem', overflow: 'auto' }}>{JSON.stringify(json, null, 2)}</pre>
      </section>
    </main>
  );
}
