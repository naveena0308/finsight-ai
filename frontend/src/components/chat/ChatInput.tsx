"use client";

import React, { useState, useRef } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/constants";
import { SendHorizontal, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  showChips?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  showChips = true,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSelectPrompt = (q: string) => {
    if (disabled) return;
    onSend(q);
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Suggestion Chips (Only shown when active conversation exists) */}
      {showChips && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Prompts:
          </span>
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPrompt(p.question)}
              disabled={disabled}
              className="px-3 py-1 rounded-full bg-[#121622] hover:bg-[#1A2030] border border-white/[0.08] hover:border-amber-400/40 text-zinc-300 hover:text-white text-xs whitespace-nowrap transition-all shadow-2xs disabled:opacity-50 font-medium"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Luxury Obsidian Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-[#0D1017]/95 border border-white/[0.12] focus-within:border-amber-400/80 focus-within:ring-4 focus-within:ring-amber-500/15 rounded-2xl p-3 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the Tamil Nadu Budget (e.g. debt trajectory, FRBM ceiling, salary bills)..."
          rows={2}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none text-white placeholder-zinc-500 text-sm focus:outline-none px-2 py-1 max-h-32"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0 hover:scale-105 active:scale-95"
        >
          <SendHorizontal className="w-4 h-4 stroke-[2.4]" />
        </button>
      </form>
    </div>
  );
};
