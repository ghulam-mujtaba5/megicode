# Fix: Add TURSO_AUTH_TOKEN to Vercel

## Problem
The database authentication is failing with **HTTP 401 Unauthorized**. The `TURSO_AUTH_TOKEN` environment variable is missing from Vercel production.

## Root Cause
- ✗ `TURSO_AUTH_TOKEN` not set in Vercel production environment
- ✓ `TURSO_DATABASE_URL` is correctly set: `libsql://megicode-internal-megicode.aws-eu-west-1.turso.io`

## Solution

### Step 1: Get the Auth Token
The database `megicode-internal-megicode` exists in a Turso account. You need to get the authentication token:

**Option A: From your Turso account**
1. Go to [https://dashboard.turso.io](https://dashboard.turso.io)
2. Select the database: `megicode-internal-megicode`
3. Go to Settings → Tokens
4. Create a new token (or copy existing) - this is your `TURSO_AUTH_TOKEN`
5. Copy the full token value

**Option B: Generate new token via CLI (if you have access)**
```bash
turso db tokens create megicode-internal-megicode --expiration none
```

### Step 2: Add to Vercel
1. Go to: [https://vercel.com/megicodes-projects/megicode/settings/environment-variables](https://vercel.com/megicodes-projects/megicode/settings/environment-variables)
2. Click **Add New**
3. Fill in:
   - **Name**: `TURSO_AUTH_TOKEN`
   - **Value**: (paste the token from Step 1)
   - **Environments**: Select **Production**, **Preview**, **Development**
   - **Mark as Sensitive**: YES ✓
4. Click **Save**

### Step 3: Redeploy
```bash
vercel deploy --prod
```

### Step 4: Test
Try signing in again with Google OAuth at: https://megicode.com/internal/login

## Current Status
```
TURSO_DATABASE_URL: ✓ Set in Vercel
TURSO_AUTH_TOKEN:   ✗ MISSING - Causing 401 errors
```

## Error Details
```
Server returned HTTP status 401 - Authentication failed
```

This means the auth token is either:
- Missing (current situation)
- Invalid/expired
- Wrong format
