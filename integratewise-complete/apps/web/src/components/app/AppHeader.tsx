import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDomainSignals } from "../../hooks/useDashboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { signals, loading: signalsLoading } = useDomainSignals('customer-success');
  
  const unreadCount = signals.filter(s => s.severity === 'critical' || s.severity === 'emergency').length;

  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything... (⌘K)"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {unreadCount} urgent
                </span>
              )}
            </div>
            {signalsLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : signals.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              signals.slice(0, 5).map((signal) => (
                <DropdownMenuItem key={signal.id} className="flex flex-col items-start py-2">
                  <span className="font-medium text-sm">{signal.label}</span>
                  <span className="text-xs text-gray-500 line-clamp-1">{signal.summary}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-4 border-l hover:bg-gray-50 rounded-lg py-1 pr-1 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{user?.workspaceName || 'No workspace'}</p>
              </div>
              <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                ) : (
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'G'}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2 border-b">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={() => window.location.href = '/app/settings'}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
