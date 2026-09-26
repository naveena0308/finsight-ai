import React from "react";
import { RetrievalStrategy } from "@/lib/types";
import { Database, BookOpen, Layers } from "lucide-react";

interface StrategyBadgeProps {
  strategy?: RetrievalStrategy;
}

export const StrategyBadge: React.FC<StrategyBadgeProps> = ({ strategy }) => {
  if (!strategy) return null;

  switch (strategy) {
    case "TABLE_LOOKUP":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Database className="w-3 h-3" />
          <span>Table SQL Lookup</span>
        </span>
      );
    case "NARRATIVE_SEARCH":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BookOpen className="w-3 h-3" />
          <span>pgvector Narrative Search</span>
        </span>
      );
    case "HYBRID":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Layers className="w-3 h-3" />
          <span>Hybrid Multi-Agent Synthesis</span>
        </span>
      );
  }
};
