import DashboardLayout from "@/components/layout/DashboardLayout";
import { Zap, TrendingUp, AlertTriangle, Brain } from "lucide-react";

const insights = [
  { id: 1, type: "growth", title: "Expansion Opportunity", description: "TechServe India usage increased 34% in last 30 days", action: "View Account" },
  { id: 2, type: "risk", title: "Champion Risk", description: "FinanceFlow champion silent for 12 days", action: "View Details" },
  { id: 3, type: "signal", title: "Product Adoption", description: "DataVault team activated 3 new features", action: "Explore" },
  { id: 4, type: "system", title: "Data Sync", description: "Stripe schema drift auto-corrected", action: "View Log" },
];

export default function IntelligencePage() {
  return (
    <DashboardLayout title="Intelligence" subtitle="4 active insights · 2 require action">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Signals", value: "12", icon: Zap },
          { label: "Growth Opportunities", value: "3", icon: TrendingUp },
          { label: "Risk Alerts", value: "2", icon: AlertTriangle },
          { label: "AI Insights", value: "8", icon: Brain },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 border border-gray-200">
            <div className="text-2xl font-light text-black">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-black">Latest Insights</h3>
        </div>
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-1.5 rounded-full ${
                insight.type === 'growth' ? 'bg-gray-800' :
                insight.type === 'risk' ? 'bg-black' : 'bg-gray-400'
              }`} />
              <div>
                <div className="font-medium text-black">{insight.title}</div>
                <div className="text-sm text-gray-500 mt-1">{insight.description}</div>
              </div>
            </div>
            <button className="text-xs text-black font-medium hover:underline">
              {insight.action} →
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
