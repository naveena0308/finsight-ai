"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, CitationItem } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { CitationDrawer } from "../citations/CitationDrawer";
import { AlertCircle, Loader2 } from "lucide-react";

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "### Welcome to FinSight AI 🏛️\n\nI am your intelligent financial analyst for the **Tamil Nadu Government Fiscal Management White Paper (2021-22 to 2025-26)**.\n\nAsk me about:\n- **Public Debt & Liabilities** trajectory, per-capita burden, and interest payments\n- **Revenue & Fiscal Deficit** targets, breaches, and structural causes\n- **Own-Tax Revenues (SoTR)**, GST compensation impact, and stamp duty collections\n- **Committed Expenditure** (salaries, pensions, and debt servicing) crowding out capital investments\n- **Contingent Liabilities** of state PSUs (TNEB/TNPDCL, transport corporations, water boards)\n\nEvery figure is verified directly against source tables and pages in the White Paper.",
      strategy: "HYBRID",
      citations: [
        {
          type: "table",
          label: "Table 2.1: Outstanding Debt and Liabilities (Page 27)",
          page: 27,
          table_name: "table_2_1",
        },
        {
          type: "narrative",
          label: "Executive Summary | Page 12",
          page: 12,
          chapter: "Executive Summary",
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
      const errorMsg = err instanceof Error ? err.message : "Failed to communicate with FinSight agent.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto p-4 sm:p-6">
      {/* Scrollable Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            message={m}
            onCitationClick={(cit) => setSelectedCitation(cit)}
          />
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <div className="space-y-0.5">
              <p className="font-medium text-slate-300">FinSight AI Multi-Agent Orchestrator is reasoning...</p>
              <p className="text-[11px] text-slate-500">Routing query between Neon SQL tables & pgvector semantic chunks</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="shrink-0 pt-2 border-t border-slate-900">
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>

      {/* Slide-over Citation Inspector */}
      <CitationDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
};
