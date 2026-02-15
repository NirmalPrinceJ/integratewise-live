"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Search, Grid3x3, List, Filter, Plus,
    TrendingUp, TrendingDown, Clock, ChevronDown,
    ExternalLink, MoreHorizontal, X, HeartPulse,
    Users, BarChart3, Building2, Star
} from "lucide-react";

import { useAccounts, AccountData } from "@/hooks/useAccounts";
import { useSpineCompleteness } from "@/hooks/useSpineCompleteness";
import { Skeleton } from "@/components/ui/skeleton";

type ViewLayout = "grid" | "list";

export default function PersonalAccountsPage() {
    const [layout, setLayout] = useState<ViewLayout>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [tierFilter, setTierFilter] = useState<string>("all");
    const [healthFilter, setHealthFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

    const { accounts, isLoading, error } = useAccounts({
        search: searchQuery !== "" ? searchQuery : undefined,
        category: "personal"
    });

    const accountIds = useMemo((): string[] => accounts.map((a: AccountData) => a.id), [accounts]);
    const { data: completenessData } = useSpineCompleteness({
        entityIds: accountIds,
        entityType: "account"
    });

    const filteredAccounts = useMemo((): AccountData[] => {
        return accounts.filter((a: AccountData) => {
            if (tierFilter !== "all" && a.tier !== tierFilter) return false;
            if (healthFilter === "healthy" && a.healthScore < 80) return false;
            if (healthFilter === "at-risk" && (a.healthScore < 60 || a.healthScore >= 80)) return false;
            if (healthFilter === "critical" && a.healthScore >= 60) return false;
            return true;
        });
    }, [accounts, tierFilter, healthFilter]);

    const selectedAccount = useMemo((): AccountData | undefined =>
        accounts.find((a: AccountData) => a.id === selectedAccountId),
        [accounts, selectedAccountId]
    );

    const stats = useMemo(() => {
        const totalArr = accounts.reduce((s: number, a: AccountData) => s + (a.arr || 0), 0);
        return {
            totalArr,
            totalAccounts: accounts.length,
            atRisk: accounts.filter((a: AccountData) => a.healthScore < 60).length,
            avgHealth: accounts.length > 0
                ? Math.round(accounts.reduce((s: number, a: AccountData) => s + a.healthScore, 0) / accounts.length)
                : 0
        };
    }, [accounts]);

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    Error loading accounts: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="p-6 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                            <p className="text-muted-foreground">Manage your portfolio and track account health</p>
                        </div>
                        <Button className="gap-2 bg-[var(--iw-success)] hover:bg-[var(--iw-success)]/90 text-white">
                            <Plus className="h-4 w-4" />
                            Add Account
                        </Button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search accounts..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 bg-secondary/50 border-none"
                                />
                            </div>
                            <Button
                                variant={showFilters ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`gap-1.5 h-9 ${showFilters ? "text-[var(--iw-success)] bg-[var(--iw-success)]/10" : ""}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {(tierFilter !== "all" || healthFilter !== "all") && <span className="w-1.5 h-1.5 rounded-full bg-[var(--iw-success)]" />}
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {filteredAccounts.length} accounts
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    ${(stats.totalArr / 1000000).toFixed(1)}M ARR
                                </span>
                            </div>

                            <div className="flex items-center bg-secondary/50 rounded-lg p-1">
                                <button
                                    onClick={() => setLayout("grid")}
                                    className={`p-1.5 rounded-md transition-all ${layout === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setLayout("list")}
                                    className={`p-1.5 rounded-md transition-all ${layout === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="flex items-center gap-3 pt-3 border-t border-border animate-in slide-in-from-top-1 overflow-x-auto no-scrollbar">
                            <span className="text-xs font-semibold text-muted-foreground">Tier:</span>
                            {["all", "enterprise", "mid-market", "smb"].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTierFilter(t)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${tierFilter === t ? "bg-[var(--iw-success)]/15 text-[var(--iw-success)] font-semibold" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                                >
                                    {t === "all" ? "All Tiers" : t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                            <div className="w-px h-4 bg-border mx-1" />
                            <span className="text-xs font-semibold text-muted-foreground">Health:</span>
                            {["all", "healthy", "at-risk", "critical"].map(h => (
                                <button
                                    key={h}
                                    onClick={() => setHealthFilter(h)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${healthFilter === h ? "bg-[var(--iw-success)]/15 text-[var(--iw-success)] font-semibold" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                                >
                                    {h.charAt(0).toUpperCase() + h.slice(1).replace("-", " ")}
                                </button>
                            ))}
                            {(tierFilter !== "all" || healthFilter !== "all") && (
                                <button
                                    onClick={() => { setTierFilter("all"); setHealthFilter("all"); }}
                                    className="text-xs text-muted-foreground hover:text-[var(--iw-danger)] flex items-center gap-1 ml-auto"
                                >
                                    <X className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : (
                    <>
                        {layout === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAccounts.map(account => (
                                    <AccountCard
                                        key={account.id}
                                        account={account}
                                        onSelect={() => setSelectedAccountId(account.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.5fr] gap-4 px-6 py-3 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/20">
                                    <span>Account</span>
                                    <span>ARR</span>
                                    <span>Health</span>
                                    <span>Renewal</span>
                                    <span>Owner & Touchpoint</span>
                                    <span />
                                </div>
                                {filteredAccounts.map(account => (
                                    <AccountRow
                                        key={account.id}
                                        account={account}
                                        onSelect={() => setSelectedAccountId(account.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredAccounts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-medium">No accounts matched your filters</h3>
                                <p className="text-muted-foreground">Try clearing filters or searching for something else</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedAccount && (
                <AccountDetailDrawer
                    account={selectedAccount as AccountData}
                    onClose={() => setSelectedAccountId(null)}
                />
            )}
        </div>
    );
}

function AccountCard({ account, onSelect }: { account: AccountData; onSelect: () => void }) {
    const healthColor = account.healthScore >= 80 ? "var(--iw-success)" : account.healthScore >= 60 ? "var(--iw-warning)" : "var(--iw-danger)";

    return (
        <Card
            className="group hover:border-[var(--iw-success)]/30 hover:shadow-xl hover:shadow-[var(--iw-success)]/5 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border-border/60"
            onClick={onSelect}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-secondary/40 flex items-center justify-center text-2xl shadow-inner">
                            {account.logo || "🏢"}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold truncate group-hover:text-[var(--iw-success)] transition-colors">{account.name}</h4>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Badge variant="outline" className="text-[9px] px-1.5 h-4 border-muted-foreground/20 text-muted-foreground font-medium uppercase tracking-tighter">
                                    {account.tier}
                                </Badge>
                                <span className="opacity-40">·</span>
                                {account.industry}
                            </p>
                        </div>
                    </div>
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/5"
                        style={{ backgroundColor: healthColor }}
                    >
                        {account.healthScore}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-xl bg-secondary/20">
                    <div>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-50">ARR</p>
                        <p className="text-sm font-black">${(account.arr / 1000).toFixed(0)}K</p>
                        <span className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${account.arrGrowth >= 0 ? "text-[var(--iw-success)]" : "text-[var(--iw-danger)]"}`}>
                            {account.arrGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {account.arrGrowth >= 0 ? "+" : ""}{account.arrGrowth}%
                        </span>
                    </div>
                    <div>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-50">Renewal</p>
                        <p className="text-sm font-black">{account.renewalDays}d</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{new Date(account.renewalDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 ring-2 ring-background">
                            <AvatarFallback className="text-[9px] font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                {account.owner.initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] font-semibold text-muted-foreground truncate max-w-[80px]">
                            {account.owner.name.split(' ')[0]}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground opacity-60">
                        <Clock className="w-3 h-3" />
                        {account.lastTouchpoint}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function AccountRow({ account, onSelect }: { account: AccountData; onSelect: () => void }) {
    const healthColor = account.healthScore >= 80 ? "var(--iw-success)" : account.healthScore >= 60 ? "var(--iw-warning)" : "var(--iw-danger)";

    return (
        <div
            onClick={onSelect}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.5fr] gap-4 px-6 py-4 border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-all cursor-pointer items-center group"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xl shadow-sm">
                    {account.logo || "🏢"}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold group-hover:text-[var(--iw-success)] transition-colors truncate">{account.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                        <span className="uppercase tracking-tighter font-black opacity-40">{account.tier}</span>
                        <span className="opacity-20">|</span>
                        {account.region}
                    </p>
                </div>
            </div>
            <div>
                <p className="text-sm font-black">${(account.arr / 1000).toFixed(0)}K</p>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${account.arrGrowth >= 0 ? "text-[var(--iw-success)]" : "text-[var(--iw-danger)]"}`}>
                    {account.arrGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {account.arrGrowth >= 0 ? "+" : ""}{account.arrGrowth}%
                </span>
            </div>
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-black/5"
                    style={{ backgroundColor: healthColor }}
                >
                    {account.healthScore}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 hidden xl:inline" style={{ color: healthColor }}>
                    {account.healthScore >= 80 ? "Healthy" : account.healthScore >= 60 ? "At Risk" : "Critical"}
                </span>
            </div>
            <div>
                <p className="text-sm font-bold">{account.renewalDays}d</p>
                <p className="text-[10px] text-muted-foreground font-medium">{new Date(account.renewalDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black ring-2 ring-background shrink-0">
                    {account.owner.initials}
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] font-bold text-foreground truncate">{account.owner.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {account.lastTouchpoint}
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/80">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
}

function AccountDetailDrawer({ account: acc, onClose }: { account: AccountData; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<"overview" | "health" | "activity">("overview");
    const healthColor = acc.healthScore >= 80 ? "var(--iw-success)" : acc.healthScore >= 60 ? "var(--iw-warning)" : "var(--iw-danger)";

    return (
        <>
            <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[60] animate-in fade-in" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-[70] animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border bg-gradient-to-b from-secondary/30 to-background">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-4xl shadow-inner">
                                {acc.logo || "🏢"}
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{acc.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">{acc.tier}</Badge>
                                    <span className="text-xs text-muted-foreground font-medium">{acc.industry} · {acc.region}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-secondary">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl w-fit">
                        {(["overview", "health", "activity"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === "overview" && (
                        <>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-secondary/30 rounded-2xl p-4 flex flex-col items-center text-center">
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2 opacity-50">ARR</p>
                                    <p className="text-xl font-black tracking-tighter">${(acc.arr / 1000).toFixed(0)}K</p>
                                    <span className={`text-[10px] font-bold mt-1 ${acc.arrGrowth >= 0 ? "text-[var(--iw-success)]" : "text-[var(--iw-danger)]"}`}>
                                        {acc.arrGrowth >= 0 ? "+" : ""}{acc.arrGrowth}%
                                    </span>
                                </div>
                                <div className="bg-secondary/30 rounded-2xl p-4 flex flex-col items-center text-center">
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2 opacity-50">Health</p>
                                    <p className="text-2xl font-black tracking-tighter" style={{ color: healthColor }}>{acc.healthScore}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">
                                        {acc.healthScore >= 80 ? "Healthy" : acc.healthScore >= 60 ? "At Risk" : "Critical"}
                                    </span>
                                </div>
                                <div className="bg-secondary/30 rounded-2xl p-4 flex flex-col items-center text-center">
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2 opacity-50">Renewal</p>
                                    <p className="text-xl font-black tracking-tighter">{acc.renewalDays}d</p>
                                    <span className="text-[10px] font-medium mt-1 text-muted-foreground">{new Date(acc.renewalDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <DetailRow label="Primary Contact" value={acc.owner.name} />
                                <DetailRow label="Sentiment / NPS" value={`${acc.nps > 0 ? "+" : ""}${acc.nps} NPS Score`} />
                                <DetailRow label="Satisfaction" value={`${acc.csat}/5.0 CSAT`} />
                                <DetailRow label="Engagement Path" value={`${acc.contacts} Active Contacts`} />
                                <DetailRow label="Support Load" value={`${acc.openTickets} Open Tickets`} />
                                <DetailRow label="Last Intelligence" value={acc.lastTouchpoint} />
                                <DetailRow label="Data Sources" value={acc.sources.join(" · ")} />
                            </div>

                            {acc.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {acc.tags.map(t => (
                                        <Badge key={t} variant="secondary" className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight bg-secondary/50 border-none">
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "health" && (
                        <div className="space-y-10">
                            <div className="flex flex-col items-center py-6">
                                <div
                                    className="w-32 h-32 rounded-full border-[8px] flex flex-col items-center justify-center bg-secondary/10 shadow-xl shadow-black/5"
                                    style={{ borderColor: healthColor }}
                                >
                                    <span className="text-4xl font-black tracking-tighter" style={{ color: healthColor }}>{acc.healthScore}</span>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 ring-1 ring-border px-2 py-0.5 rounded-full bg-background/80">
                                        Portfolio Rank
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <HealthBar label="Product Adoption" value={acc.productAdoption} max={40} />
                                <HealthBar label="User Engagement" value={acc.engagement} max={30} />
                                <HealthBar label="Value Realization" value={acc.valueRealization} max={30} />
                            </div>
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div className="space-y-6">
                            {[
                                { time: "2h ago", text: `Automated analysis updated: No expansion risk detected.`, type: "system" },
                                { time: "1d ago", text: `Client meeting notes compiled from Zoom recording.`, type: "meeting" },
                                { time: "2d ago", text: `Support incident #TSK-892 resolved by Engineering.`, type: "ticket" },
                                { time: "4d ago", text: `Engagement drop detected in APAC region teams.`, type: "alert" },
                                { time: "1w ago", text: `Executive sponsor change: Ravi Sharma (CHAMPION) assigned.`, type: "system" },
                            ].map((ev, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-[var(--iw-success)] mt-1.5 flex-shrink-0 ring-4 ring-[var(--iw-success)]/10" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">{ev.text}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-50">{ev.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-secondary/10">
                    <Button className="w-full h-12 rounded-xl bg-[var(--iw-success)] hover:bg-[var(--iw-success)]/90 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--iw-success)]/20">
                        Open Full Account Workspace
                    </Button>
                </div>
            </div>
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0 hover:bg-secondary/10 px-2 rounded-lg transition-colors">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{label}</span>
            <span className="text-sm font-black text-foreground">{value}</span>
        </div>
    );
}

function HealthBar({ label, value, max }: { label: string; value: number; max: number }) {
    const pct = Math.round((value / max) * 100);
    const color = pct >= 80 ? "var(--iw-success)" : pct >= 50 ? "var(--iw-warning)" : "var(--iw-danger)";
    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
                <span className="text-xs font-black" style={{ color }}>{value}/{max}</span>
            </div>
            <div className="h-3 bg-secondary/50 rounded-full overflow-hidden shadow-inner p-0.5">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
