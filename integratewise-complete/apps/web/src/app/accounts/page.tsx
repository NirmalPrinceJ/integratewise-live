import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Building2, TrendingDown, TrendingUp, Minus } from "lucide-react";

const accounts = [
  { id: 1, name: "FinanceFlow Solutions", health: 54, arr: "$180K", trend: "down", risk: "high" },
  { id: 2, name: "TechServe India", health: 87, arr: "$420K", trend: "up", risk: "low" },
  { id: 3, name: "DataVault Australia", health: 72, arr: "$95K", trend: "stable", risk: "medium" },
  { id: 4, name: "LogiPrime Corp", health: 42, arr: "$145K", trend: "down", risk: "high" },
  { id: 5, name: "CloudSync Pro", health: 91, arr: "$280K", trend: "up", risk: "low" },
  { id: 6, name: "SecureNet Ltd", health: 68, arr: "$195K", trend: "stable", risk: "medium" },
];

export default function AccountsPage() {
  return (
    <DashboardLayout title="Accounts" subtitle="6 accounts · BIZOPS context">
      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search accounts..." className="pl-10 h-10 border-gray-200 rounded-none" />
        </div>
        <Button variant="outline" className="h-10 px-3 border-gray-200 rounded-none">
          <Filter className="w-4 h-4" />
        </Button>
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-gray-200 flex items-center justify-center bg-gray-50">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-black">{account.name}</h3>
                  <p className="text-xs text-gray-400">ID: ACC-{account.id.toString().padStart(3, '0')}</p>
                </div>
              </div>
              {account.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-gray-600" />
              ) : account.trend === "down" ? (
                <TrendingDown className="w-4 h-4 text-black" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400">Health</span>
                <span className={`text-sm font-medium ${account.health < 50 ? "text-black" : "text-gray-700"}`}>
                  {account.health}%
                </span>
              </div>
              <div className="h-1 bg-gray-100">
                <div 
                  className={`h-full ${account.health >= 70 ? "bg-gray-400" : account.health >= 50 ? "bg-gray-600" : "bg-black"}`}
                  style={{ width: `${account.health}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400">ARR</span>
                <p className="font-medium text-black">{account.arr}</p>
              </div>
              <span className={`text-xs px-2 py-1 border ${
                account.risk === "high" ? "border-black text-black" : 
                account.risk === "medium" ? "border-gray-400 text-gray-600" : 
                "border-gray-200 text-gray-400"
              }`}>
                {account.risk} risk
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
