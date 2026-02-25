import DashboardLayout from "@/components/layout/DashboardLayout";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";

const stages = [
  { name: "Prospecting", count: 12, value: "$450K", color: "bg-gray-200" },
  { name: "Discovery", count: 8, value: "$320K", color: "bg-gray-300" },
  { name: "Proposal", count: 5, value: "$280K", color: "bg-gray-400" },
  { name: "Negotiation", count: 3, value: "$180K", color: "bg-gray-600" },
  { name: "Closed Won", count: 2, value: "$120K", color: "bg-black" },
];

export default function PipelinePage() {
  return (
    <DashboardLayout title="Pipeline" subtitle="$1.35M total pipeline · 30 opportunities">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pipeline", value: "$1.35M", icon: DollarSign },
          { label: "Win Rate", value: "34%", icon: Target },
          { label: "Avg Deal Size", value: "$45K", icon: TrendingUp },
          { label: "Active Opps", value: "30", icon: Users },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 border border-gray-200">
            <div className="text-2xl font-light text-black">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Stages */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="font-medium text-black mb-6">Pipeline by Stage</h3>
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.name} className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-600">{stage.name}</div>
              <div className="flex-1 h-8 bg-gray-100">
                <div 
                  className={`h-full ${stage.color}`}
                  style={{ width: `${(stage.count / 12) * 100}%` }}
                />
              </div>
              <div className="w-20 text-right">
                <div className="text-sm font-medium text-black">{stage.count}</div>
                <div className="text-xs text-gray-400">{stage.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
