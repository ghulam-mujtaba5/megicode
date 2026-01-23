import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const sql = fs.readFileSync(path.join(__dirname, 'drizzle', '0016_notifications.sql'), 'utf8');

// Remove comments and split by semicolon for individual statements
const statements = sql
  .replace(/--[^\n]*/g, '') // Remove single-line comments
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 10);

console.log(`Found ${statements.length} statements to execute`);

for (const stmt of statements) {
  try {
    console.log(`\nExecuting: ${stmt.substring(0, 60)}...`);
    await client.execute(stmt);
    console.log('✅ Success');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('⏭️  Already exists, skipping');
    } else {
      console.error('❌ Error:', err.message);
    }
  }
}

console.log('\n✅ Done!');
