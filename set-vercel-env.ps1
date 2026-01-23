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
    'GOOGLE_CLIENT_ID' = 'your_google_client_id_here'
    'GOOGLE_CLIENT_SECRET' = 'your_google_client_secret_here'
    'TURSO_DATABASE_URL' = 'your_turso_database_url_here'
    'TURSO_AUTH_TOKEN' = 'your_turso_auth_token_here'
    'NEXT_PUBLIC_SITE_URL' = 'https://megicode.com'
    'NEXT_PUBLIC_GA_MEASUREMENT_ID' = 'G-LXPDFC5P0R'
    'ZOHO_USER' = 'your_zoho_user_here'
    'ZOHO_PASS' = 'your_zoho_password_here'
}

Write-Host "`n📝 Setting required environment variables in production..."
foreach ($key in $env_vars.Keys) {
    $value = $env_vars[$key]
    Write-Host "  Setting $key = ${value.Substring(0, [Math]::Min(20, $value.Length))}..."
    echo $value | & vercel env add $key production --yes
}

Write-Host "`n✅ Environment variables updated!"
& vercel env list
