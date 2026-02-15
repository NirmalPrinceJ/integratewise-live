import React, { useState } from "react";
import { 
  Database, 
  BrainCircuit, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  Zap,
  CheckCircle2,
  XCircle,
  LogOut,
  Layers,
  Activity,
  ShieldAlert,
  GitBranch,
  Eye,
  Menu,
  X
} from "lucide-react";
import { LayerAudit } from "./LayerAudit";
// ── Logo: import from single source of truth ──
import { logoSrc } from "./landing/logo";

type TabId = "overview" | "L0" | "L1" | "L2" | "L3";

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabLabels: Record<TabId, string> = {
    overview: "Architecture Overview",
    L0: "L0 Reality Layer",
    L1: "L1 Truth Layer (Spine)",
    L2: "L2 Intelligence Layer",
    L3: "L3 Cognitive Layer"
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1E2A4A] text-white flex flex-col shrink-0
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <img src={logoSrc} alt="IntegrateWise" className="h-10 w-auto brightness-0 invert" />
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          <SidebarItem icon={<Eye size={20} />} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} />
          <div className="pt-3 pb-2 px-4">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Architecture Layers</span>
          </div>
          <SidebarItem icon={<Activity size={20} />} label="L0 Reality" active={activeTab === "L0"} onClick={() => { setActiveTab("L0"); setSidebarOpen(false); }} badge="2" badgeColor="amber" />
          <SidebarItem icon={<Database size={20} />} label="L1 Truth (Spine)" active={activeTab === "L1"} onClick={() => { setActiveTab("L1"); setSidebarOpen(false); }} />
          <SidebarItem icon={<BrainCircuit size={20} />} label="L2 Intelligence" active={activeTab === "L2"} onClick={() => { setActiveTab("L2"); setSidebarOpen(false); }} badge="2" badgeColor="red" />
          <SidebarItem icon={<Settings size={20} />} label="L3 Cognitive" active={activeTab === "L3"} onClick={() => { setActiveTab("L3"); setSidebarOpen(false); }} badge="1" badgeColor="blue" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => window.location.hash = "app"}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70 mb-1"
          >
            <Zap size={20} />
            <span className="font-medium">Open Workspace</span>
          </button>
          <button 
            onClick={() => window.location.hash = ""}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70"
          >
            <LogOut size={20} />
            <span className="font-medium">Back to Site</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 lg:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            <button className="lg:hidden text-slate-600 hover:text-slate-900 shrink-0" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="text-sm lg:text-lg font-black text-[#1E2A4A] truncate uppercase tracking-tight">{tabLabels[activeTab]}</h1>
            {activeTab !== "overview" && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                activeTab === "L0" ? "bg-amber-100 text-amber-700" :
                activeTab === "L1" ? "bg-emerald-100 text-emerald-700" :
                activeTab === "L2" ? "bg-red-100 text-red-700" :
                "bg-[#3F5185]/10 text-[#3F5185]"
              }`}>
                {activeTab === "L1" ? "Clean" : activeTab === "L2" ? "Leaks Detected" : "Monitoring"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search canonical spine..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5185]/20 w-64"
              />
            </div>
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F54476] rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#F54476] flex items-center justify-center text-xs font-bold text-white shadow-lg">JD</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" && <OverviewView />}
            {activeTab === "L0" && <L0View />}
            {activeTab === "L1" && <L1View />}
            {activeTab === "L2" && <L2View />}
            {activeTab === "L3" && <L3View />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Overview View ─── */
function OverviewView() {
  return (
    <>
      {/* Alert Bar */}
      <div className="bg-white border-l-4 border-[#F54476] p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#F54476]/10 text-[#F54476] rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-sm font-black text-[#1E2A4A] uppercase tracking-tight">Data Leak Detection Active</div>
            <p className="text-slate-500 text-xs font-medium">5 leaks detected across L0–L3. 2 critical items require immediate attention.</p>
          </div>
        </div>
        <button className="text-[#3F5185] font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:underline shrink-0">
          Review All <ChevronRight size={14} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard title="Active Integrations" value="12" change="All syncing" icon={<Layers className="text-[#3F5185]" size={20} />} />
        <StatCard title="Spine Integrity" value="94.1%" change="−1.8% (schema drift)" icon={<GitBranch className="text-amber-500" size={20} />} changeColor="text-amber-500" />
        <StatCard title="AI Confidence" value="98.2%" change="+1.2% this week" icon={<BrainCircuit className="text-[#F54476]" size={20} />} />
        <StatCard title="NRR Impact" value="+$420k" change="+15% predicted" icon={<ArrowUpRight className="text-emerald-500" size={20} />} />
      </div>

      {/* Active Spines */}
      <div className="mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Active L0 Source Spines</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: "Salesforce", status: "ok" },
            { name: "HubSpot", status: "warning" },
            { name: "Zendesk", status: "ok" },
            { name: "Stripe", status: "danger" },
            { name: "Slack", status: "ok" },
            { name: "Jira", status: "ok" }
          ].map((platform) => (
            <div key={platform.name} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 group hover:border-[#3F5185] transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#3F5185]/10 group-hover:text-[#3F5185]">
                <Database size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-600">{platform.name}</span>
              <div className={`w-full h-1 rounded-full ${
                platform.status === "danger" ? "bg-red-400" :
                platform.status === "warning" ? "bg-amber-400" :
                "bg-emerald-400"
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Layer Audit */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
        <LayerAudit />
      </div>
    </>
  );
}

/* ─── L0 Reality View ─── */
function L0View() {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500 mb-6">
          The Reality Layer ingests raw events from your connected tools. Leaks at L0 typically involve duplicate events, stale pipelines, or webhook failures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Events / min" value="1,247" change="Normal throughput" icon={<Activity className="text-[#3F5185]" size={20} />} />
          <StatCard title="Dedup Rate" value="99.7%" change="3 collisions caught today" icon={<ShieldCheck className="text-emerald-500" size={20} />} />
          <StatCard title="Pipeline Lag" value="47 min" change="HubSpot backpressure" icon={<ShieldAlert className="text-amber-500" size={20} />} changeColor="text-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] mb-6">Source Pipeline Health</h3>
        <div className="space-y-3">
          {[
            { name: "Salesforce", events: "342/min", lag: "< 1s", status: "ok" },
            { name: "HubSpot", events: "89/min", lag: "47 min", status: "danger" },
            { name: "Zendesk", events: "156/min", lag: "< 2s", status: "ok" },
            { name: "Stripe", events: "421/min", lag: "< 1s", status: "warning" },
            { name: "Slack", events: "198/min", lag: "< 1s", status: "ok" },
            { name: "Jira", events: "41/min", lag: "< 3s", status: "ok" }
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-md cursor-default">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  s.status === "danger" ? "bg-red-500 animate-pulse" :
                  s.status === "warning" ? "bg-amber-500" :
                  "bg-emerald-500"
                }`} />
                <span className="text-sm font-black text-[#1E2A4A] uppercase tracking-tight">{s.name}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-xs text-slate-400 font-bold">{s.events}</span>
                <span className={`text-xs font-black uppercase tracking-widest ${
                  s.status === "danger" ? "text-red-600" :
                  s.status === "warning" ? "text-amber-600" :
                  "text-emerald-600"
                }`}>{s.lag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
        <LayerAudit filterLayer="L0" />
      </div>
    </>
  );
}

/* ─── L1 Truth View ─── */
function L1View() {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500 mb-6">
          The Truth Layer maintains the Canonical Spine — a single source of truth for entities across all tools. When L1 is clean, every downstream layer can trust the data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Spine Entities" value="2,847" change="Accounts, Contacts, Deals" icon={<Database className="text-[#3F5185]" size={20} />} />
          <StatCard title="Cross-Tool Match Rate" value="99.4%" change="+0.3% after last correction" icon={<CheckCircle2 className="text-emerald-500" size={20} />} />
          <StatCard title="Orphan Records" value="12" change="Pending auto-match" icon={<GitBranch className="text-amber-500" size={20} />} changeColor="text-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Spine Resolutions</h3>
        <div className="space-y-3">
          {[
            { entity: "Acme Corp", tools: "Salesforce + Stripe + Zendesk", id: "#STR_992", status: "Matched" },
            { entity: "Prism Cloud", tools: "Salesforce + Zendesk", id: "#STR_1047", status: "Matched" },
            { entity: "NovaTech", tools: "HubSpot + Stripe", id: "#STR_1103", status: "Matched" },
            { entity: "alice@cybernt.io", tools: "Slack + Zendesk", id: "#CON_4421", status: "Orphan" }
          ].map(r => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-md cursor-default">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${r.status === "Orphan" ? "bg-amber-500" : "bg-emerald-500"}`} />
                <div>
                  <span className="text-sm font-black text-[#1E2A4A] uppercase tracking-tight">{r.entity}</span>
                  <span className="text-[10px] text-slate-400 font-bold ml-3 uppercase tracking-widest">{r.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest hidden sm:block">{r.tools}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                  r.status === "Orphan" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
        <LayerAudit filterLayer="L1" />
      </div>
    </>
  );
}

/* ─── L2 Intelligence View ─── */
function L2View() {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500 mb-6">
          The Intelligence Layer applies AI reasoning to Spine data. Leaks here mean the AI is working with stale schemas, mismatched contexts, or deprecated fields.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Edge Corrections" value="847" change="Cumulative library" icon={<BrainCircuit className="text-[#3F5185]" size={20} />} />
          <StatCard title="Schema Health" value="91.3%" change="Stripe drift detected" icon={<ShieldAlert className="text-red-500" size={20} />} changeColor="text-red-500" />
          <StatCard title="Dual-Context Score" value="88%" change="1 mismatch active" icon={<Layers className="text-amber-500" size={20} />} changeColor="text-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-0 overflow-hidden mb-6">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] mb-2">Intelligence Feed — Edge Corrections</h3>
          <p className="text-xs text-slate-400 font-medium italic">AI-proposed corrections awaiting human approval</p>
        </div>
        <div className="divide-y divide-slate-100">
          <IntelligenceRow 
            account="Prism Cloud"
            action="Adjust Renewal Propensity"
            reason="Dual-context mismatch: Vendor CRM marks 'Closed-Won' but client ticket system shows 3 critical P1 bugs unresolved. Renewal confidence inflated."
            confidence="94%"
            layer="L2"
          />
          <IntelligenceRow 
            account="Stellar SaaS"
            action="Fix ARR Calculation"
            reason="Schema drift in Stripe API v2024.11: deprecated 'amount' field returns gross instead of net. Affects ARR by +$12k across 4 accounts."
            confidence="99%"
            layer="L2"
          />
          <IntelligenceRow 
            account="CyberNet"
            action="Flag Attrition Risk"
            reason="L0 activity events ceased for power-user 'Alice Wang' 14 days ago, following a P1 support ticket escalation."
            confidence="87%"
            layer="L2"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
        <LayerAudit filterLayer="L2" />
      </div>
    </>
  );
}

/* ─── L3 Cognitive View ─── */
function L3View() {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500 mb-6">
          The Cognitive Layer translates intelligence into actionable work items — but only after human approval.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Gated Actions" value="23" change="Pending human review" icon={<ShieldCheck className="text-blue-500" size={20} />} />
          <StatCard title="Auto-blocked" value="7" change="This week" icon={<XCircle className="text-red-500" size={20} />} />
          <StatCard title="Approved & Executed" value="156" change="Last 30 days" icon={<CheckCircle2 className="text-emerald-500" size={20} />} />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
        <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] mb-6">Human-in-the-Loop Gate</h3>
        <div className="space-y-4">
          {[
            { 
              action: "Auto-adjust renewal probability for CyberNet (88% → 62%)", 
              trigger: "Champion silence pattern detected across Slack + Zendesk",
              target: "Salesforce Opportunity field",
              risk: "High"
            },
            { 
              action: "Send expansion nudge to Acme Corp stakeholder", 
              trigger: "90% product adoption milestone achieved 3 months early",
              target: "Slack DM to assigned CSM",
              risk: "Medium"
            },
            { 
              action: "Create churn-risk task for NovaTech", 
              trigger: "Payment failed twice + support tickets trending up",
              target: "Jira board + Salesforce task",
              risk: "Low"
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <span className="text-base font-black text-[#1E2A4A] tracking-tight">{item.action}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shrink-0 ml-4 ${
                  item.risk === "High" ? "bg-red-100 text-red-700 shadow-[0_0_10px_rgba(239,68,68,0.2)]" :
                  item.risk === "Medium" ? "bg-amber-100 text-amber-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>{item.risk} Risk</span>
              </div>
              <div className="text-xs text-slate-500 mb-2 font-medium"><span className="font-black text-slate-400 uppercase tracking-widest mr-2">Trigger:</span> {item.trigger}</div>
              <div className="text-xs text-slate-500 mb-6 font-medium"><span className="font-black text-slate-400 uppercase tracking-widest mr-2">Target:</span> {item.target}</div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#F54476] hover:bg-[#E03A66] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#F54476]/20 active:scale-95">
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 transition-all active:scale-95">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
        <LayerAudit filterLayer="L3" />
      </div>
    </>
  );
}

/* ─── Shared Components ─── */

function SidebarItem({ icon, label, active, onClick, badge, badgeColor }: { 
  icon: any; label: string; active?: boolean; onClick: () => void; badge?: string; badgeColor?: string 
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
        active ? "bg-white text-[#1E2A4A] shadow-xl shadow-black/20 scale-[1.02]" : "text-white/50 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-4">{icon}<span>{label}</span></span>
      {badge && !active && (
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
          badgeColor === "red" ? "bg-[#F54476] text-white shadow-lg shadow-[#F54476]/30" :
          badgeColor === "amber" ? "bg-amber-500 text-white" :
          badgeColor === "blue" ? "bg-[#3F5185] text-white" :
          "bg-white/10 text-white"
        }`}>{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, change, icon, changeColor }: { 
  title: string; value: string; change: string; icon: React.ReactNode; changeColor?: string 
}) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm transition-all hover:shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:bg-[#3F5185] group-hover:text-white group-hover:rotate-6 shadow-inner">{icon}</div>
      </div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{title}</div>
      <div className="text-2xl font-black text-[#1E2A4A] tracking-tighter mb-1">{value}</div>
      <div className={`text-[10px] font-black uppercase tracking-widest ${changeColor || "text-emerald-500"}`}>{change}</div>
    </div>
  );
}

function IntelligenceRow({ account, action, reason, confidence, layer }: { 
  account: string; action: string; reason: string; confidence: string; layer: string 
}) {
  return (
    <div className="p-6 md:p-8 hover:bg-slate-50 transition-colors group cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div className="w-14 h-14 bg-slate-100 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#3F5185]/10 group-hover:text-[#3F5185] transition-colors">
            <Zap size={22} className="text-[#3F5185]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-black text-lg text-[#1E2A4A] tracking-tight uppercase">{account}</span>
              <span className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full font-black uppercase tracking-widest">{layer}</span>
            </div>
            <div className="text-xs font-black text-[#F54476] mb-3 uppercase tracking-widest">{action}</div>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-medium italic">"{reason}"</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4 shrink-0 ml-6">
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Confidence</div>
            <div className="text-xl font-black text-[#1E2A4A] tracking-tighter">{confidence}</div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-emerald-500/10 active:scale-90">
              <CheckCircle2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-red-500/10 active:scale-90">
              <XCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
