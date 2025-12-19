
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_availability'");
  console.log('User Availability Table:', result.rows);
  
  const cr = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='change_requests'");
  console.log('Change Requests Table:', cr.rows);
} catch (error) {
  console.error('Database error:', error);
}
