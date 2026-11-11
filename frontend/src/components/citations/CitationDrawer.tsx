import React from "react";
import { CitationItem } from "@/lib/types";
import { X, Table, BookOpen, CheckCircle2, FileText, ExternalLink, Download } from "lucide-react";

interface CitationDrawerProps {
  citation: CitationItem | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ citation, isOpen = true, onClose }) => {
  if (!citation || !isOpen) return null;

  const isTable = citation.type === "table";
  const pages = Array.isArray(citation.page)
    ? citation.page.join(", ")
    : citation.page?.toString() || "N/A";
  const firstPage = Array.isArray(citation.page)
    ? citation.page[0]
    : (citation.page?.toString().split(",")[0].trim() || "1");

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-zinc-200/90 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-2xs">
            {isTable ? (
              <Table className="w-4 h-4 text-zinc-700" />
            ) : (
              <BookOpen className="w-4 h-4 text-zinc-700" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-950">Source Evidence Inspector</h3>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {isTable ? "Structured Financial Table" : "Document Narrative Passage"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
        {/* Verification Card */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-emerald-900">Verified Primary Source</p>
            <p className="text-emerald-800/90 leading-relaxed">
              This citation maps directly to the official Government of Tamil Nadu White Paper on Fiscal Management (2021-22 to 2025-26).
            </p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-3 bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/80">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Citation Title</span>
            <p className="font-semibold text-zinc-950 text-sm mt-0.5">{citation.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-zinc-200/60">
            <div>
              <span className="text-[11px] text-zinc-500 font-medium">PDF Page Number(s)</span>
              <p className="font-mono text-zinc-900 font-semibold text-sm">Page {pages}</p>
            </div>
            <div>
              <span className="text-[11px] text-zinc-500 font-medium">Database Source</span>
              <p className="font-mono text-zinc-700 text-xs mt-0.5">
                {isTable ? `SQL: ${citation.table_name || "Extracted"}` : "Neon pgvector"}
              </p>
            </div>
          </div>

          {citation.chapter && (
            <div className="pt-2.5 border-t border-zinc-200/60">
              <span className="text-[11px] text-zinc-500 font-medium">Chapter</span>
              <p className="text-zinc-700 text-xs mt-0.5 font-medium">{citation.chapter}</p>
            </div>
          )}

          {citation.section && citation.section !== citation.chapter && (
            <div className="pt-2.5 border-t border-zinc-200/60">
              <span className="text-[11px] text-zinc-500 font-medium">Section</span>
              <p className="text-zinc-700 text-xs mt-0.5">{citation.section}</p>
            </div>
          )}
        </div>

        {/* Source Document Attachment Card */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              Primary Source Document
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
              Page {pages}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 shadow-2xs">
              <FileText className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">
                TN_White_Paper_English-2026.pdf
              </p>
              <p className="text-[11px] text-zinc-500">
                Official Government Release (1.3 MB)
              </p>
            </div>
          </div>

          {/* Action Buttons: Open at Page & Download */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <a
              href={`/docs/TN_White_Paper_English-2026.pdf#page=${firstPage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-xs transition-all text-center active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Page {pages}</span>
            </a>
            <a
              href="/docs/TN_White_Paper_English-2026.pdf"
              download="TN_White_Paper_English-2026.pdf"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-all text-center active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600" />
              <span>Download PDF</span>
            </a>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed pt-0.5">
            Verified boundary coordinates parsed via PyMuPDF and deterministic SQL retrieval.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-mono">FinSight AI Verifier</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium border border-zinc-200 shadow-2xs transition-all active:scale-95"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
