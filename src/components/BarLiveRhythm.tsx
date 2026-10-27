"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { getOpeningStatus, CAFE_HOURS } from "@/config/hours";

interface RoutineStep {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

const ROUTINE_STEPS: RoutineStep[] = [
  {
    time: "10:00 AM",
    title: "Doors Open & Morning Service",
    desc: "Baristas dial in espresso and prepare the day's first South Indian filter coffee decoctions.",
    highlight: true,
  },
  {
    time: "12:00 PM",
    title: "Cold Brews & Fresh Bakes",
    desc: "Slow-steeped cold brews and fresh croissants, rolls, and brownies at the counter.",
  },
  {
    time: "04:00 PM",
    title: "Afternoon Chai & Snacks",
    desc: "Fresh simmered masala chai, kesar chai, and grilled vegetarian sandwiches.",
  },
  {
    time: "08:00 PM",
    title: "Evening Counter Service",
    desc: "Evening coffee, cold brews, and desserts for quiet tables and conversation.",
  },
  {
    time: "10:30 PM",
    title: "Kitchen Orders Close",
    desc: "Last call for grilled sandwiches, toast, and wraps.",
  },
  {
    time: "11:00 PM",
    title: "Doors Close",
    desc: "Espresso group heads back-flushed with hot water; sealed for tomorrow.",
  },
];

export function BarLiveRhythm() {
  const [isOpenRoutine, setIsOpenRoutine] = useState<boolean>(false);
  const [timeString, setTimeString] = useState<string>("");
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState<boolean>(true);
  const [currentStatusText, setCurrentStatusText] = useState<string>("Active bar service");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Kolkata
      const timeFmt = new Intl.DateTimeFormat("en-US", {
        timeZone: CAFE_HOURS.timezone,
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setTimeString(timeFmt.format(now));

      const status = getOpeningStatus(now);
      setIsCurrentlyOpen(status.isOpen);
      setCurrentStatusText(status.statusText);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-[2px] border border-cafe-border bg-[#FDFBF7] p-5 shadow-sm sm:p-6">
      {/* Live Indicator Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Live Pulsing Dot (opacity only) */}
          <span className="relative flex h-3 w-3">
            <span
              className={`relative inline-flex h-3 w-3 rounded-[2px] animate-pulse-dot ${
                isCurrentlyOpen ? "bg-cafe-veg" : "bg-cafe-terracotta"
              }`}
            />
          </span>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cafe-espresso">
                {isCurrentlyOpen ? "Bar is Open" : "Bar is Closed"}
              </span>
              {timeString && (
                <span className="rounded-[2px] bg-cafe-cream px-2 py-0.5 text-[11px] font-semibold tabular-nums text-cafe-espresso/80">
                  {timeString} IST
                </span>
              )}
            </div>
            <p className="text-xs text-cafe-espresso/80 sm:text-sm">
              {currentStatusText}
            </p>
          </div>
        </div>

        {/* Toggle Routine Button */}
        <button
          type="button"
          onClick={() => setIsOpenRoutine(!isOpenRoutine)}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-[2px] border border-cafe-border bg-cafe-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cafe-espresso transition-colors hover:bg-cafe-cream-deep hover:text-cafe-terracotta"
        >
          <span>{isOpenRoutine ? "Hide Daily Routine" : "View Daily Rhythm"}</span>
          {isOpenRoutine ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Expandable Daily Rhythm Timeline */}
      {isOpenRoutine && (
        <div className="mt-6 border-t border-cafe-border/70 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-cafe-terracotta">
              Daily schedule at {cafeConfig.address.display}
            </span>
            <span className="text-[11px] text-cafe-olive font-medium">
              Daily 10:00 AM to 11:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTINE_STEPS.map((step) => (
              <div
                key={step.time}
                className={`flex flex-col gap-1.5 rounded-[2px] border p-4 transition-colors ${
                  step.highlight
                    ? "border-cafe-terracotta/70 bg-cafe-cream-deep/40 shadow-xs"
                    : "border-cafe-border bg-cafe-cream/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-cafe-terracotta tabular-nums">
                    {step.time}
                  </span>
                  {step.highlight && (
                    <span className="rounded-[2px] bg-cafe-terracotta px-1.5 py-0.5 text-[9px] font-bold text-cafe-cream uppercase tracking-wide">
                      Key Milestone
                    </span>
                  )}
                </div>
                <h4 className="font-heading text-sm font-bold text-cafe-espresso">
                  {step.title}
                </h4>
                <p className="text-xs text-cafe-espresso/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
