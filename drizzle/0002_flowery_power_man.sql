CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text,
	`size_bytes` integer,
	`uploaded_by_user_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attachments_entity_idx` ON `attachments` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `bugs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`task_id` text,
	`title` text NOT NULL,
	`description` text,
	`steps_to_reproduce` text,
	`environment` text,
	`severity` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`reported_by_user_id` text,
	`assigned_to_user_id` text,
	`resolved_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bugs_project_idx` ON `bugs` (`project_id`);--> statement-breakpoint
CREATE INDEX `bugs_status_idx` ON `bugs` (`status`);--> statement-breakpoint
CREATE TABLE `client_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`role` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`preferred_channel` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `client_contacts_client_idx` ON `client_contacts` (`client_id`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`website` text,
	`industry` text,
	`timezone` text,
	`billing_email` text,
	`billing_address` text,
	`notes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clients_status_idx` ON `clients` (`status`);--> statement-breakpoint
CREATE TABLE `email_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`client_id` text,
	`to_email` text NOT NULL,
	`subject` text NOT NULL,
	`template_key` text,
	`status` text NOT NULL,
	`sent_by_user_id` text,
	`sent_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `email_logs_lead_idx` ON `email_logs` (`lead_id`);--> statement-breakpoint
CREATE INDEX `email_logs_project_idx` ON `email_logs` (`project_id`);--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`config` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `invoice_items_invoice_idx` ON `invoice_items` (`invoice_id`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`project_id` text,
	`client_id` text,
	`proposal_id` text,
	`title` text NOT NULL,
	`total_amount` integer NOT NULL,
	`paid_amount` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`due_at` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`sent_at` integer,
	`paid_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `invoices_project_idx` ON `invoices` (`project_id`);--> statement-breakpoint
CREATE INDEX `invoices_client_idx` ON `invoices` (`client_id`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE TABLE `lead_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lead_notes_lead_idx` ON `lead_notes` (`lead_id`);--> statement-breakpoint
CREATE TABLE `lead_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`tag` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lead_tags_lead_idx` ON `lead_tags` (`lead_id`);--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`lead_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`scheduled_at` integer NOT NULL,
	`duration_minutes` integer,
	`meeting_link` text,
	`agenda` text,
	`notes` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `meetings_project_idx` ON `meetings` (`project_id`);--> statement-breakpoint
CREATE INDEX `meetings_scheduled_idx` ON `meetings` (`scheduled_at`);--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`due_at` integer,
	`completed_at` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `milestones_project_idx` ON `milestones` (`project_id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`amount` integer NOT NULL,
	`method` text,
	`reference` text,
	`paid_at` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payments_invoice_idx` ON `payments` (`invoice_id`);--> statement-breakpoint
CREATE TABLE `project_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `project_notes_project_idx` ON `project_notes` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_risks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`severity` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`owner_user_id` text,
	`mitigation_plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `project_risks_project_idx` ON `project_risks` (`project_id`);--> statement-breakpoint
CREATE TABLE `proposal_items` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	`discount` integer DEFAULT 0,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `proposal_items_proposal_idx` ON `proposal_items` (`proposal_id`);--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`summary` text,
	`scope` text,
	`deliverables` text,
	`timeline` text,
	`cost_model` text DEFAULT 'fixed' NOT NULL,
	`total_amount` integer,
	`currency` text DEFAULT 'USD' NOT NULL,
	`valid_until` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by_user_id` text,
	`approved_by_user_id` text,
	`sent_at` integer,
	`accepted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `proposals_lead_idx` ON `proposals` (`lead_id`);--> statement-breakpoint
CREATE INDEX `proposals_client_idx` ON `proposals` (`client_id`);--> statement-breakpoint
CREATE INDEX `proposals_status_idx` ON `proposals` (`status`);--> statement-breakpoint
CREATE TABLE `task_checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `task_checklists_task_idx` ON `task_checklists` (`task_id`);--> statement-breakpoint
CREATE TABLE `task_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`author_user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `task_comments_task_idx` ON `task_comments` (`task_id`);--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`description` text,
	`minutes` integer NOT NULL,
	`date` integer NOT NULL,
	`billable` integer DEFAULT true NOT NULL,
	`invoice_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `time_entries_project_idx` ON `time_entries` (`project_id`);--> statement-breakpoint
CREATE INDEX `time_entries_user_idx` ON `time_entries` (`user_id`);--> statement-breakpoint
CREATE INDEX `time_entries_task_idx` ON `time_entries` (`task_id`);--> statement-breakpoint
CREATE TABLE `webhook_deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`integration_id` text NOT NULL,
	`event_type` text NOT NULL,
	`payload` text NOT NULL,
	`response_status` integer,
	`response_body` text,
	`delivered_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `webhook_deliveries_integration_idx` ON `webhook_deliveries` (`integration_id`);