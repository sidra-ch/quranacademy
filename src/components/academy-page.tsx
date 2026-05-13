"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";
import useEmblaCarousel from "embla-carousel-react";
import * as Accordion from "@radix-ui/react-accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowUp,
  BookMarked,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe,
  GraduationCap,
  Hand,
  Languages,
  Mail,
  MessageCircle,
  MoonStar,
  ShieldCheck,
  Shield,
  Star,
  UserRound,
  X
} from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { ThemeToggle } from "@/components/theme-toggle";
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

const countries = ["USA", "UK", "Canada", "Australia", "UAE", "Saudi Arabia"];

type FormState = {
  success: boolean;
  message: string;
};

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
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Button asChild variant="gold">
              <a href="#contact">Book Free Trial</a>
            </Button>
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
              className="mx-auto h-full w-full max-w-md rounded-[28px] border border-white/20 bg-[linear-gradient(155deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
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
              </div>
              <Button asChild variant="gold" className="mt-6 h-12 w-full text-base font-semibold">
                <a href="#contact" onClick={() => setMobileOpen(false)}>
                  Book Free Trial
                </a>
              </Button>
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

        <section className="reveal px-6 py-20">
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

        <section id="courses" className="reveal relative overflow-hidden bg-[linear-gradient(180deg,#f8f5ee,#efe8d8)] px-6 py-20">
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

        <section className="reveal mx-auto max-w-7xl px-6 py-20">
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

        <section className="reveal bg-transparent px-6 py-20">
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

        <section className="reveal mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Live Class Preview</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Immersive One-on-One Digital Quran Learning Experience</h2>
            <p className="mt-4 text-white/75">
              Interactive screen sharing, tajweed correction in real-time, and focused student attention through Teams and digital Quran tools.
            </p>
          </div>
          <div
            data-parallax="soft"
            data-reveal-item
            className="relative rounded-[32px] border border-white/15 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
          >
            <Image
              src="/class-preview.jpeg"
              alt="Online class preview"
              width={1200}
              height={900}
              sizes="(max-width: 389px) 94vw, (max-width: 1024px) 92vw, 620px"
              loading="lazy"
              className="rounded-[24px] object-cover object-[56%_48%] max-[390px]:object-[62%_46%] sm:object-[58%_48%] lg:object-[54%_50%]"
            />
          </div>
        </section>

        <section id="testimonials" className="reveal bg-[linear-gradient(180deg,#f7f2e8,#efe1c6)] px-6 py-20">
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

        <section className="reveal mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-center text-3xl font-bold text-white">Countries We Serve</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <div key={country} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center font-medium text-white/90 backdrop-blur">
                  {country}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="reveal bg-transparent px-6 py-20">
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

        <section id="faq" className="reveal mx-auto max-w-4xl px-6 py-20">
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

        <section className="reveal relative overflow-hidden px-6 py-20">
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
                  src="/teacher-kamran-cutout.png"
                  alt="Hafiz Kamran"
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

        <section id="contact" className="reveal mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-2">
          <Card className="border-white/15 bg-white/5 backdrop-blur-xl">
            <CardContent>
              <h3 className="text-2xl font-bold text-white">Book Free Trial Class</h3>
              <p className="mt-2 text-sm text-white/70">Share your details and our team will contact you on WhatsApp.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <Input className="border-white/20 bg-white/10 text-white placeholder:text-white/60" placeholder="Parent Name" {...register("parentName")} />
                {errors.parentName ? <p className="text-xs text-red-500">{errors.parentName.message}</p> : null}
                <Input
                  type="email"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  placeholder="Parent Email"
                  {...register("parentEmail")}
                />
                {errors.parentEmail ? <p className="text-xs text-red-500">{errors.parentEmail.message}</p> : null}
                <Input className="border-white/20 bg-white/10 text-white placeholder:text-white/60" placeholder="Child Age" {...register("childAge")} />
                {errors.childAge ? <p className="text-xs text-red-500">{errors.childAge.message}</p> : null}
                <Input className="border-white/20 bg-white/10 text-white placeholder:text-white/60" placeholder="Country" {...register("country")} />
                {errors.country ? <p className="text-xs text-red-500">{errors.country.message}</p> : null}
                <Input
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  placeholder="WhatsApp Number"
                  {...register("whatsapp")}
                />
                {errors.whatsapp ? <p className="text-xs text-red-500">{errors.whatsapp.message}</p> : null}
                <Input
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  placeholder="Preferred Time"
                  {...register("preferredTime")}
                />
                {errors.preferredTime ? <p className="text-xs text-red-500">{errors.preferredTime.message}</p> : null}
                <Textarea className="border-white/20 bg-white/10 text-white placeholder:text-white/60" placeholder="Message" {...register("message")} />
                {errors.message ? <p className="text-xs text-red-500">{errors.message.message}</p> : null}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Submitting..." : "Send Inquiry"}
                </Button>

                <p className="text-xs text-white/60">You will receive a confirmation email after submission.</p>

                {formState.message ? (
                  <p className={`text-sm ${formState.success ? "text-emerald-600" : "text-red-500"}`}>{formState.message}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="border-[#D4AF37]/25 bg-[linear-gradient(140deg,rgba(6,78,59,0.88),rgba(15,118,110,0.8))] text-white backdrop-blur-xl">
            <CardContent className="space-y-5">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-3 py-2 backdrop-blur">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-[#D4AF37]/70 bg-white/80">
                  <Image
                    src="/teacher-kamran.jpeg"
                    alt="Hafiz Kamran"
                    width={80}
                    height={80}
                    loading="lazy"
                    className="h-full w-full object-cover object-[50%_12%]"
                  />
                </div>
                <p className="text-xs tracking-[0.18em] text-white/80">HAFIZ KAMRAN</p>
              </div>
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <p className="text-white/80">Trusted by families worldwide for personalized Quran learning.</p>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp: +92 315 5511179
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> info@hafizkamranacademy.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Online via Teams / Zoom
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Availability: Daily (Flexible Slots)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer
          className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(15,118,110,0.35),transparent_35%),linear-gradient(180deg,#01100f,#021311)] px-6 py-14 text-white"
          id="footer"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.15),transparent_32%)]" />
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-4">
            <div>
              <h4 className="font-semibold text-white">Hafiz Kamran Hameed Quran Academy</h4>
              <p className="mt-2 text-sm text-white/70">Premium online Quran learning for kids, adults, and reverts.</p>
            </div>
            <div>
              <h5 className="font-medium">Quick Links</h5>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {navItems.map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="transition-colors duration-300 hover:text-[#D4AF37]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium">Newsletter</h5>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Your email"
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-[#D4AF37]"
                />
                <Button variant="gold">Join</Button>
              </div>
            </div>
            <div>
              <h5 className="font-medium">Social</h5>
              <div className="mt-3 flex gap-3 text-sm text-white/75">
                <Link href="#" className="rounded-full border border-white/15 px-3 py-1 transition hover:border-[#D4AF37]/60 hover:text-[#D4AF37]">YouTube</Link>
                <Link href="#" className="rounded-full border border-white/15 px-3 py-1 transition hover:border-[#D4AF37]/60 hover:text-[#D4AF37]">Instagram</Link>
                <Link href="#" className="rounded-full border border-white/15 px-3 py-1 transition hover:border-[#D4AF37]/60 hover:text-[#D4AF37]">Facebook</Link>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-4 text-sm text-white/60">
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
