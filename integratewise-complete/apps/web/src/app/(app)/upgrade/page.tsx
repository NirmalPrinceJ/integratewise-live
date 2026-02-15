"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"
import { PlanComparisonTable } from "@/components/paywall/PlanComparisonTable"
import { FEATURE_DESCRIPTIONS } from "@/config/plan-tiers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageSquare } from "lucide-react"
import type { EntitlementTier } from "@/config/os-shell-registry"

const FAQ_ITEMS = [
  {
    question: "What happens when I upgrade?",
    answer: "Your upgrade takes effect immediately. You'll have instant access to all features in your new plan. We'll prorate your billing so you only pay the difference for the remaining time in your current billing cycle.",
  },
  {
    question: "Can I downgrade my plan?",
    answer: "Yes, you can downgrade at any time. The downgrade will take effect at the end of your current billing cycle. You'll keep access to your current features until then.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All new accounts start with a 14-day free trial of the Organization plan. No credit card required to get started.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and can arrange invoicing for Enterprise customers.",
  },
  {
    question: "What's included in Enterprise?",
    answer: "Enterprise includes everything in Organization plus: dedicated support, custom SLAs, SCIM provisioning, advanced compliance features, and custom integrations. Contact our sales team for details.",
  },
  {
    question: "Do you offer discounts for non-profits or education?",
    answer: "Yes! We offer special pricing for non-profits, educational institutions, and startups. Contact our sales team to learn more.",
  },
]

export default function UpgradePage() {
  return (
    <React.Suspense fallback={null}>
      <UpgradePageContent />
    </React.Suspense>
  )
}

function UpgradePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { plan: currentPlan } = useTenant()
  
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual")
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Get the feature that triggered the upgrade (if any)
  const triggerFeature = searchParams.get("feature")
  const triggerFeatureName = triggerFeature
    ? FEATURE_DESCRIPTIONS[triggerFeature] || triggerFeature
    : null

  const handleSelectPlan = async (plan: EntitlementTier) => {
    if (plan === currentPlan) return

    // Enterprise: redirect to contact sales
    if (plan === "enterprise") {
      router.push("/contact-sales?plan=enterprise")
      return
    }

    setIsLoading(true)

    try {
      // Call checkout API to create Stripe session
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billingCycle,
          returnUrl: window.location.origin + "/settings/billing",
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else if (data.error) {
        console.error("Checkout error:", data.error)
        // In development or if Stripe is not configured, show a message
        alert(`Checkout not available: ${data.error}. In production, this would redirect to Stripe.`)
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Scale your integration intelligence with the right plan for your team.
        </p>
        {triggerFeatureName && (
          <p className="text-sm text-primary mt-3">
            Upgrade to access: <span className="font-medium">{triggerFeatureName}</span>
          </p>
        )}
      </div>

      {/* Plan Comparison */}
      <PlanComparisonTable
        currentPlan={currentPlan}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
        onSelectPlan={handleSelectPlan}
        className={isLoading ? "opacity-50 pointer-events-none" : ""}
      />

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center justify-between text-base font-medium">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      {item.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
              </button>
              {expandedFaq === index && (
                <CardContent className="pt-0 pb-4">
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Need help choosing?</h2>
        <p className="text-muted-foreground mb-6">
          Our team is here to help you find the right plan for your needs.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="mailto:connect@integratewise.co"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            connect@integratewise.co
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href="/contact-sales"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with Sales
          </a>
        </div>
      </div>
    </div>
  )
}
