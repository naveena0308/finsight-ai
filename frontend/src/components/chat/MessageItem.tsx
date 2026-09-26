"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage, CitationItem } from "@/lib/types";
import { StrategyBadge } from "./StrategyBadge";
import { CitationPill } from "./CitationPill";
import { Bot, User, Bookmark } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
  onCitationClick: (citation: CitationItem) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onCitationClick }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all ${
        isUser
          ? "bg-slate-900/40 border border-slate-800/60 ml-auto max-w-2xl"
          : "bg-slate-950/80 border border-slate-800 shadow-xl"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
          isUser
            ? "bg-slate-800 text-slate-300 border border-slate-700"
            : "bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-3 overflow-hidden text-sm">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-xs text-slate-300">
            {isUser ? "You" : "FinSight AI"}
          </span>
          {!isUser && message.strategy && <StrategyBadge strategy={message.strategy} />}
        </div>

        {/* Content with Markdown */}
        <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed space-y-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 rounded-lg border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-xs text-left">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-3 py-2 bg-slate-900 font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-1.5 border-t border-slate-850 text-slate-300 font-mono text-[11px]">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-amber-300">{children}</strong>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Verified Citations Row */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Bookmark className="w-3 h-3 text-amber-400" />
              <span>Verified Citations ({message.citations.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((c, i) => (
                <CitationPill key={i} citation={c} onClick={onCitationClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
