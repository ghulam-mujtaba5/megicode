/**
 * Enhanced Financial Data Models & Types
 * Comprehensive type definitions with financial domain modeling
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type Currency = string & { readonly __brand: 'Currency' };

export function createCurrency(code: string): Currency {
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error(`Invalid currency code: ${code}`);
  }
  return code as Currency;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum RecurrenceInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

// ============================================================================
// FOUNDER & EQUITY
// ============================================================================

export interface Founder {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profitSharePercentage: number;
  equityPercentage: number;
  joiningDate: Date;
  status: 'active' | 'inactive' | 'departed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquityAllocation {
  founderId: string;
  founderName: string;
  percentage: number;
  shares?: number;
  vestingSchedule?: {
    startDate: Date;
    endDate: Date;
    cliffMonths: number;
    monthlyVestingPercentage: number;
  };
}

// ============================================================================
// ACCOUNTS & BALANCE
// ============================================================================

export enum AccountType {
  COMPANY_CENTRAL = 'company_central',
  FOUNDER_PERSONAL = 'founder_personal',
  OPERATIONS = 'operations',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  ESCROW = 'escrow',
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  iban?: string;
  swiftCode?: string;
}

export interface WalletDetails {
  provider: string;
  address: string;
  network?: string;
}

export interface CompanyAccount {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  currentBalance: number;
  availableBalance: number;
  bankDetails?: BankDetails;
  walletDetails?: WalletDetails;
  founderId?: string; // For founder personal accounts
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
  lastReconciliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceHistoy {
  accountId: string;
  date: Date;
  balance: number;
  changeAmount: number;
  changeType: TransactionType;
  reference?: string;
}

// ============================================================================
// EXPENSES & BUDGETS
// ============================================================================

export enum ExpenseCategory {
  SALARY = 'salary',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  TECHNOLOGY = 'technology',
  INFRASTRUCTURE = 'infrastructure',
  LEGAL = 'legal',
  ACCOUNTING = 'accounting',
  UTILITIES = 'utilities',
  RENT = 'rent',
  TRAVEL = 'travel',
  MEALS = 'meals',
  ENTERTAINMENT = 'entertainment',
  OFFICE_SUPPLIES = 'office_supplies',
  EQUIPMENT = 'equipment',
  DOMAIN = 'domain',
  OTHER = 'other',
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  vendor?: string;
  expenseDate: Date;
  recordedDate: Date;
  projectId?: string;
  paidByFounderId?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  invoiceNumber?: string;
  status: TransactionStatus;
  isRecurring: boolean;
  recurringInterval?: RecurrenceInterval;
  recurringEndDate?: Date;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  category: ExpenseCategory;
  allocatedAmount: number;
  currency: Currency;
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  responsiblePerson?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetVariance {
  budgetId: string;
  period: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentageVariance: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

// ============================================================================
// REVENUE & SUBSCRIPTIONS
// ============================================================================

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export interface Subscription {
  id: string;
  name: string;
  provider?: string;
  amount: number;
  currency: Currency;
  billingCycle: RecurrenceInterval;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  category?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Revenue {
  id: string;
  source: string;
  amount: number;
  currency: Currency;
  date: Date;
  type: 'subscription' | 'one_time' | 'service' | 'product' | 'investment';
  clientId?: string;
  invoiceNumber?: string;
  description?: string;
  paymentMethod?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CONTRIBUTIONS & DISTRIBUTIONS
// ============================================================================

export interface Contribution {
  id: string;
  founderId: string;
  founderName: string;
  amount: number;
  currency: Currency;
  date: Date;
  type: 'cash' | 'equipment' | 'service' | 'other';
  description?: string;
  receiptUrl?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Distribution {
  id: string;
  period: string;
  totalAmount: number;
  currency: Currency;
  distributions: Array<{
    founderId: string;
    founderName: string;
    amount: number;
    percentage: number;
  }>;
  status: TransactionStatus;
  distributedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FINANCIAL METRICS & KPIs
// ============================================================================

export interface FinancialMetrics {
  // Income Statement Metrics
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  operatingProfit: number;
  operatingMargin: number;
  netIncome: number;
  netMargin: number;

  // Cash Flow Metrics
  monthlyRecurringRevenue: number;
  monthlyExpenses: number;
  monthlyCashBurn: number;
  cashPosition: number;
  runwayMonths: number;
  runwayDate: Date;

  // Balance Sheet Metrics
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  investorEquity: number;
  founderEquity: number;

  // Efficiency Metrics
  expenseRatio: number;
  profitabilityScore: number;
  healthScore: number; // 0-100

  // Period
  period: string;
  timestamp: Date;
}

export interface KPI {
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  target?: number;
  status: 'healthy' | 'warning' | 'critical';
}

// ============================================================================
// FINANCIAL STATEMENTS
// ============================================================================

export interface BeforeStatement {
  assets: Array<{
    category: string;
    items: Array<{ name: string; amount: number }>;
  }>;
  liabilities: Array<{
    category: string;
    items: Array<{ name: string; amount: number }>;
  }>;
  equity: Array<{
    category: string;
    items: Array<{ name: string; amount: number }>;
  }>;
  period: string;
  currency: Currency;
}

export interface IncomeStatement {
  revenue: {
    totalRevenue: number;
    breakdown: Array<{ source: string; amount: number }>;
  };
  expenses: {
    totalExpenses: number;
    breakdown: Array<{ category: string; amount: number }>;
  };
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  netIncome: number;
  period: string;
  currency: Currency;
}

export interface CashFlowStatement {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netChange: number;
  beginningBalance: number;
  endingBalance: number;
  period: string;
  currency: Currency;
}

// ============================================================================
// TRANSACTIONS & JOURNAL ENTRIES
// ============================================================================

export interface JournalEntryLine {
  accountCode: string;
  accountName: string;
  debit?: number;
  credit?: number;
  description?: string;
  costCenter?: string;
}

export interface JournalEntry {
  id: string;
  date: Date;
  type: TransactionType;
  description: string;
  baseCurrency: Currency;
  lines: JournalEntryLine[];
  reference?: string;
  attachments?: string[];
  status: TransactionStatus;
  createdByUserId: string;
  approvedByUserId?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// RECONCILIATION
// ============================================================================

export interface BankReconciliation {
  id: string;
  accountId: string;
  periodStart: Date;
  periodEnd: Date;
  bankBalance: number;
  bookBalance: number;
  differenceAmount: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  reconciliationItems: Array<{
    itemId: string;
    date: Date;
    amount: number;
    itemType: 'check' | 'deposit' | 'transfer' | 'fee';
    status: 'outstanding' | 'cleared';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

export interface AuditTrailEntry {
  id: string;
  entityType: string; // 'expense', 'founder', 'account', etc.
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve';
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  changes?: {
    field: string;
    before: any;
    after: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceReport {
  period: string;
  generatedAt: Date;
  standards: Array<{
    name: string; // 'GAAP', 'IFRS', etc.
    compliant: boolean;
    issues: string[];
  }>;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface DashboardData {
  metrics: FinancialMetrics;
  kpis: KPI[];
  recentTransactions: JournalEntry[];
  topExpenses: Expense[];
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
    action?: string;
  }>;
}

export default {
  TransactionType,
  TransactionStatus,
  RecurrenceInterval,
  AccountType,
  ExpenseCategory,
  SubscriptionStatus,
};
