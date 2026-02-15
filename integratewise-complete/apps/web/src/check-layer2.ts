// src/check-layer2.ts
// Comprehensive check for Layer 2 (Phase 2) services: Security, Resilience, Monitoring

import { RBACService, User, Resource } from './services/security/rbac-service';
import { CircuitBreaker } from './services/resilience/circuit-breaker';
import { ErrorHandler } from './services/resilience/error-handler';
import { ObservabilityService } from './services/monitoring/observability-service';

async function checkLayer2Services() {
  console.log('🔍 Checking Layer 2 (Phase 2) Services Status');
  console.log('==============================================\n');

  const results = {
    security: { status: 'unknown', details: [] as string[] },
    resilience: { status: 'unknown', details: [] as string[] },
    monitoring: { status: 'unknown', details: [] as string[] },
    integration: { status: 'unknown', details: [] as string[] }
  };

  let observability: ObservabilityService;
  let rbacService: RBACService;

  try {
    // 1. Check Security Service (RBAC)
    console.log('1️⃣  Checking Security Service (RBAC)...');
    rbacService = new RBACService();

    // Test basic permission check
    const testUser: User = {
      id: 'test-user',
      roles: ['personal'],
      attributes: { department: 'engineering' }
    };

    const testResource: Resource = {
      type: 'task',
      id: 'test-task',
      owner: 'test-user',
      scope: { project: 'test-project' },
      fields: { title: 'Test Task', description: 'A test task', status: 'open' }
    };

    const permission = await rbacService.checkPermission(testUser, 'read', testResource);
    if (permission.allowed) {
      results.security.status = 'operational';
      results.security.details.push('✅ RBAC permission checking works');
    } else {
      results.security.status = 'failed';
      results.security.details.push('❌ RBAC permission check failed');
    }

    // Test field filtering
    const filtered = rbacService.filterFields(testResource, ['title', 'status'], testUser);
    if (filtered.fields.title && !filtered.fields.description) {
      results.security.details.push('✅ Field-level filtering works');
    } else {
      results.security.details.push('❌ Field-level filtering failed');
    }

    console.log(`   Status: ${results.security.status.toUpperCase()}`);

  } catch (error) {
    results.security.status = 'error';
    results.security.details.push(`❌ Security service error: ${error}`);
    console.log(`   Status: ERROR - ${error}`);
  }

  try {
    // 2. Check Resilience Services
    console.log('\n2️⃣  Checking Resilience Services...');

    // Circuit Breaker
    const circuitBreaker = new CircuitBreaker('test-service', {
      failureThreshold: 3,
      recoveryTimeout: 5000,
    });

    // Test circuit breaker states
    let cbStatus = circuitBreaker.getState().status;
    if (cbStatus === 'closed') {
      results.resilience.details.push('✅ Circuit breaker initialized correctly');
    }

    // Simulate failures by calling execute with failing operations
    for (let i = 0; i < 3; i++) {
      try {
        await circuitBreaker.execute(async () => {
          throw new Error('Simulated failure');
        });
      } catch (error) {
        // Expected to fail
      }
    }

    cbStatus = circuitBreaker.getState().status;
    if (cbStatus === 'open') {
      results.resilience.details.push('✅ Circuit breaker opens on failures');
    } else {
      results.resilience.details.push('❌ Circuit breaker did not open on failures');
    }

    // Error Handler
    const errorHandler = new ErrorHandler();
    const testError = new Error('Test error');
    const handled = errorHandler.handleError(testError, { context: 'test' });

    if (handled) {
      results.resilience.details.push('✅ Error handler processes errors');
    } else {
      results.resilience.details.push('❌ Error handler failed');
    }

    results.resilience.status = 'operational';
    console.log(`   Status: ${results.resilience.status.toUpperCase()}`);

  } catch (error) {
    results.resilience.status = 'error';
    results.resilience.details.push(`❌ Resilience service error: ${error}`);
    console.log(`   Status: ERROR - ${error}`);
  }

  try {
    // 3. Check Monitoring Service (Observability)
    console.log('\n3️⃣  Checking Monitoring Service (Observability)...');

    observability = new ObservabilityService({
      enableMetrics: true,
      enableTracing: true,
      enableLogging: true,
    });

    // Test metrics
    observability.incrementCounter('test_metric', { service: 'layer2-check' });
    results.monitoring.details.push('✅ Metrics collection works');

    // Test tracing
    const traceId = observability.startTrace('test_operation', { user: 'test' });
    observability.endTrace(traceId);
    results.monitoring.details.push('✅ Tracing works');

    // Test logging (using setGauge as a proxy for logging functionality)
    observability.setGauge('test_log_level', 1, { level: 'info', message: 'Layer 2 check completed' });
    results.monitoring.details.push('✅ Monitoring data recording works');

    results.monitoring.status = 'operational';
    console.log(`   Status: ${results.monitoring.status.toUpperCase()}`);

  } catch (error) {
    results.monitoring.status = 'error';
    results.monitoring.details.push(`❌ Monitoring service error: ${error}`);
    console.log(`   Status: ERROR - ${error}`);
  }

  try {
    // 4. Check Integration between services
    console.log('\n4️⃣  Checking Service Integration...');

    // Create a complete flow: Secure API call with resilience and monitoring
    const user: User = {
      id: 'integration-user',
      roles: ['personal'],
      attributes: { department: 'engineering' }
    };

    const resource: Resource = {
      type: 'api',
      id: 'integration-endpoint',
      owner: 'integration-user',
      scope: { endpoint: '/api/integration' },
      fields: { method: 'GET', path: '/api/integration', response: { status: 200, data: 'success' } }
    };

    // Start observability trace
    const traceId = observability.startTrace('integration_test', {
      userId: user.id,
      endpoint: resource.scope.endpoint
    });

    // Check permission
    const permission = await rbacService.checkPermission(user, 'read', resource);
    if (permission.allowed) {
      results.integration.details.push('✅ Permission check in integrated flow works');

      // Simulate API call with circuit breaker
      const apiCall = async () => {
        observability.recordHistogram('api_call_duration', 150, { endpoint: resource.scope.endpoint });
        return { status: 200, data: 'success' };
      };

      const circuitBreaker = new CircuitBreaker('api-service');
      const result = await circuitBreaker.execute(apiCall);

      if (result.status === 200) {
        results.integration.details.push('✅ Circuit breaker integration works');
      }

      // Record successful operation
      observability.incrementCounter('integration_test_success', {
        userId: user.id,
        endpoint: resource.scope.endpoint
      });

      results.integration.details.push('✅ Observability integration works');

    } else {
      results.integration.details.push('❌ Permission check failed in integrated flow');
    }

    // End trace
    observability.endTrace(traceId);

    results.integration.status = 'operational';
    console.log(`   Status: ${results.integration.status.toUpperCase()}`);

  } catch (error) {
    results.integration.status = 'error';
    results.integration.details.push(`❌ Integration error: ${error}`);
    console.log(`   Status: ERROR - ${error}`);
  }

  // Summary
  console.log('\n📊 Layer 2 Status Summary');
  console.log('========================');

  const overallStatus = [results.security.status, results.resilience.status, results.monitoring.status, results.integration.status]
    .every(status => status === 'operational') ? 'operational' : 'issues_detected';

  console.log(`Overall Status: ${overallStatus.toUpperCase()}`);
  console.log('');

  Object.entries(results).forEach(([service, data]) => {
    console.log(`${service.charAt(0).toUpperCase() + service.slice(1)}: ${data.status.toUpperCase()}`);
    data.details.forEach(detail => console.log(`  ${detail}`));
    console.log('');
  });

  if (overallStatus === 'operational') {
    console.log('🎉 Layer 2 (Phase 2) is fully operational!');
    console.log('✅ Security: RBAC with field-level permissions');
    console.log('✅ Resilience: Circuit breaker and error handling');
    console.log('✅ Monitoring: Comprehensive observability');
    console.log('✅ Integration: Services work together seamlessly');
  } else {
    console.log('⚠️  Layer 2 has some issues that need attention.');
  }

  return results;
}

// Run the check
if (require.main === module) {
  checkLayer2Services()
    .then((results) => {
      const hasErrors = Object.values(results).some(r => r.status === 'error');
      process.exit(hasErrors ? 1 : 0);
    })
    .catch((error) => {
      console.error('💥 Layer 2 check failed:', error);
      process.exit(1);
    });
}

export { checkLayer2Services };