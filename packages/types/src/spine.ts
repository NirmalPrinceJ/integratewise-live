import { z } from 'zod';

// Spine Event - Normalized webhook event schema
export const SpineEventSchema = z.object({
  id: z.string().uuid(),
  source: z.enum(['stripe', 'slack', 'discord', 'notion', 'attio', 'github', 'custom']),
  type: z.string(),
  timestamp: z.string().datetime(),
  payload: z.record(z.unknown()),
  metadata: z
    .object({
      raw_event_id: z.string().optional(),
      workspace_id: z.string().optional(),
      user_id: z.string().optional(),
    })
    .optional(),
});

export type SpineEvent = z.infer<typeof SpineEventSchema>;

// Action request schema
export const ActionRequestSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  payload: z.record(z.unknown()),
  source_event_id: z.string().uuid().optional(),
  created_at: z.string().datetime(),
});

export type ActionRequest = z.infer<typeof ActionRequestSchema>;
