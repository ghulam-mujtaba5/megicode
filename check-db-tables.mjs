import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Tables in DB:');
  result.rows.forEach(row => console.log(' -', row.name));
  console.log('\nTotal:', result.rows.length, 'tables');
} catch (error) {
  console.error('Database error:', error);
}
