CREATE TABLE `user_availability` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`reason` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_availability_user_idx` ON `user_availability` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_availability_date_idx` ON `user_availability` (`start_date`,`end_date`);--> statement-breakpoint
ALTER TABLE `milestones` ADD `status` text DEFAULT 'pending' NOT NULL;