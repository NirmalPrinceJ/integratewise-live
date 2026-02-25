import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

const messages = [
  { id: 1, role: "user", content: "What accounts are at risk this quarter?" },
  { id: 2, role: "assistant", content: "Based on your data, I found 2 accounts at high risk:\n\n1. FinanceFlow Solutions - Health score dropped to 54%, champion silent for 12 days\n2. LogiPrime Corp - Multiple failed payments, renewal in 29 days\n\nWould you like me to suggest mitigation strategies?" },
];

export default function AIChatPage() {
  return (
    <DashboardLayout title="AI Chat" subtitle="Powered by Groq AI">
      <div className="max-w-3xl mx-auto h-[calc(100vh-280px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] p-4 ${
                message.role === 'user' 
                  ? 'bg-gray-100 text-black' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input 
            placeholder="Ask about your accounts, risks, or opportunities..." 
            className="flex-1 h-12 border-gray-200 rounded-none"
          />
          <Button className="h-12 px-6 bg-black hover:bg-gray-900 text-white rounded-none">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
