"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { type GalleryItem } from "@/data/gallery";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

interface GalleryInteractiveViewProps {
  items: GalleryItem[];
}

export function GalleryInteractiveView({ items }: GalleryInteractiveViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [hoveredAccordionIdx, setHoveredAccordionIdx] = useState<number | null>(0);
  const [announcement, setAnnouncement] = useState<string>("");
  const [forcePreview, setForcePreview] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedThumbRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isDev = process.env.NODE_ENV !== "production";
  const hasRealPhotos = items.some((item) => item.src && item.src.trim() !== "");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("preview=true")) {
      setForcePreview(true);
    }
  }, []);

  const availableCategories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];

  const visibleItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setHoveredAccordionIdx(0);
    const count = category === "All"
      ? items.length
      : items.filter((i) => i.category === category).length;
    setAnnouncement(`Showing ${count} photographs in ${category}.`);
  };

  const openLightbox = (index: number, eventTarget?: HTMLElement) => {
    lastFocusedThumbRef.current = eventTarget || (document.activeElement as HTMLElement);
    setActivePhotoIndex(index);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  };

  const closeLightbox = useCallback(() => {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
    document.body.style.overflow = "";
    setActivePhotoIndex(null);
    lastFocusedThumbRef.current?.focus();
  }, []);

  const showPrevious = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + visibleItems.length) % visibleItems.length;
    });
  }, [activePhotoIndex, visibleItems.length]);

  const showNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % visibleItems.length;
    });
  }, [activePhotoIndex, visibleItems.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activePhotoIndex === null) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    }

    if (activePhotoIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, closeLightbox, showPrevious, showNext]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isDev && !hasRealPhotos && !forcePreview) {
    return (
      <div className="mx-auto max-w-site px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 p-8 text-sm text-cafe-espresso/85">
          <p>
            Photographs of our space, bakes, and daily coffee service will be published here shortly.
          </p>
          <button
            type="button"
            onClick={() => setForcePreview(true)}
            className="mt-4 inline-block text-xs uppercase tracking-wider text-cafe-terracotta underline underline-offset-4 hover:text-cafe-espresso"
          >
            Preview development photo slots
          </button>
        </div>
      </div>
    );
  }

  const activePhoto = activePhotoIndex !== null ? visibleItems[activePhotoIndex] : null;

  return (
    <div className="flex flex-col gap-10">
      {/* Screen reader live announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Category Filter Tabs */}
      <div className="border-b border-cafe-border">
        <nav
          aria-label="Gallery category filters"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {availableCategories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                aria-pressed={isActive}
                className={`inline-flex min-h-[44px] items-center whitespace-nowrap px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta active:scale-[0.98] motion-reduce:active:scale-100 ${
                  isActive
                    ? "border-b-2 border-cafe-terracotta text-cafe-terracotta"
                    : "border-b-2 border-transparent text-cafe-espresso/75 hover:text-cafe-terracotta"
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Image Accordion (Visible on screens >= lg) */}
      <div className="hidden lg:block w-full">
        <div className="mb-3 flex items-center justify-between text-xs text-cafe-olive">
          <span>Featured records (Hover or focus to expand)</span>
          <span className="tabular-nums">{visibleItems.length} photographs</span>
        </div>

        <div className="flex h-[460px] w-full gap-2.5 overflow-hidden rounded-[2px]">
          {visibleItems.slice(0, 5).map((item, index) => {
            const isExpanded = (hoveredAccordionIdx ?? 0) === index;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setHoveredAccordionIdx(index)}
                onFocus={() => setHoveredAccordionIdx(index)}
                onClick={(e) => openLightbox(index, e.currentTarget)}
                aria-label={`Expand and view photo: ${item.alt}`}
                style={{
                  flex: isExpanded ? 3.5 : 1,
                }}
                className="group relative h-full overflow-hidden rounded-[2px] border border-cafe-border bg-cafe-cream-deep/30 transition-[flex] duration-400 ease-out-craft motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta text-left"
              >
                {item.src ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full">
                    <Photo
                      src={item.src}
                      alt={item.alt}
                      aspectRatio="3/4"
                      label={item.label}
                      className="h-full w-full"
                    />
                  </div>
                )}

                {/* Overlay vignette caption */}
                <div
                  className={`absolute inset-x-0 bottom-0 bg-cafe-espresso/90 p-4 text-cafe-cream transition-opacity duration-base ${
                    isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <span className="block font-heading text-sm font-semibold tracking-tight">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-cafe-cream/70">
                    {item.alt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout (Full archive, and default mobile layout) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
        {visibleItems.map((item, index) => {
          const colSpan =
            item.aspectRatio === "16/9"
              ? "sm:col-span-2 lg:col-span-8"
              : item.aspectRatio === "3/4"
              ? "sm:col-span-1 lg:col-span-4"
              : item.aspectRatio === "3/2"
              ? "sm:col-span-1 lg:col-span-6"
              : "sm:col-span-1 lg:col-span-6";

          return (
            <Reveal
              key={item.id}
              className={colSpan}
              delay={(index % 4) * 0.07}
              reverseDelay={(3 - (index % 4)) * 0.05}
            >
              <button
                type="button"
                onClick={(e) => openLightbox(index, e.currentTarget)}
                aria-label={`Open photo view: ${item.alt}`}
                className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta rounded-[2px] active:scale-[0.98] motion-reduce:active:scale-100"
              >
                {item.src ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 transition-opacity duration-fast group-hover:opacity-90">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <Photo
                    src={item.src}
                    alt={item.alt}
                    aspectRatio={item.aspectRatio}
                    label={item.label}
                    hoverZoom
                    className="w-full"
                  />
                )}
                <span className="mt-2 block text-xs font-medium text-cafe-espresso/80">
                  {item.label}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Native <dialog> Lightbox with focus trap */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closeLightbox();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
        className="fixed inset-0 z-50 m-0 h-screen w-screen max-h-none max-w-none bg-cafe-espresso/95 p-0 open:flex open:flex-col open:items-center open:justify-center border-none"
      >
        {activePhoto && (
          <div className="relative flex flex-col items-center justify-center p-4 max-w-4xl max-h-[90vh]">
            {/* Top Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo view"
              className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-[2px] border border-cafe-cream/20 bg-cafe-espresso text-cafe-cream hover:bg-cafe-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Main Lightbox View */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-[2px] border border-cafe-cream/10 bg-cafe-espresso">
              {activePhoto.src ? (
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  width={activePhoto.width}
                  height={activePhoto.height}
                  priority
                  className="max-h-[70vh] w-auto object-contain"
                />
              ) : (
                <div className="p-8">
                  <Photo
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    aspectRatio="4/3"
                    label={activePhoto.label}
                    className="w-[500px]"
                  />
                </div>
              )}
            </div>

            {/* Bottom Caption & Navigation */}
            <div className="mt-4 flex w-full items-center justify-between text-cafe-cream text-xs">
              <div>
                <span className="font-heading font-semibold text-sm">{activePhoto.label}</span>
                <span className="block text-cafe-cream/60">{activePhoto.alt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous photo"
                  className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-cafe-cream/20 text-cafe-cream hover:bg-cafe-cream/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs tabular-nums text-cafe-cream/70">
                  {(activePhotoIndex ?? 0) + 1} / {visibleItems.length}
                </span>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photo"
                  className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-cafe-cream/20 text-cafe-cream hover:bg-cafe-cream/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
