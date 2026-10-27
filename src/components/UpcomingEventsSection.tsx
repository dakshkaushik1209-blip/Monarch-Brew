"use client";

import React, { useState, useEffect } from "react";
import { cafeEvents, type CafeEvent } from "@/data/events";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

/**
 * Client-side filtered upcoming events section.
 * Computes today's date in Asia/Kolkata timezone in the browser,
 * preventing static export build dates from becoming stale.
 */
export function UpcomingEventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState<CafeEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!cafeEvents || cafeEvents.length === 0) return;

    try {
      const kolkataNow = new Date();
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const todayIso = formatter.format(kolkataNow); // YYYY-MM-DD in Asia/Kolkata

      const filtered = cafeEvents
        .filter((event) => event.date >= todayIso)
        .sort((a, b) => a.date.localeCompare(b.date));

      setUpcomingEvents(filtered);
    } catch {
      // Fallback
      const todayIso = new Date().toISOString().split("T")[0];
      setUpcomingEvents(cafeEvents.filter((e) => e.date >= todayIso));
    }
  }, []);

  if (!mounted || upcomingEvents.length === 0) {
    return null;
  }

  return (
    <Reveal as="section" className="border-t border-cafe-border pt-12 sm:pt-16">
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-xs font-medium text-cafe-olive">
            Gatherings
          </span>
          <h2
            id="events-heading"
            className="mt-1 font-heading text-2xl font-bold tracking-tight text-cafe-espresso text-balance sm:text-3xl"
          >
            Upcoming events
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <article
              key={event.id}
              className="flex flex-col gap-3 rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 p-5"
            >
              {event.photo && (
                <Photo
                  src={event.photo}
                  alt={event.title}
                  aspectRatio="16/9"
                  label={event.title}
                />
              )}
              <div className="text-xs text-cafe-olive uppercase tracking-wider font-semibold">
                {event.date} at {event.time}
              </div>
              <h3 className="font-heading text-lg font-semibold text-cafe-espresso">
                {event.title}
              </h3>
              <p className="text-xs leading-relaxed text-cafe-espresso/80 sm:text-sm">
                {event.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
