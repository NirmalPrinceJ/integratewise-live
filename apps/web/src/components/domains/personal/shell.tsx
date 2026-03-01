/**
 * Personal Domain Shell — Individual workspace dashboard
 * Views: Dashboard, Agenda, Goals, Activities, Insights
 */
import { useState } from "react";
import {
  LayoutDashboard, Calendar, Target, Activity, TrendingUp,
  Search, Bell, Brain, Sparkles,
} from "lucide-react";
import { DomainSidebar, type NavItem } from "../domain-sidebar";
import { domainConfigs } from "../domain-types";
import { PersonalDashboard } from "./dashboard";
import { useSpine } from "../../spine/spine-client";

const domain = domainConfigs["personal"];

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "agenda", label: "Agenda", icon: <Calendar className="w-4 h-4" /> },
  { id: "goals", label: "Goals", icon: <Target className="w-4 h-4" /> },
  { id: "activity", label: "Activity Stream", icon: <Activity className="w-4 h-4" /> },
  { id: "insights", label: "Insights", icon: <TrendingUp className="w-4 h-4" /> },
];

interface PersonalShellProps {
  onSwitchDomain: () => void;
}

export function PersonalShell({ onSwitchDomain }: PersonalShellProps) {
  const [activeView, setActiveView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const spine = useSpine();

  const viewTitles: Record<string, string> = {
    dashboard: "Dashboard",
    agenda: "Today's Agenda",
    goals: "Goals & Progress",
    activity: "Activity Stream",
    insights: "Insights",
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <PersonalDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="text-3xl">{domain.icon}</div>
              <p className="text-sm text-muted-foreground capitalize">{activeView} — Coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans">
      <DomainSidebar
        domain={domain}
        navItems={navItems}
        activeView={activeView}
        onViewChange={setActiveView}
        onBackToConsole={onSwitchDomain}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-shrink-0 h-12 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ fontWeight: 600, color: domain.accentColor }}>
              {domain.icon} {viewTitles[activeView] || "Personal"}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Personal workspace
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><Search className="w-4 h-4 text-muted-foreground" /></button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--iw-danger)]" />
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-hidden bg-background">{renderView()}</main>
      </div>
    </div>
  );
}
