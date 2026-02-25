"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Calendar,
  StickyNote,
  BookOpen,
  UserCircle,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Settings,
  Zap,
  GitBranch,
  Plug,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";

const workspaceItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Accounts", href: "/accounts" },
  { icon: FileText, label: "Docs", href: "/docs" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: StickyNote, label: "Notes", href: "/notes" },
  { icon: BookOpen, label: "Knowledge Space", href: "/knowledge" },
  { icon: UserCircle, label: "Team", href: "/team" },
];

const intelligenceItems = [
  { icon: TrendingUp, label: "Pipeline", href: "/pipeline" },
  { icon: AlertTriangle, label: "Risks", href: "/risks" },
  { icon: Sparkles, label: "Expansion", href: "/expansion" },
  { icon: Zap, label: "Intelligence", href: "/intelligence" },
];

const connectItems = [
  { icon: GitBranch, label: "Workflows", href: "/workflows" },
  { icon: Plug, label: "Integrations", href: "/integrations" },
  { icon: MessageSquare, label: "AI Chat", href: "/aichat" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden fixed inset-y-0 left-0 z-40 lg:relative`}>
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <div className="w-7 h-7 border border-black flex items-center justify-center mr-3">
            <span className="text-black font-bold text-xs">IW</span>
          </div>
          <span className="font-medium text-black">IntegrateWise</span>
        </div>

        {/* Context Switcher */}
        <div className="p-4 border-b border-gray-200">
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-medium">
                B
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-black">Business Operations</div>
                <div className="text-xs text-gray-400">PRODUCT ORG</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Workspace */}
          <div className="mb-6">
            <div className="px-6 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Workspace
            </div>
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Intelligence */}
          <div className="mb-6">
            <div className="px-6 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Intelligence
            </div>
            {intelligenceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Connect */}
          <div className="mb-6">
            <div className="px-6 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Connect
            </div>
            {connectItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
              N
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-black">Nirmal</div>
              <div className="text-xs text-gray-400">OPERATIONS LEAD</div>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Workspace</span>
              <span className="text-gray-300">/</span>
              <span className="text-black font-medium">{title || "Home"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search everything..." 
                className="pl-10 w-64 h-9 border-gray-200 rounded-none bg-gray-50 focus:bg-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 px-1.5 py-0.5">
                ⌘K
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-xs flex items-center justify-center">
                5
              </span>
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:block">OPERATIONS LEAD</span>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                N
              </div>
              <span className="text-sm font-medium hidden sm:block">Nirmal</span>
            </div>
          </div>
        </header>

        {/* Alert Banner */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm flex-1 truncate">
              <span className="font-medium text-red-900">Renewal Risk — FinanceFlow Solutions</span>
              <span className="text-red-700 ml-2 hidden sm:inline">3 P1 tickets, champion silent for 12 days, payment failed twice. Renewal in 29 days.</span>
            </span>
            <button className="text-xs text-red-700 hover:text-red-900 font-medium whitespace-nowrap">
              View Account →
            </button>
            <button className="text-red-400 hover:text-red-600 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-xl font-medium text-black mb-1">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
