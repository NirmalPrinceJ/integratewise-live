import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  Target, 
  Brain, 
  Layers, 
  Zap, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  History, 
  Settings, 
  UserCircle,
  X,
  MessageSquare,
  Building2,
  DollarSign,
  Users,
  Send,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { type CTXEnum, type L2Component } from "./spine/types";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface IntelligenceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeCtx: CTXEnum;
}

const L2_COMPONENTS: { id: L2Component; label: string; icon: any }[] = [
  { id: "SpineUI", label: "Truth", icon: Network },
  { id: "ContextUI", label: "Context", icon: Target },
  { id: "KnowledgeUI", label: "IQ Hub", icon: Brain },
  { id: "Evidence Drawer", label: "Evidence", icon: Layers },
  { id: "Signals", label: "Signals", icon: Zap },
  { id: "Think", label: "Think Engine", icon: MessageSquare },
  { id: "Act", label: "Act", icon: CheckCircle },
  { id: "HITL", label: "Approval", icon: UserCircle },
  { id: "Govern", label: "Governance", icon: ShieldCheck },
  { id: "Adjust", label: "Adjust", icon: RefreshCw },
  { id: "Repeat", label: "Loop", icon: RefreshCw },
  { id: "Audit Trail", label: "Audit", icon: History },
  { id: "Agent Config", label: "Agents", icon: Settings },
  { id: "Digital Twin", label: "Twin", icon: Network },
];

export function IntelligenceOverlay({ isOpen, onClose, activeCtx }: IntelligenceOverlayProps) {
  const [activeTab, setActiveTab] = useState<L2Component>("Think"); // Default to Think for "loop" feel

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Bottom-up Overlay */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-background border-t border-border shadow-2xl z-[70] flex flex-col rounded-t-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3F5185] flex items-center justify-center text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    Intelligence Engine
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[#3F5185]/10 text-[#3F5185]">
                      {activeCtx}
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground tracking-tight">"Intelligence is not a dashboard. It's a loop." • ⌘J to close</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Tabs (14 universal components) */}
            <div className="flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as L2Component)} className="flex-1 flex flex-col">
                <div className="border-b bg-background/50 sticky top-0 z-10">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList className="h-12 bg-transparent gap-1 px-4">
                      {L2_COMPONENTS.map((comp) => (
                        <TabsTrigger
                          key={comp.id}
                          value={comp.id}
                          className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#3F5185] data-[state=active]:text-[#3F5185] data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 text-xs font-semibold"
                        >
                          <comp.icon className="w-4 h-4" />
                          {comp.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                </div>

                <div className="flex-1 overflow-hidden p-6">
                  <TabsContent value="SpineUI" className="mt-0 h-full overflow-auto">
                    <SpineView activeCtx={activeCtx} />
                  </TabsContent>
                  <TabsContent value="HITL" className="mt-0 h-full overflow-auto">
                    <HITLView />
                  </TabsContent>
                  <TabsContent value="Think" className="mt-0 h-full overflow-auto">
                    <ThinkView activeCtx={activeCtx} />
                  </TabsContent>
                  <TabsContent value="Act" className="mt-0 h-full overflow-auto">
                    <ActView />
                  </TabsContent>
                  <TabsContent value="Govern" className="mt-0 h-full overflow-auto">
                    <GovernView />
                  </TabsContent>
                  <TabsContent value="Digital Twin" className="mt-0 h-full overflow-auto">
                    <DigitalTwinView activeCtx={activeCtx} />
                  </TabsContent>
                  {/* Other tabs placeholders */}
                  {L2_COMPONENTS.filter(c => !["SpineUI", "HITL", "Think", "Act", "Govern", "Digital Twin"].includes(c.id)).map(comp => (
                    <TabsContent key={comp.id} value={comp.id} className="mt-0 h-full">
                      <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50">
                        <comp.icon className="w-12 h-12 mb-4 text-[#3F5185]" />
                        <h3 className="text-xl font-bold">{comp.label} Module</h3>
                        <p className="max-w-md text-sm">The {comp.label} module is being reconciled with the unified data spine.</p>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-Views ───────────────────────────────────────────────────────────────

function ThinkView({ activeCtx }: { activeCtx: string }) {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: `I'm analyzing the current ${activeCtx} context. How can I help you close the loop today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e3b03387/ai/chat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input, context: activeCtx })
      });
      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to Think Engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-[#3F5185] flex items-center justify-center text-white shrink-0 mt-1">
                <Brain className="w-4 h-4" />
              </div>
            )}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[80%] ${m.role === "user" ? "bg-[#3F5185] text-white rounded-tr-none" : "bg-muted rounded-tl-none"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#3F5185] flex items-center justify-center text-white shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
             </div>
             <div className="p-4 rounded-2xl rounded-tl-none bg-muted text-xs italic">Processing context...</div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 p-1 bg-muted rounded-xl border">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type to reason about the current context..."
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading} size="icon" className="bg-[#3F5185]">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function DigitalTwinView({ activeCtx }: { activeCtx: string }) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Operational Digital Twin</h3>
          <p className="text-sm text-muted-foreground">Real-time mirroring of business entities & relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Sync Twin
          </Button>
          <Button size="sm" className="gap-2">
            <Layers className="w-4 h-4" /> View Lineage
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        <div className="col-span-2 relative bg-black/5 rounded-2xl border-2 border-dashed border-border overflow-hidden p-8 flex items-center justify-center">
          {/* Simulated Graph Visualization */}
          <div className="relative w-full h-full">
            {/* Center Node: Company */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 rounded-3xl bg-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] flex flex-col items-center justify-center text-primary-foreground border-4 border-background z-10 relative">
                <Building2 className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-bold">CORE_SSOT</span>
              </div>
              
              {/* Orbits */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-primary/10" />
              
              {/* Satellite Nodes */}
              {[
                { label: "Accounts", icon: Building2, pos: "top-[-120px] left-[-120px]", color: "bg-emerald-500" },
                { label: "Revenue", icon: DollarSign, pos: "top-[-150px] left-[60px]", color: "bg-blue-500" },
                { label: "Product", icon: Zap, pos: "top-[80px] left-[140px]", color: "bg-indigo-500" },
                { label: "Contacts", icon: Users, pos: "top-[120px] left-[-160px]", color: "bg-amber-500" },
              ].map((sat, i) => (
                <div key={i} className={`absolute ${sat.pos} flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-110`}>
                  <div className={`w-12 h-12 rounded-xl ${sat.color} text-white flex items-center justify-center shadow-lg group-hover:ring-4 group-hover:ring-white`}>
                    <sat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border shadow-sm">{sat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <svg className="w-full h-full">
                 <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                 <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                 <line x1="15%" y1="75%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                 <line x1="85%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
               </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4 overflow-auto">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Twin Mutations</h4>
          <div className="space-y-2">
            {[
              { entity: "Account: Acme Corp", change: "RenewalDate updated", source: "Salesforce", time: "2m ago" },
              { entity: "Contact: John Doe", change: "Sentiment -> Positive", source: "Slack Analysis", time: "14m ago" },
              { entity: "Project: Q1 Launch", change: "Status -> Completed", source: "Jira Sync", time: "1h ago" },
            ].map((mut, i) => (
              <div key={i} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold truncate pr-2">{mut.entity}</span>
                  <span className="text-[10px] text-muted-foreground">{mut.time}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">{mut.change}</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-mono">source: {mut.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpineView({ activeCtx }: { activeCtx: string }) {
  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      <div className="col-span-2 space-y-4">
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Network className="w-4 h-4" />
            Active Spine Nodes ({activeCtx})
          </h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-background border flex items-center justify-center font-mono text-xs">A{i}</div>
                  <div>
                    <div className="font-medium">Canonical Account Node {i}</div>
                    <div className="text-xs text-muted-foreground">Source: Salesforce • Updated 2m ago</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">goal_ref: GOAL_{i}00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="p-4 rounded-xl border bg-primary/5 border-primary/20">
          <h3 className="font-medium text-primary mb-1 text-sm">Normalization Health</h3>
          <div className="text-2xl font-bold">98.4%</div>
          <p className="text-xs text-muted-foreground">Sectorizer active  0 collisions</p>
        </div>
      </div>
    </div>
  );
}

function HITLView() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Human-in-the-Loop Approval Queue</h3>
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Action Proposal: Update HubSpot Lifecycle Stage</div>
                  <div className="text-sm text-muted-foreground">Confidence: 94%</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">Deny</Button>
                <Button size="sm">Approve & Execute</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActView() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-medium">Execution Pipeline Status</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "HubSpot Write-Back", status: "completed" },
            { label: "Slack Notification", status: "completed" },
          ].map((act, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{act.label}</span>
              <span className="text-emerald-600 font-medium">{act.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GovernView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card text-center">
          <div className="text-xs text-muted-foreground mb-1">Policies Enforced</div>
          <div className="text-2xl font-bold">892</div>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center">
          <div className="text-xs text-muted-foreground mb-1">Audit Score</div>
          <div className="text-2xl font-bold text-emerald-600">A+</div>
        </div>
      </div>
    </div>
  );
}