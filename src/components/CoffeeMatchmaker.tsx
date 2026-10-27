"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { AnimatedButton } from "@/components/AnimatedButton";

interface Recommendation {
  drink: string;
  drinkPrice: number;
  drinkDesc: string;
  food: string;
  foodPrice: number;
  foodDesc: string;
  matchReason: string;
}

const RECOMMENDATIONS: Record<string, Recommendation> = {
  black: {
    drink: "Manual Pour Over",
    drinkPrice: 220,
    drinkDesc: "Single-origin Karnataka estate Arabica brewed through V60 paper for maximum clarity.",
    food: "Country Sourdough Toast",
    foodPrice: 160,
    foodDesc: "Thick slice of naturally leavened bread with salted country butter.",
    matchReason: "You enjoy clean, terroir-driven acidity and deep natural aromatics without sugar.",
  },
  milk: {
    drink: "Flat White",
    drinkPrice: 190,
    drinkDesc: "Double shot of espresso folded with silky textured whole milk and velvet microfoam.",
    food: "Almond Croissant",
    foodPrice: 210,
    foodDesc: "Twice-baked butter croissant filled with frangipane and toasted almonds.",
    matchReason: "A rich, balanced milk pairing that softens dark espresso roast notes with buttery sweetness.",
  },
  chilled: {
    drink: "Hazelnut Cold Brew",
    drinkPrice: 210,
    drinkDesc: "14-hour steeped coarse ground coffee with house hazelnut infusion over dense ice.",
    food: "Cardamom Bun",
    foodPrice: 180,
    foodDesc: "Twisted sourdough pastry with freshly crushed green cardamom and pearl sugar.",
    matchReason: "Chilled cocoa finish contrasted with the warm aromatic punch of crushed cardamom.",
  },
  traditional: {
    drink: "Filter Coffee",
    drinkPrice: 140,
    drinkDesc: "Chicory-free Karnataka estate coffee brewed in brass drip filter with hot whole milk.",
    food: "Cardamom Bun",
    foodPrice: 180,
    foodDesc: "Twisted sourdough pastry with freshly crushed green cardamom and Swedish pearl sugar.",
    matchReason: "The authentic neighborhood staple. Strong decoction body paired with bakery warmth.",
  },
};

export function CoffeeMatchmaker() {
  const [step, setStep] = useState<number>(1);
  const [prefCoffee, setPrefCoffee] = useState<string>("");
  const [prefSweet, setPrefSweet] = useState<string>("");
  const [prefTime, setPrefTime] = useState<string>("");
  const [resultKey, setResultKey] = useState<string | null>(null);

  const handleSelectCoffee = (key: string) => {
    setPrefCoffee(key);
    setStep(2);
  };

  const handleSelectSweet = (key: string) => {
    setPrefSweet(key);
    setStep(3);
  };

  const handleSelectTime = (key: string) => {
    setPrefTime(key);
    void prefSweet;
    void prefTime;
    // Determine result
    let keyResult = "traditional";
    if (prefCoffee === "black") {
      keyResult = "black";
    } else if (prefCoffee === "chilled") {
      keyResult = "chilled";
    } else if (prefCoffee === "milk") {
      keyResult = "milk";
    }
    setResultKey(keyResult);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setPrefCoffee("");
    setPrefSweet("");
    setPrefTime("");
    setResultKey(null);
  };

  const currentMatch = resultKey ? RECOMMENDATIONS[resultKey] : null;

  return (
    <div className="w-full rounded-[2px] border border-cafe-border bg-[#FDFBF7] p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-cafe-border pb-5">
        <div>
          <span className="text-xs font-medium text-cafe-terracotta">
            Taste matchmaker
          </span>
          <h3 className="mt-1 font-heading text-2xl font-bold tracking-tight text-cafe-espresso text-balance sm:text-3xl">
            Find your morning pairing
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-cafe-olive">
          <span>Step {Math.min(step, 3)} of 3</span>
        </div>
      </div>

      {/* Step 1: Coffee Profile */}
      {step === 1 && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm font-bold text-cafe-espresso sm:text-base">
            1. How do you like your coffee brewed?
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { id: "black", label: "Black & Pure", desc: "No milk or sugar, focus on bean terroir & origin notes" },
              { id: "milk", label: "Silky & Milky", desc: "Dense microfoam, flat white, cappuccino or latte" },
              { id: "chilled", label: "Chilled & Refreshing", desc: "Cold brew over ice or iced tonic coffee" },
              { id: "traditional", label: "Traditional Filter", desc: "Strong brass drip filter with hot whole milk" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectCoffee(opt.id)}
                className="group flex flex-col items-start gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-4 text-left transition-all duration-short hover:border-cafe-terracotta hover:bg-cafe-cream-deep/60"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-heading text-base font-bold text-cafe-espresso group-hover:text-cafe-terracotta">
                    {opt.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-cafe-terracotta opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="text-xs text-cafe-espresso/75 leading-relaxed">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Flavor Profile */}
      {step === 2 && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm font-bold text-cafe-espresso sm:text-base">
            2. What kind of sweetness or snack do you crave?
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { id: "none", label: "Zero Sweetness", desc: "Unsweetened savory bakery pairing like country sourdough" },
              { id: "cardamom", label: "Warm Spice & Cardamom", desc: "Twisted sourdough pastry with freshly crushed green spice" },
              { id: "almond", label: "Buttery & Nutty", desc: "Twice-baked almond croissant with crisp flaky crust" },
              { id: "chocolate", label: "Dark Chocolate", desc: "Rich single-origin chocolate with deep cacao notes" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectSweet(opt.id)}
                className="group flex flex-col items-start gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-4 text-left transition-all duration-short hover:border-cafe-terracotta hover:bg-cafe-cream-deep/60"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-heading text-base font-bold text-cafe-espresso group-hover:text-cafe-terracotta">
                    {opt.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-cafe-terracotta opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="text-xs text-cafe-espresso/75 leading-relaxed">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Mood / Occasion */}
      {step === 3 && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm font-bold text-cafe-espresso sm:text-base">
            3. What is your cafe mood today?
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { id: "focus", label: "Deep Focus & Work", desc: "Steady caffeine curve for laptop or reading session" },
              { id: "morning", label: "Quick Morning Spark", desc: "Fast espresso or filter pull to kickstart the day" },
              { id: "relax", label: "Courtyard Unwind", desc: "Slow manual brew and leisure time in the patio" },
              { id: "social", label: "Catching up with a friend", desc: "Sharing pastries and drinks across a wood table" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTime(opt.id)}
                className="group flex flex-col items-start gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream p-4 text-left transition-all duration-short hover:border-cafe-terracotta hover:bg-cafe-cream-deep/60"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-heading text-base font-bold text-cafe-espresso group-hover:text-cafe-terracotta">
                    {opt.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-cafe-terracotta opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="text-xs text-cafe-espresso/75 leading-relaxed">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Result Card */}
      {step === 4 && currentMatch && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="rounded-[2px] border border-cafe-terracotta/70 bg-cafe-cream-deep/40 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-cafe-terracotta">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Your Curated Cafe Order
              </span>
            </div>

            <p className="mt-2 text-xs italic text-cafe-espresso/80 sm:text-sm">
              {currentMatch.matchReason}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Drink Card */}
              <div className="flex flex-col justify-between rounded-[2px] border border-cafe-border bg-[#FAF5ED] p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cafe-olive">
                    Recommended Drink
                  </span>
                  <h4 className="mt-1 font-heading text-lg font-bold text-cafe-espresso">
                    {currentMatch.drink}
                  </h4>
                  <p className="mt-1 text-xs text-cafe-espresso/75 leading-relaxed">
                    {currentMatch.drinkDesc}
                  </p>
                </div>
                <div className="mt-4 border-t border-cafe-border pt-2 text-right">
                  <span className="font-heading text-base font-bold text-cafe-espresso">
                    ₹{currentMatch.drinkPrice}
                  </span>
                </div>
              </div>

              {/* Food Card */}
              <div className="flex flex-col justify-between rounded-[2px] border border-cafe-border bg-[#FAF5ED] p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cafe-olive">
                    Bakery Pairing
                  </span>
                  <h4 className="mt-1 font-heading text-lg font-bold text-cafe-espresso">
                    {currentMatch.food}
                  </h4>
                  <p className="mt-1 text-xs text-cafe-espresso/75 leading-relaxed">
                    {currentMatch.foodDesc}
                  </p>
                </div>
                <div className="mt-4 border-t border-cafe-border pt-2 text-right">
                  <span className="font-heading text-base font-bold text-cafe-espresso">
                    ₹{currentMatch.foodPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Total and Actions */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-cafe-border/80 pt-4">
              <div>
                <span className="text-xs text-cafe-espresso/70">Combo Order Total:</span>
                <p className="font-heading text-2xl font-black text-cafe-espresso">
                  ₹{currentMatch.drinkPrice + currentMatch.foodPrice}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <AnimatedButton href="/menu" variant="primary" className="px-4 py-2 text-xs">
                  View Full Menu
                </AnimatedButton>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-[2px] border border-cafe-border bg-cafe-cream px-3 py-2 text-xs font-semibold text-cafe-espresso transition-colors hover:bg-cafe-cream-deep"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
