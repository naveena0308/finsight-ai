import React from "react";
import { RetrievalStrategy } from "@/lib/types";
import { Table2, FileText, ShieldCheck } from "lucide-react";

interface StrategyBadgeProps {
  strategy?: RetrievalStrategy;
}

export const StrategyBadge: React.FC<StrategyBadgeProps> = ({ strategy }) => {
  if (!strategy) return null;

  switch (strategy) {
    case "TABLE_LOOKUP":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
          <Table2 className="w-3 h-3 text-indigo-600" />
          <span>Verified Table Data</span>
        </span>
      );
    case "NARRATIVE_SEARCH":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <FileText className="w-3 h-3 text-emerald-600" />
          <span>Official Text Citation</span>
        </span>
      );
    case "HYBRID":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-amber-600" />
          <span>Cross-Verified Analysis</span>
        </span>
      );
  }
};
