/**
 * TopBar - Role-based header with workspace label and actions
 */

'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getRoleConfig } from '@/lib/rbac/roles';
import { useRBAC } from '@/hooks/useRBAC';

import {
  PanelLeftOpen,
  PanelLeftClose,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Shield,
  Building2,
  Command,
  Sparkles,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';

interface TopBarProps {
  role: any;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
}

// Shell display names
const SHELL_LABELS: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  'account-success': { label: 'Customer Success', icon: Building2, color: 'bg-emerald-500' },
  'sales-ops': { label: 'Sales', icon: User, color: 'bg-blue-500' },
  'rev-ops': { label: 'Revenue Operations', icon: Shield, color: 'bg-purple-500' },
  'personal': { label: 'Personal', icon: User, color: 'bg-violet-500' },
  'marketing': { label: 'Marketing', icon: Sparkles, color: 'bg-pink-500' },
  'admin': { label: 'Admin', icon: Shield, color: 'bg-slate-500' },
};

export function TopBar({
  role,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenCommandPalette,
}: TopBarProps) {
  const { user, logout } = useRBAC();
  const roleConfig = getRoleConfig(role?.id || 'personal-pro');
  const shell = roleConfig?.shell || 'personal';
  const shellInfo = SHELL_LABELS[shell] || SHELL_LABELS['personal'];
  const Icon = shellInfo.icon;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile/Tablet Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSidebar}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        {/* Workspace Label */}
        <div className="flex items-center gap-2">
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', shellInfo.color)}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">{shellInfo.label} Workspace</h1>
            <p className="text-[10px] text-muted-foreground">{roleConfig?.title || 'User'}</p>
          </div>
        </div>
      </div>

      {/* Center - Breadcrumb or Search Trigger */}
      <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="text-[10px] bg-card px-1.5 py-0.5 rounded border">⌘K</kbd>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* RBAC Badge */}
        <Badge variant="secondary" className="hidden sm:flex items-center gap-1 text-[10px]">
          <Shield className="w-3 h-3" />
          {role?.id?.toUpperCase() || 'USER'}
        </Badge>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-sm text-muted-foreground text-center">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
