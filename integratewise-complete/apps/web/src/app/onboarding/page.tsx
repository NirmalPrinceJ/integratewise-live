"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TemplateSelector } from "@/components/onboarding/template-selector"
import { IdentityConnectView } from "@/components/onboarding/identity-connect-view"
import { SeamlessConnectorView } from "@/components/onboarding/seamless-connector-view"
import { ProcessingView } from "@/components/onboarding/processing-view"
import { HydrationScorer } from "@/components/onboarding/hydration-scorer"
import { FirstProjectionBuild } from "@/components/onboarding/first-projection-build"
import { ThemePreviewView } from "@/components/onboarding/theme-preview-view"
import type { TenantBucketStatus } from "@/types/hydration-buckets"

// L0 Onboarding Flow with Progressive Hydration
type OnboardingStep = 
  | "template" 
  | "identity" 
  | "connect" 
  | "processing" 
  | "hydration"      // L0.5 - Hydration Scorer
  | "projection"     // L0.6 - First Projection Build
  | "theme"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("template")
  const [userData, setUserData] = useState({ name: "", aspiration: "" })
  const [connectedTools, setConnectedTools] = useState<string[]>([])
  const [bucketStatus, setBucketStatus] = useState<TenantBucketStatus | null>(null)
  const [enabledModules, setEnabledModules] = useState<string[]>([])
  
  // TODO: Get actual tenant/user IDs from auth context
  const tenantId = "default_tenant"
  const userId = "current_user"

  const handleTemplateSelect = (templateId: string) => {
    setStep("identity")
  }

  const handleIdentityComplete = (data: { name: string; aspiration: string }) => {
    setUserData(data)
    setStep("connect")
  }

  const handleConnectComplete = (tools?: string[]) => {
    if (tools) setConnectedTools(tools)
    setStep("processing")
  }

  const handleProcessingComplete = () => {
    // Move to hydration scoring (L0.5)
    setStep("hydration")
  }

  const handleHydrationComplete = (status: TenantBucketStatus) => {
    setBucketStatus(status)
    // Move to projection build (L0.6)
    setStep("projection")
  }

  const handleProjectionComplete = (modules: string[]) => {
    setEnabledModules(modules)
    setStep("theme")
  }

  const handleFinalComplete = () => {
    // Store onboarding results for workspace initialization
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('iw:onboarding:complete', JSON.stringify({
        bucketStatus,
        enabledModules,
        connectedTools,
        userData,
      }))
    }
    router.push("/")
    router.refresh()
  }

  switch (step) {
    case "template":
      return <TemplateSelector onSelect={handleTemplateSelect} />
    case "identity":
      return <IdentityConnectView onComplete={handleIdentityComplete} />
    case "connect":
      return (
        <SeamlessConnectorView
          onComplete={(tools) => handleConnectComplete(tools)}
          onSkip={() => setStep("processing")}
        />
      )
    case "processing":
      return <ProcessingView onComplete={handleProcessingComplete} />
    case "hydration":
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-xl">
            <HydrationScorer
              tenantId={tenantId}
              connectedTools={connectedTools}
              onComplete={handleHydrationComplete}
            />
          </div>
        </div>
      )
    case "projection":
      return bucketStatus ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-xl">
            <FirstProjectionBuild
              tenantId={tenantId}
              userId={userId}
              bucketStatus={bucketStatus}
              onComplete={handleProjectionComplete}
            />
          </div>
        </div>
      ) : null
    case "theme":
      return (
        <ThemePreviewView
          userName={userData.name}
          onComplete={handleFinalComplete}
        />
      )
    default:
      return null
  }
}
