import { useState, useMemo } from "react";
import { useDomainTable, useSpineProjection, useSpineReadiness } from "./spine/spine-client";
import { type L1Module, type CTXEnum } from "./spine/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Loader2, AlertCircle, Search, Plus, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { DocumentStorage } from "./document-storage/document-storage";
import { useGoalsSafe } from "./goal-framework/goal-context";
import { DashboardView } from "./dashboard-view";

// ── Domain components (Business Ops) ──
import { SalesPipeline } from "./sales/pipeline";
import { ContactsView } from "./sales/contacts";
import { AccountsView } from "./business-ops/accounts";
import { TasksView } from "./business-ops/tasks";
import { CalendarView } from "./business-ops/calendar-view";
import { OpsAnalyticsView } from "./business-ops/analytics-view";
import { WorkflowsView } from "./business-ops/workflows";

// ── Sales domain ──
import { DealsView } from "./sales/deals";
import { ForecastingView } from "./sales/forecasting";
import { ActivitiesView } from "./sales/activities";
import { QuotesView } from "./sales/quotes";
import { SalesDashboard } from "./sales/dashboard";

// ── Marketing domain ──
import { CampaignsView } from "./marketing/campaigns";
import { EmailStudioView } from "./marketing/email-studio";
import { SocialView } from "./marketing/social";
import { AttributionView } from "./marketing/attribution";
import { FormsView } from "./marketing/forms";
import { MarketingDashboard } from "./marketing/dashboard";

// ── Website / CMS domain ──
import { WebsiteDashboard } from "./website/dashboard";
import { BlogView } from "./website/blog";
import { SeoView } from "./website/seo";
import { MediaView } from "./website/media";
import { PagesView } from "./website/pages";
import { ThemeView } from "./website/theme";

// ── Admin / Governance ──
import { RBACManager } from "./admin/rbac-manager";
import { ApprovalWorkflows } from "./admin/approval-workflows";
import { TenantManager } from "./admin/tenant-manager";
import { UserManagement } from "./admin/user-management";

// ── Account Success sub-views ──
import { ProjectsView } from "./domains/account-success/projects-view";
import { MeetingsView } from "./domains/account-success/meetings-view";
import { AccountSuccessDashboard } from "./domains/account-success/dashboard";

// ── System modules ──
import { IntegrationsHub } from "./integrations-hub";
import { AIChat } from "./ai-chat";
import { SettingsPage } from "./settings-page";
import { SubscriptionsPage } from "./subscriptions-page";
import { ProfilePage } from "./profile-page";

interface L1ModuleContentProps {
  module: L1Module;
  activeCtx: CTXEnum;
}

export function L1ModuleContent({ module, activeCtx }: L1ModuleContentProps) {
  const goalsCtx = useGoalsSafe();
  const domain = "unified";
  const table = useMemo(() => {
    switch (module) {
      case "Projects": return "projects"; case "Accounts": return "accounts";
      case "Contacts": return "contacts"; case "Meetings": return "meetings";
      case "Docs": return "documents"; case "Tasks": return "tasks";
      case "Calendar": return "activities"; case "Notes": return "activities";
      case "Knowledge Space": return "documents"; case "Team": return "people";
      case "Pipeline": return "deals"; case "Risks": return "risks";
      case "Expansion": return "expansion"; case "Analytics": return "analytics";
      case "Deals": return "deals"; case "Campaigns": return "campaigns";
      default: return null;
    }
  }, [module]);

  const { data, loading, error } = useDomainTable(domain, table || "accounts");
  const { data: projection, loading: pLoading } = useSpineProjection(activeCtx.replace("CTX_", "").toLowerCase());
  const { data: readiness } = useSpineReadiness();

  // ── Context-aware Home dashboard ──
  if (module === "Home") {
    switch (activeCtx) {
      case "CTX_CS":
        return <AccountSuccessDashboard />;
      case "CTX_SALES":
        return <SalesDashboard />;
      case "CTX_MARKETING":
        return <MarketingDashboard />;
      case "CTX_BIZOPS":
      default:
        return <DashboardView activeCtx={activeCtx} projection={projection} readiness={readiness} />;
    }
  }

  // ── Documents & Knowledge ──
  if (module === "Docs" || module === "Knowledge Space") {
    return <DocumentStorage />;
  }

  // ── Sales domain routes ──
  if (module === "Pipeline") return <SalesPipeline />;
  if (module === "Deals") return <DealsView />;
  if (module === "Forecasting") return <ForecastingView />;
  if (module === "Activities") return <ActivitiesView />;
  if (module === "Quotes") return <QuotesView />;

  // ── Core entity routes ──
  if (module === "Contacts") return <ContactsView />;
  if (module === "Accounts") return <AccountsView />;
  if (module === "Tasks") return <TasksView />;
  if (module === "Calendar") return <CalendarView />;
  if (module === "Analytics") return <OpsAnalyticsView />;
  if (module === "Projects") return <ProjectsView />;
  if (module === "Meetings") return <MeetingsView />;
  if (module === "Team") return <UserManagement />;
  if (module === "Workflows") return <WorkflowsView />;

  // ── Marketing domain routes ──
  if (module === "Campaigns") return <CampaignsView />;
  if (module === "Email Studio") return <EmailStudioView />;
  if (module === "Social") return <SocialView />;
  if (module === "Attribution") return <AttributionView />;
  if (module === "Forms") return <FormsView />;

  // ── Website / CMS routes ──
  if (module === "Website") return <WebsiteDashboard />;
  if (module === "Blog") return <BlogView />;
  if (module === "SEO") return <SeoView />;
  if (module === "Media Library") return <MediaView />;
  if (module === "Pages") return <PagesView />;
  if (module === "Theme") return <ThemeView />;

  // ── Admin / Governance routes ──
  if (module === "RBAC") return <RBACManager />;
  if (module === "Approvals") return <ApprovalWorkflows />;
  if (module === "Admin") return <TenantManager />;

  // ── System module routes ──
  if (module === "Integrations") return <IntegrationsHub />;
  if (module === "AI Chat") return <AIChat activeCtx={activeCtx} />;
  if (module === "Settings") return <SettingsPage />;
  if (module === "Subscriptions") return <SubscriptionsPage />;
  if (module === "Profile") return <ProfilePage />;

  // ── Expansion context-specific handling ──
  if (module === "Expansion") return <ForecastingView />;
  if (module === "Risks") return <OpsAnalyticsView />;

  if (loading || pLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading {module}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto"><AlertCircle className="w-6 h-6" /></div>
        <h3 className="text-lg font-bold">Something went wrong</h3>
        <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const entityGoals = goalsCtx?.getEntityGoals(activeCtx, table || "accounts") || [];

  // Fallback card grid for remaining modules
  return <CardGridView module={module} data={data} entityGoals={entityGoals} activeCtx={activeCtx} />;
}

// ─── Card Grid View ──────────────────────────────────────────────────────────

function CardGridView({ module, data, entityGoals, activeCtx }: { module: L1Module; data: any[]; entityGoals: any[]; activeCtx: CTXEnum }) {
  const [search, setSearch] = useState("");

  const filtered = data?.filter((item: any) => {
    const name = (item.name || item.title || item.subject || "").toLowerCase();
    return name.includes(search.toLowerCase());
  }) || [];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{module}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} items · {activeCtx.replace("CTX_", "")} context</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder={`Search ${module.toLowerCase()}...`} className="pl-8 h-9 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9"><Filter className="w-3.5 h-3.5" /></Button>
            <Button className="gap-1.5 h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-3.5 h-3.5" /> New</Button>
          </div>
        </div>

        {entityGoals.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Serves Goals:</span>
            {entityGoals.map((eg: any) => (
              <Badge key={eg.goalId} variant="outline" className="text-[9px] gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${eg.impact === "HIGH" ? "bg-emerald-500" : eg.impact === "MEDIUM" ? "bg-amber-500" : "bg-gray-400"}`} />
                {eg.goalName}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item: any) => (
            <Card key={item.id} className="border shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {item.logo || item.name?.[0] || item.title?.[0] || "E"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {item.name || item.title || item.subject || "Untitled"}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-mono">{item.id?.slice(0, 12)}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-[9px] ${item.status === "active" || item.status === "completed" ? "bg-emerald-50 text-emerald-700" : item.status === "at_risk" ? "bg-amber-50 text-amber-700" : ""}`}>
                    {item.status || "Synced"}
                  </Badge>
                </div>
                {item.owner && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold">{item.owner.initials}</div>
                    <span>{item.owner.name}</span>
                  </div>
                )}
                {item.healthScore != null && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Health</span>
                      <span className={`font-bold ${item.healthScore >= 80 ? "text-emerald-600" : item.healthScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{item.healthScore}%</span>
                    </div>
                    <Progress value={item.healthScore} className={`h-1 ${item.healthScore < 60 ? "[&>div]:bg-red-500" : item.healthScore < 80 ? "[&>div]:bg-amber-500" : ""}`} />
                  </div>
                )}
                {item.arr && (
                  <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">ARR</span><span className="font-bold">${(item.arr / 1000).toFixed(0)}K</span></div>
                )}
                {item.provenance && (
                  <div className="flex items-center gap-1 flex-wrap mt-2 pt-2 border-t border-border">
                    {item.provenance.map((p: any, i: number) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-secondary font-bold uppercase">{p.sourceToolName}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3"><Search className="w-5 h-5 text-muted-foreground" /></div>
            <h3 className="font-bold mb-1">No items found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or create a new entry.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}