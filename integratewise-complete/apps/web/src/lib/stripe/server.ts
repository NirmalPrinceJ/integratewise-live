// Stripe server-side utilities
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-11-20.acacia" })
  : null

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
}) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.subscriptions.cancel(subscriptionId)
}

export function constructWebhookEvent(body: string, signature: string, webhookSecret: string) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

export async function getOrCreateStripeCustomer(email: string, workspaceId: string) {
  if (!stripe) throw new Error("Stripe not configured")

  // Search for existing customer
  const existing = await stripe.customers.search({
    query: `email:"${email}"`,
  })

  if (existing.data.length > 0) {
    return existing.data[0]
  }

  // Create new customer
  return stripe.customers.create({
    email,
    metadata: { workspace_id: workspaceId },
  })
}

export async function reportUsage(subscriptionItemId: string, quantity: number) {
  if (!stripe) throw new Error("Stripe not configured")

  return stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: Math.floor(Date.now() / 1000),
    action: "increment",
  })
}
