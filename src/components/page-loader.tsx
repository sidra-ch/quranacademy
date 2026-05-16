"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const loaderSteps = [
  "/step1-img.png",
  "/step2-img.png",
  "/step3-img.png",
  "/step4-img.png",
  "/step5-img.png"
];

// Per-step objectPosition — tuned for each new image's focal point
const loaderStepPositions = [
  "center 42%",  // step1: mosque silhouette + crescent moon
  "center 64%",  // step2: glowing Quran book (lower half)
  "center 62%",  // step3: glowing Quran book (similar composition)
  "center 25%",  // step4: pull Ayat text down from top — shows full 2 lines + ref + Quran
  "center 22%",  // step5: pin near top — full Ayat visible + Academy branding below
];

// Total loader active time before exit: 500 + 4×1400 = 6100ms
const LOADER_PROGRESS_DURATION = 6.5;

const stepDirections = ["right", "left", "bottom", "top"] as const;

function getDirectionalMotion(step: number) {
  const direction = stepDirections[step % stepDirections.length];
  if (direction === "right") return { initial: { x: 55, y: 0, scale: 1.06 }, exit: { x: -55, y: 0, scale: 1.02 } };
  if (direction === "left")  return { initial: { x: -55, y: 0, scale: 1.06 }, exit: { x: 55, y: 0, scale: 1.02 } };
  if (direction === "bottom") return { initial: { x: 0, y: 40, scale: 1.06 }, exit: { x: 0, y: -40, scale: 1.02 } };
  return { initial: { x: 0, y: -40, scale: 1.06 }, exit: { x: 0, y: 40, scale: 1.02 } };
}

const particles = [
  { left: "6%",  top: "16%", delay: 0.15, size: 1.8 },
  { left: "12%", top: "42%", delay: 0.65, size: 1.4 },
  { left: "21%", top: "24%", delay: 1.05, size: 2.1 },
  { left: "50%", top: "10%", delay: 0.45, size: 1.6 },
  { left: "71%", top: "18%", delay: 0.30, size: 1.9 },
  { left: "83%", top: "32%", delay: 0.90, size: 1.6 },
  { left: "91%", top: "48%", delay: 1.30, size: 2.2 },
  { left: "36%", top: "74%", delay: 0.75, size: 1.5 },
];

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Skip loader if already shown this session (must be in useEffect — no window on server)
  useEffect(() => {
    if (sessionStorage.getItem("loader_seen") === "1") {
      setLoading(false);
    }
  }, []);
  const directionalMotion = getDirectionalMotion(currentStep);
  const audioContextRef = useRef<AudioContext | null>(null);

  const enableSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext;

      if (!AudioCtx) {
        return;
      }

      const context = audioContextRef.current ?? new AudioCtx();
      audioContextRef.current = context;

      void context.resume().then(() => {
        setAudioEnabled(true);
      }).catch(() => {
        // Browser may block until interaction is fully registered.
      });

      setAudioEnabled(true);
    } catch {
      // Keep loader silent if audio setup fails.
    }
  }, []);

  // Try to enable audio immediately on mount (works if user previously interacted)
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const context = new AudioCtx();
      audioContextRef.current = context;
      void context.resume().then(() => {
        if (context.state === "running") {
          setAudioEnabled(true);
        }
      }).catch(() => {});
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (!loading) return;

    const stepDuration = 1400;
    const firstStepDuration = 500;
    let sequenceTimer: number | undefined;

    const advanceStep = () => {
      setCurrentStep((previousStep) => {
        if (previousStep >= loaderSteps.length - 1) {
          if (sequenceTimer) {
            window.clearInterval(sequenceTimer);
          }

          return previousStep;
        }

        return previousStep + 1;
      });
    };

    const firstStepTimer = window.setTimeout(() => {
      advanceStep();
      sequenceTimer = window.setInterval(advanceStep, stepDuration);
    }, firstStepDuration);

    const exitTimer = window.setTimeout(() => {
      if (sequenceTimer) {
        window.clearInterval(sequenceTimer);
      }

      sessionStorage.setItem("loader_seen", "1");
      setLoading(false);
    }, firstStepDuration + stepDuration * (loaderSteps.length - 1) + 1100);

    return () => {
      window.clearTimeout(firstStepTimer);
      if (sequenceTimer) {
        window.clearInterval(sequenceTimer);
      }

      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (!loading || audioEnabled) {
      return;
    }

    const unlockOnInteraction = () => {
      enableSound();
    };

    window.addEventListener("pointerdown", unlockOnInteraction, { once: true });
    window.addEventListener("keydown", unlockOnInteraction, { once: true });
    window.addEventListener("touchstart", unlockOnInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockOnInteraction);
      window.removeEventListener("keydown", unlockOnInteraction);
      window.removeEventListener("touchstart", unlockOnInteraction);
    };
  }, [audioEnabled, enableSound, loading]);

  useEffect(() => {
    if (!loading || !audioEnabled) {
      return;
    }

    try {
      const AudioCtx = window.AudioContext;

      if (!AudioCtx) {
        return;
      }

      const context = audioContextRef.current ?? new AudioCtx();
      audioContextRef.current = context;

      if (context.state === "suspended") {
        void context.resume().catch(() => {
          // Browser may block autoplay audio until user interaction.
        });
      }

      const notes = [294, 330, 392, 440, 494];
      const baseFrequency = notes[currentStep % notes.length];
      const now = context.currentTime;

      const masterGain = context.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      masterGain.connect(context.destination);

      const mainTone = context.createOscillator();
      mainTone.type = "triangle";
      mainTone.frequency.setValueAtTime(baseFrequency, now);
      mainTone.connect(masterGain);

      const harmonyTone = context.createOscillator();
      harmonyTone.type = "sine";
      harmonyTone.frequency.setValueAtTime(baseFrequency * 1.5, now);
      harmonyTone.connect(masterGain);

      mainTone.start(now);
      harmonyTone.start(now);
      mainTone.stop(now + 0.5);
      harmonyTone.stop(now + 0.45);
    } catch {
      // Keep loader silent if audio is unavailable.
    }
  }, [audioEnabled, currentStep, loading]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(() => {
          // No-op cleanup fallback.
        });
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#021311] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
        >
          {/* ── STEP IMAGES ── */}
          <AnimatePresence>
            <motion.div
              key={loaderSteps[currentStep]}
              initial={{ opacity: 1, ...directionalMotion.initial }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 1, ...directionalMotion.exit }}
              transition={{ duration: 0.95, ease: [0.22, 0.44, 0.42, 0.96] }}
              className="absolute inset-0"
            >
              <Image
                src={loaderSteps[currentStep]}
                alt={`Step ${currentStep + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover saturate-[1.18] contrast-[1.06] brightness-[0.88]"
                style={{ objectPosition: loaderStepPositions[currentStep] }}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── CINEMATIC OVERLAYS ── */}
          {/* Top vignette — skipped for step4 & step5 because Ayat text sits at top of those images */}
          {currentStep < 3 && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#010e0c]/80 to-transparent" />
          )}
          {/* Bottom vignette — deeper for HUD readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#010e0c]/95 via-[#010e0c]/60 to-transparent" />
          {/* Side vignettes */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#010e0c]/55 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#010e0c]/55 to-transparent" />
          {/* Subtle gold atmospheric glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(212,175,55,0.08),transparent)]" />

          {/* ── LENS FLARE SWEEP ── */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-[30%] bg-[linear-gradient(108deg,transparent,rgba(255,255,255,0.06),transparent)] mix-blend-screen"
            initial={{ x: "-140%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
          />

          {/* ── FLOATING GOLD PARTICLES ── */}
          {particles.map((particle, idx) => (
            <motion.div
              key={`${particle.left}-${particle.top}`}
              className="pointer-events-none absolute rounded-full bg-[#D4AF37]"
              style={{ left: particle.left, top: particle.top, width: particle.size * 4, height: particle.size * 4 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.15, 0.95, 0.35], y: [-6, -18, -8] }}
              transition={{ duration: 4.4 + idx * 0.25, repeat: Infinity, repeatType: "mirror", delay: particle.delay, ease: "easeInOut" }}
            />
          ))}

          {/* ── PREMIUM BOTTOM HUD ── */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-10 pt-4 sm:pb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Academy name */}
            <p className="text-center text-[9px] font-semibold tracking-[0.42em] text-white/40 sm:text-[10px]">
              HAFIZ KAMRAN HAMEED · QURAN ACADEMY
            </p>

            {/* Gold progress bar */}
            <div className="relative w-full max-w-xs overflow-hidden rounded-full" style={{ height: "2px", background: "rgba(255,255,255,0.10)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-[#b8892a] via-[#F5D87E] to-[#D4AF37]"
                style={{ width: "100%" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: LOADER_PROGRESS_DURATION, ease: "linear" }}
              />
              {/* Glow layer */}
              <motion.div
                className="absolute inset-y-0 left-0 origin-left rounded-full bg-[#F5D87E]/50 blur-[2px]"
                style={{ width: "100%" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: LOADER_PROGRESS_DURATION, ease: "linear" }}
              />
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-2">
              {loaderSteps.map((_, index) => (
                <motion.span
                  key={`dot-${index}`}
                  className="rounded-full bg-[#D4AF37]"
                  animate={{
                    width: index === currentStep ? 22 : 5,
                    height: 5,
                    opacity: index === currentStep ? 1 : index < currentStep ? 0.55 : 0.22,
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  style={{ display: "inline-block" }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
