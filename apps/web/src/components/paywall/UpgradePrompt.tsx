"use client"

import * as React from "react"
import { Crown, Lock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { planLabel } from "@/lib/entitlements"
import type { EntitlementTier } from "@/config/os-shell-registry"

export interface UpgradePromptProps {
  featureName: string
  requiredPlan: EntitlementTier
  currentPlan: EntitlementTier
  variant?: "inline" | "full" | "banner"
  className?: string
  onDismiss?: () => void
}

export function UpgradePrompt({
  featureName,
  requiredPlan,
  currentPlan,
  variant = "inline",
  className,
  onDismiss,
}: UpgradePromptProps) {
  const upgradeUrl = `/upgrade?feature=${encodeURIComponent(featureName)}&required=${requiredPlan}`
  const requiredPlanLabel = planLabel(requiredPlan)
  const currentPlanLabel = planLabel(currentPlan)

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <span className="font-medium">{featureName}</span>
            <span className="text-muted-foreground"> requires {requiredPlanLabel} plan</span>
          </div>
        </div>
        <Button asChild size="sm" variant="default">
          <a href={upgradeUrl}>
            Upgrade
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              Unlock {featureName} with {requiredPlanLabel}
            </p>
            <p className="text-sm text-muted-foreground">
              You&apos;re on {currentPlanLabel}. Upgrade to access this feature.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <a href={upgradeUrl}>
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to {requiredPlanLabel}
            </a>
          </Button>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    )
  }

  // variant === "full"
  return (
    <div className={cn("flex items-center justify-center min-h-[400px] p-4", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">{featureName}</CardTitle>
          <CardDescription>
            This feature requires the {requiredPlanLabel} plan. You&apos;re currently on {currentPlanLabel}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="w-full">
            <a href={upgradeUrl}>
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to {requiredPlanLabel}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
