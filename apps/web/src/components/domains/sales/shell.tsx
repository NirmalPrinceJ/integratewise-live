/**
 * Sales Domain Shell — Pipeline, deals, and sales execution
 * Views: Dashboard, Pipeline, Deals, Accounts, Contacts, Activities, Meetings, Forecasting
 */
import { useState } from "react";
import {
  LayoutDashboard, DollarSign, Briefcase, Building2, Users, Phone,
  Calendar, TrendingUp, Search, Bell, Brain, Sparkles, Command, Plus,
} from "lucide-react";
import { DomainSidebar, type NavItem } from "../domain-sidebar";
import { domainConfigs } from "../domain-types";
import { SalesDashboard } from "./dashboard";
import { useSpine } from "../../spine/spine-client";

const domain = domainConfigs["sales"];

const navItems: NavItem[] = [
  { id: "dashboard", label: "Sales Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "pipeline", label: "Pipeline", icon: <DollarSign className="w-4 h-4" /> },
  { id: "deals", label: "Deals", icon: <Briefcase className="w-4 h-4" />, badge: "12" },
  { id: "accounts", label: "Accounts", icon: <Building2 className="w-4 h-4" /> },
  { id: "contacts", label: "Contacts", icon: <Users className="w-4 h-4" />, section: "Engagement" },
  { id: "activities", label: "Activities", icon: <Phone className="w-4 h-4" />, section: "Engagement" },
  { id: "meetings", label: "Meetings", icon: <Calendar className="w-4 h-4" />, section: "Engagement" },
  { id: "forecasting", label: "Forecasting", icon: <TrendingUp className="w-4 h-4" />, section: "Planning" },
];

interface SalesShellProps {
  onSwitchDomain: () => void;
}

export function SalesShell({ onSwitchDomain }: SalesShellProps) {
  const [activeView, setActiveView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const spine = useSpine();

  const viewTitles: Record<string, string> = {
    dashboard: "Sales Dashboard",
    pipeline: "Pipeline",
    deals: "Deals",
    accounts: "Accounts",
    contacts: "Contacts",
    activities: "Activities",
    meetings: "Meetings",
    forecasting: "Forecasting",
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <SalesDashboard />;
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
              {domain.icon} {viewTitles[activeView] || "Sales"}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              {spine.connectedApps.length} sources · SSOT live
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
