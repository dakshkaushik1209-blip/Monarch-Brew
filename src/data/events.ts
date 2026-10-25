// NOTE: This is a SAMPLE data structure to be populated per cafe. Real events will be listed here.

export interface CafeEvent {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string;
  description: string;
  photo?: string;
}

// Left empty by default so no fake events or dates are rendered
export const cafeEvents: CafeEvent[] = [];
