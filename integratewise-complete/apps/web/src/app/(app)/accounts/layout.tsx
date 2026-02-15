"use client"

import { ProtectedPage } from "@/components/ProtectedPage"

/**
 * Accounts World Layout
 * 
 * Gates the entire Accounts world behind the "worlds.accounts" feature (org+ plan).
 * This ensures no accounts routes are accessible without proper entitlement.
 */
export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedPage featureKey="worlds.accounts">
      {children}
    </ProtectedPage>
  )
}
