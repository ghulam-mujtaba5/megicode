# Founder & Financial Management System - Complete Setup Guide

## Overview

This guide covers the complete setup and usage of the editable founder and financial management system with Turso database support.

## 📋 Table of Contents

1. [Environment Setup](#environment-setup)
2. [Database Migration](#database-migration)
3. [Data Seeding](#data-seeding)
4. [API Endpoints](#api-endpoints)
5. [Frontend Integration](#frontend-integration)
6. [Usage Examples](#usage-examples)

## Environment Setup

### 1. Configure Turso Database

Create a Turso database account at [turso.tech](https://turso.tech) and get your credentials.

### 2. Set Environment Variables

Create or update `.env.local`:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=libsql://your-database-name-username.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Optional: Development/Testing
DATABASE_URL=file:./turso.db
```

### 3. Verify Connection

```bash
npm run db:migrate-turso
```

This will check:
- ✅ Database connectivity
- ✅ Table existence
- ✅ Schema integrity

## Database Migration

### Run Turso Migration

```bash
npm run db:migrate-turso
```

**Output:**
```
🔄 Starting Turso Migration...

📋 Checking table status...
   Found tables: founders, company_accounts, founder_contributions

✅ Verifying schema integrity...
   ✓ founders: 2 records
   ✓ company_accounts: 3 records
   ✓ founder_contributions: 4 records

📊 Database Status:
   URL: libsql://your-database-name-username.turso.io
   Auth Token: ✓ Set
   Status: ✅ Connected

✅ Migration completed successfully!
```

## Data Seeding

### Complete Setup (Migration + Seed)

```bash
npm run db:setup
```

This runs:
1. `db:migrate-turso` - Verifies database connection
2. `db:seed` - Populates with founders, accounts, and contributions

### Seed Data Created

**Founders:**
- Ghulam Mujtaba (CTO) - 50% equity
- Azan Wahla (CEO) - 50% equity

**Company Accounts:**
- Megicode Central Account (HBL) - ₨500,000
- Ghulam's Personal Account (JazzCash) - ₨250,000
- Azan's Personal Account (EasyPaisa) - ₨250,000

**Initial Contributions:**
- Ghulam: ₨50,000 initial + ₨25,000 additional = ₨75,000 total
- Azan: ₨50,000 initial + ₨30,000 additional = ₨80,000 total

## API Endpoints

All endpoints require authentication. Use role-based access control.

### Founders Management

#### GET `/api/internal/finance/founders`
Fetch all founders with stats

**Response:**
```json
{
  "founders": [
    {
      "id": "founder-id",
      "name": "Ghulam Mujtaba",
      "email": "ghulam@megicode.com",
      "phone": "+92-300-1234567",
      "profitSharePercentage": 50,
      "status": "active",
      "joinedAt": "2024-01-15T00:00:00Z",
      "notes": "CTO",
      "totalContributions": 75000,
      "totalDistributions": 0
    }
  ]
}
```

#### POST `/api/internal/finance/founders`
Create a new founder

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@megicode.com",
  "phone": "+92-300-9999999",
  "profitSharePercentage": 25,
  "notes": "New Co-founder"
}
```

**Response:**
```json
{
  "founder": {
    "id": "new-founder-id",
    "name": "John Doe",
    "profitSharePercentage": 25,
    "status": "active"
  }
}
```

#### PUT `/api/internal/finance/founders?id=<founder-id>`
Update a founder

**Request:**
```json
{
  "name": "John Doe Updated",
  "profitSharePercentage": 30,
  "status": "inactive"
}
```

#### DELETE `/api/internal/finance/founders?id=<founder-id>`
Delete a founder

### Company Accounts Management

#### GET `/api/internal/finance/accounts`
Fetch all accounts

**Response:**
```json
{
  "accounts": [
    {
      "id": "account-id",
      "name": "Megicode Central Account",
      "accountType": "company_central",
      "bankName": "HBL",
      "accountNumber": "**** 2891",
      "currency": "PKR",
      "currentBalance": 50000000,
      "status": "active",
      "isPrimary": true
    }
  ]
}
```

#### POST `/api/internal/finance/accounts`
Create a new account

**Request:**
```json
{
  "name": "Operations Account",
  "accountType": "operations",
  "bankName": "UBL",
  "accountNumber": "**** 5678",
  "currency": "PKR",
  "currentBalance": 1000000,
  "isPrimary": false
}
```

#### PUT `/api/internal/finance/accounts/<account-id>`
Update an account

#### DELETE `/api/internal/finance/accounts/<account-id>`
Delete an account

### Contributions Tracking

#### GET `/api/internal/finance/contributions`
Fetch all contributions

**Query Parameters:**
- `founderId` - Filter by founder (optional)

**Response:**
```json
{
  "contributions": [
    {
      "id": "contrib-id",
      "founderId": "founder-id",
      "founderName": "Ghulam Mujtaba",
      "amount": 50000,
      "currency": "PKR",
      "contributionType": "initial_investment",
      "purpose": "Domain, hosting, infrastructure setup",
      "accountName": "Megicode Central Account",
      "status": "confirmed",
      "contributedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "summary": [
    {
      "founderId": "founder-id",
      "founderName": "Ghulam Mujtaba",
      "totalContributions": 75000,
      "contributionCount": 2
    }
  ]
}
```

#### POST `/api/internal/finance/contributions`
Record a new contribution

**Request:**
```json
{
  "founderId": "founder-id",
  "amount": 100000,
  "currency": "PKR",
  "contributionType": "additional_capital",
  "purpose": "Marketing and business development",
  "toAccountId": "account-id",
  "notes": "Q1 growth investment"
}
```

## Frontend Integration

### Using the Finance Utilities Library

```typescript
import {
  fetchFounders,
  createFounder,
  updateFounder,
  deleteFounder,
  fetchAccounts,
  createAccount,
  fetchContributions,
  calculateFounderStats,
  formatAmount,
  validateFounder,
} from '@/lib/finance/founders';

// Fetch all founders
const founders = await fetchFounders();

// Create new founder
const newFounder = await createFounder({
  name: 'Jane Smith',
  email: 'jane@megicode.com',
  profitSharePercentage: 20,
});

// Update founder
await updateFounder(founderId, {
  profitSharePercentage: 25,
  status: 'inactive',
});

// Calculate statistics
const stats = calculateFounderStats(founders);
console.log(`Total: ${stats.totalFounders}, Active: ${stats.activeFounders}, Equity: ${stats.totalEquity}%`);

// Format amount
console.log(formatAmount(75000, 'PKR')); // Output: ₨ 750.00
```

## Usage Examples

### Example 1: Complete Founder Setup

```typescript
// 1. Create founder
const founder = await createFounder({
  name: 'Sarah Khan',
  email: 'sarah@megicode.com',
  phone: '+92-300-8888888',
  profitSharePercentage: 20,
  notes: 'Operations Manager',
});

// 2. Create personal account
const account = await createAccount({
  name: `${founder.name} Personal Account`,
  accountType: 'founder_personal',
  founderId: founder.id,
  walletProvider: 'JazzCash',
  currency: 'PKR',
  currentBalance: 0,
  isPrimary: true,
});

// 3. Record initial contribution
const contribution = await createContribution({
  founderId: founder.id,
  amount: 100000,
  currency: 'PKR',
  contributionType: 'initial_investment',
  purpose: 'Initial capital contribution',
  toAccountId: account.id,
});
```

### Example 2: Fetch and Display Founder Stats

```typescript
const founders = await fetchFounders();
const accounts = await fetchAccounts();
const contributions = await fetchContributions();

// Calculate totals
const stats = calculateFounderStats(founders);
const totalCapital = contributions.reduce((sum, c) => sum + c.amount, 0);
const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

console.log(`
Founder Statistics:
- Total Founders: ${stats.totalFounders}
- Active Founders: ${stats.activeFounders}
- Total Equity: ${stats.totalEquity}%
- Average Equity: ${stats.averageEquity.toFixed(1)}%

Financial Overview:
- Total Contributions: ${formatAmount(totalCapital)}
- Total Account Balance: ${formatAmount(totalBalance)}
`);
```

### Example 3: Export Data to CSV

```typescript
import { exportToCSV } from '@/lib/finance/founders';

const founders = await fetchFounders();
const accounts = await fetchAccounts();

const csv = exportToCSV(founders, accounts);
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'founders-export.csv';
link.click();
```

## Error Handling

All functions throw errors with descriptive messages:

```typescript
try {
  const founder = await updateFounder(founderId, updates);
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to update founder:', error.message);
  }
}
```

## Troubleshooting

### Database Connection Issues

```bash
# Check environment variables
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN

# Test connection
npm run db:migrate-turso
```

### Seed Data Not Appearing

```bash
# Clear and reseed
npm run db:seed
```

### API Endpoints Returning 403

- Ensure you're authenticated
- Check user role permissions
- Verify NEXTAUTH_SECRET is set

## Best Practices

1. ✅ Always validate data before submission
2. ✅ Use try-catch blocks for async operations
3. ✅ Maintain referential integrity (founders ↔ accounts ↔ contributions)
4. ✅ Keep equity percentages totaling 100%
5. ✅ Document all changes in notes field
6. ✅ Regular backups of Turso database
7. ✅ Audit trail for financial transactions

## Support

For issues or questions:
1. Check the API response error messages
2. Review database logs
3. Verify all environment variables
4. Consult Turso documentation: https://docs.turso.tech

---

**Last Updated:** January 2026
