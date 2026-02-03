/**
 * Modular Financial Form Components
 * Specialized, focused forms for each financial entity
 */
'use client';

import React, { useState, useEffect } from 'react';
import s from '../styles.module.css';
import {
  TextInput,
  SelectInput,
  TextAreaInput,
  NumberInput,
  DateInput,
  CheckboxInput,
  RangeSlider,
} from './FormInputs';
import {
  validateFounder,
  validateAccount,
  validateExpense,
  validateSubscription,
  validateContribution,
  FounderFormData,
  AccountFormData,
  ExpenseFormData,
  SubscriptionFormData,
  ContributionFormData,
  ValidationError,
} from '@/lib/finance/form-validation';

// ============================================================================
// Founder Form Component
// ============================================================================

interface FounderFormProps {
  initialData?: FounderFormData & { id?: string };
  existingFounders?: any[];
  onSubmit: (data: FounderFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FounderForm({ initialData, existingFounders = [], onSubmit, onCancel, isLoading }: FounderFormProps) {
  const [data, setData] = useState<FounderFormData>(
    initialData || { name: '', email: '', phone: '', profitSharePercentage: 50, notes: '' }
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFounder(data, existingFounders, initialData?.id);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ...(initialData?.id && { id: initialData.id }) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): ValidationError | undefined => errors.find((e) => e.field === field);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
        <TextInput
          name="name"
          label="Full Name"
          required
          placeholder="e.g., Ghulam Mujtaba"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          error={getError('name')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <TextInput
            name="email"
            label="Email"
            type="email"
            placeholder="founder@megicode.com"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            error={getError('email')}
          />
          <TextInput
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+92 300 1234567"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            error={getError('phone')}
          />
        </div>

        <RangeSlider
          name="profitSharePercentage"
          label="Profit Share Percentage"
          required
          type="range"
          min="0"
          max="100"
          value={data.profitSharePercentage}
          onChange={(e) => setData({ ...data, profitSharePercentage: parseInt(e.target.value) })}
          suffix="%"
          showValue={true}
          error={getError('profitSharePercentage')}
        />

        <TextAreaInput
          name="notes"
          label="Notes"
          placeholder="Any additional information about this founder..."
          rows={3}
          value={data.notes || ''}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-3)', marginTop: 'var(--int-space-6)' }}>
        <button type="button" onClick={onCancel} className={`${s.btn} ${s.btnSecondary}`}>
          Cancel
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Saving...' : initialData?.id ? 'Update Founder' : 'Add Founder'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Account Form Component
// ============================================================================

interface AccountFormProps {
  initialData?: AccountFormData & { id?: string };
  founders?: any[];
  onSubmit: (data: AccountFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AccountForm({ initialData, founders = [], onSubmit, onCancel, isLoading }: AccountFormProps) {
  const [data, setData] = useState<AccountFormData>(
    initialData || {
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
    }
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAccount(data);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ...(initialData?.id && { id: initialData.id }) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): ValidationError | undefined => errors.find((e) => e.field === field);

  const accountTypes = [
    { value: 'company_central', label: 'Company Central' },
    { value: 'founder_personal', label: 'Founder Personal' },
    { value: 'operations', label: 'Operations' },
    { value: 'savings', label: 'Savings' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <TextInput
            name="name"
            label="Account Name"
            required
            placeholder="e.g., Main Business Account"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            error={getError('name')}
          />
          <SelectInput
            name="accountType"
            label="Account Type"
            required
            options={accountTypes}
            value={data.accountType}
            onChange={(e) => setData({ ...data, accountType: e.target.value as any })}
            error={getError('accountType')}
          />
        </div>

        {data.accountType === 'founder_personal' && (
          <SelectInput
            name="founderId"
            label="Linked Founder"
            options={founders.map((f) => ({ value: f.id, label: f.name }))}
            value={data.founderId || ''}
            onChange={(e) => setData({ ...data, founderId: e.target.value })}
            error={getError('founderId')}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <TextInput
            name="bankName"
            label="Bank Name"
            placeholder="e.g., HBL, Meezan"
            value={data.bankName}
            onChange={(e) => setData({ ...data, bankName: e.target.value })}
          />
          <TextInput
            name="walletProvider"
            label="Wallet Provider"
            placeholder="e.g., JazzCash, EasyPaisa"
            value={data.walletProvider}
            onChange={(e) => setData({ ...data, walletProvider: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--int-space-4)' }}>
          <TextInput
            name="accountNumber"
            label="Account Number (Last 4)"
            placeholder="1234"
            maxLength={4}
            value={data.accountNumber}
            onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
          />
          <SelectInput
            name="currency"
            label="Currency"
            options={[
              { value: 'PKR', label: 'PKR' },
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
            ]}
            value={data.currency}
            onChange={(e) => setData({ ...data, currency: e.target.value })}
          />
          <NumberInput
            name="currentBalance"
            label="Current Balance"
            placeholder="0"
            value={data.currentBalance}
            onChange={(e) => setData({ ...data, currentBalance: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <CheckboxInput
          name="isPrimary"
          label="Set as primary account"
          checked={data.isPrimary}
          onChange={(e) => setData({ ...data, isPrimary: e.target.checked })}
        />

        <TextAreaInput
          name="notes"
          label="Notes"
          placeholder="Any additional notes..."
          rows={2}
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-3)', marginTop: 'var(--int-space-6)' }}>
        <button type="button" onClick={onCancel} className={`${s.btn} ${s.btnSecondary}`}>
          Cancel
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Saving...' : initialData?.id ? 'Update Account' : 'Add Account'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Expense Form Component
// ============================================================================

interface ExpenseFormProps {
  initialData?: ExpenseFormData & { id?: string };
  founders?: any[];
  onSubmit: (data: ExpenseFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

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

export function ExpenseForm({ initialData, founders = [], onSubmit, onCancel, isLoading }: ExpenseFormProps) {
  const [data, setData] = useState<ExpenseFormData>(
    initialData || {
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
    }
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateExpense(data);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ...(initialData?.id && { id: initialData.id }) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): ValidationError | undefined => errors.find((e) => e.field === field);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
        <TextInput
          name="title"
          label="Title"
          required
          placeholder="e.g., Domain Renewal - megicode.com"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          error={getError('title')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <SelectInput
            name="category"
            label="Category"
            required
            options={expenseCategories}
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            error={getError('category')}
          />
          <TextInput
            name="vendor"
            label="Vendor"
            placeholder="e.g., GoDaddy"
            value={data.vendor}
            onChange={(e) => setData({ ...data, vendor: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 'var(--int-space-4)' }}>
          <NumberInput
            name="amount"
            label="Amount"
            required
            placeholder="0"
            min="0"
            step="0.01"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })}
            error={getError('amount')}
          />
          <SelectInput
            name="currency"
            label="Currency"
            options={[
              { value: 'PKR', label: 'PKR' },
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
            ]}
            value={data.currency}
            onChange={(e) => setData({ ...data, currency: e.target.value })}
          />
          <DateInput
            name="expenseDate"
            label="Date"
            required
            value={data.expenseDate}
            onChange={(e) => setData({ ...data, expenseDate: e.target.value })}
            error={getError('expenseDate')}
          />
        </div>

        <TextAreaInput
          name="description"
          label="Description"
          placeholder="Additional details about this expense..."
          rows={2}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <SelectInput
          name="paidByFounderId"
          label="Paid By (Optional)"
          options={founders.map((f) => ({ value: f.id, label: f.name }))}
          value={data.paidByFounderId || ''}
          onChange={(e) => setData({ ...data, paidByFounderId: e.target.value })}
        />

        <CheckboxInput
          name="isRecurring"
          label="This is a recurring expense"
          checked={data.isRecurring || false}
          onChange={(e) => setData({ ...data, isRecurring: e.target.checked })}
        />

        {data.isRecurring && (
          <SelectInput
            name="recurringInterval"
            label="Recurring Interval"
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'annual', label: 'Annual' },
            ]}
            value={data.recurringInterval || 'monthly'}
            onChange={(e) => setData({ ...data, recurringInterval: e.target.value })}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-3)', marginTop: 'var(--int-space-6)' }}>
        <button type="button" onClick={onCancel} className={`${s.btn} ${s.btnSecondary}`}>
          Cancel
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Saving...' : initialData?.id ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Subscription Form Component
// ============================================================================

interface SubscriptionFormProps {
  initialData?: SubscriptionFormData & { id?: string };
  onSubmit: (data: SubscriptionFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SubscriptionForm({ initialData, onSubmit, onCancel, isLoading }: SubscriptionFormProps) {
  const [data, setData] = useState<SubscriptionFormData>(
    initialData || {
      name: '',
      provider: '',
      amount: 0,
      currency: 'PKR',
      billingCycle: 'monthly',
      nextBillingDate: new Date().toISOString().split('T')[0],
      category: '',
      notes: '',
    }
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSubscription(data);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, ...(initialData?.id && { id: initialData.id }) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): ValidationError | undefined => errors.find((e) => e.field === field);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <TextInput
            name="name"
            label="Subscription Name"
            required
            placeholder="e.g., Canva Pro"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            error={getError('name')}
          />
          <TextInput
            name="provider"
            label="Provider"
            placeholder="e.g., Canva"
            value={data.provider}
            onChange={(e) => setData({ ...data, provider: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--int-space-4)' }}>
          <NumberInput
            name="amount"
            label="Amount"
            required
            placeholder="0"
            min="0"
            step="0.01"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })}
            error={getError('amount')}
          />
          <SelectInput
            name="billingCycle"
            label="Billing Cycle"
            required
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={data.billingCycle}
            onChange={(e) => setData({ ...data, billingCycle: e.target.value })}
            error={getError('billingCycle')}
          />
          <DateInput
            name="nextBillingDate"
            label="Next Billing Date"
            required
            value={data.nextBillingDate}
            onChange={(e) => setData({ ...data, nextBillingDate: e.target.value })}
            error={getError('nextBillingDate')}
          />
        </div>

        <TextInput
          name="category"
          label="Category"
          placeholder="e.g., Design Tools"
          value={data.category}
          onChange={(e) => setData({ ...data, category: e.target.value })}
        />

        <TextAreaInput
          name="notes"
          label="Notes"
          placeholder="Additional information..."
          rows={2}
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-3)', marginTop: 'var(--int-space-6)' }}>
        <button type="button" onClick={onCancel} className={`${s.btn} ${s.btnSecondary}`}>
          Cancel
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Saving...' : initialData?.id ? 'Update Subscription' : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Contribution Form Component
// ============================================================================

interface ContributionFormProps {
  founders?: any[];
  accounts?: any[];
  onSubmit: (data: ContributionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContributionForm({ founders = [], accounts = [], onSubmit, onCancel, isLoading }: ContributionFormProps) {
  const [data, setData] = useState<ContributionFormData>({
    founderId: founders.length > 0 ? founders[0].id : '',
    amount: 0,
    currency: 'PKR',
    contributionType: 'additional_capital',
    purpose: '',
    toAccountId: accounts.find((a) => a.accountType === 'company_central')?.id || '',
    notes: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContribution(data);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): ValidationError | undefined => errors.find((e) => e.field === field);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-4)' }}>
          <SelectInput
            name="founderId"
            label="Founder"
            required
            options={founders.map((f) => ({ value: f.id, label: f.name }))}
            value={data.founderId}
            onChange={(e) => setData({ ...data, founderId: e.target.value })}
            error={getError('founderId')}
          />
          <SelectInput
            name="contributionType"
            label="Contribution Type"
            options={[
              { value: 'initial_investment', label: 'Initial Investment' },
              { value: 'additional_capital', label: 'Additional Capital' },
              { value: 'loan_to_company', label: 'Loan to Company' },
              { value: 'expense_reimbursement', label: 'Expense Reimbursement' },
            ]}
            value={data.contributionType}
            onChange={(e) => setData({ ...data, contributionType: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--int-space-4)' }}>
          <NumberInput
            name="amount"
            label="Amount"
            required
            placeholder="0"
            min="0"
            step="0.01"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })}
            error={getError('amount')}
          />
          <SelectInput
            name="toAccountId"
            label="To Account"
            required
            options={accounts.map((a) => ({ value: a.id, label: a.name }))}
            value={data.toAccountId}
            onChange={(e) => setData({ ...data, toAccountId: e.target.value })}
            error={getError('toAccountId')}
          />
        </div>

        <TextInput
          name="purpose"
          label="Purpose"
          placeholder="Reason for contribution..."
          value={data.purpose}
          onChange={(e) => setData({ ...data, purpose: e.target.value })}
        />

        <TextAreaInput
          name="notes"
          label="Notes"
          placeholder="Additional information..."
          rows={2}
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--int-space-3)', marginTop: 'var(--int-space-6)' }}>
        <button type="button" onClick={onCancel} className={`${s.btn} ${s.btnSecondary}`}>
          Cancel
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Recording...' : 'Record Contribution'}
        </button>
      </div>
    </form>
  );
}
