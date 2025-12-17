import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { desc, eq, and } from 'drizzle-orm';

import styles from '../../styles.module.css';
import { requireInternalSession, requireRole } from '@/lib/internal/auth';
import { getDb } from '@/lib/db';
import {
  events,
  processDefinitions,
  processInstances,
  projects,
  tasks,
  users,
  milestones,
  projectNotes,
  timeEntries,
  invoices,
  attachments,
  qaSignoffs,
  retrospectives,
  npsSurveys,
  feedbackItems,
  environmentConfigs,
  meetingNotes,
  supportTickets,
  apiEndpoints,
  caseStudies,
  accessibilityAudits,
  mobileChecks,
} from '@/lib/db/schema';
import { taskStatusColor, type BadgeColor, formatDateTime, projectStatusColor } from '@/lib/internal/ui';
import {
  createProjectAttachmentFormSchema,
  createProjectFeedbackFormSchema,
  createProjectNoteFormSchema,
  createQaSignoffFormSchema,
  createRetrospectiveFormSchema,
  createNpsSurveyFormSchema,
  resolveFeedbackFormSchema,
  toggleMilestoneFormSchema,
  updateProjectFormSchema,
  updateTaskAssignmentFormSchema,
  createMilestoneSchema,
  safeValidateFormData,
} from '@/lib/validations';

import { FormDatePicker } from '@/components/DatePicker';

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
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
  paperclip: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  list: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  ticket: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 1-3-3 3 3 0 0 1 3-3V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4z"/>
    </svg>
  ),
  api: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  book: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  accessibility: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2"/>
      <path d="m12 8-4 2 4 9 4-9-4-2z"/>
      <path d="M12 8v6"/>
      <path d="M4 10l8 2 8-2"/>
    </svg>
  ),
  mobile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
};

function badgeClass(color: BadgeColor) {
  if (color === 'blue') return `${styles.badge} ${styles.badgeInfo}`;
  if (color === 'green') return `${styles.badge} ${styles.badgeSuccess}`;
  if (color === 'yellow') return `${styles.badge} ${styles.badgeWarning}`;
  if (color === 'red') return `${styles.badge} ${styles.badgeError}`;
  return `${styles.badge} ${styles.badgeDefault}`;
}

function nextCurrentStepKey(orderedKeys: string[], tasksByKey: Map<string, { status: string }>) {
  for (const key of orderedKeys) {
    const task = tasksByKey.get(key);
    if (!task) continue;
    if (task.status !== 'done' && task.status !== 'canceled') return key;
  }
  return null;
}

function deriveProjectStatus(currentStepKey: string | null, taskRows: Array<{ status: string }>) {
  if (taskRows.some((t) => t.status === 'blocked')) return 'blocked' as const;
  if (taskRows.every((t) => t.status === 'done' || t.status === 'canceled')) return 'closed' as const;
  if (currentStepKey === 'qa' || currentStepKey === 'testing') return 'in_qa' as const;
  if (taskRows.some((t) => t.status === 'in_progress')) return 'in_progress' as const;
  return 'new' as const;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireInternalSession();
  const { id } = await params;
  const db = getDb();
  const isPmOrAdmin = session.user.role === 'pm' || session.user.role === 'admin';

  const project = await db.select().from(projects).where(eq(projects.id, id)).get();
  if (!project) notFound();

  const instance = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.projectId, project.id))
    .orderBy(desc(processInstances.startedAt))
    .get();

  const taskRows = instance
    ? await db
        .select()
        .from(tasks)
        .where(eq(tasks.instanceId, instance.id))
        .all()
    : [];

  const userRows = await db.select().from(users).all();
  const usersById = new Map(userRows.map((u) => [u.id, u] as const));

  const eventRows = await db
    .select()
    .from(events)
    .where(eq(events.projectId, project.id))
    .orderBy(desc(events.createdAt))
    .limit(20)
    .all();

  let definitionRow = null;
  let definitionJson = null;
  
  try {
    definitionRow = instance
      ? await db.select().from(processDefinitions).where(eq(processDefinitions.id, instance.processDefinitionId)).get()
      : null;

    definitionJson = definitionRow
      ? (definitionRow.json as { steps: Array<{ key: string; title: string }> })
      : null;
  } catch (error) {
    console.error('Error loading process definition for project:', error);
    // Continue without definition
  }

  const milestonesRows = await db.select().from(milestones).where(eq(milestones.projectId, project.id)).orderBy(milestones.dueAt).all();
  
  const attachmentsList = await db.select({
    attachment: attachments,
    uploaderName: users.name,
  })
  .from(attachments)
  .leftJoin(users, eq(attachments.uploadedByUserId, users.id))
  .where(and(eq(attachments.entityType, 'project'), eq(attachments.entityId, id)))
  .orderBy(desc(attachments.createdAt))
  .all();

  const notes = await db.select({
    note: projectNotes,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(projectNotes)
  .leftJoin(users, eq(projectNotes.authorUserId, users.id))
  .where(eq(projectNotes.projectId, project.id))
  .orderBy(desc(projectNotes.createdAt))
  .all();

  const projectTime = await db.select().from(timeEntries).where(eq(timeEntries.projectId, project.id)).all();
  const totalMinutes = projectTime.reduce((sum, t) => sum + t.minutes, 0);

  const projectInvoices = await db.select().from(invoices).where(eq(invoices.projectId, project.id)).orderBy(desc(invoices.createdAt)).all();

  // QA Signoffs with user info
  const qaSignoffsList = await db.select({
    signoff: qaSignoffs,
    signedByName: users.name,
  })
  .from(qaSignoffs)
  .leftJoin(users, eq(qaSignoffs.signedByUserId, users.id))
  .where(eq(qaSignoffs.projectId, project.id))
  .orderBy(desc(qaSignoffs.createdAt))
  .all();

  // Retrospectives
  const retrospectivesList = await db.select({
    retro: retrospectives,
    conductedByName: users.name,
  })
  .from(retrospectives)
  .leftJoin(users, eq(retrospectives.conductedByUserId, users.id))
  .where(eq(retrospectives.projectId, project.id))
  .orderBy(desc(retrospectives.conductedAt))
  .all();

  // NPS Surveys
  const npsSurveysList = await db.select().from(npsSurveys).where(eq(npsSurveys.projectId, project.id)).orderBy(desc(npsSurveys.createdAt)).all();

  // Feedback Items
  const feedbackList = await db.select()
  .from(feedbackItems)
  .where(eq(feedbackItems.projectId, project.id))
  .orderBy(desc(feedbackItems.createdAt))
  .all();

  // Environment Configs
  const envConfigsList = await db.select()
  .from(environmentConfigs)
  .where(eq(environmentConfigs.projectId, project.id))
  .orderBy(environmentConfigs.environment, environmentConfigs.key)
  .all();

  // Meeting Notes
  const meetingNotesList = await db.select({
    note: meetingNotes,
    recordedByName: users.name,
  })
  .from(meetingNotes)
  .leftJoin(users, eq(meetingNotes.recordedByUserId, users.id))
  .where(eq(meetingNotes.projectId, project.id))
  .orderBy(desc(meetingNotes.meetingDate))
  .all();

  // Support Tickets
  const supportTicketsList = await db.select({
    ticket: supportTickets,
    assignedToName: users.name,
  })
  .from(supportTickets)
  .leftJoin(users, eq(supportTickets.assignedToUserId, users.id))
  .where(eq(supportTickets.projectId, project.id))
  .orderBy(desc(supportTickets.createdAt))
  .all();

  // API Endpoints
  const apiEndpointsList = await db.select()
  .from(apiEndpoints)
  .where(eq(apiEndpoints.projectId, project.id))
  .orderBy(apiEndpoints.path)
  .all();

  // Critical Path Analysis - find tasks that block delivery
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const criticalTasks = taskRows
    .filter(t => {
      // Only consider non-completed tasks
      if (t.status === 'done' || t.status === 'canceled') return false;
      // Blocked tasks are always critical
      if (t.status === 'blocked') return true;
      // Tasks due within 3 days or overdue
      if (t.dueAt && t.dueAt <= threeDaysFromNow) return true;
      return false;
    })
    .sort((a, b) => {
      // Sort: blocked first, then by due date (earliest first)
      if (a.status === 'blocked' && b.status !== 'blocked') return -1;
      if (b.status === 'blocked' && a.status !== 'blocked') return 1;
      const aTime = a.dueAt?.getTime() ?? Infinity;
      const bTime = b.dueAt?.getTime() ?? Infinity;
      return aTime - bTime;
    })
    .slice(0, 5); // Show top 5 critical tasks

  // Case Studies
  const caseStudiesList = await db.select()
  .from(caseStudies)
  .where(eq(caseStudies.projectId, project.id))
  .orderBy(desc(caseStudies.createdAt))
  .all();

  // Accessibility Audits
  const accessibilityList = await db.select()
    .from(accessibilityAudits)
    .where(eq(accessibilityAudits.projectId, project.id))
    .orderBy(desc(accessibilityAudits.createdAt))
    .all();

  // Mobile Responsiveness Checks
  const mobileChecksList = await db.select()
    .from(mobileChecks)
    .where(eq(mobileChecks.projectId, project.id))
    .orderBy(desc(mobileChecks.createdAt))
    .all();

  // Server action for QA Signoff
  async function addQaSignoff(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'qa']);
    const db = getDb();

    const parsed = safeValidateFormData(createQaSignoffFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, version, status, milestoneId, notes } = parsed.data;

    await db.insert(qaSignoffs).values({
      id: crypto.randomUUID(),
      projectId,
      milestoneId: milestoneId ?? null,
      version: version || null,
      status: status || 'pending',
      signedByUserId: session.user.id ?? null,
      signedAt: new Date(),
      notes: notes || null,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Retrospective
  async function addRetrospective(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(createRetrospectiveFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, startItems, stopItems, continueItems, actionItems } = parsed.data;
    
    // Parse items - expect one item per line, filter empty
    const parseItems = (str?: string) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : null;

    await db.insert(retrospectives).values({
      id: crypto.randomUUID(),
      projectId: projectId,
      createdAt: new Date(),
      startItems: parseItems(startItems),
      stopItems: parseItems(stopItems),
      continueItems: parseItems(continueItems),
      actionItems: parseItems(actionItems),
      conductedByUserId: session.user.id ?? null,
      conductedAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for NPS Survey
  async function addNpsSurvey(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(createNpsSurveyFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, score, feedback, respondentEmail, clientId } = parsed.data;

    await db.insert(npsSurveys).values({
      id: crypto.randomUUID(),
      projectId,
      clientId: clientId ?? null,
      score,
      feedback: feedback || null,
      respondentEmail: respondentEmail || null,
      respondedAt: new Date(),
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Feedback
  async function addFeedback(formData: FormData) {
    'use server';
    await requireInternalSession();
    const db = getDb();

    const parsed = safeValidateFormData(createProjectFeedbackFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, type, content, priority, source } = parsed.data;

    await db.insert(feedbackItems).values({
      id: crypto.randomUUID(),
      projectId,
      type: type || 'enhancement',
      content,
      priority: priority || 'medium',
      status: 'new',
      source: source || 'portal',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function resolveFeedback(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(resolveFeedbackFormSchema, formData);
    if (!parsed.success) return;

    const { feedbackId, projectId } = parsed.data;

    await db.update(feedbackItems).set({ 
      status: 'resolved',
      updatedAt: new Date(),
    }).where(eq(feedbackItems.id, feedbackId));

    redirect(`/internal/projects/${projectId}`);
  }

  async function addAttachment(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const parsed = safeValidateFormData(createProjectAttachmentFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, filename, url } = parsed.data;

    await db.insert(attachments).values({
      id: crypto.randomUUID(),
      entityType: 'project',
      entityId: projectId,
      filename,
      url,
      uploadedByUserId: session.user.id ?? null,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function addMilestone(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(createMilestoneSchema, formData);
    if (!parsed.success) return;

    const { projectId, title, dueAt } = parsed.data;

    await db.insert(milestones).values({
      id: crypto.randomUUID(),
      projectId,
      title,
      dueAt: dueAt ?? null,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function toggleMilestone(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(toggleMilestoneFormSchema, formData);
    if (!parsed.success) return;

    const { id, completed, projectId } = parsed.data;

    const now = new Date();
    await db.update(milestones).set({ 
      completedAt: completed ? null : now 
    }).where(eq(milestones.id, id));

    redirect(`/internal/projects/${projectId}`);
  }

  async function addNote(formData: FormData) {
    'use server';
    const session = await requireInternalSession();
    const db = getDb();

    const parsed = safeValidateFormData(createProjectNoteFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, content } = parsed.data;

    await db.insert(projectNotes).values({
      id: crypto.randomUUID(),
      projectId,
      authorUserId: session.user.id ?? null,
      content,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateProject(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const parsed = safeValidateFormData(updateProjectFormSchema, formData);
    if (!parsed.success) return;

    const { projectId, status, priority } = parsed.data;

    await db.update(projects).set({ status, priority, updatedAt: new Date() }).where(eq(projects.id, projectId));

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateTask(formData: FormData) {
    'use server';

    const session = await requireInternalSession();
    const db = getDb();

    const parsed = safeValidateFormData(updateTaskAssignmentFormSchema, formData);
    if (!parsed.success) return;

    const { taskId, status, assignedToUserId } = parsed.data;

    const taskRow = await db.select().from(tasks).where(eq(tasks.id, taskId)).get();
    if (!taskRow) return;

    const now = new Date();
    const completedAt = status === 'done' ? now : null;

    await db
      .update(tasks)
      .set({
        status,
        assignedToUserId,
        completedAt,
        updatedAt: now,
      })
      .where(eq(tasks.id, taskId));

    // Update instance current step + project status
    const instance = await db.select().from(processInstances).where(eq(processInstances.id, taskRow.instanceId)).get();
    if (instance) {
      const allTasks = await db.select().from(tasks).where(eq(tasks.instanceId, instance.id)).all();
      const defRow = await db.select().from(processDefinitions).where(eq(processDefinitions.id, instance.processDefinitionId)).get();

      const defJson = defRow ? (defRow.json as { steps: Array<{ key: string }> }) : null;
      const orderedKeys = defJson?.steps?.map((s) => s.key) ?? allTasks.map((t) => t.key);
      const byKey = new Map(allTasks.map((t) => [t.key, { status: t.status }] as const));
      const currentStepKey = nextCurrentStepKey(orderedKeys, byKey);

      await db.update(processInstances).set({ currentStepKey }).where(eq(processInstances.id, instance.id));

      const projectStatus = deriveProjectStatus(currentStepKey, allTasks);
      await db.update(projects).set({ status: projectStatus, updatedAt: now }).where(eq(projects.id, instance.projectId));

      await db.insert(events).values({
        id: crypto.randomUUID(),
        projectId: instance.projectId,
        instanceId: instance.id,
        type: 'task.updated',
        actorUserId: session.user.id ?? null,
        payloadJson: { taskId, status, assignedToUserId },
        createdAt: now,
      });
    }
  }

  // Server action for Environment Config
  async function addEnvConfig(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm', 'dev']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const key = String(formData.get('key') ?? '').trim().toUpperCase();
    const description = String(formData.get('description') ?? '').trim();
    const environment = String(formData.get('environment') ?? 'production').trim() as 'development' | 'staging' | 'production';
    const isSecret = formData.get('isSecret') === 'on';

    if (!projectId || !key) return;

    await db.insert(environmentConfigs).values({
      id: crypto.randomUUID(),
      projectId,
      key,
      description: description || null,
      environment,
      isSecret,
      hasValue: false,
      createdAt: new Date(),
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function removeEnvConfig(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const configId = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();

    if (!configId) return;

    await db.delete(environmentConfigs).where(eq(environmentConfigs.id, configId));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Meeting Notes
  async function addMeetingNote(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'dev']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const meetingType = String(formData.get('meetingType') ?? 'other').trim() as 'standup' | 'planning' | 'review' | 'retrospective' | 'client' | 'technical' | 'other';
    const notes = String(formData.get('notes') ?? '').trim();
    const actionItemsStr = String(formData.get('actionItems') ?? '').trim();
    const meetingDateStr = String(formData.get('meetingDate') ?? '').trim();
    const meetingDate = meetingDateStr ? new Date(meetingDateStr) : new Date();

    if (!projectId || !title) return;
    
    // Parse actionItems - expect one item per line
    const actionItems = actionItemsStr ? actionItemsStr.split('\n').map(line => ({ description: line.trim() })).filter(item => item.description) : null;

    const now = new Date();
    await db.insert(meetingNotes).values({
      id: crypto.randomUUID(),
      projectId,
      title,
      meetingType,
      notes: notes || null,
      actionItems: actionItems || null,
      recordedByUserId: session.user.id ?? null,
      meetingDate,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function removeMeetingNote(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const noteId = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();

    if (!noteId) return;

    await db.delete(meetingNotes).where(eq(meetingNotes.id, noteId));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Support Ticket
  async function addSupportTicket(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm', 'dev', 'qa']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? 'other').trim() as 'bug' | 'question' | 'feature_request' | 'performance' | 'security' | 'other';
    const priority = String(formData.get('priority') ?? 'medium').trim() as 'low' | 'medium' | 'high' | 'urgent';
    const assignedToUserId = String(formData.get('assignedToUserId') ?? '').trim() || null;

    if (!projectId || !title) return;

    // Generate ticket number
    const existingTickets = await db.select().from(supportTickets).all();
    const ticketNumber = `TKT-${String(existingTickets.length + 1).padStart(5, '0')}`;

    const now = new Date();
    await db.insert(supportTickets).values({
      id: crypto.randomUUID(),
      projectId,
      ticketNumber,
      title,
      description: description || null,
      category,
      priority,
      status: 'open',
      assignedToUserId,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateTicketStatus(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm', 'dev', 'qa']);
    const db = getDb();

    const ticketId = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const status = String(formData.get('status') ?? 'open').trim() as 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';

    if (!ticketId) return;

    const now = new Date();
    const updates: { status: typeof status; updatedAt: Date; resolvedAt?: Date; closedAt?: Date } = { status, updatedAt: now };
    
    if (status === 'resolved') updates.resolvedAt = now;
    if (status === 'closed') updates.closedAt = now;

    await db.update(supportTickets).set(updates).where(eq(supportTickets.id, ticketId));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for API Endpoint
  async function addApiEndpoint(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'dev']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const method = String(formData.get('method') ?? 'GET').trim() as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    const path = String(formData.get('path') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const authRequired = formData.get('authRequired') === 'on';
    const roleRequired = String(formData.get('roleRequired') ?? '').trim() || null;
    const requestBodySchema = String(formData.get('requestBodySchema') ?? '').trim() || null;
    const responseSchema = String(formData.get('responseSchema') ?? '').trim() || null;

    if (!projectId || !path) return;

    const now = new Date();
    await db.insert(apiEndpoints).values({
      id: crypto.randomUUID(),
      projectId,
      method,
      path,
      description: description || null,
      authRequired,
      roleRequired,
      requestBodySchema,
      responseSchema,
      status: 'planned',
      createdByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateApiEndpointStatus(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm', 'dev']);
    const db = getDb();

    const endpointId = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const status = String(formData.get('status') ?? 'planned').trim() as 'planned' | 'in_progress' | 'implemented' | 'deprecated';

    if (!endpointId) return;

    const now = new Date();
    const updates: { status: typeof status; updatedAt: Date; implementedAt?: Date } = { status, updatedAt: now };
    
    if (status === 'implemented') updates.implementedAt = now;

    await db.update(apiEndpoints).set(updates).where(eq(apiEndpoints.id, endpointId));
    redirect(`/internal/projects/${projectId}`);
  }

  async function removeApiEndpoint(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const endpointId = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();

    if (!endpointId) return;

    await db.delete(apiEndpoints).where(eq(apiEndpoints.id, endpointId));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Case Study
  async function createCaseStudyDraft(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const summary = String(formData.get('summary') ?? '').trim();

    if (!projectId || !title) return;

    const now = new Date();
    await db.insert(caseStudies).values({
      id: crypto.randomUUID(),
      projectId,
      title,
      summary: summary || null,
      status: 'draft',
      createdByUserId: session.user.id ?? null,
      createdAt: now,
      updatedAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateCaseStudy(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const challenge = String(formData.get('challenge') ?? '').trim();
    const solution = String(formData.get('solution') ?? '').trim();
    const results = String(formData.get('results') ?? '').trim();
    const testimonial = String(formData.get('testimonial') ?? '').trim();
    const testimonialAuthor = String(formData.get('testimonialAuthor') ?? '').trim();
    const status = String(formData.get('status') ?? 'draft').trim() as 'draft' | 'review' | 'published' | 'archived';

    if (!id) return;

    const now = new Date();
    const updates = {
      challenge: challenge || null,
      solution: solution || null,
      results: results || null,
      testimonial: testimonial || null,
      testimonialAuthor: testimonialAuthor || null,
      status,
      updatedAt: now,
      ...(status === 'published' && { publishedAt: now }),
    };

    await db.update(caseStudies).set(updates).where(eq(caseStudies.id, id));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Accessibility Audit
  async function addAccessibilityIssue(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'qa', 'dev']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const wcagLevel = String(formData.get('wcagLevel') ?? 'AA').trim() as 'A' | 'AA' | 'AAA';
    const criterion = String(formData.get('criterion') ?? '').trim();
    const criterionTitle = String(formData.get('criterionTitle') ?? '').trim();
    const severity = String(formData.get('severity') ?? 'moderate').trim() as 'minor' | 'moderate' | 'serious' | 'critical';
    const location = String(formData.get('location') ?? '').trim();
    const affectedUsers = String(formData.get('affectedUsers') ?? '').trim();
    const recommendation = String(formData.get('recommendation') ?? '').trim();

    if (!projectId || !title || !criterion) return;

    const now = new Date();
    await db.insert(accessibilityAudits).values({
      id: crypto.randomUUID(),
      projectId,
      wcagLevel,
      criterion,
      criterionTitle: criterionTitle || null,
      severity,
      title,
      description: description || null,
      location: location || null,
      affectedUsers: affectedUsers || null,
      recommendation: recommendation || null,
      status: 'open',
      auditedByUserId: session.user.id ?? null,
      auditedAt: now,
      createdAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateAccessibilityStatus(formData: FormData) {
    'use server';
    await requireRole(['admin', 'pm', 'qa', 'dev']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const status = String(formData.get('status') ?? 'open').trim() as 'open' | 'in_progress' | 'resolved' | 'wont_fix';

    if (!id) return;

    const now = new Date();
    const updates: Record<string, unknown> = {
      status,
    };
    if (status === 'resolved' || status === 'wont_fix') {
      updates.resolvedAt = now;
    }

    await db.update(accessibilityAudits).set(updates).where(eq(accessibilityAudits.id, id));
    redirect(`/internal/projects/${projectId}`);
  }

  // Server action for Mobile Responsiveness Check
  async function addMobileCheck(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'qa', 'dev']);
    const db = getDb();

    const projectId = String(formData.get('projectId') ?? '').trim();
    const checkItem = String(formData.get('checkItem') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? 'layout').trim() as 'layout' | 'navigation' | 'touch' | 'performance' | 'typography' | 'forms' | 'media' | 'other';
    const breakpoint = String(formData.get('breakpoint') ?? '').trim();
    const status = String(formData.get('status') ?? 'not_tested').trim() as 'not_tested' | 'pass' | 'fail' | 'partial' | 'na';
    const notes = String(formData.get('notes') ?? '').trim();
    const testedOnDevice = String(formData.get('testedOnDevice') ?? '').trim();

    if (!projectId || !checkItem) return;

    const now = new Date();
    await db.insert(mobileChecks).values({
      id: crypto.randomUUID(),
      projectId,
      category,
      checkItem,
      description: description || null,
      breakpoint: breakpoint || null,
      status,
      notes: notes || null,
      testedOnDevice: testedOnDevice || null,
      testedByUserId: status !== 'not_tested' ? session.user.id ?? null : null,
      testedAt: status !== 'not_tested' ? now : null,
      createdAt: now,
    });

    redirect(`/internal/projects/${projectId}`);
  }

  async function updateMobileCheckStatus(formData: FormData) {
    'use server';
    const session = await requireRole(['admin', 'pm', 'qa', 'dev']);
    const db = getDb();

    const id = String(formData.get('id') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const status = String(formData.get('status') ?? 'not_tested').trim() as 'not_tested' | 'pass' | 'fail' | 'partial' | 'na';
    const notes = String(formData.get('notes') ?? '').trim();
    const testedOnDevice = String(formData.get('testedOnDevice') ?? '').trim();

    if (!id) return;

    const now = new Date();
    await db.update(mobileChecks).set({
      status,
      notes: notes || null,
      testedOnDevice: testedOnDevice || null,
      testedByUserId: session.user.id ?? null,
      testedAt: now,
    }).where(eq(mobileChecks.id, id));

    redirect(`/internal/projects/${projectId}`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Link href="/internal/projects" className={styles.btnGhost} style={{ padding: '4px 8px' }}>
                {Icons.back} Back
              </Link>
              <span className={styles.badge} style={{ background: 'var(--int-bg-alt)', color: 'var(--int-text-muted)' }}>Project</span>
            </div>
            <h1 className={styles.pageTitle}>{project.name}</h1>
            <p className={styles.pageSubtitle}>Created {formatDateTime(project.createdAt)}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href={`/internal/projects/${project.id}/gantt`} className={styles.btnSecondary}>
              {Icons.calendar} Gantt Chart
            </Link>
          </div>
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className={styles.form}>
            
            {/* Project Details */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Details</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.grid2}>
                  <div>
                    <p className={styles.label}>Status</p>
                    <span className={badgeClass(projectStatusColor(project.status))}>{project.status}</span>
                  </div>
                  <div>
                    <p className={styles.label}>Priority</p>
                    <span className={`${styles.badge} ${
                      project.priority === 'urgent' ? styles.badgeError :
                      project.priority === 'high' ? styles.badgeWarning :
                      project.priority === 'medium' ? styles.badgeInfo :
                      styles.badgeDefault
                    }`}>
                      {project.priority}
                    </span>
                  </div>
                  <div>
                    <p className={styles.label}>Owner</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--int-text-muted)' }}>
                        {Icons.user}
                      </div>
                      <span>{project.ownerUserId ? usersById.get(project.ownerUserId)?.email ?? '' : 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <p className={styles.label}>Due Date</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {project.dueAt && <span style={{ color: 'var(--int-text-muted)' }}>{Icons.calendar}</span>}
                      <span>{project.dueAt ? formatDateTime(project.dueAt) : <span className={styles.textMuted}>No due date</span>}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Visualization */}
            {definitionJson && instance && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Process Flow</h2>
                  <span className={styles.textMuted} style={{ fontSize: '0.85rem' }}>Instance: {instance.id.substring(0, 8)}...</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                    {definitionJson.steps.map((s, i) => {
                      const isCurrent = instance.currentStepKey === s.key;
                      
                      return (
                        <div key={s.key} style={{ 
                          flex: '0 0 160px', 
                          padding: '12px', 
                          borderRadius: 'var(--int-radius)',
                          background: isCurrent ? 'var(--int-primary-light)' : 'var(--int-bg-alt)',
                          border: isCurrent ? '1px solid var(--int-primary)' : '1px solid transparent',
                          opacity: isCurrent ? 1 : 0.7
                        }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginBottom: '4px' }}>Step {i + 1}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isCurrent ? 'var(--int-primary)' : 'var(--int-text)' }}>{s.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '4px' }}>{s.key}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Tasks */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Tasks</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {taskRows.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No tasks generated yet.
                  </div>
                ) : (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Status</th>
                          <th>Assignee</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskRows.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{t.title}</div>
                              <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>{t.key}</div>
                            </td>
                            <td>
                              <span className={badgeClass(taskStatusColor(t.status))}>{t.status}</span>
                            </td>
                            <td>
                              {t.assignedToUserId ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--int-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    {Icons.user}
                                  </div>
                                  <span style={{ fontSize: '0.9rem' }}>{usersById.get(t.assignedToUserId)?.email?.split('@')[0] ?? ''}</span>
                                </div>
                              ) : (
                                <span className={styles.textMuted}>Unassigned</span>
                              )}
                            </td>
                            <td>
                              <form action={updateTask} style={{ display: 'flex', gap: '8px' }}>
                                <input type="hidden" name="taskId" value={t.id} />
                                <select
                                  className={styles.select}
                                  name="status"
                                  defaultValue={t.status}
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                                >
                                  <option value="todo">Todo</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="blocked">Blocked</option>
                                  <option value="done">Done</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                                <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} type="submit">
                                  Update
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Critical Path Analysis */}
            {criticalTasks.length > 0 && (
              <section className={styles.card} style={{ borderLeft: '3px solid var(--int-error)' }}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--int-error)' }}>{Icons.alert}</span>
                    Critical Path ({criticalTasks.length})
                  </h2>
                  <span className={styles.textMuted} style={{ fontSize: '0.8rem' }}>Tasks blocking delivery</span>
                </div>
                <div className={styles.cardBody} style={{ padding: 0 }}>
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Status</th>
                          <th>Due</th>
                          <th>Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {criticalTasks.map((t) => {
                          const isOverdue = t.dueAt && t.dueAt < now;
                          const isBlocked = t.status === 'blocked';
                          const riskLevel = isBlocked ? 'Blocked' : isOverdue ? 'Overdue' : 'Due Soon';
                          const riskColor = isBlocked || isOverdue ? 'var(--int-error)' : 'var(--int-warning)';
                          
                          return (
                            <tr key={t.id} style={{ background: isOverdue || isBlocked ? 'rgba(239, 68, 68, 0.05)' : 'rgba(251, 191, 36, 0.05)' }}>
                              <td>
                                <div style={{ fontWeight: 500 }}>{t.title}</div>
                                <div className={styles.textMuted} style={{ fontSize: '0.8rem' }}>{t.key}</div>
                              </td>
                              <td>
                                <span className={badgeClass(taskStatusColor(t.status))}>{t.status}</span>
                              </td>
                              <td style={{ color: isOverdue ? 'var(--int-error)' : 'var(--int-text-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                                {t.dueAt ? (
                                  <>
                                    {t.dueAt.toLocaleDateString()}
                                    {isOverdue && <span style={{ marginLeft: '4px', fontSize: '0.75rem' }}>(overdue)</span>}
                                  </>
                                ) : (
                                  <span className={styles.textMuted}>No due date</span>
                                )}
                              </td>
                              <td>
                                <span style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: riskColor,
                                  color: 'white'
                                }}>
                                  {riskLevel}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Milestones */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Milestones ({milestonesRows.filter(m => m.completedAt).length}/{milestonesRows.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {milestonesRows.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {milestonesRows.map((m) => (
                      <li key={m.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <form action={toggleMilestone} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="completed" value={String(!!m.completedAt)} />
                          <input type="hidden" name="projectId" value={project.id} />
                          <button type="submit" style={{ 
                            cursor: 'pointer', 
                            background: m.completedAt ? 'var(--int-success)' : 'transparent',
                            border: `2px solid ${m.completedAt ? 'var(--int-success)' : 'var(--int-border)'}`,
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.2s'
                          }}>
                            {m.completedAt && Icons.check}
                          </button>
                        </form>
                        <span style={{ 
                          textDecoration: m.completedAt ? 'line-through' : 'none', 
                          opacity: m.completedAt ? 0.6 : 1,
                          color: m.completedAt ? 'var(--int-text-muted)' : 'var(--int-text)'
                        }}>
                          <strong style={{ fontWeight: 500 }}>{m.title}</strong>
                          {m.dueAt && <span className={styles.textMuted} style={{ fontSize: '0.9rem', marginLeft: '8px' }}>Due: {formatDateTime(m.dueAt)}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.textMuted} style={{ marginBottom: '24px' }}>No milestones defined</p>
                )}
                
                {isPmOrAdmin && (
                  <form action={addMilestone} className={styles.form}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.inputGroup}>
                      <input className={styles.input} name="title" placeholder="New milestone..." required />
                      <FormDatePicker name="dueAt" className={styles.input} style={{ maxWidth: '150px' }} placeholder="Due date" />
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">{Icons.plus}</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Attachments */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Attachments ({attachmentsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {attachmentsList.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {attachmentsList.map(({ attachment, uploaderName }) => (
                      <li key={attachment.id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ color: 'var(--int-primary)' }}>{Icons.file}</div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontWeight: 500, color: 'var(--int-text)', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {attachment.filename}
                          </a>
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                            Added by {uploaderName || 'Unknown'} • {formatDateTime(attachment.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.textMuted} style={{ marginBottom: '24px' }}>No attachments</p>
                )}
                
                <form action={addAttachment} className={styles.form}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className={styles.grid2} style={{ gap: '12px', marginBottom: '12px' }}>
                    <input className={styles.input} name="filename" placeholder="File name / Label" required />
                    <input className={styles.input} name="url" placeholder="URL (Drive, Dropbox...)" required />
                  </div>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%' }}>
                    {Icons.plus} Add Link Attachment
                  </button>
                </form>
              </div>
            </section>

            {/* Notes */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Notes ({notes.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addNote} className={styles.form} style={{ marginBottom: '24px' }}>
                  <input type="hidden" name="projectId" value={project.id} />
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

            {/* QA Signoffs */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.shield} QA Signoffs ({qaSignoffsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addQaSignoff} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Version</label>
                        <input className={styles.input} type="text" name="version" placeholder="e.g., v1.0, Sprint 1, MVP" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Status</label>
                        <select className={styles.select} name="status">
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label}>Notes</label>
                      <textarea className={styles.textarea} name="notes" placeholder="QA notes..." rows={2}></textarea>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add QA Signoff
                      </button>
                    </div>
                  </form>
                )}
                
                {qaSignoffsList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No QA signoffs yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {qaSignoffsList.map(({ signoff, signedByName }) => (
                      <div key={signoff.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 600 }}>{signoff.version || 'No version'}</span>
                          <span className={`${styles.badge} ${
                            signoff.status === 'approved' ? styles.badgeSuccess :
                            signoff.status === 'rejected' ? styles.badgeError :
                            styles.badgeWarning
                          }`}>
                            {signoff.status}
                          </span>
                        </div>
                        {signoff.notes && <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{signoff.notes}</p>}
                        <div style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                          Signed by {signedByName || 'Unknown'} • {formatDateTime(signoff.signedAt || signoff.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Retrospectives */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.refresh} Retrospectives ({retrospectivesList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addRetrospective} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.inputGroup}>
                      <label className={styles.label} style={{ color: 'var(--int-success)' }}>▶ Start Doing</label>
                      <textarea className={styles.textarea} name="startItems" placeholder="Things to start doing..." rows={2}></textarea>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label} style={{ color: 'var(--int-error)' }}>⏹ Stop Doing</label>
                      <textarea className={styles.textarea} name="stopItems" placeholder="Things to stop doing..." rows={2}></textarea>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label} style={{ color: 'var(--int-warning)' }}>↻ Continue Doing</label>
                      <textarea className={styles.textarea} name="continueItems" placeholder="Things to continue doing..." rows={2}></textarea>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label} style={{ color: 'var(--int-primary)' }}>→ Action Items</label>
                      <textarea className={styles.textarea} name="actionItems" placeholder="Next steps..." rows={2}></textarea>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add Retrospective
                      </button>
                    </div>
                  </form>
                )}
                
                {retrospectivesList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No retrospectives yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {retrospectivesList.map(({ retro, conductedByName }) => (
                      <div key={retro.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--int-border)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                            Conducted on {formatDateTime(retro.conductedAt)} by {conductedByName || 'Unknown'}
                          </span>
                        </div>
                        {retro.startItems && (
                          <div style={{ marginBottom: '12px' }}>
                            <span className={styles.label} style={{ color: 'var(--int-success)' }}>▶ Start Doing</span>
                            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{retro.startItems}</p>
                          </div>
                        )}
                        {retro.stopItems && (
                          <div style={{ marginBottom: '12px' }}>
                            <span className={styles.label} style={{ color: 'var(--int-error)' }}>⏹ Stop Doing</span>
                            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{retro.stopItems}</p>
                          </div>
                        )}
                        {retro.continueItems && (
                          <div style={{ marginBottom: '12px' }}>
                            <span className={styles.label} style={{ color: 'var(--int-warning)' }}>↻ Continue Doing</span>
                            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{retro.continueItems}</p>
                          </div>
                        )}
                        {retro.actionItems && (
                          <div>
                            <span className={styles.label} style={{ color: 'var(--int-primary)' }}>→ Action Items</span>
                            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{retro.actionItems}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* NPS Surveys */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.star} NPS Scores ({npsSurveysList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addNpsSurvey} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Score (0-10) *</label>
                        <input className={styles.input} type="number" name="score" min="0" max="10" required placeholder="0-10" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Respondent Email</label>
                        <input className={styles.input} type="email" name="respondentEmail" placeholder="client@example.com" />
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label}>Feedback</label>
                      <textarea className={styles.textarea} name="feedback" placeholder="Additional feedback..." rows={2}></textarea>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add NPS Score
                      </button>
                    </div>
                  </form>
                )}
                
                {npsSurveysList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No NPS surveys yet</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', marginBottom: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--int-primary)' }}>
                        {(npsSurveysList.reduce((sum, n) => sum + n.score, 0) / npsSurveysList.length).toFixed(1)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Average NPS</div>
                        <div className={styles.textMuted}>{npsSurveysList.length} responses</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {npsSurveysList.map((nps) => (
                        <div key={nps.id} style={{ padding: '12px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem',
                            background: nps.score >= 9 ? 'var(--int-success)' : nps.score >= 7 ? 'var(--int-warning)' : 'var(--int-error)',
                            color: 'white'
                          }}>
                            {nps.score}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{nps.respondentEmail || 'Anonymous'}</div>
                            {nps.feedback && <p style={{ fontSize: '0.9rem', margin: '4px 0 0' }}>{nps.feedback}</p>}
                            <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '4px' }}>{formatDateTime(nps.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Feedback */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.message} Feedback ({feedbackList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                <form action={addFeedback} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Type</label>
                      <select className={styles.select} name="type">
                        <option value="enhancement">Enhancement</option>
                        <option value="question">Question</option>
                        <option value="bug">Bug Report</option>
                        <option value="praise">Praise</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Priority</label>
                      <select className={styles.select} name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                    <label className={styles.label}>Content *</label>
                    <textarea className={styles.textarea} name="content" placeholder="Describe the feedback..." rows={3} required></textarea>
                  </div>
                  <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                    <label className={styles.label}>Source</label>
                    <select className={styles.select} name="source">
                      <option value="portal">Portal</option>
                      <option value="email">Email</option>
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                      {Icons.plus} Add Feedback
                    </button>
                  </div>
                </form>
                
                {feedbackList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No feedback yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {feedbackList.map((feedback) => (
                      <div key={feedback.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className={`${styles.badge} ${
                              feedback.type === 'praise' ? styles.badgeSuccess :
                              feedback.type === 'complaint' ? styles.badgeError :
                              feedback.type === 'bug' ? styles.badgeWarning :
                              styles.badgeInfo
                            }`}>
                              {feedback.type}
                            </span>
                            <span className={`${styles.badge} ${
                              feedback.priority === 'high' ? styles.badgeError :
                              feedback.priority === 'medium' ? styles.badgeWarning :
                              styles.badgeDefault
                            }`}>
                              {feedback.priority} priority
                            </span>
                          </div>
                          {isPmOrAdmin && feedback.status !== 'resolved' && (
                            <form action={resolveFeedback}>
                              <input type="hidden" name="feedbackId" value={feedback.id} />
                              <input type="hidden" name="projectId" value={project.id} />
                              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" title="Mark as resolved" style={{ color: 'var(--int-success)' }}>
                                {Icons.check}
                              </button>
                            </form>
                          )}
                          {feedback.status === 'resolved' && (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Resolved</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.95rem', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{feedback.content}</p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>
                          Source: {feedback.source || 'Unknown'} • {formatDateTime(feedback.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Environment Configuration */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.settings} Environment Config ({envConfigsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addEnvConfig} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Key *</label>
                        <input className={styles.input} type="text" name="key" placeholder="API_KEY" required style={{ textTransform: 'uppercase' }} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Environment</label>
                        <select className={styles.select} name="environment">
                          <option value="production">Production</option>
                          <option value="staging">Staging</option>
                          <option value="development">Development</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Description</label>
                        <input className={styles.input} type="text" name="description" placeholder="What this env var is for..." />
                      </div>
                      <div className={styles.inputGroup}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" name="isSecret" defaultChecked />
                          Is Secret (sensitive value)
                        </label>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add Config
                      </button>
                    </div>
                  </form>
                )}
                
                {envConfigsList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No environment configs tracked</p>
                ) : (
                  <div>
                    {(['production', 'staging', 'development'] as const).map((env) => {
                      const envConfigs = envConfigsList.filter(c => c.environment === env);
                      if (envConfigs.length === 0) return null;
                      return (
                        <div key={env} style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: '8px', color: env === 'production' ? 'var(--int-error)' : env === 'staging' ? 'var(--int-warning)' : 'var(--int-success)' }}>
                            {env} ({envConfigs.length})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {envConfigs.map((config) => (
                              <div key={config.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                                <div>
                                  <code style={{ fontWeight: 600, fontSize: '0.9rem' }}>{config.key}</code>
                                  {config.isSecret && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>🔒 Secret</span>}
                                  {config.description && <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '4px 0 0' }}>{config.description}</p>}
                                </div>
                                {isPmOrAdmin && (
                                  <form action={removeEnvConfig}>
                                    <input type="hidden" name="id" value={config.id} />
                                    <input type="hidden" name="projectId" value={project.id} />
                                    <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }}>
                                      {Icons.trash}
                                    </button>
                                  </form>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Meeting Notes */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.list} Meeting Notes ({meetingNotesList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addMeetingNote} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Title *</label>
                        <input className={styles.input} type="text" name="title" placeholder="Sprint Planning" required />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Meeting Type</label>
                        <select className={styles.select} name="meetingType">
                          <option value="standup">Standup</option>
                          <option value="planning">Planning</option>
                          <option value="review">Review</option>
                          <option value="retrospective">Retrospective</option>
                          <option value="client">Client Meeting</option>
                          <option value="technical">Technical Discussion</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Meeting Date</label>
                        <input className={styles.input} type="date" name="meetingDate" />
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label}>Notes</label>
                      <textarea className={styles.textarea} name="notes" placeholder="Key discussion points..." rows={3}></textarea>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                      <label className={styles.label}>Action Items</label>
                      <textarea className={styles.textarea} name="actionItems" placeholder="- Action item 1&#10;- Action item 2" rows={2}></textarea>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add Meeting
                      </button>
                    </div>
                  </form>
                )}
                
                {meetingNotesList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No meeting notes yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {meetingNotesList.map(({ note: meeting, recordedByName }) => (
                      <div key={meeting.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{meeting.title}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span className={`${styles.badge} ${styles.badgeInfo}`} style={{ textTransform: 'capitalize' }}>{meeting.meetingType}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)' }}>{formatDateTime(meeting.meetingDate)}</span>
                            </div>
                          </div>
                          {isPmOrAdmin && (
                            <form action={removeMeetingNote}>
                              <input type="hidden" name="id" value={meeting.id} />
                              <input type="hidden" name="projectId" value={project.id} />
                              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }}>
                                {Icons.trash}
                              </button>
                            </form>
                          )}
                        </div>
                        {meeting.notes && (
                          <div style={{ marginTop: '12px', padding: '12px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                            {meeting.notes}
                          </div>
                        )}
                        {meeting.actionItems && (
                          <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                            <strong>Action Items:</strong>
                            <ul style={{ margin: '4px 0 0 20px', color: 'var(--int-text-secondary)' }}>
                              {meeting.actionItems.map((item, idx) => (
                                <li key={idx}>{item.description}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {recordedByName && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '8px' }}>
                            Recorded by: {recordedByName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Support Tickets */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.ticket} Support Tickets ({supportTicketsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addSupportTicket} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Title *</label>
                        <input className={styles.input} type="text" name="title" placeholder="Issue summary" required />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Category</label>
                        <select className={styles.select} name="category">
                          <option value="bug">Bug</option>
                          <option value="question">Question</option>
                          <option value="feature_request">Feature Request</option>
                          <option value="performance">Performance</option>
                          <option value="security">Security</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Priority</label>
                        <select className={styles.select} name="priority">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Assign To</label>
                        <select className={styles.select} name="assignedToUserId">
                          <option value="">Unassigned</option>
                          {userRows.map((u) => (
                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.textarea} name="description" placeholder="Describe the issue..." rows={3}></textarea>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Create Ticket
                      </button>
                    </div>
                  </form>
                )}
                
                {supportTicketsList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No support tickets</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {supportTicketsList.map(({ ticket, assignedToName }) => (
                      <div key={ticket.id} style={{ padding: '16px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)', borderLeft: `4px solid ${
                        ticket.priority === 'urgent' ? 'var(--int-error)' : 
                        ticket.priority === 'high' ? 'var(--int-warning)' : 
                        'var(--int-border)'
                      }` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <code style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{ticket.ticketNumber}</code>
                              <span style={{ fontWeight: 600 }}>{ticket.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span className={`${styles.badge} ${
                                ticket.category === 'bug' ? styles.badgeError :
                                ticket.category === 'security' ? styles.badgeError :
                                ticket.category === 'performance' ? styles.badgeWarning :
                                ticket.category === 'feature_request' ? styles.badgeInfo :
                                styles.badgeDefault
                              }`}>
                                {ticket.category.replace('_', ' ')}
                              </span>
                              <span className={`${styles.badge} ${
                                ticket.priority === 'urgent' ? styles.badgeError :
                                ticket.priority === 'high' ? styles.badgeWarning :
                                styles.badgeDefault
                              }`}>
                                {ticket.priority}
                              </span>
                            </div>
                          </div>
                          <form action={updateTicketStatus} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="hidden" name="id" value={ticket.id} />
                            <input type="hidden" name="projectId" value={project.id} />
                            <select className={styles.select} name="status" defaultValue={ticket.status} style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}>
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="awaiting_client">Awaiting Client</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} type="submit">
                              Update
                            </button>
                          </form>
                        </div>
                        {ticket.description && (
                          <p style={{ fontSize: '0.9rem', margin: '8px 0', whiteSpace: 'pre-wrap', color: 'var(--int-text-secondary)' }}>{ticket.description}</p>
                        )}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--int-text-muted)', marginTop: '8px' }}>
                          {assignedToName && <span>Assigned: {assignedToName}</span>}
                          <span>Created: {formatDateTime(ticket.createdAt)}</span>
                          {ticket.resolvedAt && <span style={{ color: 'var(--int-success)' }}>Resolved: {formatDateTime(ticket.resolvedAt)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* API Endpoints */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{Icons.api} API Endpoints ({apiEndpointsList.length})</h2>
              </div>
              <div className={styles.cardBody}>
                {isPmOrAdmin && (
                  <form action={addApiEndpoint} className={styles.form} style={{ marginBottom: '24px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Method</label>
                        <select className={styles.select} name="method">
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="PATCH">PATCH</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Path *</label>
                        <input className={styles.input} type="text" name="path" placeholder="/api/users/:id" required />
                      </div>
                      <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Description</label>
                        <input className={styles.input} type="text" name="description" placeholder="Get user by ID" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Role Required</label>
                        <input className={styles.input} type="text" name="roleRequired" placeholder="admin, user" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '24px' }}>
                          <input type="checkbox" name="authRequired" defaultChecked />
                          Auth Required
                        </label>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Request Body Schema</label>
                        <textarea className={styles.textarea} name="requestBodySchema" placeholder='{"name": "string", "email": "string"}' rows={2}></textarea>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Response Schema</label>
                        <textarea className={styles.textarea} name="responseSchema" placeholder='{"id": "string", "name": "string"}' rows={2}></textarea>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit">
                        {Icons.plus} Add Endpoint
                      </button>
                    </div>
                  </form>
                )}
                
                {apiEndpointsList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center', padding: '20px' }}>No API endpoints planned</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {apiEndpointsList.map((endpoint) => {
                      const methodColors: Record<string, string> = {
                        GET: 'var(--int-success)',
                        POST: 'var(--int-primary)',
                        PUT: 'var(--int-warning)',
                        PATCH: 'var(--int-info)',
                        DELETE: 'var(--int-error)',
                      };
                      return (
                        <div key={endpoint.id} style={{ padding: '12px', border: '1px solid var(--int-border)', borderRadius: 'var(--int-radius)', background: endpoint.status === 'deprecated' ? 'var(--int-bg-alt)' : 'transparent', opacity: endpoint.status === 'deprecated' ? 0.6 : 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: methodColors[endpoint.method] || 'var(--int-bg-alt)', color: 'white' }}>
                                  {endpoint.method}
                                </span>
                                <code style={{ fontWeight: 600, fontSize: '0.85rem' }}>{endpoint.path}</code>
                                {endpoint.authRequired && <span style={{ fontSize: '0.65rem', color: 'var(--int-text-muted)' }}>🔒</span>}
                              </div>
                              {endpoint.description && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '4px 0 0' }}>{endpoint.description}</p>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <form action={updateApiEndpointStatus} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <input type="hidden" name="id" value={endpoint.id} />
                                <input type="hidden" name="projectId" value={project.id} />
                                <select className={styles.select} name="status" defaultValue={endpoint.status} style={{ padding: '2px 6px', fontSize: '0.75rem', width: 'auto' }}>
                                  <option value="planned">Planned</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="implemented">Implemented</option>
                                  <option value="deprecated">Deprecated</option>
                                </select>
                                <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit">✓</button>
                              </form>
                              {isPmOrAdmin && (
                                <form action={removeApiEndpoint}>
                                  <input type="hidden" name="id" value={endpoint.id} />
                                  <input type="hidden" name="projectId" value={project.id} />
                                  <button className={`${styles.btn} ${styles.btnSm} ${styles.btnGhost}`} type="submit" style={{ color: 'var(--int-error)' }}>
                                    {Icons.trash}
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.form}>
            
            {/* Project Settings */}
            {isPmOrAdmin && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Settings</h2>
                </div>
                <div className={styles.cardBody}>
                  <form action={updateProject} className={styles.form}>
                    <input type="hidden" name="projectId" value={project.id} />
                    
                    <div>
                      <label className={styles.formLabel}>Status</label>
                      <select className={styles.select} name="status" defaultValue={project.status}>
                        <option value="new">New</option>
                        <option value="active">Active</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_qa">In QA</option>
                        <option value="blocked">Blocked</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.formLabel}>Priority</label>
                      <select className={styles.select} name="priority" defaultValue={project.priority}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <button className={`${styles.btn} ${styles.btnSecondary}`} type="submit" style={{ width: '100%', marginTop: '8px' }}>
                      Update Settings
                    </button>
                  </form>
                </div>
              </section>
            )}

            {/* Time Tracking */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Time Tracking</h2>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '16px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--int-primary)' }}>{Icons.clock}</div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                    <div className={styles.textMuted}>Total time logged</div>
                  </div>
                </div>
                <p className={styles.textMuted} style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                  {projectTime.length} time entries recorded
                </p>
              </div>
            </section>

            {/* Invoices */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Invoices</h2>
                <Link href="/internal/invoices" className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                  {Icons.plus}
                </Link>
              </div>
              <div className={styles.cardBody} style={{ padding: 0 }}>
                {projectInvoices.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--int-text-muted)' }}>
                    No invoices.
                  </div>
                ) : (
                  <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                      <thead><tr><th>#</th><th>Status</th><th>Total</th></tr></thead>
                      <tbody>
                        {projectInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td><Link href={`/internal/invoices/${inv.id}`} style={{ color: 'var(--int-primary)' }}>{inv.invoiceNumber || 'Draft'}</Link></td>
                            <td><span className={`${styles.badge} ${inv.status === 'paid' ? styles.badgeSuccess : styles.badgeWarning}`}>{inv.status}</span></td>
                            <td>${((inv.totalAmount ?? 0) / 100).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Case Study Draft - Show for delivered/closed projects */}
            {(project.status === 'delivered' || project.status === 'closed') && isPmOrAdmin && (
              <section className={styles.card} style={{ borderLeft: '3px solid var(--int-primary)' }}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icons.book} Case Study
                  </h2>
                </div>
                <div className={styles.cardBody}>
                  {caseStudiesList.length === 0 ? (
                    <div>
                      <p className={styles.textMuted} style={{ marginBottom: '16px' }}>
                        This project is complete! Create a case study to showcase your work.
                      </p>
                      <form action={createCaseStudyDraft}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <div style={{ marginBottom: '12px' }}>
                          <input
                            className={styles.input}
                            name="title"
                            placeholder="Case study title..."
                            defaultValue={`${project.name} - Case Study`}
                            required
                          />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <textarea
                            className={styles.textarea}
                            name="summary"
                            placeholder="Brief summary of the project..."
                            rows={3}
                          />
                        </div>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%' }}>
                          {Icons.plus} Create Case Study Draft
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      {caseStudiesList.map((cs) => (
                        <div key={cs.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--int-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>{cs.title}</strong>
                            <span className={`${styles.badge} ${
                              cs.status === 'published' ? styles.badgeSuccess :
                              cs.status === 'review' ? styles.badgeWarning :
                              styles.badgeDefault
                            }`}>
                              {cs.status}
                            </span>
                          </div>
                          {cs.summary && <p className={styles.textMuted} style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{cs.summary}</p>}
                          
                          <form action={updateCaseStudy}>
                            <input type="hidden" name="id" value={cs.id} />
                            <input type="hidden" name="projectId" value={project.id} />
                            
                            <div style={{ marginBottom: '12px' }}>
                              <label className={styles.label}>Challenge (What problem were we solving?)</label>
                              <textarea
                                className={styles.textarea}
                                name="challenge"
                                defaultValue={cs.challenge || ''}
                                placeholder="Describe the challenge..."
                                rows={2}
                              />
                            </div>
                            
                            <div style={{ marginBottom: '12px' }}>
                              <label className={styles.label}>Solution (How did we solve it?)</label>
                              <textarea
                                className={styles.textarea}
                                name="solution"
                                defaultValue={cs.solution || ''}
                                placeholder="Describe the solution..."
                                rows={2}
                              />
                            </div>
                            
                            <div style={{ marginBottom: '12px' }}>
                              <label className={styles.label}>Results (Outcomes, metrics, impact)</label>
                              <textarea
                                className={styles.textarea}
                                name="results"
                                defaultValue={cs.results || ''}
                                placeholder="Describe the results..."
                                rows={2}
                              />
                            </div>
                            
                            <div style={{ marginBottom: '12px' }}>
                              <label className={styles.label}>Client Testimonial</label>
                              <textarea
                                className={styles.textarea}
                                name="testimonial"
                                defaultValue={cs.testimonial || ''}
                                placeholder="Client quote..."
                                rows={2}
                              />
                              <input
                                className={styles.input}
                                name="testimonialAuthor"
                                defaultValue={cs.testimonialAuthor || ''}
                                placeholder="Testimonial author (e.g., John Doe, CEO)"
                                style={{ marginTop: '8px' }}
                              />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select className={styles.select} name="status" defaultValue={cs.status} style={{ flex: 1 }}>
                                <option value="draft">Draft</option>
                                <option value="review">Ready for Review</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </select>
                              <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Accessibility Audit Log */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {Icons.accessibility} Accessibility Audit
                </h2>
                <span className={styles.badge}>{accessibilityList.filter(a => a.status === 'open' || a.status === 'in_progress').length} open</span>
              </div>
              <div className={styles.cardBody}>
                {/* Add new issue form */}
                <details style={{ marginBottom: '16px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--int-primary)', marginBottom: '12px' }}>
                    {Icons.plus} Log WCAG Issue
                  </summary>
                  <form action={addAccessibilityIssue} style={{ padding: '12px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input className={styles.input} name="criterion" placeholder="Criterion (e.g., 1.1.1)" required />
                      <input className={styles.input} name="criterionTitle" placeholder="Criterion title (e.g., Non-text Content)" />
                    </div>
                    <input className={styles.input} name="title" placeholder="Issue title..." required style={{ marginBottom: '8px' }} />
                    <textarea className={styles.textarea} name="description" placeholder="Description of the issue..." rows={2} style={{ marginBottom: '8px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <select className={styles.select} name="wcagLevel" defaultValue="AA">
                        <option value="A">Level A</option>
                        <option value="AA">Level AA</option>
                        <option value="AAA">Level AAA</option>
                      </select>
                      <select className={styles.select} name="severity" defaultValue="moderate">
                        <option value="minor">Minor</option>
                        <option value="moderate">Moderate</option>
                        <option value="serious">Serious</option>
                        <option value="critical">Critical</option>
                      </select>
                      <input className={styles.input} name="location" placeholder="Location (page/component)" />
                    </div>
                    <input className={styles.input} name="affectedUsers" placeholder="Affected users (e.g., screen reader users)" style={{ marginBottom: '8px' }} />
                    <textarea className={styles.textarea} name="recommendation" placeholder="Recommendation to fix..." rows={2} style={{ marginBottom: '8px' }} />
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%' }}>
                      Log Issue
                    </button>
                  </form>
                </details>

                {/* List of issues */}
                {accessibilityList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center' }}>No accessibility issues logged.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {accessibilityList.map((issue) => (
                      <div 
                        key={issue.id} 
                        style={{ 
                          padding: '12px', 
                          background: 'var(--int-bg-alt)', 
                          borderRadius: 'var(--int-radius)',
                          borderLeft: `3px solid ${issue.severity === 'critical' ? '#ef4444' : issue.severity === 'serious' ? '#f97316' : issue.severity === 'moderate' ? '#eab308' : '#6b7280'}`,
                          opacity: issue.status === 'resolved' || issue.status === 'wont_fix' ? 0.6 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.title}</span>
                            <span className={styles.badge} style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                              WCAG {issue.wcagLevel} - {issue.criterion}
                            </span>
                          </div>
                          <span 
                            className={styles.badge}
                            style={{
                              background: issue.status === 'resolved' ? '#10b981' : issue.status === 'in_progress' ? '#3b82f6' : issue.status === 'wont_fix' ? '#6b7280' : '#fbbf24',
                              color: 'white',
                            }}
                          >
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                        {issue.description && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--int-text-secondary)', margin: '4px 0' }}>{issue.description}</p>
                        )}
                        {issue.location && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '2px 0' }}>
                            <strong>Location:</strong> {issue.location}
                          </p>
                        )}
                        {issue.affectedUsers && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '2px 0' }}>
                            <strong>Affects:</strong> {issue.affectedUsers}
                          </p>
                        )}
                        {issue.recommendation && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '2px 0' }}>
                            <strong>Fix:</strong> {issue.recommendation}
                          </p>
                        )}
                        {(issue.status === 'open' || issue.status === 'in_progress') && (
                          <form action={updateAccessibilityStatus} style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <input type="hidden" name="id" value={issue.id} />
                            <input type="hidden" name="projectId" value={project.id} />
                            <select className={styles.select} name="status" defaultValue={issue.status} style={{ flex: 1 }}>
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="wont_fix">Won&apos;t Fix</option>
                            </select>
                            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} type="submit">
                              Update
                            </button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Mobile Responsiveness Checklist */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {Icons.mobile} Mobile Responsiveness
                </h2>
                <span className={styles.badge}>
                  {mobileChecksList.filter(c => c.status === 'pass').length}/{mobileChecksList.length} passed
                </span>
              </div>
              <div className={styles.cardBody}>
                {/* Add new check form */}
                <details style={{ marginBottom: '16px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--int-primary)', marginBottom: '12px' }}>
                    {Icons.plus} Add Check Item
                  </summary>
                  <form action={addMobileCheck} style={{ padding: '12px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input className={styles.input} name="checkItem" placeholder="Check item (e.g., Buttons are at least 44x44px)" required style={{ marginBottom: '8px' }} />
                    <textarea className={styles.textarea} name="description" placeholder="Description..." rows={2} style={{ marginBottom: '8px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <select className={styles.select} name="category" defaultValue="layout">
                        <option value="layout">Layout</option>
                        <option value="navigation">Navigation</option>
                        <option value="touch">Touch Targets</option>
                        <option value="performance">Performance</option>
                        <option value="typography">Typography</option>
                        <option value="forms">Forms</option>
                        <option value="media">Media</option>
                        <option value="other">Other</option>
                      </select>
                      <input className={styles.input} name="breakpoint" placeholder="Breakpoint (e.g., 375px)" />
                      <select className={styles.select} name="status" defaultValue="not_tested">
                        <option value="not_tested">Not Tested</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="partial">Partial</option>
                        <option value="na">N/A</option>
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input className={styles.input} name="testedOnDevice" placeholder="Device tested on (e.g., iPhone 14)" />
                      <input className={styles.input} name="notes" placeholder="Notes..." />
                    </div>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" style={{ width: '100%' }}>
                      Add Check
                    </button>
                  </form>
                </details>

                {/* Quick add common checks */}
                {mobileChecksList.length === 0 && (
                  <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--int-bg-alt)', borderRadius: 'var(--int-radius)' }}>
                    <p className={styles.textMuted} style={{ marginBottom: '8px' }}>Quick add common mobile checks:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {[
                        { item: 'Touch targets ≥ 44x44px', category: 'touch' },
                        { item: 'Viewport meta tag present', category: 'layout' },
                        { item: 'No horizontal scroll', category: 'layout' },
                        { item: 'Text readable without zoom', category: 'typography' },
                        { item: 'Forms usable on mobile', category: 'forms' },
                        { item: 'Images scale correctly', category: 'media' },
                        { item: 'Navigation accessible', category: 'navigation' },
                        { item: 'Page loads fast on 3G', category: 'performance' },
                      ].map((check) => (
                        <form key={check.item} action={addMobileCheck} style={{ display: 'inline' }}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <input type="hidden" name="checkItem" value={check.item} />
                          <input type="hidden" name="category" value={check.category} />
                          <input type="hidden" name="status" value="not_tested" />
                          <button className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} type="submit" style={{ fontSize: '0.75rem' }}>
                            + {check.item}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                )}

                {/* List of checks */}
                {mobileChecksList.length === 0 ? (
                  <p className={styles.textMuted} style={{ textAlign: 'center' }}>No mobile checks added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {mobileChecksList.map((check) => (
                      <div 
                        key={check.id} 
                        style={{ 
                          padding: '12px', 
                          background: 'var(--int-bg-alt)', 
                          borderRadius: 'var(--int-radius)',
                          borderLeft: `3px solid ${check.status === 'pass' ? '#10b981' : check.status === 'fail' ? '#ef4444' : check.status === 'partial' ? '#f97316' : check.status === 'na' ? '#6b7280' : '#d1d5db'}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{check.checkItem}</span>
                            <span className={styles.badge} style={{ marginLeft: '8px', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                              {check.category}
                            </span>
                            {check.breakpoint && (
                              <span className={styles.badge} style={{ marginLeft: '4px', fontSize: '0.7rem' }}>
                                @{check.breakpoint}
                              </span>
                            )}
                          </div>
                          <span 
                            className={styles.badge}
                            style={{
                              background: check.status === 'pass' ? '#10b981' : check.status === 'fail' ? '#ef4444' : check.status === 'partial' ? '#f97316' : check.status === 'na' ? '#6b7280' : '#d1d5db',
                              color: check.status === 'not_tested' ? '#374151' : 'white',
                            }}
                          >
                            {check.status === 'not_tested' ? 'Not Tested' : check.status === 'na' ? 'N/A' : check.status}
                          </span>
                        </div>
                        {check.description && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--int-text-secondary)', margin: '4px 0' }}>{check.description}</p>
                        )}
                        {check.testedOnDevice && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '2px 0' }}>
                            <strong>Device:</strong> {check.testedOnDevice}
                          </p>
                        )}
                        {check.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--int-text-muted)', margin: '2px 0' }}>
                            <strong>Notes:</strong> {check.notes}
                          </p>
                        )}
                        <form action={updateMobileCheckStatus} style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input type="hidden" name="id" value={check.id} />
                          <input type="hidden" name="projectId" value={project.id} />
                          <select className={styles.select} name="status" defaultValue={check.status} style={{ flex: '1 1 100px' }}>
                            <option value="not_tested">Not Tested</option>
                            <option value="pass">Pass ✓</option>
                            <option value="fail">Fail ✗</option>
                            <option value="partial">Partial</option>
                            <option value="na">N/A</option>
                          </select>
                          <input className={styles.input} name="testedOnDevice" placeholder="Device..." defaultValue={check.testedOnDevice || ''} style={{ flex: '1 1 120px' }} />
                          <input className={styles.input} name="notes" placeholder="Notes..." defaultValue={check.notes || ''} style={{ flex: '2 1 150px' }} />
                          <button className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} type="submit">
                            Update
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Event Log */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Activity Log</h2>
              </div>
              <div className={styles.cardBody} style={{ padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
                <table className={styles.table}>
                  <tbody>
                    {eventRows.map((e) => (
                      <tr key={e.id}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{e.type}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>{formatDateTime(e.createdAt)}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--int-text-secondary)' }}>
                            {e.actorUserId ? usersById.get(e.actorUserId)?.email?.split('@')[0] ?? 'System' : 'System'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
