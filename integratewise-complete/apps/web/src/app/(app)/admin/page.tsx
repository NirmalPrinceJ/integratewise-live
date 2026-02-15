"use client"

import { useState } from "react"
import { Users, Settings, Database, Shield, CreditCard, Activity, BarChart3, FileText, Bell, Key, Flag, Globe, Package, MessageSquare, Mail, Calendar, FolderOpen, GitBranch, Zap, LineChart, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Department = "people" | "finance" | "operations" | "security" | "platform" | "analytics"

interface NavSection {
  label: string
  items: { icon: any; label: string; href: string; badge?: string }[]
}

const departmentConfig: Record<Department, { label: string; icon: any; sections: NavSection[] }> = {
  people: {
    label: "People & Access",
    icon: Users,
    sections: [
      {
        label: "User Management",
        items: [
          { icon: Users, label: "All Users", href: "/admin/users", badge: "124" },
          { icon: Shield, label: "Roles & Permissions", href: "/admin/rbac" },
          { icon: Key, label: "API Keys", href: "/admin/api-keys", badge: "12" },
          { icon: Bell, label: "Invitations", href: "/admin/invitations", badge: "3" },
        ],
      },
      {
        label: "Organization",
        items: [
          { icon: Globe, label: "Teams", href: "/admin/teams" },
          { icon: FolderOpen, label: "Departments", href: "/admin/departments" },
          { icon: Calendar, label: "Directory", href: "/admin/directory" },
        ],
      },
    ],
  },
  finance: {
    label: "Finance & Billing",
    icon: CreditCard,
    sections: [
      {
        label: "Billing",
        items: [
          { icon: CreditCard, label: "Subscriptions", href: "/admin/billing" },
          { icon: FileText, label: "Invoices", href: "/admin/invoices", badge: "8" },
          { icon: BarChart3, label: "Usage & Costs", href: "/admin/usage" },
          { icon: Settings, label: "Payment Methods", href: "/admin/payments" },
        ],
      },
      {
        label: "Revenue",
        items: [
          { icon: LineChart, label: "Revenue Analytics", href: "/admin/revenue" },
          { icon: Package, label: "Products", href: "/admin/products" },
          { icon: FileText, label: "Contracts", href: "/admin/contracts" },
        ],
      },
    ],
  },
  operations: {
    label: "Operations",
    icon: Settings,
    sections: [
      {
        label: "System",
        items: [
          { icon: Activity, label: "System Health", href: "/system-health" },
          { icon: Database, label: "Data Sources", href: "/admin/data-sources" },
          { icon: GitBranch, label: "Integrations", href: "/integrations", badge: "14" },
          { icon: Zap, label: "Automation", href: "/admin/automation" },
        ],
      },
      {
        label: "Communication",
        items: [
          { icon: Mail, label: "Email Settings", href: "/admin/email" },
          { icon: MessageSquare, label: "Notifications", href: "/admin/notifications" },
          { icon: Bell, label: "Alerts", href: "/admin/alerts", badge: "2" },
        ],
      },
    ],
  },
  security: {
    label: "Security & Compliance",
    icon: Shield,
    sections: [
      {
        label: "Access Control",
        items: [
          { icon: Shield, label: "Security Policies", href: "/admin/security" },
          { icon: Key, label: "Authentication", href: "/admin/auth" },
          { icon: FileText, label: "Audit Logs", href: "/admin/audit" },
          { icon: Activity, label: "Session Management", href: "/admin/sessions" },
        ],
      },
      {
        label: "Compliance",
        items: [
          { icon: FileText, label: "Data Privacy", href: "/admin/privacy" },
          { icon: Shield, label: "Compliance Reports", href: "/admin/compliance" },
          { icon: Database, label: "Data Retention", href: "/admin/retention" },
        ],
      },
    ],
  },
  platform: {
    label: "Platform Configuration",
    icon: Settings,
    sections: [
      {
        label: "Configuration",
        items: [
          { icon: Flag, label: "Feature Flags", href: "/admin/flags" },
          { icon: Settings, label: "Global Settings", href: "/settings" },
          { icon: Globe, label: "Localization", href: "/admin/localization" },
          { icon: Package, label: "Packages", href: "/admin/packages" },
        ],
      },
      {
        label: "Development",
        items: [
          { icon: GitBranch, label: "Webhooks", href: "/admin/webhooks" },
          { icon: Key, label: "API Management", href: "/admin/api" },
          { icon: FileText, label: "Documentation", href: "/admin/docs" },
        ],
      },
    ],
  },
  analytics: {
    label: "Analytics & Insights",
    icon: BarChart3,
    sections: [
      {
        label: "Metrics",
        items: [
          { icon: BarChart3, label: "Dashboard", href: "/metrics" },
          { icon: LineChart, label: "Usage Trends", href: "/admin/trends" },
          { icon: Activity, label: "Performance", href: "/admin/performance" },
          { icon: Users, label: "User Analytics", href: "/admin/user-analytics" },
        ],
      },
      {
        label: "Reports",
        items: [
          { icon: FileText, label: "Custom Reports", href: "/admin/reports" },
          { icon: Calendar, label: "Scheduled Reports", href: "/admin/scheduled" },
          { icon: Database, label: "Data Exports", href: "/admin/exports" },
        ],
      },
    ],
  },
}

const statsData = [
  { label: "Total Users", value: "1,247", change: "+12%", trend: "up", icon: Users },
  { label: "Active Sessions", value: "342", change: "+8%", trend: "up", icon: Activity },
  { label: "System Health", value: "99.8%", change: "+0.3%", trend: "up", icon: Activity },
  { label: "Monthly Revenue", value: "$48.2K", change: "+15%", trend: "up", icon: CreditCard },
]

export default function AdminPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("people")

  const config = departmentConfig[selectedDepartment]
  const Icon = config.icon

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Dynamic based on department */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Department Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D7A3E]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#2D7A3E]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{config.label}</h2>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-4">
          {config.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <Button className="w-full bg-[#2D7A3E] hover:bg-[#246831] text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Departments */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your organization</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search admin..." className="w-64 pl-9" />
                </div>
                <Button variant="outline">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Department Tabs - Horizontal Left to Right */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {(Object.keys(departmentConfig) as Department[]).map((dept) => {
                const DeptIcon = departmentConfig[dept].icon
                const isActive = selectedDepartment === dept
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#2D7A3E] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <DeptIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {departmentConfig[dept].label}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {statsData.map((stat) => {
              const StatIcon = stat.icon
              return (
                <Card key={stat.label} className="p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <StatIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs text-green-700 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </Card>
              )
            })}
          </div>

          {/* Department Overview */}
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-6 h-6 text-[#2D7A3E]" />
              <h2 className="text-lg font-semibold text-gray-900">{config.label} Overview</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Manage all aspects of {config.label.toLowerCase()} for your organization. Select from the left sidebar to navigate to specific sections.
            </p>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-3 gap-4">
              {config.sections.flatMap((section) => section.items).slice(0, 6).map((item) => {
                const ItemIcon = item.icon
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#2D7A3E] hover:bg-[#E8F5E9] transition-colors group"
                  >
                    <ItemIcon className="w-5 h-5 text-gray-400 group-hover:text-[#2D7A3E] mb-2" />
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{item.label}</h3>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge} items
                      </Badge>
                    )}
                  </a>
                )
              })}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
