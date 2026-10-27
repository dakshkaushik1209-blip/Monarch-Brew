import { CAFE_HOURS, getOpeningStatus, OpeningStatus } from "./hours";

export interface CafeAddress {
  unit?: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  postcode: string; // Alias for backward compatibility
  country: string;
  neighborhood: string;
  display: string;
  directions?: string;
  mapsUrl: string;
}

export interface CafeConfig {
  name: string;
  tagline: string;
  hero: {
    headline: string;
    script: string;
  };
  description: string;
  about: string[];
  aboutSentence: string;
  aboutIntro: string;
  aboutParagraphs: string[];
  facts: Array<{
    label: string;
    detail: string;
  }>;
  todaySpecial?: {
    name: string;
    description: string;
    price: string;
  } | null;
  address: CafeAddress;
  whatsapp?: string | null;
  contact: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
  };
  hours: {
    openTime: string;
    closeTime: string;
    summary: string;
    weekday: string;
    saturday: string;
    sunday: string;
    kitchenCloses?: string;
    timezone: string;
  };
  hoursTable: Array<{
    days: string;
    hours: string;
  }>;
  social: {
    instagram: string | null;
    facebook: string | null;
  };
  navigation: Array<{
    label: string;
    href: string;
  }>;
  legal: {
    privacyLastUpdated: string;
    termsLastUpdated: string;
    menuLastUpdated: string;
    jurisdiction?: string;
  };
  websiteBy: {
    name: string | null;
    url: string | null;
  } | null;
  creator: {
    name: string | null;
    url: string | null;
  };
  siteUrl: string;
}

const unit = ""; // Optional unit/shop number, empty by default
const street = "RDC";
const area = "Raj Nagar";
const city = "Ghaziabad";
const state = "Uttar Pradesh";
const postalCode = "201002";
const country = "IN";

const baseAddress = `${street}, ${area}, ${city} ${postalCode}`;
const displayAddress = unit ? `${unit}, ${baseAddress}` : baseAddress;
const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  displayAddress
)}`;

export const cafeConfig: CafeConfig = {
  name: "Monarch Brew",
  tagline: "Slow roasts and fresh bakes.",
  hero: {
    headline: "Slow roasts and",
    script: "fresh bakes.",
  },
  description:
    "Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad. Filter coffee, cold brews, chai, fresh bakes and a short snack menu.",
  about: [
    "Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad.",
    "The menu is short: filter coffee, espresso drinks, cold brews, chai, a few bakes and a few snacks.",
    "Everything on the menu is vegetarian.",
  ],
  aboutSentence: "Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad.",
  aboutIntro:
    "Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad. The menu is short: filter coffee, espresso drinks, cold brews, chai, a few bakes and a few snacks. Everything on the menu is vegetarian.",
  aboutParagraphs: [
    "Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad.",
    "The menu is short: filter coffee, espresso drinks, cold brews, chai, a few bakes and a few snacks.",
    "Everything on the menu is vegetarian.",
  ],
  facts: [], // Left empty so sourcing/fact section stays hidden
  todaySpecial: null,
  whatsapp: "",
  address: {
    unit,
    street,
    area,
    city,
    state,
    postalCode,
    postcode: postalCode,
    country,
    neighborhood: area,
    display: displayAddress,
    directions: "",
    mapsUrl: googleMapsSearchUrl,
  },
  contact: {
    phone: "+91 120 456 7890",
    whatsapp: "",
    email: "hello@monarchbrew.in",
  },
  hours: {
    openTime: CAFE_HOURS.openTimeLabel,
    closeTime: CAFE_HOURS.closeTimeLabel,
    summary: CAFE_HOURS.summary,
    weekday: "Monday to Sunday: 10:00 AM to 11:00 PM",
    saturday: "Saturday: 10:00 AM to 11:00 PM",
    sunday: "Sunday: 10:00 AM to 11:00 PM",
    kitchenCloses: "Kitchen closes at 10:30 PM daily",
    timezone: CAFE_HOURS.timezone,
  },
  hoursTable: CAFE_HOURS.table,
  social: {
    instagram: "",
    facebook: "",
  },
  navigation: [
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Visit", href: "/visit" },
  ],
  legal: {
    privacyLastUpdated: "October 2026",
    termsLastUpdated: "October 2026",
    menuLastUpdated: "October 2026",
    jurisdiction: "",
  },
  websiteBy: null,
  creator: {
    name: null,
    url: null,
  },
  siteUrl: "https://monarchbrew.in",
};

export { getOpeningStatus };
export type { OpeningStatus };
