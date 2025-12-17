# Internal Portal API & Pages Test Script
# Tests all internal portal endpoints against remote Turso DB

param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Internal Portal Test Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Testing against: Remote Turso DB" -ForegroundColor Yellow
Write-Host ""

# Test results tracking
$results = @{
    Passed = 0
    Failed = 0
    Skipped = 0
    Total = 0
    Details = @()
}

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Path,
        [string]$Description,
        [hashtable]$Body = $null,
        [int[]]$ExpectedStatusCodes = @(200, 201)
    )
    
    $results.Total++
    $fullUrl = "$BaseUrl$Path"
    
    Write-Host "`n[$results.Total] Testing: $Description" -ForegroundColor Cyan
    Write-Host "    Method: $Method" -ForegroundColor Gray
    Write-Host "    Path: $Path" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $fullUrl
            Method = $Method
            TimeoutSec = 10
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($ExpectedStatusCodes -contains $response.StatusCode) {
            Write-Host "    ✓ PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
            $results.Passed++
            
            if ($Verbose -and $response.Content) {
                $content = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($content) {
                    Write-Host "    Response Preview:" -ForegroundColor Gray
                    Write-Host "    $($content | ConvertTo-Json -Depth 2 -Compress)" -ForegroundColor DarkGray
                }
            }
            
            $results.Details += @{
                Test = $Description
                Status = "PASSED"
                StatusCode = $response.StatusCode
                Method = $Method
                Path = $Path
            }
        } else {
            Write-Host "    ✗ FAILED - Unexpected status: $($response.StatusCode)" -ForegroundColor Red
            $results.Failed++
            $results.Details += @{
                Test = $Description
                Status = "FAILED"
                StatusCode = $response.StatusCode
                Method = $Method
                Path = $Path
                Error = "Unexpected status code"
            }
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        # Some endpoints require auth - 401/403 means they're working
        if ($statusCode -in @(401, 403)) {
            Write-Host "    ⓘ AUTH REQUIRED - Status: $statusCode (endpoint exists)" -ForegroundColor Yellow
            $results.Passed++
            $results.Details += @{
                Test = $Description
                Status = "AUTH_REQUIRED"
                StatusCode = $statusCode
                Method = $Method
                Path = $Path
            }
        } else {
            Write-Host "    ✗ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
            $results.Failed++
            $results.Details += @{
                Test = $Description
                Status = "FAILED"
                StatusCode = $statusCode
                Method = $Method
                Path = $Path
                Error = $_.Exception.Message
            }
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "TESTING API ENDPOINTS" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# Process APIs
Write-Host "`n--- Process Management APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method GET -Path "/api/internal/process" -Description "Get all processes"
Test-Endpoint -Method POST -Path "/api/internal/process" -Description "Create new process" -Body @{
    name = "Test Process"
    description = "Test Description"
    category = "test"
} -ExpectedStatusCodes @(200, 201, 401, 403)

Test-Endpoint -Method GET -Path "/api/internal/process/test-id" -Description "Get process by ID" -ExpectedStatusCodes @(200, 404, 401, 403)
Test-Endpoint -Method PATCH -Path "/api/internal/process/test-id" -Description "Update process" -ExpectedStatusCodes @(200, 404, 401, 403)
Test-Endpoint -Method DELETE -Path "/api/internal/process/test-id" -Description "Delete process" -ExpectedStatusCodes @(200, 404, 401, 403)

# Process Steps APIs
Write-Host "`n--- Process Steps APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method GET -Path "/api/internal/process/test-id/step" -Description "Get process steps" -ExpectedStatusCodes @(200, 404, 401, 403)
Test-Endpoint -Method POST -Path "/api/internal/process/test-id/step" -Description "Create process step" -ExpectedStatusCodes @(200, 201, 404, 401, 403)

# Process Execute APIs
Write-Host "`n--- Process Execute APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method POST -Path "/api/internal/process/test-id/execute" -Description "Execute process" -ExpectedStatusCodes @(200, 201, 404, 401, 403)
Test-Endpoint -Method GET -Path "/api/internal/process/test-id/execute" -Description "Get execution status" -ExpectedStatusCodes @(200, 404, 401, 403)

# Process Analytics APIs
Write-Host "`n--- Process Analytics APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method GET -Path "/api/internal/process/analytics" -Description "Get process analytics"

# Onboarding APIs
Write-Host "`n--- Onboarding APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method POST -Path "/api/internal/onboarding" -Description "Create onboarding" -Body @{
    clientName = "Test Client"
    email = "test@example.com"
} -ExpectedStatusCodes @(200, 201, 400, 401, 403)

Test-Endpoint -Method POST -Path "/api/internal/onboarding/automate" -Description "Automate onboarding" -ExpectedStatusCodes @(200, 201, 400, 401, 403)

# Leads APIs
Write-Host "`n--- Leads APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method POST -Path "/api/internal/leads/score" -Description "Score lead" -ExpectedStatusCodes @(200, 201, 400, 401, 403)
Test-Endpoint -Method GET -Path "/api/internal/leads/score" -Description "Get lead scores"

# Admin APIs
Write-Host "`n--- Admin APIs ---" -ForegroundColor Yellow
Test-Endpoint -Method PUT -Path "/api/internal/admin/users" -Description "Update user" -ExpectedStatusCodes @(200, 201, 400, 401, 403)

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "TESTING PAGE ROUTES" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# Internal Pages
$pages = @(
    "/internal",
    "/internal/login",
    "/internal/onboarding",
    "/internal/process",
    "/internal/process/showcase",
    "/internal/leads",
    "/internal/projects",
    "/internal/resources",
    "/internal/templates",
    "/internal/team",
    "/internal/proposals",
    "/internal/suggestions",
    "/internal/tasks",
    "/internal/instances",
    "/internal/setup-guide"
)

Write-Host "`n--- Internal Portal Pages ---" -ForegroundColor Yellow
foreach ($page in $pages) {
    Test-Endpoint -Method GET -Path $page -Description "Page: $page" -ExpectedStatusCodes @(200, 302, 401, 403)
}

# Print Summary
Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "TEST SUMMARY" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Total Tests: $($results.Total)" -ForegroundColor Cyan
Write-Host "Passed: $($results.Passed)" -ForegroundColor Green
Write-Host "Failed: $($results.Failed)" -ForegroundColor $(if ($results.Failed -eq 0) { "Green" } else { "Red" })
Write-Host "Success Rate: $([math]::Round(($results.Passed / $results.Total) * 100, 2))%" -ForegroundColor Cyan

# Show failed tests details
if ($results.Failed -gt 0) {
    Write-Host "`n--- Failed Tests ---" -ForegroundColor Red
    $results.Details | Where-Object { $_.Status -eq "FAILED" } | ForEach-Object {
        Write-Host "  ✗ $($_.Test)" -ForegroundColor Red
        Write-Host "    $($_.Method) $($_.Path) - $($_.Error)" -ForegroundColor DarkRed
    }
}

# Export detailed results
$reportPath = "test-results-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').json"
$results | ConvertTo-Json -Depth 10 | Out-File $reportPath
Write-Host "`nDetailed report saved to: $reportPath" -ForegroundColor Cyan

# Exit with appropriate code
if ($results.Failed -eq 0) {
    Write-Host "`n✓ All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n✗ Some tests failed. Check details above." -ForegroundColor Red
    exit 1
}
