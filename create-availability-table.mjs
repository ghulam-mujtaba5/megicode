
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    console.log('Creating user_availability table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_availability (
        id text PRIMARY KEY NOT NULL,
        user_id text NOT NULL,
        type text NOT NULL,
        start_date integer NOT NULL,
        end_date integer NOT NULL,
        reason text,
        status text DEFAULT 'pending' NOT NULL,
        created_at integer NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE no action
      )
    `);
    
    console.log('Creating indexes...');
    await client.execute(`CREATE INDEX IF NOT EXISTS user_availability_user_idx ON user_availability (user_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS user_availability_date_idx ON user_availability (start_date, end_date)`);
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
