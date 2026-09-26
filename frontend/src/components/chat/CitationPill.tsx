import React from "react";
import { CitationItem } from "@/lib/types";
import { Table, BookOpen, ExternalLink } from "lucide-react";

interface CitationPillProps {
  citation: CitationItem;
  onClick: (citation: CitationItem) => void;
}

export const CitationPill: React.FC<CitationPillProps> = ({ citation, onClick }) => {
  const isTable = citation.type === "table";

  return (
    <button
      onClick={() => onClick(citation)}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-all text-left group shadow-2xs"
      title="Click to inspect source evidence"
    >
      {isTable ? (
        <Table className="w-3.5 h-3.5 text-blue-600 group-hover:text-amber-600 shrink-0" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-emerald-600 group-hover:text-amber-600 shrink-0" />
      )}
      <span className="truncate max-w-[280px] font-mono text-[11px]">{citation.label}</span>
      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 opacity-60 group-hover:opacity-100 shrink-0 ml-0.5" />
    </button>
  );
};
