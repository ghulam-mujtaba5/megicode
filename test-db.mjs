import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  // Test connection
  const result = await client.execute('SELECT * FROM users LIMIT 1');
  console.log('Connection successful!');
  console.log('Users table exists:', result.rows.length >= 0);
  
  // Show table schema
  const schema = await client.execute(`PRAGMA table_info(users)`);
  console.log('\nUsers table schema:');
  console.log(schema.rows);
} catch (error) {
  console.error('Database error:', error);
}
