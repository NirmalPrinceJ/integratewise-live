import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface DashboardData {
  entity_count: number;
  active_signals: number;
  pending_approvals: number;
  connectors: Array<{ tool_name: string; status: string; entity_count: number; last_sync_at: string }>;
  signals: Array<{ id: string; title: string; severity: string; description: string; created_at: string }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workspace</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Entities" value={data.entity_count} />
        <StatCard label="Active Signals" value={data.active_signals} color={data.active_signals > 0 ? 'amber' : 'green'} />
        <StatCard label="Pending Approvals" value={data.pending_approvals} color={data.pending_approvals > 0 ? 'red' : 'green'} />
        <StatCard label="Connected Tools" value={data.connectors.length} />
      </div>

      {/* Signals Feed */}
      {data.signals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Active Signals</h2>
          <div className="space-y-2">
            {data.signals.map(signal => (
              <div key={signal.id} className={`p-4 rounded-lg border ${
                signal.severity === 'critical' ? 'border-red-300 bg-red-50' :
                signal.severity === 'high' ? 'border-amber-300 bg-amber-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{signal.title}</span>
                  <span className="text-xs uppercase tracking-wide">{signal.severity}</span>
                </div>
                {signal.description && <p className="text-sm text-gray-600 mt-1">{signal.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Tools */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Connected Tools</h2>
        {data.connectors.length === 0 ? (
          <div className="p-6 border-2 border-dashed rounded-lg text-center text-gray-500">
            No tools connected yet. Connect your first tool to start flowing data.
          </div>
        ) : (
          <div className="space-y-2">
            {data.connectors.map((c, i) => (
              <div key={i} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-medium capitalize">{c.tool_name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{c.status}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {c.entity_count} entities &bullet; Last sync: {c.last_sync_at ? new Date(c.last_sync_at).toLocaleDateString() : 'never'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty state with data density message */}
      {data.entity_count === 0 && (
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Your workspace is ready</h3>
          <p className="text-gray-600 mb-4">
            Connect a tool or paste some data to see your first entities, signals, and intelligence.
          </p>
          <p className="text-sm text-gray-500">
            Modules appear as data flows in. No empty tiles. No noise.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'blue' }: { label: string; value: number; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className={`p-4 rounded-lg ${colors[color] || colors.blue}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}
