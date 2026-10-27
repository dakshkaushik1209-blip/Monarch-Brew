"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Droplets, Thermometer, Clock, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrewMethod {
  id: string;
  name: string;
  ratio: number; // 1 part coffee to X parts water
  tempC: string;
  grind: string;
  timeSec: number;
  bloomWaterPercent: number;
  bloomTimeSec: number;
  description: string;
}

const BREW_METHODS: BrewMethod[] = [
  {
    id: "filter",
    name: "South Indian Filter",
    ratio: 5,
    tempC: "96C",
    grind: "Fine (Powder-like)",
    timeSec: 900, // 15 mins decoction
    bloomWaterPercent: 0.25,
    bloomTimeSec: 60,
    description: "Traditional double-cylinder brass drip decoction. Rich, syrupy, and concentrated.",
  },
  {
    id: "v60",
    name: "Pour Over (V60)",
    ratio: 16,
    tempC: "93C",
    grind: "Medium-Fine",
    timeSec: 210, // 3:30
    bloomWaterPercent: 0.2,
    bloomTimeSec: 45,
    description: "Clarifying conical paper filter brew highlighting origin sweetness and florality.",
  },
  {
    id: "frenchpress",
    name: "French Press",
    ratio: 15,
    tempC: "94C",
    grind: "Coarse",
    timeSec: 240, // 4 mins
    bloomWaterPercent: 0.25,
    bloomTimeSec: 30,
    description: "Full immersion brew delivering heavy body, roasted oils, and chocolate sweetness.",
  },
  {
    id: "aeropress",
    name: "AeroPress",
    ratio: 12,
    tempC: "88C",
    grind: "Medium",
    timeSec: 120, // 2 mins
    bloomWaterPercent: 0.3,
    bloomTimeSec: 30,
    description: "Quick air-pressure extraction with intense clarity and balanced body.",
  },
  {
    id: "coldbrew",
    name: "Cold Brew",
    ratio: 8,
    tempC: "Chilled (Room temp)",
    grind: "Extra Coarse",
    timeSec: 43200, // 12 hours
    bloomWaterPercent: 0,
    bloomTimeSec: 0,
    description: "Slow 14-hour room temperature immersion. Ultra-low acidity and dark cocoa finish.",
  },
];

export function BrewCalculator() {
  const [activeMethodId, setActiveMethodId] = useState<string>("v60");
  const [coffeeDose, setCoffeeDose] = useState<number>(18);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  const currentMethod = BREW_METHODS.find((m) => m.id === activeMethodId) || BREW_METHODS[1];
  const waterAmountMl = Math.round(coffeeDose * currentMethod.ratio);
  const bloomWaterMl = Math.round(waterAmountMl * currentMethod.bloomWaterPercent);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const handleResetTimer = () => {
    setTimerRunning(false);
    setElapsedSec(0);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const targetSec = currentMethod.timeSec;
  const isTimerFinished = elapsedSec >= targetSec && targetSec <= 600;

  return (
    <div className="w-full rounded-[2px] border border-cafe-border bg-[#FDFBF7] p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-cafe-border pb-6">
        <div>
          <span className="text-xs font-medium text-cafe-terracotta">
            Roastery tool
          </span>
          <h3 className="font-heading text-2xl font-bold tracking-tight text-cafe-espresso text-balance sm:text-3xl">
            Brew ratio and pour calculator
          </h3>
        </div>
        <p className="max-w-md text-xs text-cafe-espresso/80 sm:text-sm">
          Dial in precision ratios used daily on our brew bar for your home setup.
        </p>
      </div>

      {/* 1. Brew Method Selection Tabs */}
      <div className="mt-6 flex flex-col gap-3">
        <label className="text-xs font-medium text-cafe-espresso">
          Select brew equipment:
        </label>
        <div className="flex flex-wrap gap-2">
          {BREW_METHODS.map((method) => {
            const isActive = method.id === activeMethodId;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  setActiveMethodId(method.id);
                  handleResetTimer();
                }}
                className={cn(
                  "rounded-[2px] border px-3.5 py-2 text-xs font-semibold transition-all duration-short",
                  isActive
                    ? "border-cafe-terracotta bg-cafe-terracotta text-cafe-cream shadow-xs"
                    : "border-cafe-border bg-cafe-cream text-cafe-espresso hover:border-cafe-terracotta/60 hover:text-cafe-terracotta",
                )}
              >
                {method.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs italic text-cafe-espresso/75">
          {currentMethod.description}
        </p>
      </div>

      {/* 2. Main Interactive Workspace (Slider & Live Calculations) */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Dose Stepper & Sliders */}
        <div className="flex flex-col gap-6 lg:col-span-6 border border-cafe-border bg-cafe-cream-deep/30 p-5 rounded-[2px]">
          <div className="flex items-center justify-between">
            <label htmlFor="coffee-dose-slider" className="text-xs font-bold uppercase tracking-wider text-cafe-espresso">
              Coffee Dose (grams):
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCoffeeDose((prev) => Math.max(10, prev - 1))}
                aria-label="Decrease dose by 1 gram"
                className="h-8 w-8 rounded-[2px] border border-cafe-border bg-cafe-cream text-base font-bold text-cafe-espresso transition-colors hover:bg-cafe-cream-deep"
              >
                -
              </button>
              <span className="w-16 text-center font-heading text-xl font-black tabular-nums text-cafe-espresso">
                {coffeeDose}g
              </span>
              <button
                type="button"
                onClick={() => setCoffeeDose((prev) => Math.min(60, prev + 1))}
                aria-label="Increase dose by 1 gram"
                className="h-8 w-8 rounded-[2px] border border-cafe-border bg-cafe-cream text-base font-bold text-cafe-espresso transition-colors hover:bg-cafe-cream-deep"
              >
                +
              </button>
            </div>
          </div>

          <input
            id="coffee-dose-slider"
            type="range"
            min="10"
            max="60"
            step="1"
            value={coffeeDose}
            onChange={(e) => setCoffeeDose(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-cafe-terracotta bg-cafe-cream rounded-[2px]"
          />

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-cafe-espresso/70 uppercase">Quick doses:</span>
            {[15, 18, 20, 30].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCoffeeDose(preset)}
                className={cn(
                  "rounded-[2px] border px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors",
                  coffeeDose === preset
                    ? "border-cafe-espresso bg-cafe-espresso text-cafe-cream"
                    : "border-cafe-border bg-cafe-cream text-cafe-espresso hover:border-cafe-terracotta",
                )}
              >
                {preset}g
              </button>
            ))}
          </div>

          {/* Target Recipe Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cafe-border/60">
            <div className="flex flex-col gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-3">
              <div className="flex items-center gap-1.5 text-cafe-olive text-xs font-bold uppercase">
                <Droplets className="h-4 w-4 text-cafe-terracotta" />
                <span>Water Target</span>
              </div>
              <span className="font-heading text-2xl font-black text-cafe-espresso tabular-nums">
                {waterAmountMl} ml
              </span>
              <span className="text-[11px] text-cafe-espresso/70">
                Ratio 1 : {currentMethod.ratio}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-3">
              <div className="flex items-center gap-1.5 text-cafe-olive text-xs font-bold uppercase">
                <Thermometer className="h-4 w-4 text-cafe-terracotta" />
                <span>Water Temp</span>
              </div>
              <span className="font-heading text-2xl font-black text-cafe-espresso">
                {currentMethod.tempC}
              </span>
              <span className="text-[11px] text-cafe-espresso/70">
                Filtered fresh water
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-3">
              <div className="flex items-center gap-1.5 text-cafe-olive text-xs font-bold uppercase">
                <Scale className="h-4 w-4 text-cafe-terracotta" />
                <span>Grind Profile</span>
              </div>
              <span className="font-heading text-base font-bold text-cafe-espresso">
                {currentMethod.grind}
              </span>
              <span className="text-[11px] text-cafe-espresso/70">
                Burr grinder setting
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-3">
              <div className="flex items-center gap-1.5 text-cafe-olive text-xs font-bold uppercase">
                <Clock className="h-4 w-4 text-cafe-terracotta" />
                <span>Target Time</span>
              </div>
              <span className="font-heading text-base font-bold text-cafe-espresso tabular-nums">
                {currentMethod.timeSec > 3600
                  ? "12 - 14 hrs"
                  : formatTimer(currentMethod.timeSec)}
              </span>
              <span className="text-[11px] text-cafe-espresso/70">
                Total contact time
              </span>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Pour Guide with Live Stopwatch */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-6 rounded-[2px] border border-cafe-border bg-cafe-cream p-5">
          <div>
            <div className="flex items-center justify-between border-b border-cafe-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cafe-espresso">
                Pour Schedule for {coffeeDose}g:
              </span>
              <span className="rounded-[2px] bg-cafe-cream-deep px-2 py-0.5 text-[11px] font-semibold text-cafe-terracotta">
                Step by step
              </span>
            </div>

            <ol className="mt-4 flex flex-col gap-3 text-xs sm:text-sm text-cafe-espresso/85">
              {currentMethod.bloomWaterPercent > 0 && (
                <li className="flex items-start gap-3 rounded-[2px] bg-cafe-cream-deep/40 p-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-cafe-terracotta font-heading font-bold text-cafe-cream text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-cafe-espresso font-bold">Bloom Phase:</strong> Pour{" "}
                    <span className="font-bold text-cafe-terracotta tabular-nums">{bloomWaterMl} ml</span> of water. Swirl gently and let ground coffee de-gas for{" "}
                    <span className="tabular-nums">{currentMethod.bloomTimeSec} seconds</span>.
                  </div>
                </li>
              )}

              <li className="flex items-start gap-3 rounded-[2px] bg-cafe-cream-deep/40 p-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-cafe-espresso font-heading font-bold text-cafe-cream text-xs">
                  {currentMethod.bloomWaterPercent > 0 ? "2" : "1"}
                </span>
                <div>
                  <strong className="text-cafe-espresso font-bold">Main Extraction:</strong> Pour in gentle concentric circles until total scale reads{" "}
                  <span className="font-bold text-cafe-espresso tabular-nums">{waterAmountMl} ml</span>.
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-[2px] bg-cafe-cream-deep/40 p-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-cafe-olive font-heading font-bold text-cafe-cream text-xs">
                  {currentMethod.bloomWaterPercent > 0 ? "3" : "2"}
                </span>
                <div>
                  <strong className="text-cafe-espresso font-bold">Drawdown & Serve:</strong> Allow water to filter completely through bed. Discard grounds and enjoy warm.
                </div>
              </li>
            </ol>
          </div>

          {/* Interactive Live Timer (for methods under 10 minutes) */}
          {currentMethod.timeSec <= 600 && (
            <div className="flex flex-col gap-3 rounded-[2px] border border-cafe-border bg-cafe-espresso p-4 text-cafe-cream">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cafe-cream/80">
                  Live Brew Stopwatch
                </span>
                <span className="text-[11px] text-cafe-cream/70">
                  Target: {formatTimer(currentMethod.timeSec)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black tabular-nums tracking-wider text-cafe-cream sm:text-4xl">
                    {formatTimer(elapsedSec)}
                  </span>
                  {isTimerFinished && (
                    <span className="text-xs font-bold text-cafe-terracotta uppercase">
                      Target reached!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="flex items-center gap-1.5 rounded-[2px] bg-cafe-terracotta px-3 py-1.5 text-xs font-bold text-cafe-cream shadow-xs transition-colors hover:bg-cafe-terracotta/90"
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>{elapsedSec === 0 ? "Start Timer" : "Resume"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetTimer}
                    aria-label="Reset stopwatch"
                    className="rounded-[2px] border border-cafe-cream/30 p-1.5 text-cafe-cream/80 transition-colors hover:bg-cafe-cream/10 hover:text-cafe-cream"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
