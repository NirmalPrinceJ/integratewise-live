import { PageHeader } from "@/components/spine/page-header"
import { EmptyState } from "@/components/spine/empty-state"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Sparkles } from "lucide-react"

export default function IQHubPage() {
  const sessions: { id: string; title: string; provider: string; date: string; extracted: number }[] = []

  return (
    <div className="p-6">
      <PageHeader
        title="IQ Hub"
        description="Capture and structure AI conversations"
        stageId="IQHUB-008"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        }
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No IQ Hub sessions yet"
          description="Start capturing your AI conversations to extract tasks, decisions, and knowledge automatically."
          actionLabel="Create First Session"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{session.title}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{session.provider}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{session.date}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-[#2D7A3E]" />
                <span>{session.extracted} items extracted</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
