"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyPillProps {
  textToCopy: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

export function CopyPill({ textToCopy, label, className = "", children }: CopyPillProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label || `Copy ${textToCopy}`}
      className={cn(
        "group relative inline-flex items-center gap-1.5 text-left transition-colors duration-short focus-visible:outline-2 focus-visible:outline-cafe-espresso",
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-[2px] border px-1.5 py-0.5 text-[10px] font-semibold transition-all duration-short",
          copied
            ? "border-cafe-veg bg-cafe-veg text-white"
            : "border-cafe-border bg-cafe-cream-deep/60 text-cafe-espresso/70 opacity-0 group-hover:opacity-100",
        )}
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-2.5 w-2.5" />
            <span>Copy</span>
          </>
        )}
      </span>
    </button>
  );
}
