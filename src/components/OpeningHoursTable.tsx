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
    const day = new Date().getDay(); // 0 is Sunday, 6 is Saturday
    if (day >= 1 && day <= 5) {
      setCurrentDayIndex(0); // Monday to Friday
    } else if (day === 6) {
      setCurrentDayIndex(1); // Saturday
    } else if (day === 0) {
      setCurrentDayIndex(2); // Sunday
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <dl className="divide-y divide-cafe-border border-y border-cafe-border text-xs">
        {hoursTable.map((row, index) => {
          const isToday = currentDayIndex === index;
          return (
            <div
              key={row.days}
              className={`flex items-center justify-between py-3 transition-colors duration-short ${
                isToday ? "bg-cafe-cream-deep/80 px-2.5 rounded font-medium" : ""
              }`}
            >
              <dt className="flex items-center gap-2 text-cafe-espresso">
                <span>{row.days}</span>
                {isToday && (
                  <span className="inline-block rounded-sm border border-cafe-border bg-cafe-cream px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cafe-terracotta">
                    Today
                  </span>
                )}
              </dt>
              <dd className="font-semibold text-cafe-espresso">{row.hours}</dd>
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
