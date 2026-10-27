/**
 * Opening hours and real-time status calculator.
 * All computations strictly evaluated in Asia/Kolkata timezone.
 * Hours: Every day 10:00 AM to 11:00 PM (10:00 to 23:00).
 */

export interface OpeningStatus {
  isOpen: boolean;
  statusText: string;
  hoursSummary: string;
  scheduleText: string;
}

export const CAFE_HOURS = {
  openHour: 10,
  openMinute: 0,
  closeHour: 23,
  closeMinute: 0,
  openTimeLabel: "10:00 AM",
  closeTimeLabel: "11:00 PM",
  summary: "Open daily from 10:00 AM to 11:00 PM.",
  table: [
    { days: "Monday to Sunday", hours: "10:00 AM to 11:00 PM" },
  ],
  timezone: "Asia/Kolkata",
};

/**
 * Computes opening status for a given Date in Asia/Kolkata timezone.
 */
export function getOpeningStatus(date: Date = new Date()): OpeningStatus {
  // Format parts in Asia/Kolkata timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CAFE_HOURS.timezone,
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });

  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  const currentMinutes = hour * 60 + minute;

  const openMinutes = CAFE_HOURS.openHour * 60 + CAFE_HOURS.openMinute; // 600 (10:00 AM)
  const closeMinutes = CAFE_HOURS.closeHour * 60 + CAFE_HOURS.closeMinute; // 1380 (11:00 PM)

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  let statusText = "";
  if (isOpen) {
    statusText = "Open until 11:00 PM";
  } else if (currentMinutes < openMinutes) {
    statusText = "Opens today at 10:00 AM";
  } else {
    statusText = "Opens tomorrow at 10:00 AM";
  }

  return {
    isOpen,
    statusText,
    hoursSummary: CAFE_HOURS.summary,
    scheduleText: "10:00 AM to 11:00 PM daily",
  };
}

/**
 * Reservation time slots in half-hour increments from 10:00 AM to 10:00 PM.
 */
export const RESERVATION_TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];
