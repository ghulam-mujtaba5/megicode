CREATE TABLE `environment_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`environment` text NOT NULL,
	`key` text NOT NULL,
	`description` text,
	`is_secret` integer DEFAULT true NOT NULL,
	`has_value` integer DEFAULT false NOT NULL,
	`last_updated_by_user_id` text,
	`last_updated_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `environment_configs_project_idx` ON `environment_configs` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `environment_configs_unique` ON `environment_configs` (`project_id`,`environment`,`key`);--> statement-breakpoint
CREATE TABLE `meeting_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`meeting_type` text DEFAULT 'other' NOT NULL,
	`attendees` text,
	`notes` text,
	`action_items` text,
	`decisions_json` text,
	`follow_up_date` integer,
	`recorded_by_user_id` text,
	`meeting_date` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `meeting_notes_project_idx` ON `meeting_notes` (`project_id`);--> statement-breakpoint
CREATE INDEX `meeting_notes_date_idx` ON `meeting_notes` (`meeting_date`);--> statement-breakpoint
CREATE TABLE `project_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`tasks_json` text,
	`milestones_json` text,
	`estimated_hours` integer,
	`tech_stack_json` text,
	`checklists_json` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `project_templates_category_idx` ON `project_templates` (`category`);--> statement-breakpoint
CREATE TABLE `risk_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`probability` text NOT NULL,
	`impact` text NOT NULL,
	`risk_score` integer,
	`mitigation_plan` text,
	`contingency_plan` text,
	`status` text DEFAULT 'identified' NOT NULL,
	`owner_id` text,
	`identified_by_user_id` text,
	`closed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `risk_assessments_lead_idx` ON `risk_assessments` (`lead_id`);--> statement-breakpoint
CREATE INDEX `risk_assessments_project_idx` ON `risk_assessments` (`project_id`);--> statement-breakpoint
CREATE INDEX `risk_assessments_status_idx` ON `risk_assessments` (`status`);--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`client_id` text,
	`ticket_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`category` text NOT NULL,
	`assigned_to_user_id` text,
	`resolved_at` integer,
	`closed_at` integer,
	`first_response_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `support_tickets_project_idx` ON `support_tickets` (`project_id`);--> statement-breakpoint
CREATE INDEX `support_tickets_status_idx` ON `support_tickets` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `support_tickets_number_unique` ON `support_tickets` (`ticket_number`);