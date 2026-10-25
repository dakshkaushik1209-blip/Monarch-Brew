"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
}

/**
 * Line-by-line / masked entrance reveal adapted from 21st.dev Text Reveal (Mask).
 * An outer wrapper provides overflow-hidden, and the child slides up from 100% translateY.
 * Respects prefers-reduced-motion by disabling translate and using gentle opacity.
 */
export function TextReveal({
  children,
  delay = 0,
  duration = 0.65,
  className = "",
  as = "div",
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const Component = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <Component
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Emil Kowalski custom ease-out curve
        }}
      >
        {children}
      </Component>
    </div>
  );
}

/**
 * Staggered container for sequenced entrances on page load.
 */
export function StaggerContainer({
  children,
  className = "",
  staggerChildren = 0.12,
  delayChildren = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item for StaggerContainer with fade and slide up.
 */
export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
