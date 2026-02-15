/**
 * Additional Integration Handlers
 * Handlers for integrations not yet implemented
 */

import { createGenericHandler } from '../lib/generic-handler';

// Asana Handler
export const asanaHandler = createGenericHandler({
  toolId: 'asana',
  toolName: 'Asana',
  validatePayload: (body) => {
    if (typeof body !== 'object' || body === null) {
      return { valid: false, error: 'Payload must be an object' };
    }
    return { valid: true };
  },
});

// GitHub Handler
export const githubHandler = createGenericHandler({
  toolId: 'github',
  toolName: 'GitHub',
  validatePayload: (body) => {
    if (typeof body !== 'object' || body === null) {
      return { valid: false, error: 'Payload must be an object' };
    }
    return { valid: true };
  },
});
