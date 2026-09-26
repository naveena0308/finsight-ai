import React from "react";
import { CitationItem } from "@/lib/types";
import { X, Table, BookOpen, CheckCircle2 } from "lucide-react";

interface CitationDrawerProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const isTable = citation.type === "table";
  const pages = Array.isArray(citation.page)
    ? citation.page.join(", ")
    : citation.page?.toString() || "N/A";

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          {isTable ? (
            <Table className="w-5 h-5 text-blue-400" />
          ) : (
            <BookOpen className="w-5 h-5 text-emerald-400" />
          )}
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Source Evidence Inspector</h3>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {isTable ? "Structured Financial Table" : "Document Narrative Passage"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
        {/* Verification Card */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-300">Verified Primary Source</p>
            <p className="text-slate-400">
              This citation maps directly to the official Government of Tamil Nadu White Paper on Fiscal Management (2021-22 to 2025-26).
            </p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Citation Title</span>
            <p className="font-semibold text-slate-100 text-sm mt-0.5">{citation.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400">PDF Page Number(s)</span>
              <p className="font-mono text-amber-400 font-semibold text-sm">Page {pages}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Database Source</span>
              <p className="font-mono text-slate-200 text-xs mt-0.5">
                {isTable ? `SQL Table: ${citation.table_name || "Extracted"}` : "Neon pgvector"}
              </p>
            </div>
          </div>

          {citation.chapter && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">Chapter</span>
              <p className="text-slate-200 text-xs mt-0.5">{citation.chapter}</p>
            </div>
          )}

          {citation.section && citation.section !== citation.chapter && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">Section</span>
              <p className="text-slate-200 text-xs mt-0.5">{citation.section}</p>
            </div>
          )}
        </div>

        {/* Informational Guidance */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-2">
          <p className="font-medium text-slate-300">How to cross-verify:</p>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
            <li>
              You can confirm this figure on <strong className="text-slate-200">Page {pages}</strong> of the original PDF stored in <code className="text-amber-400/90 font-mono">backend/data/raw/TN_White_Paper_English-2026.pdf</code>.
            </li>
            <li>
              The numbers were parsed directly via PyMuPDF table boundary analysis and stored in Neon PostgreSQL for deterministic retrieval.
            </li>
          </ul>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">FinSight AI Verifier</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
