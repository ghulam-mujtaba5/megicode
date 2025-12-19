// @ts-nocheck
// TODO: Fix type mismatches between page expectations and schema definitions
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
  attachments,
  qaSignoffs,
  retrospectives,
  npsSurveys,
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
  createProjectNoteFormSchema,
  toggleMilestoneFormSchema,
  updateProjectFormSchema,
  updateTaskAssignmentFormSchema,
  createMilestoneSchema,
  createQaSignoffFormSchema,
  createRetrospectiveFormSchema,
  createNpsSurveyFormSchema,
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

  // Server action for adding attachments
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

            {/* Right Column - Sidebar */}
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
