import { NextResponse } from 'next/server';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

// Error response utilities
export function createErrorResponse(error: Error | AppError, includeStack: boolean = false) {
  const isAppError = error instanceof AppError;

  const response = {
    success: false,
    error: error.message,
    ...(includeStack && process.env.NODE_ENV === 'development' && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  };

  const statusCode = isAppError ? (error as AppError).statusCode : 500;

  return NextResponse.json(response, { status: statusCode });
}

export function createSuccessResponse(data: any, statusCode: number = 200) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }, { status: statusCode });
}

// Async error wrapper for API routes
export function asyncHandler(fn: Function) {
  return (request: Request, context: any) => {
    return Promise.resolve(fn(request, context)).catch((error: Error) => {
      console.error('API Error:', error);

      // Log operational errors differently from programming errors
      if (error instanceof AppError && error.isOperational) {
        console.warn('Operational error:', error.message);
      } else {
        console.error('Programming error:', error);
      }

      return createErrorResponse(error);
    });
  };
}

// Client-side error handling
export function handleClientError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return 'An unexpected error occurred. Please try again.';
}

// Network error detection
export function isNetworkError(error: any): boolean {
  return !error?.response && (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network'));
}

export function isTimeoutError(error: any): boolean {
  return error?.code === 'TIMEOUT' || error?.message?.includes('timeout');
}

// Retry logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry on certain errors
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError!;
}

// Input validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function validateStringLength(value: string, fieldName: string, min: number = 0, max: number = Infinity): void {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  if (value.length < min) {
    throw new ValidationError(`${fieldName} must be at least ${min} characters long`);
  }

  if (value.length > max) {
    throw new ValidationError(`${fieldName} must be no more than ${max} characters long`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validateWalletAddress(address: string): void {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) {
    throw new ValidationError('Invalid wallet address format');
  }
}

// Logging utilities
export function logError(error: Error | AppError, context?: any): void {
  const logData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  };

  if (error instanceof AppError && error.isOperational) {
    console.warn('Operational Error:', logData);
  } else {
    console.error('System Error:', logData);
  }
}

export function logApiRequest(method: string, url: string, userId?: string): void {
  console.log(`API ${method} ${url} ${userId ? `User: ${userId}` : ''}`);
}

export function logApiResponse(statusCode: number, duration: number, error?: string): void {
  const level = statusCode >= 400 ? 'warn' : 'info';
  const message = `Response: ${statusCode} (${duration}ms)`;

  if (level === 'warn' && error) {
    console.warn(message, { error });
  } else {
    console.log(message);
  }
}

