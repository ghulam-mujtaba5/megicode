import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import type {
  TechStack,
  RequirementsList,
  ProcessDefinitionJson,
  AuditPayload,
  IntegrationConfig,
  RetroItems,
  ChecklistItems,
  EstimationBreakdown,
  MeetingAttendees,
  MeetingActionItems,
  MeetingDecisions,
  TemplateTask,
  TemplateMilestone,
  TemplateChecklist,
} from '../types/json-types';

export type UserRole = 'admin' | 'pm' | 'dev' | 'qa' | 'viewer';
export type LeadStatus = 'new' | 'in_review' | 'approved' | 'rejected' | 'converted';
export type ProjectStatus =
  | 'new'
  | 'in_progress'
  | 'blocked'
  | 'in_qa'
  | 'delivered'
  | 'closed'
  | 'rejected';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'canceled';
export type InstanceStatus = 'running' | 'completed' | 'canceled';

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name'),
    image: text('image'),
    role: text('role', { enum: ['admin', 'pm', 'dev', 'qa', 'viewer'] })
      .notNull()
      .default('viewer'),
    status: text('status', { enum: ['active', 'pending', 'disabled'] })
      .notNull()
      .default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex('users_email_unique').on(table.email),
  })
);

export const leads = sqliteTable(
  'leads',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email'),
    company: text('company'),
    phone: text('phone'),
    service: text('service'),
    message: text('message'),
    source: text('source').notNull().default('internal_manual'),
    status: text('status', {
      enum: ['new', 'in_review', 'approved', 'rejected', 'converted'],
    })
      .notNull()
      .default('new'),
    // Requirements Wizard fields
    srsUrl: text('srs_url'), // SRS document URL
    functionalRequirements: text('functional_requirements').$type<RequirementsList>(), // JSON array
    nonFunctionalRequirements: text('non_functional_requirements').$type<RequirementsList>(), // JSON array
    targetPlatforms: text('target_platforms'), // web, mobile, desktop
    techPreferences: text('tech_preferences'),
    integrationNeeds: text('integration_needs'),
    // Estimation fields
    estimatedHours: integer('estimated_hours'),
    estimatedBudget: integer('estimated_budget'), // cents
    complexity: text('complexity', { enum: ['simple', 'moderate', 'complex', 'very_complex'] }),
    // Competitor/Context fields
    competitorNotes: text('competitor_notes'),
    existingSystemNotes: text('existing_system_notes'),
    // NDA Management
    ndaStatus: text('nda_status', { enum: ['not_required', 'pending', 'sent', 'signed', 'expired'] }),
    ndaUrl: text('nda_url'), // Link to signed NDA document
    ndaSentAt: integer('nda_sent_at', { mode: 'timestamp_ms' }),
    ndaSignedAt: integer('nda_signed_at', { mode: 'timestamp_ms' }),
    ndaExpiresAt: integer('nda_expires_at', { mode: 'timestamp_ms' }),
    // Soft delete
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    statusIdx: index('leads_status_idx').on(table.status),
    createdIdx: index('leads_created_idx').on(table.createdAt),
  })
);

export const projects = sqliteTable(
  'projects',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    clientId: text('client_id').references(() => clients.id),
    name: text('name').notNull(),
    description: text('description'),
    ownerUserId: text('owner_user_id').references(() => users.id),
    status: text('status', {
      enum: ['new', 'in_progress', 'blocked', 'in_qa', 'delivered', 'closed', 'rejected'],
    })
      .notNull()
      .default('new'),
    priority: text('priority').notNull().default('medium'),
    // Project Wiki/Documentation
    wikiUrl: text('wiki_url'),
    repoUrl: text('repo_url'),
    stagingUrl: text('staging_url'),
    productionUrl: text('production_url'),
    // Architecture & Tech
    techStack: text('tech_stack').$type<TechStack>(), // JSON array
    architectureDiagramUrl: text('architecture_diagram_url'),
    dbSchemaUrl: text('db_schema_url'),
    // Project Health
    healthStatus: text('health_status', { enum: ['green', 'amber', 'red'] }),
    // Contract/Maintenance Renewal
    contractRenewalAt: integer('contract_renewal_at', { mode: 'timestamp_ms' }),
    maintenanceContractActive: integer('maintenance_contract_active', { mode: 'boolean' }),
    // Dates
    startAt: integer('start_at', { mode: 'timestamp_ms' }),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    deliveredAt: integer('delivered_at', { mode: 'timestamp_ms' }),
    // Soft delete
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    ownerIdx: index('projects_owner_idx').on(table.ownerUserId),
    statusIdx: index('projects_status_idx').on(table.status),
    clientIdx: index('projects_client_idx').on(table.clientId),
  })
);

export const processDefinitions = sqliteTable(
  'process_definitions',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    version: integer('version').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    json: text('json').notNull().$type<ProcessDefinitionJson>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    keyVersionUnique: uniqueIndex('process_def_key_version_unique').on(table.key, table.version),
    keyIdx: index('process_def_key_idx').on(table.key),
    activeIdx: index('process_def_active_idx').on(table.isActive),
  })
);

export const processInstances = sqliteTable(
  'process_instances',
  {
    id: text('id').primaryKey(),
    processDefinitionId: text('process_definition_id')
      .notNull()
      .references(() => processDefinitions.id),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    status: text('status', { enum: ['running', 'completed', 'canceled'] })
      .notNull()
      .default('running'),
    currentStepKey: text('current_step_key'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
    endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
  },
  (table) => ({
    projectIdx: index('process_instances_project_idx').on(table.projectId),
    defIdx: index('process_instances_def_idx').on(table.processDefinitionId),
    statusIdx: index('process_instances_status_idx').on(table.status),
  })
);

export const tasks = sqliteTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    instanceId: text('instance_id')
      .notNull()
      .references(() => processInstances.id),
    key: text('key').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    priority: text('priority').notNull().default('medium'),
    status: text('status', { enum: ['todo', 'in_progress', 'blocked', 'done', 'canceled'] })
      .notNull()
      .default('todo'),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    // alias for older code expecting `assigneeId`
    assigneeId: text('assigned_to_user_id'),
    // optional projectId if tasks are directly linked to projects in some flows
    projectId: text('project_id').references(() => projects.id),
    // Sprint planning
    sprintNumber: integer('sprint_number'),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    instanceIdx: index('tasks_instance_idx').on(table.instanceId),
    assignedIdx: index('tasks_assigned_idx').on(table.assignedToUserId),
    statusIdx: index('tasks_status_idx').on(table.status),
    sprintIdx: index('tasks_sprint_idx').on(table.sprintNumber),
  })
);

export type Task = typeof tasks.$inferSelect;

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    instanceId: text('instance_id').references(() => processInstances.id),
    type: text('type').notNull(),
    actorUserId: text('actor_user_id').references(() => users.id),
    payloadJson: text('payload_json').$type<AuditPayload>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('events_lead_idx').on(table.leadId),
    projectIdx: index('events_project_idx').on(table.projectId),
    instanceIdx: index('events_instance_idx').on(table.instanceId),
    createdIdx: index('events_created_idx').on(table.createdAt),
  })
);

export const auditEvents = sqliteTable('audit_events', {
  id: text('id').primaryKey(),
  actorUserId: text('actor_user_id').references(() => users.id),
  action: text('action').notNull(),
  target: text('target'),
  payloadJson: text('payload_json').$type<AuditPayload>(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// ==================== EXTENDED SCHEMA ====================

// Clients & Contacts
export type ClientStatus = 'active' | 'inactive' | 'churned';

export const clients = sqliteTable(
  'clients',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    company: text('company'),
    website: text('website'),
    industry: text('industry'),
    timezone: text('timezone'),
    billingEmail: text('billing_email'),
    billingAddress: text('billing_address'),
    notes: text('notes'),
    status: text('status', { enum: ['active', 'inactive', 'churned'] }).notNull().default('active'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    statusIdx: index('clients_status_idx').on(table.status),
  })
);

export const clientContacts = sqliteTable(
  'client_contacts',
  {
    id: text('id').primaryKey(),
    clientId: text('client_id')
      .notNull()
      .references(() => clients.id),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    role: text('role'), // CEO, PO, Finance, etc.
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
    preferredChannel: text('preferred_channel'), // email, phone, slack
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    clientIdx: index('client_contacts_client_idx').on(table.clientId),
  })
);

// Notes & Comments
export const leadNotes = sqliteTable(
  'lead_notes',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id')
      .notNull()
      .references(() => leads.id),
    authorUserId: text('author_user_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('lead_notes_lead_idx').on(table.leadId),
  })
);

export const taskComments = sqliteTable(
  'task_comments',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id),
    authorUserId: text('author_user_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    taskIdx: index('task_comments_task_idx').on(table.taskId),
  })
);

export const projectNotes = sqliteTable(
  'project_notes',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    authorUserId: text('author_user_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('project_notes_project_idx').on(table.projectId),
  })
);

// Attachments (generic)
export const attachments = sqliteTable(
  'attachments',
  {
    id: text('id').primaryKey(),
    entityType: text('entity_type').notNull(), // lead, project, task, proposal
    entityId: text('entity_id').notNull(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    mimeType: text('mime_type'),
    sizeBytes: integer('size_bytes'),
    uploadedByUserId: text('uploaded_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    entityIdx: index('attachments_entity_idx').on(table.entityType, table.entityId),
  })
);

// Proposals & SOW
export type ProposalStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'revised' | 'accepted' | 'declined';

export const proposals = sqliteTable(
  'proposals',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    summary: text('summary'),
    scope: text('scope'),
    deliverables: text('deliverables'),
    timeline: text('timeline'),
    costModel: text('cost_model', { enum: ['fixed', 'hourly', 'retainer'] }).notNull().default('fixed'),
    totalAmount: integer('total_amount'), // cents
    currency: text('currency').notNull().default('USD'),
    validUntil: integer('valid_until', { mode: 'timestamp_ms' }),
    status: text('status', {
      enum: ['draft', 'pending_approval', 'approved', 'sent', 'revised', 'accepted', 'declined'],
    }).notNull().default('draft'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    approvedByUserId: text('approved_by_user_id').references(() => users.id),
    sentAt: integer('sent_at', { mode: 'timestamp_ms' }),
    acceptedAt: integer('accepted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('proposals_lead_idx').on(table.leadId),
    clientIdx: index('proposals_client_idx').on(table.clientId),
    statusIdx: index('proposals_status_idx').on(table.status),
  })
);

export const proposalItems = sqliteTable(
  'proposal_items',
  {
    id: text('id').primaryKey(),
    proposalId: text('proposal_id')
      .notNull()
      .references(() => proposals.id),
    description: text('description').notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(), // cents
    discount: integer('discount').default(0),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => ({
    proposalIdx: index('proposal_items_proposal_idx').on(table.proposalId),
  })
);

// Invoices & Payments
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'canceled';

export const invoices = sqliteTable(
  'invoices',
  {
    id: text('id').primaryKey(),
    invoiceNumber: text('invoice_number').notNull(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    proposalId: text('proposal_id').references(() => proposals.id),
    title: text('title').notNull(),
    totalAmount: integer('total_amount').notNull(), // cents
    paidAmount: integer('paid_amount').notNull().default(0),
    currency: text('currency').notNull().default('USD'),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    status: text('status', {
      enum: ['draft', 'sent', 'partial', 'paid', 'overdue', 'canceled'],
    }).notNull().default('draft'),
    sentAt: integer('sent_at', { mode: 'timestamp_ms' }),
    paidAt: integer('paid_at', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('invoices_project_idx').on(table.projectId),
    clientIdx: index('invoices_client_idx').on(table.clientId),
    statusIdx: index('invoices_status_idx').on(table.status),
  })
);

export const invoiceItems = sqliteTable(
  'invoice_items',
  {
    id: text('id').primaryKey(),
    invoiceId: text('invoice_id')
      .notNull()
      .references(() => invoices.id),
    description: text('description').notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => ({
    invoiceIdx: index('invoice_items_invoice_idx').on(table.invoiceId),
  })
);

export const payments = sqliteTable(
  'payments',
  {
    id: text('id').primaryKey(),
    invoiceId: text('invoice_id')
      .notNull()
      .references(() => invoices.id),
    amount: integer('amount').notNull(), // cents
    method: text('method'), // stripe, paypal, bank_transfer, cash
    reference: text('reference'),
    paidAt: integer('paid_at', { mode: 'timestamp_ms' }).notNull(),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    invoiceIdx: index('payments_invoice_idx').on(table.invoiceId),
  })
);

// Time Tracking
export const timeEntries = sqliteTable(
  'time_entries',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id').references(() => tasks.id),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    description: text('description'),
    minutes: integer('minutes').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    billable: integer('billable', { mode: 'boolean' }).notNull().default(true),
    invoiceId: text('invoice_id').references(() => invoices.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('time_entries_project_idx').on(table.projectId),
    userIdx: index('time_entries_user_idx').on(table.userId),
    taskIdx: index('time_entries_task_idx').on(table.taskId),
  })
);

// Project Milestones
export const milestones = sqliteTable(
  'milestones',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('milestones_project_idx').on(table.projectId),
  })
);

// Project Risks
export const projectRisks = sqliteTable(
  'project_risks',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    status: text('status', { enum: ['open', 'mitigated', 'closed'] }).notNull().default('open'),
    ownerUserId: text('owner_user_id').references(() => users.id),
    mitigationPlan: text('mitigation_plan'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('project_risks_project_idx').on(table.projectId),
  })
);

// Task Checklists
export const taskChecklists = sqliteTable(
  'task_checklists',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id),
    title: text('title').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => ({
    taskIdx: index('task_checklists_task_idx').on(table.taskId),
  })
);

// Bugs / QA
export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';

export const bugs = sqliteTable(
  'bugs',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    taskId: text('task_id').references(() => tasks.id),
    title: text('title').notNull(),
    description: text('description'),
    stepsToReproduce: text('steps_to_reproduce'),
    environment: text('environment'),
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    status: text('status', { enum: ['open', 'in_progress', 'resolved', 'closed', 'wont_fix'] }).notNull().default('open'),
    reportedByUserId: text('reported_by_user_id').references(() => users.id),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('bugs_project_idx').on(table.projectId),
    statusIdx: index('bugs_status_idx').on(table.status),
  })
);

// Email Log
export const emailLogs = sqliteTable(
  'email_logs',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),
    templateKey: text('template_key'),
    status: text('status', { enum: ['sent', 'failed', 'bounced'] }).notNull(),
    sentByUserId: text('sent_by_user_id').references(() => users.id),
    sentAt: integer('sent_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('email_logs_lead_idx').on(table.leadId),
    projectIdx: index('email_logs_project_idx').on(table.projectId),
  })
);

// Meetings
export const meetings = sqliteTable(
  'meetings',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    leadId: text('lead_id').references(() => leads.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    scheduledAt: integer('scheduled_at', { mode: 'timestamp_ms' }).notNull(),
    durationMinutes: integer('duration_minutes'),
    meetingLink: text('meeting_link'),
    agenda: text('agenda'),
    notes: text('notes'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('meetings_project_idx').on(table.projectId),
    scheduledIdx: index('meetings_scheduled_idx').on(table.scheduledAt),
  })
);

// Integrations & Webhooks
export const integrations = sqliteTable(
  'integrations',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', { enum: ['webhook', 'slack', 'github'] }).notNull(),
    config: text('config').$type<IntegrationConfig>(), // JSON
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  }
);

export const webhookDeliveries = sqliteTable(
  'webhook_deliveries',
  {
    id: text('id').primaryKey(),
    integrationId: text('integration_id')
      .notNull()
      .references(() => integrations.id),
    eventType: text('event_type').notNull(),
    payload: text('payload').notNull(),
    responseStatus: integer('response_status'),
    responseBody: text('response_body'),
    deliveredAt: integer('delivered_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    integrationIdx: index('webhook_deliveries_integration_idx').on(table.integrationId),
  })
);

// Lead Tags
export const leadTags = sqliteTable(
  'lead_tags',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id')
      .notNull()
      .references(() => leads.id),
    tag: text('tag').notNull(),
  },
  (table) => ({
    leadIdx: index('lead_tags_lead_idx').on(table.leadId),
  })
);

// ==================== ADDITIONAL FEATURES FROM DETAILED_PROJECT_ANALYSIS ====================

// Sub-tasks (for breaking down complex tasks)
export const subTasks = sqliteTable(
  'sub_tasks',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id),
    title: text('title').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    taskIdx: index('sub_tasks_task_idx').on(table.taskId),
  })
);

// QA Sign-offs
export type QASignoffStatus = 'pending' | 'approved' | 'rejected';

export const qaSignoffs = sqliteTable(
  'qa_signoffs',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    milestoneId: text('milestone_id').references(() => milestones.id),
    version: text('version'),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
    signedByUserId: text('signed_by_user_id').references(() => users.id),
    signedAt: integer('signed_at', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('qa_signoffs_project_idx').on(table.projectId),
  })
);

// Retrospectives (Post-project review)
export const retrospectives = sqliteTable(
  'retrospectives',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    startItems: text('start_items').$type<RetroItems>(), // JSON array - things to start doing
    stopItems: text('stop_items').$type<RetroItems>(), // JSON array - things to stop doing
    continueItems: text('continue_items').$type<RetroItems>(), // JSON array - things to continue doing
    actionItems: text('action_items').$type<RetroItems>(), // JSON array - action items from retro
    conductedByUserId: text('conducted_by_user_id').references(() => users.id),
    conductedAt: integer('conducted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('retrospectives_project_idx').on(table.projectId),
  })
);

// NPS Surveys (Client satisfaction)
export const npsSurveys = sqliteTable(
  'nps_surveys',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    score: integer('score').notNull(), // 0-10
    feedback: text('feedback'),
    respondentEmail: text('respondent_email'),
    respondedAt: integer('responded_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('nps_surveys_project_idx').on(table.projectId),
  })
);

// Lessons Learned
export const lessonsLearned = sqliteTable(
  'lessons_learned',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    category: text('category', { enum: ['technical', 'process', 'communication', 'scope', 'other'] }).notNull().default('other'),
    title: text('title').notNull(),
    description: text('description'),
    impact: text('impact', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    recommendation: text('recommendation'),
    authorUserId: text('author_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('lessons_learned_project_idx').on(table.projectId),
    categoryIdx: index('lessons_learned_category_idx').on(table.category),
  })
);

// Feasibility Checks (Pre-project assessment)
export const feasibilityChecks = sqliteTable(
  'feasibility_checks',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id')
      .notNull()
      .references(() => leads.id),
    technicalFeasibility: text('technical_feasibility', { enum: ['feasible', 'challenging', 'not_feasible', 'needs_research'] }),
    resourceAvailability: text('resource_availability', { enum: ['available', 'limited', 'not_available'] }),
    timelineRealistic: integer('timeline_realistic', { mode: 'boolean' }),
    budgetAdequate: integer('budget_adequate', { mode: 'boolean' }),
    riskLevel: text('risk_level', { enum: ['low', 'medium', 'high', 'critical'] }),
    notes: text('notes'),
    checklist: text('checklist').$type<ChecklistItems>(), // JSON array of check items
    reviewedByUserId: text('reviewed_by_user_id').references(() => users.id),
    reviewedAt: integer('reviewed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('feasibility_checks_lead_idx').on(table.leadId),
  })
);

// Estimation Records
export const estimations = sqliteTable(
  'estimations',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    title: text('title').notNull(),
    totalHours: integer('total_hours'),
    hourlyRate: integer('hourly_rate'), // cents
    complexity: text('complexity', { enum: ['simple', 'moderate', 'complex', 'very_complex'] }),
    confidence: text('confidence', { enum: ['low', 'medium', 'high'] }),
    breakdown: text('breakdown').$type<EstimationBreakdown>(), // JSON with feature breakdown
    assumptions: text('assumptions'),
    exclusions: text('exclusions'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('estimations_lead_idx').on(table.leadId),
    projectIdx: index('estimations_project_idx').on(table.projectId),
  })
);

// Stakeholder Map
export const stakeholders = sqliteTable(
  'stakeholders',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    name: text('name').notNull(),
    role: text('role'), // Decision Maker, Technical Lead, End User, Sponsor, etc.
    email: text('email'),
    phone: text('phone'),
    influence: text('influence', { enum: ['low', 'medium', 'high'] }),
    interest: text('interest', { enum: ['low', 'medium', 'high'] }),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('stakeholders_lead_idx').on(table.leadId),
    projectIdx: index('stakeholders_project_idx').on(table.projectId),
  })
);

// Change Requests (Post-kickoff scope changes)
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

export const changeRequests = sqliteTable(
  'change_requests',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    impact: text('impact'), // Description of impact
    estimatedHours: integer('estimated_hours'),
    estimatedCost: integer('estimated_cost'), // cents
    priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    status: text('status', { enum: ['pending', 'approved', 'rejected', 'implemented'] }).notNull().default('pending'),
    requestedByClientId: text('requested_by_client_id').references(() => clients.id),
    approvedByUserId: text('approved_by_user_id').references(() => users.id),
    approvedAt: integer('approved_at', { mode: 'timestamp_ms' }),
    implementedAt: integer('implemented_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('change_requests_project_idx').on(table.projectId),
    statusIdx: index('change_requests_status_idx').on(table.status),
  })
);

// Decision Records (ADR - Architecture Decision Records)
export const decisionRecords = sqliteTable(
  'decision_records',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    context: text('context'), // Why this decision was needed
    decision: text('decision'), // What was decided
    alternatives: text('alternatives'), // What else was considered
    consequences: text('consequences'), // Impact of the decision
    status: text('status', { enum: ['proposed', 'accepted', 'deprecated', 'superseded'] }).notNull().default('proposed'),
    authorUserId: text('author_user_id').references(() => users.id),
    decidedAt: integer('decided_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('decision_records_project_idx').on(table.projectId),
  })
);

// Performance Test Results
export const performanceTests = sqliteTable(
  'performance_tests',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    testType: text('test_type', { enum: ['lighthouse', 'load_test', 'stress_test', 'other'] }).notNull(),
    url: text('url'),
    performanceScore: integer('performance_score'),
    accessibilityScore: integer('accessibility_score'),
    bestPracticesScore: integer('best_practices_score'),
    seoScore: integer('seo_score'),
    lcp: integer('lcp'), // Largest Contentful Paint (ms)
    fid: integer('fid'), // First Input Delay (ms)
    cls: integer('cls'), // Cumulative Layout Shift (x100)
    resultsJson: text('results_json'), // Full results
    notes: text('notes'),
    testedByUserId: text('tested_by_user_id'),
    testedAt: integer('tested_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('performance_tests_project_idx').on(table.projectId),
  })
);

// Security Audit Findings
export const securityAudits = sqliteTable(
  'security_audits',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    auditType: text('audit_type', { enum: ['penetration', 'code_review', 'dependency', 'compliance', 'other'] }).notNull(),
    severity: text('severity', { enum: ['info', 'low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'), // File/URL/component affected
    recommendation: text('recommendation'),
    status: text('status', { enum: ['open', 'in_progress', 'resolved', 'accepted_risk'] }).notNull().default('open'),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    auditedByUserId: text('audited_by_user_id').references(() => users.id),
    auditedAt: integer('audited_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('security_audits_project_idx').on(table.projectId),
    statusIdx: index('security_audits_status_idx').on(table.status),
  })
);

// Accessibility Audit Log (WCAG Compliance)
export const accessibilityAudits = sqliteTable(
  'accessibility_audits',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    wcagLevel: text('wcag_level', { enum: ['A', 'AA', 'AAA'] }).notNull().default('AA'),
    criterion: text('criterion').notNull(), // e.g., "1.1.1", "2.1.1"
    criterionTitle: text('criterion_title'), // e.g., "Non-text Content", "Keyboard"
    severity: text('severity', { enum: ['minor', 'moderate', 'serious', 'critical'] }).notNull().default('moderate'),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'), // Page/component/element affected
    affectedUsers: text('affected_users'), // e.g., "screen reader users", "keyboard-only users"
    recommendation: text('recommendation'),
    status: text('status', { enum: ['open', 'in_progress', 'resolved', 'wont_fix'] }).notNull().default('open'),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    auditedByUserId: text('audited_by_user_id').references(() => users.id),
    auditedAt: integer('audited_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('accessibility_audits_project_idx').on(table.projectId),
    statusIdx: index('accessibility_audits_status_idx').on(table.status),
    levelIdx: index('accessibility_audits_level_idx').on(table.wcagLevel),
  })
);

// Mobile Responsiveness Checklist
export const mobileChecks = sqliteTable(
  'mobile_checks',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    category: text('category', { enum: ['layout', 'navigation', 'touch', 'performance', 'typography', 'forms', 'media', 'other'] }).notNull(),
    checkItem: text('check_item').notNull(), // e.g., "Buttons are at least 44x44px"
    description: text('description'),
    breakpoint: text('breakpoint'), // e.g., "320px", "768px", "mobile", "tablet"
    status: text('status', { enum: ['not_tested', 'pass', 'fail', 'partial', 'na'] }).notNull().default('not_tested'),
    notes: text('notes'),
    testedOnDevice: text('tested_on_device'), // e.g., "iPhone 14 Pro", "Samsung Galaxy S23"
    screenshotUrl: text('screenshot_url'),
    testedByUserId: text('tested_by_user_id').references(() => users.id),
    testedAt: integer('tested_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('mobile_checks_project_idx').on(table.projectId),
    statusIdx: index('mobile_checks_status_idx').on(table.status),
  })
);

// Feedback Items (Post-delivery client feedback)
export const feedbackItems = sqliteTable(
  'feedback_items',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    type: text('type', { enum: ['bug', 'enhancement', 'question', 'praise', 'complaint'] }).notNull(),
    content: text('content').notNull(),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    status: text('status', { enum: ['new', 'acknowledged', 'in_progress', 'resolved', 'wont_fix'] }).notNull().default('new'),
    source: text('source'), // email, call, meeting, portal
    respondedAt: integer('responded_at', { mode: 'timestamp_ms' }),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('feedback_items_project_idx').on(table.projectId),
    statusIdx: index('feedback_items_status_idx').on(table.status),
  })
);

// Maintenance Tasks (Auto-generated recurring tasks)
export const maintenanceTasks = sqliteTable(
  'maintenance_tasks',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    frequency: text('frequency', { enum: ['weekly', 'monthly', 'quarterly', 'yearly'] }).notNull(),
    nextDueAt: integer('next_due_at', { mode: 'timestamp_ms' }),
    lastCompletedAt: integer('last_completed_at', { mode: 'timestamp_ms' }),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('maintenance_tasks_project_idx').on(table.projectId),
  })
);

// System Health Monitoring
export const systemHealth = sqliteTable(
  'system_health',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    checkType: text('check_type', { enum: ['uptime', 'performance', 'error_rate', 'custom'] }).notNull(),
    status: text('status', { enum: ['healthy', 'degraded', 'down', 'unknown'] }).notNull(),
    value: integer('value'), // Uptime %, error count, response time ms
    url: text('url'),
    notes: text('notes'),
    checkedAt: integer('checked_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('system_health_project_idx').on(table.projectId),
    checkedIdx: index('system_health_checked_idx').on(table.checkedAt),
  })
);

// Risk Assessments (Pre-Project & During Project)
export const riskAssessments = sqliteTable(
  'risk_assessments',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id), // For pre-project risks
    projectId: text('project_id').references(() => projects.id), // For ongoing project risks
    title: text('title').notNull(),
    description: text('description'),
    category: text('category', { 
      enum: ['technical', 'resource', 'timeline', 'budget', 'scope', 'external'] 
    }).notNull(),
    probability: text('probability', { enum: ['low', 'medium', 'high'] }).notNull(),
    impact: text('impact', { enum: ['low', 'medium', 'high', 'critical'] }).notNull(),
    riskScore: integer('risk_score'), // Calculated: probability * impact
    mitigationPlan: text('mitigation_plan'),
    contingencyPlan: text('contingency_plan'),
    status: text('status', { 
      enum: ['identified', 'mitigating', 'mitigated', 'occurred', 'closed'] 
    }).notNull().default('identified'),
    ownerId: text('owner_id').references(() => users.id), // User responsible for monitoring
    identifiedByUserId: text('identified_by_user_id').references(() => users.id),
    closedAt: integer('closed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('risk_assessments_lead_idx').on(table.leadId),
    projectIdx: index('risk_assessments_project_idx').on(table.projectId),
    statusIdx: index('risk_assessments_status_idx').on(table.status),
  })
);

// Environment Configurations (Track env vars per project)
export const environmentConfigs = sqliteTable(
  'environment_configs',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    environment: text('environment', { 
      enum: ['development', 'staging', 'production'] 
    }).notNull(),
    key: text('key').notNull(),
    description: text('description'),
    isSecret: integer('is_secret', { mode: 'boolean' }).notNull().default(true),
    hasValue: integer('has_value', { mode: 'boolean' }).notNull().default(false), // Only track if value is set, never store actual secrets
    lastUpdatedByUserId: text('last_updated_by_user_id').references(() => users.id),
    lastUpdatedAt: integer('last_updated_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('environment_configs_project_idx').on(table.projectId),
    projectEnvKeyUnique: uniqueIndex('environment_configs_unique').on(table.projectId, table.environment, table.key),
  })
);

// Meeting Notes Log
export const meetingNotes = sqliteTable(
  'meeting_notes',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    meetingType: text('meeting_type', { 
      enum: ['standup', 'planning', 'review', 'retrospective', 'client', 'technical', 'other'] 
    }).notNull().default('other'),
    attendees: text('attendees').$type<MeetingAttendees>(), // JSON array of user IDs
    notes: text('notes'),
    actionItems: text('action_items').$type<MeetingActionItems>(), // JSON array of action items
    decisionsJson: text('decisions_json').$type<MeetingDecisions>(), // JSON array of decisions made
    followUpDate: integer('follow_up_date', { mode: 'timestamp_ms' }),
    recordedByUserId: text('recorded_by_user_id').references(() => users.id),
    meetingDate: integer('meeting_date', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('meeting_notes_project_idx').on(table.projectId),
    dateIdx: index('meeting_notes_date_idx').on(table.meetingDate),
  })
);

// Project Templates Library
export const projectTemplates = sqliteTable(
  'project_templates',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category', { 
      enum: ['web_app', 'mobile_app', 'api', 'e_commerce', 'cms', 'custom'] 
    }).notNull(),
    tasksJson: text('tasks_json').$type<TemplateTask[]>(), // JSON array of default tasks
    milestonesJson: text('milestones_json').$type<TemplateMilestone[]>(), // JSON array of default milestones
    estimatedHours: integer('estimated_hours'),
    techStackJson: text('tech_stack_json').$type<TechStack>(), // JSON array
    checklistsJson: text('checklists_json').$type<TemplateChecklist[]>(), // Default QA checklists
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    categoryIdx: index('project_templates_category_idx').on(table.category),
  })
);

// Support Tickets (Post-delivery support)
export const supportTickets = sqliteTable(
  'support_tickets',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    ticketNumber: text('ticket_number').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
    status: text('status', { 
      enum: ['open', 'in_progress', 'awaiting_client', 'resolved', 'closed'] 
    }).notNull().default('open'),
    category: text('category', { 
      enum: ['bug', 'question', 'feature_request', 'performance', 'security', 'other'] 
    }).notNull(),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    closedAt: integer('closed_at', { mode: 'timestamp_ms' }),
    firstResponseAt: integer('first_response_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('support_tickets_project_idx').on(table.projectId),
    statusIdx: index('support_tickets_status_idx').on(table.status),
    ticketNumUnique: uniqueIndex('support_tickets_number_unique').on(table.ticketNumber),
  })
);

// API Endpoint Planner
export const apiEndpoints = sqliteTable(
  'api_endpoints',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    method: text('method', { 
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] 
    }).notNull(),
    path: text('path').notNull(), // e.g., /api/users/:id
    description: text('description'),
    requestBodySchema: text('request_body_schema'), // JSON schema or example
    responseSchema: text('response_schema'), // JSON schema or example
    authRequired: integer('auth_required', { mode: 'boolean' }).notNull().default(true),
    roleRequired: text('role_required'), // e.g., admin, user
    status: text('status', { 
      enum: ['planned', 'in_progress', 'implemented', 'deprecated'] 
    }).notNull().default('planned'),
    implementedAt: integer('implemented_at', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('api_endpoints_project_idx').on(table.projectId),
    pathIdx: index('api_endpoints_path_idx').on(table.path),
  })
);

// Case Studies
export const caseStudies = sqliteTable(
  'case_studies',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    title: text('title').notNull(),
    summary: text('summary'), // Brief project summary
    challenge: text('challenge'), // What problem were we solving?
    solution: text('solution'), // How did we solve it?
    results: text('results'), // Outcomes, metrics, impact
    testimonial: text('testimonial'), // Client quote
    testimonialAuthor: text('testimonial_author'),
    technologies: text('technologies').$type<TechStack>(), // JSON array of tech used
    industryTags: text('industry_tags').$type<string[]>(), // JSON array
    duration: text('duration'), // e.g., "3 months"
    teamSize: integer('team_size'),
    imageUrls: text('image_urls').$type<string[]>(), // JSON array of screenshot/image URLs
    status: text('status', { 
      enum: ['draft', 'review', 'published', 'archived'] 
    }).notNull().default('draft'),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('case_studies_project_idx').on(table.projectId),
    statusIdx: index('case_studies_status_idx').on(table.status),
  })
);

// Process Improvement Suggestions
export const processSuggestions = sqliteTable(
  'process_suggestions',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    category: text('category', {
      enum: ['workflow', 'tooling', 'communication', 'documentation', 'quality', 'other']
    }).notNull().default('other'),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    status: text('status', { 
      enum: ['submitted', 'under_review', 'accepted', 'implemented', 'rejected'] 
    }).notNull().default('submitted'),
    submittedByUserId: text('submitted_by_user_id').references(() => users.id),
    reviewedByUserId: text('reviewed_by_user_id').references(() => users.id),
    reviewNotes: text('review_notes'),
    implementedAt: integer('implemented_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    statusIdx: index('process_suggestions_status_idx').on(table.status),
    submitterIdx: index('process_suggestions_submitter_idx').on(table.submittedByUserId),
  })
);

// ==================== BUSINESS PROCESS WORKFLOW TABLES ====================

// Business Process Step Instances (tracks individual step execution)
export type BPStepInstanceStatus = 'pending' | 'active' | 'completed' | 'skipped' | 'failed';

export const businessProcessStepInstances = sqliteTable(
  'business_process_step_instances',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id')
      .notNull()
      .references(() => processInstances.id),
    stepKey: text('step_key').notNull(),
    status: text('status', {
      enum: ['pending', 'active', 'completed', 'skipped', 'failed'],
    })
      .notNull()
      .default('pending'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    completedByUserId: text('completed_by_user_id').references(() => users.id),
    notes: text('notes'),
    outputData: text('output_data'), // JSON
    gatewayDecision: text('gateway_decision'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    processIdx: index('bp_step_instances_process_idx').on(table.processInstanceId),
    statusIdx: index('bp_step_instances_status_idx').on(table.status),
    stepKeyIdx: index('bp_step_instances_step_key_idx').on(table.stepKey),
    assignedIdx: index('bp_step_instances_assigned_idx').on(table.assignedToUserId),
  })
);

// Business Process Data Context
export const businessProcessData = sqliteTable(
  'business_process_data',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id')
      .notNull()
      .references(() => processInstances.id),
    dataKey: text('data_key').notNull(),
    dataValue: text('data_value'),
    dataType: text('data_type', {
      enum: ['string', 'number', 'boolean', 'date', 'json'],
    }).default('string'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    updatedByUserId: text('updated_by_user_id').references(() => users.id),
  },
  (table) => ({
    instanceIdx: index('bp_data_instance_idx').on(table.processInstanceId),
    instanceKeyUnique: uniqueIndex('bp_data_instance_key_unique').on(
      table.processInstanceId,
      table.dataKey
    ),
  })
);

// Business Process Messages (inter-lane communication)
export type BPMessageStatus = 'pending' | 'sent' | 'received' | 'failed';

export const businessProcessMessages = sqliteTable(
  'business_process_messages',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id')
      .notNull()
      .references(() => processInstances.id),
    messageKey: text('message_key').notNull(),
    fromStepKey: text('from_step_key').notNull(),
    toStepKey: text('to_step_key').notNull(),
    label: text('label'),
    payload: text('payload'), // JSON
    sentAt: integer('sent_at', { mode: 'timestamp_ms' }).notNull(),
    receivedAt: integer('received_at', { mode: 'timestamp_ms' }),
    status: text('status', {
      enum: ['pending', 'sent', 'received', 'failed'],
    })
      .notNull()
      .default('pending'),
  },
  (table) => ({
    instanceIdx: index('bp_messages_instance_idx').on(table.processInstanceId),
    statusIdx: index('bp_messages_status_idx').on(table.status),
  })
);

// Business Process Automation Log
export type BPAutomationStatus = 'pending' | 'running' | 'completed' | 'failed';

export const businessProcessAutomations = sqliteTable(
  'business_process_automations',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id')
      .notNull()
      .references(() => processInstances.id),
    stepKey: text('step_key').notNull(),
    automationAction: text('automation_action').notNull(),
    status: text('status', {
      enum: ['pending', 'running', 'completed', 'failed'],
    })
      .notNull()
      .default('pending'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    resultData: text('result_data'), // JSON
    errorMessage: text('error_message'),
    retryCount: integer('retry_count').default(0),
  },
  (table) => ({
    instanceIdx: index('bp_automations_instance_idx').on(table.processInstanceId),
    statusIdx: index('bp_automations_status_idx').on(table.status),
    actionIdx: index('bp_automations_action_idx').on(table.automationAction),
  })
);

// Business Process SLA Definitions
export const businessProcessSlas = sqliteTable(
  'business_process_slas',
  {
    id: text('id').primaryKey(),
    processDefinitionId: text('process_definition_id')
      .notNull()
      .references(() => processDefinitions.id),
    stepKey: text('step_key').notNull(),
    maxDurationMinutes: integer('max_duration_minutes'),
    warningThresholdMinutes: integer('warning_threshold_minutes'),
    escalationUserId: text('escalation_user_id').references(() => users.id),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    defIdx: index('bp_slas_def_idx').on(table.processDefinitionId),
    stepIdx: index('bp_slas_step_idx').on(table.stepKey),
  })
);

// Lead Scoring Rules
export const leadScoringRules = sqliteTable(
  'lead_scoring_rules',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    field: text('field').notNull(),
    condition: text('condition').notNull(), // 'equals', 'contains', 'not_empty', etc.
    value: text('value'),
    scoreAdjustment: integer('score_adjustment').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    priority: integer('priority').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    activeIdx: index('lead_scoring_rules_active_idx').on(table.isActive),
    fieldIdx: index('lead_scoring_rules_field_idx').on(table.field),
  })
);

// Email Templates for automation
export const emailTemplates = sqliteTable(
  'email_templates',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull().unique(),
    name: text('name').notNull(),
    subject: text('subject').notNull(),
    bodyHtml: text('body_html').notNull(),
    bodyText: text('body_text'),
    variables: text('variables'), // JSON array
    category: text('category'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    keyIdx: index('email_templates_key_idx').on(table.key),
    categoryIdx: index('email_templates_category_idx').on(table.category),
    activeIdx: index('email_templates_active_idx').on(table.isActive),
  })
);

// Onboarding Checklists
export type OnboardingChecklistStatus = 'pending' | 'in_progress' | 'completed';

export const onboardingChecklists = sqliteTable(
  'onboarding_checklists',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id').references(() => processInstances.id),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    items: text('items').notNull().$type<ChecklistItems>(), // JSON
    completedCount: integer('completed_count').notNull().default(0),
    totalCount: integer('total_count').notNull().default(0),
    status: text('status', {
      enum: ['pending', 'in_progress', 'completed'],
    })
      .notNull()
      .default('pending'),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    instanceIdx: index('onboarding_checklists_instance_idx').on(table.processInstanceId),
    projectIdx: index('onboarding_checklists_project_idx').on(table.projectId),
    statusIdx: index('onboarding_checklists_status_idx').on(table.status),
  })
);
