import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, users, projects, processInstances, tasks, events, leadNotes, proposals } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';
import {
  safeValidateFormData,
  removeByIdFormSchema,
  leadAddNoteFormSchema,
  updateLeadStatusSchema,
  leadConvertToProjectFormSchema,
} from '@/lib/validations';

// Icons
const Icons = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <line x1="9" y1="22" x2="9" y2="22.01"/>
      <line x1="15" y1="22" x2="15" y2="22.01"/>
      <line x1="12" y1="22" x2="12" y2="22.01"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="4" y1="10" x2="20" y2="10"/>
    </svg>
  ),
  tag: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  clipboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  calculator: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="8" y2="10.01"/>
      <line x1="12" y1="10" x2="12" y2="10.01"/>
      <line x1="16" y1="10" x2="16" y2="10.01"/>
      <line x1="8" y1="14" x2="8" y2="14.01"/>
      <line x1="12" y1="14" x2="12" y2="14.01"/>
      <line x1="16" y1="14" x2="16" y2="14.01"/>
      <line x1="8" y1="18" x2="8" y2="18.01"/>
      <line x1="12" y1="18" x2="12" y2="18.01"/>
      <line x1="16" y1="18" x2="16" y2="18.01"/>
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin', 'pm']);
  const { id } = await params;

  const db = getDb();
  const lead = await db.select().from(leads).where(eq(leads.id, id)).get();
  if (!lead) notFound();

  const team = await db.select().from(users).orderBy(desc(users.createdAt)).all();
  const notes = await db.select({
    note: leadNotes,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(leadNotes)
  .leftJoin(users, eq(leadNotes.authorUserId, users.id))
  .where(eq(leadNotes.leadId, id))
  .orderBy(desc(leadNotes.createdAt))
  .all();

  const leadProposals = await db.select().from(proposals).where(eq(proposals.leadId, id)).orderBy(desc(proposals.createdAt)).all();

  // Similar Project Suggester - find projects with similar tech preferences or service type
  const allProjects = await db.select().from(projects).all();
  const similarProjects = allProjects.filter(p => {
    // Match by service type
    if (lead.service && p.name?.toLowerCase().includes(lead.service.toLowerCase())) return true;
    // Match by tech preferences
    if (lead.techPreferences && p.techStack) {
      const leadTechs = lead.techPreferences.toLowerCase().split(/[,;\s]+/).filter(Boolean);
      const projectTechs = (typeof p.techStack === 'string' ? p.techStack : '').toLowerCase();
      return leadTechs.some(tech => projectTechs.includes(tech));
    }
    return false;
  }).slice(0, 5);

  async function addNote(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(leadAddNoteFormSchema, formData);
    if (!result.success) return;
    const { leadId, content } = result.data;

    await db.insert(leadNotes).values({
      id: crypto.randomUUID(),
      leadId,
      authorUserId: session.user.id ?? null,
      content,
      createdAt: new Date(),
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function updateStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(updateLeadStatusSchema, formData);
    if (!result.success) return;
    const { leadId, status } = result.data;

    await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, leadId));

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId,
      type: `lead.status_changed`,
      actorUserId: session.user.id ?? null,
      payloadJson: { newStatus: status },
      createdAt: new Date(),
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function convertToProject(formData: FormData) {
    'use server';

    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(leadConvertToProjectFormSchema, formData);
    if (!result.success) return;
    const { leadId, projectName: inputProjectName, ownerUserId, priority, dueAt } = result.data;

    const leadRow = await db.select().from(leads).where(eq(leads.id, leadId)).get();
    if (!leadRow) notFound();
    if (leadRow.status === 'converted') {
      redirect(`/internal/projects?fromLead=${leadId}`);
    }

    const projectName = inputProjectName || `${leadRow.name} Project`;
    const now = new Date();
    const projectId = crypto.randomUUID();

    await db.insert(projects).values({
      id: projectId,
      leadId,
      name: projectName,
      ownerUserId: ownerUserId || null,
      status: 'new',
      priority: priority || 'medium',
      startAt: now,
      dueAt,
      createdAt: now,
      updatedAt: now,
    });

    await db
      .update(leads)
      .set({ status: 'converted', updatedAt: now })
      .where(eq(leads.id, leadId));

    const { id: processDefinitionId, json } = await ensureActiveDefaultProcessDefinition();

    const instanceId = crypto.randomUUID();
    const firstStepKey = json.steps[0]?.key ?? null;

    await db.insert(processInstances).values({
      id: instanceId,
      processDefinitionId,
      projectId,
      status: 'running',
      currentStepKey: firstStepKey,
      startedAt: now,
    });

    // Generate tasks from steps
    for (const step of json.steps) {
      const assignedToUserId =
        ('recommendedRole' in step && step.recommendedRole === 'pm') ? ownerUserId : null;

      await db.insert(tasks).values({
        id: crypto.randomUUID(),
        instanceId,
        key: step.key,
        title: step.title,
        status: 'todo',
        assignedToUserId,
        createdAt: now,
        updatedAt: now,
      });
    }

    await db.insert(events).values([
      {
        id: crypto.randomUUID(),
        leadId,
        projectId,
        type: 'lead.converted',
        actorUserId: session.user.id ?? null,
        payloadJson: { projectId },
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        projectId,
        instanceId,
        type: 'instance.started',
        actorUserId: session.user.id ?? null,
        payloadJson: { processDefinitionId },
        createdAt: now,
      },
    ]);

    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for NDA management
  async function updateNdaStatus(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const leadId = String(formData.get('leadId') ?? '').trim();
    const ndaStatus = String(formData.get('ndaStatus') ?? 'not_required').trim() as 'not_required' | 'pending' | 'sent' | 'signed' | 'expired';
    const ndaUrl = String(formData.get('ndaUrl') ?? '').trim() || null;

    if (!leadId) return;

    const now = new Date();
    const updates: {
      ndaStatus: typeof ndaStatus;
      ndaUrl: string | null;
      updatedAt: Date;
      ndaSentAt?: Date;
      ndaSignedAt?: Date;
    } = {
      ndaStatus,
      ndaUrl,
      updatedAt: now,
    };

    if (ndaStatus === 'sent') {
      updates.ndaSentAt = now;
    }
    if (ndaStatus === 'signed') {
      updates.ndaSignedAt = now;
    }

    await db.update(leads).set(updates).where(eq(leads.id, leadId));

    redirect(`/internal/leads/${leadId}`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/leads" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Lead</span>
            </div>
            <h1 className={styles.pageTitle}>{lead.name}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(lead.createdAt)}</p>
          </div>
          <div className={styles.pageActions}>
            {/* Actions can go here */}
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Contact Information, Proposals, Notes & Activity */}
          <div className={styles.form}>
            
            {/* Lead Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Contact Information</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>{Icons.mail} Email</p>
                    <p>{lead.email || <span className={styles.textMuted}>N/A</span>}</p>
                  </div>
                  <div>
                    <p className={styles.label}>{Icons.phone} Phone</p>
                    <p>{lead.phone || <span className={styles.textMuted}>N/A</span>}</p>
                  </div>
                  <div>
                    <p className={styles.label}>{Icons.building} Company</p>
                    <p>{lead.company || <span className={styles.textMuted}>N/A</span>}</p>
                  </div>
                  <div>
                    <p className={styles.label}>Service Interest</p>
                    <p>{lead.service || <span className={styles.textMuted}>N/A</span>}</p>
                  </div>
                </div>
                {lead.message && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--int-border)' }}>
                    <p className={styles.label}>Message</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{lead.message}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Proposals */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Proposals ({leadProposals.length})</h2>
                <Link href="/internal/proposals" className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                  {Icons.plus} Create Proposal
                </Link>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {leadProposals.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No proposals created yet.
                  </div>
                ) : (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadProposals.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <Link href={`/internal/proposals/${p.id}`} style={{ fontWeight: 500, color: 'var(--int-primary)' }}>
                                {p.title}
                              </Link>
                            </td>
                            <td>
                              <span className={`${styles.badge} ${
                                p.status === 'accepted' ? styles.badgeSuccess : 
                                p.status === 'declined' ? styles.badgeError : 
                                styles.badgeInfo
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td>${((p.totalAmount ?? 0) / 100).toFixed(2)}</td>
                            <td>{formatDateTime(p.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Notes */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Notes & Activity</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addNote} className={styles.form} style={{ marginBottom: '24px' }}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.inputGroup}>
                    <textarea 
                      className={styles.textarea} 
                      name="content" 
                      placeholder="Add a note..." 
                      rows={3} 
                      required 
                      style={{ minHeight: '80px', borderBottomLeftRadius: 'var(--int-radius)', borderBottomRightRadius: 0 }}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1px' }}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: '100%' }}>
                      {Icons.send} Add Note
                    </button>
                  </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {notes.length === 0 ? (
                    <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No notes yet</p>
                  ) : (
                    notes.map(({ note, authorName, authorEmail }) => (
                      <div key={note.id} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--int-text-secondary)', flexShrink: 0
                        }}>
                          {Icons.user}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{authorName || authorEmail || 'Unknown'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>{formatDateTime(note.createdAt)}</span>
                          </div>
                          <div style={{ background: 'var(--int-bg-alt)', padding: '12px', borderRadius: 'var(--int-radius)', fontSize: '0.95rem' }}>
                            {note.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Status, Similar Projects, NDA, Convert */}
          <div className={styles.form}>
            
            {/* Status */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Status</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={updateStatus} className={styles.form}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.inputGroup}>
                    <select className={styles.select} name="status" defaultValue={lead.status}>
                      <option value="new">New</option>
                      <option value="in_review">In Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="converted">Converted</option>
                    </select>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">Update</button>
                  </div>
                </form>
              </div>
            </section>

            {/* Similar Projects */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.folder} Similar Projects</h2>
              </div>
              <div className={styles.cardBody}>
                {similarProjects.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '12px' }}>
                    No similar projects found
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {similarProjects.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/internal/projects/${p.id}`}
                        style={{ 
                          display: 'block', 
                          padding: '12px', 
                          background: 'var(--int-bg-alt)', 
                          borderRadius: 'var(--int-radius)',
                          textDecoration: 'none',
                          color: 'var(--int-text)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`${styles.badge} ${
                            p.status === 'delivered' || p.status === 'closed' ? styles.badgeSuccess :
                            p.status === 'in_progress' ? styles.badgeInfo :
                            styles.badgeDefault
                          }`}>
                            {p.status}
                          </span>
                          {p.techStack && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                              {Array.isArray(p.techStack) ? p.techStack.join(', ').substring(0, 30) + (p.techStack.join(', ').length > 30 ? '...' : '') : ''}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* NDA Management */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.shield} NDA Management</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ marginBottom: '12px' }}>
                  <p className={styles.label}>Current Status</p>
                  <span className={`${styles.badge} ${
                    lead.ndaStatus === 'signed' ? styles.badgeSuccess :
                    lead.ndaStatus === 'sent' ? styles.badgeInfo :
                    lead.ndaStatus === 'pending' ? styles.badgeWarning :
                    lead.ndaStatus === 'expired' ? styles.badgeError :
                    styles.badgeDefault
                  }`}>
                    {lead.ndaStatus?.replace(/_/g, ' ') || 'Not Required'}
                  </span>
                  {lead.ndaSignedAt && (
                    <span style={{ display: 'block', marginTop: '8px', fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                      Signed: {formatDateTime(lead.ndaSignedAt)}
                    </span>
                  )}
                  {lead.ndaSentAt && !lead.ndaSignedAt && (
                    <span style={{ display: 'block', marginTop: '8px', fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                      Sent: {formatDateTime(lead.ndaSentAt)}
                    </span>
                  )}
                </div>

                {lead.ndaUrl && (
                  <div style={{ marginBottom: '12px' }}>
                    <p className={styles.label}>Document</p>
                    <a 
                      href={lead.ndaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--int-primary)', textDecoration: 'underline', fontSize: '0.9rem' }}
                    >
                      View NDA Document
                    </a>
                  </div>
                )}

                <form action={updateNdaStatus} className={styles.form}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  
                  <div>
                    <label className={styles.formLabel}>Status</label>
                    <select className={styles.select} name="ndaStatus" defaultValue={lead.ndaStatus || 'not_required'}>
                      <option value="not_required">Not Required</option>
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="signed">Signed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>Document URL (optional)</label>
                    <input 
                      className={styles.input} 
                      name="ndaUrl" 
                      type="url" 
                      placeholder="https://..."
                      defaultValue={lead.ndaUrl || ''} 
                    />
                  </div>

                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    Update NDA
                  </button>
                </form>
              </div>
            </section>

            {/* Convert */}
            <section className={`${styles.card} ${lead.status === 'converted' ? '' : styles.cardHoverable}`} style={{ borderColor: lead.status === 'converted' ? 'var(--int-success)' : 'var(--int-primary)' }}>
              <div className={styles.cardHeader} style={{ background: lead.status === 'converted' ? 'var(--int-success-light)' : 'var(--int-primary-light)' }}>
                <h2 className={styles.cardTitle} style={{ color: lead.status === 'converted' ? 'var(--int-success)' : 'var(--int-primary)' }}>
                  {lead.status === 'converted' ? 'Converted to Project' : 'Convert to Project'}
                </h2>
              </div>
              <div className={styles.cardBody}>
                {lead.status === 'converted' ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '16px' }}>This lead has been converted.</p>
                    <Link href={`/internal/projects?fromLead=${lead.id}`} className={`${styles.btn} ${styles.btnSuccess}`}>
                      View Project
                    </Link>
                  </div>
                ) : (
                  <form action={convertToProject} className={styles.form}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    
                    <div>
                      <label className={styles.formLabel}>Project Name</label>
                      <input className={styles.input} name="projectName" defaultValue={`${lead.name} Project`} />
                    </div>

                    <div>
                      <label className={styles.formLabel}>Owner (PM)</label>
                      <select className={styles.select} name="ownerUserId" defaultValue="">
                        <option value="">Unassigned</option>
                        {team.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.email} ({u.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.grid2} style={{ gap: '12px' }}>
                      <div>
                        <label className={styles.formLabel}>Priority</label>
                        <select className={styles.select} name="priority" defaultValue="medium">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className={styles.formLabel}>Due Date</label>
                        <input className={styles.input} name="dueAt" type="date" />
                      </div>
                    </div>

                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%', marginTop: '8px' }}>
                      Create Project + Start Process
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
