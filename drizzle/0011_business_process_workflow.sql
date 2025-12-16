-- Business Process Workflow Enhancement Migration
-- Adds comprehensive tables for the BPMN-based client onboarding workflow

-- Business Process Step Instances (tracks individual step execution)
CREATE TABLE IF NOT EXISTS business_process_step_instances (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT NOT NULL REFERENCES process_instances(id),
  step_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'skipped', 'failed')),
  started_at INTEGER,
  completed_at INTEGER,
  assigned_to_user_id TEXT REFERENCES users(id),
  completed_by_user_id TEXT REFERENCES users(id),
  notes TEXT,
  output_data TEXT, -- JSON data from step execution
  gateway_decision TEXT, -- For gateway steps, which path was taken
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS bp_step_instances_process_idx ON business_process_step_instances(process_instance_id);
CREATE INDEX IF NOT EXISTS bp_step_instances_status_idx ON business_process_step_instances(status);
CREATE INDEX IF NOT EXISTS bp_step_instances_step_key_idx ON business_process_step_instances(step_key);
CREATE INDEX IF NOT EXISTS bp_step_instances_assigned_idx ON business_process_step_instances(assigned_to_user_id);

-- Business Process Data Context (stores process-level data)
CREATE TABLE IF NOT EXISTS business_process_data (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT NOT NULL REFERENCES process_instances(id),
  data_key TEXT NOT NULL,
  data_value TEXT,
  data_type TEXT DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'date', 'json')),
  updated_at INTEGER NOT NULL,
  updated_by_user_id TEXT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS bp_data_instance_idx ON business_process_data(process_instance_id);
CREATE UNIQUE INDEX IF NOT EXISTS bp_data_instance_key_unique ON business_process_data(process_instance_id, data_key);

-- Business Process Messages (tracks inter-lane communication)
CREATE TABLE IF NOT EXISTS business_process_messages (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT NOT NULL REFERENCES process_instances(id),
  message_key TEXT NOT NULL,
  from_step_key TEXT NOT NULL,
  to_step_key TEXT NOT NULL,
  label TEXT,
  payload TEXT, -- JSON data transferred
  sent_at INTEGER NOT NULL,
  received_at INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'received', 'failed'))
);

CREATE INDEX IF NOT EXISTS bp_messages_instance_idx ON business_process_messages(process_instance_id);
CREATE INDEX IF NOT EXISTS bp_messages_status_idx ON business_process_messages(status);

-- Business Process Automation Log (tracks automation execution)
CREATE TABLE IF NOT EXISTS business_process_automations (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT NOT NULL REFERENCES process_instances(id),
  step_key TEXT NOT NULL,
  automation_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  result_data TEXT, -- JSON result from automation
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS bp_automations_instance_idx ON business_process_automations(process_instance_id);
CREATE INDEX IF NOT EXISTS bp_automations_status_idx ON business_process_automations(status);
CREATE INDEX IF NOT EXISTS bp_automations_action_idx ON business_process_automations(automation_action);

-- Enhance process_instances table with additional columns
-- Add lead_id column to link process instances to leads
ALTER TABLE process_instances ADD COLUMN lead_id TEXT REFERENCES leads(id);
ALTER TABLE process_instances ADD COLUMN proposal_id TEXT REFERENCES proposals(id);
ALTER TABLE process_instances ADD COLUMN client_id TEXT REFERENCES clients(id);
ALTER TABLE process_instances ADD COLUMN current_lane TEXT;
ALTER TABLE process_instances ADD COLUMN created_by_user_id TEXT REFERENCES users(id);
ALTER TABLE process_instances ADD COLUMN canceled_at INTEGER;
ALTER TABLE process_instances ADD COLUMN canceled_reason TEXT;
ALTER TABLE process_instances ADD COLUMN process_data TEXT; -- JSON blob for quick access

CREATE INDEX IF NOT EXISTS process_instances_lead_idx ON process_instances(lead_id);
CREATE INDEX IF NOT EXISTS process_instances_proposal_idx ON process_instances(proposal_id);
CREATE INDEX IF NOT EXISTS process_instances_client_idx ON process_instances(client_id);
CREATE INDEX IF NOT EXISTS process_instances_lane_idx ON process_instances(current_lane);

-- Business Process Templates (for custom process definitions beyond default)
CREATE TABLE IF NOT EXISTS business_process_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'onboarding', 'support', 'maintenance', etc.
  json TEXT NOT NULL, -- Full process definition JSON
  is_active INTEGER NOT NULL DEFAULT 1,
  version INTEGER NOT NULL DEFAULT 1,
  created_by_user_id TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS bp_templates_category_idx ON business_process_templates(category);
CREATE INDEX IF NOT EXISTS bp_templates_active_idx ON business_process_templates(is_active);

-- Business Process SLA Definitions
CREATE TABLE IF NOT EXISTS business_process_slas (
  id TEXT PRIMARY KEY,
  process_definition_id TEXT NOT NULL REFERENCES process_definitions(id),
  step_key TEXT NOT NULL,
  max_duration_minutes INTEGER, -- Maximum time allowed for step
  warning_threshold_minutes INTEGER, -- Time after which warning is triggered
  escalation_user_id TEXT REFERENCES users(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS bp_slas_def_idx ON business_process_slas(process_definition_id);
CREATE INDEX IF NOT EXISTS bp_slas_step_idx ON business_process_slas(step_key);

-- Business Process SLA Breaches
CREATE TABLE IF NOT EXISTS business_process_sla_breaches (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT NOT NULL REFERENCES process_instances(id),
  step_key TEXT NOT NULL,
  sla_id TEXT NOT NULL REFERENCES business_process_slas(id),
  breach_type TEXT NOT NULL CHECK (breach_type IN ('warning', 'breach')),
  breached_at INTEGER NOT NULL,
  resolved_at INTEGER,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS bp_sla_breaches_instance_idx ON business_process_sla_breaches(process_instance_id);
CREATE INDEX IF NOT EXISTS bp_sla_breaches_sla_idx ON business_process_sla_breaches(sla_id);

-- Lead Scoring Rules (for automation)
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  field TEXT NOT NULL, -- The lead field to check
  condition TEXT NOT NULL, -- 'equals', 'contains', 'not_empty', 'greater_than', etc.
  value TEXT, -- The value to compare against
  score_adjustment INTEGER NOT NULL, -- Points to add (can be negative)
  is_active INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 0, -- Order of rule evaluation
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS lead_scoring_rules_active_idx ON lead_scoring_rules(is_active);
CREATE INDEX IF NOT EXISTS lead_scoring_rules_field_idx ON lead_scoring_rules(field);

-- Email Templates for automation
CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE, -- 'followup_initial', 'welcome', 'proposal_sent', etc.
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables TEXT, -- JSON array of variable placeholders
  category TEXT, -- 'lead', 'onboarding', 'project', etc.
  is_active INTEGER NOT NULL DEFAULT 1,
  created_by_user_id TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS email_templates_key_idx ON email_templates(key);
CREATE INDEX IF NOT EXISTS email_templates_category_idx ON email_templates(category);
CREATE INDEX IF NOT EXISTS email_templates_active_idx ON email_templates(is_active);

-- Onboarding Checklists (tied to process)
CREATE TABLE IF NOT EXISTS onboarding_checklists (
  id TEXT PRIMARY KEY,
  process_instance_id TEXT REFERENCES process_instances(id),
  project_id TEXT REFERENCES projects(id),
  client_id TEXT REFERENCES clients(id),
  title TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array of checklist items
  completed_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_to_user_id TEXT REFERENCES users(id),
  due_at INTEGER,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS onboarding_checklists_instance_idx ON onboarding_checklists(process_instance_id);
CREATE INDEX IF NOT EXISTS onboarding_checklists_project_idx ON onboarding_checklists(project_id);
CREATE INDEX IF NOT EXISTS onboarding_checklists_status_idx ON onboarding_checklists(status);
