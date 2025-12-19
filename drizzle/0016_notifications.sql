-- Migration: Add notifications and user notification preferences tables

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `type` text NOT NULL,
  `title` text NOT NULL,
  `message` text,
  `priority` text DEFAULT 'normal' NOT NULL,
  `entity_type` text,
  `entity_id` text,
  `link` text,
  `actor_user_id` text,
  `is_read` integer DEFAULT false NOT NULL,
  `read_at` integer,
  `is_dismissed` integer DEFAULT false NOT NULL,
  `dismissed_at` integer,
  `expires_at` integer,
  `actions` text,
  `metadata` text,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE NO ACTION ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS `notifications_user_idx` ON `notifications` (`user_id`);
CREATE INDEX IF NOT EXISTS `notifications_user_read_idx` ON `notifications` (`user_id`, `is_read`);
CREATE INDEX IF NOT EXISTS `notifications_type_idx` ON `notifications` (`type`);
CREATE INDEX IF NOT EXISTS `notifications_created_idx` ON `notifications` (`created_at`);
CREATE INDEX IF NOT EXISTS `notifications_entity_idx` ON `notifications` (`entity_type`, `entity_id`);

CREATE TABLE IF NOT EXISTS `user_notification_preferences` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `task_assigned` integer DEFAULT true NOT NULL,
  `task_completed` integer DEFAULT true NOT NULL,
  `task_updated` integer DEFAULT true NOT NULL,
  `task_due_soon` integer DEFAULT true NOT NULL,
  `task_overdue` integer DEFAULT true NOT NULL,
  `project_updates` integer DEFAULT true NOT NULL,
  `lead_updates` integer DEFAULT true NOT NULL,
  `mentions` integer DEFAULT true NOT NULL,
  `comments` integer DEFAULT true NOT NULL,
  `sla_alerts` integer DEFAULT true NOT NULL,
  `approval_requests` integer DEFAULT true NOT NULL,
  `system_alerts` integer DEFAULT true NOT NULL,
  `in_app_enabled` integer DEFAULT true NOT NULL,
  `email_enabled` integer DEFAULT true NOT NULL,
  `email_digest` text DEFAULT 'instant' NOT NULL,
  `quiet_hours` text,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS `user_notification_prefs_user_unique` ON `user_notification_preferences` (`user_id`);
