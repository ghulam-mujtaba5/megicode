/**
 * Founder & Financial Management Utilities
 * Client-side utilities for managing founders, accounts, and contributions
 */

export interface Founder {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profitSharePercentage: number;
  status: 'active' | 'inactive';
  joinedAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  totalContributions?: number;
  totalDistributions?: number;
}

export interface CompanyAccount {
  id: string;
  name: string;
  accountType: 'company_central' | 'founder_personal' | 'operations' | 'savings';
  founderId?: string;
  bankName?: string;
  accountNumber?: string;
  walletProvider?: string;
  currency: string;
  currentBalance: number;
  status: 'active' | 'inactive' | 'frozen';
  isPrimary: boolean;
  notes?: string;
  createdAt: Date;
  founderName?: string;
}

export interface Contribution {
  id: string;
  founderId: string;
  founderName?: string;
  amount: number;
  currency: string;
  contributionType: 'initial_investment' | 'additional_capital' | 'loan_to_company' | 'expense_reimbursement';
  purpose?: string;
  toAccountId?: string;
  accountName?: string;
  status: 'pending' | 'confirmed' | 'returned';
  contributedAt: Date;
  notes?: string;
  createdAt: Date;
  receiptUrl?: string;
}

// ============= FOUNDER OPERATIONS =============

export async function fetchFounders(): Promise<Founder[]> {
  const response = await fetch('/api/internal/finance/founders');
  if (!response.ok) throw new Error('Failed to fetch founders');
  const data = await response.json();
  return data.founders || [];
}

export async function createFounder(founder: Partial<Founder>): Promise<Founder> {
  const response = await fetch('/api/internal/finance/founders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(founder),
  });
  if (!response.ok) throw new Error('Failed to create founder');
  const data = await response.json();
  return data.founder;
}

export async function updateFounder(
  founderId: string,
  updates: Partial<Founder>
): Promise<void> {
  const response = await fetch(`/api/internal/finance/founders?id=${founderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update founder');
}

export async function deleteFounder(founderId: string): Promise<void> {
  const response = await fetch(`/api/internal/finance/founders?id=${founderId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete founder');
}

// ============= ACCOUNT OPERATIONS =============

export async function fetchAccounts(): Promise<CompanyAccount[]> {
  const response = await fetch('/api/internal/finance/accounts');
  if (!response.ok) throw new Error('Failed to fetch accounts');
  const data = await response.json();
  return data.accounts || [];
}

export async function createAccount(account: Partial<CompanyAccount>): Promise<CompanyAccount> {
  const response = await fetch('/api/internal/finance/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) throw new Error('Failed to create account');
  const data = await response.json();
  return data.account;
}

export async function updateAccount(
  accountId: string,
  updates: Partial<CompanyAccount>
): Promise<void> {
  const response = await fetch(`/api/internal/finance/accounts/${accountId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update account');
}

export async function deleteAccount(accountId: string): Promise<void> {
  const response = await fetch(`/api/internal/finance/accounts/${accountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete account');
}

// ============= CONTRIBUTION OPERATIONS =============

export async function fetchContributions(founderId?: string): Promise<Contribution[]> {
  const url = `/api/internal/finance/contributions${founderId ? `?founderId=${founderId}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch contributions');
  const data = await response.json();
  return data.contributions || [];
}

export async function createContribution(
  contribution: Partial<Contribution>
): Promise<Contribution> {
  const response = await fetch('/api/internal/finance/contributions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contribution),
  });
  if (!response.ok) throw new Error('Failed to create contribution');
  const data = await response.json();
  return data.contribution;
}

export async function updateContribution(
  contributionId: string,
  updates: Partial<Contribution>
): Promise<void> {
  const response = await fetch(`/api/internal/finance/contributions/${contributionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update contribution');
}

export async function deleteContribution(contributionId: string): Promise<void> {
  const response = await fetch(`/api/internal/finance/contributions/${contributionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete contribution');
}

// ============= UTILITY FUNCTIONS =============

/**
 * Format amount with currency symbol
 */
export function formatAmount(amount: number, currency: string = 'PKR'): string {
  const symbols: Record<string, string> = {
    PKR: '₨',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol} ${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calculate remaining equity percentage
 */
export function calculateRemainingEquity(activeFounders: Founder[]): number {
  const total = activeFounders
    .filter((f) => f.status === 'active')
    .reduce((sum, f) => sum + f.profitSharePercentage, 0);
  return 100 - total;
}

/**
 * Get founder statistics
 */
export interface FounderStats {
  totalFounders: number;
  activeFounders: number;
  totalEquity: number;
  averageEquity: number;
}

export function calculateFounderStats(founders: Founder[]): FounderStats {
  const activeFounders = founders.filter((f) => f.status === 'active');
  const totalEquity = activeFounders.reduce((sum, f) => sum + f.profitSharePercentage, 0);
  return {
    totalFounders: founders.length,
    activeFounders: activeFounders.length,
    totalEquity,
    averageEquity: activeFounders.length > 0 ? totalEquity / activeFounders.length : 0,
  };
}

/**
 * Validate founder data
 */
export function validateFounder(founder: Partial<Founder>): string[] {
  const errors: string[] = [];

  if (!founder.name || founder.name.trim() === '') {
    errors.push('Founder name is required');
  }

  if (founder.profitSharePercentage !== undefined) {
    if (founder.profitSharePercentage < 0 || founder.profitSharePercentage > 100) {
      errors.push('Profit share must be between 0 and 100%');
    }
  }

  if (founder.email && !isValidEmail(founder.email)) {
    errors.push('Invalid email address');
  }

  return errors;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate account data
 */
export function validateAccount(account: Partial<CompanyAccount>): string[] {
  const errors: string[] = [];

  if (!account.name || account.name.trim() === '') {
    errors.push('Account name is required');
  }

  if (!account.accountType) {
    errors.push('Account type is required');
  }

  if (!account.currency) {
    errors.push('Currency is required');
  }

  if (account.currentBalance !== undefined && account.currentBalance < 0) {
    errors.push('Balance cannot be negative');
  }

  return errors;
}

/**
 * Export founders and accounts data to CSV
 */
export function exportToCSV(founders: Founder[], accounts: CompanyAccount[]): string {
  let csv = 'Founder Name,Email,Phone,Equity %,Status,Joined Date,Notes\n';

  founders.forEach((f) => {
    csv += `"${f.name}","${f.email || ''}","${f.phone || ''}","${f.profitSharePercentage}%","${f.status}","${f.joinedAt.toLocaleDateString()}","${f.notes || ''}"\n`;
  });

  csv += '\n\nAccount Name,Type,Founder,Bank,Currency,Balance,Status\n';

  accounts.forEach((a) => {
    csv += `"${a.name}","${a.accountType}","${a.founderName || 'N/A'}","${a.bankName || a.walletProvider || 'N/A'}","${a.currency}","${a.currentBalance}","${a.status}"\n`;
  });

  return csv;
}
