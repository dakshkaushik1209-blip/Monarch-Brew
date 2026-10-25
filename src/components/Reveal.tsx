"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
  useMemo,
} from "react";
import { useReducedMotion } from "motion/react";

export type RevealState = "visible" | "hidden";

interface RevealListener {
  id: string;
  isHero?: boolean;
  onUpdate: (state: RevealState, immediate: boolean) => void;
}

/**
 * Singleton Reveal Observer Manager
 *
 * Coordinates all scroll reveals across the entire application using a single,
 * shared IntersectionObserver instance.
 *
 * Rules strictly implemented:
 * 1. Reveals when entering the viewport from the bottom while scrolling down.
 * 2. Animates back to hidden when leaving the viewport through the BOTTOM edge while scrolling up.
 * 3. Never hides when exiting through the TOP edge (already read content stays visible).
 * 4. Small negative bottom rootMargin ("0px 0px -10% 0px") with 24px hysteresis to prevent flicker.
 * 5. Instant reveal (0ms) on anchor jumps and history back/forward navigation.
 * 6. Zero scroll event listeners reading layout properties (compositor-only updates).
 */
class RevealObserverManager {
  private observer: IntersectionObserver | null = null;
  private listeners = new Map<Element, RevealListener>();
  private isSettled = false;

  constructor() {
    if (typeof window === "undefined") return;

    this.observer = new IntersectionObserver(this.handleEntries.bind(this), {
      rootMargin: "0px 0px -10% 0px",
      threshold: [0, 0.05, 0.2],
    });

    // Mark initial load settlement
    setTimeout(() => {
      this.isSettled = true;
    }, 300);

    // Fast jumps: anchor hash changes or history navigation reveal in-view content immediately
    window.addEventListener("hashchange", this.handleHashJump.bind(this), { passive: true });
    window.addEventListener("popstate", this.handleHashJump.bind(this), { passive: true });
  }

  private handleHashJump() {
    if (!this.observer) return;
    this.listeners.forEach((listener, element) => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        listener.onUpdate("visible", true);
      }
    });
  }

  private handleEntries(entries: IntersectionObserverEntry[]) {
    const hasHash = typeof window !== "undefined" && Boolean(window.location.hash);
    const immediate = (!this.isSettled && hasHash) || (!this.isSettled && window.scrollY > 100);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target as HTMLElement;
      const listener = this.listeners.get(target);
      if (!listener) continue;

      const rootTop = entry.rootBounds ? entry.rootBounds.top : 0;
      const rootBottom = entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight * 0.9;
      const bTop = entry.boundingClientRect.top;
      const bBottom = entry.boundingClientRect.bottom;

      if (entry.isIntersecting) {
        // Enters through bottom (or currently in active view): REVEAL!
        listener.onUpdate("visible", immediate);
      } else {
        // Target is outside rootBounds
        // 1. TOP EDGE EXIT: element scrolled past the top (already read content)
        // bBottom is at or above rootTop with 24px hysteresis
        if (bBottom <= rootTop + 24) {
          // Stay revealed! Never hide when scrolled past top edge.
          listener.onUpdate("visible", false);
        }
        // 2. BOTTOM EDGE EXIT: element moved below the bottom edge (scrolling up)
        // bTop is at or below rootBottom with 24px hysteresis
        else if (bTop >= rootBottom - 24) {
          // Only reverse to hidden if not a designated hero element
          if (!listener.isHero) {
            listener.onUpdate("hidden", false);
          }
        }
      }
    }
  }

  public register(element: Element, listener: RevealListener) {
    this.listeners.set(element, listener);
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  public unregister(element: Element) {
    this.listeners.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
}

let managerInstance: RevealObserverManager | null = null;
function getRevealManager(): RevealObserverManager | null {
  if (typeof window === "undefined") return null;
  if (!managerInstance) {
    managerInstance = new RevealObserverManager();
  }
  return managerInstance;
}

// ---------------------------------------------------------------------------
// Reveal Context for Staggered Groups
// ---------------------------------------------------------------------------
interface RevealGroupContextValue {
  isGroupVisible: boolean;
  staggerMs: number;
  reverseStaggerMs: number;
  totalItems: number;
  immediate: boolean;
}

const RevealGroupContext = createContext<RevealGroupContextValue | null>(null);

// ---------------------------------------------------------------------------
// 1. Core <Reveal> Component
// ---------------------------------------------------------------------------
export type RevealTag =
  | "div"
  | "section"
  | "article"
  | "li"
  | "header"
  | "p"
  | "ul"
  | "ol"
  | "span"
  | "h1"
  | "h2"
  | "h3";

export interface RevealProps {
  children: React.ReactNode;
  id?: string;
  as?: RevealTag;
  className?: string;
  delay?: number; // Delay in seconds (e.g. 0.08)
  reverseDelay?: number; // Reverse delay in seconds (e.g. 0.06)
  yOffset?: number; // Vertical slide distance in px (default: 16)
  isHero?: boolean; // If true, once visible it never hides
  alwaysKeepVisibleOnceSeen?: boolean;
}

/**
 * Shared Reversible Scroll Reveal Component
 *
 * Reveals when scrolling down past the bottom edge (500ms ease-out).
 * Reverses to hidden when scrolling up past the bottom edge (300ms ease-out).
 * Stays revealed when scrolled past the top edge.
 * Animates ONLY composite properties (transform, opacity).
 */
export function Reveal({
  children,
  id,
  as = "div",
  className = "",
  delay = 0,
  reverseDelay = 0,
  yOffset = 16,
  isHero = false,
  alwaysKeepVisibleOnceSeen = false,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RevealState>("hidden");
  const [immediate, setImmediate] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const elementId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;
    const el = elementRef.current;
    if (!el) return;

    const manager = getRevealManager();
    if (!manager) return;

    // Check if initially in viewport before first observer callback
    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setState("visible");
      // If at top or hash jump, make it immediate
      if (initialRect.top < 200 || window.location.hash) {
        setImmediate(true);
      }
    }

    manager.register(el, {
      id: elementId,
      isHero: isHero || alwaysKeepVisibleOnceSeen,
      onUpdate: (newState, isImmediate) => {
        if (alwaysKeepVisibleOnceSeen && state === "visible" && newState === "hidden") {
          return;
        }
        setState(newState);
        setImmediate(isImmediate);
      },
    });

    return () => {
      manager.unregister(el);
    };
  }, [mounted, shouldReduceMotion, elementId, isHero, alwaysKeepVisibleOnceSeen, state]);

  // Safe Fallback: if reduced motion or SSR/no-JS, render fully visible without animation
  if (shouldReduceMotion || !mounted) {
    const Component = as as "div";
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  const isVisible = state === "visible";
  const duration = immediate ? 0 : isVisible ? 500 : 300;
  const currentDelay = immediate ? 0 : isVisible ? delay * 1000 : reverseDelay * 1000;

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0px)" : `translateY(${yOffset}px)`,
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${currentDelay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform",
  };

  const Component = as as "div";
  return (
    <Component ref={elementRef as unknown as React.Ref<HTMLDivElement>} id={id} style={style} className={className}>
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// 2. <RevealGroup> & <RevealItem> for Staggered Lists
// ---------------------------------------------------------------------------
export interface RevealGroupProps {
  children: React.ReactNode;
  id?: string;
  as?: RevealTag;
  className?: string;
  staggerMs?: number; // Default: 70ms
  reverseStaggerMs?: number; // Default: 60ms
  totalItems?: number;
}

export function RevealGroup({
  children,
  id,
  as = "div",
  className = "",
  staggerMs = 70,
  reverseStaggerMs = 60,
  totalItems = 4,
}: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isGroupVisible, setIsGroupVisible] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const groupRef = useRef<HTMLElement>(null);
  const groupId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;
    const el = groupRef.current;
    if (!el) return;

    const manager = getRevealManager();
    if (!manager) return;

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setIsGroupVisible(true);
      if (initialRect.top < 200 || window.location.hash) {
        setImmediate(true);
      }
    }

    manager.register(el, {
      id: groupId,
      onUpdate: (newState, isImmediate) => {
        setIsGroupVisible(newState === "visible");
        setImmediate(isImmediate);
      },
    });

    return () => {
      manager.unregister(el);
    };
  }, [mounted, shouldReduceMotion, groupId]);

  const contextValue = useMemo<RevealGroupContextValue>(
    () => ({
      isGroupVisible,
      staggerMs,
      reverseStaggerMs,
      totalItems,
      immediate,
    }),
    [isGroupVisible, staggerMs, reverseStaggerMs, totalItems, immediate]
  );

  const Component = as as "div";

  if (shouldReduceMotion || !mounted) {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <RevealGroupContext.Provider value={contextValue}>
      <Component ref={groupRef as unknown as React.Ref<HTMLDivElement>} id={id} className={className}>
        {children}
      </Component>
    </RevealGroupContext.Provider>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  index?: number;
  id?: string;
  as?: RevealTag;
  className?: string;
  yOffset?: number;
}

export function RevealItem({
  children,
  index = 0,
  id,
  as = "div",
  className = "",
  yOffset = 16,
}: RevealItemProps) {
  const group = useContext(RevealGroupContext);
  const shouldReduceMotion = useReducedMotion();

  if (!group || shouldReduceMotion) {
    const Component = as as "div";
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  const { isGroupVisible, staggerMs, reverseStaggerMs, totalItems, immediate } = group;

  // Stagger forward on opening (0, 1, 2, ...): index * staggerMs
  // Reverse stagger order on closing: (total - 1 - index) * reverseStaggerMs
  const delay = isGroupVisible
    ? index * staggerMs
    : Math.max(0, totalItems - 1 - index) * reverseStaggerMs;

  const duration = immediate ? 0 : isGroupVisible ? 500 : 300;

  const style: React.CSSProperties = {
    opacity: isGroupVisible ? 1 : 0,
    transform: isGroupVisible ? "translateY(0px)" : `translateY(${yOffset}px)`,
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${immediate ? 0 : delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform",
  };

  const Component = as as "div";
  return (
    <Component id={id} style={style} className={className}>
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// 3. <ImageReveal> for Photos (Reversible Scale & Opacity)
// ---------------------------------------------------------------------------
export interface ImageRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  reverseDelay?: number;
  isHero?: boolean;
}

/**
 * Reversible Image Reveal wrapper with soft scale (1.04 -> 1) and fade.
 * Scales back to 1.04 and fades out when scrolling up through bottom edge.
 */
export function ImageReveal({
  children,
  id,
  className = "",
  delay = 0,
  reverseDelay = 0,
  isHero = false,
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RevealState>("hidden");
  const [immediate, setImmediate] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const elementId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;
    const el = elementRef.current;
    if (!el) return;

    const manager = getRevealManager();
    if (!manager) return;

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setState("visible");
      if (initialRect.top < 200 || window.location.hash) {
        setImmediate(true);
      }
    }

    manager.register(el, {
      id: elementId,
      isHero,
      onUpdate: (newState, isImmediate) => {
        setState(newState);
        setImmediate(isImmediate);
      },
    });

    return () => {
      manager.unregister(el);
    };
  }, [mounted, shouldReduceMotion, elementId, isHero]);

  if (shouldReduceMotion || !mounted) {
    return (
      <div id={id} className={`overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  const isVisible = state === "visible";
  const duration = immediate ? 0 : isVisible ? 600 : 350;
  const currentDelay = immediate ? 0 : isVisible ? delay * 1000 : reverseDelay * 1000;

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "scale(1)" : "scale(1.04)",
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${currentDelay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform",
  };

  return (
    <div id={id} className={`overflow-hidden ${className}`}>
      <div ref={elementRef} style={style}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. <TextReveal> Reversible / Hero Heading Reveal
// ---------------------------------------------------------------------------
export interface TextRevealProps {
  children: React.ReactNode;
  id?: string;
  as?: RevealTag;
  className?: string;
  delay?: number;
  isHero?: boolean;
}

/**
 * Masked title reveal with vertical translation.
 * Uses overflow-hidden container with translate-y sliding up into place.
 */
export function TextReveal({
  children,
  id,
  as = "div",
  className = "",
  delay = 0,
  isHero = false,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RevealState>("hidden");
  const [immediate, setImmediate] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const elementId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;
    const el = elementRef.current;
    if (!el) return;

    const manager = getRevealManager();
    if (!manager) return;

    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setState("visible");
      if (initialRect.top < 200 || window.location.hash) {
        setImmediate(true);
      }
    }

    manager.register(el, {
      id: elementId,
      isHero,
      onUpdate: (newState, isImmediate) => {
        setState(newState);
        setImmediate(isImmediate);
      },
    });

    return () => {
      manager.unregister(el);
    };
  }, [mounted, shouldReduceMotion, elementId, isHero]);

  const Component = as as "div";

  if (shouldReduceMotion || !mounted) {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  const isVisible = state === "visible";
  const duration = immediate ? 0 : isVisible ? 600 : 300;
  const currentDelay = immediate ? 0 : isVisible ? delay * 1000 : 0;

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0%)" : "translateY(100%)",
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${currentDelay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform",
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <Component ref={elementRef as unknown as React.Ref<HTMLDivElement>} id={id} style={style}>
        {children}
      </Component>
    </div>
  );
}
