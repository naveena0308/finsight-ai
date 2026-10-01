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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#121622] hover:bg-[#181E2E] text-zinc-300 hover:text-amber-300 border border-white/[0.08] hover:border-amber-400/40 transition-all text-left group shadow-2xs"
      title="Click to inspect source evidence"
    >
      {isTable ? (
        <Table2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
      )}
      <span className="truncate max-w-[280px] font-mono text-[11px]">{citation.label}</span>
      <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 opacity-60 group-hover:opacity-100 shrink-0 ml-0.5" />
    </button>
  );
};
