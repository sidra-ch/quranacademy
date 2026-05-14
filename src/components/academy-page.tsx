"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";
import useEmblaCarousel from "embla-carousel-react";
import * as Accordion from "@radix-ui/react-accordion";
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
  ChevronDown,
  Clock3,
  Globe,
  GraduationCap,
  Hand,
  Languages,
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

const navItems = ["Home", "About", "Courses", "Testimonials", "Pricing", "FAQ", "Contact"];

const counters = [
  { label: "Years Experience", value: 10, suffix: "+" },
  { label: "Students", value: 500, suffix: "+" },
  { label: "Countries", value: 15, suffix: "+" },
  { label: "One-on-One Classes", value: 1, suffix: "-on-1" }
];

const courses = [
  {
    title: "Noorani Qaida",
    icon: BookOpen,
    iconFront: "text-[#0E5A52]",
    iconBack: "text-[#C79C2F]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f8f2e6)]"
  },
  {
    title: "Nazra Quran with Tajweed",
    icon: GraduationCap,
    iconFront: "text-[#1F6D62]",
    iconBack: "text-[#D6A843]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffdf8,#f6efe1)]"
  },
  {
    title: "Hifz-ul-Quran Support",
    icon: BookMarked,
    iconFront: "text-[#0D665B]",
    iconBack: "text-[#BE9026]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f7f0e3)]"
  },
  {
    title: "Translation & Tafseer",
    icon: Languages,
    iconFront: "text-[#0F5B51]",
    iconBack: "text-[#D5A237]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f8efe1)]"
  },
  {
    title: "Masnoon Duas",
    icon: Hand,
    iconFront: "text-[#0F6258]",
    iconBack: "text-[#C99A2F]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefb,#f7f1e5)]"
  },
  {
    title: "Basic Islamic Teachings",
    icon: UserRound,
    iconFront: "text-[#0F6D62]",
    iconBack: "text-[#CFA236]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f6efe2)]"
  },
  {
    title: "Namaz Training",
    icon: Building2,
    iconFront: "text-[#0F5F54]",
    iconBack: "text-[#C2942B]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f7efe2)]"
  },
  {
    title: "Islamic Studies",
    icon: Shield,
    iconFront: "text-[#0B5A50]",
    iconBack: "text-[#D2A73D]/90",
    iconBg: "bg-[linear-gradient(180deg,#fffefc,#f8f1e5)]"
  }
];

const whyUs = [
  "Child-friendly teaching",
  "One-on-one classes",
  "Flexible timings",
  "Monthly progress reports",
  "Affordable plans",
  "International students welcome",
  "Free trial class"
];

const howItWorks = ["Book Trial", "Assessment", "Schedule Selection", "Start Learning"];

const testimonials = [
  {
    name: "Ayesha Khan",
    country: "USA",
    quote: "My son started from basics and now reads Quran with confidence. Hafiz Kamran sahib is very gentle and professional."
  },
  {
    name: "Muhammad Ali",
    country: "UK",
    quote: "Class structure is excellent, timings are flexible, and monthly progress reports keep us fully informed."
  },
  {
    name: "Fatima Noor",
    country: "UAE",
    quote: "As revert parents, we wanted a trustworthy teacher. We found warmth, patience, and proper Tajweed training here."
  }
];

const faqItems = [
  {
    q: "Is there a free trial class?",
    a: "Yes, every student gets a free trial class to understand the teaching style and class flow before enrolling."
  },
  {
    q: "Are classes one-on-one or in groups?",
    a: "We primarily offer one-on-one live classes for focused learning and better progress tracking."
  },
  {
    q: "What ages do you teach?",
    a: "We teach children 4+ years, teenagers, adults, beginners, and reverts."
  },
  {
    q: "Which countries do you serve?",
    a: "We teach globally including USA, UK, Canada, Australia, UAE, and Saudi Arabia."
  }
];

const pricing = [
  { plan: "Starter", amount: "$39", features: ["2 classes/week", "Basic Tajweed", "Monthly report"], highlight: false },
  {
    plan: "Standard",
    amount: "$69",
    features: ["4 classes/week", "Tajweed + Nazra", "Priority support", "Detailed progress report"],
    highlight: true
  },
  { plan: "Weekend", amount: "$29", features: ["Weekend only", "Beginner support", "Flexible slots"], highlight: false }
];

const countries = [
  { name: "USA", code: "US", subtitle: "North America" },
  { name: "UK", code: "GB", subtitle: "Europe" },
  { name: "Canada", code: "CA", subtitle: "North America" },
  { name: "Australia", code: "AU", subtitle: "Oceania" },
  { name: "UAE", code: "AE", subtitle: "Middle East" },
  { name: "Saudi Arabia", code: "SA", subtitle: "Middle East" }
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
  { icon: MessageCircle, label: "WhatsApp", value: "+92 315 5511179" },
  { icon: Mail, label: "Email", value: "info@hafizkamranacademy.com" },
  { icon: Globe, label: "Classroom", value: "Online via Teams / Zoom" },
  { icon: ShieldCheck, label: "Availability", value: "Daily flexible slots" }
];

const learningHighlights = ["Available 24/7", "1-on-1 Sessions", "Free Trial Class", "Safe & Secure Learning"];

function CountryLandmarkIcon({ code }: { code: string }) {
  const palette: Record<string, { primary: string; accent: string; sky: string }> = {
    US: { primary: "#dbeafe", accent: "#60a5fa", sky: "#172554" },
    GB: { primary: "#fee2e2", accent: "#f87171", sky: "#450a0a" },
    CA: { primary: "#fef2f2", accent: "#ef4444", sky: "#3f0b0b" },
    AU: { primary: "#dcfce7", accent: "#22c55e", sky: "#052e16" },
    AE: { primary: "#fef3c7", accent: "#10b981", sky: "#064e3b" },
    SA: { primary: "#ecfdf5", accent: "#34d399", sky: "#022c22" }
  };
  const colors = palette[code] ?? palette.US;

  return (
    <svg viewBox="0 0 96 96" role="img" aria-label={`${code} capital landmark`} className="h-full w-full">
      <rect width="96" height="96" rx="24" fill={colors.sky} />
      <circle cx="72" cy="24" r="12" fill={colors.accent} opacity="0.28" />
      <path d="M18 74H78" stroke={colors.primary} strokeWidth="4" strokeLinecap="round" opacity="0.85" />

      {code === "US" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 74V43H68V74" strokeWidth="4" />
          <path d="M24 43H72L48 30 24 43Z" fill={colors.accent} strokeWidth="3" />
          <path d="M34 50V68M43 50V68M52 50V68M61 50V68" strokeWidth="3" />
        </g>
      ) : null}

      {code === "GB" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M35 74V32H58V74" strokeWidth="4" />
          <path d="M31 32H62" strokeWidth="4" />
          <circle cx="46.5" cy="47" r="7" fill={colors.accent} strokeWidth="3" />
          <path d="M64 74V46H74V74" strokeWidth="4" />
          <path d="M69 38V46" strokeWidth="4" />
        </g>
      ) : null}

      {code === "CA" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 74V47H72V74" strokeWidth="4" />
          <path d="M30 47L48 32L66 47" fill={colors.accent} strokeWidth="3" />
          <path d="M39 54V68M48 54V68M57 54V68" strokeWidth="3" />
          <path d="M48 22V32" strokeWidth="4" />
        </g>
      ) : null}

      {code === "AU" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M25 74H71" strokeWidth="4" />
          <path d="M32 64C38 42 58 42 64 64" strokeWidth="4" />
          <path d="M36 64C41 52 55 52 60 64" stroke={colors.accent} strokeWidth="4" />
          <path d="M48 30V74" strokeWidth="4" />
          <path d="M48 30C57 34 64 39 69 47" strokeWidth="3" />
        </g>
      ) : null}

      {code === "AE" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 74V49H72V74" strokeWidth="4" />
          <path d="M32 49C35 37 61 37 64 49" fill={colors.accent} strokeWidth="3" />
          <path d="M28 49V35M68 49V35" strokeWidth="4" />
          <path d="M28 35L24 42M68 35L72 42" strokeWidth="3" />
          <path d="M41 58V74M55 58V74" strokeWidth="3" />
        </g>
      ) : null}

      {code === "SA" ? (
        <g fill="none" stroke={colors.primary} strokeLinecap="round" strokeLinejoin="round">
          <path d="M27 74V48H69V74" strokeWidth="4" />
          <path d="M34 48C36 38 60 38 62 48" fill={colors.accent} strokeWidth="3" />
          <path d="M48 28V74" strokeWidth="4" />
          <path d="M38 36H58" strokeWidth="3" />
          <path d="M35 58H61" strokeWidth="3" />
        </g>
      ) : null}
    </svg>
  );
}

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
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#D4AF37]">Free Trial Class</p>
            <h3 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Book Free Trial Class</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Share a few details and we will recommend the best Quran learning schedule for your child.
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
                <p className="text-xs text-white/65">Online Quran Teacher</p>
              </div>
            </div>

            <h3 className="mt-9 text-3xl font-bold tracking-[-0.02em]">Contact Information</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/72">Trusted by families worldwide for focused Quran learning, tajweed correction, and gentle student support.</p>

            <div className="mt-7 space-y-3">
              {contactRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-3 backdrop-blur-xl">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.16em] text-white/45">{row.label}</span>
                      <span className="text-sm font-medium text-white/90">{row.value}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {learningHighlights.map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-3 text-sm text-white/82 backdrop-blur-xl">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {[
                { value: "4.9", label: "Rating", icon: Star },
                { value: "500+", label: "Families", icon: UserRound },
                { value: "Worldwide", label: "Students", icon: Globe }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl bg-white/[0.07] p-3 text-center backdrop-blur-xl">
                    <Icon className="mx-auto mb-2 h-4 w-4 text-[#D4AF37]" />
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="mt-1 text-[11px] text-white/50">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function AcademyPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>({ success: false, message: "" });
  const heroRef = useRef<HTMLDivElement | null>(null);
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
      setShowBackTop(y > 500);
      setProgress(height > 0 ? (y / height) * 100 : 0);
    };

    scrollHandler();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowWhatsAppPopup(true), 9000);

    const exitIntent = (event: MouseEvent) => {
      if (event.clientY < 10) {
        setShowWhatsAppPopup(true);
      }
    };

    document.addEventListener("mouseout", exitIntent);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseout", exitIntent);
    };
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
              start: "top 88%",
              end: "top 55%",
              toggleActions: "play none none reverse"
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
                start: "top 84%",
                toggleActions: "play none none reverse"
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

    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const onSubmit = (values: InquiryInput) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/trial-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values)
        });

        const result = (await response.json()) as FormState;
        setFormState(result);

        if (response.ok && result.success) {
          reset();
          trackEvent("contact_form_submit", { source: "contact_section" });
        }
      } catch (error) {
        console.error("Booking request failed", error);
        setFormState({
          success: false,
          message: "Something went wrong. Please try again."
        });
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
        <CinematicHero />

        <section className="reveal mx-auto -mt-10 max-w-6xl px-6" id="about">
          <div
            data-parallax="soft"
            className="grid gap-4 rounded-3xl border border-[#D4AF37]/20 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:grid-cols-4"
          >
            {counters.map((counter) => (
              <Card key={counter.label} data-reveal-item className="border border-white/10 bg-white/5">
                <CardContent>
                  <p className="text-3xl font-bold text-[#D4AF37]">
                    <CountUp end={counter.value} duration={3} />
                    {counter.suffix}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{counter.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="reveal px-6 py-16 lg:py-[4.5rem]">
          <div
            data-reveal-item
            className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-[#D4AF37]/28 bg-[linear-gradient(120deg,#052a27,#07312d_42%,#0a3f39)] shadow-[0_28px_80px_rgba(0,0,0,0.45)] lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div className="relative z-10 p-8 sm:p-10 lg:p-12">
              <h2 className="text-3xl font-semibold leading-tight text-[#f6f2e9] sm:text-4xl">About Teacher</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-[#d9e6e0]">
                Hafiz Kamran Hameed is a dedicated Quran educator and qualified Islamic scholar, known for structured Tajweed
                instruction, clear pronunciation coaching, and spiritually grounded mentoring for students across all age groups.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "10+ Years of Professional Quran Teaching Experience",
                  "Specialist in Tajweed, Nazra, and Foundational Islamic Studies",
                  "One-on-One Personalized Learning Plans with Progress Tracking",
                  "Trusted by Families in USA, UK, Canada, UAE, and Beyond"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[#f3f8f5]">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-base leading-snug sm:text-lg">{item}</span>
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
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(212,175,55,0.14),transparent_38%)]" />
            </div>
          </div>
        </section>

        <section id="courses" className="reveal relative overflow-hidden bg-[linear-gradient(180deg,#f8f5ee,#efe8d8)] px-6 py-16 lg:py-[4.5rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.07),transparent_42%)]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold text-[#173834] sm:text-5xl">Courses We Offer</h2>
              <div className="mx-auto mt-4 flex w-24 items-center justify-center gap-2 text-[#C79C2F]">
                <span className="h-px w-8 bg-[#C79C2F]/80" />
                <span className="text-sm">✧</span>
                <span className="h-px w-8 bg-[#C79C2F]/80" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => {
                const Icon = course.icon;
                return (
                <motion.div
                  data-reveal-item
                  key={course.title}
                  whileHover={{ y: -6 }}
                  className="group rounded-3xl border border-[#e8deca] bg-white p-6 text-center shadow-[0_10px_26px_rgba(23,56,52,0.09)]"
                >
                  <div className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[#e8deca] ${course.iconBg} shadow-[0_4px_10px_rgba(16,46,43,0.08)]`}>
                    <span className="relative grid place-items-center">
                      <Icon className={`absolute h-8 w-8 stroke-[2.1] ${course.iconBack} translate-x-[1px] translate-y-[1px]`} />
                      <Icon className={`relative h-8 w-8 stroke-[2.1] ${course.iconFront}`} />
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight text-[#203a37]">{course.title}</h3>
                </motion.div>
              )})}
            </div>
          </div>
        </section>

        <section className="reveal mx-auto max-w-7xl px-6 py-16 lg:py-[4.5rem]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Why Choose Us</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <Card key={item} data-reveal-item className="border-white/10 bg-white/5 backdrop-blur-md">
                <CardContent className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#D4AF37]" />
                  <p className="text-sm text-white/80">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="reveal bg-transparent px-6 py-16 lg:py-[4.5rem]">
          <div
            data-parallax="soft"
            className="mx-auto max-w-6xl rounded-3xl border border-[#D4AF37]/25 bg-[linear-gradient(120deg,rgba(6,78,59,0.85),rgba(15,118,110,0.72))] p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <h2 className="text-center text-3xl font-bold">How Classes Work</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {howItWorks.map((step, i) => (
                <div key={step} data-reveal-item className="relative rounded-2xl border border-white/20 bg-black/20 p-4 text-center backdrop-blur-md">
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#D4AF37] text-[#111827]">{i + 1}</div>
                  <p className="font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal mx-auto max-w-7xl px-6 py-16 lg:py-[4.5rem]">
          <div className="relative isolate overflow-hidden rounded-[34px] border border-[#D4AF37]/20 bg-[radial-gradient(circle_at_20%_42%,rgba(0,92,76,0.48),transparent_36%),linear-gradient(135deg,#001b17_0%,#002f29_48%,#00120f_100%)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:20px_20px]" />
            <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-emerald-500/16 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 top-10 h-44 w-44 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] xl:gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">LIVE CLASS PREVIEW</p>
                <h2 className="mt-5 max-w-[620px] text-3xl font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
                  A Real Online Class Experience for Every Child
                </h2>
                <p className="mt-5 max-w-[640px] text-base leading-8 text-white/78 sm:text-lg">
                  Student-focused one-on-one sessions with live tajweed correction, digital mushaf guidance, and personalized interaction exactly like a premium online class.
                </p>

                <div className="mt-8 max-w-[640px] rounded-[26px] border border-white/10 bg-white/[0.07] p-5 text-white shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
                  <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">AYAT ABOUT TILAWAH</p>
                  <p className="mt-5 pt-1 text-3xl leading-loose text-[#f6e8b8] sm:text-4xl font-[family-name:var(--font-amiri)]" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
                  <p className="mt-4 text-base font-medium leading-7 text-white/92 sm:text-lg">&quot;Aur Quran ko thehr thehr kar (tajweed ke sath) padho.&quot;</p>
                  <p className="mt-2 text-sm font-medium text-white/72 sm:text-base">Surah Al-Muzzammil 73:4</p>
                </div>
              </div>

              <div data-parallax="soft" data-reveal-item className="group relative">
                <div className="absolute -inset-2 rounded-[42px] bg-emerald-300/10 blur-xl transition duration-500 group-hover:bg-[#D4AF37]/14" />
                <div className="relative aspect-[1.44] min-h-[240px] overflow-hidden rounded-[28px] border-[7px] border-[#06483f] bg-[#05251f] shadow-2xl shadow-black/45 transition duration-500 group-hover:scale-[1.01] sm:min-h-[340px] lg:min-h-[430px] lg:rounded-[36px] lg:border-[10px]">
                  <Image
                    src="/live%20premium-img.png"
                    alt="Child attending a premium live Quran class with teacher on laptop and open Quran"
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 82vw, 640px"
                    loading="lazy"
                    className="origin-right object-cover object-[100%_50%] scale-[1.38]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,35,29,0.08),transparent_24%,rgba(0,0,0,0.08))]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="reveal bg-[linear-gradient(180deg,#f7f2e8,#efe1c6)] px-6 py-16 lg:py-[4.5rem]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-[#112320]">Parent Testimonials</h2>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((item) => (
                  <div key={item.name} className="min-w-0 flex-[0_0_100%] px-3 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                    <Card data-reveal-item className="h-full border-[#ccb789]/45 bg-white/70 shadow-[0_14px_40px_rgba(20,20,20,0.12)] backdrop-blur-xl">
                      <CardContent>
                        <div className="mb-3 flex gap-1 text-[#D4AF37]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm text-[#213532]">{item.quote}</p>
                        <p className="mt-4 font-semibold text-[#132725]">{item.name}</p>
                        <p className="text-xs text-[#4c625f]">{item.country}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="reveal mx-auto max-w-7xl px-6 py-16 lg:py-[4.5rem]">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_18%_12%,rgba(212,175,55,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(135deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="relative text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">Global Online Classes</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Countries We Serve</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Flexible Quran classes for families across time zones, with scheduling support for school routines and weekends.
              </p>
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <div
                  key={country.name}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-white shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:bg-white/[0.07]"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 shadow-inner">
                    <CountryLandmarkIcon code={country.code} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-white">{country.name}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs font-medium text-white/58">
                      <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
                      {country.subtitle}
                    </span>
                  </span>
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="reveal bg-transparent px-6 py-16 lg:py-[4.5rem]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-white">Simple Pricing Plans</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {pricing.map((item) => (
                <Card
                  data-reveal-item
                  key={item.plan}
                  className={`relative overflow-hidden border ${
                    item.highlight
                      ? "border-[#D4AF37] bg-[linear-gradient(145deg,rgba(212,175,55,0.15),rgba(15,118,110,0.15))] shadow-[0_20px_50px_rgba(212,175,55,0.22)]"
                      : "border-white/15 bg-white/5"
                  }`}
                >
                  {item.highlight ? (
                    <span className="absolute right-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-semibold text-[#111827]">
                      Recommended
                    </span>
                  ) : null}
                  <CardContent>
                    <p className="text-sm font-medium text-white/65">{item.plan}</p>
                    <p className="mt-3 text-4xl font-bold text-white">{item.amount}</p>
                    <div className="mt-5 space-y-2 text-sm text-white/75">
                      {item.features.map((feature) => (
                        <p key={feature} className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> {feature}
                        </p>
                      ))}
                    </div>
                    <Button asChild className="mt-6 w-full" variant={item.highlight ? "gold" : "default"}>
                      <a href="#contact">Choose Plan</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="reveal mx-auto max-w-4xl px-6 py-16 lg:py-[4.5rem]">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <Accordion.Item
                key={item.q}
                value={`item-${index}`}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-md"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between py-2 text-left font-medium text-white">
                    {item.q}
                    <ChevronDown className="h-4 w-4" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-2 text-sm text-white/70">{item.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </section>

        <section className="reveal relative overflow-hidden px-6 py-16 lg:py-[4.5rem]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,78,59,0.94),rgba(15,118,110,0.9))]" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] overflow-hidden lg:block">
            <Image
              src="/class-preview.jpeg"
              alt="Quran class journey"
              fill
              sizes="(max-width: 1280px) 38vw, 480px"
              loading="lazy"
              className="object-cover object-[58%_50%] opacity-30"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,39,33,0.95),rgba(7,39,33,0.3),rgba(7,39,33,0.9))]" />
          </div>
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 text-center text-white">
            <div className="flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">
              <div className="h-11 w-11 overflow-hidden rounded-full border border-[#D4AF37]/70 bg-white/80">
                <Image
                  src="/tajweed-img.png"
                  alt="Tajweed Mentor"
                  width={80}
                  height={80}
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_12%]"
                />
              </div>
              <p className="text-xs tracking-[0.2em] text-white/80">TAJWEED MENTOR</p>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Start Your Child&apos;s Quran Learning Journey Today</h2>
            <p className="max-w-2xl text-white/80">Build confidence, correct tajweed, and lasting connection with Quran through warm and structured live classes.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" variant="gold">
                <a
                  href={buildWhatsAppLink(siteConfig.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "final_cta" })}
                >
                  WhatsApp Now
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">Book Free Trial</a>
              </Button>
            </div>
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

        <footer
          className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(15,118,110,0.35),transparent_35%),linear-gradient(180deg,#01100f,#021311)] px-6 py-14 text-white"
          id="footer"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.15),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_1fr] lg:grid-cols-[1.25fr_1fr_1.05fr]">
            <div className="max-w-sm">
              <h4 className="font-semibold text-white">Hafiz Kamran Hameed Quran Academy</h4>
              <p className="mt-2 text-sm text-white/70">Premium online Quran learning for kids, adults, and reverts.</p>
            </div>
            <div>
              <h5 className="font-medium">Quick Links</h5>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
                {navItems.map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#D4AF37]">
                      <span className="h-1 w-1 rounded-full bg-[#D4AF37]/70" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <h5 className="font-medium">Newsletter</h5>
              <p className="mt-2 text-sm text-white/60">Get updates about class slots and Quran learning tips.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Your email"
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-[#D4AF37]"
                />
                <Button variant="gold" className="shrink-0">Join</Button>
              </div>
            </div>
          </div>
          <p className="relative mx-auto mt-10 max-w-7xl border-t border-white/15 pt-4 text-sm text-white/60">
            © {new Date().getFullYear()} Hafiz Kamran Hameed Quran Academy. All rights reserved.
          </p>
        </footer>
      </main>

      <a
        href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-4 z-50 grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95 lg:bottom-8 lg:right-6"
        onClick={() => trackEvent("whatsapp_click", { source: "floating_button" })}
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <a
        href="mailto:info@hafizkamranacademy.com"
        className="fixed bottom-40 right-6 z-40 hidden h-12 w-12 place-items-center rounded-full border border-white/20 bg-[#0F766E] text-white shadow-xl transition-transform duration-300 hover:scale-105 lg:grid"
      >
        <Mail className="h-5 w-5" />
      </a>

      <a
        href="#contact"
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37] px-3 py-2 text-xs font-semibold text-[#111827] shadow-lg transition-transform duration-300 hover:scale-105 md:block"
      >
        Free Trial
      </a>

      {showBackTop ? (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 left-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-white text-[#0F766E] shadow-xl"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[linear-gradient(145deg,rgba(2,19,17,0.94),rgba(5,48,41,0.9))] p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
          <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold" variant="gold">
            <a
              href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "sticky_mobile_cta" })}
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild className="h-11 w-full rounded-xl border-white/20 bg-white/10 text-sm font-semibold text-white hover:bg-white/20" variant="outline">
            <a href="#contact">Free Trial</a>
          </Button>
        </div>
      </div>

      {showWhatsAppPopup ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-5">
          <div className="w-full max-w-md rounded-3xl border border-[#D4AF37]/30 bg-[linear-gradient(140deg,rgba(2,19,17,0.92),rgba(6,78,59,0.78))] p-6 text-center text-white shadow-2xl backdrop-blur-xl">
            <h4 className="text-xl font-bold text-white">Need Help Booking a Trial?</h4>
            <p className="mt-2 text-sm text-white/75">Our team can schedule your child&apos;s free class right now on WhatsApp.</p>
            <div className="mt-5 flex gap-3">
              <Button asChild className="flex-1" variant="gold">
                <a
                  href={buildWhatsAppLink(siteConfig.whatsapp, DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setShowWhatsAppPopup(false);
                    trackEvent("whatsapp_click", { source: "popup" });
                  }}
                >
                  Chat Now
                </a>
              </Button>
              <Button variant="outline" className="flex-1 border-white/25 bg-white/10 text-white hover:bg-white/15" onClick={() => setShowWhatsAppPopup(false)}>
                Later
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
