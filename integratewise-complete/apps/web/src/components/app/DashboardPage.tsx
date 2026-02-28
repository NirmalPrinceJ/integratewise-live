import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Bell,
  Circle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  Brain,
  Shield,
  MessageSquare,
  ChevronUp,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle,
  BarChart3,
  DollarSign,
  Factory,
  Users,
  Briefcase,
  Settings,
  FileText,
  RefreshCw,
  HeartHandshake,
  Megaphone,
  Code,
  Wrench,
  ShoppingCart,
  GraduationCap,
  User,
  LineChart,
  LayoutDashboard,
} from 'lucide-react';
import { Logo } from '../Logo';
import {
  useDashboardStats,
  useDomainEntities,
  useDomainSignals,
  useConnectors,
} from '../../hooks/useDashboard';

/* ═══════════════════════════════════════════════════════════════════════
   DOMAIN CONFIGURATION — All 12 Domain Views
   ═══════════════════════════════════════════════════════════════════════ */

type DomainId = 
  | 'customer-success' 
  | 'sales' 
  | 'revops' 
  | 'marketing'
  | 'product-eng'
  | 'finance'
  | 'service'
  | 'procurement'
  | 'it-admin'
  | 'education'
  | 'personal'
  | 'bizops';

interface DomainConfig {
  id: DomainId;
  label: string;
  icon: React.FC<{ className?: string }>;
  sidebarItems: { label: string; active: boolean }[];
  tableHeader: string;
  columns: string[];
  entityTypes: string[];
}

const domainConfigs: DomainConfig[] = [
  {
    id: 'customer-success',
    label: 'Customer Success',
    icon: HeartHandshake,
    sidebarItems: [
      { label: 'Accounts', active: true },
      { label: 'Health Scores', active: false },
      { label: 'Playbooks', active: false },
      { label: 'NPS', active: false },
    ],
    tableHeader: 'Account Health',
    columns: ['Account', 'Health', 'Stage', 'ARR', 'Risk'],
    entityTypes: ['account', 'contact', 'subscription'],
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: TrendingUp,
    sidebarItems: [
      { label: 'Pipeline', active: true },
      { label: 'Leads', active: false },
      { label: 'Proposals', active: false },
      { label: 'Forecast', active: false },
    ],
    tableHeader: 'Active Deals',
    columns: ['Deal', 'Value', 'Stage', 'Close Date', 'Confidence'],
    entityTypes: ['opportunity', 'deal', 'lead', 'quote'],
  },
  {
    id: 'revops',
    label: 'RevOps',
    icon: BarChart3,
    sidebarItems: [
      { label: 'Metrics', active: true },
      { label: 'Attribution', active: false },
      { label: 'Territory', active: false },
      { label: 'Quota', active: false },
    ],
    tableHeader: 'Revenue Metrics',
    columns: ['Metric', 'Current', 'Target', 'Variance', 'Trend'],
    entityTypes: ['metric', 'forecast', 'territory'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    sidebarItems: [
      { label: 'Campaigns', active: true },
      { label: 'Leads', active: false },
      { label: 'Content', active: false },
      { label: 'Analytics', active: false },
    ],
    tableHeader: 'Active Campaigns',
    columns: ['Campaign', 'Status', 'Leads', 'MQLs', 'ROI'],
    entityTypes: ['campaign', 'lead', 'content', 'event'],
  },
  {
    id: 'product-eng',
    label: 'Product & Eng',
    icon: Code,
    sidebarItems: [
      { label: 'Roadmap', active: true },
      { label: 'Sprints', active: false },
      { label: 'Bugs', active: false },
      { label: 'Features', active: false },
    ],
    tableHeader: 'Product Items',
    columns: ['Item', 'Type', 'Priority', 'Status', 'Owner'],
    entityTypes: ['feature', 'bug', 'story', 'epic', 'sprint'],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    sidebarItems: [
      { label: 'Overview', active: true },
      { label: 'Invoices', active: false },
      { label: 'Expenses', active: false },
      { label: 'Reports', active: false },
    ],
    tableHeader: 'Financial Summary',
    columns: ['Item', 'Amount', 'Status', 'Due Date', 'Category'],
    entityTypes: ['invoice', 'transaction', 'expense', 'budget'],
  },
  {
    id: 'service',
    label: 'Service',
    icon: Wrench,
    sidebarItems: [
      { label: 'Tickets', active: true },
      { label: 'SLAs', active: false },
      { label: 'Knowledge', active: false },
      { label: 'Field', active: false },
    ],
    tableHeader: 'Service Tickets',
    columns: ['Ticket', 'Priority', 'Status', 'Assignee', 'SLA'],
    entityTypes: ['ticket', 'case', 'article', 'work_order'],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    sidebarItems: [
      { label: 'Vendors', active: true },
      { label: 'POs', active: false },
      { label: 'Contracts', active: false },
      { label: 'Spend', active: false },
    ],
    tableHeader: 'Purchase Orders',
    columns: ['PO', 'Vendor', 'Amount', 'Status', 'Delivery'],
    entityTypes: ['vendor', 'purchase_order', 'contract', 'invoice'],
  },
  {
    id: 'it-admin',
    label: 'IT Admin',
    icon: Settings,
    sidebarItems: [
      { label: 'Assets', active: true },
      { label: 'Users', active: false },
      { label: 'Access', active: false },
      { label: 'Security', active: false },
    ],
    tableHeader: 'IT Assets',
    columns: ['Asset', 'Type', 'User', 'Status', 'Expiry'],
    entityTypes: ['asset', 'user', 'license', 'access_policy'],
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    sidebarItems: [
      { label: 'Students', active: true },
      { label: 'Courses', active: false },
      { label: 'Attendance', active: false },
      { label: 'Grades', active: false },
    ],
    tableHeader: 'Student Roster',
    columns: ['Student', 'Course', 'Progress', 'Attendance', 'Grade'],
    entityTypes: ['student', 'course', 'enrollment', 'assignment'],
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    sidebarItems: [
      { label: 'Tasks', active: true },
      { label: 'Goals', active: false },
      { label: 'Time', active: false },
      { label: 'Finance', active: false },
    ],
    tableHeader: 'My Items',
    columns: ['Item', 'Type', 'Due', 'Priority', 'Status'],
    entityTypes: ['task', 'goal', 'habit', 'reminder'],
  },
  {
    id: 'bizops',
    label: 'BizOps',
    icon: LineChart,
    sidebarItems: [
      { label: 'KPIs', active: true },
      { label: 'Projects', active: false },
      { label: 'Processes', active: false },
      { label: 'Team', active: false },
    ],
    tableHeader: 'Business Operations',
    columns: ['Initiative', 'Owner', 'Status', 'Progress', 'Impact'],
    entityTypes: ['project', 'process', 'kpi', 'initiative'],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export function DashboardPage() {
  const [activeDomain, setActiveDomain] = useState<DomainId>('customer-success');
  
  // Real data hooks
  const { stats, loading: statsLoading } = useDashboardStats();
  const { entities: domainEntities, loading: entitiesLoading } = useDomainEntities(activeDomain);
  const { signals, loading: signalsLoading } = useDomainSignals(activeDomain);
  const { connectors, loading: connectorsLoading } = useConnectors();
  
  const domainConfig = domainConfigs.find(d => d.id === activeDomain)!;

  // Transform domain entities to table rows
  const tableRows = domainEntities.map(entity => ({
    cells: getTableCells(entity, activeDomain),
    statusType: entity.status as 'good' | 'warning' | 'critical',
    entityId: entity.id,
  }));

  return (
    <div className="h-full flex flex-col">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="h-14 border-b bg-white flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <Logo className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm">IntegrateWise</span>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search across all domains..."
              className="w-full pl-9 pr-4 py-1.5 rounded-md border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg relative">
            <Bell className="h-4 w-4" />
            {signals.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-foreground rounded-full" />
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            NP
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Domain Sidebar */}
        <aside className="w-56 border-r bg-muted/20 flex flex-col">
          {/* Domain Switcher - 12 Domain Grid */}
          <div className="p-3 border-b">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Select Domain</p>
            <div className="grid grid-cols-4 gap-1">
              {domainConfigs.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${
                    activeDomain === domain.id
                      ? 'bg-foreground text-white'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                  title={domain.label}
                >
                  <domain.icon className="h-4 w-4 mb-1" />
                  <span className="text-[9px] leading-none text-center line-clamp-1">{domain.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Items */}
          <nav className="flex-1 p-2 space-y-0.5">
            {domainConfig.sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  item.active
                    ? 'bg-foreground text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.active && <div className="w-1 h-1 rounded-full bg-white" />}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Stats Overview */}
          <div className="p-3 border-t space-y-2">
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : stats ? (
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Accounts</span>
                  <span className="font-medium">{stats.totalAccounts}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">ARR</span>
                  <span className="font-medium">${(stats.totalRevenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Health</span>
                  <span className={`font-medium ${stats.healthScore > 70 ? 'text-green-600' : stats.healthScore > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.healthScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">At Risk</span>
                  <span className={`font-medium ${stats.churnRisk > 20 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.churnRisk}%
                  </span>
                </div>
              </>
            ) : null}
          </div>

          {/* Connector Status */}
          <div className="p-3 border-t space-y-1">
            {connectorsLoading ? (
              <div className="text-xs text-muted-foreground">Loading...</div>
            ) : (
              connectors.slice(0, 3).map((conn) => (
                <div key={conn.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={`w-1.5 h-1.5 rounded-full ${conn.status === 'active' ? 'bg-green-500' : conn.status === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  {conn.name}: {conn.status === 'active' ? 'Active' : conn.status}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">{domainConfig.tableHeader}</h2>
              <p className="text-sm text-muted-foreground">
                {entitiesLoading ? 'Loading...' : `${domainEntities.length} items`}
              </p>
            </div>
            <button className="px-3 py-1.5 bg-foreground text-white text-sm rounded-md hover:bg-foreground/90 transition-colors">
              + Add New
            </button>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto">
            {entitiesLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : tableRows.length > 0 ? (
              <table className="w-full">
                <thead className="bg-muted/30 sticky top-0">
                  <tr>
                    {domainConfig.columns.map((col) => (
                      <th key={col} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                    <th className="px-6 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      {row.cells.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-3 text-sm">
                          {cellIdx === 0 ? (
                            <span className="font-medium">{cell}</span>
                          ) : cellIdx === row.cells.length - 1 && row.statusType ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              row.statusType === 'good' ? 'bg-green-100 text-green-800' :
                              row.statusType === 'warning' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-3">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Layers className="h-12 w-12 mb-4 opacity-30" />
                <p>No data available for this domain</p>
                <p className="text-sm mt-1">Connect your tools to see {domainConfig.label} data</p>
              </div>
            )}
          </div>

          {/* L2 Signal Bar */}
          <SignalBar signals={signals} loading={signalsLoading} />
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   L2 SIGNAL BAR COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

function SignalBar({ signals, loading }: { signals: any[]; loading: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeSignal = signals[activeIdx] || null;

  useEffect(() => {
    if (signals.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % signals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [signals.length]);

  if (loading) {
    return (
      <div className="border-t p-3 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Loading signals...
        </div>
      </div>
    );
  }

  if (!activeSignal) {
    return (
      <div className="border-t p-3 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-3 w-3" />
          No active signals. System monitoring for anomalies.
        </div>
      </div>
    );
  }

  return (
    <div className="border-t">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-white border-b overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">Cognitive Layer (L2)</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {signals.length} active signals
                </span>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {signals.map((sig, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      i === activeIdx
                        ? 'bg-foreground text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {sig.label}
                  </button>
                ))}
              </div>
              <div className={`p-3 rounded-lg border ${
                activeSignal.severity === 'emergency' ? 'bg-red-50 border-red-200' :
                activeSignal.severity === 'critical' ? 'bg-orange-50 border-orange-200' :
                activeSignal.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className={`h-4 w-4 ${
                    activeSignal.severity === 'emergency' ? 'text-red-600' :
                    activeSignal.severity === 'critical' ? 'text-orange-600' :
                    activeSignal.severity === 'warning' ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                  <span className="font-medium text-sm">{activeSignal.summary}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{activeSignal.detail}</p>
                <div className="flex gap-2">
                  {activeSignal.actions.map((action: string) => (
                    <button
                      key={action}
                      className="px-2 py-1 bg-white text-xs rounded border hover:bg-muted/50 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {activeSignal.summary.slice(0, 60)}...
          </span>
          {(activeSignal.severity === 'emergency' || activeSignal.severity === 'critical') && (
            <span className="px-1.5 py-0.5 bg-foreground text-white text-[10px] rounded">
              {activeSignal.severity === 'emergency' ? 'URGENT' : 'CRITICAL'}
            </span>
          )}
        </div>
        <ChevronUp className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? '' : 'rotate-180'}`} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS — All 12 Domains
   ═══════════════════════════════════════════════════════════════════════ */

function getTableCells(entity: any, domain: DomainId): string[] {
  switch (domain) {
    case 'customer-success':
      return [
        entity.name,
        `${entity.healthScore || 0}%`,
        entity.metadata?.stage || 'Onboarding',
        entity.value ? `$${(entity.value / 1000).toFixed(0)}K` : '$0',
        entity.healthScore && entity.healthScore < 50 ? 'High' : entity.healthScore && entity.healthScore < 75 ? 'Medium' : 'Low',
      ];
    case 'sales':
      return [
        entity.name,
        entity.value ? `$${(entity.value / 1000).toFixed(0)}K` : '$0',
        entity.stage || 'Qualified',
        entity.metadata?.closeDate || '-',
        entity.healthScore ? `${entity.healthScore}%` : '-',
      ];
    case 'revops':
      return [
        entity.name,
        entity.metadata?.current || '-',
        entity.metadata?.target || '-',
        entity.metadata?.variance || '-',
        entity.healthScore && entity.healthScore > 70 ? '↗ Up' : entity.healthScore && entity.healthScore < 40 ? '↘ Down' : '→ Flat',
      ];
    case 'marketing':
      return [
        entity.name,
        entity.status === 'good' ? 'Active' : entity.status === 'warning' ? 'Paused' : 'Ended',
        String(entity.metadata?.leads || 0),
        String(entity.metadata?.mqls || 0),
        entity.metadata?.roi ? `${entity.metadata.roi}x` : '-',
      ];
    case 'product-eng':
      return [
        entity.name,
        entity.entityType || 'Feature',
        entity.metadata?.priority || 'Medium',
        entity.status === 'good' ? 'Done' : entity.status === 'warning' ? 'In Progress' : 'Blocked',
        entity.metadata?.owner || '-',
      ];
    case 'finance':
      return [
        entity.name,
        entity.value ? `$${(entity.value / 1000).toFixed(0)}K` : '$0',
        entity.status === 'good' ? 'Paid' : entity.status === 'warning' ? 'Pending' : 'Overdue',
        entity.metadata?.dueDate || '-',
        entity.metadata?.category || '-',
      ];
    case 'service':
      return [
        entity.name,
        entity.metadata?.priority || 'Medium',
        entity.status === 'good' ? 'Resolved' : entity.status === 'warning' ? 'In Progress' : 'Open',
        entity.metadata?.assignee || '-',
        entity.metadata?.sla || '-',
      ];
    case 'procurement':
      return [
        entity.name,
        entity.metadata?.vendor || '-',
        entity.value ? `$${(entity.value / 1000).toFixed(0)}K` : '$0',
        entity.status === 'good' ? 'Approved' : entity.status === 'warning' ? 'Pending' : 'Rejected',
        entity.metadata?.delivery || '-',
      ];
    case 'it-admin':
      return [
        entity.name,
        entity.entityType || 'Device',
        entity.metadata?.user || 'Unassigned',
        entity.status === 'good' ? 'Active' : entity.status === 'warning' ? 'Maintenance' : 'Retired',
        entity.metadata?.expiry || '-',
      ];
    case 'education':
      return [
        entity.name,
        entity.metadata?.course || '-',
        `${entity.metadata?.progress || 0}%`,
        `${entity.metadata?.attendance || 0}%`,
        entity.metadata?.grade || '-',
      ];
    case 'personal':
      return [
        entity.name,
        entity.entityType || 'Task',
        entity.metadata?.due || '-',
        entity.metadata?.priority || 'Medium',
        entity.status === 'good' ? 'Done' : entity.status === 'warning' ? 'In Progress' : 'To Do',
      ];
    case 'bizops':
      return [
        entity.name,
        entity.metadata?.owner || '-',
        entity.status === 'good' ? 'On Track' : entity.status === 'warning' ? 'At Risk' : 'Blocked',
        `${entity.metadata?.progress || 0}%`,
        entity.metadata?.impact || '-',
      ];
    default:
      return [entity.name, '-', '-', '-'];
  }
}
