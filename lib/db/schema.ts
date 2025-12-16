import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

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
    leadId: text('lead_id'),
    name: text('name').notNull(),
    ownerUserId: text('owner_user_id'),
    status: text('status', {
      enum: ['new', 'in_progress', 'blocked', 'in_qa', 'delivered', 'closed', 'rejected'],
    })
      .notNull()
      .default('new'),
    priority: text('priority').notNull().default('medium'),
    startAt: integer('start_at', { mode: 'timestamp_ms' }),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    ownerIdx: index('projects_owner_idx').on(table.ownerUserId),
    statusIdx: index('projects_status_idx').on(table.status),
  })
);

export const processDefinitions = sqliteTable(
  'process_definitions',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    version: integer('version').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    json: text('json').notNull(),
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
    processDefinitionId: text('process_definition_id').notNull(),
    projectId: text('project_id').notNull(),
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
    instanceId: text('instance_id').notNull(),
    key: text('key').notNull(),
    title: text('title').notNull(),
    status: text('status', { enum: ['todo', 'in_progress', 'blocked', 'done', 'canceled'] })
      .notNull()
      .default('todo'),
    assignedToUserId: text('assigned_to_user_id'),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    instanceIdx: index('tasks_instance_idx').on(table.instanceId),
    assignedIdx: index('tasks_assigned_idx').on(table.assignedToUserId),
    statusIdx: index('tasks_status_idx').on(table.status),
  })
);

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id'),
    projectId: text('project_id'),
    instanceId: text('instance_id'),
    type: text('type').notNull(),
    actorUserId: text('actor_user_id'),
    payloadJson: text('payload_json'),
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
  actorUserId: text('actor_user_id'),
  action: text('action').notNull(),
  target: text('target'),
  payloadJson: text('payload_json'),
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
    clientId: text('client_id').notNull(),
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
    leadId: text('lead_id').notNull(),
    authorUserId: text('author_user_id').notNull(),
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
    taskId: text('task_id').notNull(),
    authorUserId: text('author_user_id').notNull(),
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
    projectId: text('project_id').notNull(),
    authorUserId: text('author_user_id').notNull(),
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
    uploadedByUserId: text('uploaded_by_user_id'),
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
    leadId: text('lead_id'),
    clientId: text('client_id'),
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
    createdByUserId: text('created_by_user_id'),
    approvedByUserId: text('approved_by_user_id'),
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
    proposalId: text('proposal_id').notNull(),
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
    projectId: text('project_id'),
    clientId: text('client_id'),
    proposalId: text('proposal_id'),
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
    invoiceId: text('invoice_id').notNull(),
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
    invoiceId: text('invoice_id').notNull(),
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
    taskId: text('task_id'),
    projectId: text('project_id').notNull(),
    userId: text('user_id').notNull(),
    description: text('description'),
    minutes: integer('minutes').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    billable: integer('billable', { mode: 'boolean' }).notNull().default(true),
    invoiceId: text('invoice_id'),
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
    projectId: text('project_id').notNull(),
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
    projectId: text('project_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    status: text('status', { enum: ['open', 'mitigated', 'closed'] }).notNull().default('open'),
    ownerUserId: text('owner_user_id'),
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
    taskId: text('task_id').notNull(),
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
    projectId: text('project_id').notNull(),
    taskId: text('task_id'),
    title: text('title').notNull(),
    description: text('description'),
    stepsToReproduce: text('steps_to_reproduce'),
    environment: text('environment'),
    severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    status: text('status', { enum: ['open', 'in_progress', 'resolved', 'closed', 'wont_fix'] }).notNull().default('open'),
    reportedByUserId: text('reported_by_user_id'),
    assignedToUserId: text('assigned_to_user_id'),
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
    leadId: text('lead_id'),
    projectId: text('project_id'),
    clientId: text('client_id'),
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),
    templateKey: text('template_key'),
    status: text('status', { enum: ['sent', 'failed', 'bounced'] }).notNull(),
    sentByUserId: text('sent_by_user_id'),
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
    projectId: text('project_id'),
    leadId: text('lead_id'),
    clientId: text('client_id'),
    title: text('title').notNull(),
    scheduledAt: integer('scheduled_at', { mode: 'timestamp_ms' }).notNull(),
    durationMinutes: integer('duration_minutes'),
    meetingLink: text('meeting_link'),
    agenda: text('agenda'),
    notes: text('notes'),
    createdByUserId: text('created_by_user_id'),
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
    config: text('config'), // JSON
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  }
);

export const webhookDeliveries = sqliteTable(
  'webhook_deliveries',
  {
    id: text('id').primaryKey(),
    integrationId: text('integration_id').notNull(),
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
    leadId: text('lead_id').notNull(),
    tag: text('tag').notNull(),
  },
  (table) => ({
    leadIdx: index('lead_tags_lead_idx').on(table.leadId),
  })
);
