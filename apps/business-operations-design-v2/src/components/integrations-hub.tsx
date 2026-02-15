import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plug, Check, AlertCircle, RefreshCw, ArrowRight,
  Search, Settings, Clock, Zap, ExternalLink, Plus, X, ChevronRight,
  Database, Brain, Bot, Layers, Activity, Shield
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Integration {
  id: string;
  name: string;
  logo: string;
  category: string;
  status: "connected" | "available" | "error" | "syncing";
  lastSync?: string;
  entitiesSynced?: number;
  description: string;
  color: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "sf", name: "Salesforce", logo: "☁️", category: "CRM", status: "connected", lastSync: "2 min ago", entitiesSynced: 12847, description: "Accounts, Contacts, Opportunities, Activities", color: "bg-blue-500" },
  { id: "hs", name: "HubSpot", logo: "🧡", category: "CRM", status: "connected", lastSync: "5 min ago", entitiesSynced: 8432, description: "Contacts, Deals, Companies, Marketing Events", color: "bg-orange-500" },
  { id: "sl", name: "Slack", logo: "💬", category: "Communication", status: "connected", lastSync: "Real-time", entitiesSynced: 3241, description: "Messages, Channels, User Activity, Threads", color: "bg-purple-500" },
  { id: "zd", name: "Zendesk", logo: "🎧", category: "Support", status: "connected", lastSync: "8 min ago", entitiesSynced: 5672, description: "Tickets, Agents, Customer Satisfaction, SLA", color: "bg-emerald-500" },
  { id: "st", name: "Stripe", logo: "💳", category: "Billing", status: "connected", lastSync: "1 min ago", entitiesSynced: 2891, description: "Subscriptions, Invoices, Payments, MRR", color: "bg-indigo-500" },
  { id: "jr", name: "Jira", logo: "🔵", category: "Engineering", status: "syncing", lastSync: "Syncing...", entitiesSynced: 4123, description: "Issues, Sprints, Epics, Story Points", color: "bg-blue-600" },
  { id: "mx", name: "Mixpanel", logo: "📊", category: "Analytics", status: "connected", lastSync: "15 min ago", entitiesSynced: 1928, description: "Events, Funnels, Cohorts, User Segments", color: "bg-violet-500" },
  { id: "gm", name: "Gmail", logo: "📧", category: "Communication", status: "error", lastSync: "2h ago (failed)", entitiesSynced: 892, description: "Email threads, Contacts, Calendar invites", color: "bg-red-500" },
  { id: "nt", name: "Notion", logo: "📝", category: "Knowledge", status: "available", description: "Pages, Databases, Team Wikis, Meeting Notes", color: "bg-gray-700" },
  { id: "as", name: "Asana", logo: "🎯", category: "Project Mgmt", status: "available", description: "Projects, Tasks, Milestones, Team Workload", color: "bg-rose-500" },
  { id: "gh", name: "GitHub", logo: "🐙", category: "Engineering", status: "available", description: "Repos, PRs, Issues, Deployment Events", color: "bg-gray-800" },
  { id: "in", name: "Intercom", logo: "💙", category: "Support", status: "available", description: "Conversations, Users, Product Tours, Articles", color: "bg-blue-400" },
  { id: "ga", name: "Google Analytics", logo: "📈", category: "Analytics", status: "available", description: "Sessions, Conversions, User Journeys, Events", color: "bg-amber-500" },
  { id: "zr", name: "Zoom", logo: "📹", category: "Communication", status: "available", description: "Meetings, Recordings, Participants, Transcripts", color: "bg-blue-500" },
];

const STATUS_CONFIG = {
  connected: { label: "Connected", color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50" },
  syncing: { label: "Syncing", color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50" },
  error: { label: "Error", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
  available: { label: "Available", color: "bg-gray-300", textColor: "text-gray-600", bgColor: "bg-gray-50" },
};

export function IntegrationsHub() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "connected" | "available">("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filtered = INTEGRATIONS.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "connected" ? ["connected", "syncing", "error"].includes(i.status) : i.status === "available");
    return matchSearch && matchFilter;
  });

  const connectedCount = INTEGRATIONS.filter(i => i.status !== "available").length;
  const totalSynced = INTEGRATIONS.reduce((s, i) => s + (i.entitiesSynced || 0), 0);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations & Data Sync</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect your tools. IntegrateWise unifies them into a single intelligent operating system.</p>
        </div>

        {/* Architecture Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border-none shadow-sm bg-gradient-to-br from-[#3F5185] to-[#1E2A4A] text-white overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 relative">
              <Database className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-white/80" />
                <h3 className="text-sm font-bold">Truth (Structured SSOT)</h3>
              </div>
              <p className="text-[10px] text-white/60 mb-3">Product catalog, customer data, order history, employee records — canonical entities with provenance.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold">Healthy</span>
                </div>
                <span className="text-[10px] text-white/40">{(totalSynced / 1000).toFixed(1)}K entities</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-[#7B5EA7] to-[#5A3F8A] text-white overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 relative">
              <Layers className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-white/80" />
                <h3 className="text-sm font-bold">Context (Evidence Artifacts)</h3>
              </div>
              <p className="text-[10px] text-white/60 mb-3">Emails, docs, chats, meeting notes — semantic evidence with relationship mapping and situational awareness.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold">10 Contexts Active</span>
                </div>
                <span className="text-[10px] text-white/40">Dual-lens</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-[#F54476] to-[#C53560] text-white overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 relative">
              <Bot className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-white/80" />
                <h3 className="text-sm font-bold">IQ Hub (AI Session Memory)</h3>
              </div>
              <p className="text-[10px] text-white/60 mb-3">AI conversations, human corrections, temporal context, and model tuning — all feeding the intelligence loop.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold">5 Insights Ready</span>
                </div>
                <span className="text-[10px] text-white/40">Governance Gated</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accelerators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Sync All", icon: RefreshCw, desc: "Force re-sync all sources" },
            { label: "Schema Audit", icon: Shield, desc: "Check for drift" },
            { label: "Data Health", icon: Activity, desc: "Full diagnostics" },
            { label: "Add Source", icon: Plus, desc: "Connect new tool" },
          ].map((accel, i) => (
            <button key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all text-left group">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                <accel.icon className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <div className="text-xs font-semibold">{accel.label}</div>
                <div className="text-[9px] text-muted-foreground">{accel.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Plug className="w-5 h-5 text-emerald-600" /></div>
              <div><div className="text-2xl font-bold">{connectedCount}</div><div className="text-[10px] text-muted-foreground uppercase font-bold">Connected</div></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-blue-600" /></div>
              <div><div className="text-2xl font-bold">{(totalSynced / 1000).toFixed(1)}K</div><div className="text-[10px] text-muted-foreground uppercase font-bold">Entities Synced</div></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div><div className="text-2xl font-bold">&lt; 5 min</div><div className="text-[10px] text-muted-foreground uppercase font-bold">Avg Sync Delay</div></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search integrations..." className="pl-8 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {(["all", "connected", "available"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === f ? "bg-sky-500 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "All" : f === "connected" ? "Connected" : "Available"}
              </button>
            ))}
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(integration => {
            const statusCfg = STATUS_CONFIG[integration.status];
            return (
              <motion.div key={integration.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card
                  className={`border shadow-sm hover:shadow-md transition-all cursor-pointer group ${integration.status === "error" ? "border-red-200" : ""}`}
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${integration.color} flex items-center justify-center text-white text-lg`}>
                          {integration.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{integration.name}</h3>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">{integration.category}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bgColor} ${statusCfg.textColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.color} ${integration.status === "syncing" ? "animate-pulse" : ""}`} />
                        {statusCfg.label}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{integration.description}</p>
                    {integration.status !== "available" ? (
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{integration.lastSync}</span>
                        <span className="font-bold text-foreground">{integration.entitiesSynced?.toLocaleString()} entities</span>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full text-xs h-7 gap-1">
                        <Plus className="w-3 h-3" /> Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Drawer */}
        <AnimatePresence>
          {selectedIntegration && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedIntegration(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl shadow-2xl border w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${selectedIntegration.color} flex items-center justify-center text-white text-xl`}>{selectedIntegration.logo}</div>
                    <div>
                      <h2 className="text-lg font-bold">{selectedIntegration.name}</h2>
                      <span className="text-xs text-muted-foreground">{selectedIntegration.category}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedIntegration(null)} className="p-1 rounded-md hover:bg-secondary"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{selectedIntegration.description}</p>
                {selectedIntegration.status !== "available" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Entities</div>
                      <div className="text-lg font-bold">{selectedIntegration.entitiesSynced?.toLocaleString()}</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Last Sync</div>
                      <div className="text-lg font-bold">{selectedIntegration.lastSync}</div>
                    </div>
                  </div>
                )}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">What gets synced</h4>
                  {selectedIntegration.description.split(", ").map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {selectedIntegration.status === "available" ? (
                    <Button className="flex-1 bg-sky-500 hover:bg-sky-600"><Plus className="w-4 h-4 mr-1" />Connect {selectedIntegration.name}</Button>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1"><RefreshCw className="w-4 h-4 mr-1" />Re-sync</Button>
                      <Button variant="outline" className="flex-1"><Settings className="w-4 h-4 mr-1" />Configure</Button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}