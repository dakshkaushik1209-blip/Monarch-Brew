export interface CafeConfig {
  name: string;
  tagline: string;
  description: string;
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
  address: {
    street: string;
    city: string;
    postcode: string;
    neighborhood: string;
    directions: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
    kitchenCloses: string;
    summary: string;
  };
  hoursTable: Array<{
    days: string;
    hours: string;
  }>;
  social: {
    instagram: string;
    facebook: string;
  };
  navigation: Array<{
    label: string;
    href: string;
  }>;
  legal: {
    privacyLastUpdated: string;
    termsLastUpdated: string;
    menuLastUpdated: string;
  };
  creator: {
    name: string;
    url: string;
  };
  siteUrl: string;
}

export const cafeConfig: CafeConfig = {
  name: "[Cafe name]",
  tagline: "Independent coffee and seasonal bakery",
  description: "Specialty coffee, sourdough toast, and small batch pastries made fresh each morning.",
  aboutSentence: "An independent workshop for single-origin espresso, long fermented breads, and neighborhood gatherings.",
  aboutIntro: "We roast single-origin beans in small weekly batches and prepare natural sourdough bakes every morning. All dairy and grains are sourced directly from independent regional producers. Our space on [Street address] includes indoor counter seating and shared work tables.",
  aboutParagraphs: [
    "We opened this space with a direct purpose: to brew clean, balanced coffee from regional growers, bake slow-fermented bread without chemical additives, and create a calm room for our neighbors.",
    "Our coffee program centers on ethical smallholder estates in Karnataka and Coorg. Every lot is roast-profiled on site in small quantities and ground fresh for each espresso extraction and manual pour over.",
    "The bakery operates on long 24-hour fermentation schedules using stone-ground wheat and cultured dairy. Nothing comes frozen or pre-mixed. When today's bakes are finished, the kitchen closes at 3:00 PM.",
  ],
  facts: [
    { label: "Beans", detail: "[Roaster name], single-estate Arabica roasted in [City]" },
    { label: "Milk", detail: "[Dairy name], fresh unadulterated farm milk delivered daily" },
    { label: "Flour", detail: "Stone-ground unbleached grains from [Regional mill]" },
    { label: "Water", detail: "Four-stage reverse osmosis filtration with balanced remineralization" },
    { label: "Bakes", detail: "Naturally leavened sourdough and laminated butter pastries baked fresh each morning" },
  ],
  todaySpecial: {
    name: "Cardamom Bun",
    description: "Twisted sourdough pastry with freshly crushed green cardamom and Swedish pearl sugar",
    price: "₹180",
  },
  address: {
    street: "[Street address]",
    city: "[City]",
    postcode: "[Postcode]",
    neighborhood: "[Neighborhood / Landmark]",
    directions: "Two blocks south of [Local station or square].",
  },
  contact: {
    phone: "[Phone number]",
    email: "[Email address]",
  },
  hours: {
    weekday: "Monday to Friday: 7:00 AM to 5:00 PM",
    saturday: "Saturday: 8:00 AM to 5:00 PM",
    sunday: "Sunday: 8:30 AM to 4:00 PM",
    kitchenCloses: "Kitchen closes at 3:00 PM daily",
    summary: "Open daily from 7:00 AM. Kitchen closes at 3:00 PM.",
  },
  hoursTable: [
    { days: "Monday to Friday", hours: "7:00 AM to 5:00 PM" },
    { days: "Saturday", hours: "8:00 AM to 5:00 PM" },
    { days: "Sunday", hours: "8:30 AM to 4:00 PM" },
  ],
  social: {
    instagram: "https://instagram.com/[handle]",
    facebook: "https://facebook.com/[handle]",
  },
  navigation: [
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Visit", href: "/visit" },
  ],
  legal: {
    privacyLastUpdated: "January 2026",
    termsLastUpdated: "January 2026",
    menuLastUpdated: "October 2026",
  },
  creator: {
    name: "[Your name]",
    url: "https://example.com",
  },
  siteUrl: "https://example-cafe.com",
};
