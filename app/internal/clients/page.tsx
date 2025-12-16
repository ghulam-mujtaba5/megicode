import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';

import styles from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { clients, events } from '@/lib/db/schema';
import { formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  clients: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  active: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  inactive: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  churned: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  add: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  company: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"/>
      <path d="M5 21V7l8-4v18"/>
      <path d="M19 21V11l-6-4"/>
      <path d="M9 9v.01"/>
      <path d="M9 12v.01"/>
      <path d="M9 15v.01"/>
      <path d="M9 18v.01"/>
    </svg>
  ),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  industry: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  notes: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

function getBadgeClass(status: string) {
  if (status === 'active') return `${styles.badge} ${styles.badgeSuccess}`;
  if (status === 'churned') return `${styles.badge} ${styles.badgeDanger}`;
  if (status === 'inactive') return `${styles.badge} ${styles.badgeWarning}`;
  return `${styles.badge} ${styles.badgeDefault}`;
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
      payloadJson: { clientId, name },
      createdAt: now,
    });

    redirect(`/internal/clients/${clientId}`);
  }

  const rows = await db.select().from(clients).orderBy(desc(clients.createdAt)).all();

  // Calculate stats
  const clientStats = {
    total: rows.length,
    active: rows.filter(c => c.status === 'active').length,
    inactive: rows.filter(c => c.status === 'inactive').length,
    churned: rows.filter(c => c.status === 'churned').length,
  };

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clients</h1>
          <p className={styles.pageSubtitle}>
            <span className={styles.highlight}>{rows.length}</span> clients in your database
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}>{Icons.clients}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{clientStats.total}</span>
            <span className={styles.kpiLabel}>Total Clients</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}>{Icons.active}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{clientStats.active}</span>
            <span className={styles.kpiLabel}>Active</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
          <div className={styles.kpiIcon}>{Icons.inactive}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{clientStats.inactive}</span>
            <span className={styles.kpiLabel}>Inactive</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiRed}`}>
          <div className={styles.kpiIcon}>{Icons.churned}</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{clientStats.churned}</span>
            <span className={styles.kpiLabel}>Churned</span>
          </div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Clients List */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Clients</h2>
            <span className={styles.badge}>{rows.length}</span>
          </div>

          {rows.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{Icons.empty}</div>
              <h3>No clients yet</h3>
              <p>Add your first client using the form on the right.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>COMPANY</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className={styles.cellMain}>{client.name}</div>
                        {client.billingEmail && (
                          <div className={styles.cellSub}>{client.billingEmail}</div>
                        )}
                      </td>
                      <td>{client.company ?? '-'}</td>
                      <td>
                        <span className={getBadgeClass(client.status)}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className={styles.cellMuted}>{formatDateTime(client.createdAt)}</td>
                      <td>
                        <Link href={`/internal/clients/${client.id}`} className={styles.btnSmall}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Create Client Form */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Add Client</h2>
            <span className={styles.cardIcon}>{Icons.add}</span>
          </div>

          <form action={createClient} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.user}</span>
                Name *
              </label>
              <input 
                className={styles.input} 
                name="name" 
                required 
                placeholder="John Doe"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.company}</span>
                Company
              </label>
              <input 
                className={styles.input} 
                name="company" 
                placeholder="Acme Inc."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.globe}</span>
                Website
              </label>
              <input 
                className={styles.input} 
                name="website" 
                type="url" 
                placeholder="https://example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.industry}</span>
                Industry
              </label>
              <input 
                className={styles.input} 
                name="industry" 
                placeholder="e.g. Finance, Healthcare"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.email}</span>
                Billing Email
              </label>
              <input 
                className={styles.input} 
                name="billingEmail" 
                type="email" 
                placeholder="billing@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.clock}</span>
                Timezone
              </label>
              <select className={styles.select} name="timezone" defaultValue="">
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
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>{Icons.notes}</span>
                Notes
              </label>
              <textarea 
                className={styles.textarea} 
                name="notes" 
                placeholder="Additional notes about this client..."
                rows={3}
              />
            </div>

            <button className={styles.btnPrimary} type="submit">
              <span className={styles.btnIcon}>{Icons.add}</span>
              Create Client
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
