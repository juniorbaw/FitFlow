/**
 * 🚨 CENTRALIZED ERROR HANDLING
 * 
 * Gestion cohérente des erreurs dans toute l'application
 */

import { NextResponse } from 'next/server';

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // External APIs
  INSTAGRAM_API_ERROR = 'INSTAGRAM_API_ERROR',
  STRIPE_API_ERROR = 'STRIPE_API_ERROR',
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Generic
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * Custom Error Class
 */
export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: any;

  constructor(code: ErrorCode, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }
}

/**
 * Error Response Builders
 */
export function errorResponse(error: AppError | Error): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    );
  }

  // Generic error
  console.error('Unexpected error:', error);
  
  return NextResponse.json(
    {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    },
    { status: 500 }
  );
}

/**
 * Pre-built error responses
 */
export const Errors = {
  unauthorized: (message = 'Authentication required') =>
    new AppError(ErrorCode.UNAUTHORIZED, message, 401),

  forbidden: (message = 'Access forbidden') =>
    new AppError(ErrorCode.FORBIDDEN, message, 403),

  notFound: (resource = 'Resource') =>
    new AppError(ErrorCode.NOT_FOUND, `${resource} not found`, 404),

  validation: (errors: string[]) =>
    new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', 400, { errors }),

  rateLimit: (limit: number, window: string) =>
    new AppError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded. Max ${limit} requests per ${window}`,
      429
    ),

  badRequest: (message: string) =>
    new AppError(ErrorCode.BAD_REQUEST, message, 400),

  instagramApi: (message: string, details?: any) =>
    new AppError(ErrorCode.INSTAGRAM_API_ERROR, message, 502, details),

  stripeApi: (message: string, details?: any) =>
    new AppError(ErrorCode.STRIPE_API_ERROR, message, 502, details),

  geminiApi: (message: string, details?: any) =>
    new AppError(ErrorCode.GEMINI_API_ERROR, message, 502, details),

  database: (message: string, details?: any) =>
    new AppError(ErrorCode.DATABASE_ERROR, message, 500, details),

  internal: (message = 'Internal server error') =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, 500),
};

/**
 * Logger (structured logging)
 */
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(data && { data })
    };

    if (level === 'error') {
      console.error(JSON.stringify(logData));
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | any) {
    this.log('error', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }
}

/**
 * Create logger for a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
