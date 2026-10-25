"use client";

import React, { useRef, useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
} from "motion/react";
import type { GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

interface DraggablePrintsContextType {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bringToFront: (id: string) => void;
  topZIndex: number;
  resetKey: number;
  isReducedMotion: boolean;
}

const DraggablePrintsContext = createContext<DraggablePrintsContextType | null>(null);

function useDraggablePrints() {
  const context = useContext(DraggablePrintsContext);
  if (!context) {
    throw new Error("DraggableCardBody must be used within DraggableCardContainer");
  }
  return context;
}

export interface DraggableCardContainerProps {
  className?: string;
  children?: React.ReactNode;
  onReset?: () => void;
  resetKey: number;
  topZIndex: number;
  bringToFront: (id: string) => void;
  isReducedMotion: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function DraggableCardContainer({
  className,
  children,
  onReset,
  resetKey,
  topZIndex,
  bringToFront,
  isReducedMotion,
  containerRef,
}: DraggableCardContainerProps) {
  return (
    <DraggablePrintsContext.Provider
      value={{
        containerRef,
        bringToFront,
        topZIndex,
        resetKey,
        isReducedMotion,
      }}
    >
      <div
        ref={containerRef}
        role="group"
        aria-label="Interactive draggable photo prints on the table"
        tabIndex={-1}
        className={cn(
          "relative h-[460px] w-full overflow-hidden rounded-[2px] border border-cafe-border bg-cafe-cream-deep select-none sm:h-[520px]",
          className,
        )}
      >
        {/* Subtle tabletop paper texture pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="table-paper-grain"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.75" fill="#3B2A20" opacity="0.16" />
              <circle cx="12" cy="12" r="0.75" fill="#3B2A20" opacity="0.16" />
              <circle cx="6" cy="16" r="0.5" fill="#B8643F" opacity="0.14" />
              <circle cx="16" cy="6" r="0.5" fill="#B8643F" opacity="0.14" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#table-paper-grain)" />
        </svg>

        {/* Top-bar action button */}
        <div className="absolute right-3 top-3 z-30 sm:right-4 sm:top-4">
          <button
            type="button"
            onClick={onReset}
            className="rounded-[2px] border border-cafe-border bg-cafe-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cafe-espresso shadow-xs transition-colors hover:bg-cafe-cream-deep hover:text-cafe-terracotta focus-visible:outline-2 focus-visible:outline-cafe-espresso"
          >
            Reset positions
          </button>
        </div>

        {/* Table instruction note */}
        <div className="pointer-events-none absolute bottom-3 left-4 z-10 hidden sm:block">
          <p className="text-[11px] font-medium uppercase tracking-widest text-cafe-espresso/60">
            Click or drag prints to move around the table
          </p>
        </div>

        {/* Card layer */}
        {children}
      </div>
    </DraggablePrintsContext.Provider>
  );
}

export interface DraggableCardBodyProps {
  id: string;
  item: GalleryItem;
  initialLeft: string;
  initialTop: string;
  className?: string;
  children?: React.ReactNode;
}

export function DraggableCardBody({
  id,
  item,
  initialLeft,
  initialTop,
  className,
  children,
}: DraggableCardBodyProps) {
  const { containerRef, bringToFront, topZIndex, resetKey, isReducedMotion } =
    useDraggablePrints();

  const [cardZIndex, setCardZIndex] = useState<number>(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const baseRotation = item.rotation ?? 0;
  // Constraint tilt between -6 and +6 degrees while dragging
  const dragTilt = Math.max(-6, Math.min(6, baseRotation * 1.3));

  // Reset coordinates back to 0 on reset trigger
  useEffect(() => {
    if (resetKey > 0) {
      animate(x, 0, { type: "spring", stiffness: 280, damping: 24 });
      animate(y, 0, { type: "spring", stiffness: 280, damping: 24 });
    }
  }, [resetKey, x, y]);

  const handleFocusOrInteraction = () => {
    bringToFront(id);
    setCardZIndex(topZIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleFocusOrInteraction();
      y.set(y.get() - step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleFocusOrInteraction();
      y.set(y.get() + step);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleFocusOrInteraction();
      x.set(x.get() - step);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleFocusOrInteraction();
      x.set(x.get() + step);
    } else if (e.key === "Escape") {
      e.preventDefault();
      containerRef.current?.focus();
    }
  };

  if (isReducedMotion) {
    return (
      <div
        style={{
          left: initialLeft,
          top: initialTop,
          zIndex: cardZIndex,
        }}
        className={cn(
          "absolute w-48 rounded-[2px] border border-cafe-border bg-[#FDFBF7] p-2.5 shadow-[0_2px_8px_rgba(59,42,32,0.12)] sm:w-56 sm:p-3",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.08}
      dragMomentum={false}
      style={{
        x,
        y,
        left: initialLeft,
        top: initialTop,
        rotate: baseRotation,
        zIndex: cardZIndex,
        touchAction: "none",
      }}
      whileDrag={{
        scale: 1.02,
        rotate: dragTilt,
        boxShadow: "0 8px 24px rgba(59, 42, 32, 0.18)",
      }}
      onDragStart={handleFocusOrInteraction}
      onFocus={handleFocusOrInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Photo print: ${item.label}. Use arrow keys to move, Shift+arrows to move faster, Escape to exit.`}
      className={cn(
        "absolute w-48 cursor-grab active:cursor-grabbing rounded-[2px] border border-cafe-border bg-[#FDFBF7] p-2.5 shadow-[0_2px_8px_rgba(59,42,32,0.12)] transition-shadow duration-short focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:outline-none sm:w-56 sm:p-3 sm:pb-3.5",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export interface DraggablePrintsProps {
  items: GalleryItem[];
}

export function DraggablePrints({ items }: DraggablePrintsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topZIndex, setTopZIndex] = useState<number>(10);
  const [resetKey, setResetKey] = useState<number>(0);
  const [announcement, setAnnouncement] = useState<string>("");
  const reducedMotionPref = useReducedMotion();
  const isReducedMotion = Boolean(reducedMotionPref);

  // Filter to items with real src only
  const prints = items.filter((item) => item.src && item.src.trim().length > 0);

  // Guard: If there are fewer than 3 real photos, do not render this section at all
  if (prints.length < 3) {
    return null;
  }

  const bringToFront = () => {
    setTopZIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setAnnouncement("Table layout reset. All prints returned to initial positions.");
  };

  // Fixed spread coordinates for up to 6 prints
  const desktopLayouts = [
    { left: "6%", top: "12%" },
    { left: "38%", top: "8%" },
    { left: "68%", top: "16%" },
    { left: "18%", top: "48%" },
    { left: "52%", top: "46%" },
    { left: "74%", top: "48%" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Screen reader live announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <DraggableCardContainer
        containerRef={containerRef}
        resetKey={resetKey}
        topZIndex={topZIndex}
        bringToFront={bringToFront}
        onReset={handleReset}
        isReducedMotion={isReducedMotion}
      >
        {prints.slice(0, 6).map((item, index) => {
          const layout = desktopLayouts[index % desktopLayouts.length];

          return (
            <DraggableCardBody
              key={item.id}
              id={item.id}
              item={item}
              initialLeft={layout.left}
              initialTop={layout.top}
            >
              {/* Paper Photo Frame Content */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1px] bg-cafe-cream">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="pointer-events-none h-full w-full object-cover"
                  priority={index < 2}
                />
              </div>

              {/* Photo Caption */}
              <p className="mt-2 text-center font-heading text-xs italic text-cafe-espresso/90 select-none line-clamp-1">
                {item.caption || item.label}
              </p>
            </DraggableCardBody>
          );
        })}
      </DraggableCardContainer>
    </div>
  );
}
