import Link from 'next/link';
import { redirect } from 'next/navigation';

import s from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, events } from '@/lib/db/schema';

export default async function ImportLeadsPage() {
  await requireRole(['admin', 'pm']);

  async function importLeads(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const csvContent = String(formData.get('csv') ?? '').trim();

    if (!csvContent) return;

    const lines = csvContent.split('\n');
    const db = getDb();
    const now = new Date();
    let count = 0;

    // Simple CSV parser: assumes Name,Email,Company format
    // Skip header if present
    const startIdx = lines[0].toLowerCase().startsWith('name') ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',');
      if (parts.length < 1) continue;

      const name = parts[0]?.trim();
      const email = parts[1]?.trim() || null;
      const company = parts[2]?.trim() || null;

      if (!name) continue;

      const leadId = crypto.randomUUID();

      await db.insert(leads).values({
        id: leadId,
        name,
        email,
        company,
        source: 'csv_import',
        status: 'new',
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(events).values({
        id: crypto.randomUUID(),
        leadId,
        type: 'lead.created',
        actorUserId: session.user.id,
        payloadJson: JSON.stringify({ source: 'csv_import' }),
        createdAt: now,
      });

      count++;
    }

    redirect('/internal/leads');
  }

  return (
    <main className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <h1 className={s.pageTitle}>Import Leads</h1>
          <p className={s.pageSubtitle}>Bulk create leads from CSV data</p>
        </div>
      </div>

      <div className={s.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={importLeads} className={s.card} style={{ padding: '2rem' }}>
          <div className={s.formGroup}>
            <label className={s.label}>CSV Data *</label>
            <p className={s.textMuted} style={{ marginBottom: '0.5rem' }}>
              Format: <code>Name, Email, Company</code> (one per line)
            </p>
            <textarea 
              name="csv" 
              className={s.textarea} 
              rows={15} 
              placeholder="John Doe, john@example.com, Acme Corp&#10;Jane Smith, jane@test.com, Tech Inc"
              required
            ></textarea>
          </div>

          <div className={s.formActions} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/internal/leads" className={s.buttonSecondary}>
              Cancel
            </Link>
            <button type="submit" className={s.buttonPrimary}>
              Import Leads
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
