import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useSettings,
  useAuditLog,
} from "../../hooks/useSettings";
import {
  RefreshCw,
  Settings,
  Bell,
  Link,
  Shield,
  Database,
  ChevronRight,
  Clock,
  Globe,
  Palette,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Provider icons mapping
const providerIcons: Record<string, string> = {
  salesforce: 'SF',
  slack: 'SL',
  hubspot: 'HS',
  stripe: 'ST',
  notion: 'N',
  jira: 'JI',
  github: 'GH',
  gmail: 'GM',
};

const providerColors: Record<string, string> = {
  salesforce: 'bg-blue-100 text-blue-700',
  slack: 'bg-purple-100 text-purple-700',
  hubspot: 'bg-orange-100 text-orange-700',
  stripe: 'bg-indigo-100 text-indigo-700',
  notion: 'bg-gray-100 text-gray-700',
  jira: 'bg-blue-50 text-blue-600',
  github: 'bg-gray-800 text-white',
  gmail: 'bg-red-100 text-red-700',
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'notifications' | 'security' | 'data'>('general');
  const settings = useSettings();
  const auditLog = useAuditLog({ limit: 10 });

  return (
    <div className="h-full flex">
      {/* Sidebar Navigation */}
      <aside className="w-56 border-r bg-muted/20 p-4 space-y-1">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settings</h2>
        </div>
        
        <NavButton 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')}
          icon={Settings}
          label="General"
        />
        <NavButton 
          active={activeTab === 'integrations'} 
          onClick={() => setActiveTab('integrations')}
          icon={Link}
          label="Integrations"
          badge={settings.integrations.integrations.length}
        />
        <NavButton 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
          icon={Bell}
          label="Notifications"
        />
        <NavButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
          icon={Shield}
          label="Security"
        />
        <NavButton 
          active={activeTab === 'data'} 
          onClick={() => setActiveTab('data')}
          icon={Database}
          label="Data & Privacy"
        />

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">Recent Activity</h3>
          {auditLog.loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          ) : auditLog.logs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {auditLog.logs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-xs">
                  <p className="text-muted-foreground truncate">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'general' && <GeneralSettings settings={settings} />}
        {activeTab === 'integrations' && <IntegrationsSettings settings={settings} />}
        {activeTab === 'notifications' && <NotificationsSettings settings={settings} />}
        {activeTab === 'security' && <SecuritySettings settings={settings} />}
        {activeTab === 'data' && <DataSettings settings={settings} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NAVIGATION COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

function NavButton({ 
  active, 
  onClick, 
  icon: Icon, 
  label,
  badge 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.FC<{ className?: string }>; 
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-foreground text-white' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-muted-foreground/20'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GENERAL SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */

function GeneralSettings({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const { user, workspace } = settings;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium">General Settings</h1>
        <p className="text-muted-foreground">Manage your workspace preferences</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={user.settings?.theme} 
                onValueChange={(v) => user.update({ theme: v as any })}
                disabled={user.loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={user.settings?.language}
                onValueChange={(v) => user.update({ language: v })}
                disabled={user.loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Regional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={user.settings?.timezone}
                onValueChange={(v) => user.update({ timezone: v })}
                disabled={user.loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select 
                value={user.settings?.dateFormat}
                onValueChange={(v) => user.update({ dateFormat: v as any })}
                disabled={user.loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select 
              value={user.settings?.currency}
              onValueChange={(v) => user.update({ currency: v })}
              disabled={user.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default View</Label>
            <Select 
              value={user.settings?.dashboard?.defaultView}
              onValueChange={(v) => user.update({ 
                dashboard: { ...user.settings?.dashboard, defaultView: v as any }
              })}
              disabled={user.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-success">Customer Success</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="revops">RevOps</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="product-eng">Product & Engineering</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="it-admin">IT Admin</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="bizops">BizOps</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Cognitive Signals</p>
              <p className="text-sm text-muted-foreground">Display AI-generated insights in dashboard</p>
            </div>
            <Switch 
              checked={user.settings?.dashboard?.showSignals !== false}
              onCheckedChange={(v) => user.update({ 
                dashboard: { ...user.settings?.dashboard, showSignals: v }
              })}
              disabled={user.loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Display more data with less padding</p>
            </div>
            <Switch 
              checked={user.settings?.dashboard?.compactMode || false}
              onCheckedChange={(v) => user.update({ 
                dashboard: { ...user.settings?.dashboard, compactMode: v }
              })}
              disabled={user.loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   INTEGRATIONS SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */

function IntegrationsSettings({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const { integrations } = settings;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium">Integrations</h1>
        <p className="text-muted-foreground">Connect your tools to sync data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Connected Tools
            {integrations.loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            {integrations.integrations.length} active connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations.integrations.length === 0 && !integrations.loading ? (
            <div className="text-center py-8">
              <Link className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No integrations connected yet</p>
              <Button className="mt-4">Connect Your First Tool</Button>
            </div>
          ) : (
            <>
              {integrations.integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm ${
                      providerColors[integration.provider.toLowerCase()] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {providerIcons[integration.provider.toLowerCase()] || integration.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {integration.lastSyncAt 
                          ? `Last synced ${new Date(integration.lastSyncAt).toLocaleString()}`
                          : 'Never synced'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.status === 'active' ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </Badge>
                    ) : integration.status === 'error' ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Error
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Paused</Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => integrations.disconnect(integration.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatic Sync</p>
              <p className="text-sm text-muted-foreground">Keep data fresh in background</p>
            </div>
            <Switch 
              checked={settings.user.settings?.integrations?.autoSync !== false}
              onCheckedChange={(v) => settings.user.update({
                integrations: { ...settings.user.settings?.integrations, autoSync: v }
              })}
              disabled={settings.user.loading}
            />
          </div>
          <div className="space-y-2">
            <Label>Sync Interval</Label>
            <Select 
              value={String(settings.user.settings?.integrations?.syncInterval || 15)}
              onValueChange={(v) => settings.user.update({
                integrations: { ...settings.user.settings?.integrations, syncInterval: parseInt(v) }
              })}
              disabled={settings.user.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" variant="outline">
        + Add New Integration
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NOTIFICATIONS SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */

function NotificationsSettings({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const { user } = settings;
  const notifications = user.settings?.notifications;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium">Notifications</h1>
        <p className="text-muted-foreground">Control how you receive alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              checked={notifications?.email !== false}
              onCheckedChange={(v) => user.update({
                notifications: { ...notifications, email: v }
              })}
              disabled={user.loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch 
              checked={notifications?.push !== false}
              onCheckedChange={(v) => user.update({
                notifications: { ...notifications, push: v }
              })}
              disabled={user.loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Slack Notifications</p>
              <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
            </div>
            <Switch 
              checked={notifications?.slack || false}
              onCheckedChange={(v) => user.update({
                notifications: { ...notifications, slack: v }
              })}
              disabled={user.loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Digest Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Digest Frequency</Label>
            <Select 
              value={notifications?.digest || 'daily'}
              onValueChange={(v) => user.update({
                notifications: { ...notifications, digest: v as any }
              })}
              disabled={user.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily at 9 AM</SelectItem>
                <SelectItem value="weekly">Weekly on Monday</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECURITY SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */

function SecuritySettings({ settings }: { settings: ReturnType<typeof useSettings> }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium">Security</h1>
        <p className="text-muted-foreground">Manage account security</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">API Keys</p>
              <p className="text-sm text-muted-foreground">Manage API access tokens</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Sign Out All Devices</Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA & PRIVACY SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */

function DataSettings({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const { workspace } = settings;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium">Data & Privacy</h1>
        <p className="text-muted-foreground">Control your data and retention policies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Audit Log Retention</Label>
            <Select 
              value={String(workspace.settings?.dataRetention?.auditLogs || 365)}
              onValueChange={(v) => workspace.update({
                dataRetention: { ...workspace.settings?.dataRetention, auditLogs: parseInt(v) }
              })}
              disabled={workspace.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Deleted Records</Label>
            <Select 
              value={String(workspace.settings?.dataRetention?.deletedRecords || 30)}
              onValueChange={(v) => workspace.update({
                dataRetention: { ...workspace.settings?.dataRetention, deletedRecords: parseInt(v) }
              })}
              disabled={workspace.loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download all your data in a portable format
          </p>
          <div className="flex gap-2">
            <Button variant="outline">Export to JSON</Button>
            <Button variant="outline">Export to CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Delete All Data</p>
              <p className="text-sm text-muted-foreground">Permanently delete all workspace data</p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
