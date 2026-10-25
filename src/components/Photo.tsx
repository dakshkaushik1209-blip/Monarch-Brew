import React from "react";
import Image from "next/image";
import { CoffeeCupWithSteam, BotanicalSprig, CoffeeBeans } from "./LineIllustrations";

export type PhotoAspectRatio = "16/9" | "4/3" | "1/1" | "3/2" | "4/5" | "3/4" | "21/9";

interface PhotoProps {
  src?: string;
  alt: string;
  aspectRatio?: PhotoAspectRatio;
  label?: string;
  className?: string;
  priority?: boolean;
  hoverZoom?: boolean;
  illustration?: "cup" | "sprig" | "beans";
}

const aspectRatioClasses: Record<PhotoAspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
};

export function Photo({
  src,
  alt,
  aspectRatio = "4/3",
  label,
  className = "",
  priority = false,
  hoverZoom = false,
  illustration = "cup",
}: PhotoProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const aspectClass = aspectRatioClasses[aspectRatio] || "aspect-[4/3]";

  if (src) {
    return (
      <div
        className={`group relative overflow-hidden rounded-[2px] bg-cafe-cream-deep border border-cafe-border ${aspectClass} ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ease-out ${
            hoverZoom ? "group-hover:scale-[1.03]" : ""
          }`}
        />
      </div>
    );
  }

  // Intentionally designed architectural / print paper slot
  return (
    <div
      role="img"
      aria-label={alt}
      className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-[2px] border border-cafe-border/80 bg-cafe-cream-deep/60 p-6 text-cafe-espresso transition-colors duration-300 hover:bg-cafe-cream-deep/80 ${aspectClass} ${className}`}
    >
      {/* Corner registration marks */}
      <span aria-hidden="true" className="absolute top-2 left-2 text-[10px] text-cafe-olive/40 font-mono">
        +
      </span>
      <span aria-hidden="true" className="absolute top-2 right-2 text-[10px] text-cafe-olive/40 font-mono">
        +
      </span>
      <span aria-hidden="true" className="absolute bottom-2 left-2 text-[10px] text-cafe-olive/40 font-mono">
        +
      </span>
      <span aria-hidden="true" className="absolute bottom-2 right-2 text-[10px] text-cafe-olive/40 font-mono">
        +
      </span>

      {/* Tactile illustration center */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="text-cafe-terracotta/50 transition-transform duration-500 ease-out group-hover:scale-105">
          {illustration === "sprig" ? (
            <BotanicalSprig className="h-10 w-10 text-cafe-olive/60" />
          ) : illustration === "beans" ? (
            <CoffeeBeans className="h-10 w-10 text-cafe-terracotta/60" />
          ) : (
            <CoffeeCupWithSteam className="h-12 w-12 text-cafe-terracotta/60" />
          )}
        </div>

        <span className="font-heading text-xs tracking-wider text-cafe-espresso/80 italic">
          {label || alt}
        </span>

        {isDev && (
          <span className="inline-block rounded-[2px] border border-cafe-border/60 bg-cafe-cream/80 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-cafe-olive">
            Add photo • {aspectRatio}
          </span>
        )}
      </div>
    </div>
  );
}
