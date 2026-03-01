/**
 * UnifiedShell - RBAC-Based Single Shell Architecture
 * 
 * One shell that injects the appropriate domain shell based on user role.
 * No manual switching. Role determines view automatically.
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Search } from 'lucide-react';
import { MainSidebar } from './MainSidebar';
import { TopBar } from './TopBar';
import { IntelligencePanel } from './IntelligencePanel';
import { useRBAC } from '@/hooks/useRBAC';
import { getRoleConfig, type RoleName } from '@/lib/rbac/roles';
import { cn } from '@/lib/utils';

// Domain Shell Imports (will be lazy loaded)
import { AccountSuccessShell } from '../domains/account-success/shell';
import { SalesOpsShell } from '../domains/salesops/shell';
import { RevOpsShell } from '../domains/revops/shell';
import { PersonalShell } from '../domains/personal/shell';

interface UnifiedShellProps {
  children: ReactNode;
}

// Shell component mapping
const SHELL_COMPONENTS: Record<string, React.FC<any>> = {
  'account-success': AccountSuccessShell,
  'sales-ops': SalesOpsShell,
  'rev-ops': RevOpsShell,
  'personal': PersonalShell,
  // Add more as they are implemented
};

export function UnifiedShell({ children }: UnifiedShellProps) {
  const { user, role, isLoading } = useRBAC();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Get role configuration
  const roleConfig = getRoleConfig(role || 'member');
  const assignedShell = roleConfig?.shell || 'personal';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // ⌘J - Intelligence Panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIntelligenceOpen((prev) => !prev);
      }
      // ⌘B - Toggle Sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground">
      {/* Main Sidebar - Role-based navigation */}
      <MainSidebar
        role={role as any}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenIntelligence={() => setIntelligenceOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          role={role as any}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Content - Domain Shell Injected Here */}
        <main className={cn(
          "flex-1 overflow-hidden relative",
          assignedShell !== 'personal' && "p-0" // Domain shells handle their own padding
        )}>
          {children}
        </main>
      </div>

      {/* L2 Intelligence Panel */}
      <IntelligencePanel
        isOpen={intelligenceOpen}
        onClose={() => setIntelligenceOpen(false)}
        role={role}
      />

      {/* Command Palette Overlay */}
      {commandPaletteOpen && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          role={role}
        />
      )}
    </div>
  );
}

// Command Palette Component
function CommandPalette({ 
  isOpen, 
  onClose,
  role 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  role: any;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="flex-1 bg-transparent outline-none text-sm"
            autoFocus
          />
          <kbd className="text-xs bg-secondary px-2 py-1 rounded">ESC</kbd>
        </div>
        <div className="p-2 max-h-[400px] overflow-y-auto">
          <div className="text-xs text-muted-foreground px-3 py-2">Suggestions</div>
          {/* Add role-based suggestions */}
        </div>
      </div>
    </div>
  );
}
