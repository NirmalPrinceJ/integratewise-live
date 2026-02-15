import { z } from 'zod';

// Stripe webhook event
export const StripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
  created: z.number(),
});

export type StripeWebhook = z.infer<typeof StripeWebhookSchema>;

// Slack webhook event
export const SlackWebhookSchema = z.object({
  type: z.string(),
  token: z.string().optional(),
  team_id: z.string().optional(),
  event: z.record(z.unknown()).optional(),
  challenge: z.string().optional(),
});

export type SlackWebhook = z.infer<typeof SlackWebhookSchema>;

// Discord interaction
export const DiscordInteractionSchema = z.object({
  id: z.string(),
  type: z.number(),
  application_id: z.string(),
  token: z.string(),
  data: z.record(z.unknown()).optional(),
});

export type DiscordInteraction = z.infer<typeof DiscordInteractionSchema>;

// Notion webhook
export const NotionWebhookSchema = z.object({
  type: z.string(),
  workspace_id: z.string(),
  data: z.record(z.unknown()),
});

export type NotionWebhook = z.infer<typeof NotionWebhookSchema>;
