ALTER TABLE `api_endpoints` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `api_endpoints` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attachments` ALTER COLUMN "uploaded_by_user_id" TO "uploaded_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_events` ALTER COLUMN "actor_user_id" TO "actor_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bugs` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bugs` ALTER COLUMN "task_id" TO "task_id" text REFERENCES tasks(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bugs` ALTER COLUMN "reported_by_user_id" TO "reported_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bugs` ALTER COLUMN "assigned_to_user_id" TO "assigned_to_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_studies` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_studies` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `change_requests` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `change_requests` ALTER COLUMN "requested_by_client_id" TO "requested_by_client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `change_requests` ALTER COLUMN "approved_by_user_id" TO "approved_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_contacts` ALTER COLUMN "client_id" TO "client_id" text NOT NULL REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decision_records` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decision_records` ALTER COLUMN "author_user_id" TO "author_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_logs` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_logs` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_logs` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_logs` ALTER COLUMN "sent_by_user_id" TO "sent_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `environment_configs` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `environment_configs` ALTER COLUMN "last_updated_by_user_id" TO "last_updated_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estimations` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estimations` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estimations` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "instance_id" TO "instance_id" text REFERENCES process_instances(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "actor_user_id" TO "actor_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feasibility_checks` ALTER COLUMN "lead_id" TO "lead_id" text NOT NULL REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feasibility_checks` ALTER COLUMN "reviewed_by_user_id" TO "reviewed_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedback_items` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedback_items` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoice_items` ALTER COLUMN "invoice_id" TO "invoice_id" text NOT NULL REFERENCES invoices(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ALTER COLUMN "proposal_id" TO "proposal_id" text REFERENCES proposals(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_notes` ALTER COLUMN "lead_id" TO "lead_id" text NOT NULL REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_notes` ALTER COLUMN "author_user_id" TO "author_user_id" text NOT NULL REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_tags` ALTER COLUMN "lead_id" TO "lead_id" text NOT NULL REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons_learned` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons_learned` ALTER COLUMN "author_user_id" TO "author_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenance_tasks` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenance_tasks` ALTER COLUMN "assigned_to_user_id" TO "assigned_to_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meeting_notes` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meeting_notes` ALTER COLUMN "recorded_by_user_id" TO "recorded_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milestones` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nps_surveys` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nps_surveys` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ALTER COLUMN "invoice_id" TO "invoice_id" text NOT NULL REFERENCES invoices(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_tests` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `process_instances` ALTER COLUMN "process_definition_id" TO "process_definition_id" text NOT NULL REFERENCES process_definitions(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `process_instances` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_notes` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_notes` ALTER COLUMN "author_user_id" TO "author_user_id" text NOT NULL REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_risks` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_risks` ALTER COLUMN "owner_user_id" TO "owner_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_templates` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "owner_user_id" TO "owner_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposal_items` ALTER COLUMN "proposal_id" TO "proposal_id" text NOT NULL REFERENCES proposals(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposals` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposals` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposals` ALTER COLUMN "created_by_user_id" TO "created_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proposals` ALTER COLUMN "approved_by_user_id" TO "approved_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_signoffs` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_signoffs` ALTER COLUMN "milestone_id" TO "milestone_id" text REFERENCES milestones(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_signoffs` ALTER COLUMN "signed_by_user_id" TO "signed_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retrospectives` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retrospectives` ALTER COLUMN "conducted_by_user_id" TO "conducted_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_assessments` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_assessments` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_assessments` ALTER COLUMN "owner_id" TO "owner_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_assessments` ALTER COLUMN "identified_by_user_id" TO "identified_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_audits` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_audits` ALTER COLUMN "audited_by_user_id" TO "audited_by_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stakeholders` ALTER COLUMN "lead_id" TO "lead_id" text REFERENCES leads(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stakeholders` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_tasks` ALTER COLUMN "task_id" TO "task_id" text NOT NULL REFERENCES tasks(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ALTER COLUMN "client_id" TO "client_id" text REFERENCES clients(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ALTER COLUMN "assigned_to_user_id" TO "assigned_to_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `system_health` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_checklists` ALTER COLUMN "task_id" TO "task_id" text NOT NULL REFERENCES tasks(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_comments` ALTER COLUMN "task_id" TO "task_id" text NOT NULL REFERENCES tasks(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_comments` ALTER COLUMN "author_user_id" TO "author_user_id" text NOT NULL REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "instance_id" TO "instance_id" text NOT NULL REFERENCES process_instances(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "assigned_to_user_id" TO "assigned_to_user_id" text REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "project_id" TO "project_id" text REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ALTER COLUMN "task_id" TO "task_id" text REFERENCES tasks(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ALTER COLUMN "user_id" TO "user_id" text NOT NULL REFERENCES users(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_entries` ALTER COLUMN "invoice_id" TO "invoice_id" text REFERENCES invoices(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `webhook_deliveries` ALTER COLUMN "integration_id" TO "integration_id" text NOT NULL REFERENCES integrations(id) ON DELETE no action ON UPDATE no action;