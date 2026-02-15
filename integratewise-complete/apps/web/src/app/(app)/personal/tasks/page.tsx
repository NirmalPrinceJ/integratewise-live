"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus, Search, Filter, Calendar, Clock,
  MoreHorizontal, AlertTriangle, User, Building,
  CheckCircle2, Circle, Timer, ChevronDown, Check
} from "lucide-react";

import { useTasks, TaskData } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";

type GroupBy = "due-date" | "assignee" | "account" | "priority" | "none";

// Helper for priority colors using IntegrateWise theme
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "critical": return { color: "var(--iw-danger)", bg: "var(--iw-danger)15" };
    case "high": return { color: "var(--iw-warning)", bg: "var(--iw-warning)15" };
    case "medium": return { color: "var(--iw-blue)", bg: "var(--iw-blue)15" };
    case "low": return { color: "var(--muted-foreground)", bg: "var(--secondary)" };
    default: return { color: "var(--muted-foreground)", bg: "var(--secondary)" };
  }
};

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("due-date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const { tasks, isLoading, error } = useTasks({
    search: searchQuery !== "" ? searchQuery : undefined,
  });

  const filteredTasks = useMemo((): TaskData[] => {
    return tasks.filter((task: TaskData) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, statusFilter]);

  const groupedTasks = useMemo((): Record<string, TaskData[]> => {
    const groups: Record<string, TaskData[]> = {};
    for (const t of filteredTasks) {
      let key: string;
      switch (groupBy) {
        case "assignee": key = t.assignee || "Unassigned"; break;
        case "account": key = t.accountName || "Internal"; break;
        case "priority": key = t.priority; break;
        case "due-date":
          const days = t.dueDays ?? 0;
          if (days < 0) key = "Overdue";
          else if (days === 0) key = "Today";
          else if (days <= 3) key = "Next 3 Days";
          else if (days <= 7) key = "This Week";
          else key = "Later";
          break;
        default: key = "All Tasks";
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    }
    return groups;
  }, [filteredTasks, groupBy]);

  const toggleSelect = (id: string) => {
    setSelectedTasks((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const groupOrder: Record<string, string[]> = {
    "due-date": ["Overdue", "Today", "Next 3 Days", "This Week", "Later"],
    "priority": ["critical", "high", "medium", "low"],
  };

  const sortedKeys = groupOrder[groupBy]
    ? groupOrder[groupBy].filter(k => groupedTasks[k])
    : Object.keys(groupedTasks).sort();

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading tasks: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground">Manage your work and track progress</p>
            </div>
            <Button className="gap-2 bg-[var(--iw-success)] hover:bg-[var(--iw-success)]/90 text-white">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-none h-9"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "all", label: "All" },
                  { id: "overdue", label: "Overdue" },
                  { id: "todo", label: "To Do" },
                  { id: "in_progress", label: "Active" },
                  { id: "done", label: "Done" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${statusFilter === s.id
                      ? "bg-[var(--iw-success)]/15 text-[var(--iw-success)] font-semibold"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg text-xs">
                <span className="text-muted-foreground">Group:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="bg-transparent border-none outline-none font-medium text-foreground cursor-pointer"
                >
                  <option value="due-date">Due Date</option>
                  <option value="assignee">Assignee</option>
                  <option value="account">Account</option>
                  <option value="priority">Priority</option>
                  <option value="none">None</option>
                </select>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedTasks.size > 0 && (
            <div className="flex items-center gap-3 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2">
              <span className="text-xs font-medium text-muted-foreground">{selectedTasks.size} tasks selected</span>
              <Button variant="secondary" size="sm" className="h-8 text-xs text-[var(--iw-success)]">
                <Check className="w-3 h-3 mr-1" /> Complete
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Reassign</Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Reschedule</Button>
              <button
                onClick={() => setSelectedTasks(new Set())}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {sortedKeys.map(groupName => (
              <div key={groupName} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold capitalize">{groupName}</h3>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5 opacity-60">
                    {groupedTasks[groupName].length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {groupedTasks[groupName].map((task: any) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      selected={selectedTasks.has(task.id)}
                      onSelect={() => toggleSelect(task.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {sortedKeys.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground">Adjust your filters or create a new task</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  selected,
  onSelect
}: {
  task: any,
  selected: boolean,
  onSelect: () => void
}) {
  const isDone = task.status === "done";
  const isOverdue = task.status === "overdue" || (task.dueDays !== undefined && task.dueDays < 0 && !isDone);
  const styles = getPriorityStyles(task.priority);

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl border transition-all hover:bg-secondary/30 ${selected ? "bg-[var(--iw-success)]/5 border-[var(--iw-success)]/30" : "border-transparent"
        } ${isOverdue && !isDone ? "border-l-4 border-l-[var(--iw-danger)]" : ""}`}
    >
      <Checkbox checked={selected} onCheckedChange={onSelect} className="h-4 w-4" />

      <button className="flex-shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-[var(--iw-success)]" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-[var(--iw-success)] transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${isDone ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          {task.accountName && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" />
              {task.accountName}
            </span>
          )}
          {task.projectName && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="opacity-30">·</span>
              {task.projectName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          className="text-[10px] font-semibold border-none rounded-md px-1.5 h-5 shadow-none"
          style={{ backgroundColor: styles.bg, color: styles.color }}
        >
          {task.priority}
        </Badge>

        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            {task.assigneeInitials ? (
              <AvatarFallback className="text-[9px] bg-slate-200">{task.assigneeInitials}</AvatarFallback>
            ) : (
              <AvatarFallback className="text-[9px] bg-slate-200">
                {task.assignee?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className={`w-28 text-right text-xs ${isOverdue && !isDone ? "text-[var(--iw-danger)] font-semibold" : "text-muted-foreground"}`}>
          {task.dueDays !== undefined ? (
            task.dueDays < 0 ? `${Math.abs(task.dueDays)}d overdue` :
              task.dueDays === 0 ? "Today" :
                task.dueDays === 1 ? "Tomorrow" : `${task.dueDays}d`
          ) : task.dueDate}
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
