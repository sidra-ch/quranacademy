import type { Metadata } from "next";
import { QuranLibraryPage } from "@/components/quran-library/quran-library-page";

export const metadata: Metadata = {
  title: "Quran Library | Hafiz Kamran Hameed Quran Academy",
  description:
    "Read and download all 30 Paras of the Holy Quran online. Color-coded Tajweed Quran with built-in reader. Learn Quran with proper Tajweed at Hafiz Kamran Hameed Quran Academy.",
};

export default function QuranLibraryRoute() {
  return <QuranLibraryPage />;
}
