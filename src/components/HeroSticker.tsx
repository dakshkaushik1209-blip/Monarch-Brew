"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import Link from "next/link";
import { CoffeeCupWithSteam } from "@/components/LineIllustrations";
import { HeroVisual } from "@/components/HeroVisual";
import { cafeConfig, getOpeningStatus, OpeningStatus } from "@/config/cafe";

// ==============================================================================
// 1. ILLUSTRATION COLOR PALETTE
// ONLY place where hex colors are allowed (strict illustration exception)
// ==============================================================================
const ILLUSTRATION_PALETTE = {
  espresso: "#3B2A20",
  espressoDark: "#241710",
  crema: "#C48A54",
  cremaLight: "#D9A066",
  milk: "#FAF5EE",
  croissantGold: "#D89A42",
  croissantShadow: "#B27625",
  chaiTea: "#BA6F38",
  chaiGlass: "#EADBC4",
  chaiGlassShadow: "#D4C3B3",
  beanBody: "#42281D",
  beanDark: "#261A13",
  cinnamonDough: "#E2BC82",
  cinnamonSwirl: "#7B4626",
  cookieDough: "#CCA268",
  cookieDark: "#9E6D38",
  chocolateChunk: "#341E15",
  creamDeep: "#EADBC4",
  paperCreamDeep: "#EADBC4",
  paperTerracotta: "#B8643F",
  paperOlive: "#6B705C",
  paperMustard: "#D4A359",
  paperSand: "#DFCDAF",
} as const;

// ==============================================================================
// 2. MONOLINE SCRIPT ENGINE (SELF-WRITING SCRIPT PHRASE)
// Baseline 0, x-height -100, ascenders -200, descenders +100
// ==============================================================================
export const SCRIPT_STROKE = 34;
export const SCRIPT_TOP = -230;
export const SCRIPT_BOTTOM = 125;

const IN = "M0,-14C6,-20 ";
const out = (w: number) => " " + (w - 7) + ",-7 " + w + ",-14";
const outFlat = (w: number) => " " + (w - 6) + ",-12 " + w + ",-14";
const bowl = (l: number, r: number) => {
  const m = (l + r) / 2;
  return "C" + (m + 6) + ",-104 " + (l + 2) + ",-92 " + l + ",-52C" + (l - 1) + ",-18 " + (l + 12) + ",-3 " + (m - 2) + ",-3C" + (r - 8) + ",-3 " + (r + 2) + ",-30 " + (r + 2) + ",-62";
};
const over = (l: number, r: number) => IN + (l - 2) + ",-50 " + (l + 14) + ",-88C" + (l + 26) + ",-104 " + (r - 10) + ",-104 " + r + ",-94";
const down = (x: number, w: number) => "C" + (x - 1) + ",-60 " + (x - 4) + ",-24 " + (x - 2) + ",-12C" + x + ",-2 " + (x + 8) + ",-1 " + (x + 14) + ",-4C" + (w - 12) + ",-6" + out(w);
const stem = (x: number, top: number, w: number) => "M" + x + "," + top + down(x, w);
const arch = (x0: number, x1: number) => "C" + (x0 + 4) + ",-60 " + (x0 + 14) + ",-98 " + ((x0 + x1) / 2 + 2) + ",-98C" + (x1 + 6) + ",-98 " + (x1 + 4) + ",-70 " + (x1 + 1) + ",-44";
const loopUp = (x: number) => IN + (x + 18) + ",-40 " + (x + 38) + ",-108C" + (x + 52) + ",-152 " + (x + 48) + ",-200 " + (x + 26) + ",-198C" + (x + 4) + ",-196 " + (x - 2) + ",-150 " + x + ",-110";
const loopDown = (x: number, w: number) => "C" + x + ",-30 " + (x - 1) + ",30 " + (x - 6) + ",62C" + (x - 12) + ",94 " + (x - 42) + ",104 " + (x - 48) + ",82C" + (x - 54) + ",58 " + (x - 14) + ",8 " + (x + 12) + ",-6C" + (w - 12) + ",-12" + outFlat(w);
const entry = (x: number) => IN + (x - 4) + ",-50 " + x + ",-96";

export const GLYPHS: Record<string, [number, string]> = {
  a: [100, over(18, 70) + bowl(16, 70) + stem(74, -98, 100)],
  b: [92, loopUp(16) + "C16,-60 15,-30 14,-8C24,-60 40,-98 58,-96C76,-94 76,-60 66,-30C58,-6 38,0 30,-12C40,-14 60,-14 74,-12C80,-12 86,-13 92,-14"],
  c: [80, IN + "16,-50 30,-82C42,-104 70,-104 66,-84C64,-76 58,-80 56,-84C50,-98 22,-96 16,-56C12,-24 26,-3 42,-3C58,-3" + out(80)],
  d: [100, over(18, 70) + bowl(16, 70) + stem(78, -192, 100)],
  e: [80, IN + "36,-40 52,-56C66,-72 66,-100 46,-100C24,-100 14,-74 14,-50C14,-20 28,-3 44,-3C58,-3" + out(80)],
  f: [74, loopUp(16) + "C16,-40 18,30 14,70C12,94 -6,96 -4,74C-2,50 30,-2 46,-8C62,-12" + outFlat(74)],
  g: [96, over(18, 70) + bowl(16, 70) + "M72,-98" + loopDown(72, 96)],
  h: [100, loopUp(16) + "C16,-60 15,-30 14,-2" + arch(14, 70) + down(71, 100)],
  i: [52, entry(26) + down(26, 52) + "M30,-146L30,-146"],
  j: [62, entry(26) + loopDown(26, 62) + "M32,-146L32,-146"],
  k: [96, loopUp(16) + "C16,-60 15,-30 14,-2C22,-56 40,-100 60,-98C80,-96 72,-56 30,-50C48,-44 56,-12 66,-6C72,-2 78,-3 84,-6C88,-8" + out(96)],
  l: [60, loopUp(16) + "C16,-60 14,-30 16,-14C18,-2 26,-1 32,-3C48,-6" + out(60)],
  m: [138, entry(18) + "C18,-60 16,-30 14,-2" + arch(14, 56) + "C56,-30 56,-14 56,-2" + arch(56, 108) + down(109, 138)],
  n: [102, entry(18) + "C18,-60 16,-30 14,-2" + arch(14, 72) + down(73, 102)],
  o: [92, IN + "16,-50 32,-88C30,-104 14,-84 14,-54C14,-22 28,-3 44,-3C62,-3 72,-30 70,-60C68,-90 52,-104 44,-94C38,-86 54,-74 66,-60C72,-52 80,-30 92,-14"],
  p: [96, entry(20) + "L14,92M14,-36C18,-60 28,-98 44,-98C76,-98 78,-60 68,-30C60,-6 40,0 30,-12C42,-14 62,-14 76,-13C82,-13 88,-13 96,-14"],
  q: [100, over(18, 70) + bowl(16, 70) + "M74,-98C73,-40 72,40 70,80C69,96 58,92 62,74C68,40 80,-6 100,-14"],
  r: [80, entry(18) + "C18,-60 16,-30 14,-2C20,-50 34,-90 50,-96C60,-100 64,-90 58,-82C54,-78 50,-82 52,-76C56,-50 56,-16 62,-8C66,-3" + out(80)],
  s: [76, IN + "20,-60 34,-100C40,-76 66,-54 58,-26C52,-2 22,0 10,-18C24,-6 50,-6 62,-10C66,-11" + out(76)],
  t: [72, IN + "20,-80 30,-170" + down(30, 72) + "M8,-104C24,-106 44,-108 62,-110"],
  u: [100, entry(18) + "C16,-60 12,-30 14,-16C16,-2 30,-2 42,-6C56,-12 66,-50 70,-96" + down(70, 100)],
  v: [84, entry(18) + "C18,-60 22,-10 38,-4C56,2 66,-40 64,-96C66,-60 70,-24 78,-18C80,-16 82,-15 84,-14"],
  w: [124, entry(18) + "C16,-60 14,-4 34,-4C50,-4 56,-50 58,-80C58,-50 62,-4 82,-4C98,-4 106,-50 104,-96C106,-60 110,-24 118,-18C120,-16 122,-15 124,-14"],
  x: [92, IN + "18,-60 28,-80C38,-100 54,-100 54,-80C54,-50 50,-20 60,-8C66,-2 72,-4 80,-8C84,-10" + out(92) + "M20,-10C38,-40 58,-74 78,-98"],
  y: [96, entry(18) + "C16,-60 12,-30 14,-16C16,-2 30,-2 42,-6C56,-12 66,-50 70,-96" + loopDown(70, 96)],
  z: [88, IN + "20,-60 36,-90C46,-104 70,-104 64,-80C58,-60 34,-34 18,-10C34,-30 64,-24 60,10C56,60 20,96 12,72C6,52 40,-6 70,-12C76,-13 82,-13 88,-14"],
  "!": [56, "M42,-194C38,-150 32,-96 28,-52M22,-8L22,-8"],
  "?": [72, "M10,-160C14,-196 66,-200 62,-160C60,-128 30,-112 30,-60M26,-8L26,-8"],
  ".": [36, "M16,-8L16,-8"],
  ",": [36, "M20,-8C18,10 12,22 4,30"],
  "'": [30, "M22,-192L16,-140"],
  " ": [44, ""],
};

export type ScriptStroke = { d: string; len: number };
export type ScriptGlyph = { ch: string; x: number; strokes: ScriptStroke[]; dots: [number, number][] };

export const normalise = (word: string) =>
  word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['']/g, "'").toLowerCase();

export const supports = (word: string) => [...normalise(word)].every((ch) => ch in GLYPHS);

export const pathLength = (d: string) => {
  const nums = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  const cmds = d.match(/[MLC]/g) || [];
  let i = 0;
  let x = 0;
  let y = 0;
  let len = 0;
  for (const c of cmds) {
    if (c === "M") {
      x = nums[i++];
      y = nums[i++];
    } else if (c === "L") {
      const nx = nums[i++];
      const ny = nums[i++];
      len += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    } else {
      const p = nums.slice(i, i + 6);
      i += 6;
      let px = x;
      let py = y;
      for (let k = 1; k <= 16; k++) {
        const t = k / 16;
        const u = 1 - t;
        const qx = u * u * u * x + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t * p[4];
        const qy = u * u * u * y + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t * p[5];
        len += Math.hypot(qx - px, qy - py);
        px = qx;
        py = qy;
      }
      x = p[4];
      y = p[5];
    }
  }
  return len;
};

export const layoutWord = (word: string): { width: number; glyphs: ScriptGlyph[] } => {
  const clean = normalise(word);
  const glyphs: ScriptGlyph[] = [];
  let curX = 0;
  for (const ch of clean) {
    const spec = GLYPHS[ch] || GLYPHS["?"];
    const w = spec[0];
    const d = spec[1];
    const strokes: ScriptStroke[] = [];
    const dots: [number, number][] = [];
    if (d) {
      // 1. Extract zero-length line dots (M<x>,<y>L<x>,<y>)
      const dotRegex = /M\s*(-?\d+)\s*,\s*(-?\d+)\s*L\s*\1\s*,\s*\2/g;
      let strokeOnlyD = d;
      for (const m of d.matchAll(dotRegex)) {
        dots.push([+m[1], +m[2]]);
      }
      strokeOnlyD = strokeOnlyD.replace(dotRegex, "").trim();

      // 2. Extract real stroke paths starting with 'M'
      if (strokeOnlyD) {
        const parts = strokeOnlyD.match(/M[^M]*/g) || [];
        for (const p of parts) {
          if (p.trim()) {
            strokes.push({ d: p, len: Math.max(1, pathLength(p)) });
          }
        }
      }
    }
    glyphs.push({ ch, x: curX, strokes, dots });
    curX += w;
  }
  return { width: curX, glyphs };
};

export const timeWord = (glyphs: ScriptGlyph[], speed = 1) => {
  const SPEED = 0.42 * speed;
  let t = 0;
  const timed = glyphs.map((g) => {
    const strokes = g.strokes.map((s) => {
      const dur = Math.max(0.045, (s.len / 1200) * SPEED);
      const res = { d: s.d, len: s.len, delay: t, dur };
      t += dur * 0.72;
      return res;
    });
    const dots = g.dots.map((d) => ({
      x: d[0],
      y: d[1],
      delay: t + 0.04,
    }));
    if (g.dots.length) t += 0.05;
    return { ch: g.ch, x: g.x, strokes, dots };
  });
  return { glyphs: timed, total: t };
};

// ==============================================================================
// 3. FLAT CAFE STICKER ILLUSTRATIONS (ONE SHADE + ONE DARK SHADE, FLAT TONES ONLY)
// ==============================================================================
export type Item = "croissant" | "coffee-beans" | "chai-glass" | "cinnamon-roll" | "cookie";

export const ITEMS: Item[] = ["croissant", "coffee-beans", "chai-glass", "cinnamon-roll", "cookie"];

export const NAMES: Record<Item, string> = {
  croissant: "Croissant",
  "coffee-beans": "Coffee Beans",
  "chai-glass": "Chai Glass",
  "cinnamon-roll": "Cinnamon Roll",
  cookie: "Cookie",
};

export const PAPER: Record<Item, string> = {
  croissant: ILLUSTRATION_PALETTE.paperMustard,
  "coffee-beans": ILLUSTRATION_PALETTE.paperSand,
  "chai-glass": ILLUSTRATION_PALETTE.paperOlive,
  "cinnamon-roll": ILLUSTRATION_PALETTE.paperCreamDeep,
  cookie: ILLUSTRATION_PALETTE.paperTerracotta,
};

const ART: Record<Item, ReactNode> = {
  croissant: (
    <g transform="translate(0, 0)">
      <path
        d="M-36,12 C-32,-6 -14,-26 0,-26 C14,-26 32,-6 36,12 C28,16 16,8 0,8 C-16,8 -28,16 -36,12 Z"
        fill={ILLUSTRATION_PALETTE.croissantGold}
      />
      <path
        d="M-22,6 C-18,-12 -8,-22 0,-22 C8,-22 18,-12 22,6 C14,10 6,4 0,4 C-6,4 -14,10 -22,6 Z"
        fill={ILLUSTRATION_PALETTE.croissantShadow}
      />
      <path
        d="M-10,3 C-8,-8 -3,-16 0,-16 C3,-16 8,-8 10,3 C6,6 2,2 0,2 C-2,2 -6,6 -10,3 Z"
        fill={ILLUSTRATION_PALETTE.croissantGold}
      />
      <path d="M-36,12 C-32,18 -26,14 -24,8 Z" fill={ILLUSTRATION_PALETTE.croissantShadow} />
      <path d="M36,12 C32,18 26,14 24,8 Z" fill={ILLUSTRATION_PALETTE.croissantShadow} />
    </g>
  ),

  "coffee-beans": (
    <g transform="translate(0, 2)">
      <g transform="translate(-10, -4) rotate(-28)">
        <ellipse cx="0" cy="0" rx="14" ry="20" fill={ILLUSTRATION_PALETTE.beanBody} />
        <path d="M0,-19 C-4,-8 4,8 0,19" fill="none" stroke={ILLUSTRATION_PALETTE.beanDark} strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <g transform="translate(12, 6) rotate(32)">
        <ellipse cx="0" cy="0" rx="13" ry="18" fill={ILLUSTRATION_PALETTE.beanBody} />
        <ellipse cx="1" cy="-2" rx="10" ry="15" fill={ILLUSTRATION_PALETTE.beanDark} opacity={0.3} />
        <path d="M0,-17 C-3.5,-7 3.5,7 0,17" fill="none" stroke={ILLUSTRATION_PALETTE.crema} strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </g>
  ),

  "chai-glass": (
    <g transform="translate(0, 2)">
      <polygon points="-16,-26 16,-26 11,26 -11,26" fill={ILLUSTRATION_PALETTE.chaiGlass} />
      <polygon points="0,-26 16,-26 11,26 0,26" fill={ILLUSTRATION_PALETTE.chaiGlassShadow} opacity={0.65} />
      <polygon points="-14,-10 14,-10 9.5,24 -9.5,24" fill={ILLUSTRATION_PALETTE.chaiTea} />
      <polygon points="0,-10 14,-10 9.5,24 0,24" fill={ILLUSTRATION_PALETTE.espresso} opacity={0.25} />
      <line x1="-5" y1="-26" x2="-3.5" y2="26" stroke={ILLUSTRATION_PALETTE.milk} strokeWidth="1.5" opacity={0.7} />
      <line x1="5" y1="-26" x2="3.5" y2="26" stroke={ILLUSTRATION_PALETTE.chaiGlassShadow} strokeWidth="1.5" />
      <ellipse cx="0" cy="-26" rx="16" ry="3.5" fill={ILLUSTRATION_PALETTE.chaiGlass} stroke={ILLUSTRATION_PALETTE.chaiGlassShadow} strokeWidth="1.5" />
    </g>
  ),

  "cinnamon-roll": (
    <g transform="translate(0, 2)">
      <circle cx="0" cy="0" r="28" fill={ILLUSTRATION_PALETTE.cinnamonDough} />
      <circle cx="2" cy="2" r="26" fill={ILLUSTRATION_PALETTE.croissantShadow} opacity={0.3} />
      <path
        d="M0,0 C3,-4 9,-3 11,1 C14,7 8,15 1,16 C-9,17 -18,9 -18,-2 C-18,-15 -6,-23 5,-23 C19,-23 26,-11 26,3 C26,18 13,26 -1,26"
        fill="none"
        stroke={ILLUSTRATION_PALETTE.cinnamonSwirl}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="-6" cy="-8" rx="4" ry="2.5" fill={ILLUSTRATION_PALETTE.milk} opacity={0.8} />
      <ellipse cx="10" cy="-10" rx="3.5" ry="2" fill={ILLUSTRATION_PALETTE.milk} opacity={0.8} />
      <ellipse cx="8" cy="12" rx="4.5" ry="2.5" fill={ILLUSTRATION_PALETTE.milk} opacity={0.8} />
    </g>
  ),

  cookie: (
    <g transform="translate(0, 2)">
      <circle cx="0" cy="0" r="28" fill={ILLUSTRATION_PALETTE.cookieDough} />
      <path d="M0,28 C15,28 28,15 28,0 C28,12 14,24 0,28 Z" fill={ILLUSTRATION_PALETTE.cookieDark} />
      <rect x="-12" y="-14" width="7" height="6" rx="1.5" transform="rotate(18 -12 -14)" fill={ILLUSTRATION_PALETTE.chocolateChunk} />
      <rect x="6" y="-12" width="8" height="6.5" rx="1.5" transform="rotate(-12 6 -12)" fill={ILLUSTRATION_PALETTE.chocolateChunk} />
      <rect x="-4" y="2" width="7.5" height="7.5" rx="1.5" transform="rotate(45 -4 2)" fill={ILLUSTRATION_PALETTE.chocolateChunk} />
      <rect x="8" y="10" width="6" height="5" rx="1.5" transform="rotate(10 8 10)" fill={ILLUSTRATION_PALETTE.chocolateChunk} />
      <rect x="-16" y="8" width="5.5" height="5.5" rx="1.5" transform="rotate(-20 -16 8)" fill={ILLUSTRATION_PALETTE.chocolateChunk} />
    </g>
  ),
};

// ==============================================================================
// 4. STICKERS SPECIFICATION (TUCKED AROUND THE COFFEE CUP CLUSTER)
// ==============================================================================
export type StickerSpec = {
  item: Item;
  x: number; // percentage of cup cluster width
  y: number; // percentage of cup cluster height
  shape: "disc" | "oval";
  rotate?: number;
  size?: number; // em
  color?: string;
  behind?: boolean;
  hideOnNarrowMobile?: boolean;
};

// 4 Cafe Items arranged around the right-column coffee cup
export const DEFAULT_STICKERS: StickerSpec[] = [
  // 1. Left top of cup: Croissant in Mustard paper
  {
    item: "croissant",
    x: 8,
    y: 18,
    shape: "disc",
    rotate: -14,
    size: 0.88,
    color: ILLUSTRATION_PALETTE.paperMustard,
  },
  // 2. Left bottom of cup: Coffee Beans in Sand paper (tucked behind)
  {
    item: "coffee-beans",
    x: 10,
    y: 80,
    shape: "oval",
    rotate: 16,
    size: 0.86,
    color: ILLUSTRATION_PALETTE.paperSand,
    behind: true,
    hideOnNarrowMobile: true, // Only 2 stickers on mobile (croissant & chai-glass)
  },
  // 3. Right top of cup: Chai Glass in Olive paper
  {
    item: "chai-glass",
    x: 90,
    y: 18,
    shape: "disc",
    rotate: 15,
    size: 0.88,
    color: ILLUSTRATION_PALETTE.paperOlive,
  },
  // 4. Right bottom of cup: Cinnamon Roll in CreamDeep paper (tucked behind)
  {
    item: "cinnamon-roll",
    x: 88,
    y: 78,
    shape: "disc",
    rotate: -18,
    size: 0.86,
    color: ILLUSTRATION_PALETTE.paperCreamDeep,
    behind: true,
    hideOnNarrowMobile: true, // Only 2 stickers on screens narrower than 400px
  },
];

type Motion = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tilt: number;
  lift: number;
  liftT: number;
  drag: boolean;
  moved: boolean;
  sx: number;
  sy: number;
  ox0: number;
  oy0: number;
  min: [number, number];
  max: [number, number];
};

const SCRIPT_UNIT = 0.0052;
const SCRIPT_PAD_L = 70;
const SCRIPT_PAD_R = 90;
const fmt = (n: number) => +n.toFixed(4) + "em";

const isPlaceholder = (val?: string) => !val || val.includes("[") || val.includes("]");

// ==============================================================================
// 5. HERO STICKER COMPONENT (COMPACT 2-COLUMN HERO)
// ==============================================================================
export function HeroSticker() {
  const rootRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const stickerEls = useRef<(HTMLDivElement | null)[]>([]);
  const bodyEls = useRef<(HTMLButtonElement | null)[]>([]);

  // Config values
  const headlineLine1 = cafeConfig.hero?.headline || "Slow roasts and";
  const scriptText = cafeConfig.hero?.script || "fresh bakes.";
  const fullHeadline = `${headlineLine1} ${scriptText}`;

  const [inView, setInView] = useState(false);
  const [isJsReady, setIsJsReady] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [redrawKey, setRedrawKey] = useState(0);
  const [introDelay, setIntroDelay] = useState(0); // in seconds
  const [items, setItems] = useState<Item[]>(() => DEFAULT_STICKERS.map((s) => s.item));
  const [topSticker, setTopSticker] = useState(-1);
  const [dragging, setDragging] = useState(-1);
  const [openingStatus, setOpeningStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    const update = () => {
      setOpeningStatus(getOpeningStatus(new Date()));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Script stroke layout
  const script = useMemo(() => {
    const laid = layoutWord(scriptText);
    return { ...timeWord(laid.glyphs), width: laid.width };
  }, [scriptText]);

  const anim = useRef({
    raf: 0,
    reduced: false,
    s: [] as Motion[],
  });

  if (anim.current.s.length !== DEFAULT_STICKERS.length) {
    anim.current.s = DEFAULT_STICKERS.map((_, i) => anim.current.s[i] ?? {
      ox: 0, oy: 0, x: 0, y: 0, vx: 0, vy: 0, tilt: 0, lift: 0, liftT: 0,
      drag: false, moved: false, sx: 0, sy: 0, ox0: 0, oy0: 0, min: [-1, -1], max: [1, 1],
    });
  }

  // Animation step: spring settle on drag and release (Rule Fix 2: ZERO mouse parallax)
  const step = useCallback(() => {
    const a = anim.current;
    const cluster = clusterRef.current;
    if (!cluster) return;
    const W = cluster.offsetWidth || 1;
    let busy = false;

    a.s.forEach((s, i) => {
      const el = stickerEls.current[i];
      if (!el) return;
      const tx = s.ox * W;
      const ty = s.oy * W;

      if (a.reduced) {
        s.x = tx;
        s.y = ty;
        s.vx = s.vy = 0;
        s.tilt = 0;
        s.lift = s.liftT;
      } else {
        const k = s.drag ? 0.32 : 0.09;
        const d = s.drag ? 0.68 : 0.76;
        s.vx = (s.vx + (tx - s.x) * k) * d;
        s.vy = (s.vy + (ty - s.y) * k) * d;
        s.x += s.vx;
        s.y += s.vy;
        const tiltT = Math.max(-16, Math.min(16, s.vx * 1.1));
        s.tilt += (tiltT - s.tilt) * 0.2;
        s.lift += (s.liftT - s.lift) * 0.2;
        if (
          Math.abs(tx - s.x) > 0.05 ||
          Math.abs(ty - s.y) > 0.05 ||
          Math.abs(s.vx) > 0.02 ||
          Math.abs(s.vy) > 0.02 ||
          Math.abs(s.tilt) > 0.02 ||
          Math.abs(s.liftT - s.lift) > 0.002
        ) {
          busy = true;
        }
      }
      el.style.transform = "translate3d(" + s.x.toFixed(2) + "px," + s.y.toFixed(2) + "px,0) rotate(" + s.tilt.toFixed(2) + "deg) scale(" + (1 + s.lift * 0.08).toFixed(4) + ")";
      el.style.setProperty("--lift", s.lift.toFixed(3));
    });

    a.raf = busy ? requestAnimationFrame(step) : 0;
  }, []);

  const kick = useCallback(() => {
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(step);
  }, [step]);

  // Entrance & Lifecycle (checks intro sequence)
  useEffect(() => {
    setIsJsReady(true);
    const root = rootRef.current;
    if (!root) return;
    const a = anim.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    a.reduced = mq.matches;
    const onMq = () => {
      a.reduced = mq.matches;
      kick();
    };
    mq.addEventListener("change", onMq);

    // Wait for first-visit intro sequence if active
    let delay = 0;
    try {
      const introSeen = sessionStorage.getItem("cafe_intro_seen");
      if (!introSeen && !a.reduced) {
        delay = 1.15; // 1150ms to let intro finish sliding away
      }
    } catch {
      // restricted sessionStorage
    }
    setIntroDelay(delay);

    // IntersectionObserver to pause idle bob when hero is out of view
    // AND guarantee that hero is fully visible whenever user is at the top of the page
    let io: IntersectionObserver | undefined;
    if (a.reduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            setInView(entry.isIntersecting);
          }
        },
        { threshold: 0.05 }
      );
      io.observe(root);
      setInView(true); // Hero sits at top, immediately in view
    }

    return () => {
      mq.removeEventListener("change", onMq);
      io?.disconnect();
      if (a.raf) cancelAnimationFrame(a.raf);
    };
  }, [kick]);

  const clampOffset = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const bounds = (i: number) => {
    const cluster = clusterRef.current;
    const el = stickerEls.current[i];
    const s = anim.current.s[i];
    if (!cluster || !el) return;
    const CW = cluster.offsetWidth || 1;
    const CH = cluster.offsetHeight || 1;
    const spec = DEFAULT_STICKERS[i];
    const ox = (spec.x / 100) * CW;
    const oy = (spec.y / 100) * CH;
    const hw = el.offsetWidth / 2;
    const hh = el.offsetHeight / 2;
    s.min = [(-ox + hw) / CW, (-oy + hh) / CH];
    s.max = [(CW - ox - hw) / CW, (CH - oy - hh) / CH];
  };

  const slap = (i: number) => {
    const el = bodyEls.current[i];
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  };

  // Replay handwriting drawing of "fresh bakes."
  const replayHandwriting = () => {
    if (erasing) return;
    setErasing(true);
    setTimeout(() => {
      setErasing(false);
      setRedrawKey((k) => k + 1);
    }, 380);
  };

  // Click sticker to swap item
  const onStickerClick = (e: ReactMouseEvent<HTMLButtonElement>, i: number) => {
    const s = anim.current.s[i];
    if (s.moved) return;
    setItems((prev) => {
      const next = [...prev];
      const curItem = next[i];
      const curIdx = ITEMS.indexOf(curItem);
      next[i] = ITEMS[(curIdx + 1) % ITEMS.length];
      return next;
    });
    slap(i);
  };

  // Pointer drag interactions
  const onStickerDown = (e: ReactPointerEvent<HTMLButtonElement>, i: number) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const s = anim.current.s[i];
    e.currentTarget.setPointerCapture?.(e.pointerId);
    bounds(i);
    s.drag = true;
    s.moved = false;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.ox0 = s.ox;
    s.oy0 = s.oy;
    s.liftT = 1;
    setTopSticker(i);
    setDragging(i);
    kick();
  };

  const onStickerMove = (e: ReactPointerEvent<HTMLButtonElement>, i: number) => {
    const s = anim.current.s[i];
    if (!s.drag) return;
    const W = clusterRef.current?.offsetWidth || 1;
    const dx = e.clientX - s.sx;
    const dy = e.clientY - s.sy;
    if (!s.moved && Math.hypot(dx, dy) > 5) s.moved = true;
    if (!s.moved) return;
    s.ox = clampOffset(s.ox0 + dx / W, s.min[0], s.max[0]);
    s.oy = clampOffset(s.oy0 + dy / W, s.min[1], s.max[1]);
    kick();
  };

  const onStickerUp = (e: ReactPointerEvent<HTMLButtonElement>, i: number) => {
    const s = anim.current.s[i];
    if (!s.drag) return;
    s.drag = false;
    s.liftT = 0;
    setDragging(-1);
    if (e.type === "pointerup") {
      if (s.moved) slap(i);
    }
    kick();
  };

  // Keyboard navigation on stickers (Shift for larger steps)
  const onStickerKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setItems((prev) => {
        const next = [...prev];
        const curIdx = ITEMS.indexOf(next[i]);
        next[i] = ITEMS[(curIdx + 1) % ITEMS.length];
        return next;
      });
      slap(i);
      return;
    }

    const stepSize = e.shiftKey ? 0.05 : 0.012;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowLeft") dx = -stepSize;
    else if (e.key === "ArrowRight") dx = stepSize;
    else if (e.key === "ArrowUp") dy = -stepSize;
    else if (e.key === "ArrowDown") dy = stepSize;
    else return;

    e.preventDefault();
    bounds(i);
    const s = anim.current.s[i];
    s.ox = clampOffset(s.ox + dx, s.min[0], s.max[0]);
    s.oy = clampOffset(s.oy + dy, s.min[1], s.max[1]);
    setTopSticker(i);
    kick();
  };

  // Double click on empty stage to tidy/reset stickers
  const resetStickers = () => {
    if (typeof window !== "undefined") {
      window.getSelection()?.removeAllRanges();
    }
    anim.current.s.forEach((s, i) => {
      s.ox = 0;
      s.oy = 0;
      slap(i);
    });
    setTopSticker(-1);
    kick();
  };

  // Script SVG Sizing
  const slotW = (script.width + SCRIPT_PAD_L + SCRIPT_PAD_R) * SCRIPT_UNIT;
  const vbW = script.width + SCRIPT_PAD_L + SCRIPT_PAD_R;
  const vbH = SCRIPT_BOTTOM - SCRIPT_TOP;

  const layer = (kind: "s" | "m" | "h") => {
    const cls =
      kind === "s"
        ? "hero-script-shadow"
        : kind === "h"
        ? "hero-script-hl"
        : "hero-script-main";

    return (
      <g className={cls}>
        {script.glyphs.map((g) => (
          <g key={g.x + g.ch} transform={"translate(" + g.x + " 0)"}>
            <g>
              {g.strokes.map((s, si) => (
                <path
                  key={si}
                  className="hero-script-path"
                  d={s.d}
                  pathLength={1}
                  strokeWidth={kind === "h" ? 7 : SCRIPT_STROKE}
                  style={{
                    "--d": (s.delay + (kind === "s" ? 0.06 : kind === "h" ? 0.1 : 0)).toFixed(3) + "s",
                    "--dur": s.dur.toFixed(3) + "s",
                  } as CSSProperties}
                />
              ))}
              {g.dots.map((p, di) => (
                <circle
                  key={"d" + di}
                  className="hero-script-dot"
                  cx={p.x}
                  cy={p.y}
                  r={kind === "h" ? 4 : SCRIPT_STROKE / 2}
                  style={{ "--d": p.delay.toFixed(3) + "s" } as CSSProperties}
                />
              ))}
            </g>
          </g>
        ))}
      </g>
    );
  };

  // Line 1 Characters
  let ci = 0;
  const line1Chars = [...headlineLine1].map((ch, i) => (
    <span
      key={i}
      className="hero-line1-ch"
      style={{ "--i": ch === " " ? ci : ci++ } as CSSProperties}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

  // Render Sticker
  const renderSticker = (spec: StickerSpec, i: number) => {
    const item = items[i] ?? spec.item;
    const h = spec.size ?? 0.86;
    const w = spec.shape === "oval" ? h * 1.3 : h;
    const paper = item === spec.item && spec.color ? spec.color : PAPER[item];
    const cls =
      "hero-stk" +
      (spec.behind && topSticker !== i ? " is-behind" : "") +
      (topSticker === i ? " is-top" : "") +
      (dragging === i ? " is-drag" : "") +
      (spec.hideOnNarrowMobile ? " hero-stk-hide-mobile" : "");

    return (
      <div
        key={i}
        ref={(el) => {
          stickerEls.current[i] = el;
        }}
        className={cls}
        style={{
          "--x": spec.x + "%",
          "--y": spec.y + "%",
          "--w": w + "em",
          "--h": h + "em",
        } as CSSProperties}
      >
        <div
          className="hero-stk-in"
          style={{
            "--sd": (0.7 + i * 0.12).toFixed(2) + "s",
            "--spin": (i % 2 ? 18 : -18) + "deg",
          } as CSSProperties}
        >
          <div className="hero-stk-bob" style={{ "--bd": -i * 1.6 + "s" } as CSSProperties}>
            <button
              type="button"
              ref={(el) => {
                bodyEls.current[i] = el;
              }}
              className="hero-stk-body"
              style={{
                "--c": paper,
                "--r": (spec.rotate ?? 0) + "deg",
                "--f": h * 0.86 + "em",
              } as CSSProperties}
              aria-label={NAMES[item] + " sticker. Press Enter to swap the item, arrow keys to move it."}
              onPointerDown={(e) => onStickerDown(e, i)}
              onPointerMove={(e) => onStickerMove(e, i)}
              onPointerUp={(e) => onStickerUp(e, i)}
              onPointerCancel={(e) => onStickerUp(e, i)}
              onClick={(e) => onStickerClick(e, i)}
              onKeyDown={(e) => onStickerKey(e, i)}
            >
              <svg className="hero-item-svg" viewBox="-50 -50 100 100" aria-hidden="true">
                {ART[item]}
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const neighborhood = !isPlaceholder(cafeConfig.address?.neighborhood)
    ? cafeConfig.address.neighborhood
    : null;

  return (
    <section
      ref={rootRef}
      aria-label="Welcome"
      className={`hero-stk-section ${
        isJsReady ? "hero-js-ready" : ""
      } ${!inView ? "hero-paused" : ""}`}
      data-in={inView ? "true" : "false"}
      style={{
        "--intro-delay": `${introDelay}s`,
        fontSize: "clamp(1.15rem, 3.2vw, 2.35rem)",
      } as CSSProperties}
    >
      <div className="hero-stage">
        {/* ====================================================================
            LEFT COLUMN (55-57%): LEFT-ALIGNED HEADING, STATUS, BUTTONS
            ==================================================================== */}
        <div className="hero-left">
          {/* Subtle Steaming Cup Line Illustration Badge */}
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-[2px] border border-cafe-border/50 bg-cafe-cream-deep/30 px-3 py-1 text-xs font-medium text-cafe-olive select-none">
            <CoffeeCupWithSteam className="h-3.5 w-3.5 text-cafe-terracotta" />
            <span>
              Specialty coffee and bakery{neighborhood ? ` in ${neighborhood}` : ""}
            </span>
          </div>

          {/* Exactly one H1 on the page: Left-aligned Stacked Headline */}
          <h1 id="hero-heading" className="hero-head">
            {/* Screen-reader accessible full phrase */}
            <span className="hero-sr">{fullHeadline}</span>

            {/* Line 1: "Slow roasts and" in Fraunces */}
            <span className="hero-line1" aria-hidden="true">
              {line1Chars}
            </span>

            {/* Line 2: "fresh bakes." drawn script word (Click to replay) */}
            <button
              type="button"
              className="hero-script-wrap"
              style={{ width: fmt(slotW) }}
              data-out={erasing ? "true" : "false"}
              onClick={replayHandwriting}
              aria-label="Replay the handwriting"
            >
              <svg
                key={redrawKey}
                className="hero-script-svg"
                viewBox={-SCRIPT_PAD_L + " " + SCRIPT_TOP + " " + vbW + " " + vbH}
                style={{
                  width: "100%",
                  "--base": "0.35s",
                  "--total": script.total.toFixed(3) + "s",
                } as CSSProperties}
                aria-hidden="true"
              >
                <g transform="rotate(-5 0 0) skewX(-8)">
                  {layer("s")}
                  {layer("m")}
                  {layer("h")}
                </g>
              </svg>
            </button>
          </h1>

          {/* Supporting Line: Real opening hours & status in Asia/Kolkata */}
          <p className="hero-status">
            {openingStatus ? (
              <>
                <span className="font-semibold text-cafe-espresso">{openingStatus.statusText}</span>. Open daily 10:00 AM to 11:00 PM.
              </>
            ) : (
              <>Open daily 10:00 AM to 11:00 PM.</>
            )}
          </p>

          {/* Action Buttons: Rectangular (4px max radius, side by side) */}
          <div className="hero-actions">
            <Link
              href="/menu"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[2px] border border-cafe-espresso bg-cafe-espresso px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cafe-cream transition-colors duration-fast hover:border-cafe-terracotta hover:bg-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta active:scale-[0.98] motion-reduce:active:scale-100"
            >
              See the menu
            </Link>

            <Link
              href="/visit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[2px] border border-cafe-espresso/40 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cafe-espresso transition-colors duration-fast hover:border-cafe-espresso hover:bg-cafe-espresso hover:text-cafe-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-espresso active:scale-[0.98] motion-reduce:active:scale-100"
            >
              Find us
            </Link>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN (43-45%): COFFEE CUP CLUSTER & SURROUNDING STICKERS
            ==================================================================== */}
        <div className="hero-right">
          <div
            ref={clusterRef}
            className="hero-cup-cluster"
            onDoubleClick={resetStickers}
          >
            {/* Stickers behind the cup */}
            {DEFAULT_STICKERS.map((s, i) => (s.behind ? renderSticker(s, i) : null))}

            {/* Large handcrafted floating coffee cup */}
            <div className="w-full">
              <HeroVisual />
            </div>

            {/* Stickers in front of the cup */}
            {DEFAULT_STICKERS.map((s, i) => (s.behind ? null : renderSticker(s, i)))}
          </div>
        </div>
      </div>

      {/* Subtle craft smooth scroll cue */}
      <div className="hero-scroll-cue-wrap">
        <button
          type="button"
          onClick={() => {
            const nextSection =
              document.getElementById("live-rhythm-section") ||
              document.querySelector("section[aria-labelledby='live-rhythm-heading']");
            if (nextSection) {
              if (window.__lenis) {
                window.__lenis.scrollTo(nextSection as HTMLElement, {
                  offset: -76,
                  duration: 1.15,
                });
              } else {
                nextSection.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}
          aria-label="Scroll down to explore today's coffee and bakery"
          className="hero-scroll-cue group flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-cafe-espresso/65 transition-colors hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta active:scale-[0.98] motion-reduce:active:scale-100"
        >
          <span>Scroll to explore</span>
          <svg
            className="hero-scroll-arrow h-3.5 w-3.5 text-cafe-terracotta"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default HeroSticker;
