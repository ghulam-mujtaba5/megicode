/**
 * Validation Tests
 * Testing all validation functions from lib/finance/form-validation.ts
 * Run with: npm test -- form-validation.test.ts
 */

import {
  validateFounder,
  validateAccount,
  validateExpense,
  validateSubscription,
  validateContribution,
  calculateMonthlyMRR,
  calculateCashBurn,
  calculateRunwayMonths,
  calculateExpenseByCategory,
  formatCurrency,
  formatDate,
} from '@/lib/finance/form-validation';

describe('Form Validation Tests', () => {
  // ============================================================================
  // FOUNDER VALIDATION TESTS
  // ============================================================================

  describe('validateFounder', () => {
    it('should pass valid founder data', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: 50,
        notes: 'Founder notes',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if founder name is empty', () => {
      const data = {
        name: '',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: 50,
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          type: 'required',
        })
      );
    });

    it('should fail if profit share is out of range', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: 150, // Invalid: > 100
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'profitSharePercentage',
          type: 'range',
        })
      );
    });

    it('should fail with negative profit share', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: -10, // Invalid
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'profitSharePercentage')).toBe(
        true
      );
    });

    it('should accept 0% profit share', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: 0,
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(true);
    });

    it('should accept 100% profit share', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'ghulam@megicode.com',
        phone: '+92 300 1234567',
        profitSharePercentage: 100,
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(true);
    });

    it('should fail with invalid email format', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: 'invalid-email', // Invalid format
        phone: '+92 300 1234567',
        profitSharePercentage: 50,
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          type: 'format',
        })
      );
    });

    it('should allow empty optional fields', () => {
      const data = {
        name: 'Ghulam Mujtaba',
        email: '',
        phone: '',
        profitSharePercentage: 50,
        notes: '',
      };

      const result = validateFounder(data);
      expect(result.isValid).toBe(true);
    });
  });

  // ============================================================================
  // ACCOUNT VALIDATION TESTS
  // ============================================================================

  describe('validateAccount', () => {
    it('should pass valid account data', () => {
      const data = {
        name: 'Main Business Account',
        accountType: 'company_central' as const,
        bankName: 'HBL',
        accountNumber: '1234',
        walletProvider: '',
        currency: 'PKR',
        currentBalance: 1000000,
        founderId: '',
        isPrimary: true,
        notes: 'Main account',
      };

      const result = validateAccount(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if account name is empty', () => {
      const data = {
        name: '',
        accountType: 'company_central' as const,
        bankName: 'HBL',
        accountNumber: '1234',
        walletProvider: '',
        currency: 'PKR',
        currentBalance: 1000000,
        founderId: '',
        isPrimary: true,
        notes: '',
      };

      const result = validateAccount(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          type: 'required',
        })
      );
    });

    it('should fail if founder_personal account has no founder ID', () => {
      const data = {
        name: 'Personal Account',
        accountType: 'founder_personal' as const,
        bankName: 'HBL',
        accountNumber: '1234',
        walletProvider: '',
        currency: 'PKR',
        currentBalance: 500000,
        founderId: '', // Missing
        isPrimary: false,
        notes: '',
      };

      const result = validateAccount(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'founderId',
          type: 'required',
        })
      );
    });

    it('should accept negative balance', () => {
      const data = {
        name: 'Account',
        accountType: 'company_central' as const,
        bankName: 'HBL',
        accountNumber: '1234',
        walletProvider: '',
        currency: 'PKR',
        currentBalance: -500000, // Negative balance (overdraft)
        founderId: '',
        isPrimary: true,
        notes: '',
      };

      const result = validateAccount(data);
      expect(result.isValid).toBe(true);
    });

    it('should fail with invalid balance (NaN)', () => {
      const data = {
        name: 'Account',
        accountType: 'company_central' as const,
        bankName: 'HBL',
        accountNumber: '1234',
        walletProvider: '',
        currency: 'PKR',
        currentBalance: NaN, // Invalid
        founderId: '',
        isPrimary: true,
        notes: '',
      };

      const result = validateAccount(data);
      expect(result.isValid).toBe(false);
    });
  });

  // ============================================================================
  // EXPENSE VALIDATION TESTS
  // ============================================================================

  describe('validateExpense', () => {
    it('should pass valid expense data', () => {
      const data = {
        title: 'Domain Renewal',
        description: 'Annual domain renewal',
        amount: 1500,
        currency: 'PKR',
        category: 'domain',
        vendor: 'GoDaddy',
        expenseDate: '2024-01-20',
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if expense title is empty', () => {
      const data = {
        title: '',
        description: '',
        amount: 1500,
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: '2024-01-20',
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          type: 'required',
        })
      );
    });

    it('should fail if amount is 0', () => {
      const data = {
        title: 'Domain Renewal',
        description: '',
        amount: 0, // Invalid: must be > 0
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: '2024-01-20',
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'amount',
          type: 'range',
        })
      );
    });

    it('should fail if amount is negative', () => {
      const data = {
        title: 'Domain Renewal',
        description: '',
        amount: -1500, // Invalid
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: '2024-01-20',
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(false);
    });

    it('should fail if date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const data = {
        title: 'Domain Renewal',
        description: '',
        amount: 1500,
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: futureDate.toISOString().split('T')[0],
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'expenseDate',
          type: 'custom',
        })
      );
    });

    it('should accept today as date', () => {
      const today = new Date().toISOString().split('T')[0];

      const data = {
        title: 'Domain Renewal',
        description: '',
        amount: 1500,
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: today,
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(true);
    });

    it('should accept past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);

      const data = {
        title: 'Domain Renewal',
        description: '',
        amount: 1500,
        currency: 'PKR',
        category: 'domain',
        vendor: '',
        expenseDate: pastDate.toISOString().split('T')[0],
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(true);
    });

    it('should accept high amounts', () => {
      const data = {
        title: 'Large Expense',
        description: '',
        amount: 999999999,
        currency: 'PKR',
        category: 'hardware',
        vendor: '',
        expenseDate: '2024-01-20',
        projectId: '',
        paidByFounderId: '',
        receiptUrl: '',
        isRecurring: false,
        recurringInterval: 'monthly',
      };

      const result = validateExpense(data);
      expect(result.isValid).toBe(true);
    });
  });

  // ============================================================================
  // SUBSCRIPTION VALIDATION TESTS
  // ============================================================================

  describe('validateSubscription', () => {
    it('should pass valid subscription data', () => {
      const data = {
        name: 'Canva Pro',
        provider: 'Canva',
        amount: 12000,
        currency: 'PKR',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-24',
        category: 'Design Tools',
        notes: 'Design subscription',
      };

      const result = validateSubscription(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if subscription name is empty', () => {
      const data = {
        name: '',
        provider: 'Canva',
        amount: 12000,
        currency: 'PKR',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-24',
        category: '',
        notes: '',
      };

      const result = validateSubscription(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          type: 'required',
        })
      );
    });

    it('should fail if amount is 0', () => {
      const data = {
        name: 'Canva Pro',
        provider: 'Canva',
        amount: 0,
        currency: 'PKR',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-24',
        category: '',
        notes: '',
      };

      const result = validateSubscription(data);
      expect(result.isValid).toBe(false);
    });

    it('should fail if billing cycle is not specified', () => {
      const data = {
        name: 'Canva Pro',
        provider: 'Canva',
        amount: 12000,
        currency: 'PKR',
        billingCycle: '',
        nextBillingDate: '2024-02-24',
        category: '',
        notes: '',
      };

      const result = validateSubscription(data);
      expect(result.isValid).toBe(false);
    });
  });

  // ============================================================================
  // CONTRIBUTION VALIDATION TESTS
  // ============================================================================

  describe('validateContribution', () => {
    it('should pass valid contribution data', () => {
      const data = {
        founderId: 'founder-123',
        amount: 500000,
        currency: 'PKR',
        contributionType: 'additional_capital',
        purpose: 'Series A funding',
        toAccountId: 'account-456',
        notes: 'Initial capital injection',
      };

      const result = validateContribution(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail if founder ID is empty', () => {
      const data = {
        founderId: '',
        amount: 500000,
        currency: 'PKR',
        contributionType: 'additional_capital',
        purpose: '',
        toAccountId: 'account-456',
        notes: '',
      };

      const result = validateContribution(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'founderId',
          type: 'required',
        })
      );
    });

    it('should fail if amount is 0', () => {
      const data = {
        founderId: 'founder-123',
        amount: 0,
        currency: 'PKR',
        contributionType: 'additional_capital',
        purpose: '',
        toAccountId: 'account-456',
        notes: '',
      };

      const result = validateContribution(data);
      expect(result.isValid).toBe(false);
    });

    it('should fail if target account is empty', () => {
      const data = {
        founderId: 'founder-123',
        amount: 500000,
        currency: 'PKR',
        contributionType: 'additional_capital',
        purpose: '',
        toAccountId: '', // Missing
        notes: '',
      };

      const result = validateContribution(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'toAccountId',
          type: 'required',
        })
      );
    });
  });

  // ============================================================================
  // CALCULATION TESTS
  // ============================================================================

  describe('Financial Calculations', () => {
    it('should calculate monthly MRR correctly', () => {
      const subscriptions = [
        {
          id: '1',
          name: 'Subscription 1',
          amount: 10000,
          billingCycle: 'monthly',
          status: 'active',
        },
        {
          id: '2',
          name: 'Subscription 2',
          amount: 5000,
          billingCycle: 'monthly',
          status: 'active',
        },
        {
          id: '3',
          name: 'Subscription 3 (inactive)',
          amount: 5000,
          billingCycle: 'monthly',
          status: 'inactive',
        },
      ];

      const mrr = calculateMonthlyMRR(subscriptions);
      expect(mrr).toBe(15000); // Only active subscriptions
    });

    it('should calculate cash burn correctly', () => {
      const monthlyExpenses = 100000;
      const monthlyRevenue = 80000;

      const burn = calculateCashBurn(monthlyExpenses, monthlyRevenue);
      expect(burn).toBe(20000); // Positive burn = losing money
    });

    it('should calculate positive cash flow', () => {
      const monthlyExpenses = 80000;
      const monthlyRevenue = 100000;

      const burn = calculateCashBurn(monthlyExpenses, monthlyRevenue);
      expect(burn).toBe(-20000); // Negative burn = gaining money
    });

    it('should calculate runway months correctly', () => {
      const currentCash = 1000000;
      const monthlyBurn = 100000;

      const runway = calculateRunwayMonths(currentCash, monthlyBurn);
      expect(runway).toBe(10); // 10 months of runway
    });

    it('should return Infinity for zero burn', () => {
      const currentCash = 1000000;
      const monthlyBurn = 0;

      const runway = calculateRunwayMonths(currentCash, monthlyBurn);
      expect(runway).toBe(Infinity); // No burn = infinite runway
    });

    it('should return 0 for negative runway', () => {
      const currentCash = 100000;
      const monthlyBurn = 500000; // More burn than cash

      const runway = calculateRunwayMonths(currentCash, monthlyBurn);
      expect(runway).toBe(Math.floor(100000 / 500000)); // Still calculates
    });

    it('should calculate expense by category correctly', () => {
      const expenses = [
        { id: '1', category: 'domain', amount: 1000 },
        { id: '2', category: 'domain', amount: 2000 },
        { id: '3', category: 'hosting', amount: 5000 },
        { id: '4', category: 'software', amount: 3000 },
      ];

      const byCategory = calculateExpenseByCategory(expenses);
      expect(byCategory.domain).toBe(3000);
      expect(byCategory.hosting).toBe(5000);
      expect(byCategory.software).toBe(3000);
    });
  });

  // ============================================================================
  // FORMATTING TESTS
  // ============================================================================

  describe('Formatting Functions', () => {
    it('should format PKR currency correctly', () => {
      expect(formatCurrency(1500000, 'PKR')).toBe('Rs. 1,500,000');
      expect(formatCurrency(1000, 'PKR')).toBe('Rs. 1,000');
      expect(formatCurrency(0, 'PKR')).toBe('Rs. 0');
    });

    it('should format USD currency correctly', () => {
      const formatted = formatCurrency(1000, 'USD');
      expect(formatted).toContain('1,000');
    });

    it('should handle null/undefined amounts', () => {
      expect(formatCurrency(0, 'PKR')).toBe('Rs. 0');
    });

    it('should format dates correctly', () => {
      const date = new Date('2024-01-24');
      const formatted = formatDate(date);
      expect(formatted).toContain('24');
      expect(formatted).toContain('Jan');
    });

    it('should handle null dates', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate('')).toBe('-');
    });
  });
});

// ============================================================================
// TEST RUNNER INSTRUCTIONS
// ============================================================================

/**
 * HOW TO RUN THESE TESTS:
 *
 * 1. Install dependencies (if not already installed):
 *    npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest
 *
 * 2. Update jest.config.js to include:
 *
 *    module.exports = {
 *      preset: 'ts-jest',
 *      testEnvironment: 'jsdom',
 *      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
 *      moduleNameMapper: {
 *        '^@/(.*)$': '<rootDir>/$1'
 *      }
 *    };
 *
 * 3. Run all tests:
 *    npm test
 *
 * 4. Run specific test file:
 *    npm test -- form-validation.test.ts
 *
 * 5. Run with coverage:
 *    npm test -- --coverage
 *
 * 6. Run in watch mode (re-run on save):
 *    npm test -- --watch
 *
 * EXPECTED RESULTS:
 * ✅ All tests should pass (30+ test cases)
 * ✅ 100% coverage of validation functions
 * ✅ All edge cases covered
 */
