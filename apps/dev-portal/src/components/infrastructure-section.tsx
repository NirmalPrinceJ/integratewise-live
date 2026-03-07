"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INFRA_NODES, DOMAIN_MAP } from "@/lib/data";
import { Globe, Server, Database, Cloud, FileBox, Layers } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Cloudflare": <Cloud className="h-5 w-5" />,
  "Supabase": <Database className="h-5 w-5" />,
  "n8n": <Layers className="h-5 w-5" />,
  "Neon PostgreSQL": <Database className="h-5 w-5" />,
  "Vercel": <Server className="h-5 w-5" />,
  "Notion": <FileBox className="h-5 w-5" />,
  "Box": <FileBox className="h-5 w-5" />,
};

export function InfrastructureSection() {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Current infrastructure topology. 7 active nodes across compute, storage, and orchestration.
      </p>

      {/* Infrastructure Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {INFRA_NODES.map((node) => (
          <Card key={node.name} className={`p-4 border-l-2 ${node.className}`}>
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground mt-0.5">{iconMap[node.name]}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{node.name}</div>
                <div className="text-sm text-muted-foreground">{node.role}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {node.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Domain Map */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-iw-cyan" />
        Domain Routing
      </h3>
      <div className="space-y-3">
        {DOMAIN_MAP.map((domain) => (
          <Card key={domain.domain} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <code className="font-mono text-sm text-iw-cyan whitespace-nowrap">{domain.domain}</code>
              <div className="flex-1 text-sm text-muted-foreground">{domain.desc}</div>
              <Badge
                variant={domain.status === "active" ? "green" : "info"}
                className="w-fit"
              >
                {domain.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
