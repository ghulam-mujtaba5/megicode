/**
 * Enterprise Financial Accounting Types
 * Silicon Valley Standards - GAAP/IFRS Compliant
 * Real-time Analytics & Compliance Grade
 */

// ============================================================================
// FUNDAMENTAL ACCOUNTING TYPES
// ============================================================================

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR' | 'PKR';
export type AccountType = 
  | 'asset' 
  | 'liability' 
  | 'equity' 
  | 'revenue' 
  | 'expense' 
  | 'cost_of_goods_sold' 
  | 'gain' 
  | 'loss';

export type AssetClassification = 
  | 'current_asset' 
  | 'fixed_asset' 
  | 'intangible_asset' 
  | 'other_asset';

export type TransactionType = 
  | 'journal_entry'
  | 'invoice'
  | 'payment'
  | 'expense'
  | 'transfer'
  | 'adjustment'
  | 'accrual'
  | 'depreciation'
  | 'tax_provision'
  | 'reversal';

export type TransactionStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'posted' 
  | 'reversed' 
  | 'cancelled';

export type ComplianceStandard = 'GAAP' | 'IFRS' | 'IFRS_SME' | 'LOCAL';

export type DepreciationMethod = 
  | 'straight_line' 
  | 'declining_balance' 
  | 'units_of_production' 
  | 'sum_of_years_digits';

export type BudgetStatus = 'draft' | 'submitted' | 'approved' | 'active' | 'closed' | 'archived';

export type ForecastType = 'conservative' | 'base_case' | 'optimistic' | 'scenario';

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';

// ============================================================================
// CHART OF ACCOUNTS
// ============================================================================

export interface GeneralLedgerAccount {
  id: string;
  accountCode: string; // e.g., 1000-100 (asset-cash)
  accountName: string;
  accountType: AccountType;
  classification: AssetClassification | null;
  currency: CurrencyCode;
  description: string | null;
  codeSegment: string; // First segment for grouping (e.g., "1000")
  subSegment: string; // Second segment for detail (e.g., "100")
  normalBalance: 'debit' | 'credit';
  isActive: boolean;
  isRestricted: boolean;
  department: string | null;
  costCenter: string | null;
  parent_account_id: string | null; // For hierarchical COA
  requires_intercompany_ref: boolean;
  requires_project_ref: boolean;
  requires_cost_center_ref: boolean;
  depreciation_method: DepreciationMethod | null;
  useful_life_years: number | null;
  residual_value: number | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// JOURNAL ENTRIES & DOUBLE-ENTRY BOOKKEEPING
// ============================================================================

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountCode: string;
  debit: number; // In base currency (cents)
  credit: number;
  description: string | null;
  quantity: number | null; // For inventory tracking
  unitPrice: number | null;
  projectId: string | null;
  costCenterId: string | null;
  departmentId: string | null;
  intercompanyPartnerId: string | null;
  lineNumber: number;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // Unique auto-incremented number
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  referenceDocument: string | null; // Invoice#, PO#, etc.
  baseCurrency: CurrencyCode;
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  lines: JournalEntryLine[];
  approvedByUserId: string | null;
  postedByUserId: string | null;
  approvedAt: Date | null;
  postedAt: Date | null;
  reversalOfId: string | null; // If this reverses another entry
  period: string; // e.g., "2024-01"
  memo: string | null;
  attachmentIds: string[];
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SUB-LEDGERS & AUXILIARY LEDGERS
// ============================================================================

export interface AccountsReceivableSubLedger {
  id: string;
  customerId: string;
  invoiceId: string;
  originalAmount: number; // cents
  currency: CurrencyCode;
  dueDate: Date;
  invoiceDate: Date;
  appliedPayments: Array<{
    paymentId: string;
    amount: number;
    date: Date;
  }>;
  outstandingBalance: number;
  isOverdue: boolean;
  daysPastDue: number;
  carryForwardBal: number | null;
  status: 'open' | 'partial_paid' | 'paid' | 'written_off';
  writeOffAmount: number | null;
  writeOffReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountsPayableSubLedger {
  id: string;
  vendorId: string;
  invoiceId: string;
  purchaseOrderId: string | null;
  originalAmount: number; // cents
  currency: CurrencyCode;
  dueDate: Date;
  invoiceDate: Date;
  discountAmount: number | null;
  discountDeadline: Date | null;
  appliedPayments: Array<{
    paymentId: string;
    amount: number;
    date: Date;
  }>;
  outstandingBalance: number;
  status: 'open' | 'partial_paid' | 'paid' | 'disputed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MULTI-CURRENCY & EXCHANGE RATES
// ============================================================================

export interface ExchangeRate {
  id: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number; // Precise decimal rate
  effectiveDate: Date;
  source: 'ecb' | 'fed' | 'manual' | 'api';
  rateType: 'spot' | 'forward' | 'averaged';
  isOfficial: boolean;
  createdAt: Date;
}

export interface CurrencyTransaction {
  id: string;
  journalEntryId: string;
  originalCurrency: CurrencyCode;
  baseCurrency: CurrencyCode;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
  exchangeGainLoss: number | null;
  unrealizedGainLoss: number | null;
  createdAt: Date;
}

// ============================================================================
// INVOICING & BILLING
// ============================================================================

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number; // cents
  amount: number; // cents
  taxCode: string | null;
  taxAmount: number;
  accountId: string;
  projectId: string | null;
  costCenterId: string | null;
  lineNumber: number;
  metadata: Record<string, any>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  referenceNumber: string | null;
  customerId: string;
  projectId: string | null;
  issuedDate: Date;
  dueDate: Date;
  paidDate: Date | null;
  currency: CurrencyCode;
  exchangeRate: number | null;
  subtotal: number; // cents
  discountAmount: number;
  discountReason: string | null;
  taxableAmount: number;
  taxDetails: TaxBreakdown;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
  status: 'draft' | 'issued' | 'sent' | 'viewed' | 'partial_paid' | 'paid' | 'overdue' | 'written_off' | 'cancelled';
  paymentTerms: string; // e.g., "Net 30"
  lineItems: InvoiceLineItem[];
  notes: string | null;
  internalNotes: string | null;
  attachmentIds: string[];
  isRecurring: boolean;
  recurringTemplateId: string | null;
  poProjectNumber: string | null;
  shipToAddress: Address | null;
  billToAddress: Address | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxBreakdown {
  taxCode: string;
  taxRate: number; // e.g., 0.10 for 10%
  taxableBase: number;
  taxAmount: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ============================================================================
// PAYMENTS & CASH FLOW
// ============================================================================

export interface Payment {
  id: string;
  paymentNumber: string;
  date: Date;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'check' | 'paypal' | 'cryptocurrency' | 'cash' | 'wire_transfer';
  amount: number; // cents
  currency: CurrencyCode;
  status: 'draft' | 'pending' | 'cleared' | 'failed' | 'cancelled' | 'refunded';
  fromAccountId: string;
  toAccountId: string | null; // For vendor payments
  payeeId: string | null;
  invoiceIds: string[]; // Multiple invoices can be paid
  referenceNumber: string | null;
  reconciliationStatus: 'unreconciled' | 'reconciled' | 'disputed';
  bankStatementLineId: string | null;
  notes: string | null;
  approvedByUserId: string | null;
  approvedAt: Date | null;
  processedByUserId: string | null;
  processedAt: Date | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CashFlowProjection {
  id: string;
  projectId: string;
  forecastType: ForecastType;
  period: string; // "2024-01"
  beginingCash: number;
  operatingCash: number;
  investingCash: number;
  financingCash: number;
  endingCash: number;
  confidence: number; // 0-100
  assumptions: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FIXED ASSETS & DEPRECIATION
// ============================================================================

export interface FixedAsset {
  id: string;
  assetCode: string;
  assetName: string;
  description: string | null;
  category: string;
  accountId: string;
  cost: number; // cents
  salvageValue: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears: number;
  acquiredDate: Date;
  disposalDate: Date | null;
  accumulatedDepreciation: number;
  bookValue: number;
  depreciationExpensePerPeriod: number;
  lastDepreciationDate: Date | null;
  location: string | null;
  serialNumber: string | null;
  status: 'active' | 'retired' | 'disposed' | 'impaired';
  createdAt: Date;
  updatedAt: Date;
}

export interface DepreciationSchedule {
  id: string;
  assetId: string;
  period: string;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  bookValue: number;
  status: 'scheduled' | 'posted' | 'reversed';
  postedAt: Date | null;
  createdAt: Date;
}

// ============================================================================
// TAX & COMPLIANCE
// ============================================================================

export interface TaxConfig {
  id: string;
  taxCode: string;
  taxName: string;
  taxRate: number;
  applicableAccountTypes: AccountType[];
  jurisdiction: string;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxLiability {
  id: string;
  period: string; // "2024-Q1"
  taxType: 'income_tax' | 'sales_tax' | 'payroll_tax' | 'property_tax' | 'other';
  jurisdictions: string[];
  calculatedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: Date;
  filingStatus: 'not_due' | 'due_soon' | 'pending' | 'filed' | 'paid' | 'amended';
  filedDate: Date | null;
  filedByUserName: string | null;
  filedDocumentUrl: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// BUDGETING & FORECASTING
// ============================================================================

export interface Budget {
  id: string;
  name: string;
  budgetCode: string;
  year: number;
  period: string; // "annual", "quarterly", "monthly"
  department: string;
  costCenter: string;
  status: BudgetStatus;
  lines: BudgetLine[];
  totalBudgeted: number;
  totalActual: number;
  totalVariance: number;
  variancePercentage: number;
  createdByUserId: string;
  approvedByUserId: string | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLine {
  id: string;
  budgetId: string;
  accountId: string;
  accountCode: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  notes: string | null;
}

export interface FinancialForecast {
  id: string;
  forecastType: ForecastType;
  period: string;
  lines: ForecastLine[];
  confidence: number; // 0-100
  assumptions: Record<string, any>;
  sensitivity: Record<string, number>; // Sensitivity analysis
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForecastLine {
  id: string;
  forecastId: string;
  accountId: string;
  amount: number;
  growth_rate: number;
  confidence_interval: number; // Standard deviation
}

// ============================================================================
// FINANCIAL STATEMENTS
// ============================================================================

export interface FinancialStatement {
  id: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'equity_statement';
  period: string; // "2024-01" or "2024-Q1" or "2024"
  generatedDate: Date;
  reportingCurrency: CurrencyCode;
  sections: FinancialStatementSection[];
  notes: string | null;
  auditStatus: 'unaudited' | 'reviewed' | 'audited';
  preparedByUserId: string;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

export interface FinancialStatementSection {
  id: string;
  sectionName: string;
  sectionOrder: number;
  lines: {
    accountCode: string;
    accountName: string;
    amount: number;
    percentage: number; // % of total
  }[];
  subtotal: number;
  parentSectionId: string | null;
}

// ============================================================================
// RECONCILIATION
// ============================================================================

export interface BankReconciliation {
  id: string;
  accountId: string;
  period: string;
  bankStatementDate: Date;
  bankStatementBalance: number;
  bookBalance: number;
  bankTransactions: BankTransactionMatch[];
  outstandingDeposits: number;
  outstandingChecks: number;
  reconciliationDifference: number;
  isReconciled: boolean;
  reconciledByUserId: string | null;
  reconciledAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankTransactionMatch {
  bankTransactionId: string;
  journalEntryId: string;
  amount: number;
  date: Date;
  status: 'matched' | 'pending' | 'rejected';
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

export interface AuditTrail {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  ipAddress: string | null;
  userAgent: string | null;
  status: 'success' | 'failure';
  errorMessage: string | null;
}

export interface ComplianceReport {
  id: string;
  name: string;
  reportingStandard: ComplianceStandard;
  reportPeriod: string;
  sections: ComplianceReportSection[];
  status: 'draft' | 'pending_review' | 'approved' | 'submitted';
  submittedDate: Date | null;
  preparedByUserId: string;
  reviewedByUserId: string | null;
  createdAt: Date;
}

export interface ComplianceReportSection {
  id: string;
  sectionName: string;
  controls: {
    name: string;
    status: 'compliant' | 'non_compliant' | 'remediation_plan';
    evidence: string;
    testedBy: string;
    testedDate: Date;
  }[];
}

// ============================================================================
// REAL-TIME ANALYTICS & KPIs
// ============================================================================

export interface FinancialKPI {
  id: string;
  kpiName: string;
  category: 'profitability' | 'liquidity' | 'efficiency' | 'leverage' | 'growth';
  value: number;
  targetValue: number;
  status: 'on_track' | 'warning' | 'critical';
  period: string;
  calculation: string;
  lastUpdated: Date;
}

export interface RealTimeFinancialMetrics {
  period: string;
  asOfDate: Date;
  metrics: {
    currentAssets: number;
    totalAssets: number;
    currentLiabilities: number;
    totalLiabilities: number;
    equity: number;
    revenue: number;
    expenses: number;
    netIncome: number;
    operatingCashFlow: number;
    freeCashFlow: number;
    debtToEquityRatio: number;
    currentRatio: number;
    quickRatio: number;
    workingCapital: number;
  };
}

// ============================================================================
// REVENUE RECOGNITION (ASC 606 / IFRS 15)
// ============================================================================

export interface RevenueContract {
  id: string;
  contractCode: string;
  customerId: string;
  contractValue: number;
  startDate: Date;
  endDate: Date;
  performanceObligations: PerformanceObligation[];
  recognitionMethod: 'point_in_time' | 'over_time';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceObligation {
  id: string;
  contractId: string;
  description: string;
  transactionPrice: number;
  recognitionStartDate: Date;
  recognitionEndDate: Date;
  recognitionSchedule: Array<{
    date: Date;
    amount: number;
    status: 'scheduled' | 'recognized' | 'reversed';
  }>;
}

// ============================================================================
// INTERCOMPANY ACCOUNTING
// ============================================================================

export interface IntercompanyTransaction {
  id: string;
  originatingCompanyId: string;
  receivingCompanyId: string;
  amount: number;
  currency: CurrencyCode;
  type: 'sale' | 'purchase' | 'transfer' | 'loan';
  date: Date;
  description: string;
  status: 'pending' | 'confirmed' | 'reconciled';
  eliminations: IntercompanyElimination[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IntercompanyElimination {
  id: string;
  transactionId: string;
  period: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  status: 'draft' | 'posted';
  postedAt: Date | null;
}

// ============================================================================
// FINANCIAL WORKFLOWS & APPROVALS
// ============================================================================

export interface ApprovalWorkflow {
  id: string;
  workflowName: string;
  entityType: string; // invoice, expense, journal_entry
  approvalLevels: ApprovalLevel[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalLevel {
  id: string;
  workflowId: string;
  levelNumber: number;
  roleRequired: string;
  amountThreshold: number | null;
  approverUserIds: string[];
  parallelApproval: boolean;
  escalationDays: number | null;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  currentLevel: number;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approvals: {
    level: number;
    approverUserId: string;
    action: 'approved' | 'rejected' | 'pending';
    comments: string | null;
    actionDate: Date | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialNotification {
  id: string;
  type: 'approval_required' | 'payment_due' | 'cash_flow_alert' | 'budget_variance' | 'tax_deadline' | 'reconciliation_needed' | 'invoice_overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipient: string;
  subject: string;
  message: string;
  metadata: Record<string, any>;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: Date;
  expiresAt: Date | null;
}
