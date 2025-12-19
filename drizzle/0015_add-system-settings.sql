CREATE TABLE `automation_rules_config` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`enabled` integer DEFAULT true NOT NULL,
	`trigger` text NOT NULL,
	`trigger_step_keys` text,
	`trigger_lanes` text,
	`conditions` text,
	`action` text NOT NULL,
	`action_config` text NOT NULL,
	`priority` integer DEFAULT 10,
	`is_system` integer DEFAULT false NOT NULL,
	`created_by_user_id` text,
	`updated_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `automation_rules_enabled_idx` ON `automation_rules_config` (`enabled`);--> statement-breakpoint
CREATE INDEX `automation_rules_trigger_idx` ON `automation_rules_config` (`trigger`);--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`category` text DEFAULT 'general' NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'string' NOT NULL,
	`options` text,
	`is_advanced` integer DEFAULT false NOT NULL,
	`updated_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `system_settings_key_unique` ON `system_settings` (`key`);--> statement-breakpoint
CREATE INDEX `system_settings_category_idx` ON `system_settings` (`category`);