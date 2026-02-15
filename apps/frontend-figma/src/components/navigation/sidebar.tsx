import { useState } from "react";
import {
  LayoutDashboard, Building2, GitBranch, CheckSquare, FileText,
  Calendar, BarChart3, Users, Target, DollarSign, TrendingUp,
  ClipboardList, Activity, Settings, ShieldCheck, UserCog, Landmark,
  ChevronsUpDown, BookOpen, MessageSquare, Brain, AlertTriangle,
  Zap, StickyNote, Home, Briefcase, Factory, LogOut, Plug, Bot,
  CreditCard, User, Blocks, RefreshCw, ChevronDown, ChevronRight,
  Phone, FileSignature, PieChart, FormInput, Share2, Mail,
  FileEdit, Search as SearchIcon, Image, Globe, Palette, Shield
} from "lucide-react";
import { type CTXEnum, type L1Module } from "../spine/types";
import { useSpine } from "../spine/spine-client";
import { useGoalsSafe } from "../goal-framework/goal-context";
import { Logo, LogoMark } from "../ui/logo";

interface SidebarProps {
  activeModule: L1Module;
  onModuleChange: (module: L1Module) => void;
  activeCtx: CTXEnum;
  onCtxChange: (ctx: CTXEnum) => void;
  modules: L1Module[];
  darkMode: boolean;
  collapsed: boolean;
  onToggleDarkMode: () => void;
  onToggleCollapse: () => void;
  onOpenCommandPalette: () => void;
  onOpenIntelligence: () => void;
}

const MODULE_ICONS: Record<string, any> = {
  "Home": Home, "Projects": Briefcase, "Accounts": Building2,
  "Contacts": Users, "Meetings": MessageSquare, "Docs": FileText,
  "Tasks": CheckSquare, "Calendar": Calendar, "Notes": StickyNote,
  "Knowledge Space": Brain, "Team": Users, "Pipeline": DollarSign,
  "Risks": AlertTriangle, "Expansion": TrendingUp, "Analytics": BarChart3,
  "Integrations": Plug, "AI Chat": Bot, "Settings": Settings,
  "Subscriptions": CreditCard, "Profile": User,
  "Campaigns": Target, "Workflows": RefreshCw, "Deals": Landmark,
  "Forecasting": Activity,
  // New modules
  "Activities": Phone, "Quotes": FileSignature,
  "Attribution": PieChart, "Forms": FormInput, "Social": Share2,
  "Email Studio": Mail, "Blog": FileEdit, "SEO": SearchIcon,
  "Media Library": Image, "Pages": Globe, "Theme": Palette,
  "Website": Globe, "RBAC": Shield, "Approvals": ShieldCheck,
  "Admin": UserCog,
};

const CTX_CONFIG: Record<CTXEnum, { label: string; icon: string; color: string }> = {
  CTX_CS: { label: "Customer Success", icon: "💚", color: "bg-emerald-600" },
  CTX_SALES: { label: "Sales Operations", icon: "🎯", color: "bg-sky-600" },
  CTX_SUPPORT: { label: "Customer Support", icon: "🎧", color: "bg-indigo-600" },
  CTX_PM: { label: "Project Management", icon: "📁", color: "bg-violet-600" },
  CTX_MARKETING: { label: "Marketing", icon: "📣", color: "bg-pink-600" },
  CTX_BIZOPS: { label: "Business Operations", icon: "🌏", color: "bg-[#0C1222]" },
  CTX_TECH: { label: "Engineering", icon: "💻", color: "bg-slate-600" },
  CTX_HR: { label: "People & Culture", icon: "👥", color: "bg-amber-600" },
  CTX_FINANCE: { label: "Finance", icon: "💰", color: "bg-teal-600" },
  CTX_LEGAL: { label: "Legal", icon: "⚖️", color: "bg-gray-600" },
};

const SYSTEM_MODULES: L1Module[] = ["Integrations", "AI Chat", "Settings", "Subscriptions", "Profile"];

export function Sidebar({
  activeModule, onModuleChange, activeCtx, onCtxChange,
  modules, collapsed, onOpenCommandPalette, onOpenIntelligence,
}: SidebarProps) {
  const [ctxDropdownOpen, setCtxDropdownOpen] = useState(false);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [connectExpanded, setConnectExpanded] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(false);
  const spine = useSpine();
  const goalsCtx = useGoalsSafe();
  const ctxInfo = CTX_CONFIG[activeCtx];

  const NavItem = ({ mod, icon: Icon }: { mod: L1Module; icon: any }) => {
    const isActive = activeModule === mod;
    return (
      <button
        onClick={() => onModuleChange(mod)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all ${
          isActive ? "bg-sky-500/20 text-sky-300 font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        } ${collapsed ? "justify-center px-0" : ""}`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-sky-400" : ""}`} />
        {!collapsed && <span className="truncate">{mod}</span>}
      </button>
    );
  };

  const SectionHeader = ({ label, expanded, onToggle }: { label: string; expanded: boolean; onToggle: () => void }) => {
    if (collapsed) return null;
    return (
      <button onClick={onToggle} className="flex items-center justify-between w-full px-2.5 pt-4 pb-1 group">
        <span className="text-[9px] text-slate-500 uppercase tracking-[0.12em] font-bold">{label}</span>
        {expanded ? <ChevronDown className="w-2.5 h-2.5 text-slate-600" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-600" />}
      </button>
    );
  };

  return (
    <div className={`h-full flex flex-col border-r border-[#1E293B] bg-[#0C1222] transition-all duration-300 ${collapsed ? "w-[56px]" : "w-[220px]"}`}>
      {/* Brand */}
      <div className={`flex items-center border-b border-[#1E293B] shrink-0 ${collapsed ? "justify-center py-2.5" : "px-3 py-2.5 gap-2"}`}>
        {collapsed ? <LogoMark size={24} /> : (
          <>
            <Logo width={24} />
            <span className="text-sm font-bold tracking-tight text-white">
              Integrate<span className="text-sky-400">Wise</span>
            </span>
          </>
        )}
      </div>

      {/* Context Switcher */}
      <div className="p-2 border-b border-[#1E293B] shrink-0">
        <div className="relative">
          <button
            onClick={() => !collapsed && setCtxDropdownOpen(!ctxDropdownOpen)}
            className="w-full flex items-center gap-2 hover:bg-white/5 rounded-md p-1.5 transition-colors"
          >
            <div className={`w-7 h-7 rounded-lg ${ctxInfo.color} flex items-center justify-center flex-shrink-0 text-white text-xs shadow-sm`}>
              {ctxInfo.icon}
            </div>
            {!collapsed && (
              <>
                <div className="overflow-hidden flex-1 text-left">
                  <div className="text-xs font-semibold truncate text-slate-200">{ctxInfo.label}</div>
                  <div className="text-[8px] text-slate-500 truncate uppercase tracking-tighter flex items-center gap-0.5">
                    {goalsCtx?.orgType === "PRODUCT" ? <Factory className="w-2 h-2" /> : <Briefcase className="w-2 h-2" />}
                    {goalsCtx?.orgType || "PRODUCT"} Org
                  </div>
                </div>
                <ChevronsUpDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
              </>
            )}
          </button>
          {ctxDropdownOpen && !collapsed && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCtxDropdownOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#131B2E] border border-[#1E293B] rounded-lg shadow-xl overflow-hidden py-1 max-h-[300px] overflow-y-auto">
                {(Object.keys(CTX_CONFIG) as CTXEnum[]).map((key) => {
                  const cfg = CTX_CONFIG[key];
                  return (
                    <button
                      key={key}
                      onClick={() => { onCtxChange(key); setCtxDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5 transition-colors ${key === activeCtx ? "bg-sky-500/10" : ""}`}
                    >
                      <span className="text-sm">{cfg.icon}</span>
                      <span className="text-xs font-medium text-slate-300">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-none">
        {/* Workspace Modules */}
        <SectionHeader label="Workspace" expanded={workspaceExpanded} onToggle={() => setWorkspaceExpanded(!workspaceExpanded)} />
        {(workspaceExpanded || collapsed) && (
          <nav className="space-y-0.5">
            {modules.filter(m => !SYSTEM_MODULES.includes(m)).map((mod) => (
              <NavItem key={mod} mod={mod} icon={MODULE_ICONS[mod] || Home} />
            ))}
          </nav>
        )}

        {/* Connect & Intelligence */}
        <SectionHeader label="Connect" expanded={connectExpanded} onToggle={() => setConnectExpanded(!connectExpanded)} />
        {(connectExpanded || collapsed) && (
          <nav className="space-y-0.5">
            <NavItem mod="Integrations" icon={Plug} />
            <NavItem mod="AI Chat" icon={Bot} />
          </nav>
        )}

        {/* System */}
        <SectionHeader label="System" expanded={systemExpanded} onToggle={() => setSystemExpanded(!systemExpanded)} />
        {(systemExpanded || collapsed) && (
          <nav className="space-y-0.5">
            <NavItem mod="Settings" icon={Settings} />
            <NavItem mod="Subscriptions" icon={CreditCard} />
            <NavItem mod="Profile" icon={User} />
          </nav>
        )}
      </div>

      {/* Bottom */}
      <div className="p-2 border-t border-[#1E293B] space-y-1 shrink-0">
        <button
          onClick={onOpenIntelligence}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] text-sky-400 font-semibold bg-sky-500/10 hover:bg-sky-500/20 transition-all ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Zap className="w-3.5 h-3.5" />
          {!collapsed && <span>Intelligence ⌘J</span>}
        </button>

        <button
          onClick={() => onModuleChange("Profile")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
            {spine.userName?.charAt(0) || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 text-left">
              <div className="text-[11px] font-semibold truncate text-slate-200">{spine.userName}</div>
              <div className="text-[9px] text-slate-500 truncate uppercase">{spine.role}</div>
            </div>
          )}
        </button>

        <button
          onClick={() => { document.documentElement.classList.remove("dark"); window.location.hash = ""; }}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1 rounded-lg text-[10px] text-slate-500 hover:text-slate-300 transition-all ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="w-3 h-3" />
          {!collapsed && <span>Back to Site</span>}
        </button>
      </div>
    </div>
  );
}
