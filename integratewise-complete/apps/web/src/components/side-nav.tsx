"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Target,
  FileText,
  Settings,
  Zap,
  Brain,
  Activity,
  Calendar,
  Briefcase,
  Layers,
  FolderOpen,
  RefreshCw,
  Shield,
  ClipboardList,
  Lightbulb,
  GitBranch,
  BarChart3,
} from "lucide-react"

const navItems = [
  // Layer 1: Operational Surface
  { href: "/today", label: "My Cockpit", icon: Calendar, section: "workspace" },
  { href: "/business/dashboard", label: "Business Hub", icon: LayoutDashboard, section: "workspace" },
  { href: "/cs/health", label: "CS Health", icon: Users, section: "workspace" },

  // Layer 2: Cognitive Layer
  { href: "/spine", label: "Spine (SSOT)", icon: Activity, section: "cognitive" },
  { href: "/context", label: "Context", icon: FolderOpen, section: "cognitive" },
  { href: "/knowledge", label: "Knowledge", icon: Lightbulb, section: "cognitive" },
  { href: "/bridge", label: "Bridge", icon: Layers, section: "cognitive" },
  { href: "/think", label: "Think", icon: Brain, section: "cognitive" },
  { href: "/act", label: "Act", icon: Zap, section: "cognitive" },
  { href: "/adjust", label: "Adjust", icon: RefreshCw, section: "cognitive" },
  { href: "/govern", label: "Govern", icon: Shield, section: "cognitive" },
  { href: "/n8n", label: "n8n Workflows", icon: Zap, section: "cognitive" },
  { href: "/workflow-builder", label: "Workflow Builder", icon: GitBranch, section: "cognitive" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, section: "cognitive" },

  // Admin
  { href: "/admin", label: "Admin", icon: Settings, section: "admin" },
  { href: "/admin/audit", label: "Audit Trail", icon: ClipboardList, section: "admin" },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 min-h-screen bg-card border-r p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
