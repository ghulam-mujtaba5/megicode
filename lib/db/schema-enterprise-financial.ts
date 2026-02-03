/**
 * Enterprise Financial Accounting Schema
 * Silicon Valley Grade - GAAP/IFRS Compliant
 * Real-time Analytics & Compliance Grade
 */

import { 
  sqliteTable, 
  text, 
  integer, 
  real,
  uniqueIndex, 
  index 
} from 'drizzle-orm/sqlite-core';

// ============================================================================
// CHART OF ACCOUNTS (Enterprise-Grade)
// ============================================================================

export const generalLedgerAccounts = sqliteTable(
  'general_ledger_accounts',
  {
    id: text('id').primaryKey(),
    accountCode: text('account_code').notNull().unique(),
    accountName: text('account_name').notNull(),
    accountType: text('account_type', {
      enum: ['asset', 'liability', 'equity', 'revenue', 'expense', 'cost_of_goods_sold', 'gain', 'loss']
    }).notNull(),
    classification: text('classification', {
      enum: ['current_asset', 'fixed_asset', 'intangible_asset', 'other_asset', null]
    }),
    currency: text('currency').notNull().default('USD'),
    description: text('description'),
    codeSegment: text('code_segment').notNull(), // First segment
    subSegment: text('sub_segment').notNull(), // Second segment
    normalBalance: text('normal_balance', { enum: ['debit', 'credit'] }).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    isRestricted: integer('is_restricted', { mode: 'boolean' }).notNull().default(false),
    department: text('department'),
    costCenter: text('cost_center'),
    parentAccountId: text('parent_account_id'),
    requiresIntercompanyRef: integer('requires_intercompany_ref', { mode: 'boolean' }).notNull().default(false),
    requiresProjectRef: integer('requires_project_ref', { mode: 'boolean' }).notNull().default(false),
    requiresCostCenterRef: integer('requires_cost_center_ref', { mode: 'boolean' }).notNull().default(false),
    depreciationMethod: text('depreciation_method', {
      enum: ['straight_line', 'declining_balance', 'units_of_production', 'sum_of_years_digits', null]
    }),
    usefulLifeYears: integer('useful_life_years'),
    residualValue: real('residual_value'),
    metadata: text('metadata').$type<Record<string, any>>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    codeIdx: index('gla_account_code_idx').on(table.accountCode),
    typeIdx: index('gla_account_type_idx').on(table.accountType),
    activeIdx: index('gla_is_active_idx').on(table.isActive),
    costCenterIdx: index('gla_cost_center_idx').on(table.costCenter),
  })
);

// ============================================================================
// JOURNAL ENTRIES (Double-Entry Bookkeeping)
// ============================================================================

export const journalEntries = sqliteTable(
  'journal_entries',
  {
    id: text('id').primaryKey(),
    entryNumber: text('entry_number').notNull().unique(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    type: text('type', {
      enum: ['journal_entry', 'invoice', 'payment', 'expense', 'transfer', 'adjustment', 'accrual', 'depreciation', 'tax_provision', 'reversal']
    }).notNull(),
    status: text('status', {
      enum: ['draft', 'pending_review', 'approved', 'posted', 'reversed', 'cancelled']
    }).notNull().default('draft'),
    description: text('description').notNull(),
    referenceDocument: text('reference_document'),
    baseCurrency: text('base_currency').notNull().default('USD'),
    totalDebit: integer('total_debit').notNull(),
    totalCredit: integer('total_credit').notNull(),
    isBalanced: integer('is_balanced', { mode: 'boolean' }).notNull().default(false),
    approvedByUserId: text('approved_by_user_id'),
    postedByUserId: text('posted_by_user_id'),
    approvedAt: integer('approved_at', { mode: 'timestamp_ms' }),
    postedAt: integer('posted_at', { mode: 'timestamp_ms' }),
    reversalOfId: text('reversal_of_id'),
    period: text('period').notNull(), // e.g., "2024-01"
    memo: text('memo'),
    attachmentIds: text('attachment_ids').$type<string[]>(),
    createdByUserId: text('created_by_user_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    dateIdx: index('je_date_idx').on(table.date),
    statusIdx: index('je_status_idx').on(table.status),
    periodIdx: index('je_period_idx').on(table.period),
    typeIdx: index('je_type_idx').on(table.type),
  })
);

export const journalEntryLines = sqliteTable(
  'journal_entry_lines',
  {
    id: text('id').primaryKey(),
    journalEntryId: text('journal_entry_id').notNull().references(() => journalEntries.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull().references(() => generalLedgerAccounts.id),
    accountCode: text('account_code').notNull(),
    debit: integer('debit').notNull().default(0),
    credit: integer('credit').notNull().default(0),
    description: text('description'),
    quantity: integer('quantity'),
    unitPrice: integer('unit_price'),
    projectId: text('project_id'),
    costCenterId: text('cost_center_id'),
    departmentId: text('department_id'),
    intercompanyPartnerId: text('intercompany_partner_id'),
    lineNumber: integer('line_number').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    journalIdx: index('jel_journal_entry_idx').on(table.journalEntryId),
    accountIdx: index('jel_account_idx').on(table.accountId),
  })
);

// ============================================================================
// SUB-LEDGERS (A/R & A/P)
// ============================================================================

export const accountsReceivableSubLedger = sqliteTable(
  'accounts_receivable_subledger',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id').notNull(),
    invoiceId: text('invoice_id').notNull(),
    originalAmount: integer('original_amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    dueDate: integer('due_date', { mode: 'timestamp_ms' }).notNull(),
    invoiceDate: integer('invoice_date', { mode: 'timestamp_ms' }).notNull(),
    outstandingBalance: integer('outstanding_balance').notNull(),
    isOverdue: integer('is_overdue', { mode: 'boolean' }).notNull().default(false),
    daysPastDue: integer('days_past_due').default(0),
    carryForwardBal: integer('carry_forward_bal'),
    status: text('status', {
      enum: ['open', 'partial_paid', 'paid', 'written_off']
    }).notNull().default('open'),
    writeOffAmount: integer('write_off_amount'),
    writeOffReason: text('write_off_reason'),
    appliedPayments: text('applied_payments').$type<Array<{ paymentId: string; amount: number; date: Date }>>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    customerIdx: index('arsl_customer_idx').on(table.customerId),
    invoiceIdx: index('arsl_invoice_idx').on(table.invoiceId),
    statusIdx: index('arsl_status_idx').on(table.status),
  })
);

export const accountsPayableSubLedger = sqliteTable(
  'accounts_payable_subledger',
  {
    id: text('id').primaryKey(),
    vendorId: text('vendor_id').notNull(),
    invoiceId: text('invoice_id').notNull(),
    purchaseOrderId: text('purchase_order_id'),
    originalAmount: integer('original_amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    dueDate: integer('due_date', { mode: 'timestamp_ms' }).notNull(),
    invoiceDate: integer('invoice_date', { mode: 'timestamp_ms' }).notNull(),
    discountAmount: integer('discount_amount'),
    discountDeadline: integer('discount_deadline', { mode: 'timestamp_ms' }),
    outstandingBalance: integer('outstanding_balance').notNull(),
    status: text('status', {
      enum: ['open', 'partial_paid', 'paid', 'disputed', 'cancelled']
    }).notNull().default('open'),
    appliedPayments: text('applied_payments').$type<Array<{ paymentId: string; amount: number; date: Date }>>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    vendorIdx: index('apsl_vendor_idx').on(table.vendorId),
    invoiceIdx: index('apsl_invoice_idx').on(table.invoiceId),
    statusIdx: index('apsl_status_idx').on(table.status),
  })
);

// ============================================================================
// MULTI-CURRENCY & EXCHANGE RATES
// ============================================================================

export const exchangeRates = sqliteTable(
  'exchange_rates',
  {
    id: text('id').primaryKey(),
    fromCurrency: text('from_currency').notNull(),
    toCurrency: text('to_currency').notNull(),
    rate: real('rate').notNull(),
    effectiveDate: integer('effective_date', { mode: 'timestamp_ms' }).notNull(),
    source: text('source', { enum: ['ecb', 'fed', 'manual', 'api'] }).notNull(),
    rateType: text('rate_type', { enum: ['spot', 'forward', 'averaged'] }).notNull().default('spot'),
    isOfficial: integer('is_official', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    currencyPairIdx: index('er_currency_pair_idx').on(table.fromCurrency, table.toCurrency),
    dateIdx: index('er_date_idx').on(table.effectiveDate),
  })
);

export const currencyTransactions = sqliteTable(
  'currency_transactions',
  {
    id: text('id').primaryKey(),
    journalEntryId: text('journal_entry_id').notNull().references(() => journalEntries.id),
    originalCurrency: text('original_currency').notNull(),
    baseCurrency: text('base_currency').notNull(),
    originalAmount: integer('original_amount').notNull(),
    convertedAmount: integer('converted_amount').notNull(),
    rate: real('rate').notNull(),
    exchangeGainLoss: integer('exchange_gain_loss'),
    unrealizedGainLoss: integer('unrealized_gain_loss'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    journalIdx: index('ct_journal_idx').on(table.journalEntryId),
  })
);

// ============================================================================
// INVOICING & BILLING (Enhanced)
// ============================================================================

export const invoiceLines = sqliteTable(
  'invoice_lines_enhanced',
  {
    id: text('id').primaryKey(),
    invoiceId: text('invoice_id').notNull(),
    description: text('description').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(), // cents
    amount: integer('amount').notNull(),
    taxCode: text('tax_code'),
    taxAmount: integer('tax_amount').default(0),
    accountId: text('account_id').notNull(),
    projectId: text('project_id'),
    costCenterId: text('cost_center_id'),
    lineNumber: integer('line_number').notNull(),
    metadata: text('metadata').$type<Record<string, any>>(),
  },
  (table) => ({
    invoiceIdx: index('il_invoice_idx').on(table.invoiceId),
    accountIdx: index('il_account_idx').on(table.accountId),
  })
);

export const invoicesEnhanced = sqliteTable(
  'invoices_enhanced',
  {
    id: text('id').primaryKey(),
    invoiceNumber: text('invoice_number').notNull().unique(),
    referenceNumber: text('reference_number'),
    customerId: text('customer_id').notNull(),
    projectId: text('project_id'),
    issuedDate: integer('issued_date', { mode: 'timestamp_ms' }).notNull(),
    dueDate: integer('due_date', { mode: 'timestamp_ms' }).notNull(),
    paidDate: integer('paid_date', { mode: 'timestamp_ms' }),
    currency: text('currency').notNull().default('USD'),
    exchangeRate: real('exchange_rate'),
    subtotal: integer('subtotal').notNull(),
    discountAmount: integer('discount_amount').default(0),
    discountReason: text('discount_reason'),
    taxableAmount: integer('taxable_amount').notNull(),
    taxDetails: text('tax_details').$type<Array<{ taxCode: string; taxRate: number; taxableBase: number; taxAmount: number }>>(),
    totalAmount: integer('total_amount').notNull(),
    totalPaid: integer('total_paid').default(0),
    totalOutstanding: integer('total_outstanding').notNull(),
    status: text('status', {
      enum: ['draft', 'issued', 'sent', 'viewed', 'partial_paid', 'paid', 'overdue', 'written_off', 'cancelled']
    }).notNull().default('draft'),
    paymentTerms: text('payment_terms'),
    notes: text('notes'),
    internalNotes: text('internal_notes'),
    attachmentIds: text('attachment_ids').$type<string[]>(),
    isRecurring: integer('is_recurring', { mode: 'boolean' }).notNull().default(false),
    recurringTemplateId: text('recurring_template_id'),
    poProjectNumber: text('po_project_number'),
    billToAddress: text('bill_to_address').$type<Record<string, any>>(),
    shipToAddress: text('ship_to_address').$type<Record<string, any>>(),
    createdByUserId: text('created_by_user_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    customerIdx: index('ie_customer_idx').on(table.customerId),
    statusIdx: index('ie_status_idx').on(table.status),
    dueDateIdx: index('ie_due_date_idx').on(table.dueDate),
  })
);

// ============================================================================
// PAYMENTS & CASH FLOW (Enhanced)
// ============================================================================

export const paymentsEnhanced = sqliteTable(
  'payments_enhanced',
  {
    id: text('id').primaryKey(),
    paymentNumber: text('payment_number').notNull().unique(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    paymentMethod: text('payment_method', {
      enum: ['bank_transfer', 'credit_card', 'check', 'paypal', 'cryptocurrency', 'cash', 'wire_transfer']
    }).notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    status: text('status', {
      enum: ['draft', 'pending', 'cleared', 'failed', 'cancelled', 'refunded']
    }).notNull().default('pending'),
    fromAccountId: text('from_account_id').notNull(),
    toAccountId: text('to_account_id'),
    payeeId: text('payee_id'),
    invoiceIds: text('invoice_ids').$type<string[]>(),
    referenceNumber: text('reference_number'),
    reconciliationStatus: text('reconciliation_status', {
      enum: ['unreconciled', 'reconciled', 'disputed']
    }).notNull().default('unreconciled'),
    bankStatementLineId: text('bank_statement_line_id'),
    notes: text('notes'),
    approvedByUserId: text('approved_by_user_id'),
    approvedAt: integer('approved_at', { mode: 'timestamp_ms' }),
    processedByUserId: text('processed_by_user_id'),
    processedAt: integer('processed_at', { mode: 'timestamp_ms' }),
    createdByUserId: text('created_by_user_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    dateIdx: index('pe_date_idx').on(table.date),
    statusIdx: index('pe_status_idx').on(table.status),
    fromAccountIdx: index('pe_from_account_idx').on(table.fromAccountId),
  })
);

export const cashFlowProjections = sqliteTable(
  'cash_flow_projections',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id'),
    forecastType: text('forecast_type', {
      enum: ['conservative', 'base_case', 'optimistic', 'scenario']
    }).notNull(),
    period: text('period').notNull(),
    beginningCash: integer('beginning_cash').notNull(),
    operatingCash: integer('operating_cash').notNull(),
    investingCash: integer('investing_cash').notNull(),
    financingCash: integer('financing_cash').notNull(),
    endingCash: integer('ending_cash').notNull(),
    confidence: integer('confidence').default(50), // 0-100
    assumptions: text('assumptions'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    periodIdx: index('cfp_period_idx').on(table.period),
    typeIdx: index('cfp_type_idx').on(table.forecastType),
  })
);

// ============================================================================
// FIXED ASSETS & DEPRECIATION
// ============================================================================

export const fixedAssets = sqliteTable(
  'fixed_assets',
  {
    id: text('id').primaryKey(),
    assetCode: text('asset_code').notNull().unique(),
    assetName: text('asset_name').notNull(),
    description: text('description'),
    category: text('category').notNull(),
    accountId: text('account_id').notNull().references(() => generalLedgerAccounts.id),
    cost: integer('cost').notNull(),
    salvageValue: integer('salvage_value').default(0),
    depreciationMethod: text('depreciation_method', {
      enum: ['straight_line', 'declining_balance', 'units_of_production', 'sum_of_years_digits']
    }).notNull(),
    usefulLifeYears: integer('useful_life_years').notNull(),
    acquiredDate: integer('acquired_date', { mode: 'timestamp_ms' }).notNull(),
    disposalDate: integer('disposal_date', { mode: 'timestamp_ms' }),
    accumulatedDepreciation: integer('accumulated_depreciation').notNull().default(0),
    bookValue: integer('book_value').notNull(),
    depreciationExpensePerPeriod: integer('depreciation_expense_per_period').notNull(),
    lastDepreciationDate: integer('last_depreciation_date', { mode: 'timestamp_ms' }),
    location: text('location'),
    serialNumber: text('serial_number'),
    status: text('status', {
      enum: ['active', 'retired', 'disposed', 'impaired']
    }).notNull().default('active'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    codeIdx: index('fa_code_idx').on(table.assetCode),
    statusIdx: index('fa_status_idx').on(table.status),
  })
);

export const depreciationSchedules = sqliteTable(
  'depreciation_schedules',
  {
    id: text('id').primaryKey(),
    assetId: text('asset_id').notNull().references(() => fixedAssets.id),
    period: text('period').notNull(),
    depreciationExpense: integer('depreciation_expense').notNull(),
    accumulatedDepreciation: integer('accumulated_depreciation').notNull(),
    bookValue: integer('book_value').notNull(),
    status: text('status', {
      enum: ['scheduled', 'posted', 'reversed']
    }).notNull().default('scheduled'),
    postedAt: integer('posted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    assetIdx: index('ds_asset_idx').on(table.assetId),
    periodIdx: index('ds_period_idx').on(table.period),
  })
);

// ============================================================================
// TAX & COMPLIANCE
// ============================================================================

export const taxConfigurations = sqliteTable(
  'tax_configurations',
  {
    id: text('id').primaryKey(),
    taxCode: text('tax_code').notNull().unique(),
    taxName: text('tax_name').notNull(),
    taxRate: real('tax_rate').notNull(),
    applicableAccountTypes: text('applicable_account_types').$type<string[]>(),
    jurisdiction: text('jurisdiction').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    effectiveFrom: integer('effective_from', { mode: 'timestamp_ms' }).notNull(),
    effectiveTo: integer('effective_to', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    codeIdx: index('tc_code_idx').on(table.taxCode),
    jurisdictionIdx: index('tc_jurisdiction_idx').on(table.jurisdiction),
  })
);

export const taxLiabilities = sqliteTable(
  'tax_liabilities',
  {
    id: text('id').primaryKey(),
    period: text('period').notNull(),
    taxType: text('tax_type', {
      enum: ['income_tax', 'sales_tax', 'payroll_tax', 'property_tax', 'other']
    }).notNull(),
    jurisdictions: text('jurisdictions').$type<string[]>(),
    calculatedAmount: integer('calculated_amount').notNull(),
    paidAmount: integer('paid_amount').default(0),
    outstandingAmount: integer('outstanding_amount').notNull(),
    dueDate: integer('due_date', { mode: 'timestamp_ms' }).notNull(),
    filingStatus: text('filing_status', {
      enum: ['not_due', 'due_soon', 'pending', 'filed', 'paid', 'amended']
    }).notNull().default('not_due'),
    filedDate: integer('filed_date', { mode: 'timestamp_ms' }),
    filedByUserName: text('filed_by_user_name'),
    filedDocumentUrl: text('filed_document_url'),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    periodIdx: index('tl_period_idx').on(table.period),
    typeIdx: index('tl_type_idx').on(table.taxType),
    filingStatusIdx: index('tl_filing_status_idx').on(table.filingStatus),
  })
);

// ============================================================================
// BUDGETING & FORECASTING  
// ============================================================================

export const budgets = sqliteTable(
  'budgets',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    budgetCode: text('budget_code').notNull().unique(),
    year: integer('year').notNull(),
    period: text('period').notNull(), // annual, quarterly, monthly
    department: text('department').notNull(),
    costCenter: text('cost_center'),
    status: text('status', {
      enum: ['draft', 'submitted', 'approved', 'active', 'closed', 'archived']
    }).notNull().default('draft'),
    totalBudgeted: integer('total_budgeted').notNull(),
    totalActual: integer('total_actual').default(0),
    totalVariance: integer('total_variance').default(0),
    variancePercentage: real('variance_percentage').default(0),
    createdByUserId: text('created_by_user_id').notNull(),
    approvedByUserId: text('approved_by_user_id'),
    approvedAt: integer('approved_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    codeIdx: index('b_code_idx').on(table.budgetCode),
    statusIdx: index('b_status_idx').on(table.status),
    yearIdx: index('b_year_idx').on(table.year),
  })
);

export const budgetLines = sqliteTable(
  'budget_lines',
  {
    id: text('id').primaryKey(),
    budgetId: text('budget_id').notNull().references(() => budgets.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull().references(() => generalLedgerAccounts.id),
    accountCode: text('account_code').notNull(),
    budgetedAmount: integer('budgeted_amount').notNull(),
    actualAmount: integer('actual_amount').default(0),
    variance: integer('variance').default(0),
    variancePercentage: real('variance_percentage').default(0),
    notes: text('notes'),
  },
  (table) => ({
    budgetIdx: index('bl_budget_idx').on(table.budgetId),
    accountIdx: index('bl_account_idx').on(table.accountId),
  })
);

export const financialForecasts = sqliteTable(
  'financial_forecasts',
  {
    id: text('id').primaryKey(),
    forecastType: text('forecast_type', {
      enum: ['conservative', 'base_case', 'optimistic', 'scenario']
    }).notNull(),
    period: text('period').notNull(),
    confidence: integer('confidence').default(50),
    assumptions: text('assumptions').$type<Record<string, any>>(),
    sensitivity: text('sensitivity').$type<Record<string, number>>(),
    createdByUserId: text('created_by_user_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    periodIdx: index('ff_period_idx').on(table.period),
    typeIdx: index('ff_type_idx').on(table.forecastType),
  })
);

export const forecastLines = sqliteTable(
  'forecast_lines',
  {
    id: text('id').primaryKey(),
    forecastId: text('forecast_id').notNull().references(() => financialForecasts.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull().references(() => generalLedgerAccounts.id),
    amount: integer('amount').notNull(),
    growthRate: real('growth_rate').default(0),
    confidenceInterval: real('confidence_interval').default(0),
  },
  (table) => ({
    forecastIdx: index('fl_forecast_idx').on(table.forecastId),
    accountIdx: index('fl_account_idx').on(table.accountId),
  })
);

// ============================================================================
// FINANCIAL STATEMENTS
// ============================================================================

export const financialStatements = sqliteTable(
  'financial_statements',
  {
    id: text('id').primaryKey(),
    type: text('type', {
      enum: ['balance_sheet', 'income_statement', 'cash_flow', 'equity_statement']
    }).notNull(),
    period: text('period').notNull(),
    generatedDate: integer('generated_date', { mode: 'timestamp_ms' }).notNull(),
    reportingCurrency: text('reporting_currency').notNull().default('USD'),
    sections: text('sections').$type<Array<any>>(),
    notes: text('notes'),
    auditStatus: text('audit_status', {
      enum: ['unaudited', 'reviewed', 'audited']
    }).notNull().default('unaudited'),
    preparedByUserId: text('prepared_by_user_id').notNull(),
    reviewedByUserId: text('reviewed_by_user_id'),
    reviewedAt: integer('reviewed_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    typeIdx: index('fs_type_idx').on(table.type),
    periodIdx: index('fs_period_idx').on(table.period),
  })
);

// ============================================================================
// BANK RECONCILIATION
// ============================================================================

export const bankReconciliations = sqliteTable(
  'bank_reconciliations',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    period: text('period').notNull(),
    bankStatementDate: integer('bank_statement_date', { mode: 'timestamp_ms' }).notNull(),
    bankStatementBalance: integer('bank_statement_balance').notNull(),
    bookBalance: integer('book_balance').notNull(),
    bankTransactions: text('bank_transactions').$type<Array<any>>(),
    outstandingDeposits: integer('outstanding_deposits').default(0),
    outstandingChecks: integer('outstanding_checks').default(0),
    reconciliationDifference: integer('reconciliation_difference').default(0),
    isReconciled: integer('is_reconciled', { mode: 'boolean' }).notNull().default(false),
    reconciledByUserId: text('reconciled_by_user_id'),
    reconciledAt: integer('reconciled_at', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    accountIdx: index('br_account_idx').on(table.accountId),
    periodIdx: index('br_period_idx').on(table.period),
    reconciledIdx: index('br_reconciled_idx').on(table.isReconciled),
  })
);

// ============================================================================
// AUDIT TRAIL & COMPLIANCE
// ============================================================================

export const auditTrails = sqliteTable(
  'audit_trails',
  {
    id: text('id').primaryKey(),
    timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull(),
    userId: text('user_id').notNull(),
    userName: text('user_name').notNull(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    previousValues: text('previous_values').$type<Record<string, any>>(),
    newValues: text('new_values').$type<Record<string, any>>(),
    changes: text('changes').$type<Array<{ field: string; oldValue: any; newValue: any }>>(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    status: text('status', { enum: ['success', 'failure'] }).notNull().default('success'),
    errorMessage: text('error_message'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    timestampIdx: index('at_timestamp_idx').on(table.timestamp),
    userIdx: index('at_user_idx').on(table.userId),
    entityIdx: index('at_entity_idx').on(table.entityType, table.entityId),
  })
);

export const complianceReports = sqliteTable(
  'compliance_reports',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    reportingStandard: text('reporting_standard', {
      enum: ['GAAP', 'IFRS', 'IFRS_SME', 'LOCAL']
    }).notNull(),
    reportPeriod: text('report_period').notNull(),
    sections: text('sections').$type<Array<any>>(),
    status: text('status', {
      enum: ['draft', 'pending_review', 'approved', 'submitted']
    }).notNull().default('draft'),
    submittedDate: integer('submitted_date', { mode: 'timestamp_ms' }),
    preparedByUserId: text('prepared_by_user_id').notNull(),
    reviewedByUserId: text('reviewed_by_user_id'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    standardIdx: index('cr_standard_idx').on(table.reportingStandard),
    statusIdx: index('cr_status_idx').on(table.status),
  })
);

// ============================================================================
// REVENUE RECOGNITION (ASC 606 / IFRS 15)
// ============================================================================

export const revenueContracts = sqliteTable(
  'revenue_contracts',
  {
    id: text('id').primaryKey(),
    contractCode: text('contract_code').notNull().unique(),
    customerId: text('customer_id').notNull(),
    contractValue: integer('contract_value').notNull(),
    startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }).notNull(),
    recognitionMethod: text('recognition_method', {
      enum: ['point_in_time', 'over_time']
    }).notNull(),
    status: text('status', {
      enum: ['active', 'completed', 'cancelled']
    }).notNull().default('active'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    codeIdx: index('rc_code_idx').on(table.contractCode),
    customerIdx: index('rc_customer_idx').on(table.customerId),
    statusIdx: index('rc_status_idx').on(table.status),
  })
);

export const performanceObligations = sqliteTable(
  'performance_obligations',
  {
    id: text('id').primaryKey(),
    contractId: text('contract_id').notNull().references(() => revenueContracts.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    transactionPrice: integer('transaction_price').notNull(),
    recognitionStartDate: integer('recognition_start_date', { mode: 'timestamp_ms' }).notNull(),
    recognitionEndDate: integer('recognition_end_date', { mode: 'timestamp_ms' }).notNull(),
    recognitionSchedule: text('recognition_schedule').$type<Array<{ date: Date; amount: number; status: 'scheduled' | 'recognized' | 'reversed' }>>(),
  },
  (table) => ({
    contractIdx: index('po_contract_idx').on(table.contractId),
  })
);

// ============================================================================
// INTERCOMPANY ACCOUNTING
// ============================================================================

export const intercompanyTransactions = sqliteTable(
  'intercompany_transactions',
  {
    id: text('id').primaryKey(),
    originatingCompanyId: text('originating_company_id').notNull(),
    receivingCompanyId: text('receiving_company_id').notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('USD'),
    type: text('type', {
      enum: ['sale', 'purchase', 'transfer', 'loan']
    }).notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    description: text('description').notNull(),
    status: text('status', {
      enum: ['pending', 'confirmed', 'reconciled']
    }).notNull().default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    originatingIdx: index('ict_originating_idx').on(table.originatingCompanyId),
    receivingIdx: index('ict_receiving_idx').on(table.receivingCompanyId),
  })
);

// ============================================================================
// FINANCIAL WORKFLOWS & APPROVALS
// ============================================================================

export const approvalWorkflows = sqliteTable(
  'approval_workflows',
  {
    id: text('id').primaryKey(),
    workflowName: text('workflow_name').notNull(),
    entityType: text('entity_type').notNull(),
    approvalLevels: text('approval_levels').$type<Array<any>>(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    entityTypeIdx: index('aw_entity_type_idx').on(table.entityType),
    activeIdx: index('aw_active_idx').on(table.isActive),
  })
);

export const approvalRequests = sqliteTable(
  'approval_requests',
  {
    id: text('id').primaryKey(),
    workflowId: text('workflow_id').notNull().references(() => approvalWorkflows.id),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    currentLevel: integer('current_level').notNull(),
    status: text('status', {
      enum: ['pending', 'approved', 'rejected', 'escalated']
    }).notNull().default('pending'),
    approvals: text('approvals').$type<Array<any>>(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    workflowIdx: index('ar_workflow_idx').on(table.workflowId),
    entityIdx: index('ar_entity_idx').on(table.entityType, table.entityId),
    statusIdx: index('ar_status_idx').on(table.status),
  })
);

// ============================================================================
// REAL-TIME FINANCIAL METRICS & NOTIFICATIONS
// ============================================================================

export const realTimeMetrics = sqliteTable(
  'real_time_metrics',
  {
    id: text('id').primaryKey(),
    period: text('period').notNull(),
    asOfDate: integer('as_of_date', { mode: 'timestamp_ms' }).notNull(),
    currentAssets: integer('current_assets').notNull(),
    totalAssets: integer('total_assets').notNull(),
    currentLiabilities: integer('current_liabilities').notNull(),
    totalLiabilities: integer('total_liabilities').notNull(),
    equity: integer('equity').notNull(),
    revenue: integer('revenue').notNull(),
    expenses: integer('expenses').notNull(),
    netIncome: integer('net_income').notNull(),
    operatingCashFlow: integer('operating_cash_flow').notNull(),
    freeCashFlow: integer('free_cash_flow').notNull(),
    debtToEquityRatio: real('debt_to_equity_ratio'),
    currentRatio: real('current_ratio'),
    quickRatio: real('quick_ratio'),
    workingCapital: integer('working_capital'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    periodIdx: index('rtm_period_idx').on(table.period),
    dateIdx: index('rtm_date_idx').on(table.asOfDate),
  })
);

export const financialNotifications = sqliteTable(
  'financial_notifications',
  {
    id: text('id').primaryKey(),
    type: text('type', {
      enum: ['approval_required', 'payment_due', 'cash_flow_alert', 'budget_variance', 'tax_deadline', 'reconciliation_needed', 'invoice_overdue']
    }).notNull(),
    priority: text('priority', {
      enum: ['low', 'medium', 'high', 'critical']
    }).notNull(),
    recipient: text('recipient').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    metadata: text('metadata').$type<Record<string, any>>(),
    isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
    actionUrl: text('action_url'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
  },
  (table) => ({
    recipientIdx: index('fn_recipient_idx').on(table.recipient),
    priorityIdx: index('fn_priority_idx').on(table.priority),
    readIdx: index('fn_read_idx').on(table.isRead),
  })
);

export type GeneralLedgerAccount = typeof generalLedgerAccounts.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type JournalEntryLine = typeof journalEntryLines.$inferSelect;
export type InvoiceEnhanced = typeof invoicesEnhanced.$inferSelect;
export type PaymentEnhanced = typeof paymentsEnhanced.$inferSelect;
export type AuditTrail = typeof auditTrails.$inferSelect;
