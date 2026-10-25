"use client";

import React, { useState, useEffect, useRef } from "react";
import { type MenuCategory, formatPrice } from "@/data/menu";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { THEME_COLORS } from "@/config/theme";
import { useOrderTray } from "@/components/OrderTrayContext";

interface MenuInteractiveViewProps {
  categories: MenuCategory[];
}

/**
 * Printed Cafe Menu View adapted from 21st.dev Restaurant Menu Block (id: 27052).
 * Features classic dotted leaders between item names and prices, small-caps section tags,
 * interactive row hover shift, and accessible dietary filters.
 */
export function MenuInteractiveView({ categories }: MenuInteractiveViewProps) {
  const { addItem } = useOrderTray();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [selectedDiet, setSelectedDiet] = useState<"all" | "veg">("all");
  const [announcement, setAnnouncement] = useState<string>("");
  const isUserClicking = useRef<boolean>(false);

  // Filter items based on selected diet
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (selectedDiet === "veg") {
        return item.diet === "veg";
      }
      return true;
    }),
  }));

  const totalVisibleItems = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  // Update screen reader announcement when filter changes
  const handleDietChange = (diet: "all" | "veg") => {
    setSelectedDiet(diet);
    const label = diet === "veg" ? "vegetarian items" : "all items";
    setAnnouncement(`Showing ${label}. ${totalVisibleItems} items available.`);
  };

  // Scroll-spy using IntersectionObserver
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isUserClicking.current) return;

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveCategory(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    });

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const handleTabClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    isUserClicking.current = true;
    setTimeout(() => {
      isUserClicking.current = false;
    }, 600);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Screen reader live announcement region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Sticky Category Tabs & Diet Filter Controls Bar */}
      <div className="sticky top-16 z-30 border-y border-cafe-border bg-cafe-cream/95 backdrop-blur-md print-hidden print:hidden">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          {/* Horizontal scrollable category anchor tabs */}
          <nav
            aria-label="Menu category sections"
            className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={() => handleTabClick(cat.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-[44px] items-center whitespace-nowrap px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
                    isActive
                      ? "border-b-2 border-cafe-terracotta text-cafe-terracotta"
                      : "border-b-2 border-transparent text-cafe-espresso/70 hover:text-cafe-terracotta"
                  }`}
                >
                  {cat.name}
                </a>
              );
            })}
          </nav>

          {/* Diet filter control */}
          <div
            role="group"
            aria-label="Filter menu items by diet"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cafe-olive">
              Filter:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDietChange("all")}
                aria-pressed={selectedDiet === "all"}
                className={`inline-flex min-h-[44px] items-center rounded-[2px] border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
                  selectedDiet === "all"
                    ? "border-cafe-espresso bg-cafe-espresso text-cafe-cream"
                    : "border-cafe-border bg-cafe-cream text-cafe-espresso hover:bg-cafe-cream-deep"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleDietChange("veg")}
                aria-pressed={selectedDiet === "veg"}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[2px] border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
                  selectedDiet === "veg"
                    ? "border-cafe-espresso bg-cafe-espresso text-cafe-cream"
                    : "border-cafe-border bg-cafe-cream text-cafe-espresso hover:bg-cafe-cream-deep"
                }`}
              >
                {/* Standard Indian Veg marker */}
                <svg
                  viewBox="0 0 16 16"
                  className="h-3 w-3 shrink-0"
                  aria-hidden="true"
                >
                  <rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                </svg>
                <span>Veg only</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections styled like printed menu */}
      <div className="mx-auto flex w-full max-w-site flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {filteredCategories.map((category) => {
          if (category.items.length === 0) {
            return (
              <section
                key={category.id}
                id={category.id}
                aria-labelledby={`heading-${category.id}`}
                className="scroll-mt-36 print-break-inside-avoid"
              >
                <div className="border-b border-cafe-border pb-3">
                  <h2
                    id={`heading-${category.id}`}
                    className="font-heading text-2xl font-semibold tracking-tight text-cafe-espresso sm:text-3xl"
                  >
                    {category.name}
                  </h2>
                </div>
                <p className="py-6 text-xs text-cafe-espresso/70">
                  No vegetarian items found in this section.
                </p>
              </section>
            );
          }

          return (
            <Reveal
              key={category.id}
              id={category.id}
              as="section"
              className="scroll-mt-36 print-break-inside-avoid"
            >
              {/* Category Header with small-caps subtitle */}
              <div className="border-b-2 border-cafe-border/80 pb-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cafe-olive">
                      Course / Section
                    </span>
                    <h2
                      id={`heading-${category.id}`}
                      className="mt-1 font-heading text-2xl font-semibold tracking-tight text-cafe-espresso sm:text-3xl"
                    >
                      {category.name}
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-cafe-olive tabular-nums">
                    {category.items.length} {category.items.length === 1 ? "offering" : "offerings"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-cafe-espresso/80 sm:text-sm">
                  {category.description}
                </p>
              </div>

              {/* Printed menu items with dotted leaders & row hover animation */}
              <ul className="divide-y divide-cafe-border/70">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="group cursor-pointer py-5 transition-transform duration-200 ease-out hover:translate-x-1.5 print-break-inside-avoid"
                  >
                    <div className="flex items-start gap-3">
                      {/* Indian Veg / Non-veg marker using theme palette */}
                      {item.diet === "veg" ? (
                        <span className="mt-1.5 flex shrink-0" title="Vegetarian">
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none" stroke={THEME_COLORS.veg} strokeWidth="1.5" />
                            <circle cx="8" cy="8" r="3.5" fill={THEME_COLORS.veg} />
                          </svg>
                          <span className="sr-only">Vegetarian</span>
                        </span>
                      ) : (
                        <span className="mt-1.5 flex shrink-0" title="Non-vegetarian">
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none" stroke={THEME_COLORS.nonveg} strokeWidth="1.5" />
                            <circle cx="8" cy="8" r="3.5" fill={THEME_COLORS.nonveg} />
                          </svg>
                          <span className="sr-only">Non-vegetarian</span>
                        </span>
                      )}

                      <div className="flex-1">
                        {/* Title, Dotted Leader, and Price */}
                        <div className="flex items-baseline gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-semibold text-cafe-espresso transition-colors duration-200 group-hover:text-cafe-terracotta sm:text-xl">
                              {item.name}
                            </h3>
                            {item.isNew && (
                              <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cafe-terracotta">
                                New
                              </span>
                            )}
                          </div>

                          {/* Dotted Leader Line (21st.dev Restaurant Menu Block pattern) */}
                          <span
                            aria-hidden="true"
                            className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-cafe-border transition-colors duration-200 group-hover:border-cafe-terracotta/50"
                          />

                          <div className="flex items-center gap-2.5">
                            <span className="font-heading text-base font-semibold text-cafe-espresso transition-colors duration-200 group-hover:text-cafe-terracotta tabular-nums sm:text-lg">
                              {formatPrice(item.price)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addItem(item);
                              }}
                              aria-label={`Add ${item.name} to order tray`}
                              className="rounded-[2px] border border-cafe-border bg-cafe-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cafe-espresso shadow-2xs transition-colors hover:border-cafe-terracotta hover:bg-cafe-terracotta hover:text-cafe-cream focus-visible:outline-2 focus-visible:outline-cafe-espresso"
                            >
                              + Add
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-1 text-xs leading-relaxed text-cafe-espresso/80 sm:text-sm">
                          {item.description}
                        </p>

                        {/* Allergen disclosure text */}
                        {item.allergens.length > 0 && (
                          <p className="mt-1 text-[11px] font-medium text-cafe-olive">
                            Contains: {item.allergens.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Photo slot if present */}
                      {item.photo && (
                        <div className="hidden sm:block sm:w-28 sm:shrink-0">
                          <Photo
                            alt={item.photo.label}
                            aspectRatio={item.photo.aspectRatio || "4/3"}
                            label={item.photo.label}
                            hoverZoom
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
