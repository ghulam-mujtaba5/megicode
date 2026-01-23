const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Migration files to apply (starting from 0003)
const migrations = [
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
  try {
    for (const migration of migrations) {
      const filePath = path.join(__dirname, 'drizzle', migration);
      if (!fs.existsSync(filePath)) {
        console.log(`⚠  Skipping ${migration} - file not found`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by statement-breakpoint and execute each statement
      const statements = sql.split('--> statement-breakpoint')
        .map(s => s.trim())
        .map(s => s.replace(/^--.*\n?/gm, '').trim()) // Remove comment lines
        .filter(s => s && !s.startsWith('--') && s.length > 0);

      for (const statement of statements) {
        try {
          // Clean up the statement  
          const cleanStatement = statement.replace(/\n+/g, ' ').trim();
          if (cleanStatement.length > 10) {
            await client.execute(cleanStatement);
          }
        } catch (err) {
          // Skip if table already exists
          if (err.message && (err.message.includes('already exists') || err.message.includes('unique constraint'))) {
            console.log(`  ℹ  ${migration}: Object already exists (skipped)`);
            break;
          }
          console.error(`  Statement failed: ${statement.substring(0, 80)}...`);
          throw err;
        }
      }
      
      console.log(`✓ Applied ${migration}`);
    }

    console.log('\n✅ All migrations applied successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

applyMigrations();
