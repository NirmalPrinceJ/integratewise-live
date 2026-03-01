/**
 * IntelligencePanel - L2 Cognitive Layer Overlay
 * 
 * Provides:
 * - Signals (alerts, recommendations)
 * - Think (AI analysis)
 * - Evidence (supporting data)
 * - Act (approved actions)
 * - Audit (history)
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useRBAC } from '@/hooks/useRBAC';

import {
  X,
  Bell,
  Brain,
  FileText,
  Zap,
  History,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Shield,
  type LucideIcon
} from 'lucide-react';

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
}

// Mock signals data
const MOCK_SIGNALS = [
  {
    id: '1',
    type: 'critical',
    title: 'Account At Risk: TechFlow',
    description: 'Champion left, support tickets up 400%',
    timestamp: '2 min ago',
    source: 'Spine + Context',
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Schedule QBR with Acme Corp',
    description: 'Renewal in 60 days, upsell opportunity identified',
    timestamp: '1 hour ago',
    source: 'Think Engine',
  },
  {
    id: '3',
    type: 'insight',
    title: 'Pattern Detected',
    description: 'Video updates increase engagement by 30%',
    timestamp: '3 hours ago',
    source: 'Analytics',
  },
];

// Mock think items
const MOCK_THINK_ITEMS = [
  {
    id: '1',
    title: 'TechFlow Renewal Strategy',
    confidence: 85,
    recommendation: 'Schedule exec meeting, present new features',
    impact: 'High',
  },
  {
    id: '2',
    title: 'Acme Corp Expansion',
    confidence: 72,
    recommendation: 'Propose premium tier with AI features',
    impact: 'Medium',
  },
];

export function IntelligencePanel({ isOpen, onClose, role }: IntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState('signals');
  const { hasPermission } = useRBAC();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-card border-l border-border shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Intelligence</h2>
          <Badge variant="secondary" className="text-[10px]">L2</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 py-2 h-auto">
          <TabsTrigger value="signals" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            Signals
            <Badge variant="secondary" className="text-[10px] ml-1">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="think" className="gap-1.5 text-xs">
            <Brain className="h-3.5 w-3.5" />
            Think
          </TabsTrigger>
          <TabsTrigger value="evidence" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-xs">
            <History className="h-3.5 w-3.5" />
            Audit
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Signals Tab */}
          <TabsContent value="signals" className="m-0 p-4 space-y-3">
            {MOCK_SIGNALS.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </TabsContent>

          {/* Think Tab */}
          <TabsContent value="think" className="m-0 p-4 space-y-3">
            {MOCK_THINK_ITEMS.map((item) => (
              <ThinkCard key={item.id} item={item} />
            ))}
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="m-0 p-4">
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a signal to view evidence</p>
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="m-0 p-4">
            <div className="text-center text-muted-foreground py-8">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent actions</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Footer - Quick Actions */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            New Action
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Policies
          </Button>
        </div>
      </div>
    </div>
  );
}

// Signal Card Component
function SignalCard({ signal }: { signal: any }) {
  const icons: Record<string, LucideIcon> = {
    critical: AlertTriangle,
    recommendation: Sparkles,
    insight: Info,
  };
  const colors: Record<string, string> = {
    critical: 'border-l-red-500 bg-red-500/5',
    recommendation: 'border-l-blue-500 bg-blue-500/5',
    insight: 'border-l-purple-500 bg-purple-500/5',
  };
  const Icon = icons[signal.type] || Info;

  return (
    <div className={cn(
      'p-3 rounded-lg border border-border border-l-4',
      colors[signal.type] || colors.insight
    )}>
      <div className="flex items-start gap-2">
        <Icon className={cn(
          'h-4 w-4 mt-0.5',
          signal.type === 'critical' && 'text-red-500',
          signal.type === 'recommendation' && 'text-blue-500',
          signal.type === 'insight' && 'text-purple-500'
        )} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{signal.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">{signal.source}</span>
            <span className="text-[10px] text-muted-foreground">{signal.timestamp}</span>
          </div>
        </div>
      </div>
      {signal.type === 'critical' && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="h-7 text-xs">View Details</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">Dismiss</Button>
        </div>
      )}
    </div>
  );
}

// Think Card Component
function ThinkCard({ item }: { item: any }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium">{item.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{item.recommendation}</p>
        </div>
        <Badge 
          variant={item.confidence > 80 ? 'default' : 'secondary'}
          className="text-[10px]"
        >
          {item.confidence}% confidence
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-muted-foreground">Impact: {item.impact}</span>
        <div className="flex gap-2">
          <Button size="sm" className="h-7 text-xs">Approve</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">Modify</Button>
        </div>
      </div>
    </div>
  );
}
