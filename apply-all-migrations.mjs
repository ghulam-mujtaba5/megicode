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

// ALL migration files in order
const migrations = [
  '0000_ambitious_polaris.sql',
  '0001_chilly_ken_ellis.sql',
  '0002_flowery_power_man.sql',
  '0003_chubby_quicksilver.sql',
  '0004_dry_night_thrasher.sql',
  '0005_glorious_spot.sql',
  '0006_wet_the_call.sql',
  '0007_opposite_anita_blake.sql',
  '0008_previous_blackheart.sql',
  '0009_thankful_moondragon.sql',
  '0010_chubby_natasha_romanoff.sql',
  '0011_dizzy_morgan_stark.sql',
  '0012_busy_bushwacker.sql',
  '0013_previous_virginia_dare.sql',
  '0014_wealthy_mongu.sql',
  '0015_add-system-settings.sql',
  '0016_notifications.sql',
  '0017_add-financial-tables.sql',
];

async function applyMigrations() {
  console.log('🚀 Starting migration...\n');
  
  for (const migration of migrations) {
    const filePath = path.join(__dirname, 'drizzle', migration);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${migration} - file not found`);
      continue;
    }

    console.log(`📄 Applying ${migration}...`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by statement-breakpoint and execute each statement
    const statements = sql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .map(s => s.replace(/^--.*$/gm, '').trim()) // Remove comment lines
      .filter(s => s && s.length > 0);

    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      const cleanStatement = statement.replace(/\n+/g, ' ').trim();
      if (cleanStatement.length < 5) continue;
      
      try {
        await client.execute(cleanStatement);
        successCount++;
      } catch (err) {
        // Skip if table/index already exists or duplicate column
        if (err.message && (
          err.message.includes('already exists') || 
          err.message.includes('duplicate column') ||
          err.message.includes('unique constraint') ||
          err.message.includes('UNIQUE constraint failed')
        )) {
          skipCount++;
          continue;
        }
        console.error(`   ❌ Statement failed: ${cleanStatement.substring(0, 100)}...`);
        console.error(`      Error: ${err.message}`);
      }
    }
    
    console.log(`   ✅ Applied ${successCount} statements, skipped ${skipCount}`);
  }
  
  console.log('\n✅ Migration complete!');
  
  // Verify tables
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\n📊 Tables in database:');
  result.rows.forEach(row => console.log('   -', row.name));
  console.log(`\nTotal: ${result.rows.length} tables`);
}

applyMigrations().catch(console.error);
