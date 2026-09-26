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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 transition-all text-left group"
      title="Click to inspect source evidence"
    >
      {isTable ? (
        <Table className="w-3.5 h-3.5 text-blue-400 group-hover:text-amber-400 shrink-0" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-emerald-400 group-hover:text-amber-400 shrink-0" />
      )}
      <span className="truncate max-w-[280px]">{citation.label}</span>
      <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 shrink-0 ml-0.5" />
    </button>
  );
};
