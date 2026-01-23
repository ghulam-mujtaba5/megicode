/**
 * Create founders table and related financial tables
 */

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const { getTursoClient } = require('../lib/db');

async function createTables() {
  console.log('🔄 Creating founders and financial tables...\n');

  const client = getTursoClient();

  try {
    // Create all required tables
    const statements = [
      // Founders table
      `CREATE TABLE IF NOT EXISTS \`founders\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`name\` text NOT NULL,
        \`email\` text,
        \`phone\` text,
        \`user_id\` text,
        \`profit_share_percentage\` integer DEFAULT 50 NOT NULL,
        \`status\` text DEFAULT 'active' NOT NULL,
        \`joined_at\` integer NOT NULL,
        \`notes\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
      );`,
      
      `CREATE INDEX IF NOT EXISTS \`founders_user_idx\` ON \`founders\` (\`user_id\`);`,
      `CREATE INDEX IF NOT EXISTS \`founders_status_idx\` ON \`founders\` (\`status\`);`,
      
      // Company accounts table
      `CREATE TABLE IF NOT EXISTS \`company_accounts\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`name\` text NOT NULL,
        \`account_type\` text NOT NULL,
        \`founder_id\` text,
        \`bank_name\` text,
        \`account_number\` text,
        \`wallet_provider\` text,
        \`currency\` text DEFAULT 'PKR' NOT NULL,
        \`current_balance\` integer DEFAULT 0 NOT NULL,
        \`status\` text DEFAULT 'active' NOT NULL,
        \`is_primary\` integer DEFAULT false NOT NULL,
        \`notes\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL,
        FOREIGN KEY (\`founder_id\`) REFERENCES \`founders\`(\`id\`) ON UPDATE no action ON DELETE no action
      );`,
      
      `CREATE INDEX IF NOT EXISTS \`company_accounts_type_idx\` ON \`company_accounts\` (\`account_type\`);`,
      `CREATE INDEX IF NOT EXISTS \`company_accounts_founder_idx\` ON \`company_accounts\` (\`founder_id\`);`,
      `CREATE INDEX IF NOT EXISTS \`company_accounts_status_idx\` ON \`company_accounts\` (\`status\`);`,
      
      // Founder contributions table
      `CREATE TABLE IF NOT EXISTS \`founder_contributions\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`founder_id\` text NOT NULL,
        \`amount\` integer NOT NULL,
        \`currency\` text DEFAULT 'PKR' NOT NULL,
        \`contribution_type\` text NOT NULL,
        \`purpose\` text,
        \`to_account_id\` text,
        \`status\` text DEFAULT 'confirmed' NOT NULL,
        \`contributed_at\` integer NOT NULL,
        \`notes\` text,
        \`receipt_url\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL,
        FOREIGN KEY (\`founder_id\`) REFERENCES \`founders\`(\`id\`) ON UPDATE no action ON DELETE no action,
        FOREIGN KEY (\`to_account_id\`) REFERENCES \`company_accounts\`(\`id\`) ON UPDATE no action ON DELETE no action
      );`,
      
      `CREATE INDEX IF NOT EXISTS \`founder_contributions_founder_idx\` ON \`founder_contributions\` (\`founder_id\`);`,
      `CREATE INDEX IF NOT EXISTS \`founder_contributions_type_idx\` ON \`founder_contributions\` (\`contribution_type\`);`,
      `CREATE INDEX IF NOT EXISTS \`founder_contributions_date_idx\` ON \`founder_contributions\` (\`contributed_at\`);`,
      
      // Profit distributions table
      `CREATE TABLE IF NOT EXISTS \`profit_distributions\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`project_id\` text,
        \`period\` text,
        \`total_profit\` integer NOT NULL,
        \`company_retention\` integer NOT NULL,
        \`distributed_amount\` integer NOT NULL,
        \`currency\` text DEFAULT 'PKR' NOT NULL,
        \`status\` text DEFAULT 'calculated' NOT NULL,
        \`calculated_at\` integer NOT NULL,
        \`distributed_at\` integer,
        \`notes\` text,
        \`created_by_user_id\` text,
        \`approved_by_user_id\` text,
        \`created_at\` integer NOT NULL,
        \`updated_at\` integer NOT NULL,
        FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE no action,
        FOREIGN KEY (\`created_by_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action,
        FOREIGN KEY (\`approved_by_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
      );`,
      
      `CREATE INDEX IF NOT EXISTS \`profit_distributions_project_idx\` ON \`profit_distributions\` (\`project_id\`);`,
      `CREATE INDEX IF NOT EXISTS \`profit_distributions_status_idx\` ON \`profit_distributions\` (\`status\`);`,
      `CREATE INDEX IF NOT EXISTS \`profit_distributions_period_idx\` ON \`profit_distributions\` (\`period\`);`,
    ];

    // Execute each statement
    let successCount = 0;
    let skipCount = 0;
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
        const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS `(\w+)`/)?.[1] || 
                         stmt.match(/CREATE INDEX IF NOT EXISTS `(\w+)`/)?.[1] || 
                         'unknown';
        console.log(`   ✓ ${tableName}`);
        successCount++;
      } catch (error: any) {
        const errMsg = error.message || String(error);
        if (errMsg.includes('already exists') || errMsg.includes('SQLITE_ERROR')) {
          skipCount++;
        } else {
          console.warn(`   ⚠️  ${errMsg.substring(0, 60)}...`);
        }
      }
    }

    console.log(`\n✅ Created/updated ${successCount} items (${skipCount} skipped)`);
    process.exitCode = 0;

  } catch (error: any) {
    console.error('❌ Failed to create tables:', error.message);
    process.exitCode = 1;
  }
}

createTables();
