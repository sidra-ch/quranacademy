"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ElementType } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookMarked,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  GraduationCap,
  Hand,
  Languages,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  MoonStar,
  Phone,
  ShieldCheck,
  Shield,
  Star,
  UserRound,
  X
} from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import CinematicHero from "./cinematic-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { buildWhatsAppLink, DEFAULT_MESSAGE, trackEvent } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 350, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 350, damping: 30 });
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
}

const navItems = ["Home", "About", "Courses", "Testimonials", "Contact"];



const courses = [
  {
    title: "Noorani Qaida",
    slug: "noorani-qaida",
    eyebrow: "Foundations",
    duration: "Beginner path",
    description: "A beginner-friendly course focused on Arabic letters, pronunciation, and the basics of Quran reading.",
    icon: BookOpen,
    accent: "from-emerald-300 via-[#D4AF37] to-teal-200",
    glow: "rgba(16,185,129,0.34)",
    layout: "lg:col-span-2 lg:row-span-2",
    iconFront: "text-[#0E5A52]",
    iconBack: "text-[#C79C2F]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f8f2e6)]"
  },
  {
    title: "Nazra Quran with Tajweed",
    slug: "nazra-quran",
    eyebrow: "Live Recitation",
    duration: "Fluency track",
    description: "Learn to recite the Quran correctly with proper Tajweed rules, clear pronunciation, and consistent fluency.",
    icon: GraduationCap,
    accent: "from-teal-200 via-[#D4AF37] to-emerald-400",
    glow: "rgba(20,184,166,0.34)",
    layout: "lg:col-span-2",
    iconFront: "text-[#1F6D62]",
    iconBack: "text-[#D6A843]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffdf8,#f6efe1)]"
  },
  {
    title: "Hifz-ul-Quran Support",
    slug: "hifz-support",
    eyebrow: "Memorization",
    duration: "Revision system",
    description: "Guided revision and memorization support with structured sabaq, sabqi, and manzil practice sessions.",
    icon: BookMarked,
    accent: "from-[#D4AF37] via-emerald-200 to-cyan-200",
    glow: "rgba(212,175,55,0.34)",
    layout: "lg:row-span-2",
    iconFront: "text-[#0D665B]",
    iconBack: "text-[#BE9026]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f7f0e3)]"
  },
  {
    title: "Translation & Tafseer",
    slug: "translation-tafseer",
    eyebrow: "Understanding",
    duration: "Meaning focused",
    description: "Understand the meaning of selected surahs, daily supplications, and essential Islamic teachings.",
    icon: Languages,
    accent: "from-amber-200 via-[#D4AF37] to-emerald-300",
    glow: "rgba(245,158,11,0.28)",
    layout: "lg:col-span-2",
    iconFront: "text-[#0F5B51]",
    iconBack: "text-[#D5A237]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f8efe1)]"
  },
  {
    title: "Masnoon Duas",
    slug: "masnoon-duas",
    eyebrow: "Daily Practice",
    duration: "Short lessons",
    description: "Learn important daily duas — morning and evening, after Salah, before eating, before sleeping, and more — with their meanings and correct pronunciation.",
    icon: Hand,
    accent: "from-emerald-200 via-teal-200 to-[#D4AF37]",
    glow: "rgba(45,212,191,0.26)",
    layout: "",
    iconFront: "text-[#0F6258]",
    iconBack: "text-[#C99A2F]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f7f1e5)]"
  },
  {
    title: "Basic Islamic Teachings",
    slug: "basic-islamic-teachings",
    eyebrow: "Aqeedah & Adab",
    duration: "Family friendly",
    description: "Covers core Islamic beliefs (Aqeedah), cleanliness (Taharah), good manners (Adab), and basic Islamic identity — taught in a simple, age-appropriate way.",
    icon: UserRound,
    accent: "from-cyan-200 via-emerald-300 to-[#D4AF37]",
    glow: "rgba(14,165,233,0.22)",
    layout: "",
    iconFront: "text-[#0F6D62]",
    iconBack: "text-[#CFA236]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f6efe2)]"
  },
  {
    title: "Namaz Training",
    slug: "namaz-training",
    eyebrow: "Prayer Skills",
    duration: "Step by step",
    description: "Step-by-step learning of Wudu, Salah positions, Tasbeehaat, and Surahs recited in prayer — building confident and correct daily prayer habits.",
    icon: Building2,
    accent: "from-[#D4AF37] via-lime-200 to-emerald-300",
    glow: "rgba(132,204,22,0.22)",
    layout: "",
    iconFront: "text-[#0F5F54]",
    iconBack: "text-[#C2942B]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f7efe2)]"
  },
  {
    title: "Islamic Studies",
    slug: "islamic-studies",
    eyebrow: "Deen Essentials",
    duration: "Complete track",
    description: "Stories, seerah, adab, fiqh basics, and practical Islam for modern families.",
    icon: Shield,
    accent: "from-emerald-300 via-[#D4AF37] to-rose-200",
    glow: "rgba(16,185,129,0.28)",
    layout: "lg:col-span-2",
    iconFront: "text-[#0B5A50]",
    iconBack: "text-[#D2A73D]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f8f1e5)]"
  }
];

type CourseCardData = (typeof courses)[number];

function PremiumCourseCard({ course, index }: { course: CourseCardData; index: number }) {
  const Icon = course.icon;
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 190, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 190, damping: 22 });
  const rotateX = useSpring(useTransform(y, [-42, 42], [7, -7]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-42, 42], [-7, 7]), { stiffness: 260, damping: 24 });
  const particleDelay = [0, 0.45, 0.9, 1.35];

  return (
    <motion.div
      data-reveal-item
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`min-w-[84vw] snap-center sm:min-w-[430px] md:min-w-0 ${course.layout}`}
      style={{ x: smoothX, y: smoothY, rotateX, rotateY, transformPerspective: 1100, cursor: "pointer" }}
      onClick={() => router.push(`/courses/${course.slug}`)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.08);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.08);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={`/courses/${course.slug}`}
        className="group/course relative block overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.045)_46%,rgba(1,35,30,0.55))] p-[1px] shadow-[0_26px_70px_rgba(0,0,0,0.34)] outline-none backdrop-blur-2xl transition duration-500 hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        style={{ boxShadow: `0 26px 70px rgba(0,0,0,0.34), 0 0 0 rgba(0,0,0,0), 0 0 46px ${course.glow}` }}
      >
        <span className={`pointer-events-none absolute -inset-[2px] rounded-[30px] bg-gradient-to-r ${course.accent} opacity-0 blur-sm transition duration-700 group-hover/course:opacity-80`} />
        <span className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition duration-700 group-hover/course:opacity-100 [background:conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(212,175,55,0.95)_74deg,rgba(45,212,191,0.7)_142deg,transparent_220deg,rgba(212,175,55,0.85)_318deg,transparent_360deg)] group-hover/course:animate-[course-border-spin_4s_linear_infinite]" />

        <span className="relative block overflow-hidden rounded-[27px] border border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(212,175,55,0.18),transparent_31%),radial-gradient(circle_at_88%_22%,rgba(20,184,166,0.18),transparent_34%),linear-gradient(145deg,rgba(2,30,27,0.92),rgba(5,75,63,0.8)_48%,rgba(2,19,17,0.94))] p-6 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] sm:p-7">
          <span className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(30deg,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-position:0_0,10px_10px] [background-size:20px_20px]" />
          <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover/course:opacity-100 [background:linear-gradient(110deg,transparent_12%,rgba(255,255,255,0.22)_34%,transparent_56%)] group-hover/course:animate-[course-shine_1.35s_ease-in-out]" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(212,175,55,0.14),transparent)] blur-2xl transition duration-700 group-hover/course:opacity-100" />
          <span className="pointer-events-none absolute inset-x-10 bottom-0 h-36 bg-[linear-gradient(0deg,rgba(16,185,129,0.14),transparent)] blur-2xl transition duration-700 group-hover/course:opacity-100" />

          {particleDelay.map((delay, particleIndex) => (
            <motion.span
              key={delay}
              aria-hidden="true"
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#D4AF37]/70 opacity-0 shadow-[0_0_16px_rgba(212,175,55,0.9)] group-hover/course:opacity-100"
              style={{
                left: `${18 + particleIndex * 18}%`,
                top: particleIndex % 2 === 0 ? "18%" : "76%"
              }}
              animate={{ y: [-3, -16, -3], x: [0, particleIndex % 2 ? -8 : 8, 0], opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 3.2, delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <span className="relative z-10 flex min-h-[280px] flex-col justify-between gap-8">
            <span>
              <span className="mb-6 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f7d978]">
                  {course.eyebrow}
                </span>
                <span className="text-xs font-medium text-white/50">{course.duration}</span>
              </span>

              <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.08] text-[#D4AF37] shadow-[0_18px_34px_rgba(0,0,0,0.25)] transition duration-500 group-hover/course:rotate-6 group-hover/course:scale-110">
                <span className="absolute inset-1 rounded-[18px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_56%)]" />
                <Icon className="relative h-8 w-8 stroke-[1.9]" />
              </span>

              <h3 className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white transition duration-500 group-hover/course:-translate-y-1 sm:text-3xl">
                {course.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/68">{course.description}</p>
            </span>

            <span className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Open course</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#f6d46b] transition duration-500 group-hover/course:translate-x-1 group-hover/course:bg-[#D4AF37] group-hover/course:text-[#071b17]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

const testimonials = [
  {
    name: "Ayesha R.",
    country: "United States",
    quote: "The classes are well-organized and easy for children to follow. We have seen noticeable improvement in Quran reading. The teaching approach is calm and the progress is consistent."
  },
  {
    name: "Tariq M.",
    country: "United Kingdom",
    quote: "The teaching style is calm and clear. The online classes are convenient and comfortable for our schedule. Timings were arranged very cooperatively."
  },
  {
    name: "Nadia S.",
    country: "United Arab Emirates",
    quote: "We were looking for structured Tajweed learning and the classes have been very helpful. A sincere and reliable teacher who genuinely cares about student progress."
  }
];

const whyChooseUs = [
  {
    label: "Personalized one-on-one sessions",
    desc: "Every class is dedicated entirely to one student, ensuring focused attention and steady progress.",
    icon: UserRound
  },
  {
    label: "Calm and supportive teaching style",
    desc: "A patient, encouraging environment where students build confidence gradually and without pressure.",
    icon: GraduationCap
  },
  {
    label: "Flexible schedules for families",
    desc: "Class timings are arranged around your routine — mornings, evenings, or weekends as needed.",
    icon: Clock3
  },
  {
    label: "Focus on proper Tajweed",
    desc: "Correct pronunciation and recitation rules are taught from the very beginning and reinforced consistently.",
    icon: BookOpen
  },
  {
    label: "Suitable for children and adults",
    desc: "Programs are designed for all levels — beginners, children, adults, and those returning to Quran.",
    icon: BadgeCheck
  },
  {
    label: "Online classes from home",
    desc: "Learn comfortably through Microsoft Teams or Zoom. No travel, no disruption to your daily life.",
    icon: Shield
  }
];

type FormState = {
  success: boolean;
  message: string;
};

type ContactTrialSectionProps = {
  register: UseFormRegister<InquiryInput>;
  handleSubmit: UseFormHandleSubmit<InquiryInput>;
  onSubmit: (values: InquiryInput) => void;
  errors: FieldErrors<InquiryInput>;
  isPending: boolean;
  formState: FormState;
};

const trialFormFields: Array<{
  name: keyof Omit<InquiryInput, "message">;
  label: string;
  placeholder: string;
  type?: string;
  icon: ElementType;
}> = [
  { name: "parentName", label: "Parent Name", placeholder: "Enter parent name", icon: UserRound },
  { name: "parentEmail", label: "Parent Email", placeholder: "name@example.com", type: "email", icon: Mail },
  { name: "childAge", label: "Child Age", placeholder: "e.g. 8 years", icon: UserRound },
  { name: "country", label: "Country", placeholder: "United States", icon: Globe },
  { name: "whatsapp", label: "WhatsApp Number", placeholder: "+1 555 000 0000", icon: Phone },
  { name: "preferredTime", label: "Preferred Time", placeholder: "Evening after 6 PM", icon: Clock3 }
];

const contactRows = [
  { icon: MessageCircle, label: "WhatsApp", value: "0315-5511179" },
  { icon: Mail, label: "Email", value: "info@hafizkamranacademy.com" },
  { icon: Globe, label: "Platform", value: "Microsoft Teams / Zoom" },
  { icon: LayoutDashboard, label: "Teams ID", value: "tajveed.quran5" },
  { icon: ShieldCheck, label: "Location", value: "Rawalpindi, Pakistan" }
];

function AdminAuthStatus({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { data: session, status } = useSession();
  const adminName = session?.user?.name || session?.user?.email || "Admin";

  if (status === "loading") {
    return <div className={mobile ? "h-12 rounded-2xl bg-white/10" : "h-10 w-28 rounded-full bg-white/10"} aria-hidden="true" />;
  }

  if (!session?.user) {
    return (
      <Button asChild variant={mobile ? "gold" : "outline"} className={mobile ? "h-12 w-full rounded-2xl text-base font-semibold" : ""}>
        <a href="/admin/login" onClick={onNavigate}>
          <LogIn className="h-4 w-4" />
          Sign In
        </a>
      </Button>
    );
  }

  if (mobile) {
    return (
      <div className="mt-6 rounded-2xl border border-white/15 bg-black/20 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-white">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4AF37] text-[#111827]">
            <UserRound className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{adminName}</span>
            <span className="text-xs text-white/55">Signed in as admin</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button asChild variant="gold" className="h-11 rounded-xl text-sm">
            <a href="/admin" onClick={onNavigate}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-white/20 bg-white/10 text-sm text-white hover:bg-white/20"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/admin"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur transition hover:border-[#D4AF37]/50 hover:bg-white/15"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#D4AF37] text-[#111827]">
          <UserRound className="h-4 w-4" />
        </span>
        <span className="hidden lg:inline max-w-28 truncate">{adminName}</span>
      </a>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden lg:flex border-white/20 bg-white/10 text-white hover:bg-white/20"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}

export function ContactTrialSection({ register, handleSubmit, onSubmit, errors, isPending, formState }: ContactTrialSectionProps) {
  return (
    <section
      id="contact"
      className="reveal relative isolate overflow-hidden bg-[radial-gradient(circle_at_8%_12%,rgba(16,185,129,0.2),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(212,175,55,0.16),transparent_24%),linear-gradient(135deg,#010f0d_0%,#03251f_46%,#020806_100%)] px-6 py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.85)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-16 h-96 w-96 rounded-full bg-teal-300/12 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#D4AF37]">Get in Touch</p>
            <h3 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Book Your Free Trial</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Share a few details and we will arrange a trial class at a time that suits you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {trialFormFields.map((field) => {
                const Icon = field.icon;
                const errorMessage = errors[field.name]?.message;

                return (
                  <div key={field.name} className="space-y-2">
                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]" />
                      <Input
                        id={field.name}
                        type={field.type ?? "text"}
                        aria-invalid={errorMessage ? "true" : "false"}
                        className="h-12 border-white/10 bg-black/20 pl-11 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-white/35 transition duration-300 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/25"
                        placeholder={field.placeholder}
                        {...register(field.name)}
                      />
                    </div>
                    {errorMessage ? <p className="text-xs text-red-300">{errorMessage}</p> : null}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                Message
              </label>
              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[#D4AF37]" />
                <Textarea
                  id="message"
                  aria-invalid={errors.message ? "true" : "false"}
                  className="min-h-[132px] border-white/10 bg-black/20 pl-11 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-white/35 transition duration-300 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/25"
                  placeholder="Tell us about current Quran reading level or preferred class goals"
                  {...register("message")}
                />
              </div>
              {errors.message ? <p className="text-xs text-red-300">{errors.message.message}</p> : null}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#10b981,#0d9488)] text-base text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_55px_rgba(20,184,166,0.38)] focus-visible:ring-emerald-300"
            >
              <span>{isPending ? "Submitting..." : "Send Inquiry"}</span>
              {isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/58">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>We respond within 10 minutes on WhatsApp.</span>
            </div>

            {formState.message ? (
              <p className={`rounded-2xl border px-4 py-3 text-sm ${formState.success ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : "border-red-300/20 bg-red-400/10 text-red-200"}`}>
                {formState.message}
              </p>
            ) : null}
          </form>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/18 bg-[linear-gradient(145deg,rgba(6,78,59,0.96),rgba(13,148,136,0.72)_58%,rgba(2,20,17,0.96))] p-6 text-white shadow-2xl shadow-black/35 sm:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#D4AF37]/18 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(135deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/10 p-2 pr-5 shadow-xl shadow-black/15 backdrop-blur-xl">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-[#D4AF37]/70 bg-white/80">
                <Image
                  src="/teacher-kamran-herosection.png"
                  alt="Hafiz Kamran"
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_12%]"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">Hafiz Kamran</p>
                  <BadgeCheck className="h-4 w-4 fill-[#D4AF37] text-[#05251f]" />
                </div>
                <p className="text-xs text-white/65">Quran Teacher · Rawalpindi, Pakistan</p>
              </div>
            </div>

            <h3 className="mt-9 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">Contact Information</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/68">
              Reach out through any channel below. Classes can be arranged at a time that suits your schedule.
            </p>

            <div className="mt-7 space-y-3">
              {contactRows.map((row) => {
                const RowIcon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-xl">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                      <RowIcon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-white/45">{row.label}</span>
                      <span className="text-sm font-medium text-white/90">{row.value}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <a
                href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click", { source: "contact_info_card" })}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,211,102,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(37,211,102,0.38)]"
              >
                <MessageCircle className="h-5 w-5" />
                Open WhatsApp Chat
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!dismissed) setShowPopup(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [dismissed]);

  useEffect(() => {
    if (!showPopup) return;
    const t = setTimeout(() => setShowPopup(false), 5500);
    return () => clearTimeout(t);
  }, [showPopup]);

  const waLink = buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 lg:bottom-8 lg:right-6">
      {/* Popup */}
      <AnimatePresence>
        {showPopup && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94, transition: { duration: 0.22 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[17.5rem] overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[rgba(4,25,22,0.92)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,175,55,0.08),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl"
          >
            {/* Ambient glow top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.16),transparent_70%)]" />
            {/* Close button */}
            <button
              onClick={() => { setShowPopup(false); setDismissed(true); }}
              className="absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/40 transition hover:bg-white/20 hover:text-white/80"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="relative p-5">
              {/* Bismillah */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                <span
                  style={{ fontFamily: "var(--font-amiri, 'Amiri', serif)" }}
                  className="text-[15px] leading-none text-[#D4AF37]/90"
                >
                  بِسْمِ اللهِ
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
              </div>
              {/* Text */}
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Online Quran Classes</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-white">
                Begin Your Quran Learning Journey
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                Book a trial class with Hafiz Kamran. Personalized, one-on-one sessions for all levels.
              </p>
              {/* CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => { trackEvent("whatsapp_click", { source: "floating_popup" }); setShowPopup(false); }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.28)] transition hover:brightness-110 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <div className="relative">
        {/* Pulse rings */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.78, 1.78], opacity: [0.36, 0, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.52, 1.52], opacity: [0.26, 0, 0] }}
          transition={{ duration: 2.6, delay: 0.9, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          onClick={() => trackEvent("whatsapp_click", { source: "floating_button" })}
          className="relative grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#25D366] text-white shadow-[0_8px_32px_rgba(37,211,102,0.42),0_0_0_3px_rgba(37,211,102,0.12)] transition-shadow duration-300 hover:shadow-[0_12px_44px_rgba(37,211,102,0.62)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      </div>
    </div>
  );
}

export function AcademyPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [courseIndex, setCourseIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>({ success: false, message: "" });
  const heroRef = useRef<HTMLDivElement | null>(null);
  const coursesScrollRef = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      childAge: "",
      country: "",
      whatsapp: "",
      preferredTime: "",
      message: ""
    }
  });

  useEffect(() => {
    const scrollHandler = () => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 20);
      setShowBackTop(y > 600);
      setProgress(height > 0 ? (y / height) * 100 : 0);
    };

    scrollHandler();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    if (!heroRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const revealSections = gsap.utils.toArray<HTMLElement>(".reveal");

      revealSections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: index === 0 ? 0.05 : 0,
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 60%",
              toggleActions: "play none none none"
            }
          }
        );

        const revealItems = section.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (revealItems.length > 0) {
          gsap.fromTo(
            revealItems,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      });

      if (!isMobileViewport) {
        gsap.utils.toArray<HTMLElement>("[data-parallax='soft']").forEach((el) => {
          gsap.to(el, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax='deep']").forEach((el) => {
          gsap.to(el, {
            yPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6
            }
          });
        });
      }

      const floatingOrbs = gsap.utils.toArray<HTMLElement>(".floating-orb");
      if (floatingOrbs.length > 0) {
        gsap.to(floatingOrbs, {
          y: -18,
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: "sine.inOut"
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const el = coursesScrollRef.current;
    if (!el) return;
    let isPaused = false;
    const pause = () => { isPaused = true; };
    const resume = () => { setTimeout(() => { isPaused = false; }, 2500); };
    const onScroll = () => {
      const cardWidth = Math.round(el.clientWidth * 0.88) + 20;
      const idx = Math.min(Math.round(el.scrollLeft / cardWidth), courses.length - 1);
      setCourseIndex(idx);
    };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    const timer = setInterval(() => {
      if (isPaused || window.innerWidth >= 768) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 40;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: Math.round(el.clientWidth * 0.88), behavior: "smooth" });
      }
    }, 3500);
    return () => {
      clearInterval(timer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onSubmit = (values: InquiryInput) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/trial-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        const result = (await response.json()) as FormState;
        setFormState(result);
        if (response.ok && result.success) {
          reset();
          trackEvent("contact_form_submit", { source: "contact_section" });
        }
      } catch {
        setFormState({ success: false, message: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <>
      <PageLoader />
      <div className="fixed left-0 top-0 z-[70] h-1 bg-[linear-gradient(90deg,#D4AF37,#0F766E)]" style={{ width: `${progress}%` }} />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "mx-auto mt-2 w-[94%] rounded-2xl border border-[#D4AF37]/25 bg-[linear-gradient(120deg,rgba(2,19,17,0.82),rgba(6,78,59,0.65))] py-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            : "bg-transparent py-3"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37]/35 bg-[linear-gradient(135deg,#0F766E,#064E3B)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <MoonStar className="h-5 w-5" />
            </div>
            <p className="max-w-[160px] text-xs font-semibold leading-tight text-white sm:max-w-none sm:text-sm md:block">Hafiz Kamran Quran Academy</p>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/85 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative pb-1 transition-colors duration-300 hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
            {/* Quran Library link */}
            <Link
              href="/quran-library"
              className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10
                         px-4 py-1.5 text-[#D4AF37] transition-all duration-200
                         hover:bg-[#D4AF37]/20 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Quran Library
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <AdminAuthStatus />
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              className="group grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur transition active:scale-95 lg:hidden"
            >
              <span className="relative h-4 w-5">
                <span className="absolute top-0 block h-0.5 w-5 rounded-full bg-white transition-transform duration-300 group-active:scale-x-90" />
                <span className="absolute top-[7px] block h-0.5 w-5 rounded-full bg-white transition-transform duration-300 group-active:scale-x-75" />
                <span className="absolute top-[14px] block h-0.5 w-5 rounded-full bg-white transition-transform duration-300 group-active:scale-x-90" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.36),rgba(2,19,17,0.96))] p-4 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="mx-auto flex h-full w-full max-w-md flex-col overflow-y-auto rounded-[28px] border border-white/20 bg-[linear-gradient(155deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-[0.18em] text-white/80">NAVIGATION</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close mobile menu"
                  className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-2">
                {navItems.map((item, idx) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx + 0.1 }}
                    className="rounded-2xl border border-white/15 bg-black/20 px-4 py-4 text-lg font-medium text-white transition active:scale-[0.98]"
                  >
                    {item}
                  </motion.a>
                ))}
                {/* Quran Library mobile link */}
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * navItems.length + 0.1 }}
                >
                  <Link
                    href="/quran-library"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30
                               bg-[#D4AF37]/8 px-4 py-4 text-lg font-medium text-[#D4AF37]
                               transition active:scale-[0.98]"
                  >
                    <BookOpen className="h-5 w-5" />
                    Quran Library
                  </Link>
                </motion.div>
              </div>
              <AdminAuthStatus mobile onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main
        ref={heroRef}
        className="overflow-x-hidden bg-[radial-gradient(circle_at_top,#0a2f2a_0%,#051a17_45%,#020b0a_100%)] text-white"
      >
        {/* Ambient floating particles */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {[
            { top: "18%", left: "6%", size: "h-72 w-72", color: "bg-emerald-600/6", delay: "0s" },
            { top: "55%", left: "82%", size: "h-56 w-56", color: "bg-[#D4AF37]/5", delay: "2s" },
            { top: "75%", left: "14%", size: "h-48 w-48", color: "bg-emerald-800/7", delay: "1s" },
            { top: "35%", left: "60%", size: "h-64 w-64", color: "bg-[#D4AF37]/4", delay: "3s" },
          ].map((orb, i) => (
            <div
              key={i}
              className={`floating-orb absolute rounded-full blur-3xl ${orb.size} ${orb.color}`}
              style={{ top: orb.top, left: orb.left, animationDelay: orb.delay }}
            />
          ))}
        </div>
        <CinematicHero />

        {/* ── About ── */}
        <section id="about" className="reveal px-6 py-16 lg:py-24">
          <div
            data-reveal-item
            className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-[#D4AF37]/28 bg-[linear-gradient(120deg,#052a27,#07312d_42%,#0a3f39)] shadow-[0_28px_80px_rgba(0,0,0,0.45)] lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div className="relative z-10 p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">About Hafiz Kamran</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#f6f2e9] sm:text-4xl">A Calm &amp; Personalized<br className="hidden sm:block" /> Learning Experience</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#d9e6e0]">
                Hafiz Kamran Hameed provides one-on-one online Quran classes focused on correct pronunciation, understanding, and consistent learning. Classes are designed according to each student&apos;s level and learning pace, creating a comfortable environment for both children and adults.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Individual attention in every class",
                  "Flexible class timings for all time zones",
                  "Tajweed-focused from the first lesson",
                  "Friendly, encouraging teaching approach"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[#f3f8f5]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-snug sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[360px] lg:min-h-[520px]" data-parallax="deep">
              <Image
                src="/about-img.png"
                alt="Hafiz Kamran Hameed"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
                className="object-cover object-[50%_22%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,39,35,0.86)_0%,rgba(4,39,35,0.45)_28%,rgba(4,39,35,0.06)_54%,rgba(4,39,35,0)_100%)]" />
            </div>
          </div>
        </section>

        {/* ── Courses ── */}
        <section id="courses" className="reveal relative isolate overflow-hidden bg-[radial-gradient(circle_at_18%_10%,rgba(212,175,55,0.16),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(20,184,166,0.14),transparent_32%),linear-gradient(180deg,#021311,#052a25_44%,#02110f)] px-0 py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(30deg,rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.58)_1px,transparent_1px)] [background-position:0_0,16px_16px] [background-size:32px_32px]" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-[#D4AF37]/45 shadow-[0_0_16px_rgba(212,175,55,0.75)]"
                style={{ left: `${(i * 17) % 100}%`, top: `${12 + ((i * 29) % 78)}%` }}
                animate={{ y: [0, -22, 0], opacity: [0.18, 0.74, 0.18] }}
                transition={{ duration: 4.5 + (i % 5), delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <motion.div
              data-reveal-item
              className="mb-10 max-w-3xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Courses Offered</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">Structured Quran Learning Programs</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/64">
                Designed for beginners, children, and adults at every level of Quran learning.
              </p>
            </motion.div>
            <div ref={coursesScrollRef} className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {courses.map((course, index) => (
                <PremiumCourseCard key={course.slug} course={course} index={index} />
              ))}
            </div>

            {/* ── Mobile carousel controls ── */}
            <div className="mt-4 flex items-center justify-between md:hidden">
              <button
                onClick={() => {
                  const el = coursesScrollRef.current;
                  if (!el) return;
                  if (el.scrollLeft <= 10) {
                    el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
                  } else {
                    el.scrollBy({ left: -Math.round(el.clientWidth * 0.88), behavior: "smooth" });
                  }
                }}
                aria-label="Previous course"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white/70 transition-all active:scale-90 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {courses.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const el = coursesScrollRef.current;
                      if (!el) return;
                      el.scrollTo({ left: Math.round(el.clientWidth * 0.88 + 20) * i, behavior: "smooth" });
                    }}
                    className={`rounded-full transition-all duration-300 ${i === courseIndex ? "h-2 w-5 bg-[#D4AF37]" : "h-1.5 w-1.5 bg-white/25 hover:bg-white/50"}`}
                    aria-label={`Go to course ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  const el = coursesScrollRef.current;
                  if (!el) return;
                  const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 40;
                  if (atEnd) {
                    el.scrollTo({ left: 0, behavior: "smooth" });
                  } else {
                    el.scrollBy({ left: Math.round(el.clientWidth * 0.88), behavior: "smooth" });
                  }
                }}
                aria-label="Next course"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/12 text-[#D4AF37] transition-all active:scale-90 hover:bg-[#D4AF37]/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Why Learn With Us ── */}
        <section className="reveal mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">Your Advantage</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Why Families Choose Our Online Classes</h2>
            <div className="mx-auto mt-4 flex w-24 items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#D4AF37]/50" />
              <span className="text-sm text-[#D4AF37]">✦</span>
              <span className="h-px w-8 bg-[#D4AF37]/50" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map(({ label, desc, icon: Icon }) => (
              <TiltCard key={label}>
                <div
                  data-reveal-item
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/35 hover:shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.11),transparent_60%)]" />
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="reveal bg-[linear-gradient(180deg,#f7f2e8,#efe1c6)] px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B8891C]">Feedback</p>
              <h2 className="mt-3 text-3xl font-bold text-[#112320] sm:text-4xl">Parent &amp; Student Feedback</h2>
              <div className="mx-auto mt-4 flex w-24 items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#C79C2F]/70" />
                <span className="text-sm text-[#C79C2F]">✦</span>
                <span className="h-px w-8 bg-[#C79C2F]/70" />
              </div>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((item) => (
                  <div key={item.name} className="min-w-0 flex-[0_0_100%] px-3 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                    <Card data-reveal-item className="group relative h-full overflow-hidden border-[#ccb789]/45 bg-white/70 shadow-[0_14px_40px_rgba(20,20,20,0.12)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_22px_54px_rgba(20,20,20,0.18)]">
                      <CardContent className="relative">
                        <span className="pointer-events-none absolute -top-2 right-4 select-none font-serif text-7xl leading-none text-[#D4AF37]/18">&ldquo;</span>
                        <div className="mb-3 flex gap-0.5 text-[#D4AF37]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-[#213532]">{item.quote}</p>
                        <div className="mt-5 flex items-center gap-3 border-t border-[#ccb789]/30 pt-4">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D4AF37]/18 text-sm font-bold text-[#8a5c00]">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#132725]">{item.name}</p>
                            <p className="flex items-center gap-1 text-xs text-[#4c625f]">
                              <Globe className="h-3 w-3" /> {item.country}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact CTA ── */}
        <section className="reveal relative overflow-hidden px-6 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,78,59,0.94),rgba(15,118,110,0.88))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(135deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center text-white">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <BookOpen className="h-4 w-4" />
              Free Trial Class
            </div>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Start with a Trial Class
            </h2>
            <p className="max-w-xl text-white/78 text-base leading-relaxed">
              A trial class allows students and parents to understand the teaching style, class structure, and learning environment before starting regular sessions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,118,110,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#0b5f58]"
              >
                <ArrowRight className="h-4 w-4" /> Schedule Trial Class
              </a>
              <a
                href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click", { source: "cta_section" })}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/18 hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" /> Contact on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── Quran Library ── */}
        <section className="reveal mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/22 bg-[linear-gradient(135deg,rgba(6,78,59,0.88),rgba(15,118,110,0.72)_54%,rgba(2,20,17,0.9))] p-8 sm:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(135deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/18 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f7d978]">Resources</p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Digital Quran Library</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/72">
                  Access Quran reading material and Tajweed resources for online learning and practice during classes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/quran-library"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-5 py-3 text-sm font-semibold text-[#f7d978] transition hover:bg-[#D4AF37]/25"
                >
                  <BookOpen className="h-4 w-4" /> Read Online
                </Link>
                <Link
                  href="/quran-library"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
                >
                  <ArrowRight className="h-4 w-4" /> Download PDF
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="reveal mx-auto max-w-3xl px-6 py-10 lg:py-16">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">Questions</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Frequently Asked Questions</h2>
            <div className="mx-auto mt-4 flex w-24 items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#D4AF37]/50" />
              <span className="text-sm text-[#D4AF37]">✦</span>
              <span className="h-px w-8 bg-[#D4AF37]/50" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is the trial class free?", a: "Yes, a trial class can be arranged before regular classes begin. It gives students and parents a chance to understand the teaching style and class structure." },
              { q: "Are classes available for adults?", a: "Yes, classes are available for both children and adults at all levels, from complete beginners to those looking to improve their Tajweed." },
              { q: "Which platform is used for classes?", a: "Classes can be conducted through Microsoft Teams, Zoom, or WhatsApp depending on what is most convenient for the student." },
              { q: "Are class timings flexible?", a: "Class schedules are arranged according to mutual availability. Morning, evening, and weekend slots are all possible." },
              { q: "How do I get started?", a: "Simply reach out through WhatsApp or the inquiry form below. A trial class will be arranged at a convenient time." }
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-1 backdrop-blur-md open:bg-white/[0.07]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-white/90 marker:hidden">
                  {q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white/60 transition-transform duration-300 group-open:rotate-45">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-white/62">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <ContactTrialSection
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isPending={isPending}
          formState={formState}
        />

        {/* ── Footer ── */}
        <footer id="footer" className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(15,118,110,0.32),transparent_35%),linear-gradient(180deg,#01100f,#021311)] px-6 py-14 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.12),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-[#D4AF37]/35 bg-[linear-gradient(135deg,#0F766E,#064E3B)] text-white shadow-lg">
                  <MoonStar className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">Hafiz Kamran Quran Academy</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Online Quran classes with Tajweed for children and adults. Personalized learning in a calm and supportive environment.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "footer" })}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/8 text-white/70 transition hover:bg-[#25D366]/20 hover:text-[#25D366]"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/8 text-white/70 transition hover:bg-[#0F766E]/20 hover:text-emerald-300"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Nav Links */}
            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Quick Links</h5>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {navItems.map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#D4AF37]">
                      <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/quran-library" className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#D4AF37]">
                    <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
                    Quran Library
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact + Ayah */}
            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Contact</h5>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#25D366]">
                    WhatsApp: +{siteConfig.whatsapp}
                  </a>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-white/[0.05] px-4 py-4">
                <p className="text-base leading-loose text-[#f6e8b8] font-[family-name:var(--font-amiri)]" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
                <p className="mt-1 text-xs text-white/50">Surah Al-Muzzammil 73:4</p>
              </div>
            </div>
          </div>
          <p className="relative mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-sm text-white/45">
            © {new Date().getFullYear()} Hafiz Kamran Hameed Quran Academy. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Floating email */}
      <a
        href={`mailto:${siteConfig.email}`}
        aria-label="Send email"
        className="fixed bottom-40 right-6 z-40 hidden h-12 w-12 place-items-center rounded-full border border-white/20 bg-[#0F766E] text-white shadow-xl transition-transform duration-300 hover:scale-105 lg:grid"
      >
        <Mail className="h-5 w-5" />
      </a>

      {/* Back to top */}
      {showBackTop ? (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-8 left-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-white text-[#0F766E] shadow-xl transition hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}

    </>
  );
}
