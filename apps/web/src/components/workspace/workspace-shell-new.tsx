/**
 * Workspace Shell (NEW ARCHITECTURE)
 * 
 * 2 Views: Personal | Work
 * - Personal: Same for everyone (tasks, calendar, notes)
 * - Work: Domain-specific content (role-based)
 * - Team: IGNORED FOR NOW (appears only when org adopts)
 * 
 * Navigation: Header tabs (not sidebar context switcher)
 * AI Layer: Hidden by default (Cmd+K only)
 * 
 * Content: Rendered via ContentRouter (lazy-loaded, density-gated)
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Search,
  Bell,
  User as UserIcon,
  Command,
  CheckSquare,
  Calendar,
  StickyNote,
  FileText,
  Briefcase,
  Bookmark,
  Home,
  Building2,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Code,
  Mail,
  ShoppingCart,
  Wrench,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
  MessageSquare,
  Phone,
  RefreshCw,
  AlertTriangle,
  Map,
  Shield,
  Plug,
  BookOpen,
  Heart,
  Zap,
  Repeat,
  Package,
  GitBranch,
  CreditCard,
  PieChart,
  Share2,
  Globe,
  Award,
} from "lucide-react";
import { LogoMark } from "../landing/Logo";
import { CommandPalette } from "../navigation/command-palette";
import type { Domain } from "./workspace-config";
import { getDomainConfig, getWorkNavigation, getPersonalNavigation } from "./workspace-config";
import { ContentRouter } from "./content-router";
import { CognitiveLayer } from "../cognitive/CognitiveLayer";
import { useFabricStatus, useScopedSlots } from "../hydration";

export type WorkspaceView = "PERSONAL" | "WORK";

interface WorkspaceShellNewProps {
  domain: Domain;
  userName: string;
  onLogout?: () => void;
}

// ─── ICON MAP ───────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  StickyNote,
  FileText,
  Briefcase,
  Bookmark,
  Building2,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Code,
  Mail,
  ShoppingCart,
  Wrench,
  GraduationCap,
  BarChart3,
  Home,
  Activity,
  MessageSquare,
  Phone,
  RefreshCw,
  AlertTriangle,
  Map,
  Shield,
  Plug,
  BookOpen,
  Heart,
  Zap,
  Repeat,
  Package,
  GitBranch,
  CreditCard,
  PieChart,
  Share2,
  Globe,
  Award,
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function WorkspaceShellNew({ domain, userName, onLogout }: WorkspaceShellNewProps) {
  const [activeView, setActiveView] = useState<WorkspaceView>("WORK");
  const [activePath, setActivePath] = useState("/work/dashboard");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Hydration Fabric status — live indicator in header
  const fabricStatus = useFabricStatus();

  // Scoped slots for view-based data routing
  // Each view loads only its relevant slots (personal, work, or team)
  const personalSlots = useScopedSlots("personal");
  const workSlots = useScopedSlots("work");
  const teamSlots = useScopedSlots("team");

  const domainConfig = getDomainConfig(domain);
  const currentNav = activeView === "PERSONAL" ? getPersonalNavigation() : getWorkNavigation(domain);
  
  // Extract moduleId from activePath: "/work/dashboard" → "dashboard"
  const moduleId = activePath.split("/").pop() || "dashboard";
  // For content routing, personal view uses PERSONAL domain
  const contentDomain = activeView === "PERSONAL" ? "PERSONAL" as Domain : domain;

  // ─── View Scope Documentation ──────────────────────────────────────────────
  // The workspace uses view-scoped slot loading for data optimization:
  //
  // PERSONAL view: Loads only personal slots (tasks, calendar, notes)
  //   - Same for all users regardless of domain
  //   - Typical slots: {tasks, calendar, notes, dashboard}
  //
  // WORK view: Loads domain-specific work slots
  //   - Content varies by domain (SALES, CS, REVOPS, etc.)
  //   - Typical slots: {signals, entities, knowledge, goals, connectors}
  //
  // TEAM view: Loads organization-level collaboration data
  //   - Presence and activity feeds shared across org
  //   - Typical slots: {team.presence, team.activity}
  // ─────────────────────────────────────────────────────────────────────────
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    const timer = setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [userMenuOpen]);
  
  const handleNavigate = useCallback((path: string) => {
    setActivePath(path);
    // Determine view from path
    if (path.startsWith("/personal")) {
      setActiveView("PERSONAL");
    } else if (path.startsWith("/work")) {
      setActiveView("WORK");
    }
  }, []);
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0C1222] text-white font-sans">
      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-white/10 bg-[#0F1629] flex items-center px-4 gap-6 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <LogoMark size={28} />
          <span className="font-bold text-sm hidden sm:inline">IntegrateWise</span>
        </div>
        
        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5">
          {(["PERSONAL", "WORK"] as const).map(view => (
            <button
              key={view}
              onClick={() => {
                setActiveView(view);
                setActivePath(view === "PERSONAL" ? "/personal/dashboard" : "/work/dashboard");
                // View switch triggers hydration of appropriate scoped slots:
                // PERSONAL loads: personal slots (tasks, calendar, notes)
                // WORK loads: work slots (signals, entities, knowledge, goals)
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === view
                  ? "bg-sky-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {view === "PERSONAL" ? "Personal" : "Work"}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex-1 max-w-md h-9 px-3 rounded-lg bg-black/20 border border-white/10 flex items-center gap-2 text-sm text-slate-400 hover:border-white/20 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search... (⌘K)</span>
          <span className="sm:hidden">Search...</span>
        </button>
        
        <div className="flex-1" />
        
        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Fabric Status Indicator */}
          <button
            onClick={() => handleNavigate("/work/fabric-admin")}
            className="h-9 px-2.5 rounded-lg bg-black/20 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            title={`Hydration Fabric: ${fabricStatus.initialized ? "Active" : fabricStatus.initializing ? "Loading" : "Idle"} · ${fabricStatus.slotCount} slots · ${fabricStatus.activeProviders.length} providers`}
          >
            <GitBranch className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span className={`w-1.5 h-1.5 rounded-full ${
              fabricStatus.error ? "bg-red-400" :
              fabricStatus.initialized ? "bg-emerald-400" :
              fabricStatus.initializing ? "bg-amber-400 animate-pulse" :
              "bg-slate-500"
            }`} />
            <span className="text-[10px] text-slate-400 hidden lg:inline">
              {fabricStatus.slotCount}
            </span>
          </button>
          
          {/* Notifications */}
          <button className="w-9 h-9 rounded-lg bg-black/20 hover:bg-white/10 transition-colors flex items-center justify-center relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
              className="h-9 px-3 rounded-lg bg-black/20 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{userName}</span>
            </button>
            
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-48 bg-[#0F1629] border border-white/10 rounded-lg shadow-xl z-50"
              >
                <div className="p-2 space-y-1">
                  <button className="w-full px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button
                    onClick={onLogout}
                    className="w-full px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2 text-sm text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>
      
      {/* ─── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── LEFT NAVIGATION ──────────────────────────────────────────────── */}
        <nav className="w-64 border-r border-white/10 bg-[#0F1629] flex flex-col overflow-hidden shrink-0">
          {/* Domain Badge (Work view only) */}
          {activeView === "WORK" && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${domainConfig.color}20` }}
                >
                  {domainConfig.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-white truncate">
                    {domainConfig.label}
                  </div>
                  <div className="text-[10px] text-slate-400">Domain</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {currentNav.map(section => (
              <div key={section.label}>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {section.label}
                </div>
                <div className="space-y-0.5">
                  {section.items.map(item => {
                    const Icon = ICON_MAP[item.icon] || Home;
                    const isActive = activePath === item.path;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-sky-500/20 text-sky-300 font-semibold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Actions */}
          <div className="p-3 border-t border-white/10 space-y-1">
            <button
              onClick={() => handleNavigate("/work/fabric-admin")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                moduleId === "fabric-admin"
                  ? "bg-[#0EA5E9]/20 text-[#0EA5E9] font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span className="flex-1 text-left">Fabric Admin</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                fabricStatus.initialized ? "bg-emerald-400" : "bg-slate-500"
              }`} />
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Command className="w-4 h-4" />
              <span className="flex-1 text-left">Command</span>
              <span className="text-xs text-slate-500">⌘K</span>
            </button>
          </div>
        </nav>
        
        {/* ─── MAIN CONTENT AREA ────────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden bg-[#0C1222]">
          <div className="h-full overflow-y-auto">
            <ContentRouter
              domain={contentDomain}
              moduleId={moduleId}
              forceRender={true}
            />
          </div>
        </main>
      </div>
      
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* L2 Cognitive Layer — event-driven sliding panel (⌘J to toggle) */}
      <CognitiveLayer />
    </div>
  );
}