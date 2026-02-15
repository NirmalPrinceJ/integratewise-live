"use client"

import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { CreditCard, Check, AlertCircle, RefreshCw, BarChart3 } from "lucide-react"
import { useAdminBilling, BillingPlanInfo } from "@/hooks/useAdminBilling"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BillingPage() {
  const { plans, loading, error, refresh } = useAdminBilling()

  // For the demo, we'll take the first plan as the current one
  const currentPlan = plans[0]

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          Failed to load billing information.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription and payments"
        stageId="BILLING-023"
        actions={
          <Button variant="outline" size="icon" onClick={() => refresh()}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        }
      />

      {loading && !currentPlan ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : (
        <>
          {/* Current Plan & Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-[#2D7A3E] bg-[#E8F5E9]/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-[#E8F5E9] text-[#2D7A3E] border-[#2D7A3E]/30">
                    Current Plan
                  </Badge>
                  <Button variant="outline" size="sm">Manage Plan</Button>
                </div>
                <CardTitle className="text-3xl font-bold mt-4 capitalize">
                  {currentPlan?.plan || "Pro"} Plan
                </CardTitle>
                <p className="text-gray-500">₹2,499/month • Billed monthly</p>
              </CardHeader>
              <CardContent>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <p>Next billing date: March 1, 2026</p>
                  <p>{currentPlan?.seatsUsed} / {currentPlan?.seats} seats used</p>
                </div>
                {currentPlan?.alerts?.map((alert: string, i: number) => (
                  <div key={i} className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 text-sm border border-amber-100">
                    <AlertCircle className="w-4 h-4" />
                    {alert}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Quick Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">AI Tokens</span>
                    <span className="font-medium">{(currentPlan?.usage?.aiTokens || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Storage</span>
                    <span className="font-medium">{currentPlan?.usage?.storageGb || 0} GB</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Action Runs</span>
                    <span className="font-medium">{currentPlan?.usage?.actionRuns || 0}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Plans */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: "Free", price: "₹0", features: ["1 user", "Basic features", "Community support"] },
                { name: "Starter", price: "₹999", features: ["3 users", "All Free features", "Email support"] },
                {
                  name: "Pro",
                  price: "₹2,499",
                  features: ["10 users", "All Starter features", "Priority support"],
                  current: true,
                },
                {
                  name: "Business",
                  price: "₹7,999",
                  features: ["Unlimited users", "All Pro features", "Dedicated success manager"],
                },
              ].map((plan) => (
                <Card
                  key={plan.name}
                  className={`${plan.current ? "border-[#2D7A3E] bg-[#E8F5E9]/30" : "bg-white"}`}
                >
                  <CardContent className="p-5">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-3 h-3 text-[#2D7A3E]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-4 ${plan.current ? "bg-gray-200 text-gray-500 hover:bg-gray-200" : "bg-[#2D7A3E] hover:bg-[#236B31]"}`}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#2D7A3E]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Visa Corporate • Expires 12/2028</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
