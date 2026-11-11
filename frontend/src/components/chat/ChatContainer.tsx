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
    iconBg: "bg-amber-50 text-amber-700 border border-amber-200/60",
    tag: "Table 2.1",
  },
  {
    title: "Committed Expenditure",
    question: "What percentage of Tamil Nadu's budget is consumed by salaries, pensions, and debt servicing?",
    icon: Coins,
    iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    tag: "Table 5.1",
  },
  {
    title: "Revenue Deficit Surge",
    question: "Why did the revenue deficit surge post-COVID and why is it considered structural in Table 3.1?",
    icon: TrendingDown,
    iconBg: "bg-rose-50 text-rose-700 border border-rose-200/60",
    tag: "Table 3.1",
  },
  {
    title: "Peer State Comparison",
    question: "How does Tamil Nadu's debt burden and per-capita liability compare to Maharashtra, Karnataka, and Gujarat?",
    icon: Building2,
    iconBg: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
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
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] max-w-4xl mx-auto w-full px-4 sm:px-6 relative">
      {/* Side-Inspector Citation Drawer */}
      <CitationDrawer
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 ? (
          /* Executive Welcome & Starter Screen */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
            {/* Header / Hero Brand */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-6 h-6 stroke-[2]" />
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>42 Source Tables Indexed &amp; Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight font-sans">
                  What would you like to analyze in Tamil Nadu&apos;s budget?
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
                  Ask any question on debt sustainability, salary bills, or revenue deficits. Every answer is computed directly from the Government White Paper.
                </p>
              </div>
            </div>

            {/* 4 Clean Starter Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
              {STARTER_PROMPTS.map((p) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.title}
                    onClick={() => handleSendMessage(p.question)}
                    disabled={loading}
                    className="p-4 sm:p-5 rounded-xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-200 group flex flex-col justify-between text-left cursor-pointer shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.iconBg}`}>
                        <IconComponent className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">
                        {p.tag}
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-1">
                      <span className="font-semibold text-sm text-zinc-900 block group-hover:text-zinc-950 transition-colors">
                        {p.title}
                      </span>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {p.question}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors">
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
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 text-zinc-700 text-xs shadow-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-900 shrink-0" />
                <span className="font-medium">
                  Verifying source budget tables and compiling official fiscal analysis...
                </span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Dock */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={loading}
        showChips={messages.length > 0}
      />
    </div>
  );
};
