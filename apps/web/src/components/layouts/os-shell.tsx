"use client"

import React, { createContext, useContext } from "react"
// View context for sharing currentView
type ViewContextType = {
  currentView: OsViewId
  setCurrentView: (view: OsViewId) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export function useView() {
  const ctx = useContext(ViewContext)
  if (!ctx) throw new Error("useView must be used within a ViewProvider")
  return ctx
}

type EvidenceOpenEventDetail = {
  situationId?: string | null
  title?: string
  description?: string
  evidence?: Array<{
    type: "spine" | "context" | "knowledge" | string
    title: string
    source: string
    date: string
    preview?: string
    link?: string
  }>
}

import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import {
  OS_VIEW_CONFIGS,
  OS_VIEW_ORDER,
  OS_NAV_ITEM_REGISTRY,
  getNavItemByRoute,
  getViewByPath,
  OsViewId,
  NavItemConfig,
  EntitlementTier,
} from "@/config/os-shell-registry"
import { useViewAccess } from "@/hooks/useViewAccess"
import { useWorldScope } from "@/contexts/world-scope"
import { useTenant } from "@/contexts/tenant-context"
import { featureAccess, planLabel } from "@/lib/entitlements"
import { ActionBar } from "@/components/os/action-bar"
import { CognitiveDrawer } from "@/components/os/evidence-drawer"
import { KnowledgePanel } from "@/components/os/knowledge-panel"
import { SmartSidebar } from "@/components/layouts/smart-sidebar"
import { CommandPalette, CommandPaletteTrigger } from "@/components/command-palette"
import {
  Bell,
  BookOpen,
  CheckSquare,
  ChevronDown,
  CreditCard,
  FolderKanban,
  Home,
  Link2,
  Megaphone,
  Settings2,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Users,
  Zap,
  Building2,
  Brain,
  Database,
  FileText,
  MessageCircle,
  History,
  Shield,
  Layers,
  Activity,
  BarChart3,
  Briefcase,
  Headphones,
  Code,
  DollarSign,
  UserCircle,
  Globe,
  GitBranch,
  Package,
  Boxes,
  Workflow,
  Eye,
  Sparkles,
  Command,
  Lightbulb,
} from "lucide-react"

const STORAGE_KEY = "iw:activeView"

// Department configurations for top nav
const DEPARTMENTS = [
  { id: "overview", label: "Overview", icon: Building2, color: "bg-primary", folder: "admin" },
  { id: "ops", label: "Operations", icon: Zap, color: "bg-primary", folder: "ops" },
  { id: "sales", label: "Sales", icon: Briefcase, color: "bg-primary", folder: "sales" },
  { id: "marketing", label: "Marketing", icon: Megaphone, color: "bg-primary", folder: "marketing" },
  { id: "cs", label: "Customer Success", icon: Headphones, color: "bg-primary", folder: "cs" },
  { id: "engineering", label: "Engineering", icon: Code, color: "bg-primary", folder: "engineering" },
  { id: "finance", label: "Finance", icon: DollarSign, color: "bg-primary", folder: "finance" },
  { id: "hr", label: "People", icon: Users, color: "bg-primary", folder: "people" },
  { id: "projects", label: "Projects", icon: FolderKanban, color: "bg-primary", folder: "projects" },
] as const

// Left nav items that adapt per department
const getLeftNavItems = (department: string) => {
  const common = [
    { id: "home", label: "Dashboard", icon: BarChart3, section: "core" },
    { id: "today", label: "Today", icon: Home, section: "core" },
    { id: "tasks", label: "Tasks", icon: CheckSquare, section: "core" },
    { id: "goals", label: "Goals & OKRs", icon: Target, section: "core" },
  ]

  const intelligence = [
    { id: "spine", label: "Spine", icon: Database, section: "intelligence", description: "Structured data from all tools" },
    { id: "context", label: "Context", icon: FileText, section: "intelligence", description: "Knowledge from docs, emails, meetings" },
    { id: "brainstorming", label: "Brainstorming", icon: BookOpen, section: "intelligence", description: "AI conversations & insights" },
    { id: "iq-hub", label: "IQ Hub", icon: Brain, section: "intelligence", description: "Converged intelligence layer" },
  ]

  const actions = [
    { id: "workflows", label: "Workflows", icon: Workflow, section: "act" },
    { id: "automations", label: "Automations", icon: Zap, section: "act" },
    { id: "approvals", label: "Approvals", icon: CheckSquare, section: "act" },
  ]

  const governance = [
    { id: "audit", label: "Audit Trail", icon: History, section: "govern" },
    { id: "evidence", label: "Evidence Log", icon: Eye, section: "govern" },
    { id: "policies", label: "Policies", icon: Shield, section: "govern" },
  ]

  const think = [
    { id: "signals", label: "Signals", icon: Activity, section: "think" },
    { id: "predictions", label: "Predictions", icon: Lightbulb, section: "think" },
    { id: "agent", label: "AI Agent", icon: Sparkles, section: "think" },
  ]

  // Department-specific items
  const departmentSpecific: Record<string, { id: string; label: string; icon: any; section: string }[]> = {
    overview: [
      { id: "today", label: "Overview", icon: Home, section: "business" },
      { id: "users", label: "Users", icon: Users, section: "business" },
      { id: "billing", label: "Billing", icon: CreditCard, section: "business" },
    ],
    sales: [
      { id: "pipeline", label: "Pipeline", icon: Layers, section: "department" },
      { id: "deals", label: "Deals", icon: Briefcase, section: "department" },
      { id: "accounts", label: "Accounts", icon: Building2, section: "department" },
      { id: "contacts", label: "Contacts", icon: UserCircle, section: "department" },
      { id: "forecasting", label: "Forecasting", icon: BarChart3, section: "department" },
    ],
    marketing: [
      { id: "campaigns", label: "Campaigns", icon: Megaphone, section: "department" },
      { id: "leads", label: "Leads", icon: Users, section: "department" },
      { id: "content", label: "Content", icon: FileText, section: "department" },
      { id: "analytics", label: "Analytics", icon: BarChart3, section: "department" },
    ],
    cs: [
      { id: "home", label: "Dashboard", icon: BarChart3, section: "department" },
      { id: "customers", label: "Customers", icon: Users, section: "department" },
      { id: "health", label: "Health Scores", icon: Activity, section: "department" },
      { id: "home", label: "Renewals", icon: CreditCard, section: "department" },
    ],
    ops: [
      { id: "processes", label: "Processes", icon: Workflow, section: "department" },
      { id: "resources", label: "Resources", icon: Package, section: "department" },
      { id: "capacity", label: "Capacity", icon: BarChart3, section: "department" },
    ],
    engineering: [
      { id: "sprints", label: "Sprints", icon: Zap, section: "department" },
      { id: "releases", label: "Releases", icon: Package, section: "department" },
      { id: "incidents", label: "Incidents", icon: Activity, section: "department" },
      { id: "tech-debt", label: "Tech Debt", icon: Code, section: "department" },
    ],
    finance: [
      { id: "budgets", label: "Budgets", icon: DollarSign, section: "department" },
      { id: "expenses", label: "Expenses", icon: CreditCard, section: "department" },
      { id: "revenue", label: "Revenue", icon: BarChart3, section: "department" },
      { id: "invoices", label: "Invoices", icon: FileText, section: "department" },
    ],
    hr: [
      { id: "employees", label: "Employees", icon: Users, section: "department" },
      { id: "recruiting", label: "Recruiting", icon: UserCircle, section: "department" },
      { id: "performance", label: "Performance", icon: Target, section: "department" },
      { id: "payroll", label: "Payroll", icon: DollarSign, section: "department" },
    ],
    projects: [
      { id: "all-projects", label: "All Projects", icon: FolderKanban, section: "department" },
      { id: "milestones", label: "Milestones", icon: Target, section: "department" },
      { id: "resources", label: "Resources", icon: Users, section: "department" },
      { id: "timeline", label: "Timeline", icon: Activity, section: "department" },
    ],
  }

  return {
    core: common,
    department: departmentSpecific[department] || [],
    intelligence,
    think,
    act: actions,
    govern: governance,
  }
}

const WORLD_DEFAULT_ROUTE: Record<string, string> = {
  personal: "/personal/home",
  work: "/ops/home",
  accounts: "/accounts/home",
  admin: "/admin/iq-hub",
}

const getDefaultRoute = (viewId: OsViewId) => {
  const viewConfig = OS_VIEW_CONFIGS[viewId]
  if (!viewConfig?.defaultItemId) return "/ops/home"
  const defaultItem = OS_NAV_ITEM_REGISTRY.find(item => item.id === viewConfig.defaultItemId)
  return defaultItem?.route ?? "/ops/home"
}

// Department Top Nav Button
const DepartmentButton = ({
  dept,
  isActive,
  onClick
}: {
  dept: typeof DEPARTMENTS[number]
  isActive: boolean
  onClick: () => void
}) => {
  const Icon = dept.icon
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted"
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden lg:inline">{dept.label}</span>
    </button>
  )
}

// Left Nav Section with collapsible items
const NavSection = ({
  title,
  items,
  activePage,
  onNavigate,
  collapsed = false,
  color = "slate"
}: {
  title: string
  items: { id: string; label: string; icon: any; section: string; description?: string }[]
  activePage: string
  onNavigate: (id: string) => void
  collapsed?: boolean
  color?: string
}) => {
  const [isOpen, setIsOpen] = useState(!collapsed)

  if (items.length === 0) return null

  const colorClasses: Record<string, string> = {
    slate: "text-muted-foreground",
    indigo: "text-muted-foreground",
    emerald: "text-muted-foreground",
    amber: "text-muted-foreground",
    rose: "text-muted-foreground",
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${colorClasses[color] || colorClasses.slate}`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
      </button>
      {isOpen && (
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all group ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
                title={item.description}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const ViewSwitchButton = ({ viewId, isActive }: { viewId: OsViewId; isActive: boolean }) => {
  const navigate = useNavigate()
  const viewConfig = OS_VIEW_CONFIGS[viewId]
  const viewAccess = useViewAccess(viewConfig?.defaultItemId || '')
  const allowed = typeof viewAccess === 'boolean' ? viewAccess : viewAccess?.hasAccess ?? true

  const Icon = useMemo(() => {
    if (viewId === "ops") return Zap
    if (viewId === "sales") return CreditCard
    if (viewId === "marketing") return Megaphone
    if (viewId === "cs") return Users
    if (viewId === "projects") return FolderKanban
    if (viewId === "admin") return ShieldCheck
    return Home
  }, [viewId])

  return (
    <button
      type="button"
      onClick={() => {
        if (!allowed) return
        const route = getDefaultRoute(viewId)
        localStorage.setItem(STORAGE_KEY, viewId)
        navigate(route)
      }}
      disabled={!allowed}
      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${isActive
        ? "bg-primary text-primary-foreground"
        : allowed
          ? "text-muted-foreground hover:bg-muted"
          : "text-slate-300 cursor-not-allowed"
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{viewConfig.label}</span>
    </button>
  )
}

const NavItemButton = ({
  item,
  isActive,
  badge,
}: {
  item: NavItemConfig
  isActive: boolean
  badge?: string | null
}) => {
  const navigate = useNavigate()
  const viewAccess = useViewAccess(item.id)
  const allowed = typeof viewAccess === 'boolean' ? viewAccess : viewAccess?.hasAccess ?? true
  const reason = typeof viewAccess === 'object' && viewAccess?.reason ? viewAccess.reason : undefined

  const Icon = useMemo(() => {
    const label = item.label.toLowerCase()
    if (label === "home") return Home
    if (label === "today") return Home
    if (label.includes("task")) return CheckSquare
    if (label.includes("goal") || label.includes("milestone")) return Target
    if (label.includes("integration") || label.includes("connector") || label.includes("webhook")) return Link2
    if (label.includes("settings") || label.includes("profile") || label.includes("preferences")) return Settings
    if (label.includes("knowledge") || label.includes("context") || label.includes("iq hub")) return BookOpen
    return null
  }, [item.label])

  return (
    <button
      type="button"
      onClick={() => {
        if (!allowed) return
        localStorage.setItem(STORAGE_KEY, item.view ?? '')
        navigate(item.route || '/workspace')
      }}
      disabled={!allowed}
      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${isActive
        ? "bg-primary text-primary-foreground font-medium"
        : allowed
          ? "text-muted-foreground hover:bg-muted font-normal"
          : "text-muted-foreground/60 cursor-not-allowed font-normal"
        }`}
      title={!allowed && reason ? reason : item.label || ''}
    >
      <span className="flex items-center gap-2 min-w-0">
        {Icon ? <Icon className="w-4 h-4 shrink-0" /> : null}
        <span className="truncate">{item.label || ''}</span>
      </span>
      <span className="flex items-center gap-1.5">
        {badge ? (
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${isActive
              ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              : "border-border bg-muted text-muted-foreground"
              }`}
            title={badge}
          >
            {badge}
          </span>
        ) : null}
        {!allowed ? <span className="text-[10px] font-medium uppercase text-muted-foreground">Locked</span> : null}
      </span>
    </button>
  )
}

const stageBadgeFor = (viewId: OsViewId, item: NavItemConfig) => {
  if (viewId !== "ops") return null
  const label = item.label.toLowerCase()
  if (label === "today") return "OPS-001"
  if (label === "tasks") return "OPS-002"
  if (label === "projects") return "OPS-003"
  if (label === "sessions") return "OPS-004"
  if (label.includes("goals")) return "OPS-005"
  return null
}

export function OsShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname || ""
  const worldScopeCtx = useWorldScope()
  const scope = worldScopeCtx?.scope || 'admin'
  const setScope = worldScopeCtx?.setScope || (() => {})
  const tenant = useTenant()
  const [activeView, setActiveView] = useState<OsViewId>("admin")
  const [activeDepartment, setActiveDepartment] = useState<string>("overview")
  const [activePage, setActivePage] = useState<string>("dashboard")
  const [initialized, setInitialized] = useState(false)
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [spineOpen, setSpineOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [cognitiveDrawerOpen, setCognitiveDrawerOpen] = useState(false)
  const [cognitiveContext, setCognitiveContext] = useState<{ situationId: string | null; override?: any } | null>(null)

  // Get left nav items based on active department
  const leftNavItems = useMemo(() => getLeftNavItems(activeDepartment), [activeDepartment])

  const viewFromPath = useMemo(() => getViewByPath(pathname), [pathname])
  const activeNavItem = useMemo(() => getNavItemByRoute(pathname), [pathname])
  const activeAccess = useViewAccess(activeNavItem?.id ?? "")

  // Keyboard shortcut for command palette and cognitive layer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Cognitive Drawer: Cmd/Ctrl + J - opens L2 intelligence drawer
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setCognitiveDrawerOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (viewFromPath) {
      setActiveView(viewFromPath)
      localStorage.setItem(STORAGE_KEY, viewFromPath)
      // Map view to department
      if (viewFromPath === "ops") setActiveDepartment("ops")
      if (viewFromPath === "sales") setActiveDepartment("sales")
      if (viewFromPath === "marketing") setActiveDepartment("marketing")
      if (viewFromPath === "cs") setActiveDepartment("cs")
      if (viewFromPath === "projects") setActiveDepartment("projects")
      if (viewFromPath === "admin") setActiveDepartment("overview")
    }
  }, [viewFromPath])

  // Keep world scope aligned to the URL/view
  useEffect(() => {
    if (!viewFromPath) return
    if (viewFromPath === "admin" && scope !== "admin") setScope("admin")
    if (viewFromPath === "personal" && scope !== "personal") setScope("personal")
    if (viewFromPath === "accounts" && scope !== "accounts") setScope("accounts")
    if (["ops", "sales", "marketing", "cs", "projects"].includes(viewFromPath) && scope !== "work") {
      setScope("work")
    }
  }, [viewFromPath, scope, setScope])

  useEffect(() => {
    if (initialized) return
    if (viewFromPath) {
      setInitialized(true)
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY) as OsViewId | null
    const nextView: OsViewId = stored && OS_VIEW_CONFIGS[stored] ? stored : "admin"
    const targetRoute = getDefaultRoute(nextView)
    navigate(targetRoute)
    setActiveView(nextView)
    setInitialized(true)
  }, [initialized, viewFromPath, navigate])

  // Global evidence/cognitive open - opens CognitiveDrawer
  useEffect(() => {
    const onEvidenceOpen = (event: Event) => {
      const detail = (event as CustomEvent<EvidenceOpenEventDetail>).detail
      if (!detail) return

      // Open cognitive drawer with context
      setCognitiveContext({
        situationId: detail.situationId || null,
        override: detail.evidence ? {
          title: detail.title,
          description: detail.description,
          evidence: {
            truth: detail.evidence.filter(e => e.type === 'spine'),
            context: detail.evidence.filter(e => e.type === 'context'),
            ai_chats: detail.evidence.filter(e => e.type === 'knowledge'),
          }
        } : undefined
      })
      setCognitiveDrawerOpen(true)
    }

    const onCognitiveOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ surface: string; data?: Record<string, unknown> }>).detail
      if (!detail) return
      
      setCognitiveContext({
        situationId: detail.data?.situationId as string || null
      })
      setCognitiveDrawerOpen(true)
    }

    const onGenericOpen = () => {
      setCognitiveDrawerOpen(true)
    }

    window.addEventListener("iw:evidence:open", onEvidenceOpen)
    window.addEventListener("iw:cognitive:open", onCognitiveOpen)
    window.addEventListener("open-cognitive-layer", onGenericOpen)
    return () => {
      window.removeEventListener("iw:evidence:open", onEvidenceOpen)
      window.removeEventListener("iw:cognitive:open", onCognitiveOpen)
      window.removeEventListener("open-cognitive-layer", onGenericOpen)
    }
  }, [])

  const viewForWorld: OsViewId =
    scope === "personal"
      ? "personal"
      : scope === "accounts"
        ? "accounts"
        : scope === "admin"
          ? "admin"
          : activeView

  const viewConfig = OS_VIEW_CONFIGS[viewForWorld]
  const apiScope = viewForWorld === "ops" ? "operations" : viewForWorld

  const workAccess = featureAccess({ plan: tenant.plan, featureFlags: tenant.featureFlags, featureKey: "worlds.work" })
  const canWork = typeof workAccess === 'boolean' ? workAccess : workAccess?.hasAccess ?? false
  const accountsAccess = featureAccess({ plan: tenant.plan, featureFlags: tenant.featureFlags, featureKey: "worlds.accounts" })
  const canAccounts = typeof accountsAccess === 'boolean' ? accountsAccess : accountsAccess?.hasAccess ?? false

  const handlePageNavigate = (pageId: string) => {
    setActivePage(pageId)
    // Navigate to appropriate route based on department + page
    const deptFolder = DEPARTMENTS.find(d => d.id === activeDepartment)?.folder || (activeDepartment === "overview" ? "admin" : activeDepartment)
    const route = `/${deptFolder}/${pageId}`
    navigate(route)
  }

  const handleDepartmentChange = (deptId: string) => {
    setActiveDepartment(deptId)
    setActivePage("home")
    const deptFolder = DEPARTMENTS.find(d => d.id === deptId)?.folder || (deptId === "overview" ? "admin" : deptId)
    const route = deptId === "overview" ? "/admin/today" : `/${deptFolder}/home`
    navigate(route)
  }

  // Provide currentView context to children
  return (
    <ViewContext.Provider value={{ currentView: activeView, setCurrentView: setActiveView }}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Left Sidebar - Adaptive per Department */}
        <aside className="w-56 bg-card border-r border-border flex flex-col">
          {/* Workspace Branding */}
          <div className="px-3 py-4 border-b border-border">
            <button
              onClick={() => navigate("/admin/today")}
              className="flex items-center gap-2.5 w-full"
            >
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                IW
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">IntegrateWise</div>
                <div className="text-[10px] text-muted-foreground">{tenant?.tenantName || 'Workspace'}</div>
              </div>
            </button>
          </div>

          {/* Navigation Sections - Smart Sidebar switches between Feature Bag (personal) and NavSection (business) */}
          <SmartSidebar
            worldScope={scope as any}
            activeDepartment={activeDepartment}
            activePage={activePage}
            onNavigate={handlePageNavigate}
            leftNavItems={leftNavItems}
          />

          {/* User Profile Footer */}
          <div className="p-2 border-t border-border">
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                NP
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium truncate">Nirmal</p>
                <p className="text-[10px] text-muted-foreground truncate">Admin • {planLabel(((tenant?.plan ?? 'free') as EntitlementTier))}</p>
              </div>
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header with Department Navigation */}
          <header className="bg-card border-b border-border">
            {/* Primary Header Row */}
            <div className="h-12 flex items-center justify-between px-4 gap-4">
              {/* Global Search */}
              <div className="flex-1 max-w-xl">
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-muted/40 border border-border text-muted-foreground hover:bg-card transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="flex-1 text-left">Search…</span>
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded border border-border">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                </button>
              </div>

              {/* Layer Badge + Quick Actions */}
              <div className="flex items-center gap-1.5">
                {/* L1 Layer Badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted border border-border text-[10px] font-semibold text-muted-foreground">
                  L1 <span className="font-normal">Workspace</span>
                </span>

                <div className="w-px h-5 bg-border mx-0.5" />

                {/* Notifications */}
                <button
                  className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                {/* Audit Trail */}
                <button
                  onClick={() => navigate("/admin/audit")}
                  className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Audit Trail"
                >
                  <History className="w-4 h-4" />
                </button>

                {/* Cognitive Layer */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('iw:cognitive:open', { detail: { surface: 'evidence', data: {} } }))}
                  className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Cognitive Layer (⌘J)"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Settings */}
                <button
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Settings"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Department Navigation Strip */}
            <div className="h-10 flex items-center gap-1 px-4 border-t border-border bg-muted/20 overflow-x-auto">
              {DEPARTMENTS.map((dept) => (
                <DepartmentButton
                  key={dept.id}
                  dept={dept}
                  isActive={activeDepartment === dept.id}
                  onClick={() => handleDepartmentChange(dept.id)}
                />
              ))}

              {/* Branches/Sectors/Worlds Switcher */}
              <div className="ml-auto flex items-center gap-2">
                <details className="relative">
                  <summary className="list-none cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md">
                    <Globe className="w-3.5 h-3.5" />
                    <span>All Branches</span>
                    <ChevronDown className="w-3 h-3" />
                  </summary>
                  <div className="absolute right-0 mt-1 w-48 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-1 z-50">
                    {["All Branches", "North America", "Europe", "APAC", "LATAM"].map((branch) => (
                      <button
                        key={branch}
                        className="w-full text-left px-3 py-1.5 text-xs text-popover-foreground hover:bg-muted rounded"
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </details>

                <details className="relative">
                  <summary className="list-none cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>All Sectors</span>
                    <ChevronDown className="w-3 h-3" />
                  </summary>
                  <div className="absolute right-0 mt-1 w-48 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-1 z-50">
                    {["All Sectors", "Enterprise", "SMB", "Startup", "Government"].map((sector) => (
                      <button
                        key={sector}
                        className="w-full text-left px-3 py-1.5 text-xs text-popover-foreground hover:bg-muted rounded"
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </header>

          {/* Main Content - Work First, Intelligence Woven In */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
            {activeNavItem && (typeof activeAccess === 'object' && activeAccess?.hasAccess === false) ? (
              <div className="max-w-xl border border-border bg-muted/30 text-foreground rounded-xl p-4">
                <p className="text-sm font-semibold">Access restricted</p>
                <p className="text-xs mt-1">{(typeof activeAccess === 'object' && activeAccess?.reason) || "You do not have access to this view."}</p>
              </div>
            ) : (
              <>
                {/* The children render the cognitive twin workspace view */}
                {children}
              </>
            )}
          </div>

          <ActionBar selectedActionId={selectedActionId} />
        </div>

        {/* Slide-over Panels for Searchable UIs */}
        <KnowledgePanel open={knowledgeOpen} onClose={() => setKnowledgeOpen(false)} />
        
        {/* L2 Cognitive Drawer - Full Intelligence Surface */}
        <CognitiveDrawer 
          situationId={cognitiveContext?.situationId || null}
          open={cognitiveDrawerOpen}
          onClose={() => setCognitiveDrawerOpen(false)}
          onOpen={() => setCognitiveDrawerOpen(true)}
          override={cognitiveContext?.override}
        />

        {/* Command Palette Modal */}
        <CommandPalette 
          open={commandPaletteOpen} 
          onOpenChange={setCommandPaletteOpen} 
        />
      </div>
    </ViewContext.Provider>
  )
}
