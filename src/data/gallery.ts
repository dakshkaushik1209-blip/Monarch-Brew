// NOTE: This is SAMPLE gallery data with placeholder development slots to be populated with real photography.

import type { PhotoAspectRatio } from "@/components/Photo";

export type GalleryCategory = "Interior" | "Food and drinks" | "Events";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: GalleryCategory;
  label: string;
  aspectRatio: PhotoAspectRatio;
  rotation?: number;
  caption?: string;
}

export const galleryCategories: GalleryCategory[] = [
  "Interior",
  "Food and drinks",
  "Events",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "photo-1",
    src: "/images/gallery/espresso-bar.png",
    alt: "Front espresso bar counter with copper portafilters and wooden counter seating",
    width: 800,
    height: 600,
    category: "Interior",
    label: "Front espresso bar counter",
    caption: "Morning pull on the two-group copper lever machine",
    rotation: -2.5,
    aspectRatio: "4/3",
  },
  {
    id: "photo-2",
    src: "/images/gallery/sourdough-loaf.png",
    alt: "Freshly sliced sourdough country loaf on wooden baker board",
    width: 600,
    height: 800,
    category: "Food and drinks",
    label: "Country sourdough loaf",
    caption: "Naturally leavened country loaf sliced warm at 7:30 am",
    rotation: 2,
    aspectRatio: "3/4",
  },
  {
    id: "photo-3",
    src: "/images/gallery/pour-over.png",
    alt: "Morning filter coffee manual pour over service in ceramic cup",
    width: 800,
    height: 600,
    category: "Food and drinks",
    label: "Filter coffee brew service",
    caption: "Single-origin filter brew dripped into heat-retaining glass",
    rotation: -1.5,
    aspectRatio: "4/3",
  },
  {
    id: "photo-4",
    src: "/images/gallery/window-table.png",
    alt: "Sunlit wood table beside wide floor-to-ceiling glass window",
    width: 800,
    height: 600,
    category: "Interior",
    label: "Window seating table",
    caption: "Corner reading table caught in 8:00 am southern light",
    rotation: 3,
    aspectRatio: "4/3",
  },
  {
    id: "photo-5",
    src: "",
    alt: "Cupping session with roasted bean bowls and tasting spoons",
    width: 1200,
    height: 800,
    category: "Events",
    label: "Community coffee cupping",
    aspectRatio: "3/2",
  },
  {
    id: "photo-6",
    src: "",
    alt: "Flaky almond croissants cooling on wire baker rack",
    width: 900,
    height: 1200,
    category: "Food and drinks",
    label: "Almond croissants on rack",
    aspectRatio: "3/4",
  },
  {
    id: "photo-7",
    src: "/images/gallery/courtyard.png",
    alt: "Rear courtyard patio with terracotta potted trees and stone pavers",
    width: 800,
    height: 600,
    category: "Interior",
    label: "Rear courtyard seating",
    caption: "Limestone paving and potted olive canopy in rear courtyard",
    rotation: -3,
    aspectRatio: "4/3",
  },
  {
    id: "photo-8",
    src: "",
    alt: "Evening acoustic gathering in rear courtyard with warm pendant lighting",
    width: 1200,
    height: 900,
    category: "Events",
    label: "Evening courtyard music session",
    aspectRatio: "4/3",
  },
];
