"use client";

import React from "react";
import { HealthStatus } from "@/lib/types";
import { Database, Sparkles, Table2, MessageSquare } from "lucide-react";

interface HeaderProps {
  health: HealthStatus | null;
  activeTab: "chat" | "tables";
  onTabChange: (tab: "chat" | "tables") => void;
}

export const Header: React.FC<HeaderProps> = ({ health, activeTab, onTabChange }) => {
  const isHealthy = health?.status === "healthy";

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">FinSight AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Agentic RAG
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              TN Fiscal Management White Paper (2021-22 to 2025-26)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-sm font-medium">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === "chat"
                ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Analyst</span>
          </button>
          <button
            onClick={() => onTabChange("tables")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
              activeTab === "tables"
                ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span>Budget Tables</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              42
            </span>
          </button>
        </div>

        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
            isHealthy
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isHealthy ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            <Database className="w-3.5 h-3.5" />
            <span>Neon Postgres (pgvector)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 + OpenAI Fallback</span>
          </div>
        </div>
      </div>
    </header>
  );
};
