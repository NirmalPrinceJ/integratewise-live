"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { Home, Target, BarChart3, Lightbulb, Globe, Users, Megaphone, Package, Briefcase, ShoppingCart, Building2, CheckSquare, BookOpen, ChevronDown, Search, PanelLeftClose, Sparkles, Settings, Zap, Database, Link2, Shield, CreditCard, UserCog, Flag, Activity, FileText, Type as type, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// User view types - role-based navigation
type UserView = "executive" | "manager" | "team" | "analyst" | "admin"

// Context for view-aware components
const ViewContext = createContext<{
  currentView: UserView
  setView: (view: UserView) => void
}>({
  currentView: "team",
  setView: () => {},
})

export function useView() {
  return useContext(ViewContext)
}

// Lens types
type Lens = "personal" | "business" | "cs"

// Context for lens-aware components
const LensContext = createContext<{
  currentLens: Lens
  setLens: (lens: Lens) => void
}>({
  currentLens: "business",
  setLens: () => {},
})

export function useLens() {
  return useContext(LensContext)
}

// Navigation structure based on 29 Stages
interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  stageId?: string
  children?: { label: string; href: string; stageId?: string }[]
}

// EXECUTIVE View - Strategic oversight and decision making
const executiveNavItems: NavItem[] = [
  { icon: BarChart3, label: "Dashboard", href: "/metrics", stageId: "METRICS-016" },
  { icon: Target, label: "Goals & OKRs", href: "/goals", stageId: "GOALS-015" },
  { icon: FileText, label: "Reports", href: "/reports", stageId: "REPORTS" },
  { icon: Lightbulb, label: "Insights", href: "/insights", stageId: "INSIGHTS-013" },
  { icon: Building2, label: "Clients", href: "/business/clients" },
]

// MANAGER View - Team oversight and operations
const managerNavItems: NavItem[] = [
  { icon: Home, label: "Today", href: "/today", stageId: "TODAY-011" },
  { icon: Users, label: "Team", href: "/team", stageId: "TEAM" },
  { icon: Target, label: "Goals", href: "/goals", stageId: "GOALS-015" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", stageId: "TASKS-012" },
  { icon: BarChart3, label: "Metrics", href: "/metrics", stageId: "METRICS-016" },
  {
    icon: Briefcase,
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Active", href: "/projects/active" },
      { label: "Pipeline", href: "/business/crm/pipeline" },
      { label: "Completed", href: "/projects/completed" },
    ],
  },
]

// TEAM View - Daily work and collaboration
const teamNavItems: NavItem[] = [
  { icon: Home, label: "Today", href: "/today", stageId: "TODAY-011" },
  { icon: CheckSquare, label: "My Tasks", href: "/tasks", stageId: "TASKS-012" },
  { icon: BookOpen, label: "Knowledge", href: "/knowledge", stageId: "KNOWLEDGE-014" },
  { icon: Lightbulb, label: "IQ Hub", href: "/iq-hub", stageId: "IQHUB-008" },
  {
    icon: ShoppingCart,
    label: "Sales",
    href: "/sales",
    children: [
      { label: "Pipeline", href: "/business/crm/pipeline" },
      { label: "Leads", href: "/business/crm/leads" },
      { label: "Clients", href: "/business/clients" },
    ],
  },
  {
    icon: Users,
    label: "Customer Success",
    href: "/cs",
    children: [
      { label: "Accounts", href: "/cs/accounts" },
      { label: "Health", href: "/cs/health" },
    ],
  },
  { icon: Package, label: "Products", href: "/business/products" },
  { icon: Briefcase, label: "Services", href: "/business/services" },
]

// ANALYST View - Data and reporting focus
const analystNavItems: NavItem[] = [
  { icon: BarChart3, label: "Analytics", href: "/metrics", stageId: "METRICS-016" },
  { icon: Database, label: "Data Sources", href: "/spine", stageId: "SPINE-009" },
  { icon: FileText, label: "Reports", href: "/reports", stageId: "REPORTS" },
  { icon: Activity, label: "Dashboards", href: "/dashboards", stageId: "DASHBOARDS" },
  { icon: Sparkles, label: "Insights", href: "/insights", stageId: "INSIGHTS-013" },
  { icon: Search, label: "Discovery", href: "/search", stageId: "SEARCH" },
]

// ADMIN View - System configuration and management
const adminNavItems: NavItem[] = [
  { icon: UserCog, label: "Users", href: "/admin/users", stageId: "USERADMIN-021" },
  { icon: Shield, label: "Permissions", href: "/admin/rbac", stageId: "RBAC-022" },
  { icon: Link2, label: "Integrations", href: "/integrations", stageId: "INTEGRATIONS-017" },
  { icon: CreditCard, label: "Billing", href: "/admin/billing", stageId: "BILLING-023" },
  { icon: Flag, label: "Feature Flags", href: "/admin/flags", stageId: "FEATUREFLAGS-027" },
  { icon: Activity, label: "System Health", href: "/system-health", stageId: "MONITORING-028" },
  { icon: FileText, label: "Audit Logs", href: "/admin/audit", stageId: "AUDIT-029" },
  { icon: Settings, label: "Settings", href: "/settings", stageId: "SETTINGS-020" },
]

const businessNavItems: NavItem[] = [
  // Business-specific navigation items
]

const csNavItems: NavItem[] = [
  // Customer Success-specific navigation items
]

const userNavItems: NavItem[] = [
  // User-specific navigation items
]

function getLensNavItems(currentLens: Lens) {
  switch (currentLens) {
    case "personal":
      return [];
    case "business":
      return businessNavItems;
    case "cs":
      return csNavItems;
    default:
      return [];
  }
}

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<UserView>("team")
  const [currentLens, setCurrentLens] = useState<Lens>("business")
  const pathname = usePathname()

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  // Get nav items based on current view
  const getViewNavItems = () => {
    switch (currentView) {
      case "executive":
        return executiveNavItems
      case "manager":
        return managerNavItems
      case "team":
        return teamNavItems
      case "analyst":
        return analystNavItems
      case "admin":
        return adminNavItems
    }
  }

  const viewConfig = {
    executive: { label: "Executive View", description: "Strategic oversight" },
    manager: { label: "Manager View", description: "Team & operations" },
    team: { label: "Team View", description: "Daily work" },
    analyst: { label: "Analyst View", description: "Data & insights" },
    admin: { label: "Admin View", description: "System management" },
  }

  const navItems = getViewNavItems()

  return (
    <ViewContext.Provider value={{ currentView, setView: setCurrentView }}>
      <LensContext.Provider value={{ currentLens, setLens: setCurrentLens }}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <aside
            className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed h-full z-30`}
          >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-gray-200">
              <div className="w-9 h-9 bg-[#2D7A3E] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              {sidebarOpen && <span className="ml-3 font-semibold text-gray-900">IntegrateWise OS</span>}
            </div>

            {/* View Selector */}
            {sidebarOpen && (
              <div className="px-3 py-3 border-b border-gray-200">
                <select
                  value={currentView}
                  onChange={(e) => setCurrentView(e.target.value as UserView)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20 focus:border-[#2D7A3E]"
                >
                  {(Object.keys(viewConfig) as UserView[]).map((view) => (
                    <option key={view} value={view}>
                      {viewConfig[view].label} - {viewConfig[view].description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <NavSection items={navItems} sidebarOpen={sidebarOpen} expandedMenus={expandedMenus} toggleMenu={toggleMenu} isActive={isActive} />
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#2D7A3E] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  NP
                </div>
                {sidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Nirmal Prince J</p>
                    <p className="text-xs text-gray-500">{viewConfig[currentView].description}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className={`flex-1 flex flex-col ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}>
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-20">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
                <PanelLeftClose className="w-5 h-5" />
              </button>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20 focus:border-[#2D7A3E]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Cmd+K</span>
                <div className="w-8 h-8 bg-[#2D7A3E] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  NP
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </LensContext.Provider>
    </ViewContext.Provider>
  )
}

// Navigation Section Component
function NavSection({
  items,
  sidebarOpen,
  expandedMenus,
  toggleMenu,
  isActive,
}: {
  items: NavItem[]
  sidebarOpen: boolean
  expandedMenus: string[]
  toggleMenu: (label: string) => void
  isActive: (href: string) => boolean
}) {
  return (
    <>
      {items.map((item) => (
        <div key={item.label}>
          {item.children ? (
            <button
              onClick={() => toggleMenu(item.label)}
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                isActive(item.href) ? "bg-[#E8F5E9] text-[#2D7A3E] font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.label) ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-[#E8F5E9] text-[#2D7A3E] font-medium border-l-3 border-[#2D7A3E]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          )}
          {/* Submenu */}
          {item.children && expandedMenus.includes(item.label) && sidebarOpen && (
            <div className="ml-8 py-1">
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className={`block px-4 py-2 text-sm ${
                    isActive(child.href) ? "text-[#2D7A3E] font-medium" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
