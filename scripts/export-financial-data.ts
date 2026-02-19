/**
 * Direct Financial Data Export Script
 * Run: npx ts-node scripts/export-financial-data.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') }); // Load .env.local

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { desc, sql } from 'drizzle-orm';
import * as XLSX from 'xlsx';
import * as schema from '../lib/db/schema';
import path from 'path';

const {
  founders,
  companyAccounts,
  expenses,
  profitDistributions,
  founderDistributionItems,
  financialTransactions,
  subscriptions,
  invoices,
  payments,
  fundTransfers,
  projectFinancials,
  founderContributions,
  budgets,
  budgetCategories,
  projects,
  clients,
} = schema;

// Helper to format currency
function formatCurrency(amount: number | null, currency = 'PKR'): string {
  if (amount === null || amount === undefined) return '0';
  const value = amount / 100;
  return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper to format date
function formatDate(date: Date | number | null): string {
  if (!date) return '';
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

async function exportFinancialData() {
  console.log('🚀 Starting financial data export...\n');

  // Connect to database
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('❌ Missing TURSO_DATABASE_URL environment variable');
    process.exit(1);
  }

  console.log('📡 Connecting to database...');
  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  // Create workbook
  const workbook = XLSX.utils.book_new();

  try {
    // =========================================================================
    // 1. FOUNDERS
    // =========================================================================
    console.log('📊 Fetching Founders...');
    const foundersData = await db
      .select({
        id: founders.id,
        name: founders.name,
        email: founders.email,
        phone: founders.phone,
        profitSharePercentage: founders.profitSharePercentage,
        status: founders.status,
        joinedAt: founders.joinedAt,
        notes: founders.notes,
        createdAt: founders.createdAt,
      })
      .from(founders)
      .orderBy(founders.name);

    console.log(`   Found ${foundersData.length} founders`);

    const foundersSheet = XLSX.utils.json_to_sheet(
      foundersData.map(f => ({
        'ID': f.id,
        'Name': f.name,
        'Email': f.email || '',
        'Phone': f.phone || '',
        'Profit Share %': f.profitSharePercentage,
        'Status': f.status,
        'Joined Date': formatDate(f.joinedAt),
        'Notes': f.notes || '',
        'Created At': formatDate(f.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, foundersSheet, 'Founders');

    // =========================================================================
    // 2. COMPANY ACCOUNTS
    // =========================================================================
    console.log('📊 Fetching Company Accounts...');
    const accountsData = await db
      .select({
        id: companyAccounts.id,
        name: companyAccounts.name,
        accountType: companyAccounts.accountType,
        founderId: companyAccounts.founderId,
        bankName: companyAccounts.bankName,
        accountNumber: companyAccounts.accountNumber,
        walletProvider: companyAccounts.walletProvider,
        currency: companyAccounts.currency,
        currentBalance: companyAccounts.currentBalance,
        status: companyAccounts.status,
        isPrimary: companyAccounts.isPrimary,
        notes: companyAccounts.notes,
        createdAt: companyAccounts.createdAt,
      })
      .from(companyAccounts)
      .orderBy(companyAccounts.name);

    console.log(`   Found ${accountsData.length} accounts`);

    // Get founder names for mapping
    const founderMap = new Map(foundersData.map(f => [f.id, f.name]));

    const accountsSheet = XLSX.utils.json_to_sheet(
      accountsData.map(a => ({
        'ID': a.id,
        'Account Name': a.name,
        'Account Type': a.accountType,
        'Owner (Founder)': a.founderId ? founderMap.get(a.founderId) || a.founderId : 'Company',
        'Bank Name': a.bankName || '',
        'Account Number': a.accountNumber || '',
        'Wallet Provider': a.walletProvider || '',
        'Currency': a.currency,
        'Current Balance': formatCurrency(a.currentBalance, a.currency),
        'Balance (Raw)': a.currentBalance / 100,
        'Status': a.status,
        'Is Primary': a.isPrimary ? 'Yes' : 'No',
        'Notes': a.notes || '',
        'Created At': formatDate(a.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, accountsSheet, 'Company Accounts');

    // =========================================================================
    // 3. EXPENSES
    // =========================================================================
    console.log('📊 Fetching Expenses...');
    const expensesData = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        description: expenses.description,
        amount: expenses.amount,
        currency: expenses.currency,
        category: expenses.category,
        projectId: expenses.projectId,
        productName: expenses.productName,
        paidByFounderId: expenses.paidByFounderId,
        paidFromAccountId: expenses.paidFromAccountId,
        vendor: expenses.vendor,
        receiptUrl: expenses.receiptUrl,
        isRecurring: expenses.isRecurring,
        recurringInterval: expenses.recurringInterval,
        nextDueAt: expenses.nextDueAt,
        status: expenses.status,
        expenseDate: expenses.expenseDate,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .orderBy(desc(expenses.expenseDate));

    console.log(`   Found ${expensesData.length} expenses`);

    // Get account names for mapping
    const accountMap = new Map(accountsData.map(a => [a.id, a.name]));

    const expensesSheet = XLSX.utils.json_to_sheet(
      expensesData.map(e => ({
        'ID': e.id,
        'Title': e.title,
        'Description': e.description || '',
        'Amount': formatCurrency(e.amount, e.currency),
        'Amount (Raw)': e.amount / 100,
        'Currency': e.currency,
        'Category': e.category,
        'Project ID': e.projectId || '',
        'Product Name': e.productName || '',
        'Paid By (Founder)': e.paidByFounderId ? founderMap.get(e.paidByFounderId) || e.paidByFounderId : '',
        'Paid From Account': e.paidFromAccountId ? accountMap.get(e.paidFromAccountId) || e.paidFromAccountId : '',
        'Vendor': e.vendor || '',
        'Receipt URL': e.receiptUrl || '',
        'Is Recurring': e.isRecurring ? 'Yes' : 'No',
        'Recurring Interval': e.recurringInterval || '',
        'Next Due Date': formatDate(e.nextDueAt),
        'Status': e.status,
        'Expense Date': formatDate(e.expenseDate),
        'Created At': formatDate(e.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');

    // =========================================================================
    // 4. FOUNDER CONTRIBUTIONS
    // =========================================================================
    console.log('📊 Fetching Founder Contributions...');
    const contributionsData = await db
      .select({
        id: founderContributions.id,
        founderId: founderContributions.founderId,
        amount: founderContributions.amount,
        currency: founderContributions.currency,
        contributionType: founderContributions.contributionType,
        purpose: founderContributions.purpose,
        toAccountId: founderContributions.toAccountId,
        status: founderContributions.status,
        contributedAt: founderContributions.contributedAt,
        notes: founderContributions.notes,
        receiptUrl: founderContributions.receiptUrl,
        createdAt: founderContributions.createdAt,
      })
      .from(founderContributions)
      .orderBy(desc(founderContributions.contributedAt));

    console.log(`   Found ${contributionsData.length} contributions`);

    const contributionsSheet = XLSX.utils.json_to_sheet(
      contributionsData.map(c => ({
        'ID': c.id,
        'Founder': founderMap.get(c.founderId) || c.founderId,
        'Amount': formatCurrency(c.amount, c.currency),
        'Amount (Raw)': c.amount / 100,
        'Currency': c.currency,
        'Type': c.contributionType,
        'Purpose': c.purpose || '',
        'To Account': c.toAccountId ? accountMap.get(c.toAccountId) || c.toAccountId : '',
        'Status': c.status,
        'Contributed Date': formatDate(c.contributedAt),
        'Notes': c.notes || '',
        'Receipt URL': c.receiptUrl || '',
        'Created At': formatDate(c.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, contributionsSheet, 'Founder Contributions');

    // =========================================================================
    // 5. PROFIT DISTRIBUTIONS
    // =========================================================================
    console.log('📊 Fetching Profit Distributions...');
    const distributionsData = await db
      .select({
        id: profitDistributions.id,
        projectId: profitDistributions.projectId,
        period: profitDistributions.period,
        totalProfit: profitDistributions.totalProfit,
        companyRetention: profitDistributions.companyRetention,
        distributedAmount: profitDistributions.distributedAmount,
        currency: profitDistributions.currency,
        status: profitDistributions.status,
        calculatedAt: profitDistributions.calculatedAt,
        distributedAt: profitDistributions.distributedAt,
        notes: profitDistributions.notes,
        createdAt: profitDistributions.createdAt,
      })
      .from(profitDistributions)
      .orderBy(desc(profitDistributions.createdAt));

    console.log(`   Found ${distributionsData.length} distributions`);

    const distributionsSheet = XLSX.utils.json_to_sheet(
      distributionsData.map(d => ({
        'ID': d.id,
        'Project ID': d.projectId || '',
        'Period': d.period || '',
        'Total Profit': formatCurrency(d.totalProfit, d.currency),
        'Total Profit (Raw)': d.totalProfit / 100,
        'Company Retention': formatCurrency(d.companyRetention, d.currency),
        'Company Retention (Raw)': d.companyRetention / 100,
        'Distributed Amount': formatCurrency(d.distributedAmount, d.currency),
        'Distributed Amount (Raw)': d.distributedAmount / 100,
        'Currency': d.currency,
        'Status': d.status,
        'Calculated At': formatDate(d.calculatedAt),
        'Distributed At': formatDate(d.distributedAt),
        'Notes': d.notes || '',
        'Created At': formatDate(d.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, distributionsSheet, 'Profit Distributions');

    // =========================================================================
    // 6. FOUNDER DISTRIBUTION ITEMS
    // =========================================================================
    console.log('📊 Fetching Founder Distribution Items...');
    const distributionItemsData = await db
      .select({
        id: founderDistributionItems.id,
        distributionId: founderDistributionItems.distributionId,
        founderId: founderDistributionItems.founderId,
        sharePercentage: founderDistributionItems.sharePercentage,
        grossAmount: founderDistributionItems.grossAmount,
        deductions: founderDistributionItems.deductions,
        netAmount: founderDistributionItems.netAmount,
        toAccountId: founderDistributionItems.toAccountId,
        status: founderDistributionItems.status,
        notes: founderDistributionItems.notes,
        createdAt: founderDistributionItems.createdAt,
      })
      .from(founderDistributionItems)
      .orderBy(desc(founderDistributionItems.createdAt));

    console.log(`   Found ${distributionItemsData.length} distribution items`);

    const distributionItemsSheet = XLSX.utils.json_to_sheet(
      distributionItemsData.map(di => ({
        'ID': di.id,
        'Distribution ID': di.distributionId,
        'Founder': founderMap.get(di.founderId) || di.founderId,
        'Share %': di.sharePercentage,
        'Gross Amount': di.grossAmount / 100,
        'Deductions': di.deductions / 100,
        'Net Amount': di.netAmount / 100,
        'To Account': di.toAccountId ? accountMap.get(di.toAccountId) || di.toAccountId : '',
        'Status': di.status,
        'Notes': di.notes || '',
        'Created At': formatDate(di.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, distributionItemsSheet, 'Distribution Items');

    // =========================================================================
    // 7. FUND TRANSFERS
    // =========================================================================
    console.log('📊 Fetching Fund Transfers...');
    const transfersData = await db
      .select({
        id: fundTransfers.id,
        transferType: fundTransfers.transferType,
        fromAccountId: fundTransfers.fromAccountId,
        toAccountId: fundTransfers.toAccountId,
        founderId: fundTransfers.founderId,
        projectId: fundTransfers.projectId,
        amount: fundTransfers.amount,
        currency: fundTransfers.currency,
        description: fundTransfers.description,
        reference: fundTransfers.reference,
        status: fundTransfers.status,
        transferredAt: fundTransfers.transferredAt,
        createdAt: fundTransfers.createdAt,
      })
      .from(fundTransfers)
      .orderBy(desc(fundTransfers.transferredAt));

    console.log(`   Found ${transfersData.length} transfers`);

    const transfersSheet = XLSX.utils.json_to_sheet(
      transfersData.map(t => ({
        'ID': t.id,
        'Transfer Type': t.transferType,
        'From Account': t.fromAccountId ? accountMap.get(t.fromAccountId) || t.fromAccountId : '',
        'To Account': t.toAccountId ? accountMap.get(t.toAccountId) || t.toAccountId : '',
        'Founder': t.founderId ? founderMap.get(t.founderId) || t.founderId : '',
        'Project ID': t.projectId || '',
        'Amount': formatCurrency(t.amount, t.currency),
        'Amount (Raw)': t.amount / 100,
        'Currency': t.currency,
        'Description': t.description || '',
        'Reference': t.reference || '',
        'Status': t.status,
        'Transferred At': formatDate(t.transferredAt),
        'Created At': formatDate(t.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, transfersSheet, 'Fund Transfers');

    // =========================================================================
    // 8. FINANCIAL TRANSACTIONS (Audit Log)
    // =========================================================================
    console.log('📊 Fetching Financial Transactions...');
    const transactionsData = await db
      .select({
        id: financialTransactions.id,
        transactionType: financialTransactions.transactionType,
        accountId: financialTransactions.accountId,
        amount: financialTransactions.amount,
        balanceAfter: financialTransactions.balanceAfter,
        currency: financialTransactions.currency,
        description: financialTransactions.description,
        projectId: financialTransactions.projectId,
        reference: financialTransactions.reference,
        transactionDate: financialTransactions.transactionDate,
        createdAt: financialTransactions.createdAt,
      })
      .from(financialTransactions)
      .orderBy(desc(financialTransactions.transactionDate))
      .limit(5000);

    console.log(`   Found ${transactionsData.length} transactions`);

    const transactionsSheet = XLSX.utils.json_to_sheet(
      transactionsData.map(t => ({
        'ID': t.id,
        'Type': t.transactionType,
        'Account': accountMap.get(t.accountId) || t.accountId,
        'Amount': formatCurrency(t.amount, t.currency),
        'Amount (Raw)': t.amount / 100,
        'Balance After': formatCurrency(t.balanceAfter, t.currency),
        'Balance After (Raw)': t.balanceAfter / 100,
        'Currency': t.currency,
        'Description': t.description,
        'Project ID': t.projectId || '',
        'Reference': t.reference || '',
        'Transaction Date': formatDate(t.transactionDate),
        'Created At': formatDate(t.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Financial Transactions');

    // =========================================================================
    // 9. SUBSCRIPTIONS
    // =========================================================================
    console.log('📊 Fetching Subscriptions...');
    const subscriptionsData = await db
      .select()
      .from(subscriptions)
      .orderBy(subscriptions.name);

    console.log(`   Found ${subscriptionsData.length} subscriptions`);

    const subscriptionsSheet = XLSX.utils.json_to_sheet(
      subscriptionsData.map(s => ({
        'ID': s.id,
        'Name': s.name,
        'Provider': s.provider,
        'Description': s.description || '',
        'Amount': formatCurrency(s.amount, s.currency),
        'Amount (Raw)': s.amount / 100,
        'Currency': s.currency,
        'Billing Cycle': s.billingCycle,
        'Category': s.category,
        'Start Date': formatDate(s.startDate),
        'Next Billing Date': formatDate(s.nextBillingDate),
        'End Date': formatDate(s.endDate),
        'Auto Renew': s.autoRenew ? 'Yes' : 'No',
        'Status': s.status,
        'Login URL': s.loginUrl || '',
        'Account Email': s.accountEmail || '',
        'Notes': s.notes || '',
        'Created At': formatDate(s.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, subscriptionsSheet, 'Subscriptions');

    // =========================================================================
    // 10. INVOICES
    // =========================================================================
    console.log('📊 Fetching Invoices...');
    const invoicesData = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        title: invoices.title,
        projectId: invoices.projectId,
        clientId: invoices.clientId,
        subtotal: invoices.subtotal,
        taxAmount: invoices.taxAmount,
        totalAmount: invoices.totalAmount,
        currency: invoices.currency,
        status: invoices.status,
        issuedAt: invoices.issuedAt,
        dueAt: invoices.dueAt,
        paidAt: invoices.paidAt,
        notes: invoices.notes,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .orderBy(desc(invoices.createdAt));

    console.log(`   Found ${invoicesData.length} invoices`);

    const invoicesSheet = XLSX.utils.json_to_sheet(
      invoicesData.map(i => ({
        'ID': i.id,
        'Invoice Number': i.invoiceNumber,
        'Title': i.title || '',
        'Project ID': i.projectId || '',
        'Client ID': i.clientId || '',
        'Subtotal': formatCurrency(i.subtotal, i.currency),
        'Subtotal (Raw)': i.subtotal / 100,
        'Tax Amount': formatCurrency(i.taxAmount, i.currency),
        'Tax Amount (Raw)': (i.taxAmount || 0) / 100,
        'Total Amount': formatCurrency(i.totalAmount, i.currency),
        'Total Amount (Raw)': i.totalAmount / 100,
        'Currency': i.currency,
        'Status': i.status,
        'Issued At': formatDate(i.issuedAt),
        'Due At': formatDate(i.dueAt),
        'Paid At': formatDate(i.paidAt),
        'Notes': i.notes || '',
        'Created At': formatDate(i.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, invoicesSheet, 'Invoices');

    // =========================================================================
    // 11. PAYMENTS
    // =========================================================================
    console.log('📊 Fetching Payments...');
    const paymentsData = await db
      .select({
        id: payments.id,
        invoiceId: payments.invoiceId,
        projectId: payments.projectId,
        clientId: payments.clientId,
        amount: payments.amount,
        currency: payments.currency,
        method: payments.method,
        status: payments.status,
        reference: payments.reference,
        notes: payments.notes,
        paidAt: payments.paidAt,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .orderBy(desc(payments.createdAt));

    console.log(`   Found ${paymentsData.length} payments`);

    const paymentsSheet = XLSX.utils.json_to_sheet(
      paymentsData.map(p => ({
        'ID': p.id,
        'Invoice ID': p.invoiceId || '',
        'Project ID': p.projectId || '',
        'Client ID': p.clientId || '',
        'Amount': formatCurrency(p.amount, p.currency),
        'Amount (Raw)': p.amount / 100,
        'Currency': p.currency,
        'Payment Method': p.method || '',
        'Status': p.status,
        'Reference': p.reference || '',
        'Notes': p.notes || '',
        'Paid At': formatDate(p.paidAt),
        'Created At': formatDate(p.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Payments');

    // =========================================================================
    // 12. PROJECT FINANCIALS
    // =========================================================================
    console.log('📊 Fetching Project Financials...');
    const projectFinancialsData = await db
      .select({
        id: projectFinancials.id,
        projectId: projectFinancials.projectId,
        totalContractValue: projectFinancials.totalContractValue,
        currency: projectFinancials.currency,
        amountReceived: projectFinancials.amountReceived,
        amountPending: projectFinancials.amountPending,
        totalExpenses: projectFinancials.totalExpenses,
        netProfit: projectFinancials.netProfit,
        companyRetention: projectFinancials.companyRetention,
        distributableProfit: projectFinancials.distributableProfit,
        retentionPercentage: projectFinancials.retentionPercentage,
        status: projectFinancials.status,
        notes: projectFinancials.notes,
        createdAt: projectFinancials.createdAt,
      })
      .from(projectFinancials)
      .orderBy(desc(projectFinancials.createdAt));

    // Get project names
    const projectsData = await db
      .select({ id: projects.id, name: projects.name })
      .from(projects);
    const projectMap = new Map(projectsData.map(p => [p.id, p.name]));

    console.log(`   Found ${projectFinancialsData.length} project financials`);

    const projectFinancialsSheet = XLSX.utils.json_to_sheet(
      projectFinancialsData.map(pf => ({
        'ID': pf.id,
        'Project ID': pf.projectId,
        'Project Name': projectMap.get(pf.projectId) || '',
        'Total Contract Value': formatCurrency(pf.totalContractValue, pf.currency),
        'Contract Value (Raw)': pf.totalContractValue / 100,
        'Amount Received': formatCurrency(pf.amountReceived, pf.currency),
        'Amount Received (Raw)': pf.amountReceived / 100,
        'Amount Pending': formatCurrency(pf.amountPending, pf.currency),
        'Amount Pending (Raw)': pf.amountPending / 100,
        'Total Expenses': formatCurrency(pf.totalExpenses, pf.currency),
        'Expenses (Raw)': pf.totalExpenses / 100,
        'Net Profit': formatCurrency(pf.netProfit, pf.currency),
        'Net Profit (Raw)': pf.netProfit / 100,
        'Company Retention': formatCurrency(pf.companyRetention, pf.currency),
        'Retention (Raw)': pf.companyRetention / 100,
        'Distributable Profit': formatCurrency(pf.distributableProfit, pf.currency),
        'Distributable (Raw)': pf.distributableProfit / 100,
        'Retention %': pf.retentionPercentage,
        'Currency': pf.currency,
        'Status': pf.status,
        'Notes': pf.notes || '',
        'Created At': formatDate(pf.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, projectFinancialsSheet, 'Project Financials');

    // =========================================================================
    // 13. BUDGETS
    // =========================================================================
    console.log('📊 Fetching Budgets...');
    const budgetsData = await db
      .select()
      .from(budgets)
      .orderBy(desc(budgets.periodStart));

    console.log(`   Found ${budgetsData.length} budgets`);

    const budgetsSheet = XLSX.utils.json_to_sheet(
      budgetsData.map(b => ({
        'ID': b.id,
        'Name': b.name,
        'Period Type': b.periodType,
        'Period Start': formatDate(b.periodStart),
        'Period End': formatDate(b.periodEnd),
        'Total Budget': formatCurrency(b.totalBudget, b.currency),
        'Total Budget (Raw)': b.totalBudget / 100,
        'Currency': b.currency,
        'Status': b.status,
        'Notes': b.notes || '',
        'Created At': formatDate(b.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, budgetsSheet, 'Budgets');

    // Budget map for categories
    const budgetMap = new Map(budgetsData.map(b => [b.id, b.name]));

    // =========================================================================
    // 14. BUDGET CATEGORIES
    // =========================================================================
    console.log('📊 Fetching Budget Categories...');
    const budgetCategoriesData = await db
      .select({
        id: budgetCategories.id,
        budgetId: budgetCategories.budgetId,
        category: budgetCategories.category,
        allocatedAmount: budgetCategories.allocatedAmount,
        spentAmount: budgetCategories.spentAmount,
        alertThreshold: budgetCategories.alertThreshold,
        notes: budgetCategories.notes,
        createdAt: budgetCategories.createdAt,
      })
      .from(budgetCategories)
      .orderBy(budgetCategories.category);

    console.log(`   Found ${budgetCategoriesData.length} budget categories`);

    const budgetCategoriesSheet = XLSX.utils.json_to_sheet(
      budgetCategoriesData.map(bc => ({
        'ID': bc.id,
        'Budget ID': bc.budgetId,
        'Budget Name': budgetMap.get(bc.budgetId) || '',
        'Category': bc.category,
        'Allocated Amount': bc.allocatedAmount / 100,
        'Spent Amount': bc.spentAmount / 100,
        'Remaining': (bc.allocatedAmount - bc.spentAmount) / 100,
        'Used %': bc.allocatedAmount > 0 ? ((bc.spentAmount / bc.allocatedAmount) * 100).toFixed(1) : '0',
        'Alert Threshold %': bc.alertThreshold,
        'Notes': bc.notes || '',
        'Created At': formatDate(bc.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, budgetCategoriesSheet, 'Budget Categories');

    // =========================================================================
    // 15. CLIENTS
    // =========================================================================
    console.log('📊 Fetching Clients...');
    const clientsData = await db
      .select()
      .from(clients)
      .orderBy(clients.name);

    console.log(`   Found ${clientsData.length} clients`);

    const clientsSheet = XLSX.utils.json_to_sheet(
      clientsData.map(c => ({
        'ID': c.id,
        'Name': c.name,
        'Company': c.company || '',
        'Website': c.website || '',
        'Industry': c.industry || '',
        'Billing Email': c.billingEmail || '',
        'Billing Address': c.billingAddress || '',
        'Timezone': c.timezone || '',
        'Status': c.status,
        'Notes': c.notes || '',
        'Created At': formatDate(c.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, clientsSheet, 'Clients');

    // =========================================================================
    // 16. PROJECTS (for reference)
    // =========================================================================
    console.log('📊 Fetching Projects...');
    const projectsList = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        priority: projects.priority,
        clientId: projects.clientId,
        startAt: projects.startAt,
        dueAt: projects.dueAt,
        deliveredAt: projects.deliveredAt,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt));

    // Client map
    const clientMap = new Map(clientsData.map(c => [c.id, c.name]));

    console.log(`   Found ${projectsList.length} projects`);

    const projectsSheet = XLSX.utils.json_to_sheet(
      projectsList.map(p => ({
        'ID': p.id,
        'Name': p.name,
        'Description': p.description || '',
        'Client': p.clientId ? clientMap.get(p.clientId) || p.clientId : '',
        'Status': p.status,
        'Priority': p.priority,
        'Start Date': formatDate(p.startAt),
        'Due Date': formatDate(p.dueAt),
        'Delivered Date': formatDate(p.deliveredAt),
        'Created At': formatDate(p.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects');

    // =========================================================================
    // 17. SUMMARY SHEET
    // =========================================================================
    console.log('📊 Generating Summary...');

    // Calculate totals
    const totalAccountBalance = accountsData
      .filter(a => a.status === 'active')
      .reduce((sum, a) => sum + a.currentBalance, 0);

    const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);
    const totalContributions = contributionsData.reduce((sum, c) => sum + c.amount, 0);
    const totalDistributed = distributionsData
      .filter(d => d.status === 'distributed')
      .reduce((sum, d) => sum + d.distributedAmount, 0);
    const totalInvoiced = invoicesData.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPayments = paymentsData
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const activeSubscriptions = subscriptionsData.filter(s => s.status === 'active');
    const monthlySubCost = activeSubscriptions
      .filter(s => s.billingCycle === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0);

    const summaryData = [
      { 'Category': '=== ACCOUNT BALANCES ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Total Active Account Balance', 'Value': formatCurrency(totalAccountBalance, 'PKR'), 'Raw Value': totalAccountBalance / 100 },
      { 'Category': 'Active Accounts', 'Value': accountsData.filter(a => a.status === 'active').length, 'Raw Value': accountsData.filter(a => a.status === 'active').length },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== EXPENSES ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Total Expenses (All Time)', 'Value': formatCurrency(totalExpenses, 'PKR'), 'Raw Value': totalExpenses / 100 },
      { 'Category': 'Expense Count', 'Value': expensesData.length, 'Raw Value': expensesData.length },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== FOUNDER CONTRIBUTIONS ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Total Contributions', 'Value': formatCurrency(totalContributions, 'PKR'), 'Raw Value': totalContributions / 100 },
      { 'Category': 'Contribution Count', 'Value': contributionsData.length, 'Raw Value': contributionsData.length },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== PROFIT DISTRIBUTIONS ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Total Distributed', 'Value': formatCurrency(totalDistributed, 'PKR'), 'Raw Value': totalDistributed / 100 },
      { 'Category': 'Distribution Count', 'Value': distributionsData.length, 'Raw Value': distributionsData.length },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== INVOICING & PAYMENTS ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Total Invoiced', 'Value': formatCurrency(totalInvoiced, 'PKR'), 'Raw Value': totalInvoiced / 100 },
      { 'Category': 'Invoice Count', 'Value': invoicesData.length, 'Raw Value': invoicesData.length },
      { 'Category': 'Paid Invoices', 'Value': invoicesData.filter(i => i.status === 'paid').length, 'Raw Value': invoicesData.filter(i => i.status === 'paid').length },
      { 'Category': 'Pending Invoices', 'Value': invoicesData.filter(i => ['pending', 'sent'].includes(i.status)).length, 'Raw Value': invoicesData.filter(i => ['pending', 'sent'].includes(i.status)).length },
      { 'Category': 'Total Payments Received', 'Value': formatCurrency(totalPayments, 'PKR'), 'Raw Value': totalPayments / 100 },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== SUBSCRIPTIONS ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Active Subscriptions', 'Value': activeSubscriptions.length, 'Raw Value': activeSubscriptions.length },
      { 'Category': 'Monthly Subscription Cost', 'Value': formatCurrency(monthlySubCost, 'PKR'), 'Raw Value': monthlySubCost / 100 },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== TEAM & PROJECTS ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Founders', 'Value': foundersData.length, 'Raw Value': foundersData.length },
      { 'Category': 'Total Projects', 'Value': projectsList.length, 'Raw Value': projectsList.length },
      { 'Category': 'Total Clients', 'Value': clientsData.length, 'Raw Value': clientsData.length },
      { 'Category': '', 'Value': '', 'Raw Value': '' },
      { 'Category': '=== EXPORT INFO ===', 'Value': '', 'Raw Value': '' },
      { 'Category': 'Export Date', 'Value': new Date().toISOString(), 'Raw Value': new Date().toISOString() },
      { 'Category': 'Database', 'Value': url?.replace(/libsql:\/\//, '').split('.')[0] || 'N/A', 'Raw Value': '' },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Move Summary to first position
    const sheetOrder = workbook.SheetNames;
    const summaryIndex = sheetOrder.indexOf('Summary');
    if (summaryIndex > 0) {
      sheetOrder.splice(summaryIndex, 1);
      sheetOrder.unshift('Summary');
      workbook.SheetNames = sheetOrder;
    }

    // =========================================================================
    // WRITE FILE
    // =========================================================================
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outputPath = path.join(process.cwd(), `megicode-financial-export-${timestamp}.xlsx`);

    console.log('\n💾 Writing Excel file...');
    XLSX.writeFile(workbook, outputPath, { compression: true });

    console.log(`\n✅ Export complete!`);
    console.log(`📁 File saved: ${outputPath}`);
    console.log(`\n📋 Sheets included:`);
    workbook.SheetNames.forEach((name, i) => {
      console.log(`   ${i + 1}. ${name}`);
    });

    // Close client
    client.close();

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

// Run the export
exportFinancialData();
