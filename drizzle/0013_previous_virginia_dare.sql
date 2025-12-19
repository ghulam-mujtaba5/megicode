CREATE TABLE `accessibility_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`url` text NOT NULL,
	`standard` text DEFAULT 'WCAG_2_1' NOT NULL,
	`level` text DEFAULT 'AA' NOT NULL,
	`issues_found` integer,
	`critical_issues` integer,
	`pass_rate` integer,
	`report` text,
	`audited_by_user_id` text,
	`audited_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`audited_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `accessibility_audits_project_idx` ON `accessibility_audits` (`project_id`);--> statement-breakpoint
CREATE TABLE `api_endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`description` text,
	`request_schema` text,
	`response_schema` text,
	`authentication` text,
	`rate_limit` text,
	`version` text,
	`is_deprecated` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `api_endpoints_project_idx` ON `api_endpoints` (`project_id`);--> statement-breakpoint
CREATE TABLE `case_studies` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`summary` text,
	`challenge` text,
	`solution` text,
	`results` text,
	`testimonial` text,
	`testimonial_author` text,
	`is_published` integer DEFAULT false,
	`published_at` integer,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `case_studies_project_idx` ON `case_studies` (`project_id`);--> statement-breakpoint
CREATE INDEX `case_studies_client_idx` ON `case_studies` (`client_id`);--> statement-breakpoint
CREATE TABLE `client_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`role` text,
	`is_primary` integer DEFAULT false,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `client_contacts_client_idx` ON `client_contacts` (`client_id`);--> statement-breakpoint
CREATE TABLE `environment_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`description` text,
	`credentials` text,
	`last_deployed_at` integer,
	`last_deployed_by_user_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`last_deployed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `environment_configs_project_idx` ON `environment_configs` (`project_id`);--> statement-breakpoint
CREATE TABLE `estimations` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`description` text,
	`estimated_hours` integer,
	`estimated_cost` integer,
	`complexity` text,
	`assumptions` text,
	`created_by_user_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `estimations_lead_idx` ON `estimations` (`lead_id`);--> statement-breakpoint
CREATE INDEX `estimations_project_idx` ON `estimations` (`project_id`);--> statement-breakpoint
CREATE TABLE `feasibility_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`category` text NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`score` integer,
	`notes` text,
	`assessed_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assessed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `feasibility_checks_lead_idx` ON `feasibility_checks` (`lead_id`);--> statement-breakpoint
CREATE TABLE `feedback_items` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`client_id` text,
	`category` text DEFAULT 'general' NOT NULL,
	`content` text NOT NULL,
	`priority` text,
	`status` text DEFAULT 'new' NOT NULL,
	`submitted_by_name` text,
	`submitted_by_email` text,
	`reviewed_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `feedback_items_project_idx` ON `feedback_items` (`project_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_client_idx` ON `feedback_items` (`client_id`);--> statement-breakpoint
CREATE INDEX `feedback_items_status_idx` ON `feedback_items` (`status`);--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`config` text,
	`status` text DEFAULT 'active' NOT NULL,
	`last_sync_at` integer,
	`error_message` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `integrations_type_idx` ON `integrations` (`type`);--> statement-breakpoint
CREATE INDEX `integrations_status_idx` ON `integrations` (`status`);--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	`amount` integer NOT NULL,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `invoice_items_invoice_idx` ON `invoice_items` (`invoice_id`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`client_id` text,
	`invoice_number` text NOT NULL,
	`title` text,
	`subtotal` integer NOT NULL,
	`tax_amount` integer DEFAULT 0,
	`total_amount` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`issued_at` integer,
	`due_at` integer,
	`paid_at` integer,
	`notes` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `invoices_project_idx` ON `invoices` (`project_id`);--> statement-breakpoint
CREATE INDEX `invoices_client_idx` ON `invoices` (`client_id`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE TABLE `lead_scoring_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`condition` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lead_scoring_rules_category_idx` ON `lead_scoring_rules` (`category`);--> statement-breakpoint
CREATE TABLE `lead_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`tag` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `lead_tags_lead_idx` ON `lead_tags` (`lead_id`);--> statement-breakpoint
CREATE TABLE `meeting_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`lead_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`agenda` text,
	`notes` text,
	`action_items` text,
	`attendees` text,
	`meeting_date` integer,
	`duration` integer,
	`recorded_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `meeting_notes_project_idx` ON `meeting_notes` (`project_id`);--> statement-breakpoint
CREATE INDEX `meeting_notes_lead_idx` ON `meeting_notes` (`lead_id`);--> statement-breakpoint
CREATE INDEX `meeting_notes_client_idx` ON `meeting_notes` (`client_id`);--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`lead_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`description` text,
	`meeting_type` text,
	`location` text,
	`meeting_url` text,
	`start_at` integer NOT NULL,
	`end_at` integer,
	`attendees` text,
	`organizer_user_id` text,
	`calendar_event_id` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organizer_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `meetings_project_idx` ON `meetings` (`project_id`);--> statement-breakpoint
CREATE INDEX `meetings_lead_idx` ON `meetings` (`lead_id`);--> statement-breakpoint
CREATE INDEX `meetings_client_idx` ON `meetings` (`client_id`);--> statement-breakpoint
CREATE INDEX `meetings_start_idx` ON `meetings` (`start_at`);--> statement-breakpoint
CREATE TABLE `mobile_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`device` text NOT NULL,
	`platform` text NOT NULL,
	`os_version` text,
	`browser_or_app` text,
	`screen_size` text,
	`status` text NOT NULL,
	`notes` text,
	`issues` text,
	`checked_by_user_id` text,
	`checked_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checked_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `mobile_checks_project_idx` ON `mobile_checks` (`project_id`);--> statement-breakpoint
CREATE TABLE `nps_surveys` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`client_id` text,
	`score` integer NOT NULL,
	`feedback` text,
	`respondent_name` text,
	`respondent_email` text,
	`sent_at` integer,
	`responded_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `nps_surveys_project_idx` ON `nps_surveys` (`project_id`);--> statement-breakpoint
CREATE INDEX `nps_surveys_client_idx` ON `nps_surveys` (`client_id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text,
	`project_id` text,
	`client_id` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`method` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`reference` text,
	`notes` text,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `payments_invoice_idx` ON `payments` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `payments_project_idx` ON `payments` (`project_id`);--> statement-breakpoint
CREATE INDEX `payments_client_idx` ON `payments` (`client_id`);--> statement-breakpoint
CREATE TABLE `process_suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`process_instance_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`description` text,
	`category` text DEFAULT 'other' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`impact` text,
	`review_notes` text,
	`submitted_by_user_id` text,
	`reviewed_by_user_id` text,
	`implemented_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`process_instance_id`) REFERENCES `process_instances`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `process_suggestions_instance_idx` ON `process_suggestions` (`process_instance_id`);--> statement-breakpoint
CREATE INDEX `process_suggestions_project_idx` ON `process_suggestions` (`project_id`);--> statement-breakpoint
CREATE INDEX `process_suggestions_status_idx` ON `process_suggestions` (`status`);--> statement-breakpoint
CREATE TABLE `qa_signoffs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`milestone_id` text,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`signed_by_user_id` text,
	`signed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`signed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `qa_signoffs_project_idx` ON `qa_signoffs` (`project_id`);--> statement-breakpoint
CREATE INDEX `qa_signoffs_status_idx` ON `qa_signoffs` (`status`);--> statement-breakpoint
CREATE TABLE `retrospectives` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`sprint_number` integer,
	`title` text NOT NULL,
	`went_well` text,
	`improvements` text,
	`action_items` text,
	`conducted_by_user_id` text,
	`conducted_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`conducted_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `retrospectives_project_idx` ON `retrospectives` (`project_id`);--> statement-breakpoint
CREATE TABLE `risk_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`description` text,
	`category` text,
	`likelihood` text,
	`impact` text,
	`mitigation_strategy` text,
	`status` text DEFAULT 'open' NOT NULL,
	`owner_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `risk_assessments_lead_idx` ON `risk_assessments` (`lead_id`);--> statement-breakpoint
CREATE INDEX `risk_assessments_project_idx` ON `risk_assessments` (`project_id`);--> statement-breakpoint
CREATE TABLE `stakeholders` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`project_id` text,
	`client_id` text,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`role` text,
	`influence` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `stakeholders_lead_idx` ON `stakeholders` (`lead_id`);--> statement-breakpoint
CREATE INDEX `stakeholders_project_idx` ON `stakeholders` (`project_id`);--> statement-breakpoint
CREATE INDEX `stakeholders_client_idx` ON `stakeholders` (`client_id`);--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`client_id` text,
	`ticket_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`category` text,
	`status` text DEFAULT 'open' NOT NULL,
	`assigned_to_user_id` text,
	`reported_by_name` text,
	`reported_by_email` text,
	`resolved_at` integer,
	`closed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `support_tickets_project_idx` ON `support_tickets` (`project_id`);--> statement-breakpoint
CREATE INDEX `support_tickets_client_idx` ON `support_tickets` (`client_id`);--> statement-breakpoint
CREATE INDEX `support_tickets_status_idx` ON `support_tickets` (`status`);--> statement-breakpoint
CREATE TABLE `task_checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0,
	`completed_at` integer,
	`completed_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`completed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `task_checklists_task_idx` ON `task_checklists` (`task_id`);--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`project_id` text,
	`user_id` text NOT NULL,
	`description` text,
	`duration_minutes` integer NOT NULL,
	`billable` integer DEFAULT true,
	`hourly_rate` integer,
	`date` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `time_entries_task_idx` ON `time_entries` (`task_id`);--> statement-breakpoint
CREATE INDEX `time_entries_project_idx` ON `time_entries` (`project_id`);--> statement-breakpoint
CREATE INDEX `time_entries_user_idx` ON `time_entries` (`user_id`);--> statement-breakpoint
CREATE INDEX `time_entries_date_idx` ON `time_entries` (`date`);--> statement-breakpoint
ALTER TABLE `leads` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `leads` ADD `target_date` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `skills` text;--> statement-breakpoint
ALTER TABLE `users` ADD `capacity` integer DEFAULT 40;