import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc } from 'drizzle-orm';

import commonStyles from '../internalCommon.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, events } from '@/lib/db/schema';
import { leadStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

function badgeClass(styles: typeof commonStyles, color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeBlue}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeGreen}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeYellow}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeRed}`;
  return `${styles.badge} ${styles.badgeGray}`;
}

export default async function LeadsPage() {
  const session = await requireRole(['admin', 'pm']);
  const db = getDb();

  async function createLead(formData: FormData) {
    'use server';

    const session = await requireRole(['admin', 'pm']);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim() || null;
    const company = String(formData.get('company') ?? '').trim() || null;
    const phone = String(formData.get('phone') ?? '').trim() || null;
    const service = String(formData.get('service') ?? '').trim() || null;
    const message = String(formData.get('message') ?? '').trim() || null;

    if (!name) return;

    const now = new Date();
    const leadId = crypto.randomUUID();

    const db = getDb();
    await db.insert(leads).values({
      id: leadId,
      name,
      email,
      company,
      phone,
      service,
      message,
      source: 'internal_manual',
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId,
      type: 'lead.created',
      actorUserId: session.user.id ?? null,
      payloadJson: JSON.stringify({ source: 'internal_manual' }),
      createdAt: now,
    });

    redirect(`/internal/leads/${leadId}`);
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).all();

  return (
    <main className={commonStyles.page}>
      <div className={commonStyles.grid2}>
        <section className={commonStyles.card}>
          <div className={commonStyles.row}>
            <h1>Leads</h1>
            <span className={commonStyles.muted}>Total: {rows.length}</span>
          </div>

          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div>{lead.name}</div>
                    <div className={commonStyles.muted}>{lead.email ?? ''}</div>
                  </td>
                  <td>
                    <span className={badgeClass(commonStyles, leadStatusColor(lead.status))}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{formatDateTime(lead.createdAt)}</td>
                  <td>
                    <Link href={`/internal/leads/${lead.id}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={commonStyles.card}>
          <h2>Create Lead</h2>
          <form action={createLead} className={commonStyles.grid}>
            <label>
              Name
              <input className={commonStyles.input} name="name" required />
            </label>
            <label>
              Email
              <input className={commonStyles.input} name="email" type="email" />
            </label>
            <label>
              Company
              <input className={commonStyles.input} name="company" />
            </label>
            <label>
              Phone
              <input className={commonStyles.input} name="phone" />
            </label>
            <label>
              Service
              <input className={commonStyles.input} name="service" />
            </label>
            <label>
              Message
              <textarea className={commonStyles.textarea} name="message" />
            </label>
            <button className={commonStyles.button} type="submit">
              Create
            </button>
          </form>
          <p className={commonStyles.muted}>
            Signed in as {session.user.email} ({session.user.role ?? 'viewer'})
          </p>
        </section>
      </div>
    </main>
  );
}
