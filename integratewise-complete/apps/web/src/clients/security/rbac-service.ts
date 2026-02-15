// src/services/security/rbac-service.ts
// Role-Based Access Control with Field-Level Permissions

export interface User {
  id: string;
  roles: string[];
  attributes: Record<string, any>;
}

export interface Resource {
  type: string; // 'task', 'account', 'meeting', etc.
  id: string;
  owner: string;
  scope: Record<string, any>; // account_id, team_id, etc.
  fields: Record<string, any>;
}

interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: string;
  conditions?: Record<string, any>;
  fields?: string[]; // Allowed fields for field-level access
}

interface Policy {
  id: string;
  name: string;
  roles: string[];
  permissions: Permission[];
  priority: number; // Higher priority policies override lower ones
}

export class RBACService {
  private policies: Policy[] = [];
  private fieldEncryptionKeys: Map<string, string> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
    this.initializeFieldEncryption();
  }

  private initializeDefaultPolicies() {
    // Personal User Policy
    this.policies.push({
      id: 'personal-policy',
      name: 'Personal User Access',
      roles: ['personal'],
      permissions: [
        {
          action: 'read',
          resource: 'task',
          conditions: { 'owner': '{{user.id}}' }
        },
        {
          action: 'create',
          resource: 'task',
          conditions: { category: 'personal' }
        },
        {
          action: 'update',
          resource: 'task',
          conditions: { 'owner': '{{user.id}}' },
          fields: ['title', 'description', 'status', 'due_date']
        }
      ],
      priority: 10
    });

    // API Access Policy for Personal Users
    this.policies.push({
      id: 'personal-api-policy',
      name: 'Personal API Access',
      roles: ['personal'],
      permissions: [
        {
          action: 'read',
          resource: 'api',
          conditions: { 'owner': '{{user.id}}' }
        },
        {
          action: 'create',
          resource: 'api',
          conditions: { 'owner': '{{user.id}}' }
        }
      ],
      priority: 15
    });

    // CSM Policy
    this.policies.push({
      id: 'csm-policy',
      name: 'CSM Access',
      roles: ['csm'],
      permissions: [
        {
          action: 'read',
          resource: 'account',
          conditions: { 'scope.assigned_csm_id': '{{user.id}}' }
        },
        {
          action: 'read',
          resource: 'task',
          conditions: { 'scope.account_id': '{{user.attributes.assigned_accounts}}' }
        },
        {
          action: 'update',
          resource: 'account',
          conditions: { 'scope.assigned_csm_id': '{{user.id}}' },
          fields: ['health_score', 'notes', 'last_contact']
        }
      ],
      priority: 20
    });

    // Business/Executive Policy
    this.policies.push({
      id: 'business-policy',
      name: 'Business Access',
      roles: ['executive', 'business'],
      permissions: [
        {
          action: 'read',
          resource: '*', // All resources
          conditions: {} // No restrictions
        },
        {
          action: 'create',
          resource: '*',
          conditions: {}
        },
        {
          action: 'update',
          resource: '*',
          conditions: {},
          fields: ['*'] // All fields
        }
      ],
      priority: 30
    });
  }

  private initializeFieldEncryption() {
    // Define which fields should be encrypted
    this.fieldEncryptionKeys.set('account.arr', 'account-sensitive-key');
    this.fieldEncryptionKeys.set('user.email', 'user-sensitive-key');
    this.fieldEncryptionKeys.set('meeting.transcript', 'meeting-sensitive-key');
  }

  async checkPermission(user: User, action: string, resource: Resource): Promise<{
    allowed: boolean;
    allowedFields?: string[];
    reason?: string;
  }> {
    // Sort policies by priority (highest first)
    const applicablePolicies = this.policies
      .filter(policy => policy.roles.some(role => user.roles.includes(role)))
      .sort((a, b) => b.priority - a.priority);

    for (const policy of applicablePolicies) {
      for (const permission of policy.permissions) {
        if (this.matchesPermission(permission, action, resource.type)) {
          const conditionsMet = this.evaluateConditions(permission.conditions || {}, user, resource);

          if (conditionsMet) {
            return {
              allowed: true,
              allowedFields: permission.fields || ['*'],
              reason: `Allowed by policy: ${policy.name}`
            };
          }
        }
      }
    }

    return {
      allowed: false,
      reason: 'No matching policy found'
    };
  }

  private matchesPermission(permission: Permission, action: string, resourceType: string): boolean {
    return permission.action === action &&
           (permission.resource === '*' || permission.resource === resourceType);
  }

  private evaluateConditions(conditions: Record<string, any>, user: User, resource: Resource): boolean {
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = this.resolveValue(key, user, resource);

      if (Array.isArray(expectedValue)) {
        if (!expectedValue.includes(actualValue)) {
          return false;
        }
      } else if (typeof expectedValue === 'string' && expectedValue.includes('{{')) {
        // Template evaluation
        const resolvedExpected = this.resolveTemplate(expectedValue, user, resource);
        if (actualValue !== resolvedExpected) {
          return false;
        }
      } else {
        if (actualValue !== expectedValue) {
          return false;
        }
      }
    }

    return true;
  }

  private resolveValue(path: string, user: User, resource: Resource): any {
    const parts = path.split('.');

    if (parts[0] === 'user') {
      return this.getNestedValue(user, parts.slice(1));
    } else if (parts[0] === 'scope') {
      return this.getNestedValue(resource.scope, parts.slice(1));
    } else if (parts[0] === 'fields') {
      return this.getNestedValue(resource.fields, parts.slice(1));
    } else {
      // Direct resource property
      return this.getNestedValue(resource, parts);
    }
  }

  private resolveTemplate(template: string, user: User, resource: Resource): any {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      return this.resolveValue(path.trim(), user, resource) || '';
    });
  }

  private getNestedValue(obj: any, path: string[]): any {
    return path.reduce((current, key) => current?.[key], obj);
  }

  // Field-level access control
  filterFields(resource: Resource, allowedFields: string[], user: User): Resource {
    if (allowedFields.includes('*')) {
      return resource;
    }

    const filteredFields: Record<string, any> = {};

    for (const field of allowedFields) {
      if (resource.fields[field] !== undefined) {
        // Check if field needs decryption
        const encryptionKey = this.fieldEncryptionKeys.get(`${resource.type}.${field}`);
        if (encryptionKey) {
          filteredFields[field] = this.decryptField(resource.fields[field], encryptionKey);
        } else {
          filteredFields[field] = resource.fields[field];
        }
      }
    }

    return {
      ...resource,
      fields: filteredFields
    };
  }

  // Data encryption/decryption
  private encryptField(value: any, key: string): string {
    // In production, use proper encryption (AES-256, etc.)
    // This is a placeholder
    return btoa(JSON.stringify({ value, key }));
  }

  private decryptField(encryptedValue: string, key: string): any {
    try {
      const decrypted = JSON.parse(atob(encryptedValue));
      if (decrypted.key === key) {
        return decrypted.value;
      }
      throw new Error('Invalid decryption key');
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[ENCRYPTED]';
    }
  }

  // Audit logging
  async logAccess(user: User, action: string, resource: Resource, result: 'allowed' | 'denied', reason?: string) {
    const auditEntry = {
      timestamp: Date.now(),
      userId: user.id,
      action,
      resourceType: resource.type,
      resourceId: resource.id,
      result,
      reason,
      ipAddress: 'placeholder', // Would get from request
      userAgent: 'placeholder'  // Would get from request
    };

    // In production, send to audit log service
    console.log('Audit:', auditEntry);

    // Could also send to Analytics Engine or separate audit system
  }

  // Add custom policy
  addPolicy(policy: Policy) {
    this.policies.push(policy);
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  // Remove policy
  removePolicy(policyId: string) {
    this.policies = this.policies.filter(p => p.id !== policyId);
  }
}

// Export singleton
export const rbacService = new RBACService();