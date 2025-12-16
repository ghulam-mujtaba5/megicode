CREATE TABLE `business_process_automations` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text NOT NULL,
	`step_key` text NOT NULL,
	`automation_action` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`result_data` text,
	`error_message` text,
	`retry_count` integer DEFAULT 0,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bp_automations_instance_idx` ON `business_process_automations` (`process_instance_id`);--> statement-breakpoint
CREATE INDEX `bp_automations_status_idx` ON `business_process_automations` (`status`);--> statement-breakpoint
CREATE INDEX `bp_automations_action_idx` ON `business_process_automations` (`automation_action`);--> statement-breakpoint
CREATE TABLE `business_process_data` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text NOT NULL,
	`data_key` text NOT NULL,
	`data_value` text,
	`data_type` text DEFAULT 'string',
	`updated_at` integer NOT NULL,
	`updated_by_user_id` text,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bp_data_instance_idx` ON `business_process_data` (`process_instance_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bp_data_instance_key_unique` ON `business_process_data` (`process_instance_id`,`data_key`);--> statement-breakpoint
CREATE TABLE `business_process_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text NOT NULL,
	`message_key` text NOT NULL,
	`from_step_key` text NOT NULL,
	`to_step_key` text NOT NULL,
	`label` text,
	`payload` text,
	`sent_at` integer NOT NULL,
	`received_at` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bp_messages_instance_idx` ON `business_process_messages` (`process_instance_id`);--> statement-breakpoint
CREATE INDEX `bp_messages_status_idx` ON `business_process_messages` (`status`);--> statement-breakpoint
CREATE TABLE `business_process_slas` (
	`id` text PRIMARY KEY NOT NULL,
	`process_definition_id` text NOT NULL,
	`step_key` text NOT NULL,
	`max_duration_minutes` integer,
	`warning_threshold_minutes` integer,
	`escalation_user_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`process_definition_id`) REFERENCES `process_definitions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`escalation_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bp_slas_def_idx` ON `business_process_slas` (`process_definition_id`);--> statement-breakpoint
CREATE INDEX `bp_slas_step_idx` ON `business_process_slas` (`step_key`);--> statement-breakpoint
CREATE TABLE `business_process_step_instances` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text NOT NULL,
	`step_key` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`assigned_to_user_id` text,
	`completed_by_user_id` text,
	`notes` text,
	`output_data` text,
	`gateway_decision` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`completed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bp_step_instances_process_idx` ON `business_process_step_instances` (`process_instance_id`);--> statement-breakpoint
CREATE INDEX `bp_step_instances_status_idx` ON `business_process_step_instances` (`status`);--> statement-breakpoint
CREATE INDEX `bp_step_instances_step_key_idx` ON `business_process_step_instances` (`step_key`);--> statement-breakpoint
CREATE INDEX `bp_step_instances_assigned_idx` ON `business_process_step_instances` (`assigned_to_user_id`);--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`body_html` text NOT NULL,
	`body_text` text,
	`variables` text,
	`category` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_templates_key_unique` ON `email_templates` (`key`);--> statement-breakpoint
CREATE INDEX `email_templates_key_idx` ON `email_templates` (`key`);--> statement-breakpoint
CREATE INDEX `email_templates_category_idx` ON `email_templates` (`category`);--> statement-breakpoint
CREATE INDEX `email_templates_active_idx` ON `email_templates` (`is_active`);--> statement-breakpoint
CREATE TABLE `lead_scoring_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`field` text NOT NULL,
	`condition` text NOT NULL,
	`value` text,
	`score_adjustment` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lead_scoring_rules_active_idx` ON `lead_scoring_rules` (`is_active`);--> statement-breakpoint
CREATE INDEX `lead_scoring_rules_field_idx` ON `lead_scoring_rules` (`field`);--> statement-breakpoint
CREATE TABLE `onboarding_checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text,
	`project_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`items` text NOT NULL,
	`completed_count` integer DEFAULT 0 NOT NULL,
	`total_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`assigned_to_user_id` text,
	`due_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `onboarding_checklists_instance_idx` ON `onboarding_checklists` (`process_instance_id`);--> statement-breakpoint
CREATE INDEX `onboarding_checklists_project_idx` ON `onboarding_checklists` (`project_id`);--> statement-breakpoint
CREATE INDEX `onboarding_checklists_status_idx` ON `onboarding_checklists` (`status`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `job_title`;