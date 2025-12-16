
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables BEFORE importing db
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const { getDb } = require('../lib/db');
const schema = require('../lib/db/schema');

async function checkDb() {
  const db = getDb();
  
  console.log('Checking database content...');
  
  const users = await db.select().from(schema.users);
  console.log(`Users count: ${users.length}`);
  
  const projects = await db.select().from(schema.projects);
  console.log(`Projects count: ${projects.length}`);
  
  if (projects.length > 0) {
    console.log('Sample Project:', JSON.stringify(projects[0], null, 2));
  }
  
  const leads = await db.select().from(schema.leads);
  console.log(`Leads count: ${leads.length}`);
}

checkDb().catch(console.error);
