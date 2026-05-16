export interface ParaInfo {
  number: number;
  ar: string;       // First words in Arabic
  en: string;       // English transliteration name
  surahStart: string; // Starting surah name
  pageStart: number;  // Approx start page in standard Mushaf (604 pages total)
  totalPages: number; // Pages in this para
}

// 30 Juz / Para data — standard Medina Mushaf (604 pages)
export const paras: ParaInfo[] = [
  { number: 1,  ar: "الٓمٓ",                    en: "Alif Lam Meem",       surahStart: "Al-Fatihah",      pageStart: 1,   totalPages: 21 },
  { number: 2,  ar: "سَيَقُولُ",                en: "Sayaqool",            surahStart: "Al-Baqarah 142",  pageStart: 22,  totalPages: 20 },
  { number: 3,  ar: "تِلْكَ الرُّسُلُ",         en: "Tilkal Rusul",        surahStart: "Al-Baqarah 253",  pageStart: 42,  totalPages: 20 },
  { number: 4,  ar: "لَنْ تَنَالُوا",            en: "Lan Tanaloo",         surahStart: "Aal-Imran 92",    pageStart: 62,  totalPages: 20 },
  { number: 5,  ar: "وَالْمُحْصَنَاتُ",          en: "Wal Mohsanat",        surahStart: "An-Nisa 24",      pageStart: 82,  totalPages: 20 },
  { number: 6,  ar: "لَا يُحِبُّ اللَّهُ",       en: "La Yuhibbullah",      surahStart: "An-Nisa 148",     pageStart: 102, totalPages: 20 },
  { number: 7,  ar: "وَإِذَا سَمِعُوا",          en: "Wa Iza Samiu",        surahStart: "Al-Maidah 82",    pageStart: 122, totalPages: 20 },
  { number: 8,  ar: "وَلَوْ أَنَّنَا",            en: "Wa Lau Annana",       surahStart: "Al-An'am 111",    pageStart: 142, totalPages: 20 },
  { number: 9,  ar: "قَالَ الْمَلَأُ",            en: "Qalal Malao",         surahStart: "Al-A'raf 88",     pageStart: 162, totalPages: 20 },
  { number: 10, ar: "وَاعْلَمُوا",               en: "Wa A'lamu",           surahStart: "Al-Anfal 41",     pageStart: 182, totalPages: 20 },
  { number: 11, ar: "يَعْتَذِرُونَ",              en: "Ya'tazeroon",         surahStart: "At-Tawbah 94",    pageStart: 202, totalPages: 20 },
  { number: 12, ar: "وَمَا مِنْ دَابَّةٍ",        en: "Wa Maa Min Dabbah",   surahStart: "Hud 6",           pageStart: 222, totalPages: 20 },
  { number: 13, ar: "وَمَا أُبَرِّئُ",            en: "Wa Maa Ubri'u",       surahStart: "Yusuf 53",        pageStart: 242, totalPages: 20 },
  { number: 14, ar: "رُبَمَا",                   en: "Rubama",              surahStart: "Al-Hijr 1",       pageStart: 262, totalPages: 20 },
  { number: 15, ar: "سُبْحَانَ الَّذِي",          en: "Subhanallazi",        surahStart: "Al-Isra 1",       pageStart: 282, totalPages: 20 },
  { number: 16, ar: "قَالَ أَلَمْ",               en: "Qal Alam",            surahStart: "Al-Kahf 75",      pageStart: 302, totalPages: 20 },
  { number: 17, ar: "اقْتَرَبَ",                 en: "Iqtaraba",            surahStart: "Al-Anbiya 1",     pageStart: 322, totalPages: 20 },
  { number: 18, ar: "قَدْ أَفْلَحَ",              en: "Qad Aflaha",          surahStart: "Al-Muminoon 1",   pageStart: 342, totalPages: 20 },
  { number: 19, ar: "وَقَالَ الَّذِينَ",           en: "Wa Qalallazina",      surahStart: "Al-Furqan 21",    pageStart: 362, totalPages: 20 },
  { number: 20, ar: "أَمَّنْ خَلَقَ",              en: "Amman Khalaq",        surahStart: "An-Naml 60",      pageStart: 382, totalPages: 20 },
  { number: 21, ar: "اتْلُ مَا أُوحِيَ",           en: "Utlu Ma Uhiya",       surahStart: "Al-Ankabut 46",   pageStart: 402, totalPages: 20 },
  { number: 22, ar: "وَمَنْ يَقْنُتْ",             en: "Wa Man Yaqnut",       surahStart: "Al-Ahzab 31",     pageStart: 422, totalPages: 20 },
  { number: 23, ar: "وَمَا لِيَ",                  en: "Wa Mali",             surahStart: "Ya-Sin 28",       pageStart: 442, totalPages: 20 },
  { number: 24, ar: "فَمَنْ أَظْلَمُ",             en: "Faman Azlamu",        surahStart: "Az-Zumar 32",     pageStart: 462, totalPages: 20 },
  { number: 25, ar: "إِلَيْهِ يُرَدُّ",             en: "Ilaihi Yuraddu",      surahStart: "Fussilat 47",     pageStart: 482, totalPages: 20 },
  { number: 26, ar: "حٰمٓ",                       en: "Ha Meem",             surahStart: "Al-Ahqaf 1",      pageStart: 502, totalPages: 20 },
  { number: 27, ar: "قَالَ فَمَا خَطْبُكُمْ",      en: "Qala Fama Khatbukum", surahStart: "Adh-Dhariyat 31", pageStart: 522, totalPages: 20 },
  { number: 28, ar: "قَدْ سَمِعَ اللَّهُ",          en: "Qad Sami'allah",      surahStart: "Al-Mujadilah 1",  pageStart: 542, totalPages: 20 },
  { number: 29, ar: "تَبَارَكَ الَّذِي",            en: "Tabarakallazi",       surahStart: "Al-Mulk 1",       pageStart: 562, totalPages: 20 },
  { number: 30, ar: "عَمَّ",                       en: "Amma",                surahStart: "An-Naba 1",       pageStart: 582, totalPages: 23 },
];

// PDF file paths — served via API route with explicit Content-Type: application/pdf headers
export function getParaPdfPath(paraNumber: number): string {
  return `/api/quran-pdf/${String(paraNumber).padStart(2, "0")}.pdf`;
}

export function getParaByNumber(n: number): ParaInfo | undefined {
  return paras.find((p) => p.number === n);
}

// LocalStorage key for resume reading
export const RESUME_KEY = "quran_last_read";

export interface ResumeData {
  paraNumber: number;
  page: number;
  updatedAt: string;
}

export function saveProgress(paraNumber: number, page: number): void {
  if (typeof window === "undefined") return;
  const data: ResumeData = { paraNumber, page, updatedAt: new Date().toISOString() };
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
}

export function getProgress(): ResumeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    return raw ? (JSON.parse(raw) as ResumeData) : null;
  } catch {
    return null;
  }
}
