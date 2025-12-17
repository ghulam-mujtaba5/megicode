param(
  [string]$Token
)

if (-not $Token) {
  $Token = Read-Host -Prompt "Enter Turso auth token (paste)"
}

$envFile = Join-Path (Get-Location) ".env.local"
if (-not (Test-Path $envFile)) {
  Write-Error ".env.local not found at $envFile"
  exit 1
}

$backup = "$envFile.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
Copy-Item $envFile $backup -Force

$content = Get-Content $envFile -Raw

if ($content -match '(?m)^\s*TURSO_AUTH_TOKEN\s*=') {
  $new = $content -replace '(?m)^\s*TURSO_AUTH_TOKEN\s*=.*$', "TURSO_AUTH_TOKEN=`"$Token`""
} else {
  $new = $content + "`nTURSO_AUTH_TOKEN=`"$Token`"`n"
}

Set-Content -Path $envFile -Value $new -Encoding UTF8

Write-Output "Updated $envFile (backup: $backup)"
