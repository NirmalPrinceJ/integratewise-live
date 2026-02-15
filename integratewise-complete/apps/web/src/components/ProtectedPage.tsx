"use client"

import * as React from "react"
import { ProtectedView } from "@/components/ProtectedView"
import { FeatureGate } from "@/components/paywall/FeatureGate"

interface ProtectedPageProps {
  /**
   * The view ID from os-shell-registry (e.g., "OPS-SPINE", "ADMIN-IQ-HUB")
   * Used when the page corresponds to a registered nav item
   */
  viewId?: string
  /**
   * The feature key from FEATURE_GATES (e.g., "surfaces.iq_hub", "admin.custom_roles")
   * Used when gating by feature rather than nav item
   */
  featureKey?: string
  /**
   * The content to render when access is allowed
   */
  children: React.ReactNode
  /**
   * Custom fallback when access is denied (default: upgrade prompt)
   */
  fallback?: React.ReactNode
}

/**
 * Client-side wrapper component for protecting entire pages at the route level.
 * 
 * Use this to wrap page content when direct URL access should be gated.
 * Works with both client and server components as children.
 * 
 * @example
 * ```tsx
 * // In app/(app)/iq-hub/page.tsx (server component)
 * import { ProtectedPage } from "@/components/ProtectedPage"
 * 
 * export default async function IQHubPage() {
 *   const data = await fetchData()  // Server-side fetch
 *   return (
 *     <ProtectedPage featureKey="surfaces.iq_hub">
 *       <IQHubContent data={data} />
 *     </ProtectedPage>
 *   )
 * }
 * 
 * // Or using viewId (matches nav registry)
 * export default function SpinePage() {
 *   return (
 *     <ProtectedPage viewId="OPS-SPINE">
 *       <SpineContent />
 *     </ProtectedPage>
 *   )
 * }
 * ```
 */
export function ProtectedPage({
  viewId,
  featureKey,
  children,
  fallback,
}: ProtectedPageProps) {
  // If viewId is provided, use ProtectedView (checks nav item registry)
  if (viewId) {
    return (
      <ProtectedView viewId={viewId} fallback={fallback}>
        {children}
      </ProtectedView>
    )
  }

  // If featureKey is provided, use FeatureGate (checks feature gates)
  if (featureKey) {
    return (
      <FeatureGate featureKey={featureKey} fallback={fallback} variant="full">
        {children}
      </FeatureGate>
    )
  }

  // If neither provided, just render children (no protection)
  console.warn("ProtectedPage: No viewId or featureKey provided, rendering unprotected")
  return <>{children}</>
}

/**
 * Hook to get page-level access status (for conditional rendering within pages)
 */
export { useFeatureAccess } from "@/components/paywall/FeatureGate"
