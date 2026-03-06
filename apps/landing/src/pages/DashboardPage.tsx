import { Link } from 'react-router-dom';
import { Cpu, LayoutDashboard, Settings, LogOut, User, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-iw-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-2 rounded-lg bg-iw-accent/20">
              <Cpu className="w-5 h-5 text-iw-accent" />
            </div>
            <span className="font-display font-bold text-lg text-iw-text">
              IntegrateWise
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/app"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-iw-accent/10 text-iw-accent"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/app/workspaces"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-iw-text-secondary hover:bg-white/5 hover:text-iw-text transition-colors"
          >
            <Cpu className="w-5 h-5" />
            <span>Workspaces</span>
          </Link>
          <Link
            to="/app/integrations"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-iw-text-secondary hover:bg-white/5 hover:text-iw-text transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Integrations</span>
          </Link>
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-iw-text-secondary hover:bg-white/5 hover:text-iw-text transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-iw-accent/20 flex items-center justify-center">
              <span className="text-iw-accent font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-iw-text font-medium truncate">{user?.name}</p>
              <p className="text-xs text-iw-text-secondary truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-iw-text-secondary hover:text-iw-text hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-iw-text-secondary" />
              <input
                type="text"
                placeholder="Search your workspace..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-iw-text placeholder:text-iw-text-secondary/50 focus:outline-none focus:border-iw-accent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-iw-text-secondary hover:text-iw-text hover:bg-white/5 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-iw-accent rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl text-iw-text mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-iw-text-secondary">
                Here's what's happening in your cognitive workspace
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Connected Tools', value: '0', color: 'text-iw-accent' },
                { label: 'AI Sessions', value: '0', color: 'text-purple-400' },
                { label: 'Documents', value: '0', color: 'text-green-400' },
                { label: 'Team Members', value: '1', color: 'text-orange-400' },
              ].map((stat, index) => (
                <div key={index} className="p-6 rounded-xl glass-card">
                  <p className="text-sm text-iw-text-secondary mb-1">{stat.label}</p>
                  <p className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Getting Started */}
            <div className="p-8 rounded-xl glass-card mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-semibold text-xl text-iw-text mb-2">
                    Getting Started
                  </h2>
                  <p className="text-iw-text-secondary">
                    Complete these steps to unlock the full power of IntegrateWise
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-iw-accent/20 text-iw-accent text-sm font-mono">
                  0/4 completed
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: 1, title: 'Connect your first tool', desc: 'Link your CRM, ERP, or messaging app' },
                  { step: 2, title: 'Set up your workspace', desc: 'Configure your Personal and Work spaces' },
                  { step: 3, title: 'Invite team members', desc: 'Collaborate in your Team space' },
                  { step: 4, title: 'Enable AI assistance', desc: 'Connect Claude or ChatGPT via MCP' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-iw-text-secondary font-mono text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-iw-text font-medium">{item.title}</p>
                      <p className="text-sm text-iw-text-secondary">{item.desc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/10 text-iw-text hover:bg-white/5">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/app/integrations"
                className="p-6 rounded-xl glass-card hover:bg-white/10 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                  Add Integration
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  Connect your tools and start syncing data
                </p>
              </Link>

              <Link
                to="/app/workspaces"
                className="p-6 rounded-xl glass-card hover:bg-white/10 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                  Configure Spaces
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  Set up Personal, Work, and Team spaces
                </p>
              </Link>

              <a
                href="https://docs.integratewise.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl glass-card hover:bg-white/10 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-green-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                  Read Documentation
                </h3>
                <p className="text-sm text-iw-text-secondary">
                  Learn how to get the most out of IntegrateWise
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
