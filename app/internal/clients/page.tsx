import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { clients, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

function statusBadge(status: string, styles: typeof commonStyles) {
  if (status === 'active') return `${styles.badge} ${styles.badgeGreen}`;
  if (status === 'churned') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

export default async function ClientsPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  async function createClient(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const name = String(formData.get('name') ?? '').trim();
    const company = String(formData.get('company') ?? '').trim() || null;
    const website = String(formData.get('website') ?? '').trim() || null;
    const industry = String(formData.get('industry') ?? '').trim() || null;
    const billingEmail = String(formData.get('billingEmail') ?? '').trim() || null;
    const timezone = String(formData.get('timezone') ?? '').trim() || null;
    const notes = String(formData.get('notes') ?? '').trim() || null;

    if (!name) return;

    const now = new Date();
    const clientId = crypto.randomUUID();

    const db = getDb();
    await db.insert(clients).values({
      id: clientId,
      name,
      company,
      website,
      industry,
      billingEmail,
      timezone,
      notes,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(events).values({
      id: crypto.randomUUID(),
      type: 'client.created',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ clientId, name }),
      createdAt: now,
    });

    redirect(`/internal/clients/${clientId}`);
  }

  const rows = await db.select().from(clients).orderBy(desc(clients.createdAt)).all();

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.grid2}>
        <section className={commonStyles.card}>
          <div className={commonStyles.row}>
            <h1>Clients</h1>
            <span className={commonStyles.muted}>Total: {rows.length}</span>
          </div>

          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div>{client.name}</div>
                    <div className={commonStyles.muted}>{client.billingEmail ?? ''}</div>
                  </td>
                  <td>{client.company ?? ''}</td>
                  <td>
                    <span className={statusBadge(client.status, commonStyles)}>{client.status}</span>
                  </td>
                  <td>{formatDateTime(client.createdAt)}</td>
                  <td>
                    <Link href={`/internal/clients/${client.id}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={commonStyles.card}>
          <h2>Add Client</h2>
          <form action={createClient} className={commonStyles.grid}>
            <label>
              Name *
              <input className={commonStyles.input} name="name" required />
            </label>
            <label>
              Company
              <input className={commonStyles.input} name="company" />
            </label>
            <label>
              Website
              <input className={commonStyles.input} name="website" type="url" placeholder="https://" />
            </label>
            <label>
              Industry
              <input className={commonStyles.input} name="industry" placeholder="e.g. Finance, Healthcare" />
            </label>
            <label>
              Billing Email
              <input className={commonStyles.input} name="billingEmail" type="email" />
            </label>
            <label>
              Timezone
              <select className={commonStyles.select} name="timezone" defaultValue="">
                <option value="">Select timezone</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern (US)</option>
                <option value="America/Chicago">Central (US)</option>
                <option value="America/Los_Angeles">Pacific (US)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Berlin">Berlin</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Karachi">Karachi</option>
                <option value="Asia/Singapore">Singapore</option>
              </select>
            </label>
            <label>
              Notes
              <textarea className={commonStyles.textarea} name="notes" />
            </label>
            <button className={commonStyles.button} type="submit">
              Create Client
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
