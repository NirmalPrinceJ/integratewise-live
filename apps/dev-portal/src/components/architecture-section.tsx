"use client";

import { ArchLayer } from "@/components/arch-layer";
import { ARCHITECTURE_LAYERS } from "@/lib/data";

export function ArchitectureSection() {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Four-layer architecture from vision to implementation. Click each layer to expand details.
      </p>
      {ARCHITECTURE_LAYERS.map((layer) => (
        <ArchLayer
          key={layer.id}
          badge={layer.badge}
          badgeColor={layer.badgeColor}
          title={layer.title}
          defaultOpen={layer.id === "l0"}
        >
          <p className="mb-4">{layer.content}</p>
          {layer.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {layer.items.map((item) => (
                <div key={item.name} className="bg-iw-deep border border-border rounded-lg p-4">
                  <div className="font-mono text-xs font-semibold text-iw-cyan mb-1">{item.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </ArchLayer>
      ))}
    </div>
  );
}
