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
}

export const galleryCategories: GalleryCategory[] = [
  "Interior",
  "Food and drinks",
  "Events",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "photo-1",
    src: "",
    alt: "Front espresso bar counter with copper portafilters and wooden counter seating",
    width: 1200,
    height: 800,
    category: "Interior",
    label: "Front espresso bar counter",
    aspectRatio: "3/2",
  },
  {
    id: "photo-2",
    src: "",
    alt: "Freshly sliced sourdough country loaf on wooden baker board",
    width: 900,
    height: 1200,
    category: "Food and drinks",
    label: "Country sourdough loaf",
    aspectRatio: "3/4",
  },
  {
    id: "photo-3",
    src: "",
    alt: "Morning filter coffee manual pour over service in ceramic cup",
    width: 1200,
    height: 900,
    category: "Food and drinks",
    label: "Filter coffee brew service",
    aspectRatio: "4/3",
  },
  {
    id: "photo-4",
    src: "",
    alt: "Sunlit wood table beside wide floor-to-ceiling glass window",
    width: 1200,
    height: 675,
    category: "Interior",
    label: "Window seating table",
    aspectRatio: "16/9",
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
    src: "",
    alt: "Rear courtyard patio with terracotta potted trees and stone pavers",
    width: 1200,
    height: 800,
    category: "Interior",
    label: "Rear courtyard seating",
    aspectRatio: "3/2",
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
