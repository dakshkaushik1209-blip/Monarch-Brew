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

  // Categories that actually exist in the data
  const availableCategories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];

  // Filter items
  const visibleItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

  // Keyboard navigation within lightbox
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

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Production check: If in production and no photos have real src, render a plain sentence
  if (!isDev && !hasRealPhotos && !forcePreview) {
    return (
      <div className="mx-auto max-w-site px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded border border-cafe-border bg-cafe-cream-deep/40 p-8 text-sm text-cafe-espresso/85">
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
    <div className="flex flex-col gap-8">
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
                className={`whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-short focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
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

      {/* Uneven Photo Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
        {visibleItems.map((item, index) => {
          // Asymmetric column spans to prevent equal square thumbnails
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
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-cafe-espresso rounded"
              >
                {item.src ? (
                  <div
                    className={`relative overflow-hidden rounded border border-cafe-border bg-cafe-cream-deep transition-opacity duration-short group-hover:opacity-90 aspect-[${item.width}/${item.height}]`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <Photo
                    alt={item.alt}
                    aspectRatio={item.aspectRatio}
                    label={item.label}
                    hoverZoom
                    className="w-full"
                  />
                )}
                <span className="mt-1.5 block text-xs text-cafe-espresso/70">
                  {item.label}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Native <dialog> Lightbox */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closeLightbox();
        }}
        className="fixed inset-0 z-50 m-auto hidden open:flex h-full w-full max-h-screen max-w-screen items-center justify-center bg-transparent p-4 backdrop:bg-cafe-espresso/80"
      >
        {activePhoto && (
          <div
            role="document"
            aria-label="Image view modal"
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center justify-center rounded border border-cafe-border bg-cafe-cream p-4 sm:p-6 shadow-xl animate-view-fade"
          >
            {/* Top bar with counter and close button */}
            <div className="flex w-full items-center justify-between border-b border-cafe-border pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cafe-olive">
                Photo {activePhotoIndex! + 1} of {visibleItems.length}
              </span>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close image view"
                className="inline-flex items-center justify-center rounded border border-cafe-border bg-cafe-cream-deep p-1.5 text-cafe-espresso transition-colors duration-short hover:text-cafe-terracotta focus-visible:outline-2 focus-visible:outline-cafe-espresso"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Image container */}
            <div className="relative flex w-full max-h-[70vh] items-center justify-center overflow-hidden rounded bg-cafe-cream-deep/60">
              {activePhoto.src ? (
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  width={activePhoto.width}
                  height={activePhoto.height}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              ) : (
                <div className="p-8 w-full">
                  <Photo
                    alt={activePhoto.alt}
                    aspectRatio={activePhoto.aspectRatio}
                    label={activePhoto.label}
                    className="w-full max-h-[50vh]"
                  />
                </div>
              )}
            </div>

            {/* Bottom Caption and Prev/Next buttons */}
            <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-cafe-espresso/85 sm:text-sm">
                {activePhoto.alt}
              </p>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous photograph"
                  className="inline-flex items-center justify-center rounded border border-cafe-border bg-cafe-cream px-3 py-1.5 text-xs text-cafe-espresso transition-colors duration-short hover:bg-cafe-cream-deep focus-visible:outline-2 focus-visible:outline-cafe-espresso"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photograph"
                  className="inline-flex items-center justify-center rounded border border-cafe-border bg-cafe-cream px-3 py-1.5 text-xs text-cafe-espresso transition-colors duration-short hover:bg-cafe-cream-deep focus-visible:outline-2 focus-visible:outline-cafe-espresso"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
