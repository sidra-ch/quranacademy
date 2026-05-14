"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Download, ChevronRight, Clock } from "lucide-react";
import { paras, getProgress, type ResumeData } from "./para-data";

// ─── Fade-up animation variant ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 0.44, 0.42, 0.96] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

// ─── Para Card ───────────────────────────────────────────────────────
function ParaCard({ para, index }: { para: typeof paras[0]; index: number }) {
  return (
    <motion.div variants={fadeUp} className="group relative">
      {/* Glow ring on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
           style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.35), transparent 70%)", filter: "blur(1px)" }} />

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#031a18]
                      transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:shadow-[0_0_28px_rgba(212,175,55,0.12)]">

        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Header row: para number + Tajweed badge */}
          <div className="flex items-start justify-between gap-2">
            {/* Para number */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                            border border-[#D4AF37]/25 bg-[#D4AF37]/8 text-[#D4AF37]">
              <span className="text-lg font-bold leading-none">{para.number}</span>
            </div>

            {/* Tajweed badge */}
            <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/8
                             px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#D4AF37]">
              TAJWEED
            </span>
          </div>

          {/* Arabic name */}
          <p className="text-right text-2xl leading-relaxed text-[#f0e5c0]"
             dir="rtl"
             style={{ fontFamily: "var(--font-amiri)" }}>
            {para.ar}
          </p>

          {/* English name + surah */}
          <div>
            <p className="text-sm font-semibold text-white/80">{para.en}</p>
            <p className="mt-0.5 text-xs text-white/35">Starts: {para.surahStart}</p>
          </div>

          {/* Page count */}
          <p className="text-xs text-white/30">{para.totalPages} pages</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-white/6 p-3">
          <Link
            href={`/quran-library/${para.number}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl
                       bg-[#D4AF37] py-2.5 text-xs font-semibold text-[#021311]
                       transition-all duration-200 hover:bg-[#e8c84a] hover:shadow-[0_0_16px_rgba(212,175,55,0.4)]"
          >
            <BookOpen size={13} />
            Open Quran
          </Link>
          <a
            href={`/quran/para-${para.number}.pdf`}
            download
            className="flex items-center justify-center rounded-xl border border-white/12 bg-white/5
                       p-2.5 text-white/60 transition-all duration-200 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            title="Download PDF"
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Continue Reading Banner ─────────────────────────────────────────
function ContinueReading({ data }: { data: ResumeData }) {
  const para = paras.find((p) => p.number === data.paraNumber);
  if (!para) return null;

  return (
    <motion.div variants={fadeUp}
      className="mb-10 overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5
                 p-5 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Clock size={20} className="text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#D4AF37]/70">CONTINUE READING</p>
            <p className="mt-0.5 text-base font-semibold text-white">
              Para {data.paraNumber} — {para.en}
            </p>
            <p className="text-xs text-white/40">Page {data.page} · Last read {new Date(data.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <Link
          href={`/quran-library/${data.paraNumber}?page=${data.page}`}
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5
                     text-sm font-semibold text-[#021311] transition-all
                     hover:bg-[#e8c84a] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
        >
          Continue <ChevronRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Library Page Component ─────────────────────────────────────
export function QuranLibraryPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    setResume(getProgress());
  }, []);

  return (
    <div className="min-h-screen bg-[#010f0d] text-white">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0"
             style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(15,118,110,0.12) 0%, transparent 45%)" }} />
        {/* Geometric SVG pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          {/* Bismillah */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-3xl text-[#f0e5c0] sm:text-4xl"
            dir="rtl"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            <span className="text-[#D4AF37]">Al-Quran</span>{" "}
            <span className="text-white">Al-Kareem</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 text-base text-white/50 sm:text-lg"
          >
            Color-coded Tajweed Quran · 30 Para · Read online or download
          </motion.p>

          {/* Ayat */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 text-xl leading-loose text-[#D4AF37]/80 sm:text-2xl"
            dir="rtl"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-1 text-xs tracking-widest text-white/30"
          >
            SURAH AL-MUZZAMMIL · 73:4
          </motion.p>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#010f0d] to-transparent" />
      </div>

      {/* ── Content Area ── */}
      <div className="mx-auto max-w-6xl px-4 pb-20">

        {/* Continue Reading */}
        {resume && (
          <motion.div initial="hidden" animate="show" variants={staggerContainer}>
            <ContinueReading data={resume} />
          </motion.div>
        )}

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-4"
        >
          <h2 className="text-xl font-bold text-white sm:text-2xl">30 Paras</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
        </motion.div>

        {/* Para grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {paras.map((para, index) => (
            <ParaCard key={para.number} para={para} index={index} />
          ))}
        </motion.div>

        {/* PDF Setup Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 rounded-2xl border border-white/6 bg-white/3 p-5 text-center"
        >
          <p className="text-sm text-white/40">
            Place your Tajweed Quran PDF files in{" "}
            <code className="rounded bg-white/8 px-1.5 py-0.5 text-[#D4AF37]/70">public/quran/para-1.pdf</code>
            {" "}through{" "}
            <code className="rounded bg-white/8 px-1.5 py-0.5 text-[#D4AF37]/70">para-30.pdf</code>
          </p>
        </motion.div>
      </div>

      {/* Back to Home */}
      <div className="border-t border-white/6 py-6 text-center">
        <Link href="/"
          className="text-sm text-white/40 transition-colors hover:text-[#D4AF37]">
          ← Back to Academy
        </Link>
      </div>
    </div>
  );
}
