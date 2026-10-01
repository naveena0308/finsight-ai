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
      className={`flex gap-3 sm:gap-4 p-5 sm:p-6 rounded-3xl transition-all ${
        isUser
          ? "bg-gradient-to-br from-amber-500/20 via-[#151A26] to-[#0E121C] text-white ml-auto max-w-2xl border border-amber-500/30 shadow-xl"
          : "bg-[#0E121B]/90 border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] text-slate-200"
      }`}
    >
      {/* Avatar with Larger Luminous Icons */}
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-transform ${
          isUser
            ? "bg-[#181D2A] text-amber-300 border border-amber-500/30 shadow-sm"
            : "bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/30"
        }`}
      >
        {isUser ? <User className="w-5 h-5 stroke-[2.4]" /> : <Bot className="w-5 h-5 stroke-[2.4] text-slate-950" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-3 overflow-hidden text-sm">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`font-bold text-xs ${isUser ? "text-amber-300" : "text-white"}`}>
            {isUser ? "You" : "FinSight AI"}
          </span>
          {!isUser && message.strategy && <StrategyBadge strategy={message.strategy} />}
        </div>

        {/* Content with Markdown */}
        <div className={`prose prose-sm max-w-none leading-relaxed space-y-2 ${isUser ? "text-slate-100" : "text-slate-200"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 rounded-2xl border border-white/[0.08] bg-[#0A0D14] shadow-2xs">
                  <table className="min-w-full divide-y divide-white/[0.06] text-xs text-left">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-3.5 py-2.5 bg-[#141926] font-bold text-white uppercase tracking-wider text-[11px] border-b border-white/[0.08]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2 border-t border-white/[0.04] text-zinc-300 font-mono text-[11px]">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                  {children}
                </strong>
              ),
              h3: ({ children }) => (
                <h3 className="font-extrabold text-base mt-3 mb-1 tracking-tight text-white">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="my-1.5 leading-relaxed text-zinc-200">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-zinc-200">{children}</li>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Verified Citations Row */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
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
