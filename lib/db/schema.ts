import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import type {
  TechStack,
  RequirementsList,
  ProcessDefinitionJson,
  AuditPayload,
  ChecklistItems,
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
    skills: text('skills').$type<string[]>(), // JSON array of skills
    capacity: integer('capacity').default(40), // hours per week
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
    priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium'),
    targetDate: integer('target_date', { mode: 'timestamp_ms' }),
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
    status: text('status', { enum: ['pending', 'completed', 'canceled'] }).notNull().default('pending'),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('milestones_project_idx').on(table.projectId),
  })
);

// Bugs / QA (Part of project delivery)
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
    tasksJson: text('tasks_json'), // JSON array of default tasks
    milestonesJson: text('milestones_json'), // JSON array of default milestones
    estimatedHours: integer('estimated_hours'),
    techStackJson: text('tech_stack_json').$type<TechStack>(), // JSON array
    checklistsJson: text('checklists_json').$type<ChecklistItems>(), // Default QA checklists
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

// ==================== MISSING TABLES FOR BUILD FIX ====================

// Lead Scoring Rules
export const leadScoringRules = sqliteTable(
  'lead_scoring_rules',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    name: text('name').notNull(),
    points: integer('points').notNull().default(0),
    condition: text('condition'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    categoryIdx: index('lead_scoring_rules_category_idx').on(table.category),
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
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('lead_tags_lead_idx').on(table.leadId),
  })
);

// Estimations
export const estimations = sqliteTable(
  'estimations',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    estimatedHours: integer('estimated_hours'),
    estimatedCost: integer('estimated_cost'), // cents
    complexity: text('complexity', { enum: ['simple', 'moderate', 'complex', 'very_complex'] }),
    assumptions: text('assumptions'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    status: text('status', { enum: ['draft', 'pending', 'approved', 'rejected'] }).notNull().default('draft'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('estimations_lead_idx').on(table.leadId),
    projectIdx: index('estimations_project_idx').on(table.projectId),
  })
);

// Stakeholders
export const stakeholders = sqliteTable(
  'stakeholders',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    role: text('role'),
    influence: text('influence', { enum: ['low', 'medium', 'high'] }),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('stakeholders_lead_idx').on(table.leadId),
    projectIdx: index('stakeholders_project_idx').on(table.projectId),
    clientIdx: index('stakeholders_client_idx').on(table.clientId),
  })
);

// Risk Assessments
export const riskAssessments = sqliteTable(
  'risk_assessments',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id').references(() => leads.id),
    projectId: text('project_id').references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category'),
    likelihood: text('likelihood', { enum: ['low', 'medium', 'high'] }),
    impact: text('impact', { enum: ['low', 'medium', 'high'] }),
    mitigationStrategy: text('mitigation_strategy'),
    status: text('status', { enum: ['open', 'mitigated', 'closed'] }).notNull().default('open'),
    ownerUserId: text('owner_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('risk_assessments_lead_idx').on(table.leadId),
    projectIdx: index('risk_assessments_project_idx').on(table.projectId),
  })
);

// Feasibility Checks
export const feasibilityChecks = sqliteTable(
  'feasibility_checks',
  {
    id: text('id').primaryKey(),
    leadId: text('lead_id')
      .notNull()
      .references(() => leads.id),
    category: text('category').notNull(),
    question: text('question').notNull(),
    answer: text('answer'),
    score: integer('score'),
    notes: text('notes'),
    assessedByUserId: text('assessed_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    leadIdx: index('feasibility_checks_lead_idx').on(table.leadId),
  })
);

// Client Contacts
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
    role: text('role'),
    isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    clientIdx: index('client_contacts_client_idx').on(table.clientId),
  })
);

// Invoices
export type InvoiceStatus = 'draft' | 'pending' | 'sent' | 'paid' | 'overdue' | 'canceled';

export const invoices = sqliteTable(
  'invoices',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    invoiceNumber: text('invoice_number').notNull(),
    title: text('title'),
    subtotal: integer('subtotal').notNull(), // cents
    taxAmount: integer('tax_amount').default(0),
    totalAmount: integer('total_amount').notNull(), // cents
    currency: text('currency').notNull().default('USD'),
    status: text('status', {
      enum: ['draft', 'pending', 'sent', 'paid', 'overdue', 'canceled'],
    }).notNull().default('draft'),
    issuedAt: integer('issued_at', { mode: 'timestamp_ms' }),
    dueAt: integer('due_at', { mode: 'timestamp_ms' }),
    paidAt: integer('paid_at', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('invoices_project_idx').on(table.projectId),
    clientIdx: index('invoices_client_idx').on(table.clientId),
    statusIdx: index('invoices_status_idx').on(table.status),
  })
);

// Invoice Items
export const invoiceItems = sqliteTable(
  'invoice_items',
  {
    id: text('id').primaryKey(),
    invoiceId: text('invoice_id')
      .notNull()
      .references(() => invoices.id),
    description: text('description').notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(), // cents
    amount: integer('amount').notNull(), // cents
    sortOrder: integer('sort_order').default(0),
  },
  (table) => ({
    invoiceIdx: index('invoice_items_invoice_idx').on(table.invoiceId),
  })
);

// Payments
export const payments = sqliteTable(
  'payments',
  {
    id: text('id').primaryKey(),
    invoiceId: text('invoice_id').references(() => invoices.id),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    amount: integer('amount').notNull(), // cents
    currency: text('currency').notNull().default('USD'),
    method: text('method', { enum: ['bank_transfer', 'credit_card', 'paypal', 'crypto', 'check', 'other'] }),
    status: text('status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).notNull().default('pending'),
    reference: text('reference'),
    notes: text('notes'),
    paidAt: integer('paid_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    invoiceIdx: index('payments_invoice_idx').on(table.invoiceId),
    projectIdx: index('payments_project_idx').on(table.projectId),
    clientIdx: index('payments_client_idx').on(table.clientId),
  })
);

// Time Entries
export const timeEntries = sqliteTable(
  'time_entries',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id').references(() => tasks.id),
    projectId: text('project_id').references(() => projects.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    description: text('description'),
    durationMinutes: integer('duration_minutes').notNull(),
    billable: integer('billable', { mode: 'boolean' }).default(true),
    hourlyRate: integer('hourly_rate'), // cents per hour
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    taskIdx: index('time_entries_task_idx').on(table.taskId),
    projectIdx: index('time_entries_project_idx').on(table.projectId),
    userIdx: index('time_entries_user_idx').on(table.userId),
    dateIdx: index('time_entries_date_idx').on(table.date),
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
    sortOrder: integer('sort_order').default(0),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
    completedByUserId: text('completed_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    taskIdx: index('task_checklists_task_idx').on(table.taskId),
  })
);

// QA Signoffs
export const qaSignoffs = sqliteTable(
  'qa_signoffs',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    milestoneId: text('milestone_id').references(() => milestones.id),
    type: text('type', { enum: ['feature', 'sprint', 'release', 'final'] }).notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected', 'conditional'] }).notNull().default('pending'),
    notes: text('notes'),
    signedByUserId: text('signed_by_user_id').references(() => users.id),
    signedAt: integer('signed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('qa_signoffs_project_idx').on(table.projectId),
    statusIdx: index('qa_signoffs_status_idx').on(table.status),
  })
);

// Retrospectives
export const retrospectives = sqliteTable(
  'retrospectives',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    sprintNumber: integer('sprint_number'),
    title: text('title').notNull(),
    wentWell: text('went_well'),
    improvements: text('improvements'),
    actionItems: text('action_items'),
    conductedByUserId: text('conducted_by_user_id').references(() => users.id),
    conductedAt: integer('conducted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('retrospectives_project_idx').on(table.projectId),
  })
);

// NPS Surveys
export const npsSurveys = sqliteTable(
  'nps_surveys',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    score: integer('score').notNull(), // 0-10
    feedback: text('feedback'),
    respondentName: text('respondent_name'),
    respondentEmail: text('respondent_email'),
    sentAt: integer('sent_at', { mode: 'timestamp_ms' }),
    respondedAt: integer('responded_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('nps_surveys_project_idx').on(table.projectId),
    clientIdx: index('nps_surveys_client_idx').on(table.clientId),
  })
);

// Feedback Items
export const feedbackItems = sqliteTable(
  'feedback_items',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    category: text('category', { enum: ['feature_request', 'bug', 'improvement', 'compliment', 'complaint', 'general'] }).notNull().default('general'),
    content: text('content').notNull(),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }),
    status: text('status', { enum: ['new', 'reviewed', 'addressed', 'dismissed'] }).notNull().default('new'),
    submittedByName: text('submitted_by_name'),
    submittedByEmail: text('submitted_by_email'),
    reviewedByUserId: text('reviewed_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('feedback_items_project_idx').on(table.projectId),
    clientIdx: index('feedback_items_client_idx').on(table.clientId),
    statusIdx: index('feedback_items_status_idx').on(table.status),
  })
);

// Environment Configs
export const environmentConfigs = sqliteTable(
  'environment_configs',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    name: text('name').notNull(), // development, staging, production
    url: text('url'),
    description: text('description'),
    credentials: text('credentials'), // encrypted or reference
    lastDeployedAt: integer('last_deployed_at', { mode: 'timestamp_ms' }),
    lastDeployedByUserId: text('last_deployed_by_user_id').references(() => users.id),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('environment_configs_project_idx').on(table.projectId),
  })
);

// Meeting Notes
export const meetingNotes = sqliteTable(
  'meeting_notes',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    leadId: text('lead_id').references(() => leads.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    agenda: text('agenda'),
    notes: text('notes'),
    actionItems: text('action_items'),
    attendees: text('attendees'),
    meetingDate: integer('meeting_date', { mode: 'timestamp_ms' }),
    duration: integer('duration'), // minutes
    recordedByUserId: text('recorded_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('meeting_notes_project_idx').on(table.projectId),
    leadIdx: index('meeting_notes_lead_idx').on(table.leadId),
    clientIdx: index('meeting_notes_client_idx').on(table.clientId),
  })
);

// Support Tickets
export type SupportTicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed';

export const supportTickets = sqliteTable(
  'support_tickets',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    ticketNumber: text('ticket_number').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
    category: text('category'),
    status: text('status', {
      enum: ['open', 'in_progress', 'waiting_client', 'resolved', 'closed'],
    }).notNull().default('open'),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id),
    reportedByName: text('reported_by_name'),
    reportedByEmail: text('reported_by_email'),
    resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
    closedAt: integer('closed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('support_tickets_project_idx').on(table.projectId),
    clientIdx: index('support_tickets_client_idx').on(table.clientId),
    statusIdx: index('support_tickets_status_idx').on(table.status),
  })
);

// API Endpoints
export const apiEndpoints = sqliteTable(
  'api_endpoints',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    method: text('method', { enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }).notNull(),
    path: text('path').notNull(),
    description: text('description'),
    requestSchema: text('request_schema'),
    responseSchema: text('response_schema'),
    authentication: text('authentication'),
    rateLimit: text('rate_limit'),
    version: text('version'),
    isDeprecated: integer('is_deprecated', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('api_endpoints_project_idx').on(table.projectId),
  })
);

// Case Studies
export const caseStudies = sqliteTable(
  'case_studies',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    summary: text('summary'),
    challenge: text('challenge'),
    solution: text('solution'),
    results: text('results'),
    testimonial: text('testimonial'),
    testimonialAuthor: text('testimonial_author'),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('case_studies_project_idx').on(table.projectId),
    clientIdx: index('case_studies_client_idx').on(table.clientId),
  })
);

// Accessibility Audits
export const accessibilityAudits = sqliteTable(
  'accessibility_audits',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    url: text('url').notNull(),
    standard: text('standard', { enum: ['WCAG_2_0', 'WCAG_2_1', 'WCAG_2_2', 'Section_508'] }).notNull().default('WCAG_2_1'),
    level: text('level', { enum: ['A', 'AA', 'AAA'] }).notNull().default('AA'),
    issuesFound: integer('issues_found'),
    criticalIssues: integer('critical_issues'),
    passRate: integer('pass_rate'), // percentage
    report: text('report'),
    auditedByUserId: text('audited_by_user_id').references(() => users.id),
    auditedAt: integer('audited_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('accessibility_audits_project_idx').on(table.projectId),
  })
);

// Mobile Checks
export const mobileChecks = sqliteTable(
  'mobile_checks',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    device: text('device').notNull(),
    platform: text('platform', { enum: ['ios', 'android', 'web_mobile'] }).notNull(),
    osVersion: text('os_version'),
    browserOrApp: text('browser_or_app'),
    screenSize: text('screen_size'),
    status: text('status', { enum: ['pass', 'fail', 'partial'] }).notNull(),
    notes: text('notes'),
    issues: text('issues'),
    checkedByUserId: text('checked_by_user_id').references(() => users.id),
    checkedAt: integer('checked_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('mobile_checks_project_idx').on(table.projectId),
  })
);

// Process Suggestions
export const processSuggestions = sqliteTable(
  'process_suggestions',
  {
    id: text('id').primaryKey(),
    processInstanceId: text('process_instance_id').references(() => processInstances.id),
    projectId: text('project_id').references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category', { enum: ['efficiency', 'quality', 'cost', 'communication', 'tooling', 'workflow', 'documentation', 'other'] }).notNull().default('other'),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    status: text('status', { enum: ['submitted', 'under_review', 'approved', 'implemented', 'rejected'] }).notNull().default('submitted'),
    impact: text('impact'),
    reviewNotes: text('review_notes'),
    submittedByUserId: text('submitted_by_user_id').references(() => users.id),
    reviewedByUserId: text('reviewed_by_user_id').references(() => users.id),
    implementedAt: integer('implemented_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    instanceIdx: index('process_suggestions_instance_idx').on(table.processInstanceId),
    projectIdx: index('process_suggestions_project_idx').on(table.projectId),
    statusIdx: index('process_suggestions_status_idx').on(table.status),
  })
);

// Integrations
export const integrations = sqliteTable(
  'integrations',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', { enum: ['crm', 'calendar', 'email', 'storage', 'payment', 'analytics', 'chat', 'other'] }).notNull(),
    provider: text('provider').notNull(), // e.g., 'google', 'slack', 'stripe'
    config: text('config'), // JSON encrypted
    status: text('status', { enum: ['active', 'inactive', 'error'] }).notNull().default('active'),
    lastSyncAt: integer('last_sync_at', { mode: 'timestamp_ms' }),
    errorMessage: text('error_message'),
    createdByUserId: text('created_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    typeIdx: index('integrations_type_idx').on(table.type),
    statusIdx: index('integrations_status_idx').on(table.status),
  })
);

// Meetings (for calendar integration)
export const meetings = sqliteTable(
  'meetings',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    leadId: text('lead_id').references(() => leads.id),
    clientId: text('client_id').references(() => clients.id),
    title: text('title').notNull(),
    description: text('description'),
    meetingType: text('meeting_type', { enum: ['discovery', 'kickoff', 'sprint_planning', 'standup', 'review', 'retrospective', 'client_call', 'internal', 'other'] }),
    location: text('location'),
    meetingUrl: text('meeting_url'),
    startAt: integer('start_at', { mode: 'timestamp_ms' }).notNull(),
    endAt: integer('end_at', { mode: 'timestamp_ms' }),
    attendees: text('attendees'), // JSON array
    organizerUserId: text('organizer_user_id').references(() => users.id),
    calendarEventId: text('calendar_event_id'),
    status: text('status', { enum: ['scheduled', 'completed', 'canceled', 'rescheduled'] }).notNull().default('scheduled'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    projectIdx: index('meetings_project_idx').on(table.projectId),
    leadIdx: index('meetings_lead_idx').on(table.leadId),
    clientIdx: index('meetings_client_idx').on(table.clientId),
    startIdx: index('meetings_start_idx').on(table.startAt),
  })
);

// User Availability (Vacation, Sick Leave, etc.)
export const userAvailability = sqliteTable(
  'user_availability',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type', { enum: ['vacation', 'sick_leave', 'public_holiday', 'other'] }).notNull(),
    startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }).notNull(),
    reason: text('reason'),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    userIdx: index('user_availability_user_idx').on(table.userId),
    dateIdx: index('user_availability_date_idx').on(table.startDate, table.endDate),
  })
);

// ==================== NOTIFICATIONS ====================

export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'task_updated'
  | 'task_due_soon'
  | 'task_overdue'
  | 'project_created'
  | 'project_updated'
  | 'project_status_changed'
  | 'lead_assigned'
  | 'lead_converted'
  | 'lead_status_changed'
  | 'mention'
  | 'comment'
  | 'sla_warning'
  | 'sla_breach'
  | 'process_step_completed'
  | 'process_completed'
  | 'approval_required'
  | 'approval_completed'
  | 'system'
  | 'custom';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export const notifications = sqliteTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type').notNull().$type<NotificationType>(),
    title: text('title').notNull(),
    message: text('message'),
    priority: text('priority', { enum: ['low', 'normal', 'high', 'urgent'] })
      .notNull()
      .default('normal'),
    // Link to related entity
    entityType: text('entity_type'), // task, project, lead, process, etc.
    entityId: text('entity_id'),
    link: text('link'), // URL to navigate to
    // Actor who triggered the notification
    actorUserId: text('actor_user_id').references(() => users.id),
    // Status
    isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
    readAt: integer('read_at', { mode: 'timestamp_ms' }),
    isDismissed: integer('is_dismissed', { mode: 'boolean' }).notNull().default(false),
    dismissedAt: integer('dismissed_at', { mode: 'timestamp_ms' }),
    // Expiration
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
    // Action buttons (JSON array of { label, url, style })
    actions: text('actions'), // JSON
    // Metadata
    metadata: text('metadata'), // JSON for additional data
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    userIdx: index('notifications_user_idx').on(table.userId),
    userReadIdx: index('notifications_user_read_idx').on(table.userId, table.isRead),
    typeIdx: index('notifications_type_idx').on(table.type),
    createdIdx: index('notifications_created_idx').on(table.createdAt),
    entityIdx: index('notifications_entity_idx').on(table.entityType, table.entityId),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// User notification preferences
export const userNotificationPreferences = sqliteTable(
  'user_notification_preferences',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    // Enable/disable by type
    taskAssigned: integer('task_assigned', { mode: 'boolean' }).notNull().default(true),
    taskCompleted: integer('task_completed', { mode: 'boolean' }).notNull().default(true),
    taskUpdated: integer('task_updated', { mode: 'boolean' }).notNull().default(true),
    taskDueSoon: integer('task_due_soon', { mode: 'boolean' }).notNull().default(true),
    taskOverdue: integer('task_overdue', { mode: 'boolean' }).notNull().default(true),
    projectUpdates: integer('project_updates', { mode: 'boolean' }).notNull().default(true),
    leadUpdates: integer('lead_updates', { mode: 'boolean' }).notNull().default(true),
    mentions: integer('mentions', { mode: 'boolean' }).notNull().default(true),
    comments: integer('comments', { mode: 'boolean' }).notNull().default(true),
    slaAlerts: integer('sla_alerts', { mode: 'boolean' }).notNull().default(true),
    approvalRequests: integer('approval_requests', { mode: 'boolean' }).notNull().default(true),
    systemAlerts: integer('system_alerts', { mode: 'boolean' }).notNull().default(true),
    // Delivery preferences
    inAppEnabled: integer('in_app_enabled', { mode: 'boolean' }).notNull().default(true),
    emailEnabled: integer('email_enabled', { mode: 'boolean' }).notNull().default(true),
    emailDigest: text('email_digest', { enum: ['instant', 'hourly', 'daily', 'weekly', 'off'] })
      .notNull()
      .default('instant'),
    // Quiet hours (JSON: { start: "22:00", end: "08:00", timezone: "UTC" })
    quietHours: text('quiet_hours'), // JSON
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    userUnique: uniqueIndex('user_notification_prefs_user_unique').on(table.userId),
  })
);

export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;

// ==================== SYSTEM SETTINGS ====================

// System Settings (Global configuration for admin control)
export type SettingCategory = 'automation' | 'notifications' | 'workflows' | 'integrations' | 'general';

export const systemSettings = sqliteTable(
  'system_settings',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    value: text('value'), // JSON or simple value
    category: text('category', { 
      enum: ['automation', 'notifications', 'workflows', 'integrations', 'general'] 
    }).notNull().default('general'),
    label: text('label').notNull(),
    description: text('description'),
    type: text('type', { 
      enum: ['boolean', 'string', 'number', 'json', 'select'] 
    }).notNull().default('string'),
    options: text('options'), // JSON array for select type
    isAdvanced: integer('is_advanced', { mode: 'boolean' }).notNull().default(false),
    updatedByUserId: text('updated_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    keyUnique: uniqueIndex('system_settings_key_unique').on(table.key),
    categoryIdx: index('system_settings_category_idx').on(table.category),
  })
);

// Automation Rules (Stored configuration for custom automation rules)
export const automationRulesConfig = sqliteTable(
  'automation_rules_config',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
    trigger: text('trigger').notNull(), // step.entered, step.completed, etc.
    triggerStepKeys: text('trigger_step_keys'), // JSON array
    triggerLanes: text('trigger_lanes'), // JSON array
    conditions: text('conditions'), // JSON array
    action: text('action').notNull(), // send_email, create_task, etc.
    actionConfig: text('action_config').notNull(), // JSON
    priority: integer('priority').default(10),
    isSystem: integer('is_system', { mode: 'boolean' }).notNull().default(false), // Built-in vs custom
    createdByUserId: text('created_by_user_id').references(() => users.id),
    updatedByUserId: text('updated_by_user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    enabledIdx: index('automation_rules_enabled_idx').on(table.enabled),
    triggerIdx: index('automation_rules_trigger_idx').on(table.trigger),
  })
);
