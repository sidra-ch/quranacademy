import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Hand,
  Languages,
  Shield,
  Sparkles,
  UserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NooraniQaidaViewer } from "@/components/noorani-qaida-viewer";

const coursePages = [
  {
    slug: "noorani-qaida",
    title: "Noorani Qaida",
    eyebrow: "Foundations",
    icon: BookOpen,
    summary: "A beginner pathway for children and adults learning Arabic letters, joining, makharij, and first fluent Quran reading.",
    outcomes: ["Arabic letters with correct sound", "Joining and short vowel rules", "Daily reading confidence", "Gentle correction with live practice"],
    modules: ["Letter shapes and sounds", "Harakat and sukoon", "Madd and tanween", "Practice pages with teacher feedback"]
  },
  {
    slug: "nazra-quran",
    title: "Nazra Quran with Tajweed",
    eyebrow: "Live Recitation",
    icon: GraduationCap,
    summary: "Build fluent Quran reading with Tajweed rules, guided correction, and a calm one-on-one recitation routine.",
    outcomes: ["Improved pronunciation", "Measured recitation fluency", "Consistent home revision plan", "Confidence reading from mushaf"],
    modules: ["Makharij refinement", "Rules of noon and meem", "Madd practice", "Daily nazra recitation"]
  },
  {
    slug: "hifz-support",
    title: "Hifz-ul-Quran Support",
    eyebrow: "Memorization",
    icon: BookMarked,
    summary: "A structured memorization support system with sabaq, sabqi, manzil, revision habits, and parent-visible progress.",
    outcomes: ["Clear memorization routine", "Stronger retention", "Revision discipline", "Progress tracking"],
    modules: ["New lesson planning", "Previous lesson review", "Manzil rotation", "Mistake logs and correction"]
  },
  {
    slug: "translation-tafseer",
    title: "Translation & Tafseer",
    eyebrow: "Understanding",
    icon: Languages,
    summary: "Understand selected Quran passages through accessible translation, age-appropriate tafseer, and practical reflection.",
    outcomes: ["Meaning-based connection", "Contextual understanding", "Practical lessons", "Vocabulary growth"],
    modules: ["Surah translation", "Key Arabic words", "Tafseer discussion", "Reflection and application"]
  },
  {
    slug: "masnoon-duas",
    title: "Masnoon Duas",
    eyebrow: "Daily Practice",
    icon: Hand,
    summary: "Memorize essential daily duas with meanings, repetition, and simple routines that make practice natural.",
    outcomes: ["Daily dua memorization", "Meaning awareness", "Better adab", "Repeatable practice plan"],
    modules: ["Morning and evening duas", "Home and travel duas", "Eating and sleeping duas", "Revision circle"]
  },
  {
    slug: "basic-islamic-teachings",
    title: "Basic Islamic Teachings",
    eyebrow: "Aqeedah & Adab",
    icon: UserRound,
    summary: "A warm introduction to Islamic beliefs, manners, cleanliness, and identity for modern Muslim families.",
    outcomes: ["Core belief foundations", "Islamic manners", "Cleanliness habits", "Family-friendly discussions"],
    modules: ["Iman basics", "Adab and akhlaq", "Taharah", "Everyday Islamic identity"]
  },
  {
    slug: "namaz-training",
    title: "Namaz Training",
    eyebrow: "Prayer Skills",
    icon: Building2,
    summary: "Learn wudu, salah positions, prayer words, and correction through step-by-step live training.",
    outcomes: ["Correct prayer sequence", "Memorized prayer recitations", "Wudu confidence", "Practical salah habit"],
    modules: ["Wudu steps", "Salah positions", "Prayer recitations", "Common mistakes"]
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    eyebrow: "Deen Essentials",
    icon: Shield,
    summary: "A complete Islamic studies pathway covering seerah, stories, adab, fiqh basics, and practical deen.",
    outcomes: ["Stronger Islamic identity", "Seerah awareness", "Practical fiqh basics", "Character development"],
    modules: ["Prophet stories", "Seerah moments", "Fiqh for beginners", "Islamic character"]
  }
];

type CourseParams = Promise<{ slug: string }>;

export function generateStaticParams() {
  return coursePages.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: CourseParams }): Promise<Metadata> {
  const { slug } = await params;
  const course = coursePages.find((item) => item.slug === slug);

  if (!course) {
    return {};
  }

  return {
    title: `${course.title} | Hafiz Kamran Hameed Quran Academy`,
    description: course.summary
  };
}

export default async function CoursePage({ params }: { params: CourseParams }) {
  const { slug } = await params;
  const course = coursePages.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  const Icon = course.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_10%,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_80%_4%,rgba(20,184,166,0.16),transparent_30%),linear-gradient(180deg,#021311,#052a25_48%,#010807)] text-white">
      <section className="relative isolate px-6 py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(30deg,rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.58)_1px,transparent_1px)] [background-position:0_0,16px_16px] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/#courses" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white/72 backdrop-blur transition hover:border-[#D4AF37]/45 hover:text-[#D4AF37]">
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>

          <div className="grid gap-8 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#f7d978]">
                <Sparkles className="h-3.5 w-3.5" />
                {course.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl">{course.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{course.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="gold">
                  <Link href="/#contact">
                    Book Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                  <Link href="/#pricing">View Plans</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-h-[380px] overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.045)_45%,rgba(1,35,30,0.62))] p-7 shadow-[0_34px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(212,175,55,0.2),transparent_34%),radial-gradient(circle_at_76%_64%,rgba(20,184,166,0.18),transparent_36%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(30deg,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="relative flex h-full min-h-[326px] flex-col justify-between">
                <div className="grid h-20 w-20 place-items-center rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/12 text-[#D4AF37] shadow-[0_0_48px_rgba(212,175,55,0.18)]">
                  <Icon className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">Course Outcomes</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {course.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span className="text-sm leading-5 text-white/75">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 pb-16 md:grid-cols-4">
            {course.modules.map((module, index) => (
              <div key={module} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">Module {index + 1}</span>
                <h2 className="mt-3 text-xl font-semibold text-white">{module}</h2>
              </div>
            ))}
          </div>

          {/* Noorani Qaida PDF Viewer — only shown for this course */}
          {slug === "noorani-qaida" && (
            <NooraniQaidaViewer />
          )}
        </div>
      </section>
    </main>
  );
}
