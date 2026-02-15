"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, Check, Building2, Users, Briefcase, Target, Zap, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

type OnboardingStep = "welcome" | "individual" | "team" | "work" | "complete"

export default function WelcomePage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [individualData, setIndividualData] = useState({
    fullName: "",
    role: "",
    avatar: "",
  })
  const [teamData, setTeamData] = useState({
    organizationName: "",
    teamSize: "",
    invites: [""],
  })
  const [workData, setWorkData] = useState({
    primaryFocus: [] as string[],
    integrations: [] as string[],
  })

  const focusAreas = [
    { id: "sales", label: "Sales & CRM", icon: Target },
    { id: "cs", label: "Customer Success", icon: Users },
    { id: "marketing", label: "Marketing", icon: Zap },
    { id: "product", label: "Product", icon: Briefcase },
  ]

  const integrationOptions = [
    { id: "hubspot", label: "HubSpot", logo: "H" },
    { id: "salesforce", label: "Salesforce", logo: "S" },
    { id: "slack", label: "Slack", logo: "Sl" },
    { id: "linear", label: "Linear", logo: "L" },
  ]

  const addEmailInvite = () => {
    setTeamData({ ...teamData, invites: [...teamData.invites, ""] })
  }

  const updateInvite = (index: number, value: string) => {
    const newInvites = [...teamData.invites]
    newInvites[index] = value
    setTeamData({ ...teamData, invites: newInvites })
  }

  const toggleFocus = (id: string) => {
    setWorkData({
      ...workData,
      primaryFocus: workData.primaryFocus.includes(id)
        ? workData.primaryFocus.filter((f) => f !== id)
        : [...workData.primaryFocus, id],
    })
  }

  const toggleIntegration = (id: string) => {
    setWorkData({
      ...workData,
      integrations: workData.integrations.includes(id)
        ? workData.integrations.filter((i) => i !== id)
        : [...workData.integrations, id],
    })
  }

  const completeOnboarding = () => {
    // Save onboarding data
    console.log("[v0] Onboarding complete:", { individualData, teamData, workData })
    router.push("/today")
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2F3E5F] via-[#4A6FA5] to-[#2F3E5F] flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold text-white">iW</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to IntegrateWise</h1>
          <p className="text-lg text-gray-600">
            Your intelligent operating system for business growth. Let's get you set up in 3 quick steps.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Individual</p>
              <p className="text-xs text-gray-500">Your profile</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Team</p>
              <p className="text-xs text-gray-500">Invite colleagues</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Work</p>
              <p className="text-xs text-gray-500">Configure workspace</p>
            </div>
          </div>
          <Button size="lg" className="mt-8" onClick={() => setStep("individual")}>
            Get Started <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Card>
      </div>
    )
  }

  if (step === "individual") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">Step 1 of 3</Badge>
            <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
            <p className="text-gray-600">Set up your individual profile</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={individualData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {individualData.fullName.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={individualData.fullName}
                onChange={(e) => setIndividualData({ ...individualData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Role / Job Title</Label>
              <Input
                placeholder="e.g. Sales Manager, CEO, Product Lead"
                value={individualData.role}
                onChange={(e) => setIndividualData({ ...individualData, role: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep("welcome")} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => setStep("team")}
              disabled={!individualData.fullName || !individualData.role}
              className="flex-1"
            >
              Continue <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (step === "team") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">Step 2 of 3</Badge>
            <h2 className="text-2xl font-bold text-gray-900">Set up your team</h2>
            <p className="text-gray-600">Create your organization and invite team members</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                placeholder="Acme Corp"
                value={teamData.organizationName}
                onChange={(e) => setTeamData({ ...teamData, organizationName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Team Size</Label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={teamData.teamSize}
                onChange={(e) => setTeamData({ ...teamData, teamSize: e.target.value })}
              >
                <option value="">Select team size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-20">6-20 people</option>
                <option value="21-50">21-50 people</option>
                <option value="51+">51+ people</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Invite Team Members (Optional)</Label>
              {teamData.invites.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Mail className="w-5 h-5 text-gray-400 mt-2" />
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => updateInvite(index, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addEmailInvite} className="mt-2 bg-transparent">
                + Add Another
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep("individual")} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => setStep("work")}
              disabled={!teamData.organizationName || !teamData.teamSize}
              className="flex-1"
            >
              Continue <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (step === "work") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">Step 3 of 3</Badge>
            <h2 className="text-2xl font-bold text-gray-900">Configure your workspace</h2>
            <p className="text-gray-600">Choose your focus areas and connect integrations</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Primary Focus Areas</Label>
              <div className="grid grid-cols-2 gap-3">
                {focusAreas.map((area) => {
                  const Icon = area.icon
                  const isSelected = workData.primaryFocus.includes(area.id)
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleFocus(area.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">{area.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Connect Integrations (Optional)</Label>
              <div className="grid grid-cols-2 gap-3">
                {integrationOptions.map((integration) => {
                  const isSelected = workData.integrations.includes(integration.id)
                  return (
                    <button
                      key={integration.id}
                      onClick={() => toggleIntegration(integration.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {integration.logo}
                        </div>
                        <span className="font-medium text-sm">{integration.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep("team")} className="flex-1">
              Back
            </Button>
            <Button onClick={completeOnboarding} className="flex-1">
              Complete Setup <Check className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
