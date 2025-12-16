CREATE TABLE `change_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`impact` text,
	`estimated_hours` integer,
	`estimated_cost` integer,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_by_client_id` text,
	`approved_by_user_id` text,
	`approved_at` integer,
	`implemented_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `change_requests_project_idx` ON `change_requests` (`project_id`);--> statement-breakpoint
CREATE INDEX `change_requests_status_idx` ON `change_requests` (`status`);--> statement-breakpoint
CREATE TABLE `decision_records` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`context` text,
	`decision` text,
	`alternatives` text,
	`consequences` text,
	`status` text DEFAULT 'proposed' NOT NULL,
	`author_user_id` text,
	`decided_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `decision_records_project_idx` ON `decision_records` (`project_id`);--> statement-breakpoint
CREATE TABLE `estimations` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`total_hours` integer,
	`hourly_rate` integer,
	`complexity` text,
	`confidence` text,
	`breakdown` text,
	`assumptions` text,
	`exclusions` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `estimations_lead_idx` ON `estimations` (`lead_id`);--> statement-breakpoint
CREATE INDEX `estimations_project_idx` ON `estimations` (`project_id`);--> statement-breakpoint
CREATE TABLE `feasibility_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`technical_feasibility` text,
	`resource_availability` text,
	`timeline_realistic` integer,
	`budget_adequate` integer,
	`risk_level` text,
	`notes` text,
	`checklist` text,
	`reviewed_by_user_id` text,
	`reviewed_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feasibility_checks_lead_idx` ON `feasibility_checks` (`lead_id`);--> statement-breakpoint
CREATE TABLE `feedback_items` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`client_id` text,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text,
	`responded_at` integer,
	`resolved_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_items_project_idx` ON `feedback_items` (`project_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_status_idx` ON `feedback_items` (`status`);--> statement-breakpoint
CREATE TABLE `lessons_learned` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`category` text DEFAULT 'other' NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`impact` text DEFAULT 'medium' NOT NULL,
	`recommendation` text,
	`author_user_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lessons_learned_project_idx` ON `lessons_learned` (`project_id`);--> statement-breakpoint
CREATE INDEX `lessons_learned_category_idx` ON `lessons_learned` (`category`);--> statement-breakpoint
CREATE TABLE `maintenance_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`frequency` text NOT NULL,
	`next_due_at` integer,
	`last_completed_at` integer,
	`assigned_to_user_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `maintenance_tasks_project_idx` ON `maintenance_tasks` (`project_id`);--> statement-breakpoint
CREATE TABLE `nps_surveys` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`client_id` text,
	`score` integer NOT NULL,
	`feedback` text,
	`respondent_email` text,
	`responded_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `nps_surveys_project_idx` ON `nps_surveys` (`project_id`);--> statement-breakpoint
CREATE TABLE `performance_tests` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`test_type` text NOT NULL,
	`url` text,
	`performance_score` integer,
	`accessibility_score` integer,
	`best_practices_score` integer,
	`seo_score` integer,
	`lcp` integer,
	`fid` integer,
	`cls` integer,
	`results_json` text,
	`notes` text,
	`tested_by_user_id` text,
	`tested_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `performance_tests_project_idx` ON `performance_tests` (`project_id`);--> statement-breakpoint
CREATE TABLE `qa_signoffs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`milestone_id` text,
	`version` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`signed_by_user_id` text,
	`signed_at` integer,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `qa_signoffs_project_idx` ON `qa_signoffs` (`project_id`);--> statement-breakpoint
CREATE TABLE `retrospectives` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`start_items` text,
	`stop_items` text,
	`continue_items` text,
	`action_items` text,
	`conducted_by_user_id` text,
	`conducted_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `retrospectives_project_idx` ON `retrospectives` (`project_id`);--> statement-breakpoint
CREATE TABLE `security_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`audit_type` text NOT NULL,
	`severity` text DEFAULT 'medium' NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text,
	`recommendation` text,
	`status` text DEFAULT 'open' NOT NULL,
	`resolved_at` integer,
	`audited_by_user_id` text,
	`audited_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `security_audits_project_idx` ON `security_audits` (`project_id`);--> statement-breakpoint
CREATE INDEX `security_audits_status_idx` ON `security_audits` (`status`);--> statement-breakpoint
CREATE TABLE `stakeholders` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`name` text NOT NULL,
	`role` text,
	`email` text,
	`phone` text,
	`influence` text,
	`interest` text,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stakeholders_lead_idx` ON `stakeholders` (`lead_id`);--> statement-breakpoint
CREATE INDEX `stakeholders_project_idx` ON `stakeholders` (`project_id`);--> statement-breakpoint
CREATE TABLE `sub_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`completed_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sub_tasks_task_idx` ON `sub_tasks` (`task_id`);--> statement-breakpoint
CREATE TABLE `system_health` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`check_type` text NOT NULL,
	`status` text NOT NULL,
	`value` integer,
	`url` text,
	`notes` text,
	`checked_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `system_health_project_idx` ON `system_health` (`project_id`);--> statement-breakpoint
CREATE INDEX `system_health_checked_idx` ON `system_health` (`checked_at`);--> statement-breakpoint
ALTER TABLE `leads` ADD `srs_url` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `functional_requirements` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `non_functional_requirements` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `target_platforms` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `tech_preferences` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `integration_needs` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `estimated_hours` integer;--> statement-breakpoint
ALTER TABLE `leads` ADD `estimated_budget` integer;--> statement-breakpoint
ALTER TABLE `leads` ADD `complexity` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `competitor_notes` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `existing_system_notes` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `projects` ADD `client_id` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `description` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `wiki_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `repo_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `staging_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `production_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `tech_stack` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `architecture_diagram_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `db_schema_url` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `health_status` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `delivered_at` integer;--> statement-breakpoint
ALTER TABLE `projects` ADD `deleted_at` integer;--> statement-breakpoint
CREATE INDEX `projects_client_idx` ON `projects` (`client_id`);--> statement-breakpoint
ALTER TABLE `tasks` ADD `description` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `priority` text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `project_id` text;