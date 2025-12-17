# Test Internal Portal Database Operations
# Verifies CRUD operations on key internal portal tables

param(
    [switch]$Verbose,
    [switch]$ReadOnly = $false
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Internal Portal Database Operations Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ($ReadOnly) {
    Write-Host "MODE: Read-Only (no data will be modified)" -ForegroundColor Yellow
} else {
    Write-Host "MODE: Full Test (will create and delete test data)" -ForegroundColor Yellow
}
Write-Host ""

# Load environment variables
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^"|"$'
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Create test script - write directly to file to avoid PowerShell escaping issues
@'
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const readOnly = process.argv[2] === 'true';

async function test() {
  try {
    console.log('📊 Testing Internal Portal Database Operations\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Check Users table
    console.log('[1] Testing Users table...');
    try {
      const users = await client.execute('SELECT COUNT(*) as count FROM users');
      console.log(`   ✓ Users table: ${users.rows[0].count} records`);
      
      if (users.rows[0].count > 0) {
        const sample = await client.execute('SELECT id, email FROM users LIMIT 3');
        console.log('   Sample users:', sample.rows);
      }
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 2: Check Leads table
    console.log('\n[2] Testing Leads table...');
    try {
      const leads = await client.execute('SELECT COUNT(*) as count FROM leads');
      console.log(`   ✓ Leads table: ${leads.rows[0].count} records`);
      
      if (leads.rows[0].count > 0) {
        const sample = await client.execute('SELECT id, companyName, status FROM leads LIMIT 3');
        console.log('   Sample leads:', sample.rows);
      }
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 3: Check Process Definitions
    console.log('\n[3] Testing Process Definitions table...');
    try {
      const processes = await client.execute('SELECT COUNT(*) as count FROM process_definitions');
      console.log(`   ✓ Process Definitions: ${processes.rows[0].count} records`);
      
      if (processes.rows[0].count > 0) {
        const sample = await client.execute('SELECT id, name, status FROM process_definitions LIMIT 3');
        console.log('   Sample processes:', sample.rows);
      }
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 4: Check Process Instances
    console.log('\n[4] Testing Process Instances table...');
    try {
      const instances = await client.execute('SELECT COUNT(*) as count FROM process_instances');
      console.log(`   ✓ Process Instances: ${instances.rows[0].count} records`);
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 5: Check Onboarding Checklists
    console.log('\n[5] Testing Onboarding Checklists table...');
    try {
      const onboarding = await client.execute('SELECT COUNT(*) as count FROM onboarding_checklists');
      console.log(`   ✓ Onboarding Checklists: ${onboarding.rows[0].count} records`);
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 6: Check Projects
    console.log('\n[6] Testing Projects table...');
    try {
      const projects = await client.execute('SELECT COUNT(*) as count FROM projects');
      console.log(`   ✓ Projects: ${projects.rows[0].count} records`);
      
      if (projects.rows[0].count > 0) {
        const sample = await client.execute('SELECT id, name, status FROM projects LIMIT 3');
        console.log('   Sample projects:', sample.rows);
      }
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 7: Check Tasks
    console.log('\n[7] Testing Tasks table...');
    try {
      const tasks = await client.execute('SELECT COUNT(*) as count FROM tasks');
      console.log(`   ✓ Tasks: ${tasks.rows[0].count} records`);
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    // Test 8: Check Proposals
    console.log('\n[8] Testing Proposals table...');
    try {
      const proposals = await client.execute('SELECT COUNT(*) as count FROM proposals');
      console.log(`   ✓ Proposals: ${proposals.rows[0].count} records`);
      passed++;
    } catch (e) {
      console.log('   ✗ Error:', e.message);
      failed++;
    }
    
    if (!readOnly) {
      // Write tests - create and delete test records
      console.log('\n--- Write Operations Tests ---');
      
      // Test 9: Create test lead
      console.log('\n[9] Testing Lead creation...');
      try {
        const newLead = await client.execute({
          sql: 'INSERT INTO leads (companyName, status, source) VALUES (?, ?, ?)',
          args: ['Test Company ' + Date.now(), 'new', 'test']
        });
        console.log('   ✓ Lead created:', newLead.lastInsertRowid);
        
        // Delete test lead
        await client.execute({
          sql: 'DELETE FROM leads WHERE id = ?',
          args: [newLead.lastInsertRowid]
        });
        console.log('   ✓ Test lead cleaned up');
        passed++;
      } catch (e) {
        console.log('   ✗ Error:', e.message);
        failed++;
      }
    }
    
    // Summary
    console.log('\n=========================================');
    console.log('TEST SUMMARY');
    console.log('=========================================');
    console.log(`Total Tests: ${passed + failed}`);
    console.log(`✓ Passed: ${passed}`);
    console.log(`✗ Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n✅ All database operations working correctly!');
      process.exit(0);
    } else {
      console.log('\n❌ Some database operations failed!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

test();
'@ | Out-File -FilePath "test-db-operations.mjs" -Encoding UTF8

Write-Host "Running database operations test..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray
Write-Host ""

# Run the test
node test-db-operations.mjs $ReadOnly.ToString().ToLower()

$exitCode = $LASTEXITCODE

# Cleanup
Remove-Item "test-db-operations.mjs" -ErrorAction SilentlyContinue

exit $exitCode
