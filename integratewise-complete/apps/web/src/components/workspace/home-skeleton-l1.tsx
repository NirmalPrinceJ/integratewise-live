"use client";

/**
 * L1 Home Skeleton - Pure Productivity Layer
 * 
 * This component is strictly L1 (Workspace) - NO AI or cognitive features.
 * Contains only: Calendar, Tasks, Projects, Notes, Documents, Meetings
 * 
 * L2 (Cognitive Layer) features like Signals, Intelligence, Evidence
 * are accessed separately via the CognitiveLayer overlay/drawer.
 */

import React from 'react';
import { useWorkspaceBag } from '@/contexts/workspace-bag-context';
import useSWR from 'swr';
import {
    CalendarDays, CheckSquare, Folder, FileText, 
    Clock, Plus, ChevronRight, Loader2, Users
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.ok ? r.json() : null);

// ═══════════════════════════════════════════════════════════════
// TODAY'S CALENDAR BLOCK
// ═══════════════════════════════════════════════════════════════

function TodayCalendarBlock() {
    const { data, isLoading } = useSWR('/api/calendar/today', fetcher, {
        refreshInterval: 60000,
        fallbackData: { meetings: [], date: new Date().toISOString() }
    });

    const meetings = data?.meetings || [];
    const dateStr = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', month: 'short', day: 'numeric' 
    });

    return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Today&apos;s Schedule</h3>
                </div>
                <span className="text-sm text-gray-400">{dateStr}</span>
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
            ) : meetings.length === 0 ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-gray-500">No meetings scheduled</p>
                    <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto">
                        <Plus className="w-3 h-3" /> Schedule meeting
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {meetings.slice(0, 4).map((meeting: { id: string; title: string; time: string; attendees?: number }) => (
                        <div key={meeting.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer group">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{meeting.title}</p>
                                <p className="text-xs text-gray-600">{meeting.time}</p>
                            </div>
                            {meeting.attendees && (
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {meeting.attendees}
                                </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MY TASKS BLOCK
// ═══════════════════════════════════════════════════════════════

function MyTasksBlock() {
    const { data, isLoading } = useSWR('/api/tasks/my', fetcher, {
        refreshInterval: 30000,
        fallbackData: { tasks: [], total: 0 }
    });

    const tasks = data?.tasks || [];
    const total = data?.total || 0;

    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">My Tasks</h3>
                </div>
                <span className="text-xs text-gray-500">{total} pending</span>
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="py-3 text-center">
                    <p className="text-sm text-gray-500">All caught up! 🎉</p>
                    <button className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1 mx-auto">
                        <Plus className="w-3 h-3" /> Add task
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {tasks.slice(0, 5).map((task: { id: string; title: string; due?: string; priority?: string }) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                            <div className={`w-1.5 h-6 rounded-full ${
                                task.priority === 'high' ? 'bg-red-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{task.title}</p>
                                {task.due && <p className="text-xs text-gray-600">Due: {task.due}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button className="w-full mt-3 text-xs text-gray-500 hover:text-gray-400 flex items-center justify-center gap-1">
                View all tasks <ChevronRight className="w-3 h-3" />
            </button>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// RECENT PROJECTS BLOCK
// ═══════════════════════════════════════════════════════════════

function RecentProjectsBlock() {
    const { data, isLoading } = useSWR('/api/projects/recent', fetcher, {
        fallbackData: { projects: [] }
    });

    const projects = data?.projects || [];

    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Recent Projects</h3>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
            ) : projects.length === 0 ? (
                <div className="py-3 text-center">
                    <p className="text-sm text-gray-500">No projects yet</p>
                    <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto">
                        <Plus className="w-3 h-3" /> Create project
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {projects.slice(0, 3).map((project: { id: string; name: string; status?: string; progress?: number }) => (
                        <div key={project.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                                <Folder className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{project.name}</p>
                                {project.progress !== undefined && (
                                    <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                                        <div 
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// RECENT NOTES/DOCS BLOCK
// ═══════════════════════════════════════════════════════════════

function RecentDocsBlock() {
    const { data, isLoading } = useSWR('/api/docs/recent', fetcher, {
        fallbackData: { docs: [] }
    });

    const docs = data?.docs || [];
    
    const getDocIcon = (type: string) => {
        switch (type) {
            case 'note': return '📝';
            case 'doc': return '📄';
            case 'spreadsheet': return '📊';
            default: return '📄';
        }
    };

    return (
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Recent Documents</h3>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
            ) : docs.length === 0 ? (
                <div className="py-3 text-center">
                    <p className="text-sm text-gray-500">No recent documents</p>
                    <button className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 mx-auto">
                        <Plus className="w-3 h-3" /> Create document
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {docs.slice(0, 3).map((doc: { id: string; name: string; type?: string; updated?: string }) => (
                        <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer">
                            <span className="text-lg">{getDocIcon(doc.type || 'doc')}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{doc.name}</p>
                                {doc.updated && <p className="text-xs text-gray-600">{doc.updated}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// QUICK ACTIONS BLOCK
// ═══════════════════════════════════════════════════════════════

function QuickActionsBlock() {
    const actions = [
        { id: 'task', label: 'New Task', icon: CheckSquare, color: 'text-green-400', href: '/tasks/new' },
        { id: 'note', label: 'New Note', icon: FileText, color: 'text-amber-400', href: '/notes/new' },
        { id: 'meeting', label: 'Schedule', icon: CalendarDays, color: 'text-blue-400', href: '/calendar/new' },
        { id: 'project', label: 'New Project', icon: Folder, color: 'text-purple-400', href: '/projects/new' },
    ];

    return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-2">
                {actions.map(action => (
                    <button
                        key={action.id}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                        <span className="text-xs text-gray-400">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN L1 HOME SKELETON
// ═══════════════════════════════════════════════════════════════

interface HomeSkeletonL1Props {
    onOpenWidgetPicker?: () => void;
}

export function HomeSkeletonL1({ onOpenWidgetPicker }: HomeSkeletonL1Props) {
    const { pinnedWidgets } = useWorkspaceBag();

    return (
        <div className="space-y-4">
            {/* Quick Actions - Always visible */}
            <QuickActionsBlock />
            
            {/* Today's Calendar */}
            <TodayCalendarBlock />
            
            {/* Two-column layout for Tasks and Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MyTasksBlock />
                <RecentProjectsBlock />
            </div>
            
            {/* Recent Documents */}
            <RecentDocsBlock />

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

export default HomeSkeletonL1;
