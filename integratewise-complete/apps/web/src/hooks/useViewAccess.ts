import { useMemo } from 'react'
import { OS_NAV_ITEM_REGISTRY, NavItemConfig, EntitlementTier } from '@/config/os-shell-registry'
import { useTenant } from '@/contexts/tenant-context'

export interface ViewAccessResult {
  allowed: boolean
  reason?: string
  upgradeUrl?: string
}

export const useViewAccess = (itemId: string): ViewAccessResult => {
  const { plan, role, featureFlags } = useTenant()

  return useMemo(() => {
    const item: NavItemConfig | undefined = OS_NAV_ITEM_REGISTRY[itemId]

    if (!item) {
      return {
        allowed: false,
        reason: 'View not found',
      }
    }

    // Feature flag check
    if (!featureFlags.includes('all') && !featureFlags.includes(item.featureFlag)) {
      return {
        allowed: false,
        reason: 'Feature not enabled',
        upgradeUrl: '/upgrade',
      }
    }

    // Role check
    if (!item.requiredRoles.includes(role)) {
      return {
        allowed: false,
        reason: `Requires one of: ${item.requiredRoles.join(', ')}`,
        upgradeUrl: '/upgrade',
      }
    }

    // Plan check
    const planHierarchy: EntitlementTier[] = ['personal', 'team', 'org', 'enterprise']
    const userPlanIndex = planHierarchy.indexOf(plan)
    const requiredPlanIndex = planHierarchy.indexOf(item.requiredPlan)

    if (userPlanIndex < requiredPlanIndex) {
      return {
        allowed: false,
        reason: `Requires ${item.requiredPlan} plan or higher`,
        upgradeUrl: '/upgrade',
      }
    }

    return { allowed: true }
  }, [itemId, plan, role, featureFlags])
}
