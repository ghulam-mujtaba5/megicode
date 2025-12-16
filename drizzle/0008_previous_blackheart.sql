CREATE TABLE `accessibility_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`wcag_level` text DEFAULT 'AA' NOT NULL,
	`criterion` text NOT NULL,
	`criterion_title` text,
	`severity` text DEFAULT 'moderate' NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text,
	`affected_users` text,
	`recommendation` text,
	`status` text DEFAULT 'open' NOT NULL,
	`resolved_at` integer,
	`audited_by_user_id` text,
	`audited_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`audited_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `accessibility_audits_project_idx` ON `accessibility_audits` (`project_id`);--> statement-breakpoint
CREATE INDEX `accessibility_audits_status_idx` ON `accessibility_audits` (`status`);--> statement-breakpoint
CREATE INDEX `accessibility_audits_level_idx` ON `accessibility_audits` (`wcag_level`);--> statement-breakpoint
CREATE TABLE `mobile_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`category` text NOT NULL,
	`check_item` text NOT NULL,
	`description` text,
	`breakpoint` text,
	`status` text DEFAULT 'not_tested' NOT NULL,
	`notes` text,
	`tested_on_device` text,
	`screenshot_url` text,
	`tested_by_user_id` text,
	`tested_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tested_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `mobile_checks_project_idx` ON `mobile_checks` (`project_id`);--> statement-breakpoint
CREATE INDEX `mobile_checks_status_idx` ON `mobile_checks` (`status`);