"use client"

export const runtime = 'edge';

/**
 * Embeddable Pricing Table for Webflow
 * 
 * Usage in Webflow:
 * <iframe src="https://app.integratewise.ai/embed/pricing-table?theme=light" />
 */

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "free",
    name: "Free",
    description: "For individuals getting started",
    price: { monthly: 0, annual: 0 },
    cta: "Get Started",
    ctaVariant: "outline" as const,
    features: [
      { name: "5 Integrations", included: true },
      { name: "1,000 API calls/mo", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Custom Workflows", included: false },
      { name: "Team Collaboration", included: false },
      { name: "Priority Support", included: false },
      { name: "SSO/SAML", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For small teams",
    price: { monthly: 49, annual: 39 },
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    features: [
      { name: "25 Integrations", included: true },
      { name: "50,000 API calls/mo", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Custom Workflows", included: true },
      { name: "Team Collaboration (5 seats)", included: true },
      { name: "Priority Support", included: false },
      { name: "SSO/SAML", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    price: { monthly: 149, annual: 119 },
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
    features: [
      { name: "Unlimited Integrations", included: true },
      { name: "500,000 API calls/mo", included: true },
      { name: "Advanced Analytics + AI", included: true },
      { name: "Priority Support", included: true },
      { name: "Custom Workflows", included: true },
      { name: "Team Collaboration (20 seats)", included: true },
      { name: "API Access", included: true },
      { name: "SSO/SAML", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: null, annual: null },
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    features: [
      { name: "Unlimited Everything", included: true },
      { name: "Unlimited API calls", included: true },
      { name: "Custom AI Models", included: true },
      { name: "Dedicated Support", included: true },
      { name: "Custom Workflows", included: true },
      { name: "Unlimited Seats", included: true },
      { name: "Full API Access", included: true },
      { name: "SSO/SAML + Custom Auth", included: true },
    ],
  },
]

function PricingTableContent() {
  const searchParams = useSearchParams()
  const theme = searchParams.get("theme") || "light"
  const billingCycle = searchParams.get("billing") || "monthly"
  const appUrl = searchParams.get("appUrl") || "https://app.integratewise.ai"

  const isDark = theme === "dark"

  const handleSelectPlan = (planId: string) => {
    // Post message to parent (Webflow) and redirect
    window.parent.postMessage({ type: "plan-selected", planId }, "*")
    window.open(`${appUrl}/auth/sign-up?plan=${planId}&source=webflow-pricing`, "_blank")
  }

  return (
    <div className={cn(
      "min-h-screen p-6",
      isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className={cn(
          "inline-flex rounded-lg p-1",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === "monthly"
                ? isDark ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow"
                : isDark ? "text-gray-400" : "text-gray-600"
            )}
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set("billing", "monthly")
              window.history.replaceState({}, "", url)
              window.location.reload()
            }}
          >
            Monthly
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === "annual"
                ? isDark ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow"
                : isDark ? "text-gray-400" : "text-gray-600"
            )}
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set("billing", "annual")
              window.history.replaceState({}, "", url)
              window.location.reload()
            }}
          >
            Annual <span className="text-green-500 ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative rounded-2xl p-6 flex flex-col",
              plan.popular
                ? "border-2 border-blue-500 shadow-xl"
                : isDark ? "border border-gray-700" : "border border-gray-200",
              isDark ? "bg-gray-800" : "bg-white"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              {plan.price.monthly !== null ? (
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    ${billingCycle === "annual" ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={cn(
                    "ml-2 text-sm",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    /month
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-bold">Custom Pricing</div>
              )}
            </div>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6",
                plan.ctaVariant === "default"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : isDark
                    ? "border border-gray-600 hover:bg-gray-700"
                    : "border border-gray-300 hover:bg-gray-50"
              )}
            >
              {plan.cta}
            </button>

            <ul className="space-y-3 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <X className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isDark ? "text-gray-600" : "text-gray-300"
                    )} />
                  )}
                  <span className={cn(
                    !feature.included && (isDark ? "text-gray-500" : "text-gray-400")
                  )}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className={cn(
        "text-center mt-8 text-sm",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        🔒 14-day free trial • No credit card required • Cancel anytime
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-gray-400">Loading pricing...</div>
    </div>
  )
}

export default function EmbedPricingTable() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PricingTableContent />
    </Suspense>
  )
}
