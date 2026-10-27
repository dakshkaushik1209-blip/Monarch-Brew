"use client";

import React, { useState, useEffect } from "react";

interface HourRow {
  days: string;
  hours: string;
}

interface OpeningHoursTableProps {
  hoursTable: HourRow[];
  kitchenCloses: string;
}

export function OpeningHoursTable({ hoursTable, kitchenCloses }: OpeningHoursTableProps) {
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hoursTable.length === 1) {
      setCurrentDayIndex(0);
      return;
    }
    try {
      const weekdayStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
      }).format(new Date());
      const map: Record<string, number> = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 1,
        Sun: 2,
      };
      setCurrentDayIndex(map[weekdayStr] ?? 0);
    } catch {
      setCurrentDayIndex(0);
    }
  }, [hoursTable.length]);

  return (
    <div className="flex flex-col gap-3">
      <dl className="divide-y divide-cafe-border border-y border-cafe-border text-xs">
        {hoursTable.map((row, index) => {
          const isToday = currentDayIndex === index;
          return (
            <div
              key={row.days}
              className={`flex items-center justify-between py-3 transition-colors duration-150 ease-out ${
                isToday ? "bg-cafe-cream-deep/80 px-2.5 rounded-[2px] font-medium" : ""
              }`}
            >
              <dt className="flex items-center gap-2 text-cafe-espresso">
                <span>{row.days}</span>
                {isToday && (
                  <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cafe-terracotta">
                    Today
                  </span>
                )}
              </dt>
              <dd className="font-semibold text-cafe-espresso tabular-nums">{row.hours}</dd>
            </div>
          );
        })}
      </dl>

      <p className="text-xs text-cafe-olive">
        {kitchenCloses}
      </p>
    </div>
  );
}
