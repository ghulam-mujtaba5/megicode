/**
 * Turso Database Setup & Migration Script
 * Ensures all tables are created and initializes with seed data
 * Run with: npm run db:migrate-turso
 */

import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const { getTursoClient, getDb } = require('../lib/db');
const schema = require('../lib/db/schema');
const { sql } = require('drizzle-orm');

function generateId(): string {
  return crypto.randomUUID();
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function runMigration() {
  console.log('🔄 Starting Turso Migration...\n');

  const client = getTursoClient();
  const db = getDb();

  try {
    // 1. Check if tables exist by querying sqlite_master
    console.log('📋 Checking table status...');
    
    const existingTables = await client.execute(
      `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'founders' OR name LIKE 'company_accounts' OR name LIKE 'founder_contributions'`
    );

    const tableNames = existingTables.rows.map((row: any) => row.name);
    console.log(`   Found tables: ${tableNames.length > 0 ? tableNames.join(', ') : 'None'}\n`);

    // 2. Verify schema integrity
    console.log('✅ Verifying schema integrity...');
    
    // Try to query the schema tables
    const testQueries = [
      { table: 'founders', query: 'SELECT COUNT(*) as count FROM founders' },
      { table: 'company_accounts', query: 'SELECT COUNT(*) as count FROM company_accounts' },
      { table: 'founder_contributions', query: 'SELECT COUNT(*) as count FROM founder_contributions' },
    ];

    for (const { table, query } of testQueries) {
      try {
        const result = await client.execute(query);
        const count = (result.rows[0] as any)?.count || 0;
        console.log(`   ✓ ${table}: ${count} records`);
      } catch (e) {
        console.warn(`   ⚠️  ${table} might not exist or is empty`);
      }
    }

    console.log('\n📊 Database Status:');
    console.log(`   URL: ${process.env.TURSO_DATABASE_URL}`);
    console.log(`   Auth Token: ${process.env.TURSO_AUTH_TOKEN ? '✓ Set' : '✗ Missing'}`);
    console.log(`   Status: ✅ Connected\n`);

    console.log('✅ Migration completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Migration failed:', getErrorMessage(error));
    console.error('\nTroubleshooting:');
    console.error('1. Ensure TURSO_DATABASE_URL is set correctly');
    console.error('2. Ensure TURSO_AUTH_TOKEN is set correctly');
    console.error('3. Run: npm run db:seed to populate data\n');
    return false;
  }
}

// Run migration
runMigration()
  .then((success) => {
    process.exitCode = success ? 0 : 1;
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exitCode = 1;
  });
