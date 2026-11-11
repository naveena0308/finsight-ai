"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage, CitationItem } from "@/lib/types";
import { StrategyBadge } from "./StrategyBadge";
import { CitationPill } from "./CitationPill";
import { Landmark, User, Bookmark } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
  onCitationClick: (citation: CitationItem) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onCitationClick }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl transition-all ${
        isUser
          ? "bg-zinc-900 text-white ml-auto max-w-2xl shadow-xs"
          : "bg-white border border-zinc-200/90 shadow-xs text-zinc-800"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
          isUser
            ? "bg-zinc-800 text-zinc-200"
            : "bg-zinc-950 text-white shadow-xs"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-3 overflow-hidden text-sm">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`font-semibold text-xs ${isUser ? "text-zinc-200" : "text-zinc-950"}`}>
            {isUser ? "You" : "FinSight AI"}
          </span>
          {!isUser && message.strategy && <StrategyBadge strategy={message.strategy} />}
        </div>

        {/* Content with Markdown */}
        <div className={`prose prose-sm max-w-none leading-relaxed space-y-2 ${isUser ? "text-zinc-100" : "text-zinc-800"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 rounded-xl border border-zinc-200 bg-white shadow-2xs">
                  <table className="min-w-full divide-y divide-zinc-200 text-xs text-left">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-3.5 py-2.5 bg-zinc-50 font-semibold text-zinc-900 uppercase tracking-wider text-[11px] border-b border-zinc-200">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2 border-t border-zinc-100 text-zinc-700 font-mono text-[11px]">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className={isUser ? "font-semibold text-white underline" : "font-semibold text-zinc-950 bg-zinc-100 px-1 py-0.5 rounded"}>
                  {children}
                </strong>
              ),
              h3: ({ children }) => (
                <h3 className={`font-semibold text-sm sm:text-base mt-3 mb-1 tracking-tight ${isUser ? "text-white" : "text-zinc-950"}`}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className={`my-1.5 leading-relaxed ${isUser ? "text-zinc-100" : "text-zinc-700"}`}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className={isUser ? "text-zinc-100" : "text-zinc-700"}>{children}</li>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Verified Citations Row */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
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
