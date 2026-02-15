"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Plug, Upload, Sparkles, ArrowRight,
    Loader2, CheckCircle2, AlertCircle, TrendingUp,
    Database, FileText, Brain, X
} from "lucide-react";
import { DataStrengthLevel, DataStrength, EnrichmentSuggestion } from "@/types/data-strength";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE - When a view has no data
// ═══════════════════════════════════════════════════════════════

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actions?: {
        label: string;
        href: string;
        variant?: "default" | "outline" | "secondary";
    }[];
}

export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                {icon || <Database className="h-8 w-8 text-muted-foreground" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-md mb-6">{description}</p>
            {actions && actions.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                    {actions.map((action, idx) => (
                        <Button
                            key={idx}
                            variant={action.variant || (idx === 0 ? "default" : "outline")}
                            asChild
                        >
                            <a href={action.href}>
                                {idx === 0 && <Plug className="h-4 w-4 mr-2" />}
                                {action.label}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// ENRICHMENT BANNER - Prompt to connect more tools
// ═══════════════════════════════════════════════════════════════

interface EnrichmentBannerProps {
    message: string;
    actions?: { label: string; href: string }[];
    dismissible?: boolean;
    onDismiss?: () => void;
}

export function EnrichmentBanner({
    message,
    actions,
    dismissible = true,
    onDismiss
}: EnrichmentBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">{message}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {actions?.map((action, idx) => (
                        <Button key={idx} size="sm" variant={idx === 0 ? "default" : "ghost"} asChild>
                            <a href={action.href}>{action.label}</a>
                        </Button>
                    ))}
                    {dismissible && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                setDismissed(true);
                                onDismiss?.();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// DATA STRENGTH INDICATOR - Shows overall data health
// ═══════════════════════════════════════════════════════════════

interface DataStrengthIndicatorProps {
    strength: DataStrength;
    showDetails?: boolean;
    compact?: boolean;
}

const levelConfig: Record<DataStrengthLevel, { color: string; label: string; emoji: string }> = {
    seed: { color: "bg-orange-500", label: "Getting Started", emoji: "🌱" },
    growing: { color: "bg-yellow-500", label: "Growing", emoji: "🌿" },
    healthy: { color: "bg-green-500", label: "Healthy", emoji: "🌳" },
    rich: { color: "bg-emerald-500", label: "Rich", emoji: "🌲" }
};

export function DataStrengthIndicator({
    strength,
    showDetails = false,
    compact = false
}: DataStrengthIndicatorProps) {
    const config = levelConfig[strength.level];

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span>{config.emoji}</span>
                <Progress value={strength.score} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">{strength.score}%</span>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Data Strength</CardTitle>
                    <Badge variant="secondary" className="gap-1">
                        {config.emoji} {config.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Overall Score</span>
                        <span className="font-medium">{strength.score}%</span>
                    </div>
                    <Progress value={strength.score} className="h-2" />

                    {showDetails && (
                        <>
                            {/* Sources */}
                            {strength.sources.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground mb-2">Connected Sources</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {strength.sources.map(source => (
                                            <Badge key={source} variant="outline" className="text-xs">
                                                {source}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {strength.suggestions.length > 0 && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground mb-2">To improve</p>
                                    {strength.suggestions.slice(0, 2).map((suggestion, idx) => (
                                        <SuggestionItem key={idx} suggestion={suggestion} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function SuggestionItem({ suggestion }: { suggestion: EnrichmentSuggestion }) {
    const Icon = suggestion.type === 'connect_tool' ? Plug :
        suggestion.type === 'upload_data' ? Upload : Sparkles;

    return (
        <a
            href={suggestion.action_url}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">{suggestion.message}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </a>
    );
}

// ═══════════════════════════════════════════════════════════════
// SYNC PROGRESS - Shows ongoing sync status
// ═══════════════════════════════════════════════════════════════

interface SyncProgressProps {
    tool: string;
    status: 'pending' | 'syncing' | 'complete' | 'error';
    progress?: number;
    entitiesSynced?: number;
    message?: string;
}

export function SyncProgress({
    tool,
    status,
    progress = 0,
    entitiesSynced = 0,
    message
}: SyncProgressProps) {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg">
            {status === 'syncing' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            {status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {status === 'pending' && <Database className="h-5 w-5 text-muted-foreground" />}

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{tool}</p>
                    {status === 'syncing' && (
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                    )}
                </div>
                {status === 'syncing' && (
                    <Progress value={progress} className="h-1 mt-1" />
                )}
                {message && (
                    <p className="text-xs text-muted-foreground mt-1">{message}</p>
                )}
                {status === 'complete' && entitiesSynced > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {entitiesSynced} records synced
                    </p>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// PARTIAL DATA BADGE - Shows entity has incomplete data
// ═══════════════════════════════════════════════════════════════

interface PartialDataBadgeProps {
    completeness: number;  // 0-100
    className?: string;
}

export function PartialDataBadge({ completeness, className }: PartialDataBadgeProps) {
    if (completeness >= 80) return null;

    return (
        <Badge
            variant="outline"
            className={`gap-1 text-xs ${className}`}
        >
            <TrendingUp className="h-3 w-3" />
            {completeness}% complete
        </Badge>
    );
}

// ═══════════════════════════════════════════════════════════════
// STRENGTH UPDATE TOAST - Shows when data strength improves
// ═══════════════════════════════════════════════════════════════

interface StrengthUpdateToastProps {
    oldScore: number;
    newScore: number;
    newLevel: DataStrengthLevel;
    trigger: string;
    onClose?: () => void;
}

export function StrengthUpdateToast({
    oldScore,
    newScore,
    newLevel,
    trigger,
    onClose
}: StrengthUpdateToastProps) {
    const config = levelConfig[newLevel];
    const improvement = newScore - oldScore;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
            <Card className="w-80 shadow-lg border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Data Strength Increased! {config.emoji}</p>
                            <p className="text-sm text-muted-foreground">
                                +{improvement}% from {trigger}
                            </p>
                            <div className="mt-2">
                                <Progress value={newScore} className="h-2" />
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-1"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// THREE STORE INDICATOR - Shows data in Spine/Context/Knowledge
// ═══════════════════════════════════════════════════════════════

interface ThreeStoreIndicatorProps {
    spine: number;
    context: number;
    knowledge: number;
}

export function ThreeStoreIndicator({ spine, context, knowledge }: ThreeStoreIndicatorProps) {
    const stores = [
        { name: 'Spine', icon: Database, count: spine, description: 'Entities' },
        { name: 'Context', icon: FileText, count: context, description: 'Documents' },
        { name: 'Knowledge', icon: Brain, count: knowledge, description: 'Insights' }
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {stores.map(store => {
                const Icon = store.icon;
                return (
                    <div
                        key={store.name}
                        className="p-3 border rounded-lg text-center"
                    >
                        <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xl font-bold">{store.count}</p>
                        <p className="text-xs text-muted-foreground">{store.description}</p>
                    </div>
                );
            })}
        </div>
    );
}
