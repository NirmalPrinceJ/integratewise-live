"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArchLayer } from "@/components/arch-layer";
import { STATUS_METRICS } from "@/lib/data";

const stagger = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export function OverviewSection() {
  return (
    <div>
      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {STATUS_METRICS.map((metric, i) => (
          <motion.div key={metric.label} custom={i} initial="hidden" animate="show" variants={stagger}>
            <Card className="p-5">
              <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-2">
                {metric.label}
              </div>
              <div className={`font-mono text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{metric.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Wedge Product */}
      <ArchLayer badge="W" badgeColor="bg-iw-amber/15 text-iw-amber" title="Wedge Product — MCP Orchestration Layer" defaultOpen>
        <p>
          The n8n MCP multi-system orchestration layer at{" "}
          <code className="px-1.5 py-0.5 bg-iw-deep rounded text-iw-cyan text-xs font-mono">
            n8n.glowingpancake.online
          </code>{" "}
          is the{" "}
          <strong className="text-iw-amber">FIRST WEDGE PRODUCT</strong>. All other activities
          (website, LinkedIn, marketing) are deprioritized until this wedge is proven.
        </p>
        <p className="mt-3">
          This layer enables AI systems to orchestrate across multiple business tools through a single
          MCP endpoint, proving the core Glowing Pancake thesis: unified context across fragmented
          tooling.
        </p>
      </ArchLayer>

      {/* Problems */}
      <ArchLayer badge="P" badgeColor="bg-iw-blue/15 text-iw-blue" title="Problems We Solve">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {[
            { name: "GenAI Divide", desc: "Most teams can't use AI effectively because context is scattered across tools" },
            { name: "Tool Sprawl", desc: "10-30+ tools per org with no unified intelligence layer" },
            { name: "CS Paradox", desc: "Customer Success teams have the most data but the least tooling" },
          ].map((p) => (
            <div key={p.name} className="bg-iw-deep border border-border rounded-lg p-4">
              <div className="font-mono text-xs font-semibold text-iw-cyan mb-1">{p.name}</div>
              <div className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </ArchLayer>
    </div>
  );
}
