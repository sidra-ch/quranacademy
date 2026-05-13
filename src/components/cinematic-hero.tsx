'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

const trustBadges = ['10+ Years Experience', 'Certified Scholar', 'Worldwide Students', 'Flexible Timings'];
const particles = [
  { left: '8%', top: '22%', size: 2, delay: 0.1 },
  { left: '14%', top: '42%', size: 1.5, delay: 0.6 },
  { left: '22%', top: '16%', size: 2.2, delay: 1.2 },
  { left: '74%', top: '18%', size: 2, delay: 0.3 },
  { left: '82%', top: '30%', size: 1.8, delay: 0.8 },
  { left: '90%', top: '48%', size: 2.4, delay: 1.6 }
];

export default function CinematicHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_18%_18%,rgba(15,118,110,0.42),rgba(3,30,28,0.95)_48%,#02100f_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/class-preview.jpeg"
          alt="Cinematic Quran learning atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_33%] opacity-[0.18] max-[390px]:object-[66%_31%] sm:object-[58%_34%] md:object-[56%_34%] lg:object-[54%_35%] xl:object-[53%_36%]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(212,175,55,0.2),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(2,16,15,0.8)_8%,rgba(2,16,15,0.32)_48%,rgba(2,16,15,0.72)_92%)]" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(212,175,55,0.55)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
          <linearGradient id="minaretShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(15,118,110,0.5)" />
            <stop offset="100%" stopColor="rgba(2,16,15,0.05)" />
          </linearGradient>
        </defs>

        <circle cx="710" cy="132" r="102" fill="url(#moonGlow)" />
        <circle cx="710" cy="132" r="34" fill="#D4AF37" />
        <circle cx="725" cy="122" r="34" fill="#06322f" />

        <circle cx="190" cy="130" r="2.5" fill="#D4AF37" />
        <circle cx="360" cy="220" r="2" fill="#D4AF37" />
        <circle cx="520" cy="150" r="1.8" fill="#D4AF37" />
        <circle cx="680" cy="240" r="2.2" fill="#D4AF37" />
        <circle cx="840" cy="110" r="1.8" fill="#D4AF37" />
        <circle cx="980" cy="260" r="2" fill="#D4AF37" />
        <circle cx="1240" cy="125" r="1.9" fill="#D4AF37" />
        <circle cx="1360" cy="210" r="2.3" fill="#D4AF37" />

        <g fill="url(#minaretShade)">
          <rect x="520" y="372" width="44" height="248" rx="14" />
          <polygon points="542,328 520,372 564,372" />

          <rect x="640" y="344" width="52" height="280" rx="16" />
          <polygon points="666,292 640,344 692,344" />

          <ellipse cx="760" cy="608" rx="84" ry="42" fill="rgba(15,118,110,0.32)" />
          <rect x="728" y="520" width="64" height="90" rx="14" fill="rgba(15,118,110,0.35)" />
          <path d="M760 465 C718 503 718 534 760 552 C802 534 802 503 760 465 Z" fill="rgba(15,118,110,0.36)" />

          <rect x="90" y="360" width="45" height="260" rx="14" />
          <polygon points="112,315 90,360 135,360" />

          <rect x="260" y="410" width="35" height="220" rx="10" />
          <polygon points="278,370 260,410 295,410" />

          <rect x="1260" y="390" width="42" height="245" rx="12" />
          <polygon points="1281,350 1260,390 1302,390" />

          <rect x="1430" y="350" width="50" height="280" rx="14" />
          <polygon points="1455,300 1430,350 1480,350" />
        </g>

        <path d="M0 680 C250 590 420 630 620 600 C840 566 1060 620 1600 560 L1600 900 L0 900 Z" fill="rgba(1,14,13,0.75)" />
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(5,26,23,0.58),transparent_60%)]" />
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          initial={{ y: 0, opacity: 0.35 }}
          animate={{ y: -14, opacity: 0.95 }}
          transition={{
            duration: 4.2 + index * 0.3,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: particle.delay
          }}
          className="pointer-events-none absolute rounded-full bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.95)]"
          style={{ left: particle.left, top: particle.top, width: particle.size * 4, height: particle.size * 4 }}
        />
      ))}

      <div className="relative z-10 mx-auto grid min-h-[84vh] max-w-7xl grid-cols-1 items-end gap-5 px-4 pt-24 pb-14 sm:px-6 lg:items-center lg:gap-10 lg:pt-28 lg:pb-12 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="relative order-2 mx-auto mt-4 flex w-full max-w-[430px] items-end justify-center sm:max-w-[500px] lg:order-2 lg:mt-0 lg:max-w-[560px]"
        >
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-32 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.52),rgba(15,118,110,0.26),transparent_72%)] blur-2xl" />
          <div className="pointer-events-none absolute -inset-x-2 top-[14%] h-[58%] rounded-[52%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2),rgba(15,118,110,0.16),transparent_72%)] blur-3xl" />

          <div className="relative w-full">
            <div className="pointer-events-none absolute left-[2%] top-[40%] h-44 w-10 rounded-full border border-[#D4AF37]/30 bg-[linear-gradient(180deg,rgba(15,118,110,0.25),rgba(0,0,0,0.25))] blur-[0.2px]" />
            <div className="pointer-events-none absolute right-[2%] top-[38%] h-52 w-11 rounded-full border border-[#D4AF37]/35 bg-[linear-gradient(180deg,rgba(15,118,110,0.3),rgba(0,0,0,0.28))] blur-[0.2px]" />

            <div className="relative mx-auto h-[500px] w-[95%] overflow-hidden rounded-t-[220px] rounded-b-[38px] border border-[#D4AF37]/70 bg-[linear-gradient(165deg,rgba(212,175,55,0.34),rgba(10,58,53,0.68)_30%,rgba(1,20,18,0.9))] p-2 shadow-[0_35px_80px_rgba(0,0,0,0.55),0_0_62px_rgba(212,175,55,0.36),0_0_28px_rgba(15,118,110,0.22)] sm:h-[560px] lg:h-[590px] lg:w-[94%] lg:rounded-t-[230px] lg:rounded-b-[44px]">
              <div className="relative h-full w-full overflow-hidden rounded-t-[210px] rounded-b-[32px] border border-[#D4AF37]/35 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),rgba(5,30,28,0.5)_40%,rgba(0,0,0,0.35))] lg:rounded-t-[220px] lg:rounded-b-[38px]">
                <div className="pointer-events-none absolute inset-0 z-[2] opacity-[0.13] [background-image:radial-gradient(circle_at_10px_10px,#D4AF37_1.1px,transparent_1.2px)] [background-size:26px_26px]" />
                <Image
                  src="/teacher-kamran-herosection.png"
                  alt="Qari Hafiz Kamran"
                  fill
                  priority
                  sizes="(max-width: 389px) 95vw, (max-width: 430px) 92vw, (max-width: 1024px) 72vw, 520px"
                  className="object-cover object-[49%_30%] scale-[1.26] max-[390px]:object-[48%_28%] max-[390px]:scale-[1.3] min-[391px]:max-[430px]:object-[48%_29%] min-[391px]:max-[430px]:scale-[1.28] sm:object-[49%_31%] sm:scale-[1.24] md:object-[49%_32%] md:scale-[1.2] lg:object-[49%_30%] lg:scale-[1.16] xl:object-[49%_29%] xl:scale-[1.14] 2xl:object-[49%_28%] 2xl:scale-[1.12]"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[#031f1d] via-[#031f1d]/55 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_32%,rgba(0,0,0,0.35)_100%)]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="order-1 mt-0 max-w-2xl rounded-[28px] border border-white/10 bg-[#021916]/72 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 lg:order-1 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"
        >
          <h1 className="text-balance font-poppins text-[2.4rem] font-bold leading-[1.05] text-white sm:text-6xl lg:text-[4.35rem]">
            Learn <span className="text-[#D4AF37]">Quran</span> Online
            <br />
            With Proper Tajweed
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
            One-on-One Live Classes for Kids & Adults Worldwide.
            <br className="hidden sm:block" />
            Start your journey to understand and live by the Quran.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              href="#contact"
              className="magnetic-btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#2ad27f]/30 bg-[linear-gradient(135deg,#0F766E,#0b5f58)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(15,118,110,0.45)] active:scale-[0.98] sm:h-auto sm:w-auto sm:text-sm"
            >
              Start Free Trial Class <ArrowRight className="h-4 w-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/923155511179?text=Assalamu%20Alaikum%2C%20I%20want%20to%20book%20a%20free%20Quran%20trial%20class."
              target="_blank"
              rel="noreferrer"
              className="magnetic-btn shimmer-cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37] px-6 py-3 text-base font-semibold text-[#111827] shadow-[0_10px_26px_rgba(212,175,55,0.35)] active:scale-[0.98] sm:h-auto sm:w-auto sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Now
            </motion.a>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustBadges.map((item) => (
              <div key={item} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-center text-xs font-medium text-white/85 backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#03100f] via-[#03100f]/70 to-transparent" />
    </section>
  );
}
