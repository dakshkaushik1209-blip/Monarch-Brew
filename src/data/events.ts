// NOTE: This is a SAMPLE data structure to be populated per cafe. Real events will be listed here.

export interface CafeEvent {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string;
  description: string;
  photo?: string;
}

export const cafeEvents: CafeEvent[] = [
  {
    id: "cupping-workshop",
    title: "Community Coffee Cupping & Roast Tasting",
    date: "2026-11-07",
    time: "11:00 AM",
    description: "Explore aroma profiles, sweetness, and acidity across three single-origin estate beans with our roaster.",
    photo: "/images/events/cupping-workshop.jpg",
  },
  {
    id: "acoustic-courtyard",
    title: "Acoustic Courtyard Music Session",
    date: "2026-11-14",
    time: "6:30 PM",
    description: "An evening of gentle acoustic sets and conversation under courtyard festoon lights.",
    photo: "/images/events/acoustic-evening.jpg",
  },
];
