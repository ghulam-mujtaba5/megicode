/**
 * Zod Validation Schemas for Internal Portal
 * 
 * Centralized validation for all API inputs and form submissions.
 * Ensures type safety and consistent error handling across the application.
 */

import { z } from 'zod';

export type SafeValidateResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

// ============================================================================
// Common Schemas
// ============================================================================

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const urlSchema = z.string().url().optional().or(z.literal(''));
export const dateSchema = z.coerce.date();
export const optionalString = z.string().optional().or(z.literal(''));

const nullableDateFromFormSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return new Date(String(value));
  },
  z.date().nullable()
);

const nullableUuidFromFormSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return value;
  },
  uuidSchema.nullable()
);

// ============================================================================
// User & Auth Schemas
// ============================================================================

export const userRoleSchema = z.enum(['admin', 'pm', 'dev', 'qa', 'viewer']);

export const userSchema = z.object({
  id: uuidSchema.optional(),
  email: emailSchema,
  name: z.string().min(1, 'Name is required'),
  role: userRoleSchema.default('viewer'),
  avatarUrl: urlSchema,
});

// ============================================================================
// Lead Schemas
// ============================================================================

export const leadStatusSchema = z.enum([
  'new',
  'in_review',
  'approved',
  'rejected',
  'converted',
]);

export const leadComplexitySchema = z.enum(['simple', 'moderate', 'complex', 'very_complex']);

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: emailSchema.optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  service: z.string().max(255).optional(),
  message: z.string().optional(),
  source: z.string().max(100).optional(),
  assignedToUserId: uuidSchema.optional().nullable(),
});

export const updateLeadStatusSchema = z.object({
  leadId: uuidSchema,
  status: leadStatusSchema,
});

export const updateLeadRequirementsSchema = z.object({
  leadId: uuidSchema,
  srsUrl: urlSchema,
  functionalRequirements: z.string().optional(),
  nonFunctionalRequirements: z.string().optional(),
  targetPlatforms: z.string().optional(),
  techPreferences: z.string().optional(),
  integrationNeeds: z.string().optional(),
  estimatedHours: z.coerce.number().int().min(0).optional().nullable(),
  estimatedBudget: z.coerce.number().int().min(0).optional().nullable(),
  complexity: leadComplexitySchema.optional().nullable(),
  competitorNotes: z.string().optional(),
  existingSystemNotes: z.string().optional(),
});

// ============================================================================
// Feasibility Check Schemas
// ============================================================================

export const technicalFeasibilitySchema = z.enum(['feasible', 'challenging', 'not_feasible', 'needs_research']);
export const resourceAvailabilitySchema = z.enum(['available', 'limited', 'not_available']);
export const riskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const feasibilityCheckSchema = z.object({
  leadId: uuidSchema,
  technicalFeasibility: technicalFeasibilitySchema.optional().nullable(),
  resourceAvailability: resourceAvailabilitySchema.optional().nullable(),
  timelineRealistic: z.boolean().default(false),
  budgetAdequate: z.boolean().default(false),
  riskLevel: riskLevelSchema.optional().nullable(),
  notes: z.string().optional(),
});

// ============================================================================
// Estimation Schemas
// ============================================================================

export const estimationComplexitySchema = z.enum(['simple', 'moderate', 'complex', 'very_complex']);
export const confidenceLevelSchema = z.enum(['low', 'medium', 'high']);

export const createEstimationSchema = z.object({
  leadId: uuidSchema,
  title: z.string().min(1).max(255).default('Project Estimation'),
  totalHours: z.coerce.number().int().min(0).optional().nullable(),
  hourlyRate: z.coerce.number().int().min(0).optional().nullable(), // In cents
  complexity: estimationComplexitySchema.optional().nullable(),
  confidence: confidenceLevelSchema.optional().nullable(),
  assumptions: z.string().optional(),
});

// ============================================================================
// Risk Assessment Schemas
// ============================================================================

export const riskCategorySchema = z.enum(['technical', 'resource', 'timeline', 'budget', 'scope', 'external']);
export const riskProbabilitySchema = z.enum(['low', 'medium', 'high']);
export const riskImpactSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const createRiskAssessmentSchema = z.object({
  leadId: uuidSchema.optional().nullable(),
  projectId: uuidSchema.optional().nullable(),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: riskCategorySchema,
  probability: riskProbabilitySchema,
  impact: riskImpactSchema,
  mitigationPlan: z.string().optional(),
});

// ============================================================================
// Stakeholder Schemas
// ============================================================================

export const influenceInterestSchema = z.enum(['low', 'medium', 'high']);

export const createStakeholderSchema = z.object({
  leadId: uuidSchema,
  name: z.string().min(1, 'Name is required').max(255),
  role: z.string().max(255).optional(),
  email: emailSchema.optional().or(z.literal('')),
  influence: influenceInterestSchema.optional().nullable(),
  interest: influenceInterestSchema.optional().nullable(),
});

// ============================================================================
// Project Schemas
// ============================================================================

export const projectStatusSchema = z.enum([
  'new',
  'in_progress',
  'blocked',
  'in_qa',
  'delivered',
  'closed',
  'rejected',
]);

export const projectPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const healthStatusSchema = z.enum(['green', 'amber', 'red']);

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  clientId: uuidSchema.optional().nullable(),
  description: z.string().optional(),
  ownerUserId: uuidSchema.optional().nullable(),
  status: projectStatusSchema.default('new'),
  priority: projectPrioritySchema.default('medium'),
  dueAt: dateSchema.optional().nullable(),
});

export const updateProjectSchema = z.object({
  projectId: uuidSchema,
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
  wikiUrl: urlSchema,
  repoUrl: urlSchema,
  stagingUrl: urlSchema,
  productionUrl: urlSchema,
  architectureDiagramUrl: urlSchema,
  dbSchemaUrl: urlSchema,
  techStack: z.string().optional(), // JSON string
  healthStatus: healthStatusSchema.optional().nullable(),
});

// ============================================================================
// Task Schemas
// ============================================================================

export const taskStatusSchema = z.enum([
  'todo',
  'in_progress',
  'blocked',
  'done',
  'canceled',
]);

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const createTaskSchema = z.object({
  instanceId: uuidSchema,
  key: z.string().min(1).max(100),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: taskStatusSchema.default('todo'),
  priority: taskPrioritySchema.default('medium'),
  assignedToUserId: uuidSchema.optional().nullable(),
  dueAt: dateSchema.optional().nullable(),
});

export const updateTaskSchema = z.object({
  taskId: uuidSchema,
  status: taskStatusSchema.optional(),
  assignedToUserId: uuidSchema.optional().nullable(),
});

export const updateTaskDetailSchema = z.object({
  id: uuidSchema,
  status: taskStatusSchema,
  assignedToUserId: nullableUuidFromFormSchema,
  dueAt: nullableDateFromFormSchema,
  description: z.string().optional().nullable(),
  sprintNumber: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v.trim() === '') return null;
      const n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    }),
});

export const createTaskCommentSchema = z.object({
  taskId: uuidSchema,
  content: z.string().min(1, 'Comment is required').max(5000),
});

export const createTaskChecklistItemSchema = z.object({
  taskId: uuidSchema,
  label: z.string().min(1, 'Checklist item is required').max(255),
});

export const toggleTaskChecklistSchema = z.object({
  id: uuidSchema,
  checked: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

export const createTaskTimeEntryFromTaskSchema = z.object({
  taskId: uuidSchema,
  minutes: z.coerce.number().int().min(1, 'Minutes must be at least 1'),
  description: z.preprocess(
    (v) => {
      const value = String(v ?? '').trim();
      return value.length ? value : null;
    },
    z.string().max(5000).nullable()
  ),
  date: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return null;
      return new Date(String(value));
    },
    z.date().nullable()
  ),
});

export const createTaskAttachmentFromTaskSchema = z.object({
  taskId: uuidSchema,
  filename: z.string().min(1, 'Filename is required').max(255),
  url: z.string().url('Valid URL is required'),
});

// ============================================================================
// Sub-Task Schemas
// ============================================================================

export const createSubTaskSchema = z.object({
  parentTaskId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  assignedToUserId: uuidSchema.optional().nullable(),
});

// ============================================================================
// QA Signoff Schemas
// ============================================================================

export const qaSignoffStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const createQaSignoffSchema = z.object({
  projectId: uuidSchema,
  milestoneId: uuidSchema.optional().nullable(),
  version: z.string().max(50).optional(),
  status: qaSignoffStatusSchema.default('pending'),
  notes: z.string().optional(),
});

export const createQaSignoffFormSchema = createQaSignoffSchema.extend({
  milestoneId: nullableUuidFromFormSchema.optional(),
  version: optionalString,
  notes: optionalString,
});

// ============================================================================
// Retrospective Schemas
// ============================================================================

export const createRetrospectiveSchema = z.object({
  projectId: uuidSchema,
  startItems: z.string().optional(), // JSON array
  stopItems: z.string().optional(), // JSON array
  continueItems: z.string().optional(), // JSON array
  actionItems: z.string().optional(), // JSON array
});

export const createRetrospectiveFormSchema = createRetrospectiveSchema.extend({
  startItems: optionalString,
  stopItems: optionalString,
  continueItems: optionalString,
  actionItems: optionalString,
});

// ============================================================================
// NPS Survey Schemas
// ============================================================================

export const createNpsSurveySchema = z.object({
  projectId: uuidSchema,
  clientId: uuidSchema.optional().nullable(),
  score: z.coerce.number().int().min(0).max(10, 'Score must be between 0 and 10'),
  feedback: z.string().optional(),
  respondentEmail: emailSchema.optional().or(z.literal('')),
});

export const createNpsSurveyFormSchema = createNpsSurveySchema.extend({
  clientId: nullableUuidFromFormSchema.optional(),
  feedback: optionalString,
});

// ============================================================================
// Feedback Item Schemas
// ============================================================================

export const feedbackTypeSchema = z.enum(['bug', 'enhancement', 'question', 'praise', 'complaint']);
export const feedbackStatusSchema = z.enum(['new', 'acknowledged', 'in_progress', 'resolved', 'wont_fix']);
export const feedbackPrioritySchema = z.enum(['low', 'medium', 'high']);

export const createFeedbackSchema = z.object({
  projectId: uuidSchema,
  clientId: uuidSchema.optional().nullable(),
  type: feedbackTypeSchema,
  content: z.string().min(1, 'Content is required'),
  priority: feedbackPrioritySchema.default('medium'),
  source: z.string().max(50).optional(),
});

export const createProjectFeedbackFormSchema = z.object({
  projectId: uuidSchema,
  type: feedbackTypeSchema.optional().transform((v) => v ?? 'enhancement'),
  content: z.string().min(1, 'Content is required'),
  priority: feedbackPrioritySchema.optional().transform((v) => v ?? 'medium'),
  source: optionalString,
});

export const updateFeedbackStatusSchema = z.object({
  feedbackId: uuidSchema,
  status: feedbackStatusSchema,
});

export const resolveFeedbackFormSchema = updateFeedbackStatusSchema.extend({
  projectId: uuidSchema,
});

// ============================================================================
// Change Request Schemas
// ============================================================================

export const changeRequestStatusSchema = z.enum(['pending', 'approved', 'rejected', 'implemented']);
export const changeRequestImpactSchema = z.enum(['low', 'medium', 'high']);

export const createChangeRequestSchema = z.object({
  projectId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  requestedByUserId: uuidSchema.optional().nullable(),
  impact: changeRequestImpactSchema.default('medium'),
  estimatedHours: z.coerce.number().int().min(0).optional().nullable(),
});

// ============================================================================
// Decision Record (ADR) Schemas
// ============================================================================

export const decisionStatusSchema = z.enum(['proposed', 'accepted', 'deprecated', 'superseded']);

export const createDecisionRecordSchema = z.object({
  projectId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  context: z.string().min(1, 'Context is required'),
  decision: z.string().min(1, 'Decision is required'),
  consequences: z.string().optional(),
  status: decisionStatusSchema.default('proposed'),
});

// ============================================================================
// Milestone Schemas
// ============================================================================

export const createMilestoneSchema = z.object({
  projectId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  dueAt: nullableDateFromFormSchema,
});

export const toggleMilestoneFormSchema = z.object({
  id: uuidSchema,
  completed: z.enum(['true', 'false']).transform((v) => v === 'true'),
  projectId: uuidSchema,
});

// ============================================================================
// Attachment Schemas
// ============================================================================

export const entityTypeSchema = z.enum(['lead', 'project', 'task', 'bug']);

export const createAttachmentSchema = z.object({
  entityType: entityTypeSchema,
  entityId: uuidSchema,
  filename: z.string().min(1, 'Filename is required').max(255),
  url: z.string().url('Valid URL is required'),
});

// ============================================================================
// Note Schemas
// ============================================================================

export const createLeadNoteSchema = z.object({
  leadId: uuidSchema,
  content: z.string().min(1, 'Note content is required'),
});

export const createProjectNoteSchema = z.object({
  projectId: uuidSchema,
  content: z.string().min(1, 'Note content is required'),
});

export const updateProjectFormSchema = z.object({
  projectId: uuidSchema,
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
});

export const updateTaskAssignmentFormSchema = z.object({
  taskId: uuidSchema,
  status: taskStatusSchema,
  assignedToUserId: nullableUuidFromFormSchema,
});

export const createProjectAttachmentFormSchema = z.object({
  projectId: uuidSchema,
  filename: z.string().min(1, 'Filename is required').max(255),
  url: z.string().url('Valid URL is required'),
});

export const createProjectNoteFormSchema = createProjectNoteSchema;

// ============================================================================
// Time Entry Schemas
// ============================================================================

export const createTimeEntrySchema = z.object({
  projectId: uuidSchema,
  taskId: uuidSchema.optional().nullable(),
  userId: uuidSchema,
  minutes: z.coerce.number().int().min(1, 'Minutes must be at least 1'),
  description: z.string().optional(),
  loggedAt: dateSchema.optional(),
});

// ============================================================================
// Bug Schemas
// ============================================================================

export const bugSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const bugStatusSchema = z.enum(['open', 'in_progress', 'fixed', 'verified', 'closed', 'wont_fix']);

export const createBugSchema = z.object({
  projectId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  stepsToReproduce: z.string().optional(),
  severity: bugSeveritySchema.default('medium'),
  assignedToUserId: uuidSchema.optional().nullable(),
});

// ============================================================================
// Proposal Schemas
// ============================================================================

export const proposalStatusSchema = z.enum(['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired']);
export const proposalStatusDbSchema = z.enum([
  'draft',
  'pending_approval',
  'approved',
  'sent',
  'revised',
  'accepted',
  'declined',
]);

export const createProposalSchema = z.object({
  leadId: uuidSchema.optional().nullable(),
  projectId: uuidSchema.optional().nullable(),
  title: z.string().min(1, 'Title is required').max(255),
  scopeHtml: z.string().optional(),
  totalAmount: z.coerce.number().int().min(0).optional().nullable(), // In cents
  validUntil: dateSchema.optional().nullable(),
});

export const proposalAddItemSchema = z.object({
  proposalId: uuidSchema,
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.coerce.number().int().min(1).default(1),
  unitPrice: z.preprocess(
    (value) => {
      const num = Number(value);
      return Number.isFinite(num) ? Math.round(num * 100) : undefined;
    },
    z.number().int().min(0)
  ),
});

export const proposalDeleteItemSchema = z.object({
  itemId: uuidSchema,
  proposalId: uuidSchema,
});

export const proposalUpdateStatusSchema = z.object({
  id: uuidSchema,
  status: proposalStatusDbSchema,
});

export const proposalConvertSchema = z.object({
  proposalId: uuidSchema,
  projectName: z.string().min(1, 'Project name is required').max(255),
});

// ============================================================================
// Invoice Schemas
// ============================================================================

export const invoiceStatusSchema = z.enum(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']);

export const createInvoiceSchema = z.object({
  projectId: uuidSchema,
  proposalId: uuidSchema.optional().nullable(),
  invoiceNumber: z.string().max(50).optional(),
  totalAmount: z.coerce.number().int().min(0), // In cents
  dueAt: dateSchema.optional().nullable(),
});

// ============================================================================
// Environment Config Schemas (NEW)
// ============================================================================

export const createEnvConfigSchema = z.object({
  projectId: uuidSchema,
  key: z.string().min(1, 'Key is required').max(100),
  description: z.string().optional(),
  isSecret: z.boolean().default(true),
  environment: z.enum(['development', 'staging', 'production']).default('production'),
});

// ============================================================================
// Client Schemas
// ============================================================================

export const clientStatusSchema = z.enum(['active', 'inactive', 'churned']);

export const createClientContactFormSchema = z.object({
  clientId: uuidSchema,
  name: z.string().min(1, 'Name is required').max(255),
  email: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    emailSchema.nullable()
  ),
  phone: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().max(50).nullable()
  ),
  role: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().max(100).nullable()
  ),
  isPrimary: z.preprocess((v) => v === 'on' || v === true, z.boolean().default(false)),
});

export const updateClientFormSchema = z.object({
  id: uuidSchema,
  status: clientStatusSchema,
  notes: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().nullable()
  ),
});

// ============================================================================
// Invoice Item & Payment Schemas
// ============================================================================

export const invoiceAddItemFormSchema = z.object({
  invoiceId: uuidSchema,
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.coerce.number().int().min(1).default(1),
  unitPrice: z.preprocess(
    (value) => {
      const num = Number(value);
      return Number.isFinite(num) ? Math.round(num * 100) : 0;
    },
    z.number().int().min(0)
  ),
});

export const paymentMethodSchema = z.preprocess(
  (v) => {
    const val = String(v ?? '').trim();
    return val.length ? val : null;
  },
  z.string().max(50).nullable()
);

export const recordPaymentFormSchema = z.object({
  invoiceId: uuidSchema,
  amount: z.preprocess(
    (value) => {
      const num = Number(value);
      return Number.isFinite(num) ? Math.round(num * 100) : 0;
    },
    z.number().int().min(1, 'Amount must be greater than 0')
  ),
  method: paymentMethodSchema,
  referenceNumber: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().max(100).nullable()
  ),
  paidAt: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return new Date();
      return new Date(String(value));
    },
    z.date()
  ),
});

export const invoiceUpdateStatusFormSchema = z.object({
  id: uuidSchema,
  status: invoiceStatusSchema,
});

export const invoiceSendFormSchema = z.object({
  id: uuidSchema,
});

// ============================================================================
// Lead Form Schemas (for server actions)
// ============================================================================

export const leadAddNoteFormSchema = z.object({
  leadId: uuidSchema,
  content: z.string().min(1, 'Note content is required'),
});

export const leadAddTagFormSchema = z.object({
  leadId: uuidSchema,
  tag: z.string().min(1, 'Tag is required').max(50).transform((v) => v.toLowerCase()),
});

export const leadRemoveTagFormSchema = z.object({
  id: uuidSchema,
  leadId: uuidSchema,
});

export const leadRemoveStakeholderFormSchema = z.object({
  id: uuidSchema,
  leadId: uuidSchema,
});

export const leadConvertToProjectFormSchema = z.object({
  leadId: uuidSchema,
  projectName: optionalString,
  ownerUserId: nullableUuidFromFormSchema,
  priority: z.string().min(1).default('medium'),
  dueAt: nullableDateFromFormSchema,
});

export const feasibilityCheckFormSchema = z.object({
  leadId: uuidSchema,
  technicalFeasibility: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    technicalFeasibilitySchema.nullable()
  ),
  resourceAvailability: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    resourceAvailabilitySchema.nullable()
  ),
  timelineRealistic: z.preprocess((v) => v === 'on' || v === true, z.boolean().default(false)),
  budgetAdequate: z.preprocess((v) => v === 'on' || v === true, z.boolean().default(false)),
  riskLevel: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    riskLevelSchema.nullable()
  ),
  notes: optionalString,
});

export const estimationFormSchema = z.object({
  leadId: uuidSchema,
  title: z.string().min(1).max(255).default('Project Estimation'),
  totalHours: z.coerce.number().int().min(0).nullable().catch(null),
  hourlyRate: z.preprocess(
    (value) => {
      const num = Number(value);
      return Number.isFinite(num) && num > 0 ? Math.round(num * 100) : null;
    },
    z.number().int().nullable()
  ),
  complexity: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    estimationComplexitySchema.nullable()
  ),
  confidence: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    confidenceLevelSchema.nullable()
  ),
  assumptions: optionalString,
});

export const stakeholderFormSchema = z.object({
  leadId: uuidSchema,
  name: z.string().min(1, 'Name is required').max(255),
  role: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().max(255).nullable()
  ),
  email: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().max(255).nullable()
  ),
  influence: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    influenceInterestSchema.nullable()
  ),
  interest: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    influenceInterestSchema.nullable()
  ),
});

export const riskAssessmentFormSchema = z.object({
  leadId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  description: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().nullable()
  ),
  category: riskCategorySchema,
  probability: riskProbabilitySchema,
  impact: riskImpactSchema,
  mitigationPlan: z.preprocess(
    (v) => {
      const val = String(v ?? '').trim();
      return val.length ? val : null;
    },
    z.string().nullable()
  ),
});

export const removeByIdFormSchema = z.object({
  id: uuidSchema,
  leadId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
});

// ============================================================================
// Meeting Notes Schemas (NEW)
// ============================================================================

export const createMeetingNoteSchema = z.object({
  projectId: uuidSchema,
  title: z.string().min(1, 'Title is required').max(255),
  attendees: z.string().optional(), // JSON array of user IDs
  notes: z.string().min(1, 'Notes are required'),
  actionItems: z.string().optional(), // JSON array
  meetingDate: dateSchema.optional(),
});

// ============================================================================
// Helper function to validate and parse form data
// ============================================================================

export function validateFormData<T extends z.ZodSchema>(
  schema: T,
  formData: FormData
): z.infer<T> {
  const data: Record<string, unknown> = {};
  
  formData.forEach((value, key) => {
    // Handle checkbox values
    if (value === 'on') {
      data[key] = true;
    } else if (value === '') {
      data[key] = undefined;
    } else {
      data[key] = value;
    }
  });

  return schema.parse(data);
}

export function safeValidateFormData<T extends z.ZodSchema>(
  schema: T,
  formData: FormData
): SafeValidateResult<z.infer<T>> {
  try {
    return { success: true, data: validateFormData(schema, formData) };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error };
    throw error;
  }
}

// ============================================================================
// Type exports for use in components
// ============================================================================

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type FeasibilityCheckInput = z.infer<typeof feasibilityCheckSchema>;
export type CreateEstimationInput = z.infer<typeof createEstimationSchema>;
export type CreateStakeholderInput = z.infer<typeof createStakeholderSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateQaSignoffInput = z.infer<typeof createQaSignoffSchema>;
export type CreateRetrospectiveInput = z.infer<typeof createRetrospectiveSchema>;
export type CreateNpsSurveyInput = z.infer<typeof createNpsSurveySchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type CreateChangeRequestInput = z.infer<typeof createChangeRequestSchema>;
export type CreateDecisionRecordInput = z.infer<typeof createDecisionRecordSchema>;
export type CreateRiskAssessmentInput = z.infer<typeof createRiskAssessmentSchema>;
export type CreateMeetingNoteInput = z.infer<typeof createMeetingNoteSchema>;
export type CreateEnvConfigInput = z.infer<typeof createEnvConfigSchema>;
