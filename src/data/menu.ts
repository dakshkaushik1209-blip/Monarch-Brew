// NOTE: This is SAMPLE data to be replaced per cafe. Real menu items and prices will vary.

import type { PhotoAspectRatio } from "@/components/Photo";

export type DietType = "veg" | "non-veg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  diet: DietType;
  allergens: string[];
  isNew?: boolean;
  featured?: boolean;
  photo?: {
    label: string;
    aspectRatio?: PhotoAspectRatio;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export function formatPrice(price: number): string {
  return `₹${price}`;
}

export const menuCategories: MenuCategory[] = [
  {
    id: "coffee",
    name: "Coffee",
    description: "Espresso and manual brews prepared with ethical Karnataka and Coorg estate beans.",
    items: [
      {
        id: "filter-coffee",
        name: "Filter Coffee",
        description: "Chicory-free Karnataka estate Arabica brewed in a traditional brass drip filter, mixed with hot whole milk.",
        price: 140,
        diet: "veg",
        allergens: ["dairy"],
        featured: true,
      },
      {
        id: "double-espresso",
        name: "Double Espresso",
        description: "Two concentrated shots of medium-roast Chikmagalur Arabica with golden crema.",
        price: 160,
        diet: "veg",
        allergens: [],
      },
      {
        id: "americano",
        name: "Americano",
        description: "Double shot of espresso diluted with hot filtered water for a clean, prolonged cup.",
        price: 170,
        diet: "veg",
        allergens: [],
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Equal proportions of espresso, steamed milk, and dense microfoam.",
        price: 190,
        diet: "veg",
        allergens: ["dairy"],
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Double ristretto shot topped with thin, velvety steamed whole milk.",
        price: 210,
        diet: "veg",
        allergens: ["dairy"],
        isNew: true,
      },
      {
        id: "manual-pour-over",
        name: "Manual Pour Over",
        description: "Single-origin Coorg microlot brewed through a V60 cone with light floral notes.",
        price: 220,
        diet: "veg",
        allergens: [],
        photo: {
          label: "V60 single origin manual pour over",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "cold-brews",
    name: "Cold Brews",
    description: "Slow-steeped for 16 to 18 hours in chilled filtered water.",
    items: [
      {
        id: "classic-cold-brew",
        name: "Classic Black Cold Brew",
        description: "Coarse Arabica grounds steeped for 18 hours, served over a dense ice block.",
        price: 200,
        diet: "veg",
        allergens: [],
      },
      {
        id: "hazelnut-cold-brew",
        name: "Hazelnut Cold Brew",
        description: "16-hour steeped black coffee infused with natural roasted hazelnut extract, served chilled.",
        price: 220,
        diet: "veg",
        allergens: ["nuts"],
        featured: true,
      },
      {
        id: "cold-brew-tonic",
        name: "Cold Brew Tonic",
        description: "Double strength cold brew concentrate poured over Indian craft tonic with an orange peel.",
        price: 240,
        diet: "veg",
        allergens: [],
        isNew: true,
      },
      {
        id: "vietnamese-cold-brew",
        name: "Sweet Cold Brew",
        description: "Slow-steeped dark roast cold brew stirred with sweetened condensed milk.",
        price: 230,
        diet: "veg",
        allergens: ["dairy"],
      },
      {
        id: "cascara-sparkling",
        name: "Cascara Sparkling Brew",
        description: "Dried organic coffee cherry husks brewed cold and served with sparkling mineral water.",
        price: 210,
        diet: "veg",
        allergens: [],
      },
    ],
  },
  {
    id: "tea",
    name: "Tea",
    description: "Whole-leaf estates and direct herbal infusions.",
    items: [
      {
        id: "masala-chai",
        name: "Masala Chai",
        description: "Single-estate Assam black tea simmered with fresh ginger, green cardamom, cloves, and milk.",
        price: 120,
        diet: "veg",
        allergens: ["dairy"],
        featured: true,
      },
      {
        id: "darjeeling-first-flush",
        name: "Darjeeling First Flush",
        description: "Spring harvest whole leaf black tea steeped light with amber clarity and muscatel notes.",
        price: 180,
        diet: "veg",
        allergens: [],
      },
      {
        id: "kashmiri-kahwa",
        name: "Kashmiri Kahwa",
        description: "Green tea leaves steeped with Kashmiri saffron strands, whole cinnamon, and crushed almonds.",
        price: 190,
        diet: "veg",
        allergens: ["nuts"],
        isNew: true,
      },
      {
        id: "lemongrass-ginger",
        name: "Lemongrass and Ginger",
        description: "Fresh garden lemongrass stalks and bruised ginger root steeped in hot water. Caffeine free.",
        price: 150,
        diet: "veg",
        allergens: [],
      },
      {
        id: "chamomile-spearmint",
        name: "Chamomile Spearmint",
        description: "Dried whole chamomile blossoms paired with garden spearmint leaves.",
        price: 170,
        diet: "veg",
        allergens: [],
      },
    ],
  },
  {
    id: "bakes-desserts",
    name: "Bakes and Desserts",
    description: "Baked daily in our morning shift using cultured butter and stone-ground flours.",
    items: [
      {
        id: "almond-croissant",
        name: "Almond Croissant",
        description: "Twice-baked butter croissant filled with almond frangipane and topped with sliced almonds.",
        price: 190,
        diet: "veg",
        allergens: ["gluten", "dairy", "nuts"],
        featured: true,
        photo: {
          label: "Twice-baked almond croissant",
          aspectRatio: "4/3",
        },
      },
      {
        id: "sourdough-toast-butter",
        name: "Sourdough Toast with Cultured Butter",
        description: "Two slices of 24-hour fermented country sourdough served warm with house churned butter.",
        price: 160,
        diet: "veg",
        allergens: ["gluten", "dairy"],
      },
      {
        id: "cardamom-bun",
        name: "Cardamom Bun",
        description: "Twisted sourdough pastry with freshly crushed green cardamom and Swedish pearl sugar.",
        price: 180,
        diet: "veg",
        allergens: ["gluten", "dairy"],
        isNew: true,
      },
      {
        id: "banana-walnut-bread",
        name: "Banana Walnut Bread",
        description: "Dense loaf slice prepared with ripe bananas, toasted walnuts, and raw cane sugar.",
        price: 150,
        diet: "veg",
        allergens: ["gluten", "nuts"],
      },
      {
        id: "flourless-chocolate-cake",
        name: "Flourless Chocolate Cake",
        description: "Baked 70 percent Kerala single-origin cacao cake with dense fudge texture.",
        price: 220,
        diet: "veg",
        allergens: ["dairy", "eggs"],
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Light savory plates made to order. Kitchen closes at 3:00 PM.",
    items: [
      {
        id: "wild-mushroom-toast",
        name: "Wild Mushroom Toast",
        description: "Pan-roasted button and oyster mushrooms with thyme garlic butter on grilled sourdough.",
        price: 260,
        diet: "veg",
        allergens: ["gluten", "dairy"],
        photo: {
          label: "Wild mushroom sourdough toast",
          aspectRatio: "4/3",
        },
      },
      {
        id: "herbed-egg-brioche",
        name: "Herbed Egg Brioche",
        description: "Free-range boiled eggs folded with whole grain mustard, chives, and mayonnaise in brioche.",
        price: 240,
        diet: "non-veg",
        allergens: ["gluten", "dairy", "eggs"],
      },
      {
        id: "spiced-hummus-flatbread",
        name: "Spiced Hummus and Flatbread",
        description: "Chickpea tahini spread with cumin chili oil, served with warm sourdough flatbread.",
        price: 220,
        diet: "veg",
        allergens: ["gluten", "sesame"],
      },
      {
        id: "smashed-avocado-toast",
        name: "Smashed Avocado Toast",
        description: "Crushed Hass avocado with lime juice, chili flakes, and toasted pumpkin seeds on sourdough.",
        price: 290,
        diet: "veg",
        allergens: ["gluten"],
      },
      {
        id: "grilled-chicken-pesto",
        name: "Grilled Chicken Pesto Sandwich",
        description: "Herb-roasted chicken breast slices with basil walnut pesto and melted aged cheddar.",
        price: 310,
        diet: "non-veg",
        allergens: ["gluten", "dairy", "nuts"],
        isNew: true,
      },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    description: "Curated coffee and food pairings available all day.",
    items: [
      {
        id: "morning-filter-bake",
        name: "Morning Filter and Bake",
        description: "One traditional brass filter coffee served with your choice of plain or almond croissant.",
        price: 290,
        diet: "veg",
        allergens: ["gluten", "dairy", "nuts"],
      },
      {
        id: "chai-sourdough-set",
        name: "Chai and Sourdough Set",
        description: "Pot of single-estate masala chai accompanied by two thick sourdough slices and butter.",
        price: 250,
        diet: "veg",
        allergens: ["gluten", "dairy"],
      },
      {
        id: "lunch-brew-pairing",
        name: "Lunch Brew Pairing",
        description: "Any 16-hour cold brew paired with the grilled chicken pesto sandwich.",
        price: 480,
        diet: "non-veg",
        allergens: ["gluten", "dairy", "nuts"],
      },
      {
        id: "tasting-set",
        name: "Single-Origin Tasting Set",
        description: "Manual V60 pour over coffee paired with a slice of flourless dark chocolate cake.",
        price: 390,
        diet: "veg",
        allergens: ["dairy", "eggs"],
        isNew: true,
      },
    ],
  },
];

export const allMenuItems: MenuItem[] = menuCategories.flatMap((category) => category.items);

export const popularItems: MenuItem[] = allMenuItems.filter((item) => item.featured);
