"use client";

import dynamic from "next/dynamic";

// pdfjs-dist uses browser-only APIs at module init time — must be client-only
const QuranReader = dynamic(
  () => import("./quran-reader").then((m) => ({ default: m.QuranReader })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#020b0a]">
        <div className="flex flex-col items-center gap-3 text-white/60">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37]" />
          <p className="text-sm">Loading reader…</p>
        </div>
      </div>
    ),
  }
);

export { QuranReader };
