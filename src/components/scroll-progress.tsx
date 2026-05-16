"use client";

import { useScroll, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #8a6a10, #D4AF37 50%, #f5d87e)",
      }}
    />
  );
}
