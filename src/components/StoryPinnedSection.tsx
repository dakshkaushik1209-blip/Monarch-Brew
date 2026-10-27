"use client";

import React, { useState, useEffect, useRef } from "react";
import { cafeConfig } from "@/config/cafe";
import { Photo } from "@/components/Photo";

interface StoryStep {
  title: string;
  badge: string;
  paragraph: string;
  photoAlt: string;
  photoSrc: string;
  caption: string;
}

const storySteps: StoryStep[] = [
  {
    title: "At RDC, Raj Nagar",
    badge: "01 / The Cafe",
    paragraph: cafeConfig.about[0] || "",
    photoAlt: "Interior view of the sunlit cafe floor and seating",
    photoSrc: "/images/gallery/window-table.png",
    caption: "Quiet tables and morning light",
  },
  {
    title: "A focused daily menu",
    badge: "02 / The Bar",
    paragraph: cafeConfig.about[1] || "",
    photoAlt: "Filter coffee and cold brew counter",
    photoSrc: "/images/gallery/pour-over.png",
    caption: "Coffee, chai, and bakes",
  },
  {
    title: "Vegetarian kitchen",
    badge: "03 / Offerings",
    paragraph: cafeConfig.about[2] || "",
    photoAlt: "Fresh vegetarian bakes and snacks on counter",
    photoSrc: "/images/gallery/sourdough-loaf.png",
    caption: "Vegetarian menu",
  },
];

export function StoryPinnedSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observers: IntersectionObserver[] = [];

    blockRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        { rootMargin: "-30% 0px -40% 0px", threshold: 0.1 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      aria-labelledby="story-pinned-heading"
      className="w-full bg-cafe-cream py-16 sm:py-24"
    >
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-xl">
          <span className="text-xs font-medium text-cafe-olive">
            Our Purpose & Craft
          </span>
          <h2
            id="story-pinned-heading"
            className="mt-2 font-heading text-2xl font-bold tracking-tight text-cafe-espresso sm:text-3xl"
          >
            How we brew, bake, and host
          </h2>
        </div>

        {/* Desktop Sticky Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Pinned Sticky Visual Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 shadow-sm">
              {storySteps.map((step, idx) => (
                <div
                  key={step.badge}
                  aria-hidden={activeIndex !== idx}
                  className={`absolute inset-0 transition-opacity duration-base ease-out-craft ${
                    activeIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Photo
                    src={step.photoSrc}
                    aspectRatio="4:5"
                    alt={step.photoAlt}
                    caption={step.caption}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between rounded-[2px] border border-cafe-border/80 bg-cafe-cream/95 px-3 py-1.5 text-[11px] text-cafe-espresso">
                    <span className="font-heading font-medium">{step.title}</span>
                    <span className="text-[10px] tabular-nums text-cafe-olive">{step.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling Narrative Steps */}
          <div className="lg:col-span-7 space-y-24 py-12">
            {storySteps.map((step, idx) => (
              <div
                key={step.badge}
                ref={(el) => {
                  blockRefs.current[idx] = el;
                }}
                className={`transition-opacity duration-base ease-out-craft ${
                  activeIndex === idx ? "opacity-100" : "opacity-40"
                }`}
              >
                <div className="max-w-xl space-y-4 rounded-[2px] border-l-2 border-cafe-terracotta pl-6">
                  <span className="text-xs font-mono font-medium tracking-wide text-cafe-olive">
                    {step.badge}
                  </span>
                  <h3 className="font-heading text-xl font-semibold text-cafe-espresso sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-cafe-espresso/85">
                    {step.paragraph}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Reduced Motion Stacked Fallback */}
        <div className="grid grid-cols-1 gap-12 lg:hidden">
          {storySteps.map((step) => (
            <div
              key={step.badge}
              className="flex flex-col gap-4 rounded-[2px] border border-cafe-border/70 bg-cafe-cream-deep/20 p-5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40">
                <Photo
                  src={step.photoSrc}
                  aspectRatio="4:3"
                  alt={step.photoAlt}
                  caption={step.caption}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-medium text-cafe-olive">
                  {step.badge}
                </span>
                <h3 className="font-heading text-lg font-semibold text-cafe-espresso">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-cafe-espresso/80">
                  {step.paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
