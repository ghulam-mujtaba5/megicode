import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import { leads, users, projects, processInstances, tasks, events, leadNotes, leadTags, proposals, feasibilityChecks, estimations, stakeholders, riskAssessments } from '@/lib/db/schema';
import { ensureActiveDefaultProcessDefinition } from '@/lib/workflow/processDefinition';
import { formatDateTime } from '@/lib/internal/ui';
import {
  safeValidateFormData,
  feasibilityCheckFormSchema,
  estimationFormSchema,
  stakeholderFormSchema,
  leadRemoveStakeholderFormSchema,
  riskAssessmentFormSchema,
  removeByIdFormSchema,
  leadAddNoteFormSchema,
  leadAddTagFormSchema,
  leadRemoveTagFormSchema,
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

  const tags = await db.select().from(leadTags).where(eq(leadTags.leadId, id)).all();
  const leadProposals = await db.select().from(proposals).where(eq(proposals.leadId, id)).orderBy(desc(proposals.createdAt)).all();
  
  // Fetch feasibility check for this lead
  const feasibilityCheck = await db.select().from(feasibilityChecks).where(eq(feasibilityChecks.leadId, id)).get();
  
  // Fetch estimations for this lead
  const leadEstimations = await db.select().from(estimations).where(eq(estimations.leadId, id)).orderBy(desc(estimations.createdAt)).all();
  
  // Fetch stakeholders for this lead
  const leadStakeholders = await db.select().from(stakeholders).where(eq(stakeholders.leadId, id)).orderBy(desc(stakeholders.createdAt)).all();

  // Fetch risk assessments for this lead
  const leadRisks = await db.select().from(riskAssessments).where(eq(riskAssessments.leadId, id)).orderBy(desc(riskAssessments.createdAt)).all();

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

  // Server actions for feasibility check
  async function saveFeasibilityCheck(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(feasibilityCheckFormSchema, formData);
    if (!result.success) return;
    const { leadId, technicalFeasibility, resourceAvailability, timelineRealistic, budgetAdequate, riskLevel, notes } = result.data;

    // Check if exists
    const existing = await db.select().from(feasibilityChecks).where(eq(feasibilityChecks.leadId, leadId)).get();
    
    if (existing) {
      await db.update(feasibilityChecks).set({
        technicalFeasibility: technicalFeasibility || null,
        resourceAvailability: resourceAvailability || null,
        timelineRealistic,
        budgetAdequate,
        riskLevel: riskLevel || null,
        notes: notes || null,
        reviewedByUserId: session.user.id ?? null,
        reviewedAt: new Date(),
      }).where(eq(feasibilityChecks.id, existing.id));
    } else {
      await db.insert(feasibilityChecks).values({
        id: crypto.randomUUID(),
        leadId,
        technicalFeasibility: technicalFeasibility || null,
        resourceAvailability: resourceAvailability || null,
        timelineRealistic,
        budgetAdequate,
        riskLevel: riskLevel || null,
        notes: notes || null,
        reviewedByUserId: session.user.id ?? null,
        reviewedAt: new Date(),
        createdAt: new Date(),
      });
    }

    redirect(`/internal/leads/${leadId}`);
  }

  async function addEstimation(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(estimationFormSchema, formData);
    if (!result.success) return;
    const { leadId, title, totalHours, hourlyRate, complexity, confidence, assumptions } = result.data;

    const now = new Date();
    await db.insert(estimations).values({
      id: crypto.randomUUID(),
      leadId,
      title: title || 'Project Estimation',
      totalHours,
      hourlyRate,
      complexity,
      confidence,
      assumptions: assumptions || null,
      createdByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function addStakeholder(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(stakeholderFormSchema, formData);
    if (!result.success) return;
    const { leadId, name, role, email, influence, interest } = result.data;

    await db.insert(stakeholders).values({
      id: crypto.randomUUID(),
      leadId,
      name,
      role,
      email,
      influence,
      interest,
      createdAt: new Date(),
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function removeStakeholder(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(leadRemoveStakeholderFormSchema, formData);
    if (!result.success) return;
    const { id: stakeholderId, leadId } = result.data;

    await db.delete(stakeholders).where(eq(stakeholders.id, stakeholderId));
    redirect(`/internal/leads/${leadId}`);
  }

  async function addRiskAssessment(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(riskAssessmentFormSchema, formData);
    if (!result.success) return;
    const { leadId, title, description, category, probability, impact, mitigationPlan } = result.data;

    // Calculate risk score: probability (1-3) * impact (1-4)
    const probScore = probability === 'low' ? 1 : probability === 'medium' ? 2 : 3;
    const impactScore = impact === 'low' ? 1 : impact === 'medium' ? 2 : impact === 'high' ? 3 : 4;
    const riskScore = probScore * impactScore;

    const now = new Date();
    await db.insert(riskAssessments).values({
      id: crypto.randomUUID(),
      leadId,
      title,
      description,
      category,
      probability,
      impact,
      riskScore,
      mitigationPlan,
      identifiedByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/leads/${leadId}`);
  }

  async function removeRiskAssessment(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(removeByIdFormSchema, formData);
    if (!result.success) return;
    const { id: riskId, leadId } = result.data;

    await db.delete(riskAssessments).where(eq(riskAssessments.id, riskId));
    redirect(`/internal/leads/${leadId}`);
  }

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

  async function addTag(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(leadAddTagFormSchema, formData);
    if (!result.success) return;
    const { leadId, tag } = result.data;

    // Check if tag already exists
    const existing = await db.select().from(leadTags).where(and(eq(leadTags.leadId, leadId), eq(leadTags.tag, tag))).get();
    if (!existing) {
      await db.insert(leadTags).values({
        id: crypto.randomUUID(),
        leadId,
        tag,
      });
    }

    redirect(`/internal/leads/${leadId}`);
  }

  async function removeTag(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const result = safeValidateFormData(leadRemoveTagFormSchema, formData);
    if (!result.success) return;
    const { id, leadId } = result.data;

    await db.delete(leadTags).where(eq(leadTags.id, id));
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
          {/* Left Column: Details, Proposals, Notes */}
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

            {/* Feasibility Check */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.clipboard} Feasibility Check</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={saveFeasibilityCheck} className={styles.form}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Technical Feasibility</label>
                      <select className={styles.select} name="technicalFeasibility" defaultValue={feasibilityCheck?.technicalFeasibility ?? ''}>
                        <option value="">Not assessed</option>
                        <option value="feasible">Feasible</option>
                        <option value="challenging">Challenging</option>
                        <option value="not_feasible">Not Feasible</option>
                        <option value="needs_research">Needs Research</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Resource Availability</label>
                      <select className={styles.select} name="resourceAvailability" defaultValue={feasibilityCheck?.resourceAvailability ?? ''}>
                        <option value="">Not assessed</option>
                        <option value="available">Available</option>
                        <option value="limited">Limited</option>
                        <option value="not_available">Not Available</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Risk Level</label>
                      <select className={styles.select} name="riskLevel" defaultValue={feasibilityCheck?.riskLevel ?? ''}>
                        <option value="">Not assessed</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="timelineRealistic" defaultChecked={feasibilityCheck?.timelineRealistic ?? false} />
                        Timeline Realistic
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                        <input type="checkbox" name="budgetAdequate" defaultChecked={feasibilityCheck?.budgetAdequate ?? false} />
                        Budget Adequate
                      </label>
                    </div>
                  </div>
                  <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                    <label className={styles.label}>Notes</label>
                    <textarea 
                      className={styles.textarea} 
                      name="notes" 
                      defaultValue={feasibilityCheck?.notes ?? ''} 
                      placeholder="Add feasibility assessment notes..."
                      rows={3}
                    ></textarea>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                      {Icons.check} Save Feasibility Check
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Estimations */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.calculator} Estimations ({leadEstimations.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addEstimation} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Estimation Title</label>
                      <input className={styles.input} type="text" name="title" placeholder="e.g., MVP Development" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Total Hours</label>
                      <input className={styles.input} type="number" name="totalHours" placeholder="e.g., 160" min="0" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Hourly Rate ($)</label>
                      <input className={styles.input} type="number" name="hourlyRate" placeholder="e.g., 150" min="0" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Complexity</label>
                      <select className={styles.select} name="complexity">
                        <option value="">Select complexity</option>
                        <option value="simple">Simple</option>
                        <option value="moderate">Moderate</option>
                        <option value="complex">Complex</option>
                        <option value="very_complex">Very Complex</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Confidence Level</label>
                      <select className={styles.select} name="confidence">
                        <option value="">Select confidence</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                    <label className={styles.label}>Assumptions</label>
                    <textarea className={styles.textarea} name="assumptions" placeholder="List key assumptions..." rows={2}></textarea>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                      {Icons.plus} Add Estimation
                    </button>
                  </div>
                </form>
                
                {leadEstimations.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No estimations yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Budget vs Estimate Alert */}
                    {(() => {
                      const totalEstimated = leadEstimations.reduce((sum, est) => sum + ((est.totalHours ?? 0) * (est.hourlyRate ?? 0)), 0);
                      const budgetCents = (lead.estimatedBudget ?? 0);
                      if (budgetCents > 0 && totalEstimated > budgetCents) {
                        const overAmount = (totalEstimated - budgetCents) / 100;
                        return (
                          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--int-error)', borderRadius: 'var(--int-radius)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {Icons.alert}
                            <div>
                              <strong style={{ color: 'var(--int-error)' }}>Budget Alert:</strong>{' '}
                              <span>Total estimates (${(totalEstimated / 100).toLocaleString()}) exceed budget (${(budgetCents / 100).toLocaleString()}) by <strong>${overAmount.toLocaleString()}</strong></span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {leadEstimations.map((est) => (
                      <div key={est.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 600 }}>{est.title}</span>
                          <span className={`${styles.badge} ${styles.badgeInfo}`}>{est.complexity ?? 'N/A'}</span>
                        </div>
                        <div className={styles.grid2}>
                          <div>
                            <span className={styles.label}>{Icons.clock} Hours</span>
                            <p style={{ fontWeight: 600 }}>{est.totalHours ?? 'N/A'}</p>
                          </div>
                          <div>
                            <span className={styles.label}>Rate</span>
                            <p style={{ fontWeight: 600 }}>${((est.hourlyRate ?? 0) / 100).toFixed(0)}/hr</p>
                          </div>
                          <div>
                            <span className={styles.label}>Total</span>
                            <p style={{ fontWeight: 600, color: 'var(--int-primary)' }}>
                              ${(((est.totalHours ?? 0) * (est.hourlyRate ?? 0)) / 100).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className={styles.label}>Confidence</span>
                            <p>{est.confidence ?? 'N/A'}</p>
                          </div>
                        </div>
                        {est.assumptions && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--int-border)' }}>
                            <span className={styles.label}>Assumptions</span>
                            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{est.assumptions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Stakeholders */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.users} Stakeholders ({leadStakeholders.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addStakeholder} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Name *</label>
                      <input className={styles.input} type="text" name="name" placeholder="Stakeholder name" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Role</label>
                      <input className={styles.input} type="text" name="role" placeholder="e.g., CEO, Product Manager" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email</label>
                      <input className={styles.input} type="email" name="email" placeholder="email@example.com" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Influence</label>
                      <select className={styles.select} name="influence">
                        <option value="">Select level</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Interest</label>
                      <select className={styles.select} name="interest">
                        <option value="">Select level</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                      {Icons.plus} Add Stakeholder
                    </button>
                  </div>
                </form>
                
                {leadStakeholders.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No stakeholders added yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leadStakeholders.map((sh) => (
                      <div key={sh.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600 }}>{sh.name}</span>
                            {sh.role && <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', fontSize: '0.75rem' }}>{sh.role}</span>}
                          </div>
                          {sh.email && <p style={{ fontSize: '0.85rem', color: 'var(--int-text-muted)' }}>{sh.email}</p>}
                          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem' }}>
                            {sh.influence && <span>Influence: <strong>{sh.influence}</strong></span>}
                            {sh.interest && <span>Interest: <strong>{sh.interest}</strong></span>}
                          </div>
                        </div>
                        <form action={removeStakeholder}>
                          <input type="hidden" name="id" value={sh.id} />
                          <input type="hidden" name="leadId" value={lead.id} />
                          <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }}>
                            {Icons.trash}
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Risk Assessment */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.alert} Risk Assessment ({leadRisks.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addRiskAssessment} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Risk Title *</label>
                      <input className={styles.input} type="text" name="title" placeholder="e.g., Tight deadline" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Category *</label>
                      <select className={styles.select} name="category" required>
                        <option value="">Select category</option>
                        <option value="technical">Technical</option>
                        <option value="resource">Resource</option>
                        <option value="timeline">Timeline</option>
                        <option value="budget">Budget</option>
                        <option value="scope">Scope</option>
                        <option value="external">External</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Probability *</label>
                      <select className={styles.select} name="probability" required>
                        <option value="">Select probability</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Impact *</label>
                      <select className={styles.select} name="impact" required>
                        <option value="">Select impact</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} name="description" rows={2} placeholder="Describe the risk..."></textarea>
                    </div>
                    <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles.label}>Mitigation Plan</label>
                      <textarea className={styles.textarea} name="mitigationPlan" rows={2} placeholder="How to mitigate this risk..."></textarea>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                      {Icons.plus} Add Risk
                    </button>
                  </div>
                </form>

                {leadRisks.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No risks identified yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {leadRisks.map((risk) => {
                      const riskColor = risk.riskScore && risk.riskScore >= 9 ? 'var(--int-error)' : risk.riskScore && risk.riskScore >= 6 ? '#f59e0b' : 'var(--int-success)';
                      return (
                        <div key={risk.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)', borderLeft: `4px solid ${riskColor}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600 }}>{risk.title}</span>
                                <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{risk.category}</span>
                                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: riskColor, color: 'white' }}>
                                  Score: {risk.riskScore ?? 'N/A'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', marginBottom: '8px' }}>
                                <span>Probability: <strong style={{ textTransform: 'capitalize' }}>{risk.probability}</strong></span>
                                <span>Impact: <strong style={{ textTransform: 'capitalize' }}>{risk.impact}</strong></span>
                              </div>
                              {risk.description && <p style={{ fontSize: '0.9rem', color: 'var(--int-text-muted)', marginBottom: '8px' }}>{risk.description}</p>}
                              {risk.mitigationPlan && (
                                <div style={{ background: 'var(--int-bg-alt)', padding: '8px 12px', borderRadius: 'var(--int-radius)', fontSize: '0.85rem' }}>
                                  <strong>Mitigation:</strong> {risk.mitigationPlan}
                                </div>
                              )}
                            </div>
                            <form action={removeRiskAssessment}>
                              <input type="hidden" name="id" value={risk.id} />
                              <input type="hidden" name="leadId" value={lead.id} />
                              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }}>
                                {Icons.trash}
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    })}
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

          {/* Right Column: Status, Tags, Actions */}
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

            {/* Tags */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Tags</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {tags.length === 0 ? (
                    <span className={styles.textMuted} style={{ fontSize: '0.9rem' }}>No tags</span>
                  ) : (
                    tags.map((t) => (
                      <form key={t.id} action={removeTag}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="leadId" value={lead.id} />
                        <button 
                          type="submit" 
                          className={`${styles.badge} ${styles.badgeInfo}`}
                          style={{ cursor: 'pointer', border: 'none', paddingRight: '4px' }}
                          title="Remove tag"
                        >
                          {t.tag} 
                          <span style={{ marginLeft: '4px', opacity: 0.6 }}>{Icons.trash}</span>
                        </button>
                      </form>
                    ))
                  )}
                </div>
                <form action={addTag} className={styles.form}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className={styles.inputGroup}>
                    <input className={styles.input} name="tag" placeholder="Add tag..." required />
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
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
