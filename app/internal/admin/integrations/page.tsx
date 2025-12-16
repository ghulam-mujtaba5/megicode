import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { integrations } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  plug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

export default async function IntegrationsPage() {
  await requireRole(['admin']);
  const db = getDb();

  const allIntegrations = await db.select().from(integrations).orderBy(desc(integrations.createdAt)).all();

  async function addIntegration(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();

    const name = String(formData.get('name') ?? '').trim();
    const type = String(formData.get('type') ?? '').trim();
    const configStr = String(formData.get('config') ?? '').trim();

    if (!name || !type) return;
    
    // Parse config JSON, default to empty object if invalid
    let config: Record<string, any> = {};
    if (configStr) {
      try {
        config = JSON.parse(configStr);
      } catch {
        config = {};
      }
    }

    await db.insert(integrations).values({
      id: crypto.randomUUID(),
      name,
      type: type as any,
      config,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async function deleteIntegration(formData: FormData) {
    'use server';
    await requireRole(['admin']);
    const db = getDb();
    const id = String(formData.get('id') ?? '');
    if (!id) return;
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Integrations</h1>
          <p className={s.pageSubtitle}>Manage external connections (Slack, GitHub, Webhooks)</p>
        </div>
      </div>

      <div className={s.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <section className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Active Integrations</h2>
          </div>
          <div className={s.tableContainer}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allIntegrations.map((int) => (
                  <tr key={int.id}>
                    <td style={{ fontWeight: 500 }}>{int.name}</td>
                    <td>
                      <span className={s.badge} style={{ background: 'var(--int-surface-muted)' }}>
                        {int.type}
                      </span>
                    </td>
                    <td>
                      <span className={s.badge} style={{ 
                        background: int.isActive ? 'var(--int-success)' : 'var(--int-text-muted)',
                        color: '#fff'
                      }}>
                        {int.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDateTime(int.createdAt)}</td>
                    <td>
                      <form action={deleteIntegration}>
                        <input type="hidden" name="id" value={int.id} />
                        <button type="submit" className={s.buttonIcon} style={{ color: 'var(--int-danger)' }}>
                          {Icons.trash}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {allIntegrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className={s.emptyState}>
                      <div className={s.emptyStateIcon}>{Icons.plug}</div>
                      <p className={s.emptyStateText}>No integrations configured</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Add New</h2>
          </div>
          <div className={s.cardBody}>
            <form action={addIntegration} className={s.form}>
              <div className={s.formGroup}>
                <label className={s.label}>Name</label>
                <input name="name" className={s.input} placeholder="e.g. Slack Alerts" required />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Type</label>
                <select name="type" className={s.select} required>
                  <option value="webhook">Webhook</option>
                  <option value="slack">Slack</option>
                  <option value="github">GitHub</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Config (JSON)</label>
                <textarea name="config" className={s.textarea} rows={5} placeholder='{"url": "https://..."}'></textarea>
              </div>
              <button type="submit" className={s.buttonPrimary} style={{ width: '100%' }}>
                {Icons.plus} Add Integration
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
