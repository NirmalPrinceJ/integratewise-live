/**
 * Onboarding Flow (4 Steps)
 * 
 * Step 1: Role & Domain Selection
 * Step 2: Integration (3 categories: CRM, Task, Workspace)
 * Step 3: File Upload (2-10MB, Markdown/Doc/Txt/CSV)
 * Step 4: Accelerator (department-specific, payment gated)
 * 
 * Then: Loader Phase 1 → Workspace
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  ChevronRight,
  Rocket,
  Plug,
  Upload,
  Zap,
  Loader2,
  Building2,
  Users,
  Target,
  TrendingUp,
  Mail,
  MessageSquare,
  DollarSign,
  Code,
  ShoppingCart,
  Wrench,
  GraduationCap,
  BarChart3,
  FileText,
  CheckSquare,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LogoMark } from "../landing/logo";
import type { Domain } from "../workspace/workspace-config";

interface OnboardingFlowProps {
  onComplete: (data: {
    userName: string;
    domain: Domain;
    connectors: {
      crm?: string;
      task?: string;
      workspace?: string;
    };
    uploadedFiles?: File[];
    accelerator?: string;
  }) => void;
  initialUserName?: string; // From Google/Email login
  initialEmail?: string;
}

const STEPS = [
  { id: "role", label: "Role & Domain", icon: Rocket },
  { id: "integration", label: "Integration", icon: Plug },
  { id: "upload", label: "Upload Files", icon: Upload },
  { id: "accelerator", label: "Accelerator", icon: Zap },
];

// ─── STEP 1: ROLE & DOMAIN SELECTION ────────────────────────────────────────

const DOMAINS = [
  { 
    id: "CUSTOMER_SUCCESS" as Domain, 
    label: "Customer Success", 
    icon: Users, 
    color: "#10B981",
    description: "Manage accounts, health scores, renewals"
  },
  { 
    id: "SALES" as Domain, 
    label: "Sales", 
    icon: Target, 
    color: "#0EA5E9",
    description: "Pipeline, deals, forecasting"
  },
  { 
    id: "REVOPS" as Domain, 
    label: "Revenue Operations", 
    icon: TrendingUp, 
    color: "#8B5CF6",
    description: "Revenue analytics, territories, quotas"
  },
  { 
    id: "MARKETING" as Domain, 
    label: "Marketing", 
    icon: MessageSquare, 
    color: "#EC4899",
    description: "Campaigns, leads, attribution"
  },
  { 
    id: "PRODUCT_ENGINEERING" as Domain, 
    label: "Product & Engineering", 
    icon: Code, 
    color: "#6366F1",
    description: "Roadmap, sprints, releases"
  },
  { 
    id: "FINANCE" as Domain, 
    label: "Finance", 
    icon: DollarSign, 
    color: "#14B8A6",
    description: "Revenue, expenses, forecasting"
  },
  { 
    id: "SERVICE" as Domain, 
    label: "Customer Service", 
    icon: Mail, 
    color: "#F59E0B",
    description: "Tickets, CSAT, knowledge base"
  },
  { 
    id: "PROCUREMENT" as Domain, 
    label: "Procurement", 
    icon: ShoppingCart, 
    color: "#84CC16",
    description: "Vendors, orders, contracts"
  },
  { 
    id: "IT_ADMIN" as Domain, 
    label: "IT & Admin", 
    icon: Wrench, 
    color: "#64748B",
    description: "Users, permissions, integrations"
  },
  { 
    id: "STUDENT_TEACHER" as Domain, 
    label: "Student / Teacher", 
    icon: GraduationCap, 
    color: "#F97316",
    description: "Courses, assignments, grades"
  },
];

// ─── STEP 2: INTEGRATION CONNECTORS ─────────────────────────────────────────

const INTEGRATION_CATEGORIES = {
  crm: {
    label: "CRM Platform",
    description: "Connect your customer relationship management tool",
    options: [
      { id: "salesforce", name: "Salesforce", icon: "☁️" },
      { id: "hubspot", name: "HubSpot", icon: "🎯" },
      { id: "zoho", name: "Zoho CRM", icon: "📊" },
    ]
  },
  task: {
    label: "Task Management",
    description: "Connect your task tracking tool",
    options: [
      { id: "anydo", name: "Any.do", icon: "✅" },
      { id: "todoist", name: "Todoist", icon: "📝" },
    ]
  },
  workspace: {
    label: "Workspace Tool",
    description: "Connect your knowledge & collaboration platform",
    options: [
      { id: "coda", name: "Coda", icon: "📄" },
      { id: "notion", name: "Notion", icon: "✨" },
      { id: "airtable", name: "Airtable", icon: "🗂️" },
      { id: "asana", name: "Asana", icon: "🎯" },
    ]
  }
};

// ─── STEP 4: ACCELERATORS ───────────────────────────────────────────────────

const ACCELERATORS = [
  { 
    id: "csm-playbook", 
    label: "CSM Playbook", 
    domain: "CUSTOMER_SUCCESS",
    description: "Pre-built workflows for onboarding, QBRs, renewals",
    price: "$49",
    icon: Users
  },
  { 
    id: "sales-pipeline", 
    label: "Sales Pipeline", 
    domain: "SALES",
    description: "Pipeline stages, email templates, forecasting",
    price: "$49",
    icon: Target
  },
  { 
    id: "revops-analytics", 
    label: "RevOps Analytics", 
    domain: "REVOPS",
    description: "Revenue dashboards, quota tracking, territory maps",
    price: "$79",
    icon: BarChart3
  },
  { 
    id: "marketing-campaigns", 
    label: "Marketing Campaigns", 
    domain: "MARKETING",
    description: "Campaign templates, attribution models, lead scoring",
    price: "$49",
    icon: MessageSquare
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function OnboardingFlowNew({ onComplete, initialUserName, initialEmail }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  
  // Step 1: Role & Domain
  const [userName, setUserName] = useState(initialUserName || "");
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  
  // Step 2: Integration
  const [connectors, setConnectors] = useState<{
    crm?: string;
    task?: string;
    workspace?: string;
  }>({});
  
  // Step 3: File Upload
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  
  // Step 4: Accelerator
  const [selectedAccelerator, setSelectedAccelerator] = useState<string | null>(null);
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError("");
    
    // Validate file size (2-10MB)
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB < 2 || sizeMB > 10) {
        setUploadError(`${file.name} must be between 2-10MB`);
        return false;
      }
      
      // Validate file type
      const validTypes = [".md", ".doc", ".docx", ".txt", ".csv"];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (!validTypes.includes(ext)) {
        setUploadError(`${file.name} must be Markdown, Doc, Txt, or CSV`);
        return false;
      }
      
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, []);
  
  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleComplete = useCallback(() => {
    if (!selectedDomain) return;
    
    onComplete({
      userName: userName || "User",
      domain: selectedDomain,
      connectors,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      accelerator: selectedAccelerator || undefined,
    });
  }, [userName, selectedDomain, connectors, uploadedFiles, selectedAccelerator, onComplete]);
  
  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  }, [step, handleComplete]);
  
  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedDomain && userName.length > 0;
      case 1: return !!connectors.crm && !!connectors.task && !!connectors.workspace;
      case 2: return true; // File upload is optional
      case 3: return true; // Accelerator is optional
      default: return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0C1222] text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      
      <div className="w-full max-w-4xl relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <LogoMark size={80} />
        </div>
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-2 max-w-2xl mx-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive ? "bg-emerald-500 scale-110" :
                  isCompleted ? "bg-teal-500" :
                  "bg-white/10"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-white" : "text-slate-500"}`}>
                  {s.label}
                </span>
                
                {/* Connector Line */}
                {i < STEPS.length - 1 && (
                  <div className={`absolute w-[calc(25%-2rem)] h-0.5 top-5 transition-all ${
                    isCompleted ? "bg-teal-500" : "bg-white/10"
                  }`} style={{ left: `calc(${(i + 1) * 25}% - 1rem)` }} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0F1629] border border-white/10 rounded-2xl p-8"
          >
            {/* STEP 1: ROLE & DOMAIN */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Welcome! Let's get you set up</h2>
                  <p className="text-slate-500">First, tell us your name and what you do</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Your Name</label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-[#0C1222] border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Select Your Domain</label>
                    <div className="grid grid-cols-2 gap-3">
                      {DOMAINS.map(domain => {
                        const Icon = domain.icon;
                        const isSelected = selectedDomain === domain.id;
                        
                        return (
                          <button
                            key={domain.id}
                            onClick={() => setSelectedDomain(domain.id)}
                            className={`p-4 rounded-xl border transition-all text-left min-h-[44px] ${
                              isSelected 
                                ? "border-emerald-500 bg-emerald-500/10" 
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-emerald-500/20" : "bg-white/10"
                              }`} style={{ color: domain.color }}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm mb-0.5">{domain.label}</div>
                                <div className="text-xs text-slate-500">{domain.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* STEP 2: INTEGRATION */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Connect Your Tools</h2>
                  <p className="text-slate-500">Pick one from each category to get started</p>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => (
                    <div key={key}>
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-white">{category.label}</h3>
                        <p className="text-xs text-slate-500">{category.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {category.options.map(option => {
                          const isSelected = connectors[key as keyof typeof connectors] === option.id;
                          
                          return (
                            <button
                              key={option.id}
                              onClick={() => setConnectors(prev => ({ ...prev, [key]: option.id }))}
                              className={`p-4 rounded-xl border transition-all ${
                                isSelected 
                                  ? "border-emerald-500 bg-emerald-500/10" 
                                  : "border-white/10 bg-white/5 hover:border-white/20"
                              }`}
                            >
                              <div className="text-3xl mb-2">{option.icon}</div>
                              <div className="text-sm font-medium">{option.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-300">
                    <strong>Quick Connect:</strong> We'll fetch your data to show you value in 60 seconds
                  </div>
                </div>
              </div>
            )}
            
            {/* STEP 3: FILE UPLOAD */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Upload Files (Optional)</h2>
                  <p className="text-slate-500">Add documents to enrich your workspace (2-10MB)</p>
                </div>
                
                <div className="space-y-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <div className="text-sm font-medium mb-1">Click to upload or drag and drop</div>
                      <div className="text-xs text-slate-500">Markdown, Doc, Txt, or CSV (2-10MB each)</div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".md,.doc,.docx,.txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {uploadError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {uploadError}
                    </div>
                  )}
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-300">Uploaded Files ({uploadedFiles.length})</div>
                      {uploadedFiles.map((file, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-teal-400" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-slate-400">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(i)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-teal-300">
                      <strong>AI Enhancement:</strong> We'll extract key insights from your documents
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* STEP 4: ACCELERATOR */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Accelerate Your Setup</h2>
                  <p className="text-slate-500">Get pre-built workflows and templates for your domain</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {ACCELERATORS
                    .filter(acc => !selectedDomain || acc.domain === selectedDomain)
                    .map(acc => {
                      const Icon = acc.icon;
                      const isSelected = selectedAccelerator === acc.id;
                      
                      return (
                        <button
                          key={acc.id}
                          onClick={() => setSelectedAccelerator(isSelected ? null : acc.id)}
                          className={`p-6 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? "border-teal-500 bg-teal-500/10" 
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-teal-500/20" : "bg-white/10"
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="text-lg font-bold text-emerald-400">{acc.price}</div>
                          </div>
                          <h3 className="font-semibold mb-2">{acc.label}</h3>
                          <p className="text-xs text-slate-500">{acc.description}</p>
                        </button>
                      );
                    })}
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-300">
                    <strong>Skip for now?</strong> You can always add accelerators later from Settings.
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              {step > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="text-slate-400 hover:text-white"
                >
                  Back
                </Button>
              )}
              
              <div className="flex-1" />
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                {step === STEPS.length - 1 ? "Complete Setup" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}