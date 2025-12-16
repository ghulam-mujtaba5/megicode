CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`instance_id` text,
	`type` text NOT NULL,
	`actor_user_id` text,
	`payload_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_lead_idx` ON `events` (`lead_id`);--> statement-breakpoint
CREATE INDEX `events_project_idx` ON `events` (`project_id`);--> statement-breakpoint
CREATE INDEX `events_instance_idx` ON `events` (`instance_id`);--> statement-breakpoint
CREATE INDEX `events_created_idx` ON `events` (`created_at`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`company` text,
	`phone` text,
	`service` text,
	`message` text,
	`source` text DEFAULT 'internal_manual' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `process_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`version` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `process_def_key_version_unique` ON `process_definitions` (`key`,`version`);--> statement-breakpoint
CREATE INDEX `process_def_key_idx` ON `process_definitions` (`key`);--> statement-breakpoint
CREATE INDEX `process_def_active_idx` ON `process_definitions` (`is_active`);--> statement-breakpoint
CREATE TABLE `process_instances` (
	`id` text PRIMARY KEY NOT NULL,
	`process_definition_id` text NOT NULL,
	`project_id` text NOT NULL,
	`status` text DEFAULT 'running' NOT NULL,
	`current_step_key` text,
	`started_at` integer NOT NULL,
	`ended_at` integer
);
--> statement-breakpoint
CREATE INDEX `process_instances_project_idx` ON `process_instances` (`project_id`);--> statement-breakpoint
CREATE INDEX `process_instances_def_idx` ON `process_instances` (`process_definition_id`);--> statement-breakpoint
CREATE INDEX `process_instances_status_idx` ON `process_instances` (`status`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`name` text NOT NULL,
	`owner_user_id` text,
	`status` text DEFAULT 'new' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`start_at` integer,
	`due_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `projects_owner_idx` ON `projects` (`owner_user_id`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`instance_id` text NOT NULL,
	`key` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`assigned_to_user_id` text,
	`due_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tasks_instance_idx` ON `tasks` (`instance_id`);--> statement-breakpoint
CREATE INDEX `tasks_assigned_idx` ON `tasks` (`assigned_to_user_id`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`status`);