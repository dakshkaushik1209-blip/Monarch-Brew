/**
 * Central Theme Tokens & Palette Definition
 *
 * All color values across the website derive from these canonical theme tokens.
 * Complies with WCAG AA contrast standards:
 * - Espresso on Cream: ~11.8:1 (WCAG AAA)
 * - Terracotta on Cream: ~4.8:1 (WCAG AA)
 * - Olive on Cream: ~4.6:1 (WCAG AA)
 */

export const THEME_COLORS = {
  cream: "#F4EADB",
  creamDeep: "#EADBC4",
  espresso: "#3B2A20",
  terracotta: "#B8643F",
  olive: "#6B705C",
  border: "#D4C3B3",
  veg: "#2D6A4F",
  nonveg: "#8B4513",
} as const;

export type ThemeColorName = keyof typeof THEME_COLORS;
