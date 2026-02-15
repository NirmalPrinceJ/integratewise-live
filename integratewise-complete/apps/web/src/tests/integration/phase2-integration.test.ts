// src/tests/integration/phase2-integration.test.ts
// Integration tests for Phase 2 services (Security, Resilience, Monitoring)

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RBACService, User, Resource } from '../../services/security/rbac-service';
import { CircuitBreakerService } from '../../services/resilience/circuit-breaker';
import { ErrorHandler } from '../../services/resilience/error-handler';
import { ObservabilityService } from '../../services/monitoring/observability-service';

describe('Phase 2 Integration Tests', () => {
  let rbacService: RBACService;
  let circuitBreaker: CircuitBreakerService;
  let errorHandler: ErrorHandler;
  let observability: ObservabilityService;

  beforeEach(() => {
    rbacService = new RBACService();
    circuitBreaker = new CircuitBreakerService();
    errorHandler = new ErrorHandler();
    observability = new ObservabilityService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Secure API Call with Resilience and Monitoring', () => {
    it('should handle successful secure API call with monitoring', async () => {
      const user: User = {
        id: 'user123',
        roles: ['personal'],
        attributes: { department: 'engineering' }
      };

      const resource: Resource = {
        type: 'api',
        id: 'user_data',
        owner: 'user123',
        scope: { endpoint: '/api/users' },
        fields: { id: 123, name: 'John Doe', email: 'john@example.com', ssn: '123-45-6789' }
      };

      // Check permission
      const permissionResult = await rbacService.checkPermission(user, 'read', resource);
      expect(permissionResult.allowed).toBe(true);

      // Start observability trace
      const traceId = observability.startTrace('api_call', {
        userId: user.id,
        operation: 'get_user_data'
      });

      const spanId = observability.startSpan(traceId, 'permission_check');

      // Simulate API call with circuit breaker
      const mockApiCall = vi.fn().mockResolvedValue(resource.fields);

      observability.endSpan(traceId, spanId);

      const apiSpanId = observability.startSpan(traceId, 'api_call');
      const apiResult = await circuitBreaker.execute('user_api', mockApiCall);
      observability.endSpan(traceId, apiSpanId);

      // Filter sensitive fields based on permissions
      const filteredResource = rbacService.filterFields(resource, ['id', 'name', 'email'], user);

      // Record success metrics
      observability.incrementCounter('api_calls_total', {
        endpoint: '/api/users',
        status: 'success',
        user_role: user.roles[0]
      });

      observability.recordHistogram('api_response_time', 150, {
        endpoint: '/api/users'
      });

      observability.endTrace(traceId, 'completed');

      // Assertions
      expect(filteredResource.fields).toHaveProperty('id');
      expect(filteredResource.fields).toHaveProperty('name');
      expect(filteredResource.fields).toHaveProperty('email');
      expect(filteredResource.fields).not.toHaveProperty('ssn'); // Should be filtered out

      expect(observability.getTraceHistory()).toHaveLength(1);
      expect(observability.getMetrics('api_calls_total')).toHaveLength(1);
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should handle API failure with error recovery and monitoring', async () => {
      const user: User = {
        id: 'user123',
        roles: ['personal'],
        attributes: {}
      };

      const traceId = observability.startTrace('api_call', {
        userId: user.id,
        operation: 'get_user_data'
      });

      // Simulate failing API call
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Connection timeout'));

      try {
        await circuitBreaker.execute('user_api', mockApiCall);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        // Handle error with recovery
        const context = {
          userId: user.id,
          requestId: 'req123',
          service: 'user_api',
          operation: 'get_user_data',
          timestamp: Date.now()
        };

        const recoveryResult = await errorHandler.handleError(error as Error, context);

        // Record error metrics
        observability.incrementCounter('api_errors_total', {
          endpoint: '/api/users',
          error_type: 'transient',
          user_role: user.roles[0]
        });

        observability.endTrace(traceId, 'failed');

        // Assertions
        expect(recoveryResult).toEqual({ success: true, retried: true });
        expect(observability.getMetrics('api_errors_total')).toHaveLength(1);
        expect(observability.getTraceHistory()[0].status).toBe('failed');
      }
    });

    it('should handle circuit breaker opening with fallback', async () => {
      const user: User = {
        id: 'user123',
        roles: ['personal'],
        attributes: {}
      };

      // Fail the service multiple times to open circuit
      const failingApiCall = vi.fn().mockRejectedValue(new Error('Service unavailable'));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute('user_api', failingApiCall);
        } catch (error) {
          // Expected failures
        }
      }

      // Circuit should now be open
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Try with fallback
      const fallbackData = { id: 123, name: 'Fallback User', email: 'fallback@example.com' };
      const fallbackFn = vi.fn().mockResolvedValue(fallbackData);

      const traceId = observability.startTrace('api_call_fallback', {
        userId: user.id,
        operation: 'get_user_data'
      });

      const result = await circuitBreaker.execute('user_api', failingApiCall, fallbackFn);

      // Create resource for filtering
      const resultResource: Resource = {
        type: 'api',
        id: 'fallback_data',
        owner: user.id,
        scope: {},
        fields: result
      };

      const filteredResult = rbacService.filterFields(resultResource, ['id', 'name', 'email'], user);

      observability.incrementCounter('api_fallbacks_total', {
        endpoint: '/api/users',
        user_role: user.roles[0]
      });

      observability.endTrace(traceId, 'completed');

      // Assertions
      expect(fallbackFn).toHaveBeenCalled();
      expect(filteredResult.fields).toEqual(fallbackData);
      expect(observability.getMetrics('api_fallbacks_total')).toHaveLength(1);
    });

    it('should enforce admin permissions for sensitive operations', async () => {
      const user: User = {
        id: 'user123',
        roles: ['personal'],
        attributes: {}
      };

      const admin: User = {
        id: 'admin123',
        roles: ['executive'],
        attributes: {}
      };

      const sensitiveResource: Resource = {
        type: 'user',
        id: 'sensitive_data',
        owner: 'admin123',
        scope: {},
        fields: {
          id: 123,
          name: 'John Doe',
          email: 'john@example.com',
          ssn: '123-45-6789',
          salary: 100000
        }
      };

      // User should not have access to sensitive fields
      const userFiltered = rbacService.filterFields(sensitiveResource, ['id', 'name', 'email'], user);
      expect(userFiltered.fields).not.toHaveProperty('ssn');
      expect(userFiltered.fields).not.toHaveProperty('salary');

      // Admin should have access to all fields
      const adminFiltered = rbacService.filterFields(sensitiveResource, ['id', 'name', 'email', 'ssn', 'salary'], admin);
      expect(adminFiltered.fields).toHaveProperty('ssn');
      expect(adminFiltered.fields).toHaveProperty('salary');

      // User should not be able to write
      const writePermission = await rbacService.checkPermission(user, 'update', sensitiveResource);
      expect(writePermission.allowed).toBe(false);

      // Admin should be able to write
      const adminWritePermission = await rbacService.checkPermission(admin, 'update', sensitiveResource);
      expect(adminWritePermission.allowed).toBe(true);

      // Record permission check metrics
      observability.incrementCounter('permission_checks_total', {
        permission: 'update',
        user_role: user.roles[0],
        granted: 'false'
      });

      observability.incrementCounter('permission_checks_total', {
        permission: 'update',
        user_role: admin.roles[0],
        granted: 'true'
      });

      expect(observability.getMetrics('permission_checks_total')).toHaveLength(2);
    });

    it('should monitor system health during operations', async () => {
      // Perform several operations to generate metrics
      const user: User = {
        id: 'user123',
        roles: ['personal'],
        attributes: {}
      };

      for (let i = 0; i < 5; i++) {
        const traceId = observability.startTrace(`operation_${i}`, {
          userId: user.id,
          operation: 'test_operation'
        });

        observability.incrementCounter('operations_total', { type: 'test' });
        observability.recordHistogram('operation_duration', Math.random() * 1000);

        observability.endTrace(traceId, 'completed');
      }

      // Wait for health checks
      await vi.advanceTimersByTimeAsync(31000);

      const systemOverview = observability.getSystemOverview();
      const healthStatus = observability.getHealthStatus();

      // Assertions
      expect(systemOverview.overallHealth).toBeDefined();
      expect(systemOverview.activeTraces).toBe(0); // All traces completed
      expect(systemOverview.recentErrors).toBeGreaterThanOrEqual(0);
      expect(systemOverview.averageLatency).toBeDefined();
      expect(Object.keys(healthStatus)).toHaveLength(5); // 5 services checked

      // Check metrics
      const operationMetrics = observability.getMetrics('operations_total');
      expect(operationMetrics).toHaveLength(5);

      const traceHistory = observability.getTraceHistory();
      expect(traceHistory).toHaveLength(5);
    });

    it('should handle encrypted data operations', async () => {
      const admin: User = {
        id: 'admin123',
        roles: ['executive'],
        attributes: {}
      };

      const sensitiveData = {
        id: 123,
        name: 'John Doe',
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111'
      };

      // Encrypt sensitive fields
      const encryptedData = rbacService.encryptFields(sensitiveData, ['ssn', 'creditCard']);
      expect(encryptedData.ssn).not.toBe('123-45-6789');
      expect(encryptedData.creditCard).not.toBe('4111-1111-1111-1111');
      expect(encryptedData.name).toBe('John Doe'); // Not encrypted

      // Decrypt for admin
      const decryptedData = rbacService.decryptFields(encryptedData, ['ssn', 'creditCard']);
      expect(decryptedData.ssn).toBe('123-45-6789');
      expect(decryptedData.creditCard).toBe('4111-1111-1111-1111');

      // Record encryption metrics
      observability.incrementCounter('encryption_operations_total', {
        operation: 'encrypt',
        fields_count: '2'
      });

      observability.incrementCounter('encryption_operations_total', {
        operation: 'decrypt',
        fields_count: '2'
      });

      const encryptionMetrics = observability.getMetrics('encryption_operations_total');
      expect(encryptionMetrics).toHaveLength(2);
    });
  });

  describe('End-to-End Workflow Resilience', () => {
    it('should maintain service availability during cascading failures', async () => {
      // Simulate a scenario where external services fail
      const externalApiCall = vi.fn().mockRejectedValue(new Error('External API down'));

      // Fail external service multiple times
      for (let i = 0; i < 5; i++) {
        try {
          await circuitBreaker.execute('external_api', externalApiCall);
        } catch (error) {
          const context = {
            userId: 'system',
            requestId: `req_${i}`,
            service: 'external',
            operation: 'external_call',
            timestamp: Date.now()
          };

          await errorHandler.handleError(error as Error, context);
        }
      }

      // Check that error handler triggered degraded mode
      const degradedContext = {
        userId: 'user123',
        requestId: 'req_degraded',
        service: 'external',
        operation: 'get_tasks',
        timestamp: Date.now()
      };

      const degradedResult = await errorHandler.handleError(
        new Error('External service error'),
        degradedContext
      );

      expect(degradedResult).toEqual({
        tasks: [],
        degraded: true,
        message: 'Using cached data'
      });

      // Verify monitoring captured the failures
      const errorStats = errorHandler.getErrorStats();
      expect(errorStats.errorCounts['external_external']).toBeGreaterThan(0);

      const healthOverview = observability.getSystemOverview();
      expect(healthOverview.recentErrors).toBeGreaterThan(0);
    });
  });
});