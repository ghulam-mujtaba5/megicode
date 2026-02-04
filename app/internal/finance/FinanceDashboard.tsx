'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import s from '../styles.module.css';

// Types
interface Founder {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profitSharePercentage: number;
  status: 'active' | 'inactive';
  joinedAt: Date | string | number;
  notes: string | null;
  totalContributions?: number;
  totalDistributions?: number;
}

interface Account {
  id: string;
  name: string;
  accountType: 'company_central' | 'founder_personal' | 'operations' | 'savings';
  bankName: string | null;
  accountNumber: string | null;
  walletProvider: string | null;
  currency: string;
  currentBalance: number;
  status: 'active' | 'inactive' | 'frozen';
  isPrimary: boolean;
  founderId: string | null;
  notes: string | null;
}

interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  category: string;
  vendor: string | null;
  expenseDate: Date | string | number;
  status: string;
  projectId: string | null;
  receiptUrl: string | null;
  paidByFounderId: string | null;
}

interface Subscription {
  id: string;
  name: string;
  provider: string | null;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: Date | string | number;
  status: string;
  category: string | null;
}

interface Distribution {
  id: string;
  period: string | null;
  totalProfit: number;
  companyRetention: number;
  distributedAmount: number;
  currency: string;
  status: string;
  createdAt: Date | string | number;
}

interface Contribution {
  id: string;
  founderId: string;
  amount: number;
  currency: string;
  contributionType: string;
  purpose: string | null;
  status: string;
  contributedAt: Date | string | number;
}

type ActiveTab = 'overview' | 'founders' | 'accounts' | 'expenses' | 'subscriptions' | 'distributions' | 'contributions';
type ActiveModal = 'founder' | 'account' | 'expense' | 'subscription' | 'distribution' | 'contribution' | null;

// Icons
const Icons = {
  finance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  expense: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  distribution: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  subscription: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  contribution: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  ),
  trendUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  delete: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  filter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  overview: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
};

// Utility Functions
function formatMoney(amount: number, currency: string = 'PKR') {
  const value = amount || 0;
  
  if (currency === 'PKR') {
    return `Rs. ${value.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(0)}`;
  }
}

function formatDate(timestamp: Date | string | number | null) {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateShort(timestamp: Date | string | number | null) {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
  });
}

// Category/Type Labels
const expenseCategories = [
  { value: 'domain', label: 'Domain' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'software_subscription', label: 'Software Subscription' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'legal', label: 'Legal' },
  { value: 'office', label: 'Office' },
  { value: 'travel', label: 'Travel' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'product_development', label: 'Product Development' },
  { value: 'project_cost', label: 'Project Cost' },
  { value: 'misc', label: 'Miscellaneous' },
];

const accountTypes = [
  { value: 'company_central', label: 'Company Central' },
  { value: 'founder_personal', label: 'Founder Personal' },
  { value: 'operations', label: 'Operations' },
  { value: 'savings', label: 'Savings' },
];

const contributionTypes = [
  { value: 'initial_investment', label: 'Initial Investment' },
  { value: 'additional_capital', label: 'Additional Capital' },
  { value: 'loan_to_company', label: 'Loan to Company' },
  { value: 'expense_reimbursement', label: 'Expense Reimbursement' },
];

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

interface FinanceDashboardProps {
  initialData: {
    founders: Founder[];
    accounts: Account[];
    expenses: Expense[];
    subscriptions: Subscription[];
    distributions: Distribution[];
    contributions: Contribution[];
    totals: {
      companyBalance: number;
      totalRevenue: number;
      totalExpenses: number;
      totalProfit: number;
      monthlyExpenses: number;
    };
  };
}

export default function FinanceDashboard({ initialData }: FinanceDashboardProps) {
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [editingItem, setEditingItem] = useState<Founder | Account | Expense | Subscription | Distribution | Contribution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Data States
  const [founders, setFounders] = useState<Founder[]>(initialData.founders);
  const [accounts, setAccounts] = useState<Account[]>(initialData.accounts);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialData.subscriptions);
  const [distributions, setDistributions] = useState<Distribution[]>(initialData.distributions);
  const [contributions, setContributions] = useState<Contribution[]>(initialData.contributions);
  const [totals, setTotals] = useState(initialData.totals);

  // Form States
  const [founderForm, setFounderForm] = useState({
    name: '',
    email: '',
    phone: '',
    profitSharePercentage: 50,
    notes: '',
  });

  const [accountForm, setAccountForm] = useState<{
    name: string;
    accountType: 'company_central' | 'founder_personal' | 'operations' | 'savings';
    bankName: string;
    accountNumber: string;
    walletProvider: string;
    currency: string;
    currentBalance: number;
    founderId: string;
    isPrimary: boolean;
    notes: string;
  }>({
    name: '',
    accountType: 'company_central',
    bankName: '',
    accountNumber: '',
    walletProvider: '',
    currency: 'PKR',
    currentBalance: 0,
    founderId: '',
    isPrimary: false,
    notes: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    description: '',
    amount: 0,
    currency: 'PKR',
    category: 'misc' as const,
    vendor: '',
    expenseDate: new Date().toISOString().split('T')[0],
    projectId: '',
    paidByFounderId: '',
    receiptUrl: '',
    isRecurring: false,
    recurringInterval: 'monthly' as const,
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    name: '',
    provider: '',
    amount: 0,
    currency: 'PKR',
    billingCycle: 'monthly' as const,
    nextBillingDate: new Date().toISOString().split('T')[0],
    category: '',
    notes: '',
  });

  const [contributionForm, setContributionForm] = useState({
    founderId: '',
    amount: 0,
    currency: 'PKR',
    contributionType: 'additional_capital' as const,
    purpose: '',
    toAccountId: '',
    notes: '',
  });

  // Clear notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Computed values
  const totalSharePercentage = useMemo(() => 
    founders.filter(f => f.status === 'active').reduce((acc, f) => acc + f.profitSharePercentage, 0),
    [founders]
  );

  const activeFounders = useMemo(() => founders.filter(f => f.status === 'active'), [founders]);
  const activeAccounts = useMemo(() => accounts.filter(a => a.status === 'active'), [accounts]);

  // API Functions
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [foundersRes, accountsRes, expensesRes, subscriptionsRes] = await Promise.all([
        fetch('/api/internal/finance/founders'),
        fetch('/api/internal/finance/accounts'),
        fetch('/api/internal/finance/expenses'),
        fetch('/api/internal/finance/subscriptions'),
      ]);

      if (foundersRes.ok) {
        const data = await foundersRes.json();
        setFounders(data.founders || []);
      }
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      }
      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data.expenses || []);
      }
      if (subscriptionsRes.ok) {
        const data = await subscriptionsRes.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      showNotification('error', 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  // CRUD Functions - Founders
  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `/api/internal/finance/founders/${(editingItem as Founder).id}`
        : '/api/internal/finance/founders';
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(founderForm),
      });

      if (res.ok) {
        showNotification('success', editingItem ? 'Founder updated successfully' : 'Founder added successfully');
        await refreshData();
        closeModal();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save founder');
      }
    } catch (error) {
      console.error('Failed to save founder:', error);
      showNotification('error', 'Failed to save founder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFounder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this founder?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/finance/founders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Founder deleted successfully');
        await refreshData();
      } else {
        showNotification('error', 'Failed to delete founder');
      }
    } catch {
      showNotification('error', 'Failed to delete founder');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions - Accounts
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `/api/internal/finance/accounts/${(editingItem as Account).id}`
        : '/api/internal/finance/accounts';
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...accountForm,
          currentBalance: accountForm.currentBalance * 100, // Convert to smallest unit
        }),
      });

      if (res.ok) {
        showNotification('success', editingItem ? 'Account updated successfully' : 'Account added successfully');
        await refreshData();
        closeModal();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save account');
      }
    } catch (error) {
      console.error('Failed to save account:', error);
      showNotification('error', 'Failed to save account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/finance/accounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Account deleted successfully');
        await refreshData();
      } else {
        showNotification('error', 'Failed to delete account');
      }
    } catch {
      showNotification('error', 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions - Expenses
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `/api/internal/finance/expenses/${(editingItem as Expense).id}`
        : '/api/internal/finance/expenses';
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseForm,
          amount: expenseForm.amount * 100, // Convert to smallest unit
        }),
      });

      if (res.ok) {
        showNotification('success', editingItem ? 'Expense updated successfully' : 'Expense added successfully');
        await refreshData();
        closeModal();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      showNotification('error', 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/finance/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Expense deleted successfully');
        await refreshData();
      } else {
        showNotification('error', 'Failed to delete expense');
      }
    } catch {
      showNotification('error', 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions - Subscriptions
  const handleSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `/api/internal/finance/subscriptions/${(editingItem as Subscription).id}`
        : '/api/internal/finance/subscriptions';
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...subscriptionForm,
          amount: subscriptionForm.amount * 100,
        }),
      });

      if (res.ok) {
        showNotification('success', editingItem ? 'Subscription updated successfully' : 'Subscription added successfully');
        await refreshData();
        closeModal();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
      showNotification('error', 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/finance/subscriptions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Subscription deleted successfully');
        await refreshData();
      } else {
        showNotification('error', 'Failed to delete subscription');
      }
    } catch {
      showNotification('error', 'Failed to delete subscription');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions - Contributions
  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/internal/finance/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contributionForm,
          amount: contributionForm.amount * 100,
        }),
      });

      if (res.ok) {
        showNotification('success', 'Contribution added successfully');
        await refreshData();
        closeModal();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save contribution');
      }
    } catch (error) {
      console.error('Failed to save contribution:', error);
      showNotification('error', 'Failed to save contribution');
    } finally {
      setLoading(false);
    }
  };

  // Modal Controls
  const openModal = (type: ActiveModal, item?: Founder | Account | Expense | Subscription | Distribution | Contribution) => {
    setActiveModal(type);
    setEditingItem(item || null);

    if (type === 'founder') {
      if (item) {
        const founder = item as Founder;
        setFounderForm({
          name: founder.name,
          email: founder.email || '',
          phone: founder.phone || '',
          profitSharePercentage: founder.profitSharePercentage,
          notes: founder.notes || '',
        });
      } else {
        setFounderForm({ name: '', email: '', phone: '', profitSharePercentage: 50, notes: '' });
      }
    } else if (type === 'account') {
      if (item) {
        const account = item as Account;
        setAccountForm({
          name: account.name,
          accountType: account.accountType,
          bankName: account.bankName || '',
          accountNumber: account.accountNumber || '',
          walletProvider: account.walletProvider || '',
          currency: account.currency,
          currentBalance: account.currentBalance / 100,
          founderId: account.founderId || '',
          isPrimary: account.isPrimary,
          notes: account.notes || '',
        });
      } else {
        setAccountForm({
          name: '',
          accountType: 'company_central',
          bankName: '',
          accountNumber: '',
          walletProvider: '',
          currency: 'PKR',
          currentBalance: 0,
          founderId: '',
          isPrimary: false,
          notes: '',
        });
      }
    } else if (type === 'expense') {
      if (item) {
        const expense = item as Expense;
        setExpenseForm({
          title: expense.title,
          description: expense.description || '',
          amount: expense.amount / 100,
          currency: expense.currency,
          category: expense.category as typeof expenseForm.category,
          vendor: expense.vendor || '',
          expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
          projectId: expense.projectId || '',
          paidByFounderId: expense.paidByFounderId || '',
          receiptUrl: expense.receiptUrl || '',
          isRecurring: false,
          recurringInterval: 'monthly',
        });
      } else {
        setExpenseForm({
          title: '',
          description: '',
          amount: 0,
          currency: 'PKR',
          category: 'misc',
          vendor: '',
          expenseDate: new Date().toISOString().split('T')[0],
          projectId: '',
          paidByFounderId: '',
          receiptUrl: '',
          isRecurring: false,
          recurringInterval: 'monthly',
        });
      }
    } else if (type === 'subscription') {
      if (item) {
        const sub = item as Subscription;
        setSubscriptionForm({
          name: sub.name,
          provider: sub.provider || '',
          amount: sub.amount / 100,
          currency: sub.currency,
          billingCycle: sub.billingCycle as typeof subscriptionForm.billingCycle,
          nextBillingDate: new Date(sub.nextBillingDate).toISOString().split('T')[0],
          category: sub.category || '',
          notes: '',
        });
      } else {
        setSubscriptionForm({
          name: '',
          provider: '',
          amount: 0,
          currency: 'PKR',
          billingCycle: 'monthly',
          nextBillingDate: new Date().toISOString().split('T')[0],
          category: '',
          notes: '',
        });
      }
    } else if (type === 'contribution') {
      setContributionForm({
        founderId: founders.length > 0 ? founders[0].id : '',
        amount: 0,
        currency: 'PKR',
        contributionType: 'additional_capital',
        purpose: '',
        toAccountId: activeAccounts.find(a => a.accountType === 'company_central')?.id || '',
        notes: '',
      });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
  };

  // Tab Content Renderers
  const renderOverview = () => (
    <>
      {/* KPI Cards */}
      <section className={s.kpiGrid}>
        <div className={`${s.kpiCard} ${s.kpiPrimary}`}>
          <div className={s.kpiIcon}>{Icons.wallet}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(totals.companyBalance)}</div>
            <div className={s.kpiLabel}>Company Balance</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiSuccess}`}>
          <div className={s.kpiIcon}>{Icons.trendUp}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(totals.totalRevenue)}</div>
            <div className={s.kpiLabel}>Total Revenue</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiDanger}`}>
          <div className={s.kpiIcon}>{Icons.trendDown}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(totals.totalExpenses)}</div>
            <div className={s.kpiLabel}>Total Expenses</div>
          </div>
        </div>
        
        <div className={`${s.kpiCard} ${s.kpiInfo}`}>
          <div className={s.kpiIcon}>{Icons.chart}</div>
          <div className={s.kpiContent}>
            <div className={s.kpiValue}>{formatMoney(totals.totalProfit)}</div>
            <div className={s.kpiLabel}>Net Profit</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
        <button onClick={() => openModal('founder')} className={`${s.card} ${s.cardHoverable}`} style={{ border: 'none', textAlign: 'left' }}>
          <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-primary-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-primary)' }}>
              {Icons.users}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Add Founder</div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Register new founder</div>
            </div>
          </div>
        </button>
        
        <button onClick={() => openModal('expense')} className={`${s.card} ${s.cardHoverable}`} style={{ border: 'none', textAlign: 'left' }}>
          <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-error-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-error)' }}>
              {Icons.expense}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Add Expense</div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Record new expense</div>
            </div>
          </div>
        </button>
        
        <button onClick={() => openModal('contribution')} className={`${s.card} ${s.cardHoverable}`} style={{ border: 'none', textAlign: 'left' }}>
          <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-success-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-success)' }}>
              {Icons.contribution}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Add Funds</div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Founder contribution</div>
            </div>
          </div>
        </button>
        
        <button onClick={() => openModal('account')} className={`${s.card} ${s.cardHoverable}`} style={{ border: 'none', textAlign: 'left' }}>
          <div className={s.cardBody} style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <div style={{ padding: 'var(--int-space-3)', background: 'var(--int-info-light)', borderRadius: 'var(--int-radius)', color: 'var(--int-info)' }}>
              {Icons.wallet}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Add Account</div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>Bank or wallet</div>
            </div>
          </div>
        </button>
      </section>

      {/* Main Content Grid */}
      <div className={s.grid2}>
        {/* Founders Summary */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>{Icons.users} Founders ({activeFounders.length})</h2>
            <button onClick={() => setActiveTab('founders')} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
              View All
            </button>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {founders.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center' }}>
                <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-4)' }}>No founders added yet</p>
                <button onClick={() => openModal('founder')} className={`${s.btn} ${s.btnPrimary}`}>
                  {Icons.plus} Add First Founder
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Share %</th>
                    <th>Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {founders.slice(0, 5).map((founder) => (
                    <tr key={founder.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{founder.name}</div>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{founder.email}</div>
                      </td>
                      <td>
                        <span className={`${s.badge} ${s.badgePrimary}`}>{founder.profitSharePercentage}%</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--int-success)' }}>
                        {formatMoney(founder.totalContributions || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Accounts Summary */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>{Icons.wallet} Accounts ({activeAccounts.length})</h2>
            <button onClick={() => setActiveTab('accounts')} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
              View All
            </button>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {accounts.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center' }}>
                <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-4)' }}>No accounts added yet</p>
                <button onClick={() => openModal('account')} className={`${s.btn} ${s.btnPrimary}`}>
                  {Icons.plus} Add First Account
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.slice(0, 5).map((account) => (
                    <tr key={account.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{account.name}</div>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                          {account.bankName || account.walletProvider || '-'}
                        </div>
                      </td>
                      <td>
                        <span className={s.badge}>{account.accountType.replace('_', ' ')}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: account.currentBalance >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                        {formatMoney(account.currentBalance, account.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>{Icons.expense} Recent Expenses</h2>
            <button onClick={() => setActiveTab('expenses')} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
              View All
            </button>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {expenses.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center' }}>
                <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-4)' }}>No expenses recorded yet</p>
                <button onClick={() => openModal('expense')} className={`${s.btn} ${s.btnPrimary}`}>
                  {Icons.plus} Add Expense
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{expense.title}</div>
                        {expense.vendor && <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{expense.vendor}</div>}
                      </td>
                      <td>
                        <span className={s.badge}>{expense.category.replace('_', ' ')}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--int-error)' }}>
                        -{formatMoney(expense.amount, expense.currency)}
                      </td>
                      <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                        {formatDateShort(expense.expenseDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Upcoming Subscriptions */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>{Icons.subscription} Subscriptions</h2>
            <button onClick={() => setActiveTab('subscriptions')} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 'var(--int-text-sm)' }}>
              View All
            </button>
          </div>
          <div className={s.cardBody} style={{ padding: 0 }}>
            {subscriptions.length === 0 ? (
              <div style={{ padding: 'var(--int-space-8)', textAlign: 'center' }}>
                <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-4)' }}>No subscriptions tracked yet</p>
                <button onClick={() => openModal('subscription')} className={`${s.btn} ${s.btnPrimary}`}>
                  {Icons.plus} Add Subscription
                </button>
              </div>
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Subscription</th>
                    <th>Cycle</th>
                    <th>Amount</th>
                    <th>Next Due</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.slice(0, 5).map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{sub.name}</div>
                        {sub.provider && <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{sub.provider}</div>}
                      </td>
                      <td>
                        <span className={s.badge}>{sub.billingCycle}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--int-warning)' }}>
                        {formatMoney(sub.amount, sub.currency)}
                      </td>
                      <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                        {formatDateShort(sub.nextBillingDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderFounders = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.users} Founders Management</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Manage company founders, profit shares, and track contributions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--int-space-3)' }}>
          <div style={{ 
            padding: 'var(--int-space-2) var(--int-space-4)', 
            background: totalSharePercentage === 100 ? 'var(--int-success-light)' : 'var(--int-warning-light)',
            color: totalSharePercentage === 100 ? 'var(--int-success)' : 'var(--int-warning)',
            borderRadius: 'var(--int-radius)',
            fontWeight: 600,
            fontSize: 'var(--int-text-sm)',
          }}>
            Total Share: {totalSharePercentage}%
          </div>
          <button onClick={() => openModal('founder')} className={`${s.btn} ${s.btnPrimary}`}>
            {Icons.plus} Add Founder
          </button>
        </div>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {founders.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.users}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No founders added yet</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Start by adding the company founders to manage profit distribution
            </p>
            <button onClick={() => openModal('founder')} className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              {Icons.plus} Add First Founder
            </button>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Founder</th>
                <th>Contact</th>
                <th>Profit Share</th>
                <th>Contributions</th>
                <th>Distributions</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {founders.map((founder) => (
                <tr key={founder.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--int-text-base)' }}>{founder.name}</div>
                    {founder.notes && (
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{founder.notes}</div>
                    )}
                  </td>
                  <td>
                    {founder.email && <div style={{ fontSize: 'var(--int-text-sm)' }}>{founder.email}</div>}
                    {founder.phone && <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{founder.phone}</div>}
                    {!founder.email && !founder.phone && <span style={{ color: 'var(--int-text-muted)' }}>-</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-2)' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '8px', 
                        background: 'var(--int-border)', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${founder.profitSharePercentage}%`, 
                          height: '100%', 
                          background: 'var(--int-primary)',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{founder.profitSharePercentage}%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--int-success)', fontWeight: 600 }}>
                    {formatMoney(founder.totalContributions || 0)}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {formatMoney(founder.totalDistributions || 0)}
                  </td>
                  <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                    {formatDate(founder.joinedAt)}
                  </td>
                  <td>
                    <span className={`${s.badge} ${founder.status === 'active' ? s.badgeSuccess : s.badgeWarning}`}>
                      {founder.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
                      <button 
                        onClick={() => openModal('founder', founder)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Edit"
                      >
                        {Icons.edit}
                      </button>
                      <button 
                        onClick={() => handleDeleteFounder(founder.id)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Delete"
                        style={{ color: 'var(--int-error)' }}
                      >
                        {Icons.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.wallet} Account Management</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Manage bank accounts, digital wallets, and track balances
          </p>
        </div>
        <button onClick={() => openModal('account')} className={`${s.btn} ${s.btnPrimary}`}>
          {Icons.plus} Add Account
        </button>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {accounts.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.wallet}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No accounts added yet</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Add your company bank accounts and digital wallets
            </p>
            <button onClick={() => openModal('account')} className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              {Icons.plus} Add First Account
            </button>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Bank/Wallet</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{account.name}</div>
                    {account.accountNumber && (
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>****{account.accountNumber}</div>
                    )}
                  </td>
                  <td>
                    <span className={`${s.badge} ${account.accountType === 'company_central' ? s.badgePrimary : s.badgeDefault}`}>
                      {account.accountType.replace('_', ' ')}
                    </span>
                    {account.isPrimary && (
                      <span className={`${s.badge} ${s.badgeSuccess}`} style={{ marginLeft: 'var(--int-space-1)' }}>Primary</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--int-text-muted)' }}>
                    {account.bankName || account.walletProvider || '-'}
                  </td>
                  <td style={{ fontWeight: 700, color: account.currentBalance >= 0 ? 'var(--int-success)' : 'var(--int-error)' }}>
                    {formatMoney(account.currentBalance, account.currency)}
                  </td>
                  <td>
                    <span className={`${s.badge} ${account.status === 'active' ? s.badgeSuccess : account.status === 'frozen' ? s.badgeError : s.badgeWarning}`}>
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
                      <button 
                        onClick={() => openModal('account', account)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Edit"
                      >
                        {Icons.edit}
                      </button>
                      <button 
                        onClick={() => handleDeleteAccount(account.id)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Delete"
                        style={{ color: 'var(--int-error)' }}
                      >
                        {Icons.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.expense} Expense Tracking</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Track all company expenses, receipts, and categorize spending
          </p>
        </div>
        <button onClick={() => openModal('expense')} className={`${s.btn} ${s.btnPrimary}`}>
          {Icons.plus} Add Expense
        </button>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {expenses.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.expense}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No expenses recorded</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Start tracking your business expenses
            </p>
            <button onClick={() => openModal('expense')} className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              {Icons.plus} Record First Expense
            </button>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{expense.title}</div>
                    {expense.description && (
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{expense.description}</div>
                    )}
                  </td>
                  <td>
                    <span className={s.badge}>{expense.category.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--int-error)' }}>
                    -{formatMoney(expense.amount, expense.currency)}
                  </td>
                  <td style={{ color: 'var(--int-text-muted)' }}>
                    {expense.vendor || '-'}
                  </td>
                  <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td>
                    <span className={`${s.badge} ${
                      expense.status === 'paid' ? s.badgeSuccess : 
                      expense.status === 'pending' ? s.badgeWarning : 
                      expense.status === 'rejected' ? s.badgeError :
                      s.badgeDefault
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
                      <button 
                        onClick={() => openModal('expense', expense)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Edit"
                      >
                        {Icons.edit}
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Delete"
                        style={{ color: 'var(--int-error)' }}
                      >
                        {Icons.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.subscription} Subscription Management</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Track recurring subscriptions and upcoming payments
          </p>
        </div>
        <button onClick={() => openModal('subscription')} className={`${s.btn} ${s.btnPrimary}`}>
          {Icons.plus} Add Subscription
        </button>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {subscriptions.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.subscription}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No subscriptions tracked</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Keep track of your recurring software subscriptions
            </p>
            <button onClick={() => openModal('subscription')} className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              {Icons.plus} Add First Subscription
            </button>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Subscription</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Cycle</th>
                <th>Next Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.name}</div>
                    {sub.category && (
                      <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>{sub.category}</div>
                    )}
                  </td>
                  <td style={{ color: 'var(--int-text-muted)' }}>
                    {sub.provider || '-'}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--int-warning)' }}>
                    {formatMoney(sub.amount, sub.currency)}
                  </td>
                  <td>
                    <span className={s.badge}>{sub.billingCycle}</span>
                  </td>
                  <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                    {formatDate(sub.nextBillingDate)}
                  </td>
                  <td>
                    <span className={`${s.badge} ${sub.status === 'active' ? s.badgeSuccess : s.badgeWarning}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--int-space-2)' }}>
                      <button 
                        onClick={() => openModal('subscription', sub)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Edit"
                      >
                        {Icons.edit}
                      </button>
                      <button 
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}
                        title="Delete"
                        style={{ color: 'var(--int-error)' }}
                      >
                        {Icons.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderContributions = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.contribution} Founder Contributions</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Track capital contributions from founders
          </p>
        </div>
        <button onClick={() => openModal('contribution')} className={`${s.btn} ${s.btnPrimary}`}>
          {Icons.plus} Add Contribution
        </button>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {contributions.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.contribution}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No contributions recorded</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Record founder investments and contributions
            </p>
            <button onClick={() => openModal('contribution')} className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              {Icons.plus} Record Contribution
            </button>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Founder</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contrib) => {
                const founder = founders.find(f => f.id === contrib.founderId);
                return (
                  <tr key={contrib.id}>
                    <td style={{ fontWeight: 600 }}>
                      {founder?.name || 'Unknown'}
                    </td>
                    <td>
                      <span className={s.badge}>{contrib.contributionType.replace(/_/g, ' ')}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--int-success)' }}>
                      +{formatMoney(contrib.amount, contrib.currency)}
                    </td>
                    <td style={{ color: 'var(--int-text-muted)' }}>
                      {contrib.purpose || '-'}
                    </td>
                    <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                      {formatDate(contrib.contributedAt)}
                    </td>
                    <td>
                      <span className={`${s.badge} ${contrib.status === 'confirmed' ? s.badgeSuccess : s.badgeWarning}`}>
                        {contrib.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderDistributions = () => (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div>
          <h2 className={s.cardTitle}>{Icons.distribution} Profit Distributions</h2>
          <p style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
            Track profit distributions to founders
          </p>
        </div>
        <Link href="/internal/finance/distributions/new" className={`${s.btn} ${s.btnPrimary}`}>
          {Icons.plus} New Distribution
        </Link>
      </div>
      <div className={s.cardBody} style={{ padding: 0 }}>
        {distributions.length === 0 ? (
          <div style={{ padding: 'var(--int-space-12)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--int-space-4)', color: 'var(--int-text-muted)' }}>
              {Icons.distribution}
            </div>
            <h3 style={{ marginBottom: 'var(--int-space-2)' }}>No distributions yet</h3>
            <p style={{ color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-6)' }}>
              Create profit distributions when projects complete
            </p>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Total Profit</th>
                <th>Company Retention</th>
                <th>Distributed</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((dist) => (
                <tr key={dist.id}>
                  <td style={{ fontWeight: 600 }}>{dist.period || 'One-time'}</td>
                  <td>{formatMoney(dist.totalProfit, dist.currency)}</td>
                  <td style={{ color: 'var(--int-info)' }}>{formatMoney(dist.companyRetention, dist.currency)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--int-success)' }}>{formatMoney(dist.distributedAmount, dist.currency)}</td>
                  <td style={{ color: 'var(--int-text-muted)', fontSize: 'var(--int-text-sm)' }}>
                    {formatDate(dist.createdAt)}
                  </td>
                  <td>
                    <span className={`${s.badge} ${dist.status === 'distributed' ? s.badgeSuccess : s.badgeWarning}`}>
                      {dist.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Modal Renderers
  const renderFounderModal = () => (
    <div className={s.modal} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div className={s.modalHeader}>
          <h2>{editingItem ? 'Edit Founder' : 'Add New Founder'}</h2>
          <button onClick={closeModal} className={s.modalClose}>{Icons.close}</button>
        </div>
        <form onSubmit={handleFounderSubmit}>
          <div className={s.modalBody}>
            <div className={s.formGroup}>
              <label className={s.label}>Full Name <span className={s.formRequired}>*</span></label>
              <input
                type="text"
                className={s.input}
                value={founderForm.name}
                onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                placeholder="e.g., Ghulam Mujtaba"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Email</label>
                <input
                  type="email"
                  className={s.input}
                  value={founderForm.email}
                  onChange={(e) => setFounderForm({ ...founderForm, email: e.target.value })}
                  placeholder="founder@megicode.com"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Phone</label>
                <input
                  type="tel"
                  className={s.input}
                  value={founderForm.phone}
                  onChange={(e) => setFounderForm({ ...founderForm, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Profit Share Percentage <span className={s.formRequired}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={founderForm.profitSharePercentage}
                  onChange={(e) => setFounderForm({ ...founderForm, profitSharePercentage: parseInt(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--int-primary)' }}
                />
                <input
                  type="number"
                  className={s.input}
                  value={founderForm.profitSharePercentage}
                  onChange={(e) => setFounderForm({ ...founderForm, profitSharePercentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  min="0"
                  max="100"
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <span style={{ fontWeight: 600 }}>%</span>
              </div>
              <p className={s.formHint}>
                Current total (excluding this): {totalSharePercentage - (editingItem ? (editingItem as Founder).profitSharePercentage : 0)}% 
                | After: {totalSharePercentage - (editingItem ? (editingItem as Founder).profitSharePercentage : 0) + founderForm.profitSharePercentage}%
              </p>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Notes</label>
              <textarea
                className={s.textarea}
                value={founderForm.notes}
                onChange={(e) => setFounderForm({ ...founderForm, notes: e.target.value })}
                placeholder="Any additional notes about this founder..."
                rows={3}
              />
            </div>
          </div>
          <div className={s.modalFooter}>
            <button type="button" onClick={closeModal} className={`${s.btn} ${s.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update Founder' : 'Add Founder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAccountModal = () => (
    <div className={s.modal} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className={s.modalHeader}>
          <h2>{editingItem ? 'Edit Account' : 'Add New Account'}</h2>
          <button onClick={closeModal} className={s.modalClose}>{Icons.close}</button>
        </div>
        <form onSubmit={handleAccountSubmit}>
          <div className={s.modalBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Account Name <span className={s.formRequired}>*</span></label>
                <input
                  type="text"
                  className={s.input}
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  placeholder="e.g., Main Business Account"
                  required
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Account Type <span className={s.formRequired}>*</span></label>
                <select
                  className={s.select}
                  value={accountForm.accountType}
                  onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as typeof accountForm.accountType })}
                >
                  {accountTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {accountForm.accountType === 'founder_personal' && (
              <div className={s.formGroup}>
                <label className={s.label}>Linked Founder</label>
                <select
                  className={s.select}
                  value={accountForm.founderId}
                  onChange={(e) => setAccountForm({ ...accountForm, founderId: e.target.value })}
                >
                  <option value="">Select founder...</option>
                  {founders.map(founder => (
                    <option key={founder.id} value={founder.id}>{founder.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Bank Name</label>
                <input
                  type="text"
                  className={s.input}
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  placeholder="e.g., HBL, Meezan"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Wallet Provider</label>
                <input
                  type="text"
                  className={s.input}
                  value={accountForm.walletProvider}
                  onChange={(e) => setAccountForm({ ...accountForm, walletProvider: e.target.value })}
                  placeholder="e.g., JazzCash, EasyPaisa"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Account Number (Last 4)</label>
                <input
                  type="text"
                  className={s.input}
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Currency</label>
                <select
                  className={s.select}
                  value={accountForm.currency}
                  onChange={(e) => setAccountForm({ ...accountForm, currency: e.target.value })}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Current Balance</label>
                <input
                  type="number"
                  className={s.input}
                  value={accountForm.currentBalance}
                  onChange={(e) => setAccountForm({ ...accountForm, currentBalance: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className={s.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--int-space-2)' }}>
              <input
                type="checkbox"
                className={s.checkbox}
                id="isPrimary"
                checked={accountForm.isPrimary}
                onChange={(e) => setAccountForm({ ...accountForm, isPrimary: e.target.checked })}
              />
              <label htmlFor="isPrimary" style={{ cursor: 'pointer' }}>Set as primary account</label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Notes</label>
              <textarea
                className={s.textarea}
                value={accountForm.notes}
                onChange={(e) => setAccountForm({ ...accountForm, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>
          <div className={s.modalFooter}>
            <button type="button" onClick={closeModal} className={`${s.btn} ${s.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update Account' : 'Add Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderExpenseModal = () => (
    <div className={s.modal} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className={s.modalHeader}>
          <h2>{editingItem ? 'Edit Expense' : 'Record New Expense'}</h2>
          <button onClick={closeModal} className={s.modalClose}>{Icons.close}</button>
        </div>
        <form onSubmit={handleExpenseSubmit}>
          <div className={s.modalBody}>
            <div className={s.formGroup}>
              <label className={s.label}>Title <span className={s.formRequired}>*</span></label>
              <input
                type="text"
                className={s.input}
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                placeholder="e.g., Domain Renewal - megicode.com"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Category <span className={s.formRequired}>*</span></label>
                <select
                  className={s.select}
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as typeof expenseForm.category })}
                >
                  {expenseCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Vendor</label>
                <input
                  type="text"
                  className={s.input}
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                  placeholder="e.g., GoDaddy"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Amount <span className={s.formRequired}>*</span></label>
                <input
                  type="number"
                  className={s.input}
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Currency</label>
                <select
                  className={s.select}
                  value={expenseForm.currency}
                  onChange={(e) => setExpenseForm({ ...expenseForm, currency: e.target.value })}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Date <span className={s.formRequired}>*</span></label>
                <input
                  type="date"
                  className={s.input}
                  value={expenseForm.expenseDate}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Paid By Founder</label>
              <select
                className={s.select}
                value={expenseForm.paidByFounderId}
                onChange={(e) => setExpenseForm({ ...expenseForm, paidByFounderId: e.target.value })}
              >
                <option value="">Paid from company account</option>
                {founders.map(founder => (
                  <option key={founder.id} value={founder.id}>{founder.name} (personal)</option>
                ))}
              </select>
              <p className={s.formHint}>Select if a founder paid this from their personal funds (for reimbursement)</p>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Description</label>
              <textarea
                className={s.textarea}
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                placeholder="Additional details about this expense..."
                rows={2}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Receipt URL</label>
              <input
                type="url"
                className={s.input}
                value={expenseForm.receiptUrl}
                onChange={(e) => setExpenseForm({ ...expenseForm, receiptUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className={s.modalFooter}>
            <button type="button" onClick={closeModal} className={`${s.btn} ${s.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update Expense' : 'Record Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSubscriptionModal = () => (
    <div className={s.modal} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div className={s.modalHeader}>
          <h2>{editingItem ? 'Edit Subscription' : 'Add New Subscription'}</h2>
          <button onClick={closeModal} className={s.modalClose}>{Icons.close}</button>
        </div>
        <form onSubmit={handleSubscriptionSubmit}>
          <div className={s.modalBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Service Name <span className={s.formRequired}>*</span></label>
                <input
                  type="text"
                  className={s.input}
                  value={subscriptionForm.name}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, name: e.target.value })}
                  placeholder="e.g., Vercel Pro"
                  required
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Provider</label>
                <input
                  type="text"
                  className={s.input}
                  value={subscriptionForm.provider}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, provider: e.target.value })}
                  placeholder="e.g., Vercel"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Amount <span className={s.formRequired}>*</span></label>
                <input
                  type="number"
                  className={s.input}
                  value={subscriptionForm.amount}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Currency</label>
                <select
                  className={s.select}
                  value={subscriptionForm.currency}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, currency: e.target.value })}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Billing Cycle</label>
                <select
                  className={s.select}
                  value={subscriptionForm.billingCycle}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, billingCycle: e.target.value as typeof subscriptionForm.billingCycle })}
                >
                  {billingCycles.map(cycle => (
                    <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Next Billing Date <span className={s.formRequired}>*</span></label>
                <input
                  type="date"
                  className={s.input}
                  value={subscriptionForm.nextBillingDate}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, nextBillingDate: e.target.value })}
                  required
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Category</label>
                <input
                  type="text"
                  className={s.input}
                  value={subscriptionForm.category}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, category: e.target.value })}
                  placeholder="e.g., Hosting, Tools"
                />
              </div>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Notes</label>
              <textarea
                className={s.textarea}
                value={subscriptionForm.notes}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          <div className={s.modalFooter}>
            <button type="button" onClick={closeModal} className={`${s.btn} ${s.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update Subscription' : 'Add Subscription')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContributionModal = () => (
    <div className={s.modal} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div className={s.modalHeader}>
          <h2>Record Founder Contribution</h2>
          <button onClick={closeModal} className={s.modalClose}>{Icons.close}</button>
        </div>
        <form onSubmit={handleContributionSubmit}>
          <div className={s.modalBody}>
            <div className={s.formGroup}>
              <label className={s.label}>Founder <span className={s.formRequired}>*</span></label>
              <select
                className={s.select}
                value={contributionForm.founderId}
                onChange={(e) => setContributionForm({ ...contributionForm, founderId: e.target.value })}
                required
              >
                <option value="">Select founder...</option>
                {founders.map(founder => (
                  <option key={founder.id} value={founder.id}>{founder.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--int-space-4)' }}>
              <div className={s.formGroup}>
                <label className={s.label}>Amount <span className={s.formRequired}>*</span></label>
                <input
                  type="number"
                  className={s.input}
                  value={contributionForm.amount}
                  onChange={(e) => setContributionForm({ ...contributionForm, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  min="0"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Currency</label>
                <select
                  className={s.select}
                  value={contributionForm.currency}
                  onChange={(e) => setContributionForm({ ...contributionForm, currency: e.target.value })}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Contribution Type <span className={s.formRequired}>*</span></label>
              <select
                className={s.select}
                value={contributionForm.contributionType}
                onChange={(e) => setContributionForm({ ...contributionForm, contributionType: e.target.value as typeof contributionForm.contributionType })}
              >
                {contributionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Purpose</label>
              <input
                type="text"
                className={s.input}
                value={contributionForm.purpose}
                onChange={(e) => setContributionForm({ ...contributionForm, purpose: e.target.value })}
                placeholder="e.g., Server hosting payment"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Deposit To Account</label>
              <select
                className={s.select}
                value={contributionForm.toAccountId}
                onChange={(e) => setContributionForm({ ...contributionForm, toAccountId: e.target.value })}
              >
                <option value="">Select account...</option>
                {activeAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name} ({account.accountType.replace('_', ' ')})</option>
                ))}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Notes</label>
              <textarea
                className={s.textarea}
                value={contributionForm.notes}
                onChange={(e) => setContributionForm({ ...contributionForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          <div className={s.modalFooter}>
            <button type="button" onClick={closeModal} className={`${s.btn} ${s.btnSecondary}`}>
              Cancel
            </button>
            <button type="submit" className={`${s.btn} ${s.btnSuccess}`} disabled={loading || !contributionForm.founderId}>
              {loading ? 'Saving...' : 'Record Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: Icons.overview },
    { id: 'founders', label: 'Founders', icon: Icons.users },
    { id: 'accounts', label: 'Accounts', icon: Icons.wallet },
    { id: 'expenses', label: 'Expenses', icon: Icons.expense },
    { id: 'subscriptions', label: 'Subscriptions', icon: Icons.subscription },
    { id: 'contributions', label: 'Contributions', icon: Icons.contribution },
    { id: 'distributions', label: 'Distributions', icon: Icons.distribution },
  ];

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* Notification */}
        {notification && (
          <div 
            style={{
              position: 'fixed',
              top: 'var(--int-space-6)',
              right: 'var(--int-space-6)',
              padding: 'var(--int-space-4) var(--int-space-6)',
              borderRadius: 'var(--int-radius-lg)',
              background: notification.type === 'success' ? 'var(--int-success)' : 'var(--int-error)',
              color: 'white',
              boxShadow: 'var(--int-shadow-lg)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--int-space-3)',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {notification.type === 'success' ? Icons.check : Icons.alert}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>{Icons.finance} Financial Management</h1>
            <p className={s.pageSubtitle}>
              Complete overview of Megicode&apos;s finances, accounts, expenses, and profit distribution.
            </p>
          </div>
          <div className={s.pageActions}>
            <button onClick={refreshData} className={`${s.btn} ${s.btnSecondary}`} disabled={loading}>
              {Icons.refresh} Refresh
            </button>
            <Link href="/internal/reports/finance" className={`${s.btn} ${s.btnSecondary}`}>
              {Icons.chart} Reports
            </Link>
            <Link href="/internal/finance/settings" className={`${s.btn} ${s.btnGhost}`}>
              {Icons.settings}
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className={s.tabs} style={{ marginBottom: 'var(--int-space-6)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${s.tab} ${activeTab === tab.id ? s.tabActive : ''}`}
            >
              <span style={{ marginRight: 'var(--int-space-2)' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'founders' && renderFounders()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'contributions' && renderContributions()}
        {activeTab === 'distributions' && renderDistributions()}

        {/* Modals */}
        {activeModal === 'founder' && renderFounderModal()}
        {activeModal === 'account' && renderAccountModal()}
        {activeModal === 'expense' && renderExpenseModal()}
        {activeModal === 'subscription' && renderSubscriptionModal()}
        {activeModal === 'contribution' && renderContributionModal()}
      </div>
    </div>
  );
}
