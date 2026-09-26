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
          ? "bg-slate-900 text-white ml-auto max-w-2xl border border-slate-800 shadow-md"
          : "bg-white border border-slate-200/80 shadow-[0_6px_24px_rgba(0,0,0,0.03)] text-slate-800"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
          isUser
            ? "bg-slate-800 text-slate-200 border border-slate-700"
            : "bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-md shadow-amber-500/20"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-3 overflow-hidden text-sm">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`font-semibold text-xs ${isUser ? "text-slate-300" : "text-slate-900"}`}>
            {isUser ? "You" : "FinSight AI"}
          </span>
          {!isUser && message.strategy && <StrategyBadge strategy={message.strategy} />}
        </div>

        {/* Content with Markdown */}
        <div className={`prose prose-sm max-w-none leading-relaxed space-y-2 ${isUser ? "text-slate-100" : "text-slate-700"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-3.5 py-2.5 bg-slate-50 font-semibold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2 border-t border-slate-100 text-slate-700 font-mono text-[11px]">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className={`font-semibold ${isUser ? "text-amber-300 font-bold" : "text-amber-900 bg-amber-50/80 px-1 py-0.5 rounded border border-amber-200/60"}`}>
                  {children}
                </strong>
              ),
              h3: ({ children }) => (
                <h3 className={`font-bold text-base mt-2 mb-1 tracking-tight ${isUser ? "text-white" : "text-slate-900"}`}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className={`my-1.5 ${isUser ? "text-slate-100" : "text-slate-700"}`}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2 text-slate-600">{children}</ul>
              ),
              li: ({ children }) => (
                <li className={isUser ? "text-slate-200" : "text-slate-700"}>{children}</li>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Verified Citations Row */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
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
