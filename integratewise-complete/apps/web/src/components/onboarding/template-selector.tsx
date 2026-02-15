"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Code, Megaphone, HeadphonesIcon, LineChart, Rocket } from "lucide-react"

interface TemplateSelectorProps {
  onSelect: (template: string) => void
}

const templates = [
  {
    id: "sales",
    title: "Sales & CRM",
    description: "Track deals, manage pipelines, and close more revenue",
    icon: Briefcase,
  },
  {
    id: "marketing",
    title: "Marketing Hub",
    description: "Campaigns, content, and lead generation",
    icon: Megaphone,
  },
  {
    id: "ops",
    title: "Operations & Strategy",
    description: "RevOps, Business Ops, and strategic growth oversight",
    icon: Rocket,
  },
  {
    id: "product",
    title: "Product & Engineering",
    description: "Roadmaps, sprints, and feature tracking",
    icon: Code,
  },
  {
    id: "support",
    title: "Customer Success",
    description: "Tickets, health scores, and retention",
    icon: HeadphonesIcon,
  },
  {
    id: "custom",
    title: "Custom Setup",
    description: "Start from scratch with full flexibility",
    icon: LineChart,
  },
]

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Template</h2>
        <p className="text-muted-foreground mt-2">
          Select a template to get started quickly, or create a custom setup
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelect(template.id)}
            >
              <CardHeader>
                <Icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
