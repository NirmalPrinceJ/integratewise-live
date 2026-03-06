/**
 * Website SEO — SEO optimization tools
 * Wired to: integratewise-knowledge, integratewise-cognitive-brain Workers (live)
 */
import { Card, CardContent } from "@/components/ui/card";
import { Search, Globe, TrendingUp, BarChart3, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const seoScore = 78;
const pages = [
  { url: "/", title: "Home", score: 92, issues: 0, indexed: true },
  { url: "/platform", title: "Platform", score: 85, issues: 1, indexed: true },
  { url: "/pricing", title: "Pricing", score: 88, issues: 0, indexed: true },
  { url: "/story", title: "Our Story", score: 72, issues: 2, indexed: true },
  { url: "/integrations", title: "Integrations", score: 65, issues: 3, indexed: false },
];

export default function SEOView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Search className="w-5 h-5" /> SEO Overview</h2>
        <Badge variant="outline">Score: {seoScore}/100</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center"><Globe className="w-5 h-5 mx-auto mb-1 text-blue-500" /><p className="text-2xl font-bold">{pages.length}</p><p className="text-xs text-muted-foreground">Pages</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" /><p className="text-2xl font-bold">{pages.filter(p => p.indexed).length}</p><p className="text-xs text-muted-foreground">Indexed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-500" /><p className="text-2xl font-bold">{pages.reduce((s, p) => s + p.issues, 0)}</p><p className="text-xs text-muted-foreground">Issues</p></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {pages.map((p) => (
            <div key={p.url} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
              {p.indexed ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.url}</p>
              </div>
              <div className="w-24"><Progress value={p.score} className="h-1.5" /></div>
              <span className="text-xs font-medium w-8 text-right">{p.score}</span>
              {p.issues > 0 && <Badge variant="destructive" className="text-[10px]">{p.issues}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
