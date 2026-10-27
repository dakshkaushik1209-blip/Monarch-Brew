"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

/**
 * Top Page Transition Progress Line:
 * Provides immediate, tactile feedback on page navigation.
 * Uses composite-only hardware-accelerated transforms (scaleX and opacity).
 * Strictly zero gradients, solid cafe-terracotta token, respects prefers-reduced-motion.
 */
export function PageTransitionProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(pathname);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (!shouldReduceMotion) {
        setIsNavigating(true);
        const timer = setTimeout(() => {
          setIsNavigating(false);
        }, 360);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, shouldReduceMotion]);

  if (!isNavigating || shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[100] h-[2px] overflow-hidden"
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.72, 1],
        }}
        style={{ willChange: "transform, opacity" }}
        className="h-full w-full origin-left bg-cafe-terracotta"
      />
    </div>
  );
}
