import { DashboardLayout } from "@/components/layouts/page-layouts"
import { MessageSquare, Brain, Clock, TrendingUp, Sparkles, Calendar } from "lucide-react"

export default async function SessionsPage() {
  const sessions = [
    {
      id: 1,
      title: "Q1 Strategy Planning",
      type: "brainstorm",
      status: "completed",
      date: "Jan 28, 2026",
      duration: "45 min",
      participants: 6,
      insights: 12,
      actions: 4,
      confidence: 89,
    },
    {
      id: 2,
      title: "Customer Onboarding Optimization",
      type: "problem-solving",
      status: "active",
      date: "Jan 29, 2026",
      duration: "In progress",
      participants: 4,
      insights: 8,
      actions: 2,
      confidence: 76,
    },
    {
      id: 3,
      title: "Product Roadmap Review",
      type: "brainstorm",
      status: "completed",
      date: "Jan 27, 2026",
      duration: "1h 20min",
      participants: 8,
      insights: 15,
      actions: 7,
      confidence: 92,
    },
    {
      id: 4,
      title: "Sales Process Automation",
      type: "analysis",
      status: "scheduled",
      date: "Jan 30, 2026",
      duration: "Not started",
      participants: 5,
      insights: 0,
      actions: 0,
      confidence: 0,
    },
  ]

  const stats = [
    { label: "Total Sessions", value: "24", icon: MessageSquare, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Active Now", value: "3", icon: Sparkles, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Insights Generated", value: "187", icon: Brain, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Actions Created", value: "42", icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-50" },
  ]

  const statusConfig = {
    completed: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
    active: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
    scheduled: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  }

  const typeConfig = {
    brainstorm: "bg-purple-100 text-purple-700",
    "problem-solving": "bg-orange-100 text-orange-700",
    analysis: "bg-blue-100 text-blue-700",
  }

  return (
    <DashboardLayout
      title="Sessions"
      description="AI-powered brainstorming and problem-solving sessions"
      stageId="SESSIONS-014"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className={`p-4 ${stat.bgColor} rounded-lg border border-gray-200/50`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 uppercase">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg">All Sessions</button>
        <button className="px-4 py-2 text-sm bg-card border border-border text-muted-foreground rounded-lg hover:bg-muted">Active</button>
        <button className="px-4 py-2 text-sm bg-card border border-border text-muted-foreground rounded-lg hover:bg-muted">Completed</button>
        <button className="px-4 py-2 text-sm bg-card border border-border text-muted-foreground rounded-lg hover:bg-muted">Scheduled</button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sessions.map((session) => {
          const config = statusConfig[session.status as keyof typeof statusConfig]
          return (
            <div
              key={session.id}
              className={`p-5 border rounded-lg ${config.border} ${config.bg} hover:shadow-md transition-all cursor-pointer`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badge}`}>
                      {session.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig[session.type as keyof typeof typeConfig]}`}>
                      {session.type}
                    </span>
                  </div>
                </div>
                {session.confidence > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{session.confidence}%</div>
                    <div className="text-xs text-muted-foreground">confidence</div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{session.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{session.duration}</span>
                </div>
                <span>•</span>
                <span>{session.participants} participants</span>
              </div>

              {/* Insights & Actions */}
              {session.status !== "scheduled" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white/60 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium text-muted-foreground">Insights</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-400">{session.insights}</div>
                  </div>
                  <div className="p-3 bg-card/60 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-muted-foreground">Actions</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">{session.actions}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {session.status === "active" && (
                  <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Continue Session
                  </button>
                )}
                {session.status === "completed" && (
                  <button className="flex-1 px-3 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                    View Summary
                  </button>
                )}
                {session.status === "scheduled" && (
                  <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Start Session
                  </button>
                )}
                <button className="px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors text-sm">
                  •••
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
