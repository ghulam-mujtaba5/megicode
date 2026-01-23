# Turso Database Setup & Founder Management System

## ✅ What's Already Configured

Your project already has a **complete, production-ready** Turso-backed founder and financial management system with full editability. Here's what's in place:

### Database Setup
- ✅ Turso/LibSQL client configured in `lib/db/index.ts`
- ✅ Database schema with `founders`, `companyAccounts`, and `founderContributions` tables
- ✅ Drizzle ORM for type-safe database operations
- ✅ Transaction support for atomic financial operations

### API Endpoints (Already Built)
- ✅ `GET /api/internal/finance/founders` - List all founders with aggregated totals
- ✅ `POST /api/internal/finance/founders` - Create new founder
- ✅ `PUT /api/internal/finance/founders/[id]` - Update founder (email, phone, profit share)
- ✅ `DELETE /api/internal/finance/founders/[id]` - Delete founder
- ✅ `GET /api/internal/finance/accounts` - List company accounts
- ✅ `POST /api/internal/finance/accounts` - Create account
- ✅ `GET /api/internal/finance/contributions` - List contributions
- ✅ `POST /api/internal/finance/contributions` - Record contribution

### UI Components (Already Built)
- ✅ **Fully Editable Founder Page** at `/internal/finance/founders`
  - Real-time founder management interface
  - Add/edit/delete founders
  - Visual profit share distribution
  - View contribution and distribution totals
  - Responsive table with inline actions
  
- ✅ **About Page Display** at `/about`
  - Shows founder information with financial details
  - Displays equity share percentages
  - Shows investment totals

### Database Scripts
- ✅ `npm run db:setup` - Complete initialization (migrate + seed)
- ✅ `npm run db:seed` - Populate with sample founder data
- ✅ `npm run db:migrate-turso` - Verify Turso connection and schema

---

## 🚀 Quick Start

### Step 1: Configure Environment Variables

Create or update `.env.local`:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://megicode-internal-megicode.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin credentials (for testing)
ADMIN_EMAIL=admin@megicode.com
ADMIN_PASSWORD=initial_password_here
```

> **Where to get tokens:**
> 1. Go to [Turso Dashboard](https://dashboard.turso.io)
> 2. Select your database "megicode-internal"
> 3. Copy the **Database URL** (libsql://...)
> 4. Generate an **Auth Token** from the Database settings
> 5. Copy both to `.env.local`

### Step 2: Initialize Database

```bash
# Option A: Complete setup (migrate + seed all data)
npm run db:setup

# Option B: Just verify connection
npm run db:migrate-turso

# Option C: Just seed sample data
npm run db:seed
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Access the Founder Management Interface

1. Go to `http://localhost:3000/internal/finance/founders`
2. Login with admin credentials (set in env)
3. Start managing founders!

---

## 📊 Founder Management Features

### Adding a Founder

1. Click **"+ Add Founder"** button
2. Fill in:
   - Full Name (required)
   - Email (optional)
   - Phone (optional)
   - Profit Share % (0-100, required)
   - Notes (optional)
3. Click **"Add Founder"**
4. System validates profit shares total ~100%

### Editing a Founder

1. Find founder in table
2. Click edit icon (pencil)
3. Modify any field
4. Click **"Update Founder"**

### Deleting a Founder

1. In the founders list, click delete action
2. Confirm deletion
3. All associated data is preserved for auditing

### Viewing Financial Details

**On About Page** (`/about`):
- Scroll to "Our Team" section
- See founder profiles with:
  - Profit share percentage
  - Initial investment amount
  - Total contributions (PKR)
  - Account information
  - Join date

**On Finance Portal** (`/internal/finance/founders`):
- View complete financial summary
- Total active founders
- Total profit shares allocated
- Aggregated contribution totals

---

## 💾 Seed Data

Sample seed data includes:

### Founders
- **Ghulam Mujtaba** - 50% profit share
  - Initial Investment: 50,000 PKR
  - Additional Capital: 25,000 PKR
  - Account: HBL (Primary)
  
- **Azan Wahla** - 50% profit share
  - Initial Investment: 50,000 PKR
  - Additional Capital: 30,000 PKR
  - Account: JazzCash

### Company Accounts
- **Megicode Central** (company_central) - 155,000 PKR
- **HBL Business** (founder_personal) - Ghulam's account
- **JazzCash Wallet** (founder_personal) - Azan's account

### Contributions Tracked
- 4 contribution entries totaling 155,000 PKR
- All marked as "confirmed"
- Full audit trail with timestamps

---

## 🔧 API Reference

### List Founders
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/internal/finance/founders
```

Response:
```json
{
  "founders": [
    {
      "id": "founder-id-1",
      "name": "Ghulam Mujtaba",
      "email": "ghulam@megicode.com",
      "profitSharePercentage": 50,
      "status": "active",
      "totalContributions": 7500000,
      "totalDistributions": 1250000,
      "joinedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### Create Founder
```bash
curl -X POST http://localhost:3000/api/internal/finance/founders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Founder",
    "email": "new@megicode.com",
    "profitSharePercentage": 30
  }'
```

### Update Founder
```bash
curl -X PUT http://localhost:3000/api/internal/finance/founders/founder-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@megicode.com",
    "profitSharePercentage": 40
  }'
```

### Delete Founder
```bash
curl -X DELETE http://localhost:3000/api/internal/finance/founders/founder-id \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 File Structure

```
lib/
  db/
    index.ts                 ← Turso client configuration
    schema.ts               ← Database table definitions
    
app/
  api/
    internal/
      finance/
        founders/route.ts    ← Founder CRUD endpoints
        accounts/route.ts    ← Account management endpoints
        contributions/route.ts ← Contribution tracking
        
  internal/
    finance/
      founders/
        page.tsx             ← Full-featured management UI
        
  about/
    page.tsx                 ← About page with founder display
    
scripts/
  db-seed.ts               ← Sample data seeding
  db-migrate-turso.ts      ← Connection verification
```

---

## 🔐 Role-Based Access Control

All financial endpoints require authentication:

- **Admin role**: Full access to all founder/account operations
- **PM role**: View-only access (GET requests)
- **Other roles**: Denied

```typescript
// In API routes, this is enforced:
await requireRole(['admin', 'pm']);
```

---

## 🧪 Verification Commands

### Check Database Connection
```bash
npm run db:migrate-turso
```

Output:
```
✅ Turso Database Connection Status
   Connected to: libsql://megicode-internal-*.turso.io
   Tables: 20+
   Schema: ✓ Valid
   Status: Ready for operations
```

### View Database Tables
```bash
# Via CLI:
turso db shell megicode-internal

# Then run:
.tables
SELECT COUNT(*) FROM founders;
SELECT COUNT(*) FROM company_accounts;
SELECT COUNT(*) FROM founder_contributions;
```

### Test Seed Script
```bash
npm run db:seed
```

---

## ⚠️ Troubleshooting

### "Missing environment variable: TURSO_DATABASE_URL"
**Fix:** Ensure `.env.local` has `TURSO_DATABASE_URL` set correctly

### "Cannot find module '@libsql/client'"
**Fix:** Run `npm install` to ensure all dependencies are installed

### "Failed to fetch founders"
**Fix:** 
1. Verify you're logged in (admin role required)
2. Check database connection: `npm run db:migrate-turso`
3. Check browser console for error details

### "Profit share percentage must sum to 100%"
**Info:** This is a warning, not an error. You can set any percentages you want. The UI will show a warning if total ≠ 100%.

### Migrations Needed
```bash
# If you see schema mismatch errors:
npm run db:push  # Apply Drizzle migrations
npm run db:setup # Re-initialize everything
```

---

## 📈 Financial Data Management

### Contribution Types
- **initial_investment** - Founder's initial capital
- **additional_capital** - Subsequent capital injections
- **loan_to_company** - Loan provided by founder
- **expense_reimbursement** - Reimbursed expenses

### Account Types
- **company_central** - Main operational account
- **founder_personal** - Individual founder accounts
- **operations** - Day-to-day operating funds
- **savings** - Reserve funds

### Currency Support
Currently supports:
- **PKR** (Pakistani Rupees) - Default
- Others can be added (EUR, USD, etc.)

---

## 🚨 Important Notes

1. **Data Persistence**: All changes are automatically saved to Turso database
2. **Audit Trail**: Every founder record has `createdAt`, `updatedAt` timestamps
3. **Soft Deletes**: Deleted founders can be recovered if needed
4. **Real-time Calculations**: Totals (contributions, distributions) calculated on-the-fly from linked records
5. **Transactions**: Financial operations use database transactions for consistency

---

## ✨ Next Steps

1. ✅ Configure `.env.local` with Turso credentials
2. ✅ Run `npm run db:setup` to initialize database
3. ✅ Access `/internal/finance/founders` to manage founders
4. ✅ View `/about` to see founder display
5. ✅ Integrate founder component into any other pages needed

---

## 📞 Support

For issues or questions:
1. Check `.env.local` configuration first
2. Verify Turso credentials are correct
3. Check database schema: `npm run db:migrate-turso`
4. Review browser console and server logs
5. Check API endpoint responses with cURL or Postman

---

## 🎯 Summary

Your founder and financial management system is **100% complete and production-ready**:

- ✅ Database tables and schema
- ✅ API endpoints for CRUD operations
- ✅ Full-featured UI with real-time editing
- ✅ Role-based access control
- ✅ Comprehensive seeding scripts
- ✅ Error handling and validation
- ✅ About page integration
- ✅ Turso database configured

**Just configure `.env.local` and run `npm run db:setup` to get started!**
