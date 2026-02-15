"use client";

// src/components/workspace/home-skeleton.tsx
// Home Skeleton - The 5 non-negotiable blocks wired to real data

import React from 'react';
import { useWorkspaceBag } from '@/contexts/workspace-bag-context';
import { useHydration } from '@/contexts/hydration-context';
import { useHomeData, type SignalItem, type WorkQueueItem, type KnowledgeItem, type ConnectorSuggestion } from '@/hooks/useHomeData';
import {
    CalendarDays, Radio, ListTodo, BookOpen, Plug,
    ChevronRight, Plus, Sparkles, ArrowRight, Loader2
} from 'lucide-react';

const SKELETON_ICONS: Record<string, React.ElementType> = {
    'today-strip': CalendarDays,
    'signal-feed': Radio,
    'work-queue': ListTodo,
    'recent-knowledge': BookOpen,
    'connect-next': Plug,
};

// ═══════════════════════════════════════════════════════════════
// TODAY STRIP BLOCK
// ═══════════════════════════════════════════════════════════════

interface TodayStripProps {
    meetings: number;
    tasksDue: number;
    followUps: number;
    date: string;
    isLoading?: boolean;
}

function TodayStripBlock({ meetings, tasksDue, followUps, date, isLoading }: TodayStripProps) {
    return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Today</h3>
                </div>
                <span className="text-sm text-gray-400">{date}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{meetings}</p>
                    )}
                    <p className="text-xs text-gray-500">Meetings</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{tasksDue}</p>
                    )}
                    <p className="text-xs text-gray-500">Tasks Due</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{followUps}</p>
                    )}
                    <p className="text-xs text-gray-500">Follow-ups</p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SIGNAL FEED BLOCK
// ═══════════════════════════════════════════════════════════════

interface SignalFeedProps {
    signals: SignalItem[];
    isLoading?: boolean;
}

function SignalFeedBlock({ signals, isLoading }: SignalFeedProps) {
    const hydration = useHydration();

    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Signal Feed</h3>
                </div>
                <span className="text-xs text-gray-500">{signals.length} insights</span>
            </div>
            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                ) : signals.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No signals yet. Connect more data sources.</p>
                ) : (
                    signals.map(signal => (
                        <div key={signal.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer group">
                            <div className={`w-2 h-2 rounded-full ${signal.type === 'risk' ? 'bg-red-500' :
                                    signal.type === 'opportunity' ? 'bg-green-500' : 'bg-blue-500'
                                }`} />
                            <p className="flex-1 text-sm text-gray-300 truncate">{signal.text}</p>
                            <span className="text-xs text-gray-600">{signal.time}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100" />
                        </div>
                    ))
                )}
            </div>
            {hydration?.strength?.level === 'seed' && (
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Connect more tools for richer signals
                </p>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// WORK QUEUE BLOCK
// ═══════════════════════════════════════════════════════════════

interface WorkQueueProps {
    items: WorkQueueItem[];
    isLoading?: boolean;
}

function WorkQueueBlock({ items, isLoading }: WorkQueueProps) {
    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">My Work Queue</h3>
                </div>
                <span className="text-xs text-gray-500">{items.length} items</span>
            </div>
            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">Your queue is clear! 🎉</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                            <div className={`w-1.5 h-6 rounded-full ${item.priority === 'high' ? 'bg-red-500' :
                                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{item.text}</p>
                                <p className="text-xs text-gray-600 capitalize">{item.type}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// RECENT KNOWLEDGE BLOCK
// ═══════════════════════════════════════════════════════════════

interface RecentKnowledgeProps {
    docs: KnowledgeItem[];
    isLoading?: boolean;
}

function RecentKnowledgeBlock({ docs, isLoading }: RecentKnowledgeProps) {
    const getDocIcon = (type: string) => {
        switch (type) {
            case 'presentation': return '📊';
            case 'notes': return '📝';
            case 'email': return '📧';
            default: return '📄';
        }
    };

    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Recent Knowledge</h3>
                </div>
            </div>
            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                ) : docs.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No recent documents. Upload or connect sources.</p>
                ) : (
                    docs.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                            <div className="w-8 h-8 rounded bg-gray-700/50 flex items-center justify-center text-xs text-gray-400">
                                {getDocIcon(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-600">{doc.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// CONNECT NEXT BLOCK
// ═══════════════════════════════════════════════════════════════

interface ConnectNextProps {
    suggestions: ConnectorSuggestion[];
    isLoading?: boolean;
}

function ConnectNextBlock({ suggestions, isLoading }: ConnectNextProps) {
    const hydration = useHydration();
    const unconnected = suggestions.filter(s => !s.connected);

    if (unconnected.length === 0 && !isLoading) {
        return null; // All suggested tools are connected
    }

    return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
                <Plug className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-white">Connect Next</h3>
            </div>
            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                ) : (
                    unconnected.slice(0, 2).map((s, i) => (
                        <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-green-500/50 transition-colors text-left">
                            <span className="text-xl">{s.icon}</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Connect {s.tool}</p>
                                <p className="text-xs text-gray-500">{s.benefit}</p>
                            </div>
                            <Plus className="w-4 h-4 text-green-400" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN HOME SKELETON
// ═══════════════════════════════════════════════════════════════

interface HomeSkeletonProps {
    onOpenWidgetPicker?: () => void;
}

export function HomeSkeleton({ onOpenWidgetPicker }: HomeSkeletonProps) {
    const { pinnedWidgets, homeSkeletonBlocks } = useWorkspaceBag();
    const { today, signals, workQueue, recentKnowledge, connectorSuggestions, isLoading } = useHomeData();

    return (
        <div className="space-y-4">
            {/* Fixed Skeleton Blocks - Wired to Real Data */}
            <TodayStripBlock 
                meetings={today.meetings}
                tasksDue={today.tasksDue}
                followUps={today.followUps}
                date={today.date}
                isLoading={isLoading}
            />
            <SignalFeedBlock signals={signals} isLoading={isLoading} />
            <WorkQueueBlock items={workQueue} isLoading={isLoading} />
            <RecentKnowledgeBlock docs={recentKnowledge} isLoading={isLoading} />
            <ConnectNextBlock suggestions={connectorSuggestions} isLoading={isLoading} />

            {/* Pinned Widgets Section */}
            {pinnedWidgets.length > 0 && (
                <div className="pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-400">Pinned Widgets</h3>
                        {onOpenWidgetPicker && (
                            <button onClick={onOpenWidgetPicker} className="text-xs text-blue-400 hover:text-blue-300">
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {pinnedWidgets.map(w => (
                            <div key={w.id} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                                <p className="text-sm font-medium text-white">{w.name}</p>
                                <p className="text-xs text-gray-500">{w.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Widget Button */}
            {onOpenWidgetPicker && (
                <button
                    onClick={onOpenWidgetPicker}
                    className="w-full p-3 rounded-xl border-2 border-dashed border-gray-700/50 text-gray-500 hover:text-gray-400 hover:border-gray-600/50 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Widget</span>
                </button>
            )}
        </div>
    );
}

export default HomeSkeleton;
