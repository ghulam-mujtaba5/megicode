/**
 * Advanced Financial Validation Framework
 * Enhanced validation with rules, patterns, and business logic checks
 */

import {
  FinancialException,
  FinancialErrorFactory,
  FinancialErrorCode,
} from './error-handling';

// ============================================================================
// VALIDATION RULES & PATTERNS
// ============================================================================

export interface ValidationRule {
  name: string;
  test: (value: any) => boolean;
  message: string;
}

export interface ValidationRuleSet {
  [field: string]: ValidationRule[];
}

// Predefined validation rules
export const ValidationRules = {
  // String rules
  required: (label: string = 'Field'): ValidationRule => ({
    name: 'required',
    test: (value) => value !== null && value !== undefined && String(value).trim() !== '',
    message: `${label} is required`,
  }),

  minLength: (min: number, label: string = 'Field'): ValidationRule => ({
    name: 'minLength',
    test: (value) => String(value).length >= min,
    message: `${label} must be at least ${min} characters`,
  }),

  maxLength: (max: number, label: string = 'Field'): ValidationRule => ({
    name: 'maxLength',
    test: (value) => String(value).length <= max,
    message: `${label} must not exceed ${max} characters`,
  }),

  // Email
  email: (): ValidationRule => ({
    name: 'email',
    test: (value) =>
      value === '' ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Invalid email address',
  }),

  phone: (): ValidationRule => ({
    name: 'phone',
    test: (value) =>
      value === '' ||
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
        .test(value),
    message: 'Invalid phone number',
  }),

  // Number rules
  number: (): ValidationRule => ({
    name: 'number',
    test: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    message: 'Must be a valid number',
  }),

  positive: (): ValidationRule => ({
    name: 'positive',
    test: (value) => parseFloat(value) > 0,
    message: 'Must be a positive number',
  }),

  nonNegative: (): ValidationRule => ({
    name: 'nonNegative',
    test: (value) => parseFloat(value) >= 0,
    message: 'Must not be negative',
  }),

  min: (min: number, label: string = 'Value'): ValidationRule => ({
    name: 'min',
    test: (value) => parseFloat(value) >= min,
    message: `${label} must be at least ${min}`,
  }),

  max: (max: number, label: string = 'Value'): ValidationRule => ({
    name: 'max',
    test: (value) => parseFloat(value) <= max,
    message: `${label} must not exceed ${max}`,
  }),

  between: (min: number, max: number, label: string = 'Value'): ValidationRule => ({
    name: 'between',
    test: (value) => {
      const num = parseFloat(value);
      return num >= min && num <= max;
    },
    message: `${label} must be between ${min} and ${max}`,
  }),

  // Percentage
  percentage: (): ValidationRule => ({
    name: 'percentage',
    test: (value) => {
      const num = parseFloat(value);
      return num >= 0 && num <= 100;
    },
    message: 'Must be between 0 and 100',
  }),

  // Currency
  currency: (): ValidationRule => ({
    name: 'currency',
    test: (value) => /^[A-Z]{3}$/.test(value),
    message: 'Invalid currency code (must be 3 uppercase letters)',
  }),

  // Date rules
  date: (): ValidationRule => ({
    name: 'date',
    test: (value) => !isNaN(new Date(value).getTime()),
    message: 'Invalid date',
  }),

  notFutureDate: (): ValidationRule => ({
    name: 'notFutureDate',
    test: (value) => new Date(value) <= new Date(),
    message: 'Date cannot be in the future',
  }),

  notPastDate: (): ValidationRule => ({
    name: 'notPastDate',
    test: (value) => new Date(value) >= new Date(),
    message: 'Date cannot be in the past',
  }),

  // IBAN/Bank Account
  iban: (): ValidationRule => ({
    name: 'iban',
    test: (value) =>
      value === '' ||
      /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(value),
    message: 'Invalid IBAN',
  }),

  // URL
  url: (): ValidationRule => ({
    name: 'url',
    test: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return value === '';
      }
    },
    message: 'Invalid URL',
  }),
};

// ============================================================================
// VALIDATOR CLASS
// ============================================================================

export class AdvancedValidator {
  private rules: ValidationRuleSet;
  private errors: Record<string, string[]> = {};

  constructor(rules: ValidationRuleSet = {}) {
    this.rules = rules;
  }

  /**
   * Add validation rule for a field
   */
  public addRule(field: string, rule: ValidationRule): this {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    this.rules[field].push(rule);
    return this;
  }

  /**
   * Add multiple rules for a field
   */
  public addRules(field: string, rules: ValidationRule[]): this {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    this.rules[field].push(...rules);
    return this;
  }

  /**
   * Validate data against rules
   */
  public validate(data: Record<string, any>): { valid: boolean; errors: Record<string, string[]> } {
    this.errors = {};

    for (const [field, fieldRules] of Object.entries(this.rules)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      for (const rule of fieldRules) {
        if (!rule.test(value)) {
          fieldErrors.push(rule.message);
        }
      }

      if (fieldErrors.length > 0) {
        this.errors[field] = fieldErrors;
      }
    }

    return {
      valid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  /**
   * Get validation errors
   */
  public getErrors(): Record<string, string[]> {
    return this.errors;
  }

  /**
   * Get error for specific field
   */
  public getFieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }

  /**
   * Check if field has error
   */
  public hasError(field: string): boolean {
    return !!this.errors[field];
  }

  /**
   * Clear all errors
   */
  public clear(): void {
    this.errors = {};
  }
}

// ============================================================================
// BUSINESS LOGIC VALIDATORS
// ============================================================================

export class FinancialBusinessValidator {
  /**
   * Validate founder equity split
   */
  static validateEquitySplit(founders: Array<{ profitSharePercentage: number }>): { valid: boolean; error?: string } {
    const total = founders.reduce((sum, f) => sum + f.profitSharePercentage, 0);

    if (Math.abs(total - 100) > 0.01) {
      // Account for floating point precision
      return {
        valid: false,
        error: `Founder equity must sum to 100%. Current total: ${total.toFixed(2)}%`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate cash flow
   */
  static validateCashFlow(
    balance: number,
    expenses: number,
    buffer: number = 0.1
  ): { valid: boolean; error?: string; runway?: number } {
    const minimumBalance = expenses * buffer; // 10% buffer by default

    if (balance < minimumBalance) {
      return {
        valid: false,
        error: `Insufficient balance. Required: ${minimumBalance}, Available: ${balance}`,
      };
    }

    const runway = balance / expenses; // months
    return { valid: true, runway };
  }

  /**
   * Validate recurring expense schedule
   */
  static validateRecurringSchedule(
    startDate: Date,
    endDate: Date,
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  ): { valid: boolean; error?: string; occurrences?: number } {
    if (endDate <= startDate) {
      return { valid: false, error: 'End date must be after start date' };
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    const minDays: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      annual: 365,
    };

    if (diffDays < minDays[frequency]) {
      return {
        valid: false,
        error: `Date range must span at least ${minDays[frequency]} days for ${frequency} frequency`,
      };
    }

    // Calculate occurrences
    const frequencyDays: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      annual: 365,
    };

    const occurrences = Math.floor(diffDays / frequencyDays[frequency]);

    return { valid: true, occurrences };
  }

  /**
   * Validate multi-currency transaction
   */
  static validateMultiCurrencyTransaction(
    amounts: Array<{ amount: number; currency: string }>,
    supported: string[] = []
  ): { valid: boolean; error?: string } {
    if (amounts.some((a) => a.amount < 0)) {
      return { valid: false, error: 'All amounts must be positive' };
    }

    if (supported.length > 0) {
      const unsupported = amounts.filter((a) => !supported.includes(a.currency));
      if (unsupported.length > 0) {
        return {
          valid: false,
          error: `Unsupported currencies: ${unsupported.map((a) => a.currency).join(', ')}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate budget vs actual
   */
  static validateBudgetVariance(
    budgeted: number,
    actual: number,
    threshold: number = 0.1
  ): { valid: boolean; variance: number; percentageVariance: number; isWithinBudget: boolean } {
    const variance = actual - budgeted;
    const percentageVariance = (variance / budgeted) * 100;
    const isWithinBudget = Math.abs(percentageVariance) <= threshold * 100;

    return {
      valid: isWithinBudget,
      variance,
      percentageVariance,
      isWithinBudget,
    };
  }

  /**
   * Validate account reconciliation
   */
  static validateReconciliation(
    bankBalance: number,
    bookBalance: number,
    tolerance: number = 0.01
  ): { valid: boolean; difference: number; error?: string } {
    const difference = Math.abs(bankBalance - bookBalance);

    if (difference > tolerance) {
      return {
        valid: false,
        difference,
        error: `Reconciliation failed. Bank balance (${bankBalance}) vs Book balance (${bookBalance}). Difference: ${difference}`,
      };
    }

    return { valid: true, difference };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a validator with common financial fields
 */
export function createFinancialValidator(): AdvancedValidator {
  const validator = new AdvancedValidator();

  validator.addRules('amount', [ValidationRules.positive()]);
  validator.addRules('currency', [ValidationRules.required('Currency'), ValidationRules.currency()]);
  validator.addRules('date', [ValidationRules.date(), ValidationRules.notFutureDate()]);
  validator.addRules('email', [ValidationRules.email()]);
  validator.addRules('phone', [ValidationRules.phone()]);

  return validator;
}

/**
 * Validate and throw exception on failure
 */
export function validateOrThrow(
  data: Record<string, any>,
  rules: ValidationRuleSet,
  entityName: string = 'Data'
): void {
  const validator = new AdvancedValidator(rules);
  const result = validator.validate(data);

  if (!result.valid) {
    const errors = Object.entries(result.errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');

    throw new FinancialException(FinancialErrorCode.VALIDATION_FAILED, `${entityName} validation failed: ${errors}`, {
      details: result.errors,
      severity: 'low',
    });
  }
}

export default AdvancedValidator;
