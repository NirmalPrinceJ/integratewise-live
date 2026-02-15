"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Database, FileText, Loader2 } from "lucide-react"

interface LoadDataViewProps {
  onComplete: () => void
  onSkip?: () => void
}

export function LoadDataView({ onComplete, onSkip }: LoadDataViewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Load Your Data</h2>
        <p className="text-muted-foreground mt-2">
          Connect your existing tools or upload data to get started
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <Database className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Connect CRM</CardTitle>
            <CardDescription>Import from HubSpot, Salesforce, etc.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <Upload className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Upload CSV</CardTitle>
            <CardDescription>Import data from spreadsheets</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Sample Data</CardTitle>
            <CardDescription>Start with demo data</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
        <Button onClick={onComplete}>Continue</Button>
      </div>
    </div>
  )
}
