import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Play, Settings } from "lucide-react";

const workflows = [
  { id: 1, name: "Health Score Alert", trigger: "Daily", status: "active", runs: 156 },
  { id: 2, name: "Renewal Risk Detection", trigger: "Real-time", status: "active", runs: 89 },
  { id: 3, name: "Expansion Signal", trigger: "Weekly", status: "paused", runs: 45 },
];

export default function WorkflowsPage() {
  return (
    <DashboardLayout title="Workflows" subtitle="3 workflows · 2 active">
      <div className="flex justify-end mb-6">
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Trigger</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Runs</div>
          <div className="col-span-2">Actions</div>
        </div>
        {workflows.map((workflow) => (
          <div key={workflow.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center">
            <div className="col-span-4 font-medium text-black">{workflow.name}</div>
            <div className="col-span-2 text-sm text-gray-500">{workflow.trigger}</div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 ${
                workflow.status === 'active' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {workflow.status}
              </span>
            </div>
            <div className="col-span-2 text-sm text-gray-600">{workflow.runs}</div>
            <div className="col-span-2 flex items-center gap-2">
              <button className="p-1 hover:bg-gray-200"><Play className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-gray-200"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
