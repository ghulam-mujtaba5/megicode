/**
 * Comprehensive Error Handling System
 * Enhanced error management, logging, and recovery for financial operations
 */

// ============================================================================
// ERROR TYPES & CODES
// ============================================================================

export enum FinancialErrorCode {
  // Validation Errors (1000-1999)
  VALIDATION_FAILED = 'FIN_VALIDATION_001',
  INVALID_AMOUNT = 'FIN_VALIDATION_002',
  INVALID_CURRENCY = 'FIN_VALIDATION_003',
  INVALID_DATE = 'FIN_VALIDATION_004',
  DUPLICATE_ENTRY = 'FIN_VALIDATION_005',
  MISSING_REQUIRED_FIELD = 'FIN_VALIDATION_006',

  // Authorization Errors (2000-2999)
  UNAUTHORIZED = 'FIN_AUTH_001',
  PERMISSION_DENIED = 'FIN_AUTH_002',
  INSUFFICIENT_BALANCE = 'FIN_AUTH_003',

  // Data Errors (3000-3999)
  NOT_FOUND = 'FIN_DATA_001',
  ALREADY_EXISTS = 'FIN_DATA_002',
  CONFLICT = 'FIN_DATA_003',
  CORRUPTED_DATA = 'FIN_DATA_004',

  // Operation Errors (4000-4999)
  OPERATION_FAILED = 'FIN_OPERATION_001',
  CONCURRENT_MODIFICATION = 'FIN_OPERATION_002',
  TRANSACTION_FAILED = 'FIN_OPERATION_003',
  ROLLBACK_FAILED = 'FIN_OPERATION_004',

  // Integration Errors (5000-5999)
  EXTERNAL_SERVICE_ERROR = 'FIN_INTEGRATION_001',
  PAYMENT_GATEWAY_ERROR = 'FIN_INTEGRATION_002',
  BANK_SYNC_ERROR = 'FIN_INTEGRATION_003',

  // System Errors (6000-6999)
  DATABASE_ERROR = 'FIN_SYSTEM_001',
  SERVICE_UNAVAILABLE = 'FIN_SYSTEM_002',
  TIMEOUT = 'FIN_SYSTEM_003',
  INTERNAL_ERROR = 'FIN_SYSTEM_999',
}

export interface FinancialError {
  code: FinancialErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  suggestion?: string;
  stackTrace?: string;
}

// ============================================================================
// ERROR CLASS
// ============================================================================

export class FinancialException extends Error {
  public readonly code: FinancialErrorCode;
  public readonly details: Record<string, any>;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly recoverable: boolean;
  public readonly suggestion?: string;
  public readonly timestamp: Date;

  constructor(
    code: FinancialErrorCode,
    message: string,
    options?: {
      details?: Record<string, any>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      recoverable?: boolean;
      suggestion?: string;
    }
  ) {
    super(message);
    this.name = 'FinancialException';
    this.code = code;
    this.details = options?.details || {};
    this.severity = options?.severity || 'medium';
    this.recoverable = options?.recoverable ?? false;
    this.suggestion = options?.suggestion;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): FinancialError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      severity: this.severity,
      recoverable: this.recoverable,
      suggestion: this.suggestion,
      stackTrace: this.stack,
    };
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export interface ErrorHandler {
  (error: FinancialException): Promise<void> | void;
}

export class ErrorHandlingService {
  private errorLog: FinancialError[] = [];
  private maxLogSize = 1000;
  private errorHandlers: Map<FinancialErrorCode, ErrorHandler[]> = new Map();
  private globalErrorHandlers: ErrorHandler[] = [];

  /**
   * Register a handler for specific error code
   */
  public on(code: FinancialErrorCode, handler: ErrorHandler): void {
    if (!this.errorHandlers.has(code)) {
      this.errorHandlers.set(code, []);
    }
    this.errorHandlers.get(code)!.push(handler);
  }

  /**
   * Register a global error handler
   */
  public onError(handler: ErrorHandler): void {
    this.globalErrorHandlers.push(handler);
  }

  /**
   * Handle error with logging and callbacks
   */
  public async handle(error: FinancialException | Error): Promise<void> {
    const financialError =
      error instanceof FinancialException
        ? error
        : new FinancialException(FinancialErrorCode.INTERNAL_ERROR, error.message, {
            details: { originalError: error.toString() },
            severity: 'high',
          });

    // Log the error
    this.logError(financialError.toJSON());

    // Call specific handlers
    const handlers = this.errorHandlers.get(financialError.code) || [];
    for (const handler of handlers) {
      await Promise.resolve(handler(financialError));
    }

    // Call global handlers
    for (const handler of this.globalErrorHandlers) {
      await Promise.resolve(handler(financialError));
    }
  }

  /**
   * Log error with rotation
   */
  private logError(error: FinancialError): void {
    this.errorLog.push(error);

    // Rotate log if too large
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.code}] ${error.message}`, error.details);
    }
  }

  /**
   * Get error logs
   */
  public getLogs(filters?: { code?: FinancialErrorCode; severity?: string; limit?: number }): FinancialError[] {
    let logs = [...this.errorLog];

    if (filters?.code) {
      logs = logs.filter((l) => l.code === filters.code);
    }

    if (filters?.severity) {
      logs = logs.filter((l) => l.severity === filters.severity);
    }

    if (filters?.limit) {
      logs = logs.slice(-filters.limit);
    }

    return logs;
  }

  /**
   * Clear error logs
   */
  public clearLogs(): void {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   */
  public getStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byCode: Record<string, number>;
  } {
    const stats = {
      total: this.errorLog.length,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      byCode: {} as Record<string, number>,
    };

    for (const error of this.errorLog) {
      stats.bySeverity[error.severity]++;
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
    }

    return stats;
  }
}

// ============================================================================
// COMMON ERROR FACTORIES
// ============================================================================

export class FinancialErrorFactory {
  static validationFailed(field: string, reason: string): FinancialException {
    return new FinancialException(FinancialErrorCode.VALIDATION_FAILED, `Validation failed for field: ${field}`, {
      details: { field, reason },
      severity: 'low',
      suggestion: `Please check the ${field} field and correct any issues.`,
    });
  }

  static invalidAmount(amount: number): FinancialException {
    return new FinancialException(FinancialErrorCode.INVALID_AMOUNT, `Invalid amount: ${amount}`, {
      details: { amount },
      severity: 'low',
      suggestion: 'Amount must be a positive number.',
    });
  }

  static insufficientBalance(balance: number, required: number): FinancialException {
    return new FinancialException(
      FinancialErrorCode.INSUFFICIENT_BALANCE,
      `Insufficient balance. Available: ${balance}, Required: ${required}`,
      {
        details: { balance, required, shortfall: required - balance },
        severity: 'high',
        recoverable: true,
        suggestion: 'Add funds to your account before proceeding.',
      }
    );
  }

  static notFound(entity: string, id: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.NOT_FOUND,
      `${entity} with ID "${id}" not found`,
      {
        details: { entity, id },
        severity: 'medium',
        recoverable: true,
      }
    );
  }

  static duplicateEntry(entity: string, key: string, value: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.DUPLICATE_ENTRY,
      `Duplicate ${entity}: ${key}="${value}" already exists`,
      {
        details: { entity, key, value },
        severity: 'medium',
        recoverable: true,
        suggestion: 'Use a different value or update the existing entry.',
      }
    );
  }

  static operationFailed(operation: string, reason: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.OPERATION_FAILED,
      `${operation} failed: ${reason}`,
      {
        details: { operation, reason },
        severity: 'high',
      }
    );
  }

  static concurrentModification(entity: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.CONCURRENT_MODIFICATION,
      `${entity} was modified by another user. Please refresh and try again.`,
      {
        details: { entity },
        severity: 'medium',
        recoverable: true,
        suggestion: 'Refresh the page and retry your changes.',
      }
    );
  }

  static transactionFailed(transactionId: string, reason: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.TRANSACTION_FAILED,
      `Transaction ${transactionId} failed: ${reason}`,
      {
        details: { transactionId, reason },
        severity: 'critical',
      }
    );
  }

  static externalServiceError(service: string, statusCode?: number): FinancialException {
    return new FinancialException(
      FinancialErrorCode.EXTERNAL_SERVICE_ERROR,
      `External service error: ${service}`,
      {
        details: { service, statusCode },
        severity: 'high',
        recoverable: true,
        suggestion: 'Please try again later or contact support.',
      }
    );
  }

  static databaseError(reason: string): FinancialException {
    return new FinancialException(
      FinancialErrorCode.DATABASE_ERROR,
      `Database error: ${reason}`,
      {
        details: { reason },
        severity: 'critical',
      }
    );
  }
}

// ============================================================================
// GLOBAL ERROR HANDLER INSTANCE
// ============================================================================

export const financialErrorHandler = new ErrorHandlingService();

export default FinancialException;
