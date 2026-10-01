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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0A0D14]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            {isTable ? (
              <Table className="w-4 h-4 text-amber-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono">Source Evidence Inspector</h3>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              {isTable ? "Structured Financial Table" : "Document Narrative Passage"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
        {/* Verification Card */}
        <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-slate-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-300">Verified Primary Source</p>
            <p className="text-slate-300 leading-relaxed">
              This citation maps directly to the official Government of Tamil Nadu White Paper on Fiscal Management (2021-22 to 2025-26).
            </p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-3 bg-[#0E121B]/90 p-4 rounded-xl border border-white/[0.08]">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Citation Title</span>
            <p className="font-bold text-white text-sm mt-0.5">{citation.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/[0.06]">
            <div>
              <span className="text-xs text-slate-400">PDF Page Number(s)</span>
              <p className="font-mono text-amber-300 font-semibold text-sm">Page {pages}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Database Source</span>
              <p className="font-mono text-slate-300 text-xs mt-0.5">
                {isTable ? `SQL: ${citation.table_name || "Extracted"}` : "Neon pgvector"}
              </p>
            </div>
          </div>

          {citation.chapter && (
            <div className="pt-2.5 border-t border-white/[0.06]">
              <span className="text-xs text-slate-400">Chapter</span>
              <p className="text-slate-300 text-xs mt-0.5 font-medium">{citation.chapter}</p>
            </div>
          )}

          {citation.section && citation.section !== citation.chapter && (
            <div className="pt-2.5 border-t border-white/[0.06]">
              <span className="text-xs text-slate-400">Section</span>
              <p className="text-slate-300 text-xs mt-0.5">{citation.section}</p>
            </div>
          )}
        </div>

        {/* Source Document Attachment Card */}
        <div className="p-4 rounded-2xl bg-[#0E121B]/90 border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Primary Source Document
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
              Page {pages}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 shadow-sm">
              <FileText className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                TN_White_Paper_English-2026.pdf
              </p>
              <p className="text-[11px] text-slate-400">
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
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all text-center active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Page {pages}</span>
            </a>
            <a
              href="/docs/TN_White_Paper_English-2026.pdf"
              download="TN_White_Paper_English-2026.pdf"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-medium border border-white/10 transition-all text-center active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download PDF</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
            Verified boundary coordinates parsed via PyMuPDF and deterministic SQL retrieval.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">FinSight AI Verifier</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium border border-white/10 transition-all active:scale-95"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
