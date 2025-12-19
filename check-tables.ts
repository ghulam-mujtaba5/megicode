
import { getDb } from './lib/db/index';
import { sql } from 'drizzle-orm';

async function checkTables() {
  const db = getDb();
  const result = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='user_availability'`);
  console.log('User Availability Table:', result.rows);
  
  const cr = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='change_requests'`);
  console.log('Change Requests Table:', cr.rows);
}

checkTables();
