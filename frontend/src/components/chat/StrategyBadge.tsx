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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
          <Database className="w-3 h-3 text-blue-600" />
          <span>Table SQL Lookup</span>
        </span>
      );
    case "NARRATIVE_SEARCH":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <BookOpen className="w-3 h-3 text-emerald-600" />
          <span>pgvector Narrative Search</span>
        </span>
      );
    case "HYBRID":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
          <Layers className="w-3 h-3 text-purple-600" />
          <span>Hybrid Multi-Agent Synthesis</span>
        </span>
      );
  }
};
