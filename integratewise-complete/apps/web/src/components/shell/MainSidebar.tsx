/**
 * MainSidebar - Role-based navigation
 * Shows different navigation items based on user role
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRBAC } from '@/hooks/useRBAC';
import { getRoleConfig, hasPermission } from '@/lib/rbac/roles';
import { Permission } from '@/lib/rbac/types';

import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  StickyNote,
  Brain,
  Building2,
  HeartPulse,
  Ticket,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Settings,
  Zap,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Command,
  Sparkles,
  ChevronRight,
  type LucideIcon
} from 'lucide-react';

interface MainSidebarProps {
  role: any;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandPalette: () => void;
  onOpenIntelligence: () => void;
}

// Icon mapping
const ICONS: Record<string, LucideIcon> = {
  home: Home,
  today: Calendar,
  tasks: CheckSquare,
  calendar: Calendar,
  docs: FileText,
  notes: StickyNote,
  ai: Brain,
  accounts: Building2,
  health: HeartPulse,
  tickets: Ticket,
  pipeline: TrendingUp,
  deals: DollarSign,
  contacts: Users,
  campaigns: Target,
  analytics: BarChart3,
  settings: Settings,
  intelligence: Zap,
  'deep-dive': Layers,
};

export function MainSidebar({
  role,
  collapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  onOpenIntelligence,
}: MainSidebarProps) {
  const pathname = usePathname();
  const roleConfig = getRoleConfig(role?.id || 'personal-pro');
  const shell = roleConfig?.shell || 'personal';

  // Generate navigation based on role
  const navigation = generateNavigation(role, shell);

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Logo Area */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IW</span>
            </div>
            <span className="font-semibold text-sm">IntegrateWise</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">IW</span>
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Shortcut */}
      {!collapsed && (
        <div className="p-2">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="text-xs bg-card px-1.5 py-0.5 rounded border">⌘K</kbd>
          </button>
        </div>
      )}
      {collapsed && (
        <div className="p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full"
                onClick={onOpenCommandPalette}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Search ⌘K</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border space-y-1">
        {/* AI Assistant */}
        <NavItem
          item={{
            id: 'ai',
            label: 'AI Assistant',
            icon: 'ai',
            href: '#',
            onClick: onOpenIntelligence,
            shortcut: '⌘J',
          }}
          pathname={pathname}
          collapsed={collapsed}
        />

        {/* Settings */}
        <NavItem
          item={{
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
            href: '/settings',
          }}
          pathname={pathname}
          collapsed={collapsed}
        />

        {/* Toggle Sidebar (when collapsed) */}
        {collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full"
                onClick={onToggleCollapse}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}

// Navigation Item Component
function NavItem({
  item,
  pathname,
  collapsed,
}: {
  item: any;
  pathname: string;
  collapsed: boolean;
}) {
  const Icon = ICONS[item.icon] || Home;
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  const content = (
    <Link
      href={item.href}
      onClick={item.onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.shortcut && (
            <kbd className="text-xs bg-card px-1.5 py-0.5 rounded border">
              {item.shortcut}
            </kbd>
          )}
          {item.badge && (
            <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          {item.label} {item.shortcut && `(${item.shortcut})`}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// Generate navigation based on role
function generateNavigation(role: any, shell: string) {
  const roleConfig = getRoleConfig(role?.id || 'personal-pro');
  const defaultModules = roleConfig?.defaultModules || ['home', 'today', 'tasks'];

  // Base navigation for all roles
  const baseNav = [
    { id: 'home', label: 'Home', icon: 'home', href: '/' },
    { id: 'today', label: 'Today', icon: 'today', href: '/today' },
  ];

  // Shell-specific navigation
  switch (shell) {
    case 'account-success':
      return [
        ...baseNav,
        { id: 'accounts', label: 'Accounts', icon: 'accounts', href: '/accounts' },
        { id: 'health', label: 'Health Scores', icon: 'health', href: '/health' },
        { id: 'tasks', label: 'Tasks', icon: 'tasks', href: '/tasks' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/calendar' },
        {
          id: 'deep-dive',
          label: 'Deep Dive',
          icon: 'deep-dive',
          href: '/deep',
          badge: '17',
        },
      ];

    case 'sales-ops':
      return [
        ...baseNav,
        { id: 'pipeline', label: 'Pipeline', icon: 'pipeline', href: '/pipeline' },
        { id: 'deals', label: 'Deals', icon: 'deals', href: '/deals', badge: '7' },
        { id: 'contacts', label: 'Contacts', icon: 'contacts', href: '/contacts' },
        { id: 'tasks', label: 'Tasks', icon: 'tasks', href: '/tasks' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/calendar' },
      ];

    case 'rev-ops':
      return [
        ...baseNav,
        { id: 'dashboard', label: 'Revenue Dashboard', icon: 'analytics', href: '/' },
        { id: 'pipeline', label: 'Pipeline', icon: 'pipeline', href: '/pipeline' },
        { id: 'forecasts', label: 'Forecasts', icon: 'analytics', href: '/forecasts' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics', href: '/analytics' },
      ];

    case 'personal':
    default:
      return [
        ...baseNav,
        { id: 'tasks', label: 'My Tasks', icon: 'tasks', href: '/tasks' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/calendar' },
        { id: 'notes', label: 'Notes', icon: 'notes', href: '/notes' },
        { id: 'docs', label: 'Docs', icon: 'docs', href: '/docs' },
      ];
  }
}
