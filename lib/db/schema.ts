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
