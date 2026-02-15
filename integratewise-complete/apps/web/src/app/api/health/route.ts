/**
 * Health API - Aggregates health from L3 Worker services
 */
import { NextRequest, NextResponse } from 'next/server';

interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: Record<string, ServiceHealth>;
  uptime: number;
  version: string;
}

const START_TIME = Date.now();

// Service URLs (stage-aware)
function getServiceUrls(): Record<string, string> {
  const stage = process.env.DEPLOY_STAGE || 'production';
  const domain = process.env.SERVICE_DOMAIN || 'integratewise.ai';

  const buildUrl = (service: string) => {
    if (stage === 'development') return `http://localhost:${getDevPort(service)}`;
    if (stage === 'staging') return `https://${service}-staging.${domain}`;
    return `https://${service}.${domain}`;
  };

  return {
    spine: process.env.SPINE_SERVICE_URL || buildUrl('spine'),
    views: process.env.VIEWS_SERVICE_URL || buildUrl('views'),
    knowledge: process.env.KNOWLEDGE_SERVICE_URL || buildUrl('knowledge'),
    'iq-hub': process.env.IQ_HUB_SERVICE_URL || buildUrl('iq-hub'),
  };
}

function getDevPort(service: string): number {
  const ports: Record<string, number> = {
    spine: 8003,
    views: 8007,
    knowledge: 8006,
    'iq-hub': 8008,
  };
  return ports[service] || 8000;
}

async function checkService(name: string, url: string): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const response = await fetch(`${url}/health`, {
      signal: AbortSignal.timeout(5000),
    });

    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      latency: Date.now() - start,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<HealthCheckResult>> {
  const serviceUrls = getServiceUrls();

  // Check all services in parallel
  const serviceNames = Object.keys(serviceUrls);
  const healthChecks = await Promise.all(
    serviceNames.map((name) => checkService(name, serviceUrls[name]))
  );

  const services: Record<string, ServiceHealth> = {};
  serviceNames.forEach((name, index) => {
    services[name] = healthChecks[index];
  });

  // Determine overall status
  const hasUnhealthy = Object.values(services).some((s) => s.status === 'unhealthy');
  const allHealthy = Object.values(services).every((s) => s.status === 'healthy');

  let overallStatus: HealthCheckResult['status'] = 'healthy';
  if (hasUnhealthy && !allHealthy) {
    overallStatus = 'degraded';
  } else if (hasUnhealthy) {
    overallStatus = 'unhealthy';
  }

  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services,
    uptime: Date.now() - START_TIME,
    version: process.env.npm_package_version || '1.0.0',
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(result, { status: httpStatus });
}
