// src/tests/integration/phase2-integration.test.ts
// Integration tests for Phase 2 services (Security, Resilience, Monitoring)

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RBACService } from '../../clients/security/rbac-service';
import { CircuitBreakerService } from '../../clients/resilience/circuit-breaker';
import { ErrorHandler } from '../../clients/resilience/error-handler';
import { ObservabilityService } from '../../clients/monitoring/observability-service';

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
    beforeEach(() => {
      // Setup RBAC roles
      rbacService.createRole({
        id: 'user',
        name: 'User',
        permissions: ['read:own', 'api:read'],
        inherits: []
      });

      rbacService.createRole({
        id: 'admin',
        name: 'Administrator',
        permissions: ['read:all', 'write:all', 'api:write'],
        inherits: ['user']
      });
    });

    it('should handle successful secure API call with monitoring', async () => {
      const userContext = {
        userId: 'user123',
        roles: ['user'],
        attributes: { department: 'engineering' }
      };

      // Check permission
      const permissionResult = rbacService.checkPermission('api:read', userContext);
      expect(permissionResult.granted).toBe(true);

      // Start observability trace
      const traceId = observability.startTrace('api_call', {
        userId: userContext.userId,
        operation: 'get_user_data'
      });

      const spanId = observability.startSpan(traceId, 'permission_check');

      // Simulate API call with circuit breaker
      const mockApiCall = vi.fn().mockResolvedValue({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        ssn: '123-45-6789' // Sensitive data
      });

      observability.endSpan(traceId, spanId);

      const apiSpanId = observability.startSpan(traceId, 'api_call');
      const apiResult = await circuitBreaker.execute('user_api', mockApiCall);
      observability.endSpan(traceId, apiSpanId);

      // Filter sensitive fields based on permissions
      const filteredData = rbacService.filterFields(apiResult, 'read', userContext);

      // Record success metrics
      observability.incrementCounter('api_calls_total', {
        endpoint: '/api/users',
        status: 'success',
        user_role: userContext.roles[0]
      });

      observability.recordHistogram('api_response_time', 150, {
        endpoint: '/api/users'
      });

      observability.endTrace(traceId, 'completed');

      // Assertions
      expect(filteredData).toHaveProperty('id');
      expect(filteredData).toHaveProperty('name');
      expect(filteredData).toHaveProperty('email');
      expect(filteredData).not.toHaveProperty('ssn'); // Should be filtered out

      expect(observability.getTraceHistory()).toHaveLength(1);
      expect(observability.getMetrics('api_calls_total')).toHaveLength(1);
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should handle API failure with error recovery and monitoring', async () => {
      const userContext = {
        userId: 'user123',
        roles: ['user'],
        attributes: {}
      };

      const traceId = observability.startTrace('api_call', {
        userId: userContext.userId,
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
          userId: userContext.userId,
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
          user_role: userContext.roles[0]
        });

        observability.endTrace(traceId, 'failed');

        // Assertions
        expect(recoveryResult).toEqual({ success: true, retried: true });
        expect(observability.getMetrics('api_errors_total')).toHaveLength(1);
        expect(observability.getTraceHistory()[0].status).toBe('failed');
      }
    });

    it('should handle circuit breaker opening with fallback', async () => {
      const userContext = {
        userId: 'user123',
        roles: ['user'],
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
        userId: userContext.userId,
        operation: 'get_user_data'
      });

      const result = await circuitBreaker.execute('user_api', failingApiCall, fallbackFn);

      // Filter fields for user
      const filteredResult = rbacService.filterFields(result, 'read', userContext);

      observability.incrementCounter('api_fallbacks_total', {
        endpoint: '/api/users',
        user_role: userContext.roles[0]
      });

      observability.endTrace(traceId, 'completed');

      // Assertions
      expect(fallbackFn).toHaveBeenCalled();
      expect(filteredResult).toEqual(fallbackData);
      expect(observability.getMetrics('api_fallbacks_total')).toHaveLength(1);
    });

    it('should enforce admin permissions for sensitive operations', async () => {
      const userContext = {
        userId: 'user123',
        roles: ['user'],
        attributes: {}
      };

      const adminContext = {
        userId: 'admin123',
        roles: ['admin'],
        attributes: {}
      };

      const sensitiveData = {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        ssn: '123-45-6789',
        salary: 100000
      };

      // User should not have access to sensitive fields
      const userFiltered = rbacService.filterFields(sensitiveData, 'read', userContext);
      expect(userFiltered).not.toHaveProperty('ssn');
      expect(userFiltered).not.toHaveProperty('salary');

      // Admin should have access to all fields
      const adminFiltered = rbacService.filterFields(sensitiveData, 'read', adminContext);
      expect(adminFiltered).toHaveProperty('ssn');
      expect(adminFiltered).toHaveProperty('salary');

      // User should not be able to write
      const writePermission = rbacService.checkPermission('write:all', userContext);
      expect(writePermission.granted).toBe(false);

      // Admin should be able to write
      const adminWritePermission = rbacService.checkPermission('write:all', adminContext);
      expect(adminWritePermission.granted).toBe(true);

      // Record permission check metrics
      observability.incrementCounter('permission_checks_total', {
        permission: 'write:all',
        user_role: userContext.roles[0],
        granted: 'false'
      });

      observability.incrementCounter('permission_checks_total', {
        permission: 'write:all',
        user_role: adminContext.roles[0],
        granted: 'true'
      });

      expect(observability.getMetrics('permission_checks_total')).toHaveLength(2);
    });

    it('should monitor system health during operations', async () => {
      // Perform several operations to generate metrics
      const userContext = {
        userId: 'user123',
        roles: ['user'],
        attributes: {}
      };

      for (let i = 0; i < 5; i++) {
        const traceId = observability.startTrace(`operation_${i}`, {
          userId: userContext.userId,
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
      const adminContext = {
        userId: 'admin123',
        roles: ['admin'],
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