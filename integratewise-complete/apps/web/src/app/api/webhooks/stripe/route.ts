import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe/server"
import { createAdminClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(supabase, subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(supabase, subscription)
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(supabase, invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(supabase, invoice)
        break
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, session)
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionChange(supabase: any, subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const userId = subscription.metadata.user_id

  if (!userId) {
    console.error("[Stripe] No user_id in subscription metadata")
    return
  }

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      plan_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  )

  if (error) {
    console.error("[Stripe] Failed to update subscription:", error)
  }
}

async function handleSubscriptionCancellation(supabase: any, subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)

  if (error) {
    console.error("[Stripe] Failed to cancel subscription:", error)
  }
}

async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
  const { error } = await supabase.from("billing_events").insert({
    user_id: invoice.metadata?.user_id,
    stripe_customer_id: invoice.customer,
    stripe_invoice_id: invoice.id,
    type: "invoice_paid",
    amount: invoice.amount_paid,
    currency: invoice.currency,
    created_at: new Date(invoice.created * 1000).toISOString(),
  })

  if (error) {
    console.error("[Stripe] Failed to log invoice payment:", error)
  }
}

async function handleInvoicePaymentFailed(supabase: any, invoice: Stripe.Invoice) {
  const { error } = await supabase.from("billing_events").insert({
    user_id: invoice.metadata?.user_id,
    stripe_customer_id: invoice.customer,
    stripe_invoice_id: invoice.id,
    type: "invoice_payment_failed",
    amount: invoice.amount_due,
    currency: invoice.currency,
    created_at: new Date(invoice.created * 1000).toISOString(),
  })

  if (error) {
    console.error("[Stripe] Failed to log payment failure:", error)
  }
}

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id

  if (!userId || !session.customer) {
    return
  }

  // Update user with Stripe customer ID
  const { error } = await supabase
    .from("users")
    .update({
      stripe_customer_id: session.customer,
    })
    .eq("id", userId)

  if (error) {
    console.error("[Stripe] Failed to update user with customer ID:", error)
  }
}
