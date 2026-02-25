import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

const opportunities = [
  { id: 1, account: "TechServe India", potential: "$85K", signal: "Usage up 34%", confidence: "high" },
  { id: 2, account: "DataVault Australia", potential: "$45K", signal: "NPS jump to 9.2", confidence: "high" },
  { id: 3, account: "CloudSync Pro", potential: "$120K", signal: "New team added", confidence: "medium" },
];

export default function ExpansionPage() {
  return (
    <DashboardLayout title="Expansion" subtitle="3 opportunities · $250K potential">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Expansion Pipeline", value: "$250K", icon: DollarSign },
          { label: "Win Rate", value: "42%", icon: TrendingUp },
          { label: "Avg Upsell", value: "$65K", icon: ArrowUpRight },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 border border-gray-200">
            <div className="text-2xl font-light text-black">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-black">Expansion Opportunities</h3>
        </div>
        {opportunities.map((opp) => (
          <div key={opp.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
            <div>
              <div className="font-medium text-black">{opp.account}</div>
              <div className="text-sm text-gray-500 mt-1">{opp.signal}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-black">{opp.potential}</div>
              <span className={`text-xs px-2 py-1 border ${
                opp.confidence === 'high' ? 'border-black text-black' : 'border-gray-300 text-gray-500'
              }`}>
                {opp.confidence} confidence
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
