import { NextResponse } from 'next/server';
import { desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  founders,
  companyAccounts,
  expenses,
  profitDistributions,
  founderDistributionItems,
  financialTransactions,
  subscriptions,
  invoices,
  invoiceItems,
  payments,
  fundTransfers,
  projectFinancials,
  founderContributions,
  budgets,
  budgetCategories,
  projects,
} from '@/lib/db/schema';
import { requireRole } from '@/lib/internal/auth';
import * as XLSX from 'xlsx';

// Helper to format currency (from paisa/cents to readable format)
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

// GET - Export all financial data to Excel
export async function GET(request: Request) {
  try {
    await requireRole(['admin']);
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    // Optional filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'xlsx'; // xlsx or csv
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // =========================================================================
    // 1. FOUNDERS SHEET
    // =========================================================================
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
    // 2. COMPANY ACCOUNTS SHEET
    // =========================================================================
    const accountsData = await db
      .select({
        id: companyAccounts.id,
        name: companyAccounts.name,
        accountType: companyAccounts.accountType,
        founderName: founders.name,
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
      .leftJoin(founders, sql`${companyAccounts.founderId} = ${founders.id}`)
      .orderBy(companyAccounts.name);
    
    const accountsSheet = XLSX.utils.json_to_sheet(
      accountsData.map(a => ({
        'ID': a.id,
        'Account Name': a.name,
        'Account Type': a.accountType,
        'Owner (Founder)': a.founderName || 'Company',
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
    // 3. EXPENSES SHEET
    // =========================================================================
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
        paidByFounderName: founders.name,
        paidFromAccountName: companyAccounts.name,
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
      .leftJoin(founders, sql`${expenses.paidByFounderId} = ${founders.id}`)
      .leftJoin(companyAccounts, sql`${expenses.paidFromAccountId} = ${companyAccounts.id}`)
      .orderBy(desc(expenses.expenseDate));
    
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
        'Paid By (Founder)': e.paidByFounderName || '',
        'Paid From Account': e.paidFromAccountName || '',
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
    // 4. FOUNDER CONTRIBUTIONS SHEET
    // =========================================================================
    const contributionsData = await db
      .select({
        id: founderContributions.id,
        founderName: founders.name,
        amount: founderContributions.amount,
        currency: founderContributions.currency,
        contributionType: founderContributions.contributionType,
        purpose: founderContributions.purpose,
        toAccountName: companyAccounts.name,
        status: founderContributions.status,
        contributedAt: founderContributions.contributedAt,
        notes: founderContributions.notes,
        receiptUrl: founderContributions.receiptUrl,
        createdAt: founderContributions.createdAt,
      })
      .from(founderContributions)
      .leftJoin(founders, sql`${founderContributions.founderId} = ${founders.id}`)
      .leftJoin(companyAccounts, sql`${founderContributions.toAccountId} = ${companyAccounts.id}`)
      .orderBy(desc(founderContributions.contributedAt));
    
    const contributionsSheet = XLSX.utils.json_to_sheet(
      contributionsData.map(c => ({
        'ID': c.id,
        'Founder': c.founderName || '',
        'Amount': formatCurrency(c.amount, c.currency),
        'Amount (Raw)': c.amount / 100,
        'Currency': c.currency,
        'Type': c.contributionType,
        'Purpose': c.purpose || '',
        'To Account': c.toAccountName || '',
        'Status': c.status,
        'Contributed Date': formatDate(c.contributedAt),
        'Notes': c.notes || '',
        'Receipt URL': c.receiptUrl || '',
        'Created At': formatDate(c.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, contributionsSheet, 'Founder Contributions');
    
    // =========================================================================
    // 5. PROFIT DISTRIBUTIONS SHEET
    // =========================================================================
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
    // 6. FOUNDER DISTRIBUTION ITEMS SHEET
    // =========================================================================
    const distributionItemsData = await db
      .select({
        id: founderDistributionItems.id,
        distributionId: founderDistributionItems.distributionId,
        founderName: founders.name,
        sharePercentage: founderDistributionItems.sharePercentage,
        grossAmount: founderDistributionItems.grossAmount,
        deductions: founderDistributionItems.deductions,
        netAmount: founderDistributionItems.netAmount,
        toAccountName: companyAccounts.name,
        status: founderDistributionItems.status,
        notes: founderDistributionItems.notes,
        createdAt: founderDistributionItems.createdAt,
      })
      .from(founderDistributionItems)
      .leftJoin(founders, sql`${founderDistributionItems.founderId} = ${founders.id}`)
      .leftJoin(companyAccounts, sql`${founderDistributionItems.toAccountId} = ${companyAccounts.id}`)
      .orderBy(desc(founderDistributionItems.createdAt));
    
    const distributionItemsSheet = XLSX.utils.json_to_sheet(
      distributionItemsData.map(di => ({
        'ID': di.id,
        'Distribution ID': di.distributionId,
        'Founder': di.founderName || '',
        'Share %': di.sharePercentage,
        'Gross Amount': di.grossAmount / 100,
        'Deductions': di.deductions / 100,
        'Net Amount': di.netAmount / 100,
        'To Account': di.toAccountName || '',
        'Status': di.status,
        'Notes': di.notes || '',
        'Created At': formatDate(di.createdAt),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, distributionItemsSheet, 'Distribution Items');
    
    // =========================================================================
    // 7. FUND TRANSFERS SHEET
    // =========================================================================
    const transfersData = await db
      .select({
        id: fundTransfers.id,
        transferType: fundTransfers.transferType,
        fromAccountId: fundTransfers.fromAccountId,
        toAccountId: fundTransfers.toAccountId,
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
    
    const transfersSheet = XLSX.utils.json_to_sheet(
      transfersData.map(t => ({
        'ID': t.id,
        'Transfer Type': t.transferType,
        'From Account ID': t.fromAccountId || '',
        'To Account ID': t.toAccountId || '',
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
    // 8. FINANCIAL TRANSACTIONS SHEET (Audit Log)
    // =========================================================================
    const transactionsData = await db
      .select({
        id: financialTransactions.id,
        transactionType: financialTransactions.transactionType,
        accountName: companyAccounts.name,
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
      .leftJoin(companyAccounts, sql`${financialTransactions.accountId} = ${companyAccounts.id}`)
      .orderBy(desc(financialTransactions.transactionDate))
      .limit(5000); // Limit to prevent huge exports
    
    const transactionsSheet = XLSX.utils.json_to_sheet(
      transactionsData.map(t => ({
        'ID': t.id,
        'Type': t.transactionType,
        'Account': t.accountName || '',
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
    // 9. SUBSCRIPTIONS SHEET
    // =========================================================================
    const subscriptionsData = await db
      .select()
      .from(subscriptions)
      .orderBy(subscriptions.name);
    
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
    // 10. INVOICES SHEET
    // =========================================================================
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
    // 11. PAYMENTS SHEET
    // =========================================================================
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
    // 12. PROJECT FINANCIALS SHEET
    // =========================================================================
    const projectFinancialsData = await db
      .select({
        id: projectFinancials.id,
        projectId: projectFinancials.projectId,
        projectName: projects.name,
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
      .leftJoin(projects, sql`${projectFinancials.projectId} = ${projects.id}`)
      .orderBy(desc(projectFinancials.createdAt));
    
    const projectFinancialsSheet = XLSX.utils.json_to_sheet(
      projectFinancialsData.map(pf => ({
        'ID': pf.id,
        'Project ID': pf.projectId,
        'Project Name': pf.projectName || '',
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
    // 13. BUDGETS SHEET
    // =========================================================================
    const budgetsData = await db
      .select()
      .from(budgets)
      .orderBy(desc(budgets.periodStart));
    
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
    
    // =========================================================================
    // 14. BUDGET CATEGORIES SHEET
    // =========================================================================
    const budgetCategoriesData = await db
      .select({
        id: budgetCategories.id,
        budgetId: budgetCategories.budgetId,
        budgetName: budgets.name,
        category: budgetCategories.category,
        allocatedAmount: budgetCategories.allocatedAmount,
        spentAmount: budgetCategories.spentAmount,
        alertThreshold: budgetCategories.alertThreshold,
        notes: budgetCategories.notes,
        createdAt: budgetCategories.createdAt,
      })
      .from(budgetCategories)
      .leftJoin(budgets, sql`${budgetCategories.budgetId} = ${budgets.id}`)
      .orderBy(budgetCategories.category);
    
    const budgetCategoriesSheet = XLSX.utils.json_to_sheet(
      budgetCategoriesData.map(bc => ({
        'ID': bc.id,
        'Budget ID': bc.budgetId,
        'Budget Name': bc.budgetName || '',
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
    // 15. SUMMARY SHEET
    // =========================================================================
    
    // Calculate summary statistics
    const [expenseSummary] = await db
      .select({
        totalExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
        expenseCount: sql<number>`COUNT(*)`,
      })
      .from(expenses);
    
    const [accountSummary] = await db
      .select({
        totalBalance: sql<number>`COALESCE(SUM(${companyAccounts.currentBalance}), 0)`,
        accountCount: sql<number>`COUNT(*)`,
      })
      .from(companyAccounts)
      .where(sql`${companyAccounts.status} = 'active'`);
    
    const [contributionSummary] = await db
      .select({
        totalContributions: sql<number>`COALESCE(SUM(${founderContributions.amount}), 0)`,
        contributionCount: sql<number>`COUNT(*)`,
      })
      .from(founderContributions);
    
    const [distributionSummary] = await db
      .select({
        totalDistributed: sql<number>`COALESCE(SUM(${profitDistributions.distributedAmount}), 0)`,
        distributionCount: sql<number>`COUNT(*)`,
      })
      .from(profitDistributions)
      .where(sql`${profitDistributions.status} = 'distributed'`);
    
    const [invoiceSummary] = await db
      .select({
        totalInvoiced: sql<number>`COALESCE(SUM(${invoices.totalAmount}), 0)`,
        invoiceCount: sql<number>`COUNT(*)`,
        paidInvoices: sql<number>`COUNT(CASE WHEN ${invoices.status} = 'paid' THEN 1 END)`,
        pendingInvoices: sql<number>`COUNT(CASE WHEN ${invoices.status} IN ('pending', 'sent') THEN 1 END)`,
      })
      .from(invoices);
    
    const [paymentSummary] = await db
      .select({
        totalPayments: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        paymentCount: sql<number>`COUNT(*)`,
      })
      .from(payments)
      .where(sql`${payments.status} = 'completed'`);
    
    const summaryData = [
      { 'Category': 'Total Active Account Balance', 'Value': formatCurrency(accountSummary?.totalBalance || 0, 'PKR'), 'Raw Value': (accountSummary?.totalBalance || 0) / 100 },
      { 'Category': 'Active Accounts', 'Value': accountSummary?.accountCount || 0, 'Raw Value': accountSummary?.accountCount || 0 },
      { 'Category': 'Total Expenses (All Time)', 'Value': formatCurrency(expenseSummary?.totalExpenses || 0, 'PKR'), 'Raw Value': (expenseSummary?.totalExpenses || 0) / 100 },
      { 'Category': 'Expense Count', 'Value': expenseSummary?.expenseCount || 0, 'Raw Value': expenseSummary?.expenseCount || 0 },
      { 'Category': 'Total Founder Contributions', 'Value': formatCurrency(contributionSummary?.totalContributions || 0, 'PKR'), 'Raw Value': (contributionSummary?.totalContributions || 0) / 100 },
      { 'Category': 'Contribution Count', 'Value': contributionSummary?.contributionCount || 0, 'Raw Value': contributionSummary?.contributionCount || 0 },
      { 'Category': 'Total Profit Distributed', 'Value': formatCurrency(distributionSummary?.totalDistributed || 0, 'PKR'), 'Raw Value': (distributionSummary?.totalDistributed || 0) / 100 },
      { 'Category': 'Distribution Count', 'Value': distributionSummary?.distributionCount || 0, 'Raw Value': distributionSummary?.distributionCount || 0 },
      { 'Category': 'Total Invoiced', 'Value': formatCurrency(invoiceSummary?.totalInvoiced || 0, 'PKR'), 'Raw Value': (invoiceSummary?.totalInvoiced || 0) / 100 },
      { 'Category': 'Invoice Count', 'Value': invoiceSummary?.invoiceCount || 0, 'Raw Value': invoiceSummary?.invoiceCount || 0 },
      { 'Category': 'Paid Invoices', 'Value': invoiceSummary?.paidInvoices || 0, 'Raw Value': invoiceSummary?.paidInvoices || 0 },
      { 'Category': 'Pending Invoices', 'Value': invoiceSummary?.pendingInvoices || 0, 'Raw Value': invoiceSummary?.pendingInvoices || 0 },
      { 'Category': 'Total Payments Received', 'Value': formatCurrency(paymentSummary?.totalPayments || 0, 'PKR'), 'Raw Value': (paymentSummary?.totalPayments || 0) / 100 },
      { 'Category': 'Payment Count', 'Value': paymentSummary?.paymentCount || 0, 'Raw Value': paymentSummary?.paymentCount || 0 },
      { 'Category': 'Founders Count', 'Value': foundersData.length, 'Raw Value': foundersData.length },
      { 'Category': 'Active Subscriptions', 'Value': subscriptionsData.filter(s => s.status === 'active').length, 'Raw Value': subscriptionsData.filter(s => s.status === 'active').length },
      { 'Category': 'Export Date', 'Value': new Date().toISOString(), 'Raw Value': new Date().toISOString() },
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Move Summary to the first position
    const sheetOrder = workbook.SheetNames;
    const summaryIndex = sheetOrder.indexOf('Summary');
    if (summaryIndex > 0) {
      sheetOrder.splice(summaryIndex, 1);
      sheetOrder.unshift('Summary');
      workbook.SheetNames = sheetOrder;
    }
    
    // Generate the file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `megicode-financial-export-${timestamp}.xlsx`;
    
    // Write to buffer
    const buffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true,
    });
    
    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Failed to export financial data:', error);
    return NextResponse.json(
      { error: 'Failed to export financial data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
