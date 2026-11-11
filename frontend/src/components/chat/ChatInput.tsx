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
    <div className="space-y-2.5 pb-4">
      {/* Suggestion Chips */}
      {showChips && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Quick Prompts:
          </span>
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPrompt(p.question)}
              disabled={disabled}
              className="px-3 py-1 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs whitespace-nowrap transition-all shadow-2xs disabled:opacity-50 font-medium"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Modern Executive Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white border border-zinc-200/90 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-950/5 rounded-2xl p-2.5 transition-all shadow-sm"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the Tamil Nadu Budget (e.g. debt trajectory, FRBM ceiling, salary bills)..."
          rows={2}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none px-2 py-1 max-h-32 leading-relaxed"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs shrink-0 active:scale-95"
          title="Send query"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
