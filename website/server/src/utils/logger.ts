import { LoggingWinston } from '@google-cloud/logging-winston';
import winston from 'winston';
import { formatMemoryUsage, getMemoryUsage } from './memory.js';

// Configure transports based on environment
function createLogger() {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ];

  // Add Cloud Logging transport only in production
  if (process.env.NODE_ENV === 'production') {
    const loggingWinston = new LoggingWinston();
    transports.push(loggingWinston);
  }

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports,
  });
}

// Create and export the logger instance
export const logger = createLogger();

// Utility logging functions
export function logDebug(message: string, context?: Record<string, unknown>): void {
  logger.debug({
    message,
    ...context,
  });
}

export function logInfo(message: string, context?: Record<string, unknown>): void {
  logger.info({
    message,
    ...context,
  });
}

export function logWarning(message: string, context?: Record<string, unknown>): void {
  logger.warn({
    message,
    ...context,
  });
}

export function logError(message: string, error?: Error, context?: Record<string, unknown>): void {
  logger.error({
    message,
    error: error
      ? {
          message: error.message,
          stack: error.stack,
        }
      : undefined,
    ...context,
  });
}

/**
 * Log current memory usage with optional context
 */
export function logMemoryUsage(message: string, context?: Record<string, unknown>): void {
  const memoryUsage = getMemoryUsage();

  logger.info({
    message: `${message} - Memory: ${formatMemoryUsage(memoryUsage)}`,
    memory: memoryUsage,
    ...context,
  });
}
