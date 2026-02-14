import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Bot, User, Sparkles, Zap, Building2, TrendingUp,
  AlertTriangle, RefreshCw, Clock, ChevronRight, FileText,
  Target, Database, BarChart3, CheckCircle2, Copy, ThumbsUp, ThumbsDown, Loader2
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useSpine } from "./spine/spine-client";
import { type CTXEnum } from "./spine/types";

// ─── Mock AI responses (Supabase disconnected) ──────────────────────────────

const MOCK_AI_RESPONSES: Record<string, { content: string; sources?: { tool: string; entity: string }[]; suggestions?: string[] }> = {
  default: {
    content: "I'm currently running in offline mode — the Intelligence Engine requires a backend connection to provide real-time insights. In the meantime, here's what I can tell you: your workspace is configured and ready. Once backend connectivity is restored, I'll be able to analyze your accounts, surface risk signals, track goals, and provide actionable recommendations across all your integrated tools.",
    suggestions: ["View workspace dashboard", "Check integration status", "Review account list"],
  },
  risk: {
    content: "Risk analysis requires live data from your connected integrations. When the backend is connected, I'll cross-reference engagement patterns, support tickets, usage metrics, and renewal timelines to identify accounts showing churn signals. For now, you can review account health manually in the Accounts view.",
    sources: [{ tool: "Spine SSOT", entity: "accounts" }],
    suggestions: ["Open Accounts view", "Review health scores"],
  },
  growth: {
    content: "Expansion pipeline analysis will be available once the backend is connected. I'll be able to identify upsell and cross-sell opportunities by analyzing product usage patterns, engagement trends, and account lifecycle stages across your CRM and product analytics tools.",
    suggestions: ["View pipeline", "Check product usage"],
  },
};

function getMockResponse(message: string): { id: string; role: "assistant"; content: string; timestamp: Date; sources?: any[]; suggestions?: string[] } {
  const lower = message.toLowerCase();
  let response = MOCK_AI_RESPONSES.default;
  if (lower.includes("risk") || lower.includes("churn")) response = MOCK_AI_RESPONSES.risk;
  if (lower.includes("expansion") || lower.includes("growth") || lower.includes("pipeline")) response = MOCK_AI_RESPONSES.growth;
  
  return {
    id: `a${Date.now()}`,
    role: "assistant",
    content: response.content,
    timestamp: new Date(),
    sources: response.sources,
    suggestions: response.suggestions,
  };
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  sources?: { tool: string; entity: string }[];
  suggestions?: string[];
  cards?: InsightCard[];
}

interface InsightCard {
  type: "account" | "metric" | "alert" | "action";
  title: string;
  value: string;
  detail: string;
  color: string;
}

const SUGGESTED_PROMPTS = [
  { icon: Building2, text: "Which accounts are at risk of churning this quarter?", category: "Accounts" },
  { icon: TrendingUp, text: "Show me our expansion pipeline and signals", category: "Growth" },
  { icon: AlertTriangle, text: "What critical incidents need attention today?", category: "Alerts" },
  { icon: BarChart3, text: "How are we tracking against our quarterly goals?", category: "Goals" },
  { icon: Target, text: "Which team members are overloaded right now?", category: "Team" },
  { icon: Database, text: "Summarize the data health across all integrations", category: "Data" },
];

export function AIChat({ activeCtx }: { activeCtx: CTXEnum }) {
  const spine = useSpine();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { 
      id: `u${Date.now()}`, 
      role: "user", 
      content: text, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Supabase disconnected — use local mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay
      const mockResponse = getMockResponse(text);
      setMessages(prev => [...prev, mockResponse]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages(prev => [...prev, {
        id: `e${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my intelligence core. Please check your connection or try again later.",
        timestamp: new Date(),
        suggestions: ["Retry", "Check system status"]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3F5185] to-[#F54476] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">IntegrateWise Intelligence</h2>
            <p className="text-[10px] text-muted-foreground">Ask anything about your data, accounts, goals, or team activity</p>
          </div>
          <Badge variant="outline" className="ml-auto text-[9px] font-bold gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected to {spine.connectedApps?.length || 7} sources
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3F5185]/10 to-[#F54476]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#3F5185]" />
            </div>
            <h3 className="text-lg font-bold mb-1">How can I help?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">I can query your connected tools, surface insights, track goals, and help you take action — all from one conversation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary text-left transition-all group border border-transparent hover:border-border"
                >
                  <prompt.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#3F5185] shrink-0" />
                  <div>
                    <div className="text-xs font-medium line-clamp-2">{prompt.text}</div>
                    <div className="text-[9px] text-muted-foreground">{prompt.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3F5185] to-[#F54476] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === "user" ? "bg-[#3F5185] text-white rounded-2xl rounded-br-md px-4 py-2.5" : ""}`}>
              {msg.role === "assistant" && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.sources && (
                    <div className="flex flex-wrap gap-1">
                      {msg.sources.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-[8px] font-mono gap-1">
                          <Database className="w-2.5 h-2.5" />{s.tool}: {s.entity}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {msg.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.cards.map((card, i) => (
                        <Card key={i} className="border shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="text-xs font-bold">{card.title}</h4>
                              <Badge className={`${card.color} text-white border-0 text-[8px]`}>{card.value}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{card.detail}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, i) => (
                        <button key={i} onClick={() => sendMessage(s)} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary hover:bg-[#3F5185]/10 hover:text-[#3F5185] transition-all border border-border">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground"><Copy className="w-3 h-3" /></button>
                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground"><ThumbsUp className="w-3 h-3" /></button>
                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground"><ThumbsDown className="w-3 h-3" /></button>
                  </div>
                </div>
              )}
              {msg.role === "user" && <p className="text-sm">{msg.content}</p>}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-[#1E2A4A] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3F5185] to-[#F54476] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1 py-3">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-3 border-t border-border shrink-0">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about accounts, goals, data health, or anything..."
            className="flex-1 bg-secondary/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F5185]/20 border border-border"
          />
          <Button type="submit" size="icon" disabled={!input.trim()} className="bg-[#3F5185] hover:bg-[#354775] rounded-xl w-10 h-10 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}