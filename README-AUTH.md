# Internal Portal Auth Setup

This project uses NextAuth.js with Google OAuth for the internal portal.

## 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "Megicode Internal").
3. Go to **APIs & Services > OAuth consent screen**.
   - User Type: **External**.
   - App Name: Megicode Internal.
   - Support Email: megicode@gmail.com.
   - Authorized Domains: `megicode.com`.
   - Developer Contact: megicode@gmail.com.
4. Go to **Credentials > Create Credentials > OAuth client ID**.
   - Application Type: **Web application**.
   - Name: Megicode Web Client.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://megicode.com`
     - `https://www.megicode.com`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://megicode.com/api/auth/callback/google`
     - `https://www.megicode.com/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**.

## 2. Environment Variables

Add these to your `.env.local` (local) and Vercel Environment Variables (production):

```bash
# Auth
AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000" # Change to https://megicode.com in prod

# Google OAuth
GOOGLE_CLIENT_ID="<your-client-id>"
GOOGLE_CLIENT_SECRET="<your-client-secret>"

# Internal Access Control
INTERNAL_ADMIN_EMAILS="megicode@gmail.com" # Comma-separated list of super admins
INTERNAL_ALLOWED_DOMAINS="megicode.com" # Optional: restrict to company domain
```

## 3. Database Migration

The `users` table has been updated with `status` and `jobTitle`.
Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

## 4. Features

- **Login Page**: `/internal/login` - Custom branded login page with Google OAuth and Quick Login option.
- **Quick Login**: Available on login page for authorized users (bypasses Google OAuth for faster access).
- **Onboarding**: New users are redirected to `/internal/onboarding` to set their Job Title.
- **Auto-Approval for Admins**: Users listed in `INTERNAL_ADMIN_EMAILS` are automatically set to `active` status.
- **Approval Flow**: Non-admin users start with `pending` status. They see a "Pending Approval" screen until an admin activates them.
- **User Management**: Admins can manage users at `/internal/admin/users`.
