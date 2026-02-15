/**
 * IntegrateWise V11.11 - Loader Module
 * 
 * LOOP B: Ingestion Pipeline
 * The Loader captures raw data from external tools.
 * Data flows: Tool API/Webhook → Loader → Normalizer → Spine (Truth)
 */

export * from './types';

// Export built-in connector mappings
export {
  SALESFORCE_MAPPINGS,
  HUBSPOT_MAPPINGS,
  ZENDESK_MAPPINGS,
} from './types';
