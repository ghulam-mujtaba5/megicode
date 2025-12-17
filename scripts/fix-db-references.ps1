# Fix all db references to getDb() in new API files
$filePaths = @(
    "app\api\internal\tasks\route.ts",
    "app\api\internal\tasks\`[id`]\route.ts",
    "app\api\internal\leads\route.ts",
    "app\api\internal\leads\`[id`]\route.ts",
    "app\api\internal\proposals\route.ts",
    "app\api\internal\proposals\`[id`]\route.ts",
    "app\api\internal\clients\route.ts",
    "app\api\internal\clients\`[id`]\route.ts",
    "app\api\internal\bugs\route.ts",
    "app\api\internal\reports\route.ts"
)

$fixed = 0
$errors = 0

foreach ($file in $filePaths) {
    try {
        if (Test-Path $file) {
            $content = [System.IO.File]::ReadAllText($file)
            $originalContent = $content
            
            # Replace db. with getDb().
            $content = $content -replace '(?<!\w)db\.', 'getDb().'
            
            if ($content -ne $originalContent) {
                [System.IO.File]::WriteAllText($file, $content)
                Write-Host "✓ Fixed: $file" -ForegroundColor Green
                $fixed++
            } else {
                Write-Host "  Already fixed: $file" -ForegroundColor Gray
            }
        } else {
            Write-Host "✗ Not found: $file" -ForegroundColor Red
            $errors++
        }
    } catch {
        Write-Host "✗ Error processing $file : $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Fixed: $fixed files" -ForegroundColor Green
Write-Host "Errors: $errors files" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
