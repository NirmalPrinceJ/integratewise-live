"use client";

import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Glowing Pancake</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Dev Command Center — Internal Development Portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            LIVE
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            v1.0.0
          </Badge>
        </div>
      </div>
    </header>
  );
}
