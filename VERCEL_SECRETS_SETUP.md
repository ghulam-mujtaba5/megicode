# Setting Up Secrets in Vercel

This document explains how to properly manage production secrets using Vercel's environment variables feature.

## Why Secrets Should Never Be in Git

- **Security Risk**: Secrets in git history can be extracted even after deletion
- **Audit Trail**: Vercel logs all environment variable changes for compliance
- **Rotation**: Easier to rotate secrets without code changes
- **Team Access**: Control who can view secrets without sharing code

## Setup Steps

### 1. Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project `megicode`
3. Navigate to **Settings → Environment Variables**

### 2. Add Required Secrets

Set the following variables for **Production** environment:

#### Authentication
- `AUTH_SECRET` - NextAuth.js secret key (generate: `openssl rand -hex 32`)
- `NEXTAUTH_URL` - Set to `https://www.megicode.com`
- `INTERNAL_ADMIN_EMAILS` - Admin email addresses
- `INTERNAL_ALLOWED_EMAILS` - Comma-separated emails with access
- `INTERNAL_ALLOWED_DOMAINS` - Allowed email domains

#### Google OAuth
Get these from [Google Cloud Console](https://console.cloud.google.com/):
1. Go to **APIs & Services → Credentials**
2. Select your OAuth 2.0 Client ID
3. Copy the credentials:
   - `GOOGLE_CLIENT_ID` - Client ID value
   - `GOOGLE_CLIENT_SECRET` - Client Secret value

#### Database (Turso)
Get these from [Turso Dashboard](https://app.turso.tech/):
1. Select your database
2. Click **Settings → Connect**
3. Copy the credentials:
   - `TURSO_DATABASE_URL` - Database URL
   - `TURSO_AUTH_TOKEN` - Auth token

#### Email (Zoho)
Get these from [Zoho Mail](https://www.zoho.com/mail/):
1. Go to **Settings → Connected Apps**
2. Create an app password or SMTP credentials:
   - `ZOHO_USER` - Email address
   - `ZOHO_PASS` - App-specific password

### 3. Non-Sensitive Variables

These can stay in code (they're not secrets):
- `NEXT_PUBLIC_SITE_URL` - Public website URL
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID

## Best Practices

✅ **DO:**
- Set secrets in Vercel Dashboard
- Rotate secrets regularly
- Use strong, unique values
- Store local `.env.production` in `.gitignore`
- Use `.env.production.example` as a template

❌ **DON'T:**
- Commit `.env.production` to git
- Share secrets in Slack/email
- Use the same secret across environments
- Store secrets in code comments
- Push to git without `.gitignore` protection

## Local Development

For local testing with production values:
1. Create `.env.production.local` (ignored by git)
2. Copy values from `.env.production.example`
3. Replace placeholders with actual values
4. Never commit this file

## Verifying Setup

Run after deployment:
```bash
npm run dev
```

Check that:
- Google OAuth login works
- Database connections succeed
- Email sending functions
- No missing environment variable errors

## Incident: Secret Exposure

If secrets were accidentally committed:

1. **Rotate immediately** - Generate new credentials in their respective dashboards
2. **Update Vercel** - Set the new secrets in Vercel Dashboard
3. **Purge git history** - Use `git filter-branch` or GitHub's secret scanning allowlist
4. **Monitor** - Watch logs for any unauthorized access attempts

## References

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Turso Documentation](https://docs.turso.tech/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
