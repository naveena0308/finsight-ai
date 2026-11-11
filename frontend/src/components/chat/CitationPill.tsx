import React from "react";
import { CitationItem } from "@/lib/types";
import { Table2, BookOpen, ExternalLink } from "lucide-react";

interface CitationPillProps {
  citation: CitationItem;
  onClick: (citation: CitationItem) => void;
}

export const CitationPill: React.FC<CitationPillProps> = ({ citation, onClick }) => {
  const isTable = citation.type === "table";

  return (
    <button
      onClick={() => onClick(citation)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 hover:border-zinc-300 transition-all text-left group shadow-2xs"
      title="Click to inspect source evidence"
    >
      {isTable ? (
        <Table2 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-900 transition-colors shrink-0" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-900 transition-colors shrink-0" />
      )}
      <span className="truncate max-w-[280px] font-mono text-[11px] font-medium">{citation.label}</span>
      <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0 ml-0.5" />
    </button>
  );
};
