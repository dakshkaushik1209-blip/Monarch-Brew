"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime error to console
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-site items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-md text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-cafe-olive">
          System Notice
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cafe-espresso/80">
          An unexpected error occurred while loading this page. You can try refreshing the page or return to the home screen.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 w-full items-center justify-center rounded-sm bg-cafe-espresso px-5 text-xs font-medium text-cafe-cream transition-colors hover:bg-cafe-espresso/90 sm:w-auto"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-cafe-border bg-cafe-cream-deep/40 px-5 text-xs font-medium text-cafe-espresso transition-colors hover:bg-cafe-cream-deep sm:w-auto"
          >
            Return to home
          </Link>
        </div>

        <p className="mt-8 text-xs text-cafe-olive">
          If the problem persists, please notify {cafeConfig.name} at {cafeConfig.contact.email}
        </p>
      </div>
    </div>
  );
}