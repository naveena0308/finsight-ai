"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, CitationItem } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { CitationDrawer } from "../citations/CitationDrawer";
import {
  AlertCircle,
  Loader2,
  Sparkles,
  Scale,
  Coins,
  TrendingDown,
  Building2,
  ArrowUpRight,
  Landmark,
  ShieldCheck,
} from "lucide-react";

interface ChatContainerProps {
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

const STARTER_PROMPTS = [
  {
    title: "FRBM Debt Ceiling",
    question: "Did Tamil Nadu's outstanding debt breach the statutory 25% FRBM ceiling in 2024-25 and 2025-26?",
    icon: Scale,
    color: "from-amber-500 to-yellow-400",
    bg: "bg-[#0E121B]/80 hover:bg-[#131826]/90 border-white/[0.08] hover:border-amber-400/40",
    iconBg: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    tag: "Table 2.1",
  },
  {
    title: "Committed Expenditure",
    question: "What percentage of Tamil Nadu's budget is consumed by salaries, pensions, and debt servicing?",
    icon: Coins,
    color: "from-emerald-500 to-teal-400",
    bg: "bg-[#0E121B]/80 hover:bg-[#131826]/90 border-white/[0.08] hover:border-amber-400/40",
    iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    tag: "Table 5.1",
  },
  {
    title: "Revenue Deficit Surge",
    question: "Why did the revenue deficit surge post-COVID and why is it considered structural in Table 3.1?",
    icon: TrendingDown,
    color: "from-rose-500 to-rose-400",
    bg: "bg-[#0E121B]/80 hover:bg-[#131826]/90 border-white/[0.08] hover:border-amber-400/40",
    iconBg: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
    tag: "Table 3.1",
  },
  {
    title: "Peer State Comparison",
    question: "How does Tamil Nadu's debt burden and per-capita liability compare to Maharashtra, Karnataka, and Gujarat?",
    icon: Building2,
    color: "from-indigo-500 to-indigo-400",
    bg: "bg-[#0E121B]/80 hover:bg-[#131826]/90 border-white/[0.08] hover:border-amber-400/40",
    iconBg: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
    tag: "Table 2.2",
  },
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await sendChatMessage(text, messages);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        strategy: data.strategy,
        citations: data.citations,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
      onClearInitialQuery?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] max-w-5xl mx-auto w-full relative">
      {/* Side-Inspector Citation Drawer */}
      <CitationDrawer
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          /* User-Centric Hero Welcome & Starter Screen in Obsidian Luxury */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
            {/* Huge Hero Icon */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.35)] ring-4 ring-amber-400/25 hover:scale-105 transition-transform duration-300">
                <Landmark className="w-10 h-10 sm:w-11 sm:h-11 stroke-[2.4] drop-shadow-sm text-slate-950" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>42 Source Tables Indexed & Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  What would you like to analyze in Tamil Nadu&apos;s budget?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Ask any question on debt sustainability, salary bills, or revenue deficits. Every answer is computed directly from the Government White Paper.
                </p>
              </div>
            </div>

            {/* 4 Interactive Starter Prompt Cards with HUGE Lucide Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
              {STARTER_PROMPTS.map((p) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.title}
                    onClick={() => handleSendMessage(p.question)}
                    disabled={loading}
                    className={`p-5 rounded-3xl border transition-all duration-300 group flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.08)] cursor-pointer ${p.bg}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${p.iconBg}`}>
                        <IconComponent className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-300">
                        {p.tag}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1">
                      <span className="font-extrabold text-xs sm:text-sm text-white block group-hover:text-amber-300 transition-colors">
                        {p.title}
                      </span>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.question}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-semibold text-zinc-500 group-hover:text-amber-300 transition-colors">
                      <span>Ask AI Analyst</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Conversation Messages */
          <>
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onCitationClick={(cit) => setSelectedCitation(cit)}
              />
            ))}

            {loading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] text-zinc-300 text-xs shadow-md animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <span className="font-medium">
                  Verifying source budget tables and compiling official fiscal analysis...
                </span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Floating Dock */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={loading}
        showChips={messages.length > 0}
      />
    </div>
  );
};
