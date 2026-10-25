"use client";

import React from "react";
import {
  TextReveal as CoreTextReveal,
  RevealGroup,
  RevealItem,
  type TextRevealProps,
} from "./Reveal";

export { CoreTextReveal as TextReveal, type TextRevealProps };

export function StaggerContainer({
  children,
  className = "",
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}) {
  const childArray = React.Children.toArray(children);
  return (
    <RevealGroup
      className={className}
      staggerMs={Math.round(staggerChildren * 1000)}
      totalItems={childArray.length}
    >
      {childArray.map((child, index) => (
        <RevealItem key={index} index={index}>
          {child}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
