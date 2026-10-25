"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Route transition template: quick 200ms fade between page navigations.
 * Adheres strictly to emil-design-eng and animate rules.
 * Automatically falls back to instantaneous change when prefers-reduced-motion is requested.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
