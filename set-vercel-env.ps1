# Clean up old unused environment variables
$unused = @(
    'NEXT_PUBLIC_API_URL',
    'VERCEL_OIDC_TOKEN',
    'DEV_LOGIN_ENABLED',
    'NEXT_PUBLIC_DEV_LOGIN_ENABLED',
    'INTERNAL_DEFAULT_ROLE',
    'RESEND_API_KEY',
    'CLICKUP_API_KEY',
    'EMAIL_PROVIDER',
    'EMAIL_FROM',
    'FROM_EMAIL',
    'LOG_LEVEL',
    'LOG_FORMAT',
    'NEXT_PUBLIC_GA_DEBUG'
)

Write-Host "🗑️  Removing unused environment variables..."
foreach ($var in $unused) {
    Write-Host "  Removing $var..."
    & vercel env rm $var --yes 2>$null
}

# Set required environment variables
$env_vars = @{
    'AUTH_SECRET' = 'production-secret-key-minimal-change-in-prod'
    'NEXTAUTH_URL' = 'https://www.megicode.com'
    'INTERNAL_ADMIN_EMAILS' = 'megicode@gmail.com'
    'INTERNAL_ALLOWED_EMAILS' = 'megicode@gmail.com,admin@megicode.com'
    'INTERNAL_ALLOWED_DOMAINS' = 'megicode.com'
    'GOOGLE_CLIENT_ID' = '238716241264-mt4mt61sf8n5i5j5prgjfq21df85p2fl.apps.googleusercontent.com'
    'GOOGLE_CLIENT_SECRET' = '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'
    'TURSO_DATABASE_URL' = 'libsql://megicode-internal-megicode.aws-eu-west-1.turso.io'
    'TURSO_AUTH_TOKEN' = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkxMzQxNTksImlkIjoiYzcwNjc0OTctOWMyZi00Y2FjLWFiZjctYzM2Mjg4MDFlNjliIiwicmlkIjoiNTAzNjQ4ZGItOGUxMi00NWQyLWE3NWUtOGE5MWM3MDlkMmRkIn0.OVcoF8Yw_BjmfkPHTvDY_hY4tTdA77NpSvZC10ngIjwNYXz_kfzceZ3GNPIbHahUjaDfuZLc2HHV-bNJL1OhAA'
    'NEXT_PUBLIC_SITE_URL' = 'https://megicode.com'
    'NEXT_PUBLIC_GA_MEASUREMENT_ID' = 'G-LXPDFC5P0R'
    'ZOHO_USER' = 'contact@megicode.com'
    'ZOHO_PASS' = 'DK7Jyj0SrNh6'
}

Write-Host "`n📝 Setting required environment variables in production..."
foreach ($key in $env_vars.Keys) {
    $value = $env_vars[$key]
    Write-Host "  Setting $key = ${value.Substring(0, [Math]::Min(20, $value.Length))}..."
    echo $value | & vercel env add $key production --yes
}

Write-Host "`n✅ Environment variables updated!"
& vercel env list
