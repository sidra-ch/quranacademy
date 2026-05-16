"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const pdfs = [
  {
    label: "اردو",
    sublabel: "Urdu",
    file: "/noorani-qaida/noorani_qaida.pdf",
  },
  {
    label: "English",
    sublabel: "English",
    file: "/noorani-qaida/Noorani-Qaida-in-English.pdf",
  },
];

export function NooraniQaidaViewer() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="pb-16">
      {/* Section header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
            Read Online
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
            Noorani Qaida — Full Book
          </h2>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-1 self-start rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur sm:self-auto">
          {pdfs.map((pdf, i) => (
            <button
              key={pdf.sublabel}
              onClick={() => setSelected(i)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition duration-300 ${
                selected === i
                  ? "bg-[#D4AF37] text-[#071b17] shadow-[0_2px_18px_rgba(212,175,55,0.45)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {pdf.label}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="overflow-hidden rounded-[28px] border border-white/12 shadow-[0_26px_70px_rgba(0,0,0,0.5)]">
        <iframe
          key={selected}
          src={`${pdfs[selected].file}#toolbar=1&navpanes=0&scrollbar=1`}
          className="h-[80vh] min-h-[540px] w-full"
          title={`Noorani Qaida — ${pdfs[selected].sublabel}`}
        />
      </div>

      {/* Download button */}
      <div className="mt-4 flex justify-end">
        <a
          href={pdfs[selected].file}
          download
          className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2.5 text-sm font-semibold text-[#f7d978] transition hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/70"
        >
          <Download className="h-4 w-4" />
          Download {pdfs[selected].sublabel} PDF
        </a>
      </div>
    </div>
  );
}
