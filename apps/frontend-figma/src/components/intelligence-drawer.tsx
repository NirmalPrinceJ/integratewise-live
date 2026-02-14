import { useState } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Brain,
  Network,
  Shield,
  Bot,
  FileSearch,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type ModuleType = "ops" | "website" | "marketing" | "sales";

interface IntelligenceDrawerProps {
  isOpen: boolean;
  activeModule: ModuleType;
  onClose: () => void;
}

type IntelTab = "spine" | "hub" | "agents" | "evidence";

const moduleContext: Record<ModuleType, string> = {
  ops: "Business Operations",
  website: "Website Management",
  marketing: "Marketing",
  sales: "Sales",
};

const agents = [
  { id: "forecast", name: "Revenue Forecasting", icon: "📊", status: "active", lastRun: "5 min ago", successRate: 94, actionsThisWeek: 12, modules: ["ops", "sales"] },
  { id: "churn", name: "ChurnShield", icon: "🔍", status: "active", lastRun: "15 min ago", successRate: 89, actionsThisWeek: 8, modules: ["ops", "sales", "marketing"] },
  { id: "quality", name: "Data Quality Auditor", icon: "🔬", status: "learning", lastRun: "1h ago", successRate: 78, actionsThisWeek: 24, modules: ["ops"] },
  { id: "nba", name: "Next Best Action", icon: "🎯", status: "active", lastRun: "2 min ago", successRate: 91, actionsThisWeek: 18, modules: ["sales", "marketing"] },
  { id: "sentiment", name: "Email Sentiment", icon: "📧", status: "active", lastRun: "30 min ago", successRate: 86, actionsThisWeek: 45, modules: ["sales", "marketing"] },
  { id: "anomaly", name: "Anomaly Detector", icon: "🔔", status: "attention", lastRun: "2h ago", successRate: 72, actionsThisWeek: 3, modules: ["ops", "website"] },
  { id: "architect", name: "ArchitectIQ", icon: "🏗️", status: "active", lastRun: "45 min ago", successRate: 88, actionsThisWeek: 6, modules: ["website"] },
  { id: "template", name: "TemplateForge", icon: "✨", status: "active", lastRun: "10 min ago", successRate: 93, actionsThisWeek: 15, modules: ["website", "marketing"] },
  { id: "success", name: "SuccessPilot", icon: "🧭", status: "active", lastRun: "8 min ago", successRate: 90, actionsThisWeek: 22, modules: ["sales"] },
  { id: "dealdesk", name: "DealDesk AI", icon: "💼", status: "paused", lastRun: "3d ago", successRate: 85, actionsThisWeek: 0, modules: ["sales"] },
];

const spineNodes = [
  { id: "n1", type: "account", label: "TechServe India", source: "Salesforce", connections: 12, lastUpdate: "2 min ago" },
  { id: "n2", type: "contact", label: "Ravi Sharma (CTO)", source: "CRM + Email", connections: 8, lastUpdate: "15 min ago" },
  { id: "n3", type: "transaction", label: "Invoice #INV-2026-042", source: "Stripe", connections: 3, lastUpdate: "1h ago" },
  { id: "n4", type: "activity", label: "QBR Meeting Notes", source: "Slack + Zoom", connections: 5, lastUpdate: "30 min ago" },
  { id: "n5", type: "document", label: "SOW v3.2", source: "Google Drive", connections: 4, lastUpdate: "2h ago" },
  { id: "n6", type: "task", label: "Renewal Review", source: "Asana", connections: 2, lastUpdate: "45 min ago" },
];

const nodeColors: Record<string, string> = {
  account: "#0066FF",
  contact: "#00C853",
  transaction: "#FF9800",
  activity: "#7C4DFF",
  document: "#FF4081",
  task: "#BDBDBD",
};

const evidenceChain = [
  { id: 1, type: "source", label: "Salesforce: Account Record", confidence: 99, time: "Real-time sync" },
  { id: 2, type: "source", label: "Stripe: Payment History", confidence: 99, time: "Hourly sync" },
  { id: 3, type: "source", label: "Slack: #techserve-support", confidence: 95, time: "Streaming" },
  { id: 4, type: "transform", label: "Spine: Data Normalization", confidence: 97, time: "Processed 2 min ago" },
  { id: 5, type: "ai", label: "ChurnShield: Risk Assessment", confidence: 82, time: "Model v3.2, Claude 3" },
  { id: 6, type: "insight", label: "Account Health: 78/100 (At-Risk)", confidence: 82, time: "Generated 1 min ago" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(0, 200, 83, 0.15)", text: "#00C853" },
  learning: { bg: "rgba(0, 102, 255, 0.15)", text: "#448AFF" },
  attention: { bg: "rgba(255, 152, 0, 0.15)", text: "#FFAB40" },
  paused: { bg: "rgba(189, 189, 189, 0.15)", text: "#BDBDBD" },
};

export function IntelligenceDrawer({ isOpen, activeModule, onClose }: IntelligenceDrawerProps) {
  const [activeTab, setActiveTab] = useState<IntelTab>("spine");
  const [expanded, setExpanded] = useState(false);

  const relevantAgents = agents.filter((a) => a.modules.includes(activeModule));

  if (!isOpen) return null;

  const tabs: { id: IntelTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "spine", label: "Spine", icon: Network },
    { id: "hub", label: "Hub", icon: Shield },
    { id: "agents", label: "Agents", icon: Bot },
    { id: "evidence", label: "Evidence", icon: FileSearch },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.65)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          expanded ? "h-[90vh]" : "h-[55vh]"
        }`}
        style={{
          backgroundColor: "#0D0D0D",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4" style={{ color: "#00E5FF" }} />
            <span className="text-sm text-white" style={{ fontWeight: 500 }}>
              Intelligence for: {moduleContext[activeModule]}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60" style={{ fontWeight: 500 }}>
              L2 Overlay
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/60 transition-colors"
            >
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const tabColors: Record<IntelTab, string> = {
              spine: "#00E5FF",
              hub: "#D500F9",
              agents: "#76FF03",
              evidence: "#FFAB40",
            };
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? `${tabColors[tab.id]}20` : "transparent",
                  color: activeTab === tab.id ? tabColors[tab.id] : undefined,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: expanded ? "calc(90vh - 120px)" : "calc(55vh - 120px)" }}>
          {activeTab === "spine" && <SpineView />}
          {activeTab === "hub" && <HubView />}
          {activeTab === "agents" && <AgentsView agents={relevantAgents} />}
          {activeTab === "evidence" && <EvidenceView />}
        </div>
      </div>
    </>
  );
}

function SpineView() {
  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50 mb-2">Unified Data Graph - Entity relationships across connected systems</div>

      {/* Visual Graph Representation */}
      <div className="relative rounded-lg border border-white/10 p-6 min-h-[200px] overflow-hidden" style={{ background: "radial-gradient(circle at center, rgba(0, 229, 255, 0.05), transparent 70%)" }}>
        {/* Simulated graph nodes */}
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {spineNodes.map((node, i) => (
            <div
              key={node.id}
              className="relative group cursor-pointer"
              style={{
                transform: `translate(${Math.sin(i * 1.2) * 20}px, ${Math.cos(i * 1.2) * 15}px)`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[10px] border-2 transition-all hover:scale-110"
                style={{
                  borderColor: nodeColors[node.type],
                  backgroundColor: `${nodeColors[node.type]}20`,
                  boxShadow: `0 0 20px ${nodeColors[node.type]}30`,
                  fontWeight: 500,
                }}
              >
                <div className="text-center">
                  <div className="text-xs">{node.type === "account" ? "🔵" : node.type === "contact" ? "🟢" : node.type === "transaction" ? "🟡" : node.type === "activity" ? "🟣" : node.type === "document" ? "📄" : "📋"}</div>
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/40">
                {node.label.split(" ")[0]}
              </div>
              {/* Connection count */}
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center text-white"
                style={{ backgroundColor: nodeColors[node.type], fontWeight: 600 }}
              >
                {node.connections}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node List */}
      <div className="space-y-2">
        {spineNodes.map((node) => (
          <div key={node.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors[node.type] }} />
            <div className="flex-1">
              <div className="text-sm text-white" style={{ fontWeight: 500 }}>{node.label}</div>
              <div className="text-[10px] text-white/40">{node.type} &middot; {node.source}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/40">{node.connections} connections</div>
              <div className="text-[10px] text-white/30">{node.lastUpdate}</div>
            </div>
            <ChevronRight className="w-3 h-3 text-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HubView() {
  const permissions = [
    { user: "Arun K.", role: "Admin", accounts: "Full", contacts: "Full", revenue: "Full", docs: "Full" },
    { user: "Priya S.", role: "Ops Manager", accounts: "Edit", contacts: "Edit", revenue: "View", docs: "Edit" },
    { user: "Rajesh M.", role: "Analyst", accounts: "View", contacts: "View", revenue: "View", docs: "View" },
    { user: "Anjali P.", role: "CS Lead", accounts: "Edit", contacts: "Full", revenue: "View", docs: "Edit" },
    { user: "Vikram R.", role: "Viewer", accounts: "View", contacts: "View", revenue: "None", docs: "View" },
  ];

  const accessColors: Record<string, string> = {
    Full: "#00C853",
    Edit: "#0066FF",
    View: "#FF9800",
    None: "#616161",
  };

  const auditLog = [
    { user: "Arun K.", action: "Read", entity: "TechServe Revenue", time: "2 min ago" },
    { user: "Priya S.", action: "Write", entity: "CloudBridge Account", time: "15 min ago" },
    { user: "Rajesh M.", action: "Export", entity: "Q4 Revenue Report", time: "1h ago" },
    { user: "System", action: "Sync", entity: "Salesforce → Spine", time: "2h ago" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50 mb-2">Hub Router - Data routing, RBAC, and governance</div>

      {/* Permission Matrix */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" style={{ color: "#D500F9" }} />
          <span className="text-xs text-white" style={{ fontWeight: 500 }}>Permission Matrix</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>User</th>
                <th className="text-left px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>Role</th>
                <th className="text-center px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>Accounts</th>
                <th className="text-center px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>Contacts</th>
                <th className="text-center px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>Revenue</th>
                <th className="text-center px-3 py-2 text-white/40" style={{ fontWeight: 500 }}>Docs</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p.user} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2 text-white" style={{ fontWeight: 500 }}>{p.user}</td>
                  <td className="px-3 py-2 text-white/60">{p.role}</td>
                  {[p.accounts, p.contacts, p.revenue, p.docs].map((level, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${accessColors[level]}20`,
                          color: accessColors[level],
                          fontWeight: 500,
                        }}
                      >
                        {level}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Residency */}
      <div className="rounded-lg border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(213, 0, 249, 0.15)", color: "#D500F9", fontWeight: 500 }}>
            APAC Data Residency
          </span>
          <span className="text-[10px] text-white/30">Region: India (Mumbai)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["GDPR", "SOC 2", "ISO 27001"].map((cert) => (
            <div key={cert} className="flex items-center gap-1.5 p-2 rounded bg-white/5 text-[10px] text-white/60">
              <CheckCircle className="w-3 h-3 text-[#00C853]" />
              {cert}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-lg border border-white/10">
        <div className="px-4 py-2 border-b border-white/10 text-xs text-white" style={{ fontWeight: 500 }}>
          Recent Audit Trail
        </div>
        <div className="space-y-0">
          {auditLog.map((log, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-white/5 last:border-0">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-white/60" style={{ fontWeight: 600 }}>
                {log.user.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <span className="text-xs text-white/80">{log.user}</span>
                <span className="text-xs text-white/40"> {log.action} </span>
                <span className="text-xs text-white/60">{log.entity}</span>
              </div>
              <span className="text-[10px] text-white/30">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentsView({ agents: relevantAgents }: { agents: typeof agents }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50 mb-2">AI Agents - Context-relevant agents for this domain</div>

      {/* BYOM Banner */}
      <div className="rounded-lg border border-white/10 p-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, rgba(118, 255, 3, 0.05), rgba(0, 229, 255, 0.05))" }}>
        <Bot className="w-5 h-5" style={{ color: "#76FF03" }} />
        <div className="flex-1">
          <div className="text-xs text-white" style={{ fontWeight: 500 }}>Bring Your Own Model (BYOM)</div>
          <div className="text-[10px] text-white/40">Connect OpenAI, Anthropic, or self-hosted models</div>
        </div>
        <button className="text-[10px] px-2 py-1 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
          Configure
        </button>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relevantAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border border-white/10 p-3 hover:border-white/20 transition-all cursor-pointer"
            style={{
              boxShadow: agent.status === "active" ? `0 0 12px ${statusColors[agent.status].text}10` : "none",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agent.icon}</span>
                <div>
                  <div className="text-xs text-white" style={{ fontWeight: 500 }}>{agent.name}</div>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full capitalize"
                    style={{
                      backgroundColor: statusColors[agent.status].bg,
                      color: statusColors[agent.status].text,
                      fontWeight: 500,
                    }}
                  >
                    {agent.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <div className="text-[10px] text-white/30">Success</div>
                <div className="text-xs text-white" style={{ fontWeight: 500 }}>{agent.successRate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-white/30">Actions</div>
                <div className="text-xs text-white" style={{ fontWeight: 500 }}>{agent.actionsThisWeek}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/30">Last Run</div>
                <div className="text-[10px] text-white/50">{agent.lastRun}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceView() {
  const typeIcons: Record<string, { icon: string; color: string }> = {
    source: { icon: "🔌", color: "#00E5FF" },
    transform: { icon: "⚙️", color: "#D500F9" },
    ai: { icon: "🧠", color: "#76FF03" },
    insight: { icon: "📊", color: "#FFAB40" },
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50 mb-2">Evidence & Provenance - Trace any insight back to its source</div>

      <div className="rounded-lg border border-white/10 p-4">
        <div className="text-xs text-white/60 mb-3">
          Provenance chain for: <span className="text-white" style={{ fontWeight: 500 }}>"TechServe Account Health: 78/100"</span>
        </div>

        {/* Chain visualization */}
        <div className="space-y-0">
          {evidenceChain.map((step, i) => {
            const cfg = typeIcons[step.type];
            return (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {i > 0 && (
                  <div className="absolute left-4 -top-2 w-px h-2" style={{ backgroundColor: `${cfg.color}40` }} />
                )}

                <div className="flex items-start gap-3 py-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-white" style={{ fontWeight: 500 }}>{step.label}</div>
                    <div className="text-[10px] text-white/40">{step.time}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: step.confidence >= 90 ? "rgba(0, 200, 83, 0.15)" : step.confidence >= 80 ? "rgba(255, 152, 0, 0.15)" : "rgba(244, 67, 54, 0.15)",
                        color: step.confidence >= 90 ? "#69F0AE" : step.confidence >= 80 ? "#FFAB40" : "#FF5252",
                        fontWeight: 500,
                      }}
                    >
                      {step.confidence}% confidence
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {i < evidenceChain.length - 1 && (
                  <div className="flex items-center justify-center py-0.5">
                    <div className="w-px h-3" style={{ backgroundColor: `${typeIcons[evidenceChain[i + 1].type].color}30` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors">
          <ExternalLink className="w-3 h-3" /> Export Chain
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors">
          <AlertCircle className="w-3 h-3" /> Flag Incorrect
        </button>
      </div>
    </div>
  );
}