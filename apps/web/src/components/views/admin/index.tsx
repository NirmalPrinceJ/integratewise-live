/**
 * Admin Views - System Administration
 * All views use UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  DashboardPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  UserCog,
  Shield,
  Users,
  FileText,
  ToggleLeft,
  LayoutDashboard,
  Plug,
  Plus,
  Check,
  X,
  AlertTriangle,
  Settings,
  Lock,
  Eye,
  Edit,
  Trash2,
  RefreshCcw,
  Activity
} from "lucide-react"

// ============================================================================
// Roles View
// ============================================================================

const mockRoles = [
  { id: "role-001", name: "Admin", description: "Full system access", users: 3, permissions: 45 },
  { id: "role-002", name: "Sales Manager", description: "Sales team management", users: 5, permissions: 28 },
  { id: "role-003", name: "Sales Rep", description: "Sales operations", users: 24, permissions: 18 },
  { id: "role-004", name: "CS Manager", description: "Customer success management", users: 4, permissions: 25 },
  { id: "role-005", name: "Viewer", description: "Read-only access", users: 12, permissions: 8 },
]

export function RolesView() {
  const [roles] = useState(mockRoles)
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const kpis: KPIItem[] = [
    { label: "Total Roles", value: "8", color: "primary", icon: <UserCog className="w-4 h-4" /> },
    { label: "Active Users", value: "48", color: "green" },
    { label: "Custom Roles", value: "5" },
    { label: "Permissions", value: "45" },
  ]

  const selectedRole = roles.find(r => r.id === selected)

  return (
    <ListPageTemplate
      title="Roles"
      description="Manage user roles"
      stageId="ADMIN-ROLES-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Roles" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Create Role</button>}
      rightPanel={selectedRole ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Role Name</h4><p className="text-gray-900 font-medium">{selectedRole.name}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4><p className="text-gray-600">{selectedRole.description}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Users</h4><p className="text-gray-900">{selectedRole.users}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Permissions</h4><p className="text-gray-900">{selectedRole.permissions}</p></div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h4>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"><Edit className="w-4 h-4" />Edit</button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" />Delete</button>
            </div>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Role Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Role</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Description</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Users</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelected(role.id); setPanelOpen(true); }}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-purple-50 rounded-lg"><UserCog className="w-4 h-4 text-purple-600" /></div><span className="text-sm font-medium text-gray-900">{role.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{role.description}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{role.users}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{role.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Permissions View
// ============================================================================

export function PermissionsView() {
  const permissions = [
    { id: 1, name: "deals.read", category: "Sales", description: "View deals", roles: ["Admin", "Sales Manager", "Sales Rep"] },
    { id: 2, name: "deals.write", category: "Sales", description: "Create/edit deals", roles: ["Admin", "Sales Manager"] },
    { id: 3, name: "deals.delete", category: "Sales", description: "Delete deals", roles: ["Admin"] },
    { id: 4, name: "customers.read", category: "CS", description: "View customers", roles: ["Admin", "CS Manager", "Sales Manager"] },
    { id: 5, name: "admin.users", category: "Admin", description: "Manage users", roles: ["Admin"] },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Permissions", value: "45", color: "primary" },
    { label: "Categories", value: "8" },
    { label: "Custom Rules", value: "12" },
    { label: "Last Updated", value: "2h ago", icon: <RefreshCcw className="w-4 h-4" /> },
  ]

  return (
    <ListPageTemplate
      title="Permissions"
      description="Manage system permissions"
      stageId="ADMIN-PERMS-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Permissions" }]}
      kpis={kpis}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Permission</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Description</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg"><Lock className="w-4 h-4 text-blue-600" /></div><span className="text-sm font-mono text-gray-900">{perm.name}</span></div></td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{perm.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600">{perm.description}</td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{perm.roles.slice(0, 2).map((role, idx) => (<span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{role}</span>))}{perm.roles.length > 2 && <span className="text-xs text-gray-500">+{perm.roles.length - 2}</span>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Teams View
// ============================================================================

export function TeamsView() {
  const teams = [
    { id: 1, name: "Sales", members: 12, manager: "John Smith", active: true },
    { id: 2, name: "Customer Success", members: 8, manager: "Sarah Chen", active: true },
    { id: 3, name: "Marketing", members: 6, manager: "Mike Johnson", active: true },
    { id: 4, name: "Engineering", members: 15, manager: "Alex Kim", active: true },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Teams", value: "6", color: "primary", icon: <Users className="w-4 h-4" /> },
    { label: "Total Members", value: "48" },
    { label: "Active", value: "6", color: "green" },
    { label: "Avg Team Size", value: "8" },
  ]

  return (
    <ListPageTemplate
      title="Teams"
      description="Manage organizational teams"
      stageId="ADMIN-TEAMS-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Teams" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Create Team</button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-lg"><Users className="w-5 h-5 text-green-600" /></div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${team.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{team.active ? 'Active' : 'Inactive'}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{team.name}</h4>
            <p className="text-xs text-gray-500 mb-3">Manager: {team.manager}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{team.members} members</span>
              <button className="text-[#2D7A3E] hover:underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Policies View
// ============================================================================

export function PoliciesView() {
  const policies = [
    { id: 1, name: "Data Retention", description: "Retain data for 7 years", status: "active", lastUpdated: "2024-01-15" },
    { id: 2, name: "Password Policy", description: "Min 12 chars, special required", status: "active", lastUpdated: "2024-01-10" },
    { id: 3, name: "Session Timeout", description: "30 min inactivity timeout", status: "active", lastUpdated: "2023-12-01" },
    { id: 4, name: "IP Whitelist", description: "Restrict to approved IPs", status: "inactive", lastUpdated: "2023-11-15" },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Policies", value: "12", color: "primary" },
    { label: "Active", value: "10", color: "green" },
    { label: "Inactive", value: "2", color: "gray" },
    { label: "Compliance", value: "100%", icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <ListPageTemplate
      title="Policies"
      description="Manage security policies"
      stageId="ADMIN-POLICIES-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Policies" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Policy</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Policy</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Description</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-amber-50 rounded-lg"><FileText className="w-4 h-4 text-amber-600" /></div><span className="text-sm font-medium text-gray-900">{policy.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{policy.description}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${policy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{policy.status}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{policy.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Features View (Feature Flags)
// ============================================================================

export function FeaturesView() {
  const features = [
    { id: 1, name: "ai_suggestions", description: "AI-powered suggestions", enabled: true, rollout: 100 },
    { id: 2, name: "new_dashboard", description: "New dashboard UI", enabled: true, rollout: 50 },
    { id: 3, name: "beta_reports", description: "Beta reporting features", enabled: false, rollout: 0 },
    { id: 4, name: "dark_mode", description: "Dark mode theme", enabled: true, rollout: 100 },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Features", value: "24", color: "primary" },
    { label: "Enabled", value: "18", color: "green" },
    { label: "Disabled", value: "6", color: "gray" },
    { label: "In Rollout", value: "3", color: "yellow" },
  ]

  return (
    <ListPageTemplate
      title="Features"
      description="Manage feature flags"
      stageId="ADMIN-FEATURES-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Features" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Feature</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Feature</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Description</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Rollout</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 rounded-lg"><ToggleLeft className="w-4 h-4 text-indigo-600" /></div><span className="text-sm font-mono text-gray-900">{feature.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{feature.description}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${feature.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{feature.enabled ? 'Enabled' : 'Disabled'}</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-gray-100 rounded-full h-2"><div className="bg-[#2D7A3E] h-2 rounded-full" style={{ width: `${feature.rollout}%` }}></div></div><span className="text-xs text-gray-500">{feature.rollout}%</span></div></td>
                <td className="px-4 py-3"><button className={`p-1 rounded ${feature.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{feature.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Views View (Custom Views)
// ============================================================================

export function ViewsView() {
  const views = [
    { id: 1, name: "My Deals", owner: "John Smith", type: "list", shared: false },
    { id: 2, name: "Team Pipeline", owner: "Sales Manager", type: "kanban", shared: true },
    { id: 3, name: "At-Risk Customers", owner: "CS Team", type: "list", shared: true },
    { id: 4, name: "Weekly Report", owner: "Admin", type: "dashboard", shared: true },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Views", value: "45", color: "primary", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Shared", value: "12", color: "blue" },
    { label: "Private", value: "33", color: "gray" },
    { label: "System", value: "8" },
  ]

  return (
    <ListPageTemplate
      title="Views"
      description="Manage saved views"
      stageId="ADMIN-VIEWS-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Views" }]}
      kpis={kpis}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">View</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Owner</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {views.map((view) => (
              <tr key={view.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-cyan-50 rounded-lg"><LayoutDashboard className="w-4 h-4 text-cyan-600" /></div><span className="text-sm font-medium text-gray-900">{view.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{view.owner}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{view.type}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${view.shared ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{view.shared ? 'Shared' : 'Private'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Connectors View
// ============================================================================

export function ConnectorsView() {
  const connectors = [
    { id: 1, name: "Salesforce", status: "connected", lastSync: "5 min ago", records: 15234 },
    { id: 2, name: "HubSpot", status: "connected", lastSync: "12 min ago", records: 8456 },
    { id: 3, name: "Slack", status: "connected", lastSync: "2 min ago", records: null },
    { id: 4, name: "Zendesk", status: "error", lastSync: "2 hours ago", records: 3421 },
    { id: 5, name: "Intercom", status: "disconnected", lastSync: "Never", records: null },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Connectors", value: "12", color: "primary", icon: <Plug className="w-4 h-4" /> },
    { label: "Connected", value: "8", color: "green" },
    { label: "Errors", value: "1", color: "red" },
    { label: "Records Synced", value: "45.2K" },
  ]

  return (
    <ListPageTemplate
      title="Connectors"
      description="Manage integrations"
      stageId="ADMIN-CONN-001"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Connectors" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Connector</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Connector</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Last Sync</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Records</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {connectors.map((conn) => (
              <tr key={conn.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-lg"><Plug className="w-4 h-4 text-gray-600" /></div><span className="text-sm font-medium text-gray-900">{conn.name}</span></div></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    conn.status === 'connected' ? 'bg-green-100 text-green-700' : 
                    conn.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {conn.status === 'connected' && <Activity className="w-3 h-3" />}
                    {conn.status === 'error' && <AlertTriangle className="w-3 h-3" />}
                    {conn.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{conn.lastSync}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{conn.records?.toLocaleString() || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><RefreshCcw className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><Settings className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

export default {
  RolesView,
  PermissionsView,
  TeamsView,
  PoliciesView,
  FeaturesView,
  ViewsView,
  ConnectorsView,
}
