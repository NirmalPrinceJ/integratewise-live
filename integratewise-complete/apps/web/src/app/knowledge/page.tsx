import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, FileText, Folder, Clock } from "lucide-react";

const docs = [
  { id: 1, title: "Q4 Playbook: Expansion Strategy", folder: "Playbooks", updated: "2 days ago", type: "doc" },
  { id: 2, title: "Customer Health Score Methodology", folder: "Methodology", updated: "1 week ago", type: "doc" },
  { id: 3, title: "Salesforce Integration Guide", folder: "Technical", updated: "3 days ago", type: "doc" },
  { id: 4, title: "Onboarding Checklist Template", folder: "Templates", updated: "1 month ago", type: "doc" },
  { id: 5, title: "Risk Escalation Procedures", folder: "Procedures", updated: "2 weeks ago", type: "doc" },
];

const folders = [
  { name: "Playbooks", count: 12 },
  { name: "Methodology", count: 8 },
  { name: "Technical", count: 15 },
  { name: "Templates", count: 6 },
  { name: "Procedures", count: 10 },
];

export default function KnowledgePage() {
  return (
    <DashboardLayout title="Knowledge Space" subtitle="51 documents · Last updated 2h ago">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-black">Folders</h3>
            </div>
            {folders.map((folder) => (
              <div key={folder.name} className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{folder.name}</span>
                </div>
                <span className="text-xs text-gray-400">{folder.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search knowledge base..." className="pl-10 h-10 border-gray-200 rounded-none" />
            </div>
          </div>

          <div className="bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recent Documents
            </div>
            {docs.map((doc) => (
              <div key={doc.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-black">{doc.title}</div>
                    <div className="text-xs text-gray-400">{doc.folder}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {doc.updated}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
