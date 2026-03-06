/**
 * Correlation ID Utility
 * 
 * Best Practice Guardrail #1: Every request gets a correlation_id that flows
 * through the entire system for end-to-end debugging.
 * 
 * Usage:
 * - Generate at Loader/Gateway ingress
 * - Persist in: events, signals, situations, actions, action_runs, audit_log
 * - Include in all logs
 */

// Header name for correlation ID (standard across services)
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Generate a UUID v4 (works in both Node.js and Edge/Workers environments)
 */
function generateUUID(): string {
  // Use Web Crypto API if available (works in Edge/Workers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a new correlation ID (UUID v4)
 */
export function generateCorrelationId(): string {
  return generateUUID();
}

/**
 * Extract correlation ID from headers, or generate a new one
 */
export function getOrCreateCorrelationId(headers: Record<string, string | undefined>): string {
  const existing = headers[CORRELATION_ID_HEADER] || 
                   headers['x-request-id'] || 
                   headers['X-Correlation-ID'];
  
  if (existing && isValidUUID(existing)) {
    return existing;
  }
  
  return generateCorrelationId();
}

/**
 * Check if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Context object that should be passed through all service calls
 */
export interface CorrelationContext {
  correlationId: string;
  tenantId: string;
  sourceSystem?: string;
  userId?: string;
  timestamp: string;
}

/**
 * Create a correlation context from request headers
 */
export function createCorrelationContext(
  headers: Record<string, string | undefined>,
  tenantId: string
): CorrelationContext {
  return {
    correlationId: getOrCreateCorrelationId(headers),
    tenantId,
    sourceSystem: headers['x-source-system'],
    userId: headers['x-user-id'],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Structured log helper with correlation context
 */
export function logWithCorrelation(
  ctx: CorrelationContext,
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  data?: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    correlation_id: ctx.correlationId,
    tenant_id: ctx.tenantId,
    source_system: ctx.sourceSystem,
    message,
    ...data,
  };

  switch (level) {
    case 'error':
      console.error(JSON.stringify(logEntry));
      break;
    case 'warn':
      console.warn(JSON.stringify(logEntry));
      break;
    case 'debug':
      console.debug(JSON.stringify(logEntry));
      break;
    default:
      console.log(JSON.stringify(logEntry));
  }
}
