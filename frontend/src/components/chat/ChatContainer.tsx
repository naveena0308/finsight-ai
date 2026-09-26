"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, CitationItem } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { CitationDrawer } from "../citations/CitationDrawer";
import { AlertCircle, Loader2 } from "lucide-react";

interface ChatContainerProps {
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialQuery,
  onClearInitialQuery,
}) => {
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
  }, [initialQuery]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full relative">
      {/* Side-Inspector Citation Drawer */}
      <CitationDrawer
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onCitationClick={(cit) => setSelectedCitation(cit)}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Agent orchestrating table analytics and pgvector semantic retrieval...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Floating Dock */}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};
