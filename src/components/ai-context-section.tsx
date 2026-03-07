"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AI_CONTEXT_FILES } from "@/lib/data";
import { ExternalLink, FileText, Database, Search, Plug } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "📄": <FileText className="h-8 w-8 text-iw-cyan" />,
  "📊": <Database className="h-8 w-8 text-iw-purple" />,
  "🔍": <Search className="h-8 w-8 text-iw-green" />,
  "🔌": <Plug className="h-8 w-8 text-iw-amber" />,
};

export function AIContextSection() {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Structured context layer for AI grounding. When AI agents (including Claude via MCP) 
        read these files, they have complete Glowing Pancake context before responding.
      </p>

      {/* Context Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {AI_CONTEXT_FILES.map((file) => (
          <Card key={file.title} className="p-5 card-glow">
            <div className="flex items-start gap-4">
              <div className="shrink-0">{iconMap[file.icon]}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{file.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{file.desc}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {file.method}
                  </Badge>
                  <a
                    href={file.endpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-iw-cyan hover:underline flex items-center gap-1 truncate"
                  >
                    {file.endpoint.replace("https://", "")}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Usage Instructions */}
      <Card className="p-6 bg-iw-deep/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-iw-cyan">💡</span>
          How AI Agents Use This Context
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Discovery:</strong> AI agents first check{" "}
            <code className="px-1.5 py-0.5 bg-background rounded text-iw-cyan font-mono text-xs">
              /.well-known/ai-context.json
            </code>{" "}
            to find available context endpoints.
          </p>
          <p>
            <strong className="text-foreground">2. Grounding:</strong> Before responding about Glowing Pancake, 
            AI reads <code className="px-1.5 py-0.5 bg-background rounded text-iw-cyan font-mono text-xs">/llm.txt</code> 
            {" "}to understand identity, architecture, current state, and constraints.
          </p>
          <p>
            <strong className="text-foreground">3. Structured Data:</strong> For programmatic access, 
            AI consumes <code className="px-1.5 py-0.5 bg-background rounded text-iw-cyan font-mono text-xs">/context.json</code> 
            {" "}with full architecture tree, agent definitions, and infrastructure map.
          </p>
          <p>
            <strong className="text-foreground">4. MCP Connection:</strong> The n8n MCP endpoint enables 
            AI to orchestrate across business tools through Glowing Pancake.
          </p>
        </div>
      </Card>

      {/* Key Principles */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "No Hallucination", desc: "AI has canonical source of truth" },
          { label: "Versioned Context", desc: "Every update is timestamped" },
          { label: "MCP-Ready", desc: "Direct AI tool integration" },
        ].map((principle) => (
          <Card key={principle.label} className="p-4 text-center">
            <div className="font-semibold text-iw-cyan mb-1">{principle.label}</div>
            <div className="text-xs text-muted-foreground">{principle.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
