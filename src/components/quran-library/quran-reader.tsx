"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Download,
  Maximize2, Minimize2, ChevronLeft, ChevronRight, BookOpen,
} from "lucide-react";
import { paras, saveProgress, getParaPdfPath } from "./para-data";

// Use CDN worker — avoids local build config issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface QuranReaderProps {
  paraNumber: number;
  initialPage?: number;
}

export function QuranReader({ paraNumber, initialPage = 1 }: QuranReaderProps) {
  const [numPages, setNumPages]     = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale]           = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [pageInput, setPageInput]   = useState(String(initialPage));

  const para    = paras.find((p) => p.number === paraNumber);
  const prevPara = paras.find((p) => p.number === paraNumber - 1);
  const nextPara = paras.find((p) => p.number === paraNumber + 1);
  const pdfUrl  = getParaPdfPath(paraNumber);

  // Save progress whenever page changes
  useEffect(() => {
    if (numPages > 0) {
      saveProgress(paraNumber, pageNumber);
      setPageInput(String(pageNumber));
    }
  }, [pageNumber, paraNumber, numPages]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const goTo = (n: number) => {
    const clamped = Math.max(1, Math.min(n, numPages || 1));
    setPageNumber(clamped);
    setPageInput(String(clamped));
  };

  const handlePageInputBlur = () => {
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) goTo(n); else setPageInput(String(pageNumber));
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(pageNumber + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goTo(pageNumber - 1);
      if (e.key === "+") setScale((s) => Math.min(2.0, s + 0.15));
      if (e.key === "-") setScale((s) => Math.max(0.5, s - 0.15));
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageNumber, numPages]);

  return (
    <div className={`flex min-h-screen flex-col bg-[#010f0d] text-white ${fullscreen ? "fixed inset-0 z-50" : ""}`}>

      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/8
                      bg-[#010f0d]/95 px-3 py-2.5 backdrop-blur-sm sm:px-5">

        {/* Back to Library */}
        <Link href="/quran-library"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5
                     text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
          <ArrowLeft size={13} /> Library
        </Link>

        {/* Para name */}
        {para && (
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-semibold text-white/80">
              Para {para.number} · {para.en}
            </p>
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => goTo(pageNumber - 1)} disabled={pageNumber <= 1}
            className="rounded-lg border border-white/10 p-1.5 text-white/60 transition-colors
                       hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronLeft size={15} />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <span>Page</span>
            <input
              type="number"
              value={pageInput}
              min={1}
              max={numPages || 1}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageInputBlur}
              onKeyDown={(e) => e.key === "Enter" && handlePageInputBlur()}
              className="w-10 rounded-md border border-white/15 bg-white/8 px-1.5 py-0.5
                         text-center text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
            />
            <span>/ {numPages || "—"}</span>
          </div>

          <button onClick={() => goTo(pageNumber + 1)} disabled={pageNumber >= numPages}
            className="rounded-lg border border-white/10 p-1.5 text-white/60 transition-colors
                       hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-3">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
            className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-[#D4AF37]">
            <ZoomOut size={14} />
          </button>
          <span className="w-10 text-center text-xs text-white/40">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(2.0, s + 0.15))}
            className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-[#D4AF37]">
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Fullscreen + Download */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-3">
          <button onClick={() => setFullscreen((f) => !f)}
            className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-[#D4AF37]">
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <a href={pdfUrl} download
            className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-[#D4AF37]">
            <Download size={14} />
          </a>
        </div>
      </div>

      {/* ── PDF Viewer Area ── */}
      <div className="flex flex-1 flex-col items-center overflow-auto px-2 py-6">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37]" />
            <p className="text-sm text-white/40">Loading Quran…</p>
          </div>
        )}

        {/* Error / PDF not found */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-16 max-w-md rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8 text-center"
          >
            <BookOpen size={40} className="mx-auto mb-4 text-[#D4AF37]/50" />
            <h3 className="mb-2 text-lg font-bold text-white">PDF Not Found</h3>
            <p className="mb-5 text-sm text-white/50">
              Place your Tajweed Quran PDF at:
            </p>
            <code className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3
                             text-sm text-[#D4AF37]/80">
              public/quran/para-{paraNumber}.pdf
            </code>
            <p className="mt-4 text-xs text-white/30">
              Tip: Download high-quality Tajweed PDFs from qurancomplex.gov.sa
            </p>
          </motion.div>
        )}

        {/* PDF Document */}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pageNumber}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="shadow-[0_8px_60px_rgba(0,0,0,0.6)]"
                renderAnnotationLayer
                renderTextLayer
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* ── Bottom Navigation ── */}
      {numPages > 0 && (
        <div className="flex items-center justify-between border-t border-white/8
                        bg-[#010f0d]/95 px-4 py-3 backdrop-blur-sm">

          {/* Prev para */}
          {prevPara ? (
            <Link href={`/quran-library/${prevPara.number}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2
                         text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Para {prevPara.number} · {prevPara.en}</span>
              <span className="sm:hidden">Para {prevPara.number}</span>
            </Link>
          ) : (
            <div />
          )}

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all duration-300"
                style={{ width: `${(pageNumber / (numPages || 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/30">{Math.round((pageNumber / (numPages || 1)) * 100)}%</span>
          </div>

          {/* Next para */}
          {nextPara ? (
            <Link href={`/quran-library/${nextPara.number}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2
                         text-xs text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
              <span className="hidden sm:inline">Para {nextPara.number} · {nextPara.en}</span>
              <span className="sm:hidden">Para {nextPara.number}</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
