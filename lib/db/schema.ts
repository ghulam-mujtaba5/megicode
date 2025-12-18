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



// ==================== ADDITIONAL FEATURES FROM DETAILED_PROJECT_ANALYSIS ====================

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
