/**
 * Financial Form Validation & Utilities
 * Centralized validation, type-safe form helpers, and financial calculations
 */

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'range' | 'unique' | 'custom';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Founder Validation
export interface FounderFormData {
  name: string;
  email?: string;
  phone?: string;
  profitSharePercentage: number;
  notes?: string;
}

export const validateFounder = (data: FounderFormData, existingFounders: any[] = [], excludeId?: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Founder name is required', type: 'required' });
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format', type: 'format' });
  }

  if (data.profitSharePercentage < 0 || data.profitSharePercentage > 100) {
    errors.push({ field: 'profitSharePercentage', message: 'Profit share must be between 0 and 100%', type: 'range' });
  }

  return { isValid: errors.length === 0, errors };
};

// Account Validation
export interface AccountFormData {
  name: string;
  accountType: 'company_central' | 'founder_personal' | 'operations' | 'savings';
  bankName?: string;
  accountNumber?: string;
  walletProvider?: string;
  currency: string;
  currentBalance: number;
  founderId?: string;
  isPrimary: boolean;
  notes?: string;
}

export const validateAccount = (data: AccountFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Account name is required', type: 'required' });
  }

  if (data.accountType === 'founder_personal' && !data.founderId) {
    errors.push({ field: 'founderId', message: 'Must select a founder for personal account', type: 'required' });
  }

  if (!data.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', type: 'required' });
  }

  if (typeof data.currentBalance !== 'number' || isNaN(data.currentBalance)) {
    errors.push({ field: 'currentBalance', message: 'Balance must be a valid number', type: 'format' });
  }

  return { isValid: errors.length === 0, errors };
};

// Expense Validation
export interface ExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  vendor?: string;
  expenseDate: string;
  projectId?: string;
  paidByFounderId?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}

export const validateExpense = (data: ExpenseFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Expense title is required', type: 'required' });
  }

  if (data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0', type: 'range' });
  }

  if (!data.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', type: 'required' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required', type: 'required' });
  }

  if (!data.expenseDate) {
    errors.push({ field: 'expenseDate', message: 'Date is required', type: 'required' });
  } else if (new Date(data.expenseDate) > new Date()) {
    errors.push({ field: 'expenseDate', message: 'Expense date cannot be in the future', type: 'custom' });
  }

  return { isValid: errors.length === 0, errors };
};

// Subscription Validation
export interface SubscriptionFormData {
  name: string;
  provider?: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  category?: string;
  notes?: string;
}

export const validateSubscription = (data: SubscriptionFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Subscription name is required', type: 'required' });
  }

  if (data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0', type: 'range' });
  }

  if (!data.billingCycle) {
    errors.push({ field: 'billingCycle', message: 'Billing cycle is required', type: 'required' });
  }

  if (!data.nextBillingDate) {
    errors.push({ field: 'nextBillingDate', message: 'Next billing date is required', type: 'required' });
  }

  return { isValid: errors.length === 0, errors };
};

// Contribution Validation
export interface ContributionFormData {
  founderId: string;
  amount: number;
  currency: string;
  contributionType: string;
  purpose?: string;
  toAccountId: string;
  notes?: string;
}

export const validateContribution = (data: ContributionFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.founderId) {
    errors.push({ field: 'founderId', message: 'Founder is required', type: 'required' });
  }

  if (data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0', type: 'range' });
  }

  if (!data.toAccountId) {
    errors.push({ field: 'toAccountId', message: 'Target account is required', type: 'required' });
  }

  return { isValid: errors.length === 0, errors };
};

// ============================================================================
// Financial Calculation Utilities
// ============================================================================

export const calculateMonthlyMRR = (subscriptions: any[]): number => {
  return subscriptions
    .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + (s.amount || 0), 0);
};

export const calculateAnnualMRRImpact = (monthlyMRR: number): number => {
  return monthlyMRR * 12;
};

export const calculateCashBurn = (monthlyExpenses: number, monthlyRevenue: number): number => {
  return monthlyExpenses - monthlyRevenue;
};

export const calculateExpenseByCategory = (expenses: any[]): Record<string, number> => {
  return expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
};

export const calculateRunwayMonths = (currentCash: number, monthlyBurn: number): number => {
  if (monthlyBurn <= 0) return Infinity;
  return Math.floor(currentCash / monthlyBurn);
};

export const calculateExpensePercentage = (expenseAmount: number, totalAmount: number): number => {
  if (totalAmount === 0) return 0;
  return (expenseAmount / totalAmount) * 100;
};

export const calculateAverageDailyBurn = (totalExpenses: number, days: number): number => {
  if (days === 0) return 0;
  return totalExpenses / days;
};

export const calculateProjectedMonthlyExpenses = (dailyBurn: number): number => {
  return dailyBurn * 30;
};

// ============================================================================
// Format & Parse Utilities
// ============================================================================

export const formatCurrency = (amount: number, currency: string = 'PKR'): string => {
  if (currency === 'PKR') {
    return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
};

export const formatDate = (date: Date | string | number | null): string => {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateShort = (date: Date | string | number | null): string => {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatTimeAgo = (date: Date | string | number): string => {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(d);
};

// ============================================================================
// Export Utilities
// ============================================================================

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};
