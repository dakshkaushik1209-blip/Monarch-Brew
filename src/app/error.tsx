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
        <span className="text-xs font-medium text-cafe-olive">
          System notice
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
            className="inline-flex h-11 w-full items-center justify-center rounded-[2px] bg-cafe-espresso px-5 text-xs font-medium text-cafe-cream transition-[color,background-color,transform] hover:bg-cafe-espresso/90 active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 px-5 text-xs font-medium text-cafe-espresso transition-[color,background-color,border-color,transform] hover:bg-cafe-cream-deep active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
          >
            Return to home
          </Link>
        </div>

        <p className="mt-8 text-xs text-cafe-olive">
          {cafeConfig.contact.email ? (
            <span>
              If the problem persists, please notify {cafeConfig.name} at{" "}
              <a
                href={`mailto:${cafeConfig.contact.email}`}
                className="text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso"
              >
                {cafeConfig.contact.email}
              </a>
            </span>
          ) : (
            `Visit ${cafeConfig.name} at ${cafeConfig.address.display}`
          )}
        </p>
      </div>
    </div>
  );
}