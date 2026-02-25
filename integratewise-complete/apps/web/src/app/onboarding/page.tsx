"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, User, Building2, Globe, Database, Zap } from "lucide-react";

const steps = [
  { id: "identity", label: "IDENTITY", icon: User },
  { id: "org-dna", label: "ORG DNA", icon: Building2 },
  { id: "context", label: "CONTEXT", icon: Globe },
  { id: "connect", label: "CONNECT", icon: Database },
  { id: "spine", label: "SPINE", icon: Zap },
];

const orgTypes = [
  {
    id: "product",
    title: "Product-Based Organization",
    subtitle: "SaaS, Platform, or Product Company",
    description: "All data drills down to product growth — adoption, retention, and expansion revenue.",
    focus: "Product-Led Growth",
    metrics: ["ARR / MRR", "Net Revenue Retention", "Feature Adoption", "Time to Value", "DAU/MAU"],
  },
  {
    id: "services",
    title: "Services-Based Organization",
    subtitle: "Consulting, IT Services, or Agency",
    description: "All data drills down to service delivery — client outcomes, utilization, and margins.",
    focus: "Service Delivery Excellence",
    metrics: ["Revenue per Engagement", "Billable Utilization", "Client Outcome Score", "On-Time Delivery", "Repeat Rate"],
  },
];

const contexts = [
  { id: "bizops", name: "Business Ops", code: "CTX_BIZOPS", icon: "🌐" },
  { id: "cs", name: "Customer Success", code: "CTX_CS", icon: "💚" },
  { id: "sales", name: "Sales Ops", code: "CTX_SALES", icon: "🎯" },
  { id: "pm", name: "Project Management", code: "CTX_PM", icon: "📁" },
  { id: "marketing", name: "Marketing", code: "CTX_MARKETING", icon: "📢" },
  { id: "tech", name: "Engineering", code: "CTX_TECH", icon: "💻" },
];

const integrations = [
  { id: "salesforce", name: "Salesforce", icon: "☁️" },
  { id: "hubspot", name: "HubSpot", icon: "🎯" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "jira", name: "Jira", icon: "🛠️" },
  { id: "stripe", name: "Stripe", icon: "💳" },
  { id: "github", name: "GitHub", icon: "🐙" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    jobRole: "",
    orgType: "",
    context: "",
    integrations: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIntegration = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(id)
        ? prev.integrations.filter((i) => i !== id)
        : [...prev.integrations, id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Stepper */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12s1.5-2 4-2 4 2 4 2" />
                  <circle cx="9" cy="9" r="1.5" />
                  <circle cx="15" cy="9" r="1.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center border transition-all ${
                        isActive
                          ? "bg-black text-white border-black"
                          : isCompleted
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-400 border-gray-200"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium tracking-wider ${
                        isActive || isCompleted ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-200 mx-2 mb-5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step 1: Identity */}
          {currentStep === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-light text-black mb-3">
                Welcome to <span className="font-medium">IntegrateWise.</span>
              </h1>
              <p className="text-gray-500 mb-10">
                Establish your operational identity to begin Spine normalization.
              </p>

              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Full Name
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 border-gray-200 rounded-none focus:border-black focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Job Role
                  </Label>
                  <Input
                    placeholder="Operations Lead"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="h-12 border-gray-200 rounded-none focus:border-black focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Org DNA */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-black mb-3">
                  Your <span className="font-medium">Org DNA.</span>
                </h1>
                <p className="text-gray-500">
                  Every metric, view, and entity will trace to your organization's growth model.
                </p>
              </div>

              <div className="space-y-4">
                {orgTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setFormData({ ...formData, orgType: type.id })}
                    className={`p-6 border cursor-pointer transition-all ${
                      formData.orgType === type.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-gray-200 flex items-center justify-center bg-white">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-black text-lg">{type.title}</h3>
                          {formData.orgType === type.id && (
                            <Check className="w-5 h-5 text-black" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{type.subtitle}</p>
                        <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">◎</span>
                          <span className="font-medium text-gray-700">PRIMARY FOCUS:</span>
                          <span className="text-gray-900">{type.focus}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {type.metrics.map((metric) => (
                            <span
                              key={metric}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Measurement Lenses */}
              <div className="mt-6 p-4 border border-gray-200 bg-white">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Every View Serves Two Measurement Lenses
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-gray-200 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Provider Lens</p>
                      <p className="text-xs text-gray-500">How is YOUR org growing?</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Client Lens</p>
                      <p className="text-xs text-gray-500">Is the CLIENT getting value?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Context */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-black mb-3">
                  Operating <span className="font-medium">Context.</span>
                </h1>
                <p className="text-gray-500">
                  Choose the lens through which you'll view the unified workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {contexts.map((ctx) => (
                  <div
                    key={ctx.id}
                    onClick={() => setFormData({ ...formData, context: ctx.id })}
                    className={`p-5 border cursor-pointer transition-all ${
                      formData.context === ctx.id
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-3">{ctx.icon}</div>
                    <h3 className="font-medium text-black mb-1">{ctx.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{ctx.code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Connect */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-black mb-3">
                  Connect <span className="font-medium">Nodes.</span>
                </h1>
                <p className="text-gray-500">
                  Select the data sources to be ingested into the L3 Normalization Pipeline.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {integrations.map((integration) => {
                  const isSelected = formData.integrations.includes(integration.id);
                  return (
                    <div
                      key={integration.id}
                      onClick={() => toggleIntegration(integration.id)}
                      className={`p-5 border cursor-pointer transition-all text-center ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="text-2xl mb-3">{integration.icon}</div>
                      <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-black"}`}>
                        {integration.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              {formData.integrations.length > 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  {formData.integrations.length} integration{formData.integrations.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 5: Spine */}
          {currentStep === 4 && (
            <div className="text-center">
              <h1 className="text-3xl font-light text-black mb-3">
                Ignite the <span className="font-medium">Spine.</span>
              </h1>
              <p className="text-gray-500 mb-10 max-w-lg mx-auto">
                The L3 8-stage normalization pipeline will now build your Goal-Anchored Single Source of Truth.
                <span className="text-black font-medium"> Every entity will trace to product growth.</span>
              </p>

              <div className="bg-white border border-gray-200 p-6 max-w-md mx-auto text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 border border-gray-200 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Goal-Anchored Spine Ready</h3>
                    <p className="text-xs text-gray-400">Normalization_v4.2 + GoalAnchor_v1.0</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-gray-500">Provenance Confidence</span>
                    <span className="text-sm font-medium">98.4%</span>
                  </div>
                  <div className="h-2 bg-gray-100">
                    <div className="h-full bg-black" style={{ width: "98.4%" }} />
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Identity</p>
                    <p className="text-sm text-black">{formData.fullName || "Nirmal"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Org Type</p>
                    <p className="text-sm text-black">Product</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Active Context</p>
                    <p className="text-sm text-black">CTX_CS</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Primary Focus</p>
                    <p className="text-sm text-black">Product-Led Growth</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-gray-500 hover:text-black rounded-none"
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && (!formData.fullName || !formData.jobRole)) ||
              (currentStep === 1 && !formData.orgType) ||
              (currentStep === 2 && !formData.context)
            }
            className="bg-black hover:bg-gray-900 text-white px-6 rounded-none"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Normalizing...
                <div className="ml-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </>
            ) : (
              <>
                Next Phase
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
