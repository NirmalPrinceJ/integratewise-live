import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  ChevronRight, 
  Rocket, 
  Database, 
  Zap, 
  Shield, 
  Globe,
  Loader2,
  Lock,
  Factory,
  Briefcase,
  Target,
  Building2,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type CTXEnum, type OrgType } from "../spine/types";
import { LogoMark } from "../landing/logo";

interface OnboardingFlowProps {
  onComplete: (data: {
    userName: string;
    role: string;
    activeCtx: CTXEnum;
    connectedApps: string[];
    orgType: OrgType;
  }) => void;
}

const STEPS = [
  { id: "identity", label: "Identity", icon: Rocket },
  { id: "orgtype", label: "Org DNA", icon: Target },
  { id: "context", label: "Context", icon: Globe },
  { id: "connect", label: "Connect", icon: Database },
  { id: "spine", label: "Spine", icon: Zap },
];

const CONNECTORS = [
  { id: "salesforce", name: "Salesforce", icon: "☁️" },
  { id: "hubspot", name: "HubSpot", icon: "🎯" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "jira", name: "Jira", icon: "🛠️" },
  { id: "stripe", name: "Stripe", icon: "💳" },
  { id: "github", name: "GitHub", icon: "🐙" },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("Operations Lead");
  const [orgType, setOrgType] = useState<OrgType>("PRODUCT");
  const [activeCtx, setActiveCtx] = useState<CTXEnum>("CTX_BIZOPS");
  const [connectedApps, setConnectedApps] = useState<string[]>(["slack"]);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsInitializing(true);
    setTimeout(() => {
      onComplete({
        userName: userName || "Arun Kumar",
        role,
        activeCtx,
        connectedApps,
        orgType,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0C1222] text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <LogoMark size={100} />
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                i <= step ? "bg-sky-500 border-sky-500 text-white" : "border-white/20 text-slate-500"
              }`}>
                {i < step ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className={`text-[9px] uppercase font-black tracking-widest ${i <= step ? "text-sky-400" : "text-slate-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Identity */}
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Welcome to IntegrateWise.</h1>
                <p className="text-slate-400 font-medium">Establish your operational identity to begin Spine normalization.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Full Name</label>
                  <Input 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="bg-white/10 border-white/10 h-14 text-lg focus:ring-sky-500/30 focus:border-sky-500 text-white placeholder:text-slate-500 rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Job Role</label>
                  <Input 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Revenue Operations Manager"
                    className="bg-white/10 border-white/10 h-14 text-lg focus:ring-sky-500/30 focus:border-sky-500 text-white placeholder:text-slate-500 rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Org Type — THE NON-NEGOTIABLE */}
          {step === 1 && (
            <motion.div 
              key="step1-orgtype"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Your Org DNA.</h1>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Every metric, view, and entity will trace to your organization's growth model. 
                  <span className="text-sky-400 font-black uppercase text-xs tracking-wider"> If it doesn't track growth, it's noise.</span>
                </p>
              </div>
              
              <div className="space-y-4">
                {([
                  {
                    id: "PRODUCT" as OrgType,
                    icon: Factory,
                    title: "Product-Based Organization",
                    subtitle: "SaaS, Platform, or Product Company",
                    northStar: "Product-Led Growth",
                    metrics: ["ARR / MRR", "Net Revenue Retention", "Feature Adoption", "Time to Value", "DAU/MAU"],
                    description: "All data drills down to product growth — adoption, retention, and expansion revenue.",
                    selectedClass: "bg-sky-500/10 border-sky-500 ring-4 ring-sky-500/20",
                  },
                  {
                    id: "SERVICES" as OrgType,
                    icon: Briefcase,
                    title: "Services-Based Organization",
                    subtitle: "Consulting, IT Services, or Agency",
                    northStar: "Service Delivery Excellence",
                    metrics: ["Revenue per Engagement", "Billable Utilization", "Client Outcome Score", "On-Time Delivery", "Repeat Rate"],
                    description: "All data drills down to service delivery — client outcomes, utilization, and margins.",
                    selectedClass: "bg-emerald-500/10 border-emerald-500 ring-4 ring-emerald-500/20",
                  },
                  {
                    id: "HYBRID" as OrgType,
                    icon: ArrowUpRight,
                    title: "Hybrid Organization",
                    subtitle: "Product + Services — Blended Model",
                    northStar: "Balanced Growth & Delivery",
                    metrics: ["Blended ARR", "Service Margin", "Product Adoption", "Client NPS", "Expansion Rate"],
                    description: "Track both product growth and service delivery metrics — unified view across both models.",
                    selectedClass: "bg-violet-500/10 border-violet-500 ring-4 ring-violet-500/20",
                  },
                ]).map((option) => {
                  const Icon = option.icon;
                  const isSelected = orgType === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setOrgType(option.id)}
                      className={`w-full p-6 rounded-[32px] border-2 text-left transition-all ${
                        isSelected 
                          ? option.selectedClass
                          : "bg-white/5 border-white/10 hover:border-sky-500/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isSelected ? "bg-sky-500 text-white" : "bg-white/5 text-slate-400"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-black text-xl text-white tracking-tight">{option.title}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />}
                          </div>
                          <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">{option.subtitle}</div>
                          <div className="text-sm text-slate-400 mb-4 font-medium">{option.description}</div>
                          
                          {/* Primary Focus */}
                          <div className="flex items-center gap-3 mb-3">
                            <Target className="w-4 h-4 text-teal-400" />
                            <span className="text-[10px] uppercase font-black text-teal-400 tracking-[0.2em]">Primary Focus:</span>
                            <span className="text-sm font-black text-white uppercase tracking-tighter">{option.northStar}</span>
                          </div>
                          
                          {/* Key Metrics */}
                          <div className="flex flex-wrap gap-2">
                            {option.metrics.map(m => (
                              <span key={m} className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black text-sky-300 uppercase tracking-wider">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Two Lenses Explanation */}
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4">Every view serves two measurement lenses</div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">Provider Lens</div>
                      <div className="text-[10px] text-slate-500 font-bold">How is YOUR org growing?</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">Client Lens</div>
                      <div className="text-[10px] text-slate-500 font-bold">Is the CLIENT getting value?</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Operating Context */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Operating Context.</h1>
                <p className="text-slate-400 font-medium">Choose the lens through which you'll view the unified workspace. Every view will show goal-aligned data for this context.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "CTX_BIZOPS", label: "Business Ops", icon: "🌏" },
                  { id: "CTX_CS", label: "Customer Success", icon: "💚" },
                  { id: "CTX_SALES", label: "Sales Ops", icon: "🎯" },
                  { id: "CTX_PM", label: "Project Management", icon: "📁" },
                  { id: "CTX_MARKETING", label: "Marketing", icon: "📣" },
                  { id: "CTX_TECH", label: "Engineering", icon: "💻" },
                  { id: "CTX_SUPPORT", label: "Customer Support", icon: "🎧" },
                  { id: "CTX_HR", label: "People & Culture", icon: "👥" },
                  { id: "CTX_FINANCE", label: "Finance", icon: "💰" },
                  { id: "CTX_LEGAL", label: "Legal", icon: "⚖️" },
                ].map((ctx) => (
                  <button
                    key={ctx.id}
                    onClick={() => setActiveCtx(ctx.id as CTXEnum)}
                    className={`p-6 rounded-[32px] border-2 text-left transition-all ${
                      activeCtx === ctx.id 
                        ? "bg-sky-500/10 border-sky-500 ring-4 ring-sky-500/20" 
                        : "bg-white/5 border-white/10 hover:border-sky-500/40"
                    }`}
                  >
                    <div className="text-3xl mb-3">{ctx.icon}</div>
                    <div className="font-black text-lg text-white tracking-tight">{ctx.label}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 font-mono">{ctx.id}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Connect */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Connect Nodes.</h1>
                <p className="text-slate-400 font-medium">Select the data sources to be ingested into the L3 Normalization Pipeline.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {CONNECTORS.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => {
                      if (connectedApps.includes(conn.id)) {
                        setConnectedApps(connectedApps.filter(a => a !== conn.id));
                      } else {
                        setConnectedApps([...connectedApps, conn.id]);
                      }
                    }}
                    className={`p-6 rounded-[32px] border-2 flex flex-col items-center gap-3 transition-all ${
                      connectedApps.includes(conn.id) 
                        ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-500/30 scale-105" 
                        : "bg-white/5 border-white/10 text-white hover:border-sky-500/40 shadow-sm"
                    }`}
                  >
                    <span className="text-3xl">{conn.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{conn.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Ignite Spine */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Ignite the Spine.</h1>
                <p className="text-slate-400 font-medium leading-relaxed">
                  The L3 8-stage normalization pipeline will now build your Goal-Anchored Single Source of Truth.
                  <span className="text-sky-400 font-black uppercase tracking-wider text-xs block mt-2"> Every entity will trace to {orgType === "PRODUCT" ? "product growth" : "service delivery"}.</span>
                </p>
              </div>
              
              <div className="p-8 rounded-[40px] bg-[#131B2E] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shadow-inner border border-sky-500/20">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-black text-xl text-white tracking-tight">Goal-Anchored Spine Ready</div>
                      <div className="text-[10px] text-sky-400 font-mono font-black uppercase tracking-widest mt-1">Normalization_v4.2 + GoalAnchor_v1.0</div>
                    </div>
                  </div>
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Provenance Confidence</span>
                    <span className="text-teal-400">98.4%</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "98.4%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-sky-500 to-teal-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Identity</div>
                    <div className="text-base font-black text-white">{userName || "Arun Kumar"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Org Type</div>
                    <div className="text-base font-black flex items-center gap-2 text-white">
                      {orgType === "PRODUCT" ? <Factory className="w-4 h-4 text-sky-400" /> : orgType === "HYBRID" ? <ArrowUpRight className="w-4 h-4 text-violet-400" /> : <Briefcase className="w-4 h-4 text-emerald-400" />}
                      {orgType}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Active Context</div>
                    <div className="text-base font-black text-white tracking-tight">{activeCtx}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Primary Focus</div>
                    <div className="text-base font-black text-teal-400 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {orgType === "PRODUCT" ? "Growth-Led" : orgType === "HYBRID" ? "Balanced" : "Outcome-Led"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`text-slate-400 hover:text-white transition-colors font-black uppercase text-xs tracking-[0.2em] ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            Back
          </button>
          <Button 
            onClick={handleNext}
            disabled={isInitializing || (step === 0 && !userName)}
            className="h-16 px-10 rounded-[24px] bg-sky-500 text-white hover:bg-sky-600 transition-all font-black uppercase tracking-widest text-sm gap-3 shadow-2xl shadow-sky-500/30 active:scale-95"
          >
            {isInitializing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Normalizing...
              </>
            ) : (
              <>
                {step === STEPS.length - 1 ? "Ignite Spine" : "Next Phase"}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
