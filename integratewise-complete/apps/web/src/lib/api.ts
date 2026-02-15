import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, AuthenticationError, AuthorizationError } from './auth';

// Request ID for tracing
export function getRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id') || uuidv4();
}

// Structured logger
export function logger(requestId: string) {
  return {
    info: (message: string, data?: Record<string, unknown>) => {
      console.info(
        JSON.stringify({
          level: 'info',
          requestId,
          message,
          ...data,
          timestamp: new Date().toISOString(),
        }),
      );
    },
    warn: (message: string, data?: Record<string, unknown>) => {
      console.warn(
        JSON.stringify({
          level: 'warn',
          requestId,
          message,
          ...data,
          timestamp: new Date().toISOString(),
        }),
      );
    },
    error: (message: string, data?: Record<string, unknown>) => {
      console.error(
        JSON.stringify({
          level: 'error',
          requestId,
          message,
          ...data,
          timestamp: new Date().toISOString(),
        }),
      );
    },
  };
}

// API response helpers
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  message: string,
  code: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status },
  );
}

// Validate request body with Zod
export async function validateBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}

// Validate query params with Zod
export function validateQuery<T>(request: NextRequest, schema: ZodSchema<T>): T {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

// API route handler wrapper with error handling
type ApiHandler = (
  request: NextRequest,
  context: { params: Record<string, string> },
) => Promise<NextResponse>;

export function withApiHandler(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    const requestId = getRequestId(request);
    const log = logger(requestId);
    const start = Date.now();

    try {
      log.info('API request started', {
        method: request.method,
        url: request.url,
      });

      const response = await handler(request, context);

      log.info('API request completed', {
        method: request.method,
        url: request.url,
        status: response.status,
        durationMs: Date.now() - start,
      });

      // Add request ID to response headers
      response.headers.set('x-request-id', requestId);
      return response;
    } catch (error) {
      const durationMs = Date.now() - start;

      if (error instanceof ZodError) {
        log.warn('Validation error', { errors: error.errors, durationMs });
        return apiError('Validation failed', 'VALIDATION_ERROR', 400, error.errors);
      }

      if (error instanceof AuthenticationError) {
        log.warn('Authentication error', { message: error.message, durationMs });
        return apiError(error.message, 'AUTHENTICATION_ERROR', 401);
      }

      if (error instanceof AuthorizationError) {
        log.warn('Authorization error', { message: error.message, durationMs });
        return apiError(error.message, 'AUTHORIZATION_ERROR', 403);
      }

      log.error('Unhandled error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        durationMs,
      });

      return apiError('Internal server error', 'INTERNAL_ERROR', 500);
    }
  };
}

// Wrapper that requires authentication
export function withAuth(handler: ApiHandler): ApiHandler {
  return withApiHandler(async (request, context) => {
    await requireAuth();
    return handler(request, context);
  });
}

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URIs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Rate limiting key generator
export function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  return `ratelimit:${ip}`;
}
