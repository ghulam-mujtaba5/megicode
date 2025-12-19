import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, sql, and, notInArray, inArray } from 'drizzle-orm';

import s from '../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, events } from '@/lib/db/schema';
import { leadStatusColor, type BadgeColor, formatDateTime } from '@/lib/internal/ui';

// Icons
const Icons = {
  leads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  message: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  clipboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
};

function getBadgeClass(color: BadgeColor) {
  const map: Record<BadgeColor, string> = {
    blue: s.badgePrimary,
    green: s.badgeSuccess,
    yellow: s.badgeWarning,
    red: s.badgeDanger,
    gray: s.badgeDefault,
  };
  return `${s.badge} ${map[color] || s.badgeDefault}`;
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
    const estimatedBudget = Number(formData.get('estimatedBudget'));
    const priority = String(formData.get('priority') ?? 'medium');
    const targetDateStr = String(formData.get('targetDate') ?? '');

    if (!name || !estimatedBudget || !targetDateStr || !priority) return;

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
      estimatedBudget, // cents
      priority: priority as any,
      targetDate: new Date(targetDateStr),
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
      payloadJson: { source: 'internal_manual' },
      createdAt: now,
    });

    redirect(`/internal/leads/${leadId}`);
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).all();

  // Quick view: leads that appear ready for scoping (no estimated hours set)
  const leadsReadyForScoping = rows.filter((r) => {
    // some leads may store estimatedHours or estimated_hours; defensively check both
    // treat missing or zero as ready for scoping
    // @ts-ignore
    const est = (r as any).estimatedHours ?? (r as any).estimated_hours ?? 0;
    return !est || est === 0;
  });



  return (
    <main className={s.page}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <div className={s.pageHeaderContent}>
          <div className={s.welcomeSection}>
            <h1 className={s.pageTitle}>Leads Management</h1>
            <p className={s.pageSubtitle}>{rows.length} total leads in your pipeline</p>
          </div>
        </div>
        <div className={s.pageActions}>
          <Link href="/internal/leads/pipeline" className={`${s.btn} ${s.btnSecondary}`}>
            <span className={s.btnIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </span>
            Pipeline View
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <section className={s.kpiSection}>
        <div className={s.kpiGrid}>
          <div className={`${s.kpiCard} ${s.kpiCardPrimary}`}>
            <div className={s.kpiIcon}>{Icons.leads}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{rows.length}</span>
              <span className={s.kpiLabel}>Total Leads</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardSuccess}`}>
            <div className={s.kpiIcon}>{Icons.leads}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{rows.filter(r => r.status === 'new').length}</span>
              <span className={s.kpiLabel}>New Leads</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardWarning}`}>
            <div className={s.kpiIcon}>{Icons.leads}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{rows.filter(r => r.status === 'in_review').length}</span>
              <span className={s.kpiLabel}>In Review</span>
            </div>
          </div>
          <div className={`${s.kpiCard} ${s.kpiCardInfo}`}>
            <div className={s.kpiIcon}>{Icons.leads}</div>
            <div className={s.kpiContent}>
              <span className={s.kpiValue}>{rows.filter(r => r.status === 'approved' || r.status === 'converted').length}</span>
              <span className={s.kpiLabel}>Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={s.dashboardGrid}>
        {/* Leads Table */}
        <section className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={s.cardIcon}>{Icons.leads}</div>
              <h2 className={s.cardTitle}>All Leads</h2>
              <span className={s.badge}>{rows.length}</span>
            </div>
          </div>
          <div className={s.cardBody}>
            {rows.length > 0 ? (
              <div className={s.tableContainer}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className={s.leadContent}>
                            <span className={s.leadName}>{lead.name}</span>
                            {lead.email && (
                              <span className={s.leadCompany}>{lead.email}</span>
                            )}
                          </div>
                        </td>
                        <td className={s.textMuted}>{lead.company || '—'}</td>
                        <td>
                          <span className={getBadgeClass(leadStatusColor(lead.status))}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={s.textMuted}>{formatDateTime(lead.createdAt)}</td>
                        <td>
                          <Link href={`/internal/leads/${lead.id}`} className={s.tableAction}>
                            Open {Icons.arrowRight}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={s.emptyState}>
                <div className={s.emptyStateIcon}>{Icons.leads}</div>
                <p className={s.emptyStateText}>No leads yet</p>
                <p className={s.textMuted}>Create your first lead using the form</p>
              </div>
            )}
          </div>
        </section>

        {/* Create Lead Form */}
        <section className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardHeaderLeft}>
              <div className={`${s.cardIcon} ${s.cardIconSuccess}`}>{Icons.plus}</div>
              <h2 className={s.cardTitle}>Create Lead</h2>
            </div>
          </div>
          <div className={s.cardBody}>
            <form action={createLead} className={s.form}>
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.leads}</span>
                  Name *
                </label>
                <input className={s.input} name="name" placeholder="John Doe" required />
              </div>
              
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.mail}</span>
                  Email
                </label>
                <input className={s.input} name="email" type="email" placeholder="john@example.com" />
              </div>
              
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.building}</span>
                  Company
                </label>
                <input className={s.input} name="company" placeholder="Acme Inc." />
              </div>
              
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.phone}</span>
                  Phone
                </label>
                <input className={s.input} name="phone" placeholder="+1 234 567 890" />
              </div>
              
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.briefcase}</span>
                  Service Interest
                </label>
                <input className={s.input} name="service" placeholder="Web Development" />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.clipboard}</span>
                  Estimated Budget (Cents) *
                </label>
                <input className={s.input} name="estimatedBudget" type="number" placeholder="500000" required />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.clipboard}</span>
                  Priority *
                </label>
                <select className={s.select} name="priority" required defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.clipboard}</span>
                  Target Date *
                </label>
                <input className={s.input} name="targetDate" type="date" required />
              </div>
              
              <div className={s.formGroup}>
                <label className={s.label}>
                  <span className={s.labelIcon}>{Icons.message}</span>
                  Message
                </label>
                <textarea className={s.textarea} name="message" placeholder="Project details..." rows={4} />
              </div>
              
              <button className={s.btnPrimary} type="submit">
                <span className={s.btnIcon}>{Icons.plus}</span>
                Create Lead
              </button>
            </form>
            
            <p className={`${s.textMuted} ${s.mt3}`}>
              Signed in as {session.user.email} ({session.user.role ?? 'viewer'})
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
