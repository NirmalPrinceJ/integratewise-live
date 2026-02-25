import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Building2, TrendingDown } from "lucide-react";

const risks = [
  { id: 1, name: "FinanceFlow Solutions", health: 54, arr: "$180K", trend: "down", status: "at-risk", rm: "Rajesh M." },
  { id: 2, name: "LogiPrime Corp", health: 42, arr: "$145K", trend: "down", status: "at-risk", rm: "Rajesh M." },
  { id: 3, name: "TechServe India", health: 38, arr: "$220K", trend: "down", status: "critical", rm: "Priya K." },
  { id: 4, name: "DataVault Australia", health: 61, arr: "$95K", trend: "stable", status: "at-risk", rm: "Mike T." },
];

export default function RisksPage() {
  return (
    <DashboardLayout title="Risks" subtitle="4 accounts at risk · $640K ARR">
      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search risks..." className="pl-10 h-10 border-gray-200 rounded-none" />
        </div>
        <Button variant="outline" className="h-10 px-3 border-gray-200 rounded-none">
          <Filter className="w-4 h-4" />
        </Button>
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          Flag Risk
        </Button>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk) => (
          <div key={risk.id} className="bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-gray-200 flex items-center justify-center bg-gray-50">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-black">{risk.name}</h3>
                  <p className="text-xs text-gray-400">{risk.accountId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium ${
                risk.status === 'critical' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600'
              }`}>
                {risk.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <span className="text-xs uppercase tracking-wider text-gray-400">RM</span>
              <span>{risk.rm}</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400">Health</span>
                <span className={`text-sm font-medium ${risk.health < 50 ? 'text-black' : 'text-gray-700'}`}>
                  {risk.health}%
                </span>
              </div>
              <div className="h-1 bg-gray-100">
                <div className={`h-full ${risk.health >= 70 ? 'bg-gray-400' : risk.health >= 50 ? 'bg-gray-600' : 'bg-black'}`}
                  style={{ width: `${risk.health}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs uppercase tracking-wider text-gray-400">ARR</span>
                <span className="font-medium text-black">{risk.arr}</span>
              </div>
              <span className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-0.5">STRIPE</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
