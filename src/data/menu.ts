// SAMPLE DATA, replace per cafe.

export type DietType = "veg" | "non-veg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  diet: DietType;
  allergens: string[];
  isNew?: boolean;
  photo?: {
    src?: string;
    label: string;
    aspectRatio?: "1/1" | "4/3" | "16/9" | "3/4" | "4/5";
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
    description: "Espresso and traditional filter coffee.",
    items: [
      {
        id: "filter-coffee",
        name: "Filter Coffee",
        description: "South Indian style decoction with hot milk and sugar.",
        price: 140,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/filter-coffee.jpg",
          label: "Traditional South Indian filter coffee in dabarah",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Double espresso, steamed milk, and a layer of foam.",
        price: 190,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/cappuccino.jpg",
          label: "Cappuccino with tulip latte art microfoam",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cafe-latte",
        name: "Cafe Latte",
        description: "Double espresso with steamed milk and a thin layer of foam.",
        price: 200,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/cafe-latte.jpg",
          label: "Steamed whole milk and espresso latte",
          aspectRatio: "4/3",
        },
      },
      {
        id: "americano",
        name: "Americano",
        description: "Double espresso topped with hot water.",
        price: 160,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/americano.jpg",
          label: "Double espresso topped with hot water",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "cold-brews",
    name: "Cold Brews",
    description: "Slow-steeped cold coffee drinks served chilled.",
    items: [
      {
        id: "classic-cold-brew",
        name: "Classic Cold Brew",
        description: "Coarse ground coffee steeped in cold water for 16 hours, served over ice.",
        price: 210,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/classic-cold-brew.jpg",
          label: "16-hour slow steeped cold brew on ice",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cold-brew-with-milk",
        name: "Cold Brew with Milk",
        description: "Classic cold brew with a splash of milk, served over ice.",
        price: 230,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/cold-brew-with-milk.jpg",
          label: "Slow steeped cold brew with milk swirl",
          aspectRatio: "4/3",
        },
      },
      {
        id: "hazelnut-cold-brew",
        name: "Hazelnut Cold Brew",
        description: "Cold brew with hazelnut syrup and a splash of milk.",
        price: 250,
        diet: "veg",
        allergens: ["milk", "tree nuts"],
        photo: {
          src: "/images/menu/hazelnut-cold-brew.jpg",
          label: "Cold brew with hazelnut cream swirl",
          aspectRatio: "4/3",
        },
      },
      {
        id: "iced-americano",
        name: "Iced Americano",
        description: "Double espresso over ice and water.",
        price: 180,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/iced-americano.jpg",
          label: "Chilled double espresso over ice cubes",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "tea",
    name: "Tea",
    description: "Simmered spiced chai and brewed teas.",
    items: [
      {
        id: "masala-chai",
        name: "Masala Chai",
        description: "Black tea simmered with milk, ginger, cardamom, and sugar.",
        price: 90,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/masala-chai.jpg",
          label: "Simmered spiced chai with cardamom and ginger",
          aspectRatio: "4/3",
        },
      },
      {
        id: "kesar-chai",
        name: "Kesar Chai",
        description: "Masala chai finished with saffron.",
        price: 130,
        diet: "veg",
        allergens: ["milk"],
        photo: {
          src: "/images/menu/kesar-chai.jpg",
          label: "Spiced masala chai infused with saffron",
          aspectRatio: "4/3",
        },
      },
      {
        id: "ginger-lemon-honey-tea",
        name: "Ginger Lemon Honey Tea",
        description: "Hot water with ginger, lemon, and honey.",
        price: 120,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/ginger-lemon-honey-tea.jpg",
          label: "Steeped fresh ginger with wild honey and lemon",
          aspectRatio: "4/3",
        },
      },
      {
        id: "lemon-iced-tea",
        name: "Lemon Iced Tea",
        description: "Black tea, lemon, and sugar syrup over ice.",
        price: 150,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/lemon-iced-tea.jpg",
          label: "Chilled brewed black tea with lemon slices",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "bakes-and-desserts",
    name: "Bakes and Desserts",
    description: "Pastries, rolls, and cakes.",
    items: [
      {
        id: "butter-croissant",
        name: "Butter Croissant",
        description: "Laminated butter pastry.",
        price: 140,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/butter-croissant.jpg",
          label: "Flaky layered golden French butter croissant",
          aspectRatio: "4/3",
        },
      },
      {
        id: "almond-croissant",
        name: "Almond Croissant",
        description: "Butter croissant filled with almond cream and topped with flaked almonds.",
        price: 190,
        diet: "veg",
        allergens: ["gluten", "milk", "tree nuts"],
        photo: {
          src: "/images/menu/almond-croissant.jpg",
          label: "Twice-baked croissant with flaked almonds",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cinnamon-roll",
        name: "Cinnamon Roll",
        description: "Sweet bread roll with cinnamon sugar and a sugar glaze.",
        price: 170,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/cinnamon-roll.jpg",
          label: "Spiced cinnamon roll with warm vanilla glaze",
          aspectRatio: "4/3",
        },
      },
      {
        id: "walnut-brownie",
        name: "Walnut Brownie",
        description: "Chocolate brownie with walnut pieces.",
        price: 160,
        diet: "veg",
        allergens: ["gluten", "milk", "eggs", "tree nuts"],
        photo: {
          src: "/images/menu/walnut-brownie.jpg",
          label: "Fudgy dark chocolate walnut brownie square",
          aspectRatio: "4/3",
        },
      },
      {
        id: "banana-loaf-slice",
        name: "Banana Loaf Slice",
        description: "Banana loaf cake, cut fresh from the loaf.",
        price: 130,
        diet: "veg",
        allergens: ["gluten", "milk", "eggs"],
        photo: {
          src: "/images/menu/banana-loaf-slice.jpg",
          label: "Moist freshly baked banana loaf slice",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Sandwiches, wraps, and toast.",
    items: [
      {
        id: "veg-grilled-sandwich",
        name: "Veg Grilled Sandwich",
        description: "Grilled bread with cheese, tomato, cucumber, capsicum, and green chutney.",
        price: 170,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/veg-grilled-sandwich.jpg",
          label: "Toasted sourdough sandwich with melted cheese",
          aspectRatio: "4/3",
        },
      },
      {
        id: "paneer-tikka-wrap",
        name: "Paneer Tikka Wrap",
        description: "Tandoori paneer, onion, capsicum, and mint chutney in a flatbread wrap.",
        price: 220,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/paneer-tikka-wrap.jpg",
          label: "Char-grilled paneer tikka wrap with mint chutney",
          aspectRatio: "4/3",
        },
      },
      {
        id: "peri-peri-fries",
        name: "Peri Peri Fries",
        description: "Fries tossed in peri peri seasoning.",
        price: 150,
        diet: "veg",
        allergens: [],
        photo: {
          src: "/images/menu/peri-peri-fries.jpg",
          label: "Crispy seasoned fries tossed in peri peri spice",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cheese-garlic-toast",
        name: "Cheese Garlic Toast",
        description: "Toasted bread with garlic butter and melted cheese.",
        price: 140,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/cheese-garlic-toast.jpg",
          label: "Rustic garlic sourdough toast with melted cheese",
          aspectRatio: "4/3",
        },
      },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    description: "Drink and food pairings.",
    items: [
      {
        id: "cappuccino-and-butter-croissant",
        name: "Cappuccino and Butter Croissant",
        description: "One cappuccino and one butter croissant.",
        price: 299,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/cappuccino.jpg",
          label: "Cappuccino and fresh butter croissant pairing",
          aspectRatio: "4/3",
        },
      },
      {
        id: "cold-brew-and-walnut-brownie",
        name: "Cold Brew and Walnut Brownie",
        description: "One classic cold brew and one walnut brownie.",
        price: 349,
        diet: "veg",
        allergens: ["gluten", "milk", "eggs", "tree nuts"],
        photo: {
          src: "/images/menu/classic-cold-brew.jpg",
          label: "Classic cold brew and dark chocolate brownie",
          aspectRatio: "4/3",
        },
      },
      {
        id: "masala-chai-and-veg-grilled-sandwich",
        name: "Masala Chai and Veg Grilled Sandwich",
        description: "One masala chai and one veg grilled sandwich.",
        price: 239,
        diet: "veg",
        allergens: ["gluten", "milk"],
        photo: {
          src: "/images/menu/masala-chai.jpg",
          label: "Simmered masala chai and veg grilled sandwich",
          aspectRatio: "4/3",
        },
      },
    ],
  },
];

export const allMenuItems: MenuItem[] = menuCategories.flatMap(
  (category) => category.items
);

// Home page "What people order here" four items, automatically derived
const POPULAR_ITEM_IDS = [
  "filter-coffee",
  "hazelnut-cold-brew",
  "masala-chai",
  "almond-croissant",
];

export const popularItems: MenuItem[] = POPULAR_ITEM_IDS.map((id) => {
  const found = allMenuItems.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Popular menu item "${id}" not found in menuCategories`);
  }
  return found;
});
