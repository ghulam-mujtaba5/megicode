# Count and List All Internal Portal APIs
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Internal Portal API Inventory" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$apiEndpoints = @()

# Process Management (9 endpoints)
$apiEndpoints += "GET    /api/internal/process"
$apiEndpoints += "POST   /api/internal/process"
$apiEndpoints += "GET    /api/internal/process/{id}"
$apiEndpoints += "PATCH  /api/internal/process/{id}"
$apiEndpoints += "DELETE /api/internal/process/{id}"
$apiEndpoints += "GET    /api/internal/process/{id}/step"
$apiEndpoints += "POST   /api/internal/process/{id}/step"
$apiEndpoints += "POST   /api/internal/process/{id}/execute"
$apiEndpoints += "GET    /api/internal/process/{id}/execute"

# Process Analytics (1 endpoint)
$apiEndpoints += "GET    /api/internal/process/analytics"

# Onboarding (2 endpoints)
$apiEndpoints += "POST   /api/internal/onboarding"
$apiEndpoints += "POST   /api/internal/onboarding/automate"

# Leads (4 endpoints)
$apiEndpoints += "GET    /api/internal/leads"
$apiEndpoints += "POST   /api/internal/leads"
$apiEndpoints += "GET    /api/internal/leads/{id}"
$apiEndpoints += "PATCH  /api/internal/leads/{id}"
$apiEndpoints += "DELETE /api/internal/leads/{id}"
$apiEndpoints += "POST   /api/internal/leads/score"
$apiEndpoints += "GET    /api/internal/leads/score"

# Projects (5 endpoints) - NEW
$apiEndpoints += "GET    /api/internal/projects"
$apiEndpoints += "POST   /api/internal/projects"
$apiEndpoints += "GET    /api/internal/projects/{id}"
$apiEndpoints += "PATCH  /api/internal/projects/{id}"
$apiEndpoints += "DELETE /api/internal/projects/{id}"

# Tasks (5 endpoints) - NEW
$apiEndpoints += "GET    /api/internal/tasks"
$apiEndpoints += "POST   /api/internal/tasks"
$apiEndpoints += "GET    /api/internal/tasks/{id}"
$apiEndpoints += "PATCH  /api/internal/tasks/{id}"
$apiEndpoints += "DELETE /api/internal/tasks/{id}"

# Proposals (5 endpoints) - NEW
$apiEndpoints += "GET    /api/internal/proposals"
$apiEndpoints += "POST   /api/internal/proposals"
$apiEndpoints += "GET    /api/internal/proposals/{id}"
$apiEndpoints += "PATCH  /api/internal/proposals/{id}"
$apiEndpoints += "DELETE /api/internal/proposals/{id}"

# Clients (5 endpoints) - NEW
$apiEndpoints += "GET    /api/internal/clients"
$apiEndpoints += "POST   /api/internal/clients"
$apiEndpoints += "GET    /api/internal/clients/{id}"
$apiEndpoints += "PATCH  /api/internal/clients/{id}"
$apiEndpoints += "DELETE /api/internal/clients/{id}"

# Bugs (2 endpoints) - NEW
$apiEndpoints += "GET    /api/internal/bugs"
$apiEndpoints += "POST   /api/internal/bugs"

# Reports (1 endpoint) - NEW
$apiEndpoints += "GET    /api/internal/reports"

# Admin (1 endpoint)
$apiEndpoints += "PUT    /api/internal/admin/users"

Write-Host "All Internal Portal API Endpoints:" -ForegroundColor Yellow
Write-Host ""
$apiEndpoints | Sort-Object | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "TOTAL: $($apiEndpoints.Count) API Endpoints" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Breakdown by Module:" -ForegroundColor Yellow
Write-Host "  Process Management: 10" -ForegroundColor White
Write-Host "  Leads Management: 7" -ForegroundColor White
Write-Host "  Projects: 5 (NEW)" -ForegroundColor Green
Write-Host "  Tasks: 5 (NEW)" -ForegroundColor Green
Write-Host "  Proposals: 5 (NEW)" -ForegroundColor Green
Write-Host "  Clients: 5 (NEW)" -ForegroundColor Green
Write-Host "  Onboarding: 2" -ForegroundColor White
Write-Host "  Bugs: 2 (NEW)" -ForegroundColor Green
Write-Host "  Reports: 1 (NEW)" -ForegroundColor Green
Write-Host "  Admin: 1" -ForegroundColor White
Write-Host ""
Write-Host "Previously: 15 endpoints" -ForegroundColor Yellow
Write-Host "Added: 28 new endpoints" -ForegroundColor Green
Write-Host "Current Total: 43 endpoints" -ForegroundColor Cyan
