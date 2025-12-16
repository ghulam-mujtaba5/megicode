CREATE TABLE `case_studies` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`challenge` text,
	`solution` text,
	`results` text,
	`testimonial` text,
	`testimonial_author` text,
	`technologies` text,
	`industry_tags` text,
	`duration` text,
	`team_size` integer,
	`image_urls` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `case_studies_project_idx` ON `case_studies` (`project_id`);--> statement-breakpoint
CREATE INDEX `case_studies_status_idx` ON `case_studies` (`status`);--> statement-breakpoint
CREATE TABLE `process_suggestions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`submitted_by_user_id` text,
	`reviewed_by_user_id` text,
	`review_notes` text,
	`implemented_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `process_suggestions_status_idx` ON `process_suggestions` (`status`);--> statement-breakpoint
CREATE INDEX `process_suggestions_submitter_idx` ON `process_suggestions` (`submitted_by_user_id`);--> statement-breakpoint
ALTER TABLE `projects` ADD `contract_renewal_at` integer;--> statement-breakpoint
ALTER TABLE `projects` ADD `maintenance_contract_active` integer;