# Test all internal portal APIs
Write-Host "Testing All Internal Portal APIs" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$results = @()

# Function to test an API endpoint
function Test-API {
    param(
        [string]$Name,
        [string]$Endpoint,
        [string]$Method = "GET"
    )
    
    try {
        $url = "$baseUrl$Endpoint"
        Write-Host "Testing: $Name" -NoNewline
        
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 5
        }
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✓" -ForegroundColor Green
            return @{ Name = $Name; Status = "✓"; Code = 200 }
        } else {
            Write-Host " ✗ ($($response.StatusCode))" -ForegroundColor Red
            return @{ Name = $Name; Status = "✗"; Code = $response.StatusCode }
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host " 🔒 (Auth Required)" -ForegroundColor Yellow
            return @{ Name = $Name; Status = "🔒"; Code = 401 }
        } else {
            Write-Host " ✗ (Error: $statusCode)" -ForegroundColor Red
            return @{ Name = $Name; Status = "✗"; Code = $statusCode }
        }
    }
}

Write-Host "=== ORIGINAL APIs (15) ===" -ForegroundColor Magenta
$results += Test-API "Admin Users" "/api/internal/admin/users"
$results += Test-API "Lead Scoring" "/api/internal/leads/score"
$results += Test-API "Onboarding" "/api/internal/onboarding"
$results += Test-API "Onboarding Automation" "/api/internal/onboarding/automate"
$results += Test-API "Process List" "/api/internal/process"
$results += Test-API "Process Analytics" "/api/internal/process/analytics"
$results += Test-API "Articles" "/api/articles"
$results += Test-API "Posts" "/api/posts"
$results += Test-API "Contact" "/api/contact" "POST"
$results += Test-API "Chat" "/api/chat" "POST"

Write-Host ""
Write-Host "=== NEW APIs - Projects (2) ===" -ForegroundColor Magenta
$results += Test-API "Projects List" "/api/internal/projects"
$results += Test-API "Projects CRUD Example" "/api/internal/projects/test-id"

Write-Host ""
Write-Host "=== NEW APIs - Tasks (2) ===" -ForegroundColor Magenta
$results += Test-API "Tasks List" "/api/internal/tasks"
$results += Test-API "Tasks CRUD Example" "/api/internal/tasks/test-id"

Write-Host ""
Write-Host "=== NEW APIs - Leads (3) ===" -ForegroundColor Magenta
$results += Test-API "Leads List" "/api/internal/leads"
$results += Test-API "Leads CRUD Example" "/api/internal/leads/test-id"

Write-Host ""
Write-Host "=== NEW APIs - Proposals (2) ===" -ForegroundColor Magenta
$results += Test-API "Proposals List" "/api/internal/proposals"
$results += Test-API "Proposals CRUD Example" "/api/internal/proposals/test-id"

Write-Host ""
Write-Host "=== NEW APIs - Clients (2) ===" -ForegroundColor Magenta
$results += Test-API "Clients List" "/api/internal/clients"
$results += Test-API "Clients CRUD Example" "/api/internal/clients/test-id"

Write-Host ""
Write-Host "=== NEW APIs - Bugs (1) ===" -ForegroundColor Magenta
$results += Test-API "Bugs List" "/api/internal/bugs"

Write-Host ""
Write-Host "=== NEW APIs - Reports (1) ===" -ForegroundColor Magenta
$results += Test-API "Reports Dashboard" "/api/internal/reports"

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$success = ($results | Where-Object { $_.Status -eq "✓" }).Count
$auth = ($results | Where-Object { $_.Status -eq "🔒" }).Count
$failed = ($results | Where-Object { $_.Status -eq "✗" }).Count
$total = $results.Count

Write-Host "Total APIs Tested: $total"
Write-Host "✓ Working: $success" -ForegroundColor Green
Write-Host "🔒 Auth Required: $auth" -ForegroundColor Yellow
Write-Host "✗ Failed: $failed" -ForegroundColor Red

if ($success + $auth -eq $total) {
    Write-Host ""
    Write-Host "🎉 All APIs are functional!" -ForegroundColor Green
    Write-Host "   - $success APIs returning data" -ForegroundColor Green
    Write-Host "   - $auth APIs protected by authentication" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️  Some APIs have issues" -ForegroundColor Yellow
}
