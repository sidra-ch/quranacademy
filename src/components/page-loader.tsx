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

const stepDirections = ["right", "left", "bottom", "top"] as const;

function getDirectionalMotion(step: number) {
  const direction = stepDirections[step % stepDirections.length];

  if (direction === "right") {
    return {
      initial: { x: 40, y: 0, scale: 1.04, rotate: 0.3 },
      exit: { x: -40, y: 0, scale: 1.02, rotate: -0.3 }
    };
  }

  if (direction === "left") {
    return {
      initial: { x: -40, y: 0, scale: 1.04, rotate: -0.3 },
      exit: { x: 40, y: 0, scale: 1.02, rotate: 0.3 }
    };
  }

  if (direction === "bottom") {
    return {
      initial: { x: 0, y: 30, scale: 1.04, rotate: 0.2 },
      exit: { x: 0, y: -30, scale: 1.02, rotate: -0.2 }
    };
  }

  return {
    initial: { x: 0, y: -30, scale: 1.04, rotate: -0.2 },
    exit: { x: 0, y: 30, scale: 1.02, rotate: 0.2 }
  };
}

const particles = [
  { left: "8%", top: "18%", delay: 0.2, size: 2 },
  { left: "14%", top: "38%", delay: 0.7, size: 1.5 },
  { left: "23%", top: "26%", delay: 1.1, size: 2.2 },
  { left: "72%", top: "20%", delay: 0.35, size: 2 },
  { left: "82%", top: "34%", delay: 0.95, size: 1.7 },
  { left: "89%", top: "44%", delay: 1.4, size: 2.3 }
];

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_18%,#0F766E,#063D37_40%,#021311_100%)] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.85, ease: "easeInOut" } }}
        >
          <AnimatePresence>
            <motion.div
              key={loaderSteps[currentStep]}
              initial={{ opacity: 1, ...directionalMotion.initial }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 1, ...directionalMotion.exit }}
              transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={loaderSteps[currentStep]}
                alt={`Loader step ${currentStep + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center saturate-[1.1] contrast-[1.04]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.08),transparent_26%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(212,175,55,0.2),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,8,0.14),rgba(2,9,8,0.34)_58%,rgba(2,9,8,0.58))]" />
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-[40%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] mix-blend-screen"
            initial={{ x: "-140%" }}
            animate={{ x: "260%" }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "linear", repeatDelay: 0.65 }}
          />

          <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {loaderSteps.map((_, index) => (
              <span
                key={`loader-dot-${index}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentStep ? "w-7 bg-[#D4AF37]" : "w-2 bg-white/45"
                }`}
              />
            ))}
          </div>

          {particles.map((particle, idx) => (
            <motion.div
              key={`${particle.left}-${particle.top}`}
              className="pointer-events-none absolute rounded-full bg-[#D4AF37]"
              style={{ left: particle.left, top: particle.top, width: particle.size * 4, height: particle.size * 4 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0.15, 0.95, 0.35], y: [-6, -18, -8] }}
              transition={{ duration: 4.4 + idx * 0.25, repeat: Infinity, repeatType: "mirror", delay: particle.delay, ease: "easeInOut" }}
            />

          ))}

        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
