import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const docs = [
  { id: 1, title: "Q4 Business Review", folder: "Reviews", updated: "2 days ago" },
  { id: 2, title: "Product Roadmap 2026", folder: "Planning", updated: "1 week ago" },
  { id: 3, title: "Customer Feedback Summary", folder: "Research", updated: "3 days ago" },
  { id: 4, title: "Competitive Analysis", folder: "Strategy", updated: "2 weeks ago" },
];

export default function DocsPage() {
  return (
    <DashboardLayout title="Docs" subtitle="4 documents · Last updated 2 days ago">
      <div className="flex justify-end mb-6">
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          All Documents
        </div>
        {docs.map((doc) => (
          <div key={doc.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
            <FileText className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-black">{doc.title}</div>
              <div className="text-xs text-gray-400">{doc.folder} · {doc.updated}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
