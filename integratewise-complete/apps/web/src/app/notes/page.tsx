import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const notes = [
  { id: 1, title: "Meeting Notes: FinanceFlow", preview: "Discussed renewal strategy and expansion opportunities...", date: "Today" },
  { id: 2, title: "Q1 Planning Ideas", preview: "Key initiatives for customer success team...", date: "Yesterday" },
  { id: 3, title: "Product Feedback", preview: "Collected from top 3 enterprise accounts...", date: "2 days ago" },
];

export default function NotesPage() {
  return (
    <DashboardLayout title="Notes" subtitle="3 notes · Last edited 2h ago">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search notes..." className="pl-10 h-10 border-gray-200 rounded-none" />
        </div>
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors cursor-pointer">
            <h3 className="font-medium text-black mb-2">{note.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{note.preview}</p>
            <div className="text-xs text-gray-400 mt-4">{note.date}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
