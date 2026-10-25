"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  id?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Scroll reveal wrapper using whileInView.
 * Fades and slides up slightly when entering the viewport, once.
 * Follows emil-design-eng: transform: y 16px to 0, duration 500-600ms, ease-out.
 */
export function ScrollReveal({
  children,
  id,
  delay = 0,
  duration = 0.55,
  yOffset = 18,
  className = "",
  as = "div",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const Component = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <Component
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom snappy ease-out
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Image reveal wrapper with subtle scale from 1.04 to 1 on entering view, once.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
