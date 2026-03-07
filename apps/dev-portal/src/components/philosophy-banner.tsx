"use client";

import { Card } from "@/components/ui/card";

export function PhilosophyBanner() {
  return (
    <Card className="mb-8 p-6 border-l-4 border-l-iw-cyan bg-gradient-to-r from-iw-cyan/5 to-transparent">
      <blockquote className="text-lg font-medium italic">
        &ldquo;AI That Thinks in Context, Waits for Approvals&rdquo;
      </blockquote>
      <p className="text-sm text-muted-foreground mt-2">
        Dual-context design: Every AI recommendation carries both vendor AND client goal impact
      </p>
    </Card>
  );
}
