/**
 * Enhanced Form Validation & Error Messages
 * Better real-time feedback and actionable errors
 */
'use client';

import s from '../styles.module.css';

interface ValidationError {
  field: string;
  message: string;
  suggestions?: string[];
  severity?: 'error' | 'warning' | 'info';
}

interface FormFieldErrorProps {
  error?: ValidationError;
  touched?: boolean;
  value?: any;
  hint?: string;
}

export function FormFieldError({ error, touched, value, hint }: FormFieldErrorProps) {
  if (!touched || !error) {
    if (hint) {
      return (
        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
          💡 {hint}
        </div>
      );
    }
    return null;
  }

  const severityColors = {
    error: { bg: 'var(--int-error-light)', border: 'var(--int-error)', text: 'var(--int-error)' },
    warning: { bg: 'var(--int-warning-light)', border: 'var(--int-warning)', text: 'var(--int-warning)' },
    info: { bg: 'var(--int-info-light)', border: 'var(--int-info)', text: 'var(--int-info)' },
  };

  const colors = severityColors[error.severity || 'error'];

  return (
    <div
      style={{
        marginTop: 'var(--int-space-2)',
        padding: 'var(--int-space-2) var(--int-space-3)',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--int-radius-sm)',
        color: colors.text,
      }}
    >
      <div style={{ fontSize: 'var(--int-text-sm)', fontWeight: 600, marginBottom: error.suggestions ? 'var(--int-space-1)' : 0 }}>
        {error.message}
      </div>
      {error.suggestions && error.suggestions.length > 0 && (
        <div style={{ fontSize: 'var(--int-text-xs)', marginTop: 'var(--int-space-1)' }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-1)' }}>💡 Suggestions:</div>
          <ul style={{ margin: 0, paddingLeft: 'var(--int-space-3)', display: 'grid', gap: 'var(--int-space-1)' }}>
            {error.suggestions.map((suggestion, idx) => (
              <li key={idx} style={{ fontSize: 'var(--int-text-xs)' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Enhanced form field wrapper
interface FormFieldProps {
  label: string;
  error?: ValidationError;
  touched?: boolean;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, touched, required, hint, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 'var(--int-space-4)' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--int-space-2)',
          fontWeight: 600,
          marginBottom: 'var(--int-space-2)',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--int-error)' }}>*</span>}
      </label>
      {children}
      <FormFieldError error={error} touched={touched} hint={hint} />
    </div>
  );
}

// Real-time validation suggestions
export const VALIDATION_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  expense: {
    title_empty: [
      'Use clear, descriptive names like "AWS Monthly Invoice"',
      'Include the date or period if relevant',
      'Avoid vague names like "Payment" or "Bill"',
    ],
    amount_zero: [
      'Make sure you entered the correct amount',
      'Include currency if it differs from default',
      'Double-check the receipt or invoice',
    ],
    amount_too_large: [
      'Verify this is not a yearly amount entered as monthly',
      'Check if multiple expenses should be split',
      'Confirm the currency conversion is correct',
    ],
  },
  founder: {
    name_empty: [
      'Enter the full name of the founder',
      'Ensure name is spelled correctly',
      'Use the name they prefer professionally',
    ],
    email_invalid: [
      'Check for typos in the email address',
      'Make sure you included the @ symbol',
      'Verify the domain extension (.com, .pk, etc.)',
    ],
    share_negative: [
      'Profit share must be a positive percentage',
      'Ensure shares add up to 100% across all founders',
      'Round to nearest whole or half percent',
    ],
  },
  account: {
    name_empty: [
      'Give a descriptive account name (e.g., "Main Business", "Savings")',
      'Include the bank name for clarity',
      'Make it easy to identify at a glance',
    ],
    balance_invalid: [
      'Enter the current balance in the smallest currency unit',
      'Ensure no special characters or currencies symbols',
      'Use 0 for empty accounts',
    ],
  },
};

// Real-time validation feedback component
interface ValidationFeedbackProps {
  field: string;
  value: any;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    validate?: (value: any) => boolean | ValidationError;
    pattern?: RegExp;
  };
  entityType?: 'expense' | 'founder' | 'account' | 'subscription';
}

export function useValidationFeedback({ field, value, rules, entityType }: ValidationFeedbackProps) {
  const getError = (): ValidationError | null => {
    if (rules.required && !value) {
      return {
        field,
        message: `${field} is required`,
        severity: 'error',
        suggestions: entityType && VALIDATION_SUGGESTIONS[entityType]?.[`${field}_empty`],
      };
    }

    if (rules.minLength && value?.length < rules.minLength) {
      return {
        field,
        message: `${field} must be at least ${rules.minLength} characters`,
        severity: 'warning',
      };
    }

    if (rules.maxLength && value?.length > rules.maxLength) {
      return {
        field,
        message: `${field} must not exceed ${rules.maxLength} characters`,
        severity: 'warning',
      };
    }

    if (rules.pattern && !rules.pattern.test(String(value))) {
      return {
        field,
        message: `${field} format is invalid`,
        severity: 'error',
        suggestions: entityType && VALIDATION_SUGGESTIONS[entityType]?.[`${field}_invalid`],
      };
    }

    if (rules.validate) {
      const result = rules.validate(value);
      if (result === false) {
        return {
          field,
          message: `${field} validation failed`,
          severity: 'error',
        };
      }
      if (typeof result === 'object') {
        return result;
      }
    }

    return null;
  };

  return getError();
}

// Global error toast
interface ErrorToastProps {
  message: string;
  suggestions?: string[];
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorToast({ message, suggestions, onDismiss, actionLabel, onAction }: ErrorToastProps) {
  return (
    <div
      style={{
        padding: 'var(--int-space-4)',
        background: 'var(--int-error-light)',
        border: '1px solid var(--int-error)',
        borderRadius: 'var(--int-radius)',
        color: 'var(--int-error)',
        marginBottom: 'var(--int-space-4)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-1)' }}>❌ {message}</div>
      {suggestions && suggestions.length > 0 && (
        <ul
          style={{
            margin: 'var(--int-space-2) 0',
            paddingLeft: 'var(--int-space-4)',
            fontSize: 'var(--int-text-sm)',
            display: 'grid',
            gap: 'var(--int-space-1)',
          }}
        >
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: 'var(--int-space-2)', marginTop: 'var(--int-space-2)' }}>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            style={{
              background: 'none',
              border: '1px solid var(--int-error)',
              color: 'var(--int-error)',
              padding: 'var(--int-space-1) var(--int-space-2)',
              borderRadius: 'var(--int-radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--int-text-xs)',
            }}
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--int-error)',
            cursor: 'pointer',
            fontWeight: 600,
            marginLeft: 'auto',
            textDecoration: 'underline',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
