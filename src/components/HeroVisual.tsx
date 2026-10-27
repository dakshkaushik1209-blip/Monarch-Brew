"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer position relative to center of container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, tactile response (Emil Kowalski / spring physics)
  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Responsive tilt and micro-translations
  const cupRotate = useTransform(smoothX, [-200, 200], [-3.5, 3.5]);
  const cupTranslateX = useTransform(smoothX, [-200, 200], [-12, 12]);
  const cupTranslateY = useTransform(smoothY, [-200, 200], [-10, 10]);

  const [isSealClicked, setIsSealClicked] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSealClick = () => {
    setIsSealClicked(true);
    setTimeout(() => setIsSealClicked(false), 600);

    // Smoothly scroll to menu section or taste matchmaker
    const target =
      document.getElementById("taste-matchmaker") ||
      document.getElementById("popular-items-heading");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex w-full items-center justify-center select-none py-4"
    >
      <motion.div
        drag={!shouldReduceMotion}
        dragConstraints={{ left: -35, right: 35, top: -35, bottom: 35 }}
        dragElastic={0.25}
        whileDrag={{ scale: 1.02 }}
        style={{
          rotate: shouldReduceMotion ? 0 : cupRotate,
          x: shouldReduceMotion ? 0 : cupTranslateX,
          y: shouldReduceMotion ? 0 : cupTranslateY,
        }}
        data-floating-cup="true"
        aria-label="Moveable handcrafted floating coffee cup"
        className="relative flex w-full max-w-[460px] items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Main Layer: Handcrafted Floating Iced Coffee Cup */}
        <div className="relative w-full">
          <Image
            src="/images/hero-iced-coffee.png"
            alt="Handcrafted iced coffee beverage with flying roasted beans and fresh pull seal"
            width={800}
            height={800}
            priority
            className="h-auto w-full object-contain drop-shadow-2xl animate-float-slow pointer-events-none"
          />

          {/* Interactive Clickable Badge Trigger */}
          <motion.button
            type="button"
            onClick={handleSealClick}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            animate={isSealClicked && !shouldReduceMotion ? { scale: [1, 1.15, 1] } : {}}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            aria-label="Order fresh pull: jump to taste matchmaker and menu"
            className="absolute bottom-2 left-2 z-20 inline-flex items-center gap-2 rounded-[2px] border border-cafe-border bg-cafe-terracotta px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cafe-cream shadow-md transition-colors hover:bg-cafe-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta cursor-pointer active:scale-[0.98]"
            title="Click to jump to menu & taste matchmaker"
          >
            <span className="h-1.5 w-1.5 rounded-[1px] bg-cafe-cream" />
            <span>Order Fresh Pull</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
