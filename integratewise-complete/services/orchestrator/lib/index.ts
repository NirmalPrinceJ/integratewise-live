/**
 * IntegrateWise V11.11 - IQ Hub Module
 * 
 * IQ Hub is the UNIFIED VIEW LAYER that reads from both Truth (Spine) and Context (Brainstorming).
 * 
 * CRITICAL RULES:
 * - IQ Hub is READ-ONLY
 * - IQ Hub does NOT auto-merge Context into Truth
 * - Human action is required to promote Context → Truth (via Actions)
 */

export * from './types';
export { IQHubService, getIQHubService } from './service';
