// src/utils/tracing.ts
// Cloudflare Workers Tracing Utility
// Adapted for Cloudflare's environment

interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  service: string;
  operation: string;
  startTime: number;
  attributes: Record<string, any>;
}

class Tracer {
  private traces: TraceContext[] = [];

  startSpan(operation: string, service: string, attributes: Record<string, any> = {}): string {
    const spanId = generateId();
    const traceId = attributes.traceId || generateId();

    const context: TraceContext = {
      traceId,
      spanId,
      service,
      operation,
      startTime: Date.now(),
      attributes
    };

    this.traces.push(context);
    return spanId;
  }

  endSpan(spanId: string, attributes: Record<string, any> = {}) {
    const span = this.traces.find(t => t.spanId === spanId);
    if (span) {
      span.attributes = { ...span.attributes, ...attributes };
      const duration = Date.now() - span.startTime;

      // Log to console (in production, send to collector)
      console.log(JSON.stringify({
        level: 'info',
        service: span.service,
        operation: span.operation,
        traceId: span.traceId,
        spanId: span.spanId,
        duration,
        attributes: span.attributes,
        timestamp: new Date().toISOString()
      }));

      // Send to Analytics Engine
      this.sendToAnalytics(span, duration);
    }
  }

  async sendToAnalytics(span: TraceContext, duration: number) {
    // In a real implementation, get env from context
    // For now, assume global env
    if (typeof globalThis !== 'undefined' && (globalThis as any).env) {
      const env = (globalThis as any).env;
      await fetch(`https://analytics.cloudflare.com/write`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.ANALYTICS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: 'trace_span',
          traceId: span.traceId,
          spanId: span.spanId,
          service: span.service,
          operation: span.operation,
          duration,
          attributes: span.attributes,
          timestamp: Date.now()
        })
      });
    }
  }

  setAttribute(spanId: string, key: string, value: any) {
    const span = this.traces.find(t => t.spanId === spanId);
    if (span) {
      span.attributes[key] = value;
    }
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const tracer = new Tracer();

// Middleware for tracing requests
export function withTracing(handler: (request: Request, env: any) => Promise<Response>) {
  return async (request: Request, env: any): Promise<Response> => {
    const traceId = request.headers.get('x-trace-id') || generateId();
    const spanId = tracer.startSpan('http_request', 'worker', {
      traceId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent')
    });

    try {
      const response = await handler(request, env);
      tracer.setAttribute(spanId, 'status', response.status);
      return response;
    } catch (error) {
      tracer.setAttribute(spanId, 'error', error.message);
      throw error;
    } finally {
      tracer.endSpan(spanId);
    }
  };
}