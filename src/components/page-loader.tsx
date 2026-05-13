"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const loaderSteps = [
  "/step1-img.png",
  "/step2-img.png",
  "/step3-img.png",
  "/step4-img.png",
  "/step5-img.png"
];

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

  useEffect(() => {
    const stepDuration = 700;
    const firstStepDuration = 320;
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
    }, firstStepDuration + stepDuration * (loaderSteps.length - 1) + 900);

    return () => {
      window.clearTimeout(firstStepTimer);
      if (sequenceTimer) {
        window.clearInterval(sequenceTimer);
      }

      window.clearTimeout(exitTimer);
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
              initial={{ opacity: 0, scale: 1.08, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.03, x: -24 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={loaderSteps[currentStep]}
                alt={`Loader step ${currentStep + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,8,0.14),rgba(2,9,8,0.34)_58%,rgba(2,9,8,0.58))]" />

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
