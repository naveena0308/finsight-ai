"use client";

import React, { useState, useRef } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/constants";
import { SendHorizontal, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
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
    <div className="space-y-3">
      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPrompt(p.question)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs whitespace-nowrap transition-all disabled:opacity-50"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-slate-900/80 border border-slate-800 focus-within:border-amber-500/50 rounded-2xl p-2.5 transition-all shadow-xl"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the Tamil Nadu Budget (e.g. debt, deficit, fiscal targets, peer comparisons)..."
          rows={2}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none px-2 py-1 max-h-32"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/10 shrink-0"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
