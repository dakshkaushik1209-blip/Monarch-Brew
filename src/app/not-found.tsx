import type { Metadata } from "next";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `The requested page could not be found. Return to ${cafeConfig.name} home or explore our daily menu.`,
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-site items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-md text-center">
        {/* Tipped ceramic cup spilling steam */}
        <div className="mb-6 flex justify-center">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-20 w-20 text-cafe-terracotta"
            aria-hidden="true"
          >
            {/* Tilted cup bowl */}
            <path
              d="M20 40 L45 55 A16 16 0 0 0 65 35 L40 20 Z"
              className="text-cafe-espresso"
              fill="none"
            />
            {/* Cup handle */}
            <path d="M52 48 Q62 50 60 40" />
            {/* Spilling steam trails */}
            <path
              d="M16 42 Q10 35 12 25 Q14 15 22 18"
              className="animate-steam-1"
            />
            <path
              d="M26 38 Q22 28 28 20 Q34 12 42 16"
              className="animate-steam-2"
            />
            <path
              d="M34 44 Q36 32 46 26"
              className="animate-steam-3"
            />
            {/* Coffee drops */}
            <circle cx="14" cy="50" r="1.5" fill="currentColor" />
            <circle cx="20" cy="58" r="2" fill="currentColor" />
            <circle cx="28" cy="62" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <span className="text-xs font-medium text-cafe-olive">
          404 notice
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cafe-espresso/80">
          The page you requested could not be found. It may have been moved or the address may have been entered incorrectly.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-[2px] bg-cafe-espresso px-5 text-xs font-medium text-cafe-cream transition-[color,background-color,transform] hover:bg-cafe-espresso/90 active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
          >
            Return to home
          </Link>
          <Link
            href="/menu"
            className="inline-flex h-11 w-full items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 px-5 text-xs font-medium text-cafe-espresso transition-[color,background-color,border-color,transform] hover:bg-cafe-cream-deep active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
          >
            View daily menu
          </Link>
        </div>

        <p className="mt-8 text-xs text-cafe-olive">
          {cafeConfig.contact.email ? (
            <span>
              Need assistance? Contact {cafeConfig.name} at{" "}
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