# Test Turso Database Connection
# Verifies connectivity to remote Turso DB

param(
    [switch]$Verbose
)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Turso Database Connection Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
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
    Write-Host "✓ Loaded .env.local" -ForegroundColor Green
} else {
    Write-Host "✗ .env.local not found" -ForegroundColor Red
    exit 1
}

$dbUrl = [Environment]::GetEnvironmentVariable("TURSO_DATABASE_URL", "Process")
$authToken = [Environment]::GetEnvironmentVariable("TURSO_AUTH_TOKEN", "Process")

if (-not $dbUrl) {
    Write-Host "✗ TURSO_DATABASE_URL not set" -ForegroundColor Red
    exit 1
}

if (-not $authToken) {
    Write-Host "✗ TURSO_AUTH_TOKEN not set" -ForegroundColor Red
    exit 1
}

Write-Host "Database URL: $dbUrl" -ForegroundColor Yellow
Write-Host "Auth Token: $($authToken.Substring(0, 20))..." -ForegroundColor Yellow
Write-Host ""

# Create a simple test script
$testScript = @'
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function test() {
  try {
    console.log('🔌 Connecting to Turso database...');
    
    // Test 1: Simple query
    const result = await client.execute('SELECT 1 as test');
    console.log('✓ Connection successful!');
    console.log('✓ Basic query works:', result.rows[0]);
    
    // Test 2: List tables
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('\n📊 Database Tables:');
    if (tables.rows.length === 0) {
      console.log('  (No tables found - database might be empty)');
    } else {
      tables.rows.forEach(row => {
        console.log('  -', row.name);
      });
    }
    
    // Test 3: Check for internal portal tables
    const internalTables = tables.rows.filter(row => 
      String(row.name).includes('process') || 
      String(row.name).includes('onboarding') ||
      String(row.name).includes('lead') ||
      String(row.name).includes('user')
    );
    
    if (internalTables.length > 0) {
      console.log('\n🎯 Internal Portal Tables Found:');
      internalTables.forEach(row => {
        console.log('  ✓', row.name);
      });
    }
    
    // Test 4: Database info
    const dbInfo = await client.execute('PRAGMA database_list');
    console.log('\n📋 Database Info:');
    console.log('  Database:', dbInfo.rows[0]);
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
    process.exit(1);
  }
}

test();
'@

$testScript | Out-File -FilePath "test-db-connection.mjs" -Encoding UTF8
Write-Host "Created test script: test-db-connection.mjs" -ForegroundColor Gray

# Check if @libsql/client is installed
Write-Host "`nChecking dependencies..." -ForegroundColor Cyan
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

if ($packageJson.dependencies.'@libsql/client' -or $packageJson.devDependencies.'@libsql/client') {
    Write-Host "✓ @libsql/client is installed" -ForegroundColor Green
} else {
    Write-Host "! Installing @libsql/client..." -ForegroundColor Yellow
    npm install @libsql/client
}

Write-Host "`nRunning database connection test..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

# Run the test
node test-db-connection.mjs

$exitCode = $LASTEXITCODE

# Cleanup
Remove-Item "test-db-connection.mjs" -ErrorAction SilentlyContinue

if ($exitCode -eq 0) {
    Write-Host "`n✅ Database connection verified successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Database connection test failed!" -ForegroundColor Red
}

exit $exitCode
