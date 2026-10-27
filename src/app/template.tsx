import React from "react";

/**
 * Route transition template: refined 280ms composite-only entry.
 * Combines opacity with a subtle 8px upward settle to create an organic page arrival.
 * Uses high-performance CSS animation to guarantee zero SSR blank-screen lock,
 * zero layout thrashing, and native 60fps/120fps hardware acceleration.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col animate-page-enter">
      {children}
    </div>
  );
}
