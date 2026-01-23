# Set Turso environment variables in Vercel
# This script adds the missing TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to production

Write-Host "Setting Turso environment variables in Vercel..." -ForegroundColor Green

# Read from .env.local to get the values
$envLocal = Get-Content .env.local -Raw
$tursoUrl = $envLocal | Select-String 'TURSO_DATABASE_URL="([^"]+)"' | % {$_.Matches[0].Groups[1].Value}
$tursoToken = $envLocal | Select-String 'TURSO_AUTH_TOKEN="([^"]+)"' | % {$_.Matches[0].Groups[1].Value}

if (-not $tursoUrl -or -not $tursoToken) {
    Write-Host "❌ Could not find TURSO variables in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "Found TURSO_DATABASE_URL: $tursoUrl" -ForegroundColor Yellow
Write-Host "Found TURSO_AUTH_TOKEN (length: $($tursoToken.Length))" -ForegroundColor Yellow

Write-Host ""
Write-Host "1. Add TURSO_DATABASE_URL" -ForegroundColor Cyan
Write-Host "   Variable name: TURSO_DATABASE_URL"
Write-Host "   Value: $tursoUrl"
Write-Host "   Environments: Production, Preview, Development"
Write-Host ""
Write-Host "   - Go to: https://vercel.com/megicodes-projects/megicode/settings/environment-variables"
Write-Host "   - Add New Variable"
Write-Host "   - Name: TURSO_DATABASE_URL"
Write-Host "   - Value: $tursoUrl"
Write-Host "   - Select all environments (Production, Preview, Development)"
Write-Host "   - Save"
Write-Host ""

Write-Host "2. Add TURSO_AUTH_TOKEN" -ForegroundColor Cyan
Write-Host "   Variable name: TURSO_AUTH_TOKEN"
Write-Host "   Value: (see below)"
Write-Host "   Environments: Production, Preview, Development"
Write-Host ""
Write-Host "   - Go to: https://vercel.com/megicodes-projects/megicode/settings/environment-variables"
Write-Host "   - Add New Variable"
Write-Host "   - Name: TURSO_AUTH_TOKEN"
Write-Host "   - Value: $tursoToken"
Write-Host "   - Select all environments (Production, Preview, Development)"
Write-Host "   - Mark as Sensitive (yes)"
Write-Host "   - Save"
Write-Host ""

Write-Host "3. After adding variables, redeploy:" -ForegroundColor Cyan
Write-Host "   vercel deploy --prod" -ForegroundColor Yellow
