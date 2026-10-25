import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-site items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-md text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-cafe-olive">
          404 Error
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
            className="inline-flex h-11 w-full items-center justify-center rounded-sm bg-cafe-espresso px-5 text-xs font-medium text-cafe-cream transition-colors hover:bg-cafe-espresso/90 sm:w-auto"
          >
            Return to home
          </Link>
          <Link
            href="/menu"
            className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-cafe-border bg-cafe-cream-deep/40 px-5 text-xs font-medium text-cafe-espresso transition-colors hover:bg-cafe-cream-deep sm:w-auto"
          >
            View daily menu
          </Link>
        </div>

        <p className="mt-8 text-xs text-cafe-olive">
          Need assistance? Contact {cafeConfig.name} at {cafeConfig.contact.email}
        </p>
      </div>
    </div>
  );
}