/**
 * Website Theme — Theme customization
 * Wired to: integratewise-store Worker (live)
 */
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Type, Layout, Paintbrush } from "lucide-react";

const themeTokens = [
  { name: "Primary", value: "#6366f1", category: "color" },
  { name: "Background", value: "#0a0a0f", category: "color" },
  { name: "Surface", value: "#1a1a2e", category: "color" },
  { name: "Accent", value: "#8b5cf6", category: "color" },
  { name: "Text Primary", value: "#f8fafc", category: "color" },
  { name: "Text Muted", value: "#94a3b8", category: "color" },
];

export default function ThemeView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Palette className="w-5 h-5" /> Theme</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card><CardContent className="p-4"><Paintbrush className="w-5 h-5 mb-2 text-purple-500" /><p className="text-sm font-medium">Anti-Gravity</p><p className="text-xs text-muted-foreground">Active theme</p></CardContent></Card>
        <Card><CardContent className="p-4"><Type className="w-5 h-5 mb-2 text-blue-500" /><p className="text-sm font-medium">Inter + JetBrains</p><p className="text-xs text-muted-foreground">Typography</p></CardContent></Card>
      </div>
      <h3 className="text-sm font-medium mt-4">Color Tokens</h3>
      <div className="grid grid-cols-3 gap-2">
        {themeTokens.map((t) => (
          <Card key={t.name}>
            <CardContent className="p-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded border" style={{ backgroundColor: t.value }} />
              <div><p className="text-xs font-medium">{t.name}</p><p className="text-[10px] text-muted-foreground font-mono">{t.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
