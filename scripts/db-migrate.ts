const path = require('path');
const dotenv = require('dotenv');

export {};

// Load local env files for scripts (Next.js loads these automatically, Node scripts don't)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const { migrate } = require('drizzle-orm/libsql/migrator');
const { getDb } = require('../lib/db');

async function main() {
  const migrationsFolder = path.join(process.cwd(), 'drizzle');
  await migrate(getDb(), { migrationsFolder });
  // eslint-disable-next-line no-console
  console.log('Migrations applied successfully.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', err);
  process.exitCode = 1;
});
