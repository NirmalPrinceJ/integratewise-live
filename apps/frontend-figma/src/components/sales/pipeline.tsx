import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Clock,
  User,
  AlertTriangle,
  Flame,
  Thermometer,
  Snowflake,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
} from "lucide-react";

interface Deal {
  id: string;
  company: string;
  logo: string;
  value: number;
  probability: number;
  closeDate: string;
  daysOverdue: number;
  owner: { name: string; initials: string };
  priority: "hot" | "warm" | "cold";
  healthScore: number;
  nextActivity: string;
  stage: string;
}

const stages = [
  { id: "prospecting", label: "Prospecting", color: "var(--iw-blue)" },
  { id: "qualification", label: "Qualification", color: "var(--iw-purple)" },
  { id: "proposal", label: "Proposal", color: "var(--iw-warning)" },
  { id: "negotiation", label: "Negotiation", color: "var(--iw-pink)" },
  { id: "closed-won", label: "Closed Won", color: "var(--iw-success)" },
  { id: "closed-lost", label: "Closed Lost", color: "var(--iw-danger)" },
];

const allDeals: Deal[] = [
  { id: "d1", company: "NeoBank India", logo: "🏦", value: 185000, probability: 20, closeDate: "2026-04-15", daysOverdue: 0, owner: { name: "Arun K.", initials: "AK" }, priority: "warm", healthScore: 68, nextActivity: "Discovery call Thu", stage: "prospecting" },
  { id: "d2", company: "GreenLogix", logo: "🌿", value: 92000, probability: 15, closeDate: "2026-05-01", daysOverdue: 0, owner: { name: "Vikram R.", initials: "VR" }, priority: "cold", healthScore: 45, nextActivity: "Email follow-up", stage: "prospecting" },
  { id: "d3", company: "DataMesh APAC", logo: "🔗", value: 320000, probability: 40, closeDate: "2026-03-20", daysOverdue: 0, owner: { name: "Priya S.", initials: "PS" }, priority: "hot", healthScore: 82, nextActivity: "Demo on Mon", stage: "qualification" },
  { id: "d4", company: "SecureVault SG", logo: "🔐", value: 245000, probability: 35, closeDate: "2026-04-10", daysOverdue: 0, owner: { name: "Arun K.", initials: "AK" }, priority: "warm", healthScore: 71, nextActivity: "Tech review Fri", stage: "qualification" },
  { id: "d5", company: "MediaPulse", logo: "📡", value: 158000, probability: 30, closeDate: "2026-03-30", daysOverdue: 0, owner: { name: "Rajesh M.", initials: "RM" }, priority: "warm", healthScore: 63, nextActivity: "Requirements doc", stage: "qualification" },
  { id: "d6", company: "TechServe India", logo: "🏢", value: 420000, probability: 65, closeDate: "2026-03-01", daysOverdue: 0, owner: { name: "Priya S.", initials: "PS" }, priority: "hot", healthScore: 91, nextActivity: "SOW review Tue", stage: "proposal" },
  { id: "d7", company: "CloudBridge APAC", logo: "☁️", value: 280000, probability: 60, closeDate: "2026-02-28", daysOverdue: 0, owner: { name: "Arun K.", initials: "AK" }, priority: "hot", healthScore: 78, nextActivity: "Pricing call Wed", stage: "proposal" },
  { id: "d8", company: "FinanceFlow", logo: "💰", value: 180000, probability: 80, closeDate: "2026-02-20", daysOverdue: 0, owner: { name: "Rajesh M.", initials: "RM" }, priority: "hot", healthScore: 85, nextActivity: "Contract review", stage: "negotiation" },
  { id: "d9", company: "HealthTech Inn.", logo: "🏥", value: 210000, probability: 75, closeDate: "2026-02-25", daysOverdue: 0, owner: { name: "Priya S.", initials: "PS" }, priority: "warm", healthScore: 76, nextActivity: "Legal review", stage: "negotiation" },
  { id: "d10", company: "EduSpark", logo: "📚", value: 68000, probability: 100, closeDate: "2026-01-15", daysOverdue: 0, owner: { name: "Anjali P.", initials: "AP" }, priority: "hot", healthScore: 98, nextActivity: "Signed!", stage: "closed-won" },
  { id: "d11", company: "RetailNest", logo: "🛍️", value: 95000, probability: 100, closeDate: "2026-01-28", daysOverdue: 0, owner: { name: "Vikram R.", initials: "VR" }, priority: "hot", healthScore: 95, nextActivity: "Onboarding", stage: "closed-won" },
  { id: "d12", company: "LogiPrime", logo: "🚚", value: 145000, probability: 0, closeDate: "2026-01-10", daysOverdue: 0, owner: { name: "Rajesh M.", initials: "RM" }, priority: "cold", healthScore: 20, nextActivity: "Lost - budget", stage: "closed-lost" },
];

const priorityIcons: Record<string, React.ReactNode> = {
  hot: <Flame className="w-3 h-3 text-[var(--iw-danger)]" />,
  warm: <Thermometer className="w-3 h-3 text-[var(--iw-warning)]" />,
  cold: <Snowflake className="w-3 h-3 text-[var(--iw-blue)]" />,
};

export function SalesPipeline() {
  const [deals] = useState(allDeals);

  const totalPipeline = deals.filter((d) => !["closed-won", "closed-lost"].includes(d.stage)).reduce((sum, d) => sum + d.value, 0);
  const weightedForecast = deals.filter((d) => !["closed-won", "closed-lost"].includes(d.stage)).reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
  const closedWon = deals.filter((d) => d.stage === "closed-won").reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2>Sales Pipeline</h2>
            <p className="text-sm text-muted-foreground mt-1">Drag deals between stages to update</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-2 bg-secondary rounded-md text-sm hover:bg-accent transition-colors">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--iw-sales)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
              <Plus className="w-4 h-4" /> New Deal
            </button>
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Total Pipeline</div>
            <div className="text-lg" style={{ fontWeight: 600 }}>${(totalPipeline / 1000000).toFixed(2)}M</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Weighted Forecast</div>
            <div className="text-lg" style={{ fontWeight: 600, color: "var(--iw-blue)" }}>${(weightedForecast / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Closed Won (Q1)</div>
            <div className="text-lg" style={{ fontWeight: 600, color: "var(--iw-success)" }}>${(closedWon / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <div className="flex gap-4 min-w-max h-full">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage.id} className="w-[280px] flex flex-col flex-shrink-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-sm" style={{ fontWeight: 500 }}>{stage.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">${(stageValue / 1000).toFixed(0)}K</span>
                </div>

                {/* Deal Cards */}
                <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-secondary/30 p-2">
                  {stageDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} stageColor={stage.color} />
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground border border-dashed border-border rounded-md">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, stageColor }: { deal: Deal; stageColor: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{deal.logo}</span>
          <span className="text-sm" style={{ fontWeight: 500 }}>{deal.company}</span>
        </div>
        {priorityIcons[deal.priority]}
      </div>

      {/* Value */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm" style={{ fontWeight: 600 }}>${(deal.value / 1000).toFixed(0)}K</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground" style={{ fontWeight: 500 }}>
          {deal.probability}%
        </span>
      </div>

      {/* Health bar */}
      <div className="mb-2">
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${deal.healthScore}%`,
              backgroundColor: deal.healthScore >= 80 ? "var(--iw-success)" : deal.healthScore >= 60 ? "var(--iw-warning)" : "var(--iw-danger)",
            }}
          />
        </div>
      </div>

      {/* Next Activity */}
      <div className="text-[11px] text-muted-foreground mb-2 truncate">
        {deal.nextActivity}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="w-5 h-5 rounded-full bg-[var(--iw-sales)] flex items-center justify-center text-white text-[9px]" style={{ fontWeight: 600 }}>
          {deal.owner.initials}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(deal.closeDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </div>
      </div>
    </div>
  );
}
