"use client";

import React, { useState, useEffect } from "react";
import { Clock, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cafeConfig } from "@/config/cafe";

interface RoutineStep {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

const ROUTINE_STEPS: RoutineStep[] = [
  {
    time: "05:30 AM",
    title: "Oven Ignition & Sourdough Proofing",
    desc: "Bakers arrive to shape the overnight fermented country loaves and preheat the stone hearth deck.",
  },
  {
    time: "07:00 AM",
    title: "Doors Open & Espresso Dial-in",
    desc: "Baristas taste the morning espresso shot, adjusting grind size and brew temperature for current humidity.",
    highlight: true,
  },
  {
    time: "07:30 AM",
    title: "First Warm Loaves at Counter",
    desc: "Freshly sliced sourdough loaves and cardamom buns placed warm into baker racks.",
  },
  {
    time: "11:30 AM",
    title: "Cold Brew Extraction & Filter Service",
    desc: "Peak midday pour-over brew service and 14-hour steeped cold brew tapped fresh on tap.",
  },
  {
    time: "03:00 PM",
    title: "Kitchen Closes & Quiet Afternoon Pour-over",
    desc: "Savory hot kitchen concludes; manual pour-over bar, baked sweets, and courtyard reading continue.",
  },
  {
    time: "05:00 PM",
    title: "Bar Closes & Group Head Clean-down",
    desc: "Espresso group heads back-flushed with hot water; batch roasted beans sealed for tomorrow.",
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
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Format time
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedH = hours % 12 || 12;
      const formattedM = String(minutes).padStart(2, "0");
      setTimeString(`${formattedH}:${formattedM} ${ampm}`);

      // Check opening hours (7:00 AM to 5:00 PM = hours 7 to 16)
      if (hours >= 7 && hours < 11) {
        setIsCurrentlyOpen(true);
        setCurrentStatusText("Morning rush: Warm sourdough sliced, lever espresso machine active");
      } else if (hours >= 11 && hours < 15) {
        setIsCurrentlyOpen(true);
        setCurrentStatusText("Midday service: Pour overs, cold brew on tap, and fresh bakes");
      } else if (hours >= 15 && hours < 17) {
        setIsCurrentlyOpen(true);
        setCurrentStatusText("Afternoon calm: Manual pour-overs, reading tables, and quiet courtyard");
      } else {
        setIsCurrentlyOpen(false);
        setCurrentStatusText("Bar is resting: Tomorrow's single-origin batches roast at 6:30 AM");
      }
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
          {/* Live Pulsing Dot */}
          <span className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-[2px] opacity-75 ${
                isCurrentlyOpen ? "bg-cafe-veg" : "bg-cafe-terracotta"
              }`}
            />
            <span
              className={`relative inline-flex h-3 w-3 rounded-[2px] ${
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
            <span className="text-[11px] font-bold uppercase tracking-widest text-cafe-terracotta">
              Daily Workshop Schedule on {cafeConfig.address.street}
            </span>
            <span className="text-[11px] text-cafe-olive font-medium">
              Every day Monday - Sunday
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
