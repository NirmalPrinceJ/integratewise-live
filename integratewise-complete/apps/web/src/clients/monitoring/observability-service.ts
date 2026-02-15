// src/services/monitoring/observability-service.ts
// Comprehensive Monitoring and Observability Service

interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastChecked: number;
  details?: Record<string, any>;
}

interface AlertRule {
  name: string;
  condition: (metrics: Metric[]) => boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  cooldownMs: number;
  lastTriggered?: number;
}

interface PerformanceTrace {
  id: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'running' | 'completed' | 'failed';
  metadata: Record<string, any>;
  spans: TraceSpan[];
}

interface TraceSpan {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string>;
  logs: TraceLog[];
}

interface TraceLog {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, any>;
}

export class ObservabilityService {
  private metrics: Metric[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alertRules: AlertRule[] = [];
  private activeTraces: Map<string, PerformanceTrace> = new Map();
  private traceBuffer: PerformanceTrace[] = [];
  private maxMetricsBuffer = 10000;
  private maxTraceBuffer = 1000;

  constructor() {
    this.initializeAlertRules();
    this.startHealthCheckScheduler();
  }

  private initializeAlertRules() {
    // High error rate alert
    this.alertRules.push({
      name: 'high_error_rate',
      condition: (metrics) => {
        const errorMetrics = metrics.filter(m => m.name.includes('error') && m.timestamp > Date.now() - 300000); // Last 5 minutes
        const totalRequests = metrics.filter(m => m.name.includes('request_total') && m.timestamp > Date.now() - 300000);
        if (totalRequests.length === 0) return false;
        const errorRate = errorMetrics.reduce((sum, m) => sum + m.value, 0) / totalRequests.reduce((sum, m) => sum + m.value, 0);
        return errorRate > 0.1; // 10% error rate
      },
      severity: 'error',
      message: 'Error rate exceeds 10% in the last 5 minutes',
      cooldownMs: 300000 // 5 minutes
    });

    // High latency alert
    this.alertRules.push({
      name: 'high_latency',
      condition: (metrics) => {
        const latencyMetrics = metrics.filter(m => m.name.includes('latency') && m.timestamp > Date.now() - 300000);
        const avgLatency = latencyMetrics.reduce((sum, m) => sum + m.value, 0) / latencyMetrics.length;
        return avgLatency > 5000; // 5 seconds average
      },
      severity: 'warning',
      message: 'Average response latency exceeds 5 seconds',
      cooldownMs: 600000 // 10 minutes
    });

    // Service down alert
    this.alertRules.push({
      name: 'service_down',
      condition: (metrics) => {
        const healthMetrics = metrics.filter(m => m.name === 'service_health' && m.timestamp > Date.now() - 60000); // Last minute
        return healthMetrics.some(m => m.value === 0); // 0 = unhealthy
      },
      severity: 'critical',
      message: 'Critical service is down',
      cooldownMs: 60000 // 1 minute
    });
  }

  private startHealthCheckScheduler() {
    // Run health checks every 30 seconds
    setInterval(() => {
      this.performHealthChecks();
    }, 30000);
  }

  private async performHealthChecks() {
    const services = ['database', 'cache', 'external_api', 'ai_service', 'workflow_engine'];

    for (const service of services) {
      try {
        const startTime = Date.now();
        const isHealthy = await this.checkServiceHealth(service);
        const responseTime = Date.now() - startTime;

        const status: HealthCheck['status'] = isHealthy ? 'healthy' : 'unhealthy';

        this.healthChecks.set(service, {
          service,
          status,
          responseTime,
          lastChecked: Date.now()
        });

        // Record health metric
        this.recordMetric({
          name: 'service_health',
          value: isHealthy ? 1 : 0,
          timestamp: Date.now(),
          tags: { service },
          type: 'gauge'
        });

        this.recordMetric({
          name: 'service_response_time',
          value: responseTime,
          timestamp: Date.now(),
          tags: { service },
          type: 'histogram'
        });

      } catch (error) {
        console.error(`Health check failed for ${service}:`, error);
        this.healthChecks.set(service, {
          service,
          status: 'unhealthy',
          responseTime: 0,
          lastChecked: Date.now(),
          details: { error: error.message }
        });
      }
    }
  }

  private async checkServiceHealth(service: string): Promise<boolean> {
    // In practice, this would perform actual health checks
    switch (service) {
      case 'database':
        // Check database connection
        return Math.random() > 0.05; // 95% uptime simulation
      case 'cache':
        // Check cache connectivity
        return Math.random() > 0.02; // 98% uptime simulation
      case 'external_api':
        // Check external API availability
        return Math.random() > 0.1; // 90% uptime simulation
      case 'ai_service':
        // Check AI service health
        return Math.random() > 0.03; // 97% uptime simulation
      case 'workflow_engine':
        // Check workflow engine status
        return Math.random() > 0.05; // 95% uptime simulation
      default:
        return true;
    }
  }

  // Metric recording methods
  recordMetric(metric: Metric) {
    this.metrics.push(metric);

    // Maintain buffer size
    if (this.metrics.length > this.maxMetricsBuffer) {
      this.metrics = this.metrics.slice(-this.maxMetricsBuffer);
    }

    // Check alert rules
    this.checkAlerts();
  }

  incrementCounter(name: string, tags: Record<string, string> = {}, value: number = 1) {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'counter'
    });
  }

  setGauge(name: string, value: number, tags: Record<string, string> = {}) {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'gauge'
    });
  }

  recordHistogram(name: string, value: number, tags: Record<string, string> = {}) {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'histogram'
    });
  }

  // Tracing methods
  startTrace(operation: string, metadata: Record<string, any> = {}): string {
    const traceId = this.generateId();
    const trace: PerformanceTrace = {
      id: traceId,
      operation,
      startTime: Date.now(),
      status: 'running',
      metadata,
      spans: []
    };

    this.activeTraces.set(traceId, trace);
    return traceId;
  }

  endTrace(traceId: string, status: 'completed' | 'failed' = 'completed') {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.status = status;

    // Move to buffer
    this.traceBuffer.push(trace);
    this.activeTraces.delete(traceId);

    // Maintain buffer size
    if (this.traceBuffer.length > this.maxTraceBuffer) {
      this.traceBuffer = this.traceBuffer.slice(-this.maxTraceBuffer);
    }

    // Record performance metrics
    this.recordMetric({
      name: 'operation_duration',
      value: trace.duration,
      timestamp: Date.now(),
      tags: { operation: trace.operation, status },
      type: 'histogram'
    });
  }

  startSpan(traceId: string, name: string, tags: Record<string, string> = {}): string {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return '';

    const spanId = this.generateId();
    const span: TraceSpan = {
      id: spanId,
      name,
      startTime: Date.now(),
      tags,
      logs: []
    };

    trace.spans.push(span);
    return spanId;
  }

  endSpan(traceId: string, spanId: string) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    const span = trace.spans.find(s => s.id === spanId);
    if (!span) return;

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
  }

  logToSpan(traceId: string, spanId: string, level: TraceLog['level'], message: string, fields: Record<string, any> = {}) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    const span = trace.spans.find(s => s.id === spanId);
    if (!span) return;

    span.logs.push({
      timestamp: Date.now(),
      level,
      message,
      fields
    });
  }

  private checkAlerts() {
    for (const rule of this.alertRules) {
      if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldownMs) {
        continue; // Still in cooldown
      }

      if (rule.condition(this.metrics)) {
        this.triggerAlert(rule);
        rule.lastTriggered = Date.now();
      }
    }
  }

  private triggerAlert(rule: AlertRule) {
    const alert = {
      rule: rule.name,
      severity: rule.severity,
      message: rule.message,
      timestamp: new Date().toISOString(),
      metrics: this.getRecentMetrics(5) // Last 5 minutes
    };

    console.error('ALERT:', JSON.stringify(alert));

    // In production, send to alerting system
  }

  private getRecentMetrics(minutes: number): Metric[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public query methods
  getMetrics(name?: string, tags?: Record<string, string>, since?: number): Metric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (tags) {
      filtered = filtered.filter(m => {
        return Object.entries(tags).every(([key, value]) => m.tags[key] === value);
      });
    }

    if (since) {
      filtered = filtered.filter(m => m.timestamp > since);
    }

    return filtered;
  }

  getHealthStatus(): Record<string, HealthCheck> {
    return Object.fromEntries(this.healthChecks);
  }

  getActiveTraces(): PerformanceTrace[] {
    return Array.from(this.activeTraces.values());
  }

  getTraceHistory(limit: number = 100): PerformanceTrace[] {
    return this.traceBuffer.slice(-limit);
  }

  getSystemOverview() {
    const recentMetrics = this.getRecentMetrics(5);
    const healthStatus = this.getHealthStatus();

    return {
      overallHealth: this.calculateOverallHealth(healthStatus),
      activeTraces: this.activeTraces.size,
      recentErrors: recentMetrics.filter(m => m.name.includes('error')).length,
      averageLatency: this.calculateAverageLatency(recentMetrics),
      healthChecks: healthStatus,
      timestamp: new Date().toISOString()
    };
  }

  private calculateOverallHealth(healthStatus: Record<string, HealthCheck>): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(healthStatus);
    const unhealthyCount = statuses.filter(h => h.status === 'unhealthy').length;
    const degradedCount = statuses.filter(h => h.status === 'degraded').length;

    if (unhealthyCount > 0) return 'unhealthy';
    if (degradedCount > 2) return 'degraded';
    return 'healthy';
  }

  private calculateAverageLatency(metrics: Metric[]): number {
    const latencyMetrics = metrics.filter(m => m.name.includes('latency') || m.name.includes('duration'));
    if (latencyMetrics.length === 0) return 0;

    return latencyMetrics.reduce((sum, m) => sum + m.value, 0) / latencyMetrics.length;
  }
}

// Export singleton
export const observabilityService = new ObservabilityService();