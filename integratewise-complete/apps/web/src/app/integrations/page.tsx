import DashboardLayout from "@/components/layout/DashboardLayout";
import { Check, X } from "lucide-react";

const integrations = [
  { id: "salesforce", name: "Salesforce", status: "connected", lastSync: "2m ago" },
  { id: "hubspot", name: "HubSpot", status: "connected", lastSync: "5m ago" },
  { id: "slack", name: "Slack", status: "connected", lastSync: "1m ago" },
  { id: "stripe", name: "Stripe", status: "connected", lastSync: "Just now" },
  { id: "jira", name: "Jira", status: "disconnected", lastSync: "-" },
  { id: "github", name: "GitHub", status: "disconnected", lastSync: "-" },
];

export default function IntegrationsPage() {
  return (
    <DashboardLayout title="Integrations" subtitle="4 connected · 2 available">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-black">{integration.name}</h3>
              {integration.status === 'connected' ? (
                <Check className="w-5 h-5 text-black" />
              ) : (
                <X className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Status</div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                integration.status === 'connected' ? 'bg-black' : 'bg-gray-300'
              }`} />
              <span className="text-sm text-gray-600 capitalize">{integration.status}</span>
            </div>
            {integration.status === 'connected' && (
              <div className="text-xs text-gray-400 mt-3">Last sync: {integration.lastSync}</div>
            )}
            <button className={`w-full mt-4 py-2 text-sm font-medium transition-colors ${
              integration.status === 'connected' 
                ? 'border border-gray-200 hover:bg-gray-50' 
                : 'bg-black text-white hover:bg-gray-900'
            }`}>
              {integration.status === 'connected' ? 'Configure' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
