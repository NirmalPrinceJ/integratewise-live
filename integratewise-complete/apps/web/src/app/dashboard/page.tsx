import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckSquare, Clock, AlertCircle, Zap } from "lucide-react";

const stats = [
  { label: "MY TASKS", value: "12", subtext: "4 due today", icon: CheckSquare },
  { label: "MEETINGS TODAY", value: "3", subtext: "Next: 11:30am", icon: Clock },
  { label: "APPROVALS", value: "5", subtext: "Waiting for you", icon: AlertCircle },
  { label: "INTELLIGENCE", value: "5", subtext: "New insights", icon: Zap },
];

const tasks = [
  { id: 1, title: "Review FinanceFlow renewal strategy", time: "Today", tag: "CS", priority: "high" },
  { id: 2, title: "Approve AI-suggested upsell for DataVault", time: "Today", tag: "Sales", priority: "medium" },
  { id: 3, title: "Prepare Q1 board deck data", time: "Tomorrow", tag: "BizOps", priority: "low" },
  { id: 4, title: "Update Jira integration field mapping", time: "This week", tag: "Tech", priority: "low" },
];

const intelligence = [
  { id: 1, text: "Expansion signal detected for TechServe India — usage up 34%", time: "12m ago", type: "growth" },
  { id: 2, text: "FinanceFlow champion went silent — last engagement 12 days ago", time: "1h ago", type: "risk" },
  { id: 3, text: "Stripe schema drift auto-corrected and updated", time: "2h ago", type: "system" },
  { id: 4, text: "DataVault Australia NPS jump indicates expansion opportunity", time: "3h ago", type: "growth" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="My Overview" subtitle="BIZOPS · PRODUCT Org · 50% data coverage">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {["Personal", "Work", "Accounts & Projects"].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              idx === 0 ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-3xl font-light text-black">{stat.value}</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
              <div className="w-10 h-10 border border-gray-200 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="text-sm text-gray-500">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <div className="lg:col-span-2 bg-white border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-medium text-black">Today's Focus</h3>
            <p className="text-sm text-gray-500 mt-1">Tasks and actions that need your attention</p>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div key={task.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  task.priority === "high" ? "bg-black" :
                  task.priority === "medium" ? "bg-gray-600" : "bg-gray-300"
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-black">{task.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{task.time} · {task.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Feed */}
        <div className="bg-white border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <h3 className="font-medium text-black">Intelligence Feed</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {intelligence.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${
                    item.type === "growth" ? "bg-gray-800" :
                    item.type === "risk" ? "bg-black" : "bg-gray-400"
                  }`} />
                  <div>
                    <div className="text-sm text-gray-700 leading-relaxed">{item.text}</div>
                    <div className="text-xs text-gray-400 mt-2">{item.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
