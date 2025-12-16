/**
 * Structured Logging Service
 *
 * A lightweight logging utility that provides structured logging
 * with log levels, context, and optional JSON output.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('Failed to fetch data', { error: err.message, endpoint: '/api/users' });
 *   logger.warn('Rate limit approaching', { remaining: 5 });
 *   logger.debug('Query executed', { sql: query, duration: 42 });
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Environment-based log level (default: info in production, debug in development)
const getMinLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
};

// Whether to output JSON (useful for log aggregation in production)
const useJsonOutput = (): boolean => {
  return process.env.LOG_FORMAT === "json" || process.env.NODE_ENV === "production";
};

const formatLogEntry = (entry: LogEntry): string => {
  if (useJsonOutput()) {
    return JSON.stringify(entry);
  }

  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[36m", // cyan
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
  };
  const reset = "\x1b[0m";
  const color = levelColors[entry.level];
  const levelStr = entry.level.toUpperCase().padEnd(5);

  let output = `${color}[${entry.timestamp}] ${levelStr}${reset} ${entry.message}`;

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += ` ${JSON.stringify(entry.context)}`;
  }

  return output;
};

const createLogEntry = (level: LogLevel, message: string, context?: LogContext): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
};

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLogLevel()];
};

const log = (level: LogLevel, message: string, context?: LogContext): void => {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context);
  const formatted = formatLogEntry(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "debug":
      console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
};

/**
 * Main logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug-level logging - verbose information for development
   */
  debug: (message: string, context?: LogContext): void => {
    log("debug", message, context);
  },

  /**
   * Info-level logging - general operational messages
   */
  info: (message: string, context?: LogContext): void => {
    log("info", message, context);
  },

  /**
   * Warn-level logging - potential issues that don't block operation
   */
  warn: (message: string, context?: LogContext): void => {
    log("warn", message, context);
  },

  /**
   * Error-level logging - errors that need attention
   */
  error: (message: string, context?: LogContext): void => {
    log("error", message, context);
  },

  /**
   * Create a child logger with preset context
   */
  child: (defaultContext: LogContext) => {
    return {
      debug: (message: string, context?: LogContext): void => {
        log("debug", message, { ...defaultContext, ...context });
      },
      info: (message: string, context?: LogContext): void => {
        log("info", message, { ...defaultContext, ...context });
      },
      warn: (message: string, context?: LogContext): void => {
        log("warn", message, { ...defaultContext, ...context });
      },
      error: (message: string, context?: LogContext): void => {
        log("error", message, { ...defaultContext, ...context });
      },
    };
  },
};

export default logger;
