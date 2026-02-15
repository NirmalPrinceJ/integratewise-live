import { UnifiedShell } from "@/components/layouts/unified-shell";
import { CTXProvider } from "@/contexts/ctx-context";
import { TenantProvider } from "@/contexts/tenant-context";
import { L2DrawerProvider } from "@/components/cognitive/l2-drawer";
import { CognitiveEventListener } from "@/components/cognitive/cognitive-triggers";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TenantProvider>
      <CTXProvider>
        <TooltipProvider>
          <L2DrawerProvider>
            {/* L3→L2 Wiring: Listens for ingestion events and triggers drawer */}
            <CognitiveEventListener />
            <UnifiedShell>{children}</UnifiedShell>
          </L2DrawerProvider>
        </TooltipProvider>
      </CTXProvider>
    </TenantProvider>
  );
}
