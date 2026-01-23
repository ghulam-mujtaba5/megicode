-- Migration: Add financial management tables (Company Accounts, Expenses, Distributions, etc.)

CREATE TABLE `company_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`account_type` text NOT NULL,
	`founder_id` text,
	`bank_name` text,
	`account_number` text,
	`wallet_provider` text,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`current_balance` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`founder_id`) REFERENCES `founders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `company_accounts_type_idx` ON `company_accounts` (`account_type`);--> statement-breakpoint
CREATE INDEX `company_accounts_founder_idx` ON `company_accounts` (`founder_id`);--> statement-breakpoint
CREATE INDEX `company_accounts_status_idx` ON `company_accounts` (`status`);--> statement-breakpoint
CREATE TABLE `founder_contributions` (
	`id` text PRIMARY KEY NOT NULL,
	`founder_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`contribution_type` text NOT NULL,
	`purpose` text,
	`to_account_id` text,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`contributed_at` integer NOT NULL,
	`notes` text,
	`receipt_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`founder_id`) REFERENCES `founders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `founder_contributions_founder_idx` ON `founder_contributions` (`founder_id`);--> statement-breakpoint
CREATE INDEX `founder_contributions_type_idx` ON `founder_contributions` (`contribution_type`);--> statement-breakpoint
CREATE INDEX `founder_contributions_date_idx` ON `founder_contributions` (`contributed_at`);--> statement-breakpoint
CREATE TABLE `financial_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text NOT NULL,
	`description` text,
	`effective_from` integer NOT NULL,
	`effective_to` integer,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `financial_settings_key_idx` ON `financial_settings` (`setting_key`);--> statement-breakpoint
CREATE INDEX `financial_settings_effective_idx` ON `financial_settings` (`effective_from`);--> statement-breakpoint
CREATE TABLE `project_financials` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`total_contract_value` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`amount_received` integer DEFAULT 0 NOT NULL,
	`amount_pending` integer DEFAULT 0 NOT NULL,
	`total_expenses` integer DEFAULT 0 NOT NULL,
	`net_profit` integer DEFAULT 0 NOT NULL,
	`company_retention` integer DEFAULT 0 NOT NULL,
	`distributable_profit` integer DEFAULT 0 NOT NULL,
	`retention_percentage` integer DEFAULT 10 NOT NULL,
	`status` text DEFAULT 'expected' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_financials_project_unique` ON `project_financials` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_financials_status_idx` ON `project_financials` (`status`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`category` text NOT NULL,
	`project_id` text,
	`product_name` text,
	`paid_by_founder_id` text,
	`paid_from_account_id` text,
	`is_recurring` integer DEFAULT false NOT NULL,
	`recurring_interval` text,
	`next_due_at` integer,
	`status` text DEFAULT 'paid' NOT NULL,
	`approved_by_user_id` text,
	`receipt_url` text,
	`vendor` text,
	`expense_date` integer NOT NULL,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paid_by_founder_id`) REFERENCES `founders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paid_from_account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `expenses_category_idx` ON `expenses` (`category`);--> statement-breakpoint
CREATE INDEX `expenses_project_idx` ON `expenses` (`project_id`);--> statement-breakpoint
CREATE INDEX `expenses_status_idx` ON `expenses` (`status`);--> statement-breakpoint
CREATE INDEX `expenses_date_idx` ON `expenses` (`expense_date`);--> statement-breakpoint
CREATE INDEX `expenses_founder_idx` ON `expenses` (`paid_by_founder_id`);--> statement-breakpoint
CREATE TABLE `fund_transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`transfer_type` text NOT NULL,
	`from_account_id` text,
	`to_account_id` text,
	`founder_id` text,
	`project_id` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`description` text,
	`reference` text,
	`status` text DEFAULT 'completed' NOT NULL,
	`transferred_at` integer NOT NULL,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`from_account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`founder_id`) REFERENCES `founders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `fund_transfers_type_idx` ON `fund_transfers` (`transfer_type`);--> statement-breakpoint
CREATE INDEX `fund_transfers_from_idx` ON `fund_transfers` (`from_account_id`);--> statement-breakpoint
CREATE INDEX `fund_transfers_to_idx` ON `fund_transfers` (`to_account_id`);--> statement-breakpoint
CREATE INDEX `fund_transfers_founder_idx` ON `fund_transfers` (`founder_id`);--> statement-breakpoint
CREATE INDEX `fund_transfers_project_idx` ON `fund_transfers` (`project_id`);--> statement-breakpoint
CREATE INDEX `fund_transfers_date_idx` ON `fund_transfers` (`transferred_at`);--> statement-breakpoint
CREATE TABLE `profit_distributions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`period` text,
	`total_profit` integer NOT NULL,
	`company_retention` integer NOT NULL,
	`distributed_amount` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`status` text DEFAULT 'calculated' NOT NULL,
	`calculated_at` integer NOT NULL,
	`distributed_at` integer,
	`notes` text,
	`created_by_user_id` text,
	`approved_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `profit_distributions_project_idx` ON `profit_distributions` (`project_id`);--> statement-breakpoint
CREATE INDEX `profit_distributions_status_idx` ON `profit_distributions` (`status`);--> statement-breakpoint
CREATE INDEX `profit_distributions_period_idx` ON `profit_distributions` (`period`);--> statement-breakpoint
CREATE TABLE `founder_distribution_items` (
	`id` text PRIMARY KEY NOT NULL,
	`distribution_id` text NOT NULL,
	`founder_id` text NOT NULL,
	`share_percentage` integer NOT NULL,
	`gross_amount` integer NOT NULL,
	`deductions` integer DEFAULT 0 NOT NULL,
	`net_amount` integer NOT NULL,
	`to_account_id` text,
	`transfer_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`distribution_id`) REFERENCES `profit_distributions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`founder_id`) REFERENCES `founders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transfer_id`) REFERENCES `fund_transfers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `founder_dist_items_distribution_idx` ON `founder_distribution_items` (`distribution_id`);--> statement-breakpoint
CREATE INDEX `founder_dist_items_founder_idx` ON `founder_distribution_items` (`founder_id`);--> statement-breakpoint
CREATE TABLE `financial_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_type` text NOT NULL,
	`account_id` text NOT NULL,
	`amount` integer NOT NULL,
	`balance_after` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`description` text NOT NULL,
	`project_id` text,
	`expense_id` text,
	`transfer_id` text,
	`contribution_id` text,
	`distribution_id` text,
	`invoice_id` text,
	`payment_id` text,
	`reference` text,
	`transaction_date` integer NOT NULL,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `company_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transfer_id`) REFERENCES `fund_transfers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contribution_id`) REFERENCES `founder_contributions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`distribution_id`) REFERENCES `profit_distributions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `financial_transactions_type_idx` ON `financial_transactions` (`transaction_type`);--> statement-breakpoint
CREATE INDEX `financial_transactions_account_idx` ON `financial_transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `financial_transactions_date_idx` ON `financial_transactions` (`transaction_date`);--> statement-breakpoint
CREATE INDEX `financial_transactions_project_idx` ON `financial_transactions` (`project_id`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`provider` text NOT NULL,
	`description` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`billing_cycle` text NOT NULL,
	`category` text NOT NULL,
	`start_date` integer NOT NULL,
	`next_billing_date` integer,
	`end_date` integer,
	`auto_renew` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`login_url` text,
	`account_email` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `subscriptions_next_billing_idx` ON `subscriptions` (`next_billing_date`);--> statement-breakpoint
CREATE INDEX `subscriptions_category_idx` ON `subscriptions` (`category`);--> statement-breakpoint
CREATE TABLE `expense_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#6366f1' NOT NULL,
	`description` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expense_tags_name_unique` ON `expense_tags` (`name`);--> statement-breakpoint
CREATE TABLE `expense_tag_mappings` (
	`id` text PRIMARY KEY NOT NULL,
	`expense_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `expense_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `expense_tag_mappings_expense_idx` ON `expense_tag_mappings` (`expense_id`);--> statement-breakpoint
CREATE INDEX `expense_tag_mappings_tag_idx` ON `expense_tag_mappings` (`tag_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `expense_tag_mappings_unique` ON `expense_tag_mappings` (`expense_id`, `tag_id`);--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`period_type` text NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`total_budget` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'PKR' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_by_user_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `budgets_period_idx` ON `budgets` (`period_start`, `period_end`);--> statement-breakpoint
CREATE INDEX `budgets_status_idx` ON `budgets` (`status`);--> statement-breakpoint
CREATE TABLE `budget_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`budget_id` text NOT NULL,
	`category` text NOT NULL,
	`allocated_amount` integer DEFAULT 0 NOT NULL,
	`spent_amount` integer DEFAULT 0 NOT NULL,
	`alert_threshold` integer DEFAULT 80,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `budget_categories_budget_idx` ON `budget_categories` (`budget_id`);--> statement-breakpoint
CREATE INDEX `budget_categories_category_idx` ON `budget_categories` (`category`);--> statement-breakpoint
CREATE UNIQUE INDEX `budget_categories_unique` ON `budget_categories` (`budget_id`, `category`);
