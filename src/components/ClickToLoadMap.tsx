"use client";

import React, { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";

interface ClickToLoadMapProps {
  address: string;
  directionsUrl: string;
}

export function ClickToLoadMap({ address, directionsUrl }: ClickToLoadMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded border border-cafe-border bg-cafe-cream-deep/60 sm:min-h-[380px]">
        {mapLoaded ? (
          <iframe
            title="Cafe Google Maps Location"
            src={embedUrl}
            width="100%"
            height="100%"
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-6 text-center max-w-sm">
            <div className="rounded border border-cafe-border bg-cafe-cream p-3 text-cafe-terracotta">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <p className="font-heading text-base font-semibold text-cafe-espresso">
                Google Maps Preview
              </p>
              <p className="mt-1 text-xs text-cafe-espresso/75">
                Clicking below loads the interactive map from Google Maps.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="inline-flex items-center justify-center rounded border border-cafe-espresso bg-cafe-espresso px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cafe-cream transition-colors duration-short hover:bg-cafe-terracotta hover:border-cafe-terracotta focus-visible:outline-2 focus-visible:outline-cafe-espresso"
            >
              Load map
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-cafe-espresso/80">
        <span>Map data loaded only on request to protect your privacy.</span>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-cafe-terracotta underline underline-offset-4 hover:text-cafe-espresso"
        >
          <span>Get directions</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
