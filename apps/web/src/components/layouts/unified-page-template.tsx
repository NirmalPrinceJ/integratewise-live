/**
 * Unified Page Template - Day 3 Best Practice
 * 
 * ALL pages MUST use this template to ensure consistent UX.
 * Layout: Header + KPI band (optional) + Main content + Right panel (optional) + Action bar (optional)
 * 
 * No custom one-off layouts allowed - avoids UI entropy.
 */

"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { PageHeader } from "@/components/spine/page-header";
import { 
  AlertCircle, 
  Loader2, 
  FolderOpen,
  ChevronRight,
  X
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface KPIItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'primary';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ActionItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
  disabled?: boolean;
}

export interface FilterItem {
  id: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'toggle';
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export type ViewMode = 'table' | 'cards' | 'kanban' | 'timeline';

export interface UnifiedPageTemplateProps {
  // Required
  title: string;
  children: ReactNode;
  
  // Optional header
  description?: string;
  stageId?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
  
  // Optional KPI band
  kpis?: KPIItem[];
  showKpiBand?: boolean;
  
  // Optional filters & view controls
  filters?: FilterItem[];
  viewModes?: ViewMode[];
  currentViewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  
  // Optional right panel
  rightPanel?: ReactNode;
  rightPanelTitle?: string;
  rightPanelOpen?: boolean;
  onRightPanelClose?: () => void;
  
  // Optional action bar (bottom)
  actionBar?: ReactNode;
  selectedCount?: number;
  bulkActions?: ActionItem[];
  
  // State handling
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
  };
  
  // Layout options
  variant?: 'default' | 'compact' | 'wide';
  className?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-3 h-3" />}
          {item.href ? (
            <a href={item.href} className="hover:text-gray-900 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

function KPIBand({ kpis }: { kpis: KPIItem[] }) {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    primary: 'bg-[#2D7A3E] border-[#2D7A3E] text-white',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-xl border ${colorClasses[kpi.color || 'gray']}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${kpi.color === 'primary' ? 'text-green-100' : 'text-gray-500'}`}>
              {kpi.label}
            </span>
            {kpi.icon && <span className="text-gray-400">{kpi.icon}</span>}
          </div>
          <p className={`text-2xl font-bold ${kpi.color === 'primary' ? 'text-white' : 'text-gray-900'}`}>
            {kpi.value}
          </p>
          {kpi.change && (
            <p className={`text-xs mt-1 ${changeColors[kpi.changeType || 'neutral']}`}>
              {kpi.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ViewModeToggle({ 
  modes, 
  current, 
  onChange 
}: { 
  modes: ViewMode[]; 
  current: ViewMode; 
  onChange: (mode: ViewMode) => void;
}) {
  const modeIcons: Record<ViewMode, string> = {
    table: '☰',
    cards: '⊞',
    kanban: '▥',
    timeline: '━',
  };

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            current === mode
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="mr-1">{modeIcons[mode]}</span>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-200">
      <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
      <p className="text-red-700 font-medium">Error</p>
      <p className="text-red-600 text-sm mt-1">{message}</p>
    </div>
  );
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: NonNullable<UnifiedPageTemplateProps['emptyState']>) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
      <div className="text-gray-400 mb-4">
        {icon || <FolderOpen className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm text-center max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
}

function RightPanel({ 
  title, 
  children, 
  onClose 
}: { 
  title?: string; 
  children: ReactNode; 
  onClose?: () => void;
}) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title || 'Details'}</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActionBar({ 
  selectedCount, 
  actions, 
  children 
}: { 
  selectedCount?: number; 
  actions?: ActionItem[];
  children?: ReactNode;
}) {
  const variantClasses = {
    primary: 'bg-[#2D7A3E] text-white hover:bg-[#246832]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  if (!actions?.length && !children) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between z-40">
      <div className="flex items-center gap-4">
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} selected
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actions?.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              variantClasses[action.variant || 'secondary']
            } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Template Component
// ============================================================================

export function UnifiedPageTemplate({
  // Required
  title,
  children,
  
  // Optional header
  description,
  stageId,
  breadcrumbs,
  headerActions,
  
  // Optional KPI band
  kpis,
  showKpiBand = true,
  
  // Optional filters & view controls
  filters,
  viewModes,
  currentViewMode = 'table',
  onViewModeChange,
  
  // Optional right panel
  rightPanel,
  rightPanelTitle,
  rightPanelOpen = false,
  onRightPanelClose,
  
  // Optional action bar
  actionBar,
  selectedCount,
  bulkActions,
  
  // State handling
  loading = false,
  error = null,
  isEmpty = false,
  emptyState,
  
  // Layout options
  variant = 'default',
  className = '',
}: UnifiedPageTemplateProps) {
  const paddingClasses = {
    default: 'p-6',
    compact: 'p-4',
    wide: 'p-8',
  };

  // Render content based on state
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (isEmpty && emptyState) return <EmptyState {...emptyState} />;
    return children;
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main content area */}
      <div className={`flex-1 ${paddingClasses[variant]} overflow-y-auto ${rightPanelOpen ? 'pr-0' : ''}`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        
        {/* Page Header */}
        <PageHeader 
          title={title} 
          description={description} 
          stageId={stageId} 
          actions={headerActions} 
        />
        
        {/* KPI Band */}
        {showKpiBand && kpis && kpis.length > 0 && <KPIBand kpis={kpis} />}
        
        {/* Filters & View Controls */}
        {(filters || viewModes) && (
          <div className="flex items-center justify-between mb-4">
            {/* Filters placeholder - can be extended */}
            <div className="flex items-center gap-2">
              {/* Filter components would go here */}
            </div>
            
            {/* View mode toggle */}
            {viewModes && viewModes.length > 1 && onViewModeChange && (
              <ViewModeToggle 
                modes={viewModes} 
                current={currentViewMode} 
                onChange={onViewModeChange} 
              />
            )}
          </div>
        )}
        
        {/* Main Content */}
        <div className={bulkActions?.length ? 'pb-20' : ''}>
          {renderContent()}
        </div>
      </div>
      
      {/* Right Panel */}
      {rightPanelOpen && rightPanel && (
        <RightPanel title={rightPanelTitle} onClose={onRightPanelClose}>
          {rightPanel}
        </RightPanel>
      )}
      
      {/* Action Bar */}
      {(bulkActions?.length || actionBar) && (
        <ActionBar selectedCount={selectedCount} actions={bulkActions}>
          {actionBar}
        </ActionBar>
      )}
    </div>
  );
}

// ============================================================================
// Preset Templates for Common Page Types
// ============================================================================

/**
 * List Page Template - For table/list views
 */
export function ListPageTemplate(props: Omit<UnifiedPageTemplateProps, 'viewModes' | 'currentViewMode'>) {
  return <UnifiedPageTemplate {...props} viewModes={['table', 'cards']} currentViewMode="table" />;
}

/**
 * Dashboard Page Template - For analytics/overview pages
 */
export function DashboardPageTemplate(props: Omit<UnifiedPageTemplateProps, 'showKpiBand'>) {
  return <UnifiedPageTemplate {...props} showKpiBand={true} />;
}

/**
 * Detail Page Template - For entity detail views with right panel
 */
export function DetailPageTemplate(props: UnifiedPageTemplateProps) {
  return <UnifiedPageTemplate {...props} rightPanelOpen={true} />;
}

/**
 * Kanban Page Template - For board views (pipeline, stages)
 */
export function KanbanPageTemplate(props: Omit<UnifiedPageTemplateProps, 'viewModes' | 'currentViewMode'>) {
  return <UnifiedPageTemplate {...props} viewModes={['kanban', 'table']} currentViewMode="kanban" showKpiBand={false} />;
}

// ============================================================================
// Export
// ============================================================================

export default UnifiedPageTemplate;
