'use client';

import { useState, useRef, useEffect } from 'react';

// --- Types ---
type Message = {
  id: string;
  role: 'ai' | 'user';
  text: string;
  type?: 'text' | 'options';
  options?: string[];
};

type Persona = 'OS' | 'CS';

interface AIChatInterfaceProps {
  onComplete: (persona: Persona) => void;
}

export function AIChatInterface({ onComplete }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Hi! I'm IntegrateWise AI. I can help optimize your workflow. First, what best describes your primary focus?",
      type: 'options',
      options: ['Managing my own work & team', 'Managing client relationships'],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOptionClick = async (option: string) => {
    // 1. Add user selection
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: option }]);
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsTyping(false);

    if (option === 'Managing my own work & team') {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          text: 'Got it. You need a centralized command center for tasks, meetings, and team productivity.',
        },
      ]);
      // Short delay before completion to let user read
      setTimeout(() => onComplete('OS'), 1500);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          text: 'Understood. You need a dedicated platform to track client health, renewals, and success metrics.',
        },
      ]);
      setTimeout(() => onComplete('CS'), 1500);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-300">AI Discovery Agent</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white/10 text-gray-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              {msg.type === 'options' && msg.options && (
                <div className="mt-4 flex flex-col gap-2">
                  {msg.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm text-blue-200 hover:text-white"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
