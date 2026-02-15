/**
 * App Layout - RBAC-Based Unified Shell
 * 
 * Single shell architecture:
 * - Role determines view
 * - One shell with pluggable domains
 * - No manual context switching
 */

import { UnifiedShell } from "@/components/shell/UnifiedShell";
import { TenantProvider } from "@/contexts/tenant-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TenantProvider>
      <TooltipProvider>
        <UnifiedShell>{children}</UnifiedShell>
      </TooltipProvider>
    </TenantProvider>
  );
}
