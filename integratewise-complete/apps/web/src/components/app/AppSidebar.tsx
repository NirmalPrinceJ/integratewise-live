import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Calendar, 
  Brain, 
  Settings,
  Zap,
  RefreshCw
} from "lucide-react";
import { useDashboardStats, useConnectors } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { path: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/accounts", label: "Accounts", icon: Users },
  { path: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/app/calendar", label: "Calendar", icon: Calendar },
  { path: "/app/intelligence", label: "Intelligence", icon: Brain },
];

export function AppSidebar() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { connectors, loading: connectorsLoading } = useConnectors();
  const { user } = useAuth();

  const activeConnectors = connectors.filter(c => c.status === 'active').length;
  const totalConnectors = connectors.length;

  return (
    <aside className="w-64 border-r bg-white/80 backdrop-blur-sm flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
            <span className="font-bold text-sm">IW</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium leading-tight">IntegrateWise</span>
            <span className="text-[10px] text-gray-500 leading-tight">{user?.workspaceName}</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Stats Overview */}
      <div className="px-4 py-3 border-t">
        {statsLoading ? (
          <div className="flex items-center justify-center py-2">
            <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        ) : stats ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Accounts</span>
              <span className="font-medium">{stats.totalAccounts}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Health</span>
              <span className={`font-medium ${
                stats.healthScore > 70 ? 'text-green-600' : 
                stats.healthScore > 40 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {stats.healthScore}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">ARR</span>
              <span className="font-medium">${(stats.totalRevenue / 1000).toFixed(0)}K</span>
            </div>
            {totalConnectors > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Integrations</span>
                <span className={`font-medium ${activeConnectors === totalConnectors ? 'text-green-600' : 'text-amber-600'}`}>
                  {activeConnectors}/{totalConnectors}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t space-y-1">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        
        {/* Quick stats */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Zap className="h-3 w-3" />
            Daily Insights
          </div>
          <p className="text-xs text-gray-600">
            {stats ? `${stats.tasksPending} tasks pending · ${stats.eventsToday} events today` : 'Loading...'}
          </p>
        </div>
      </div>
    </aside>
  );
}
