import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckSquare, Calendar, Flag } from "lucide-react";

const tasks = [
  { id: 1, title: "Review FinanceFlow renewal strategy", due: "Today", priority: "high", status: "pending", assignee: "Nirmal" },
  { id: 2, title: "Approve AI-suggested upsell for DataVault", due: "Today", priority: "medium", status: "pending", assignee: "Nirmal" },
  { id: 3, title: "Prepare Q1 board deck data", due: "Tomorrow", priority: "low", status: "in-progress", assignee: "Nirmal" },
  { id: 4, title: "Update Jira integration field mapping", due: "This week", priority: "low", status: "pending", assignee: "Nirmal" },
  { id: 5, title: "Review customer health scores", due: "This week", priority: "high", status: "completed", assignee: "Nirmal" },
];

export default function TasksPage() {
  return (
    <DashboardLayout title="Tasks" subtitle="5 tasks · 2 due today">
      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tasks..." className="pl-10 h-10 border-gray-200 rounded-none" />
        </div>
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="bg-white border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Task</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Status</div>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
            <div className="col-span-6 flex items-center gap-3">
              <button className={`w-5 h-5 border ${task.status === 'completed' ? 'bg-black border-black' : 'border-gray-300'} flex items-center justify-center`}>
                {task.status === 'completed' && <CheckSquare className="w-3 h-3 text-white" />}
              </button>
              <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-black'}`}>
                {task.title}
              </span>
            </div>
            <div className="col-span-2 text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.due}
            </div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 border ${
                task.priority === 'high' ? 'border-black text-black' : 
                task.priority === 'medium' ? 'border-gray-400 text-gray-600' : 
                'border-gray-200 text-gray-400'
              }`}>
                {task.priority}
              </span>
            </div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 ${
                task.status === 'completed' ? 'bg-gray-100 text-gray-600' : 
                task.status === 'in-progress' ? 'bg-gray-200 text-black' : 
                'bg-gray-50 text-gray-400'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
