CREATE TABLE `api_endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`description` text,
	`request_body_schema` text,
	`response_schema` text,
	`auth_required` integer DEFAULT true NOT NULL,
	`role_required` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`implemented_at` integer,
	`notes` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `api_endpoints_project_idx` ON `api_endpoints` (`project_id`);--> statement-breakpoint
CREATE INDEX `api_endpoints_path_idx` ON `api_endpoints` (`path`);--> statement-breakpoint
ALTER TABLE `leads` ADD `nda_status` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `nda_url` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `nda_sent_at` integer;--> statement-breakpoint
ALTER TABLE `leads` ADD `nda_signed_at` integer;--> statement-breakpoint
ALTER TABLE `leads` ADD `nda_expires_at` integer;--> statement-breakpoint
ALTER TABLE `tasks` ADD `sprint_number` integer;--> statement-breakpoint
CREATE INDEX `tasks_sprint_idx` ON `tasks` (`sprint_number`);