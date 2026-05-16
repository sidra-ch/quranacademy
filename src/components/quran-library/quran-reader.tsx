"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Download, Maximize2, Minimize2 } from "lucide-react";
import { paras, saveProgress, getParaPdfPath } from "./para-data";

interface QuranReaderProps {
  paraNumber: number;
  initialPage?: number;
}

export function QuranReader({ paraNumber, initialPage = 1 }: QuranReaderProps) {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const para     = paras.find((p) => p.number === paraNumber);
  const prevPara = paras.find((p) => p.number === paraNumber - 1);
  const nextPara = paras.find((p) => p.number === paraNumber + 1);
  const pdfUrl   = getParaPdfPath(paraNumber);

  // Save progress when para is opened
  useEffect(() => {
    saveProgress(paraNumber, initialPage);
  }, [paraNumber, initialPage]);

  // Auto-clear loading after 4s in case onLoad doesn't fire (some browsers)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, [paraNumber]);

  // Keyboard: F = fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={`flex min-h-screen flex-col bg-[#010f0d] text-white ${fullscreen ? "fixed inset-0 z-50" : ""}`}>

      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/8
                      bg-[#010f0d]/95 px-3 py-2.5 backdrop-blur-sm sm:px-5">

        {/* Back */}
        <Link
          href="/quran-library"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5
                     text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
        >
          <ArrowLeft size={13} /> Library
        </Link>

        {/* Para name */}
        {para && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white/85">
              <span className="text-[#D4AF37]">Para {para.number}</span>
              <span className="mx-2 text-white/25">·</span>
              <span className="font-[family-name:var(--font-amiri)] text-base">{para.ar}</span>
              <span className="ml-2 hidden text-xs text-white/50 sm:inline">{para.en}</span>
            </p>
          </div>
        )}

        {/* Fullscreen + Download */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <button
            onClick={() => setFullscreen((f) => !f)}
            title="Toggle fullscreen (F)"
            className="rounded-lg border border-white/10 p-1.5 text-white/60
                       transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <a
            href={pdfUrl}
            download
            title="Download PDF"
            className="rounded-lg border border-white/10 p-1.5 text-white/60
                       transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
          >
            <Download size={14} />
          </a>
        </div>
      </div>

      {/* ── PDF Viewer (native iframe — no pdfjs dependency) ── */}
      <div className="relative flex-1">
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37]" />
            <p className="text-sm text-white/40">Loading Quran…</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-16 max-w-md rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8 text-center"
          >
            <BookOpen size={40} className="mx-auto mb-4 text-[#D4AF37]/50" />
            <h3 className="mb-2 text-lg font-bold text-white">PDF Coming Soon</h3>
            <p className="mb-4 text-sm text-white/50">
              Para {paraNumber} PDF abhi available nahi hai. Jald upload hoga.
            </p>
            <code className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#D4AF37]/80">
              public/quran-pdf/{String(paraNumber).padStart(2, "0")}.pdf
            </code>
            <Link
              href="/quran-library"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/30
                         px-5 py-2.5 text-sm text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
            >
              <ArrowLeft size={14} /> Back to Library
            </Link>
          </motion.div>
        )}

        {!error && (
          <iframe
            key={paraNumber}
            src={pdfUrl}
            title={`Para ${paraNumber} — ${para?.en ?? ""}`}
            className="w-full border-0"
            style={{ height: fullscreen ? "100vh" : "calc(100vh - 54px)", minHeight: 500 }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
      </div>

      {/* ── Para Navigation Footer ── */}
      <div className="flex items-center justify-between border-t border-white/8
                      bg-[#010f0d]/95 px-4 py-3 backdrop-blur-sm">
        {prevPara ? (
          <Link
            href={`/quran-library/${prevPara.number}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2
                       text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Para {prevPara.number} · {prevPara.en}</span>
            <span className="sm:hidden">Para {prevPara.number}</span>
          </Link>
        ) : <div />}

        <p className="text-xs text-white/30">
          {para?.surahStart} · {para?.totalPages} pages
        </p>

        {nextPara ? (
          <Link
            href={`/quran-library/${nextPara.number}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2
                       text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
          >
            <span className="hidden sm:inline">Para {nextPara.number} · {nextPara.en}</span>
            <span className="sm:hidden">Para {nextPara.number}</span>
            <ArrowRight size={13} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
