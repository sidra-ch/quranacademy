import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paras } from "@/components/quran-library/para-data";
import { QuranReader } from "@/components/quran-library/quran-reader";

interface Props {
  params: Promise<{ para: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Generate static paths for all 30 paras
export function generateStaticParams() {
  return paras.map((p) => ({ para: String(p.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { para: paraParam } = await params;
  const n = parseInt(paraParam, 10);
  const para = paras.find((p) => p.number === n);
  if (!para) return { title: "Not Found" };

  return {
    title: `Para ${para.number} – ${para.en} | Quran Library`,
    description: `Read Para ${para.number} (${para.en}) of the Holy Quran online with Tajweed color-coding.`,
  };
}

export default async function ParaReaderRoute({ params, searchParams }: Props) {
  const { para: paraParam } = await params;
  const { page: pageParam } = await searchParams;

  const paraNumber = parseInt(paraParam, 10);
  const initialPage = parseInt(pageParam ?? "1", 10) || 1;

  if (isNaN(paraNumber) || paraNumber < 1 || paraNumber > 30) {
    notFound();
  }

  return <QuranReader paraNumber={paraNumber} initialPage={initialPage} />;
}
