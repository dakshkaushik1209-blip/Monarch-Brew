import React from "react";

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Single-color line illustration of a ceramic coffee cup with animated rising steam lines.
 * Steam animation is subtle (4.5s loop), gentle vertical drift and opacity float.
 * Controlled by CSS keyframes with prefers-reduced-motion fallback.
 */
export function CoffeeCupWithSteam({ className = "w-12 h-12 text-cafe-terracotta", size, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <style>{`
        @keyframes steamFloatLeft {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-4px) translateX(-1px);
            opacity: 0.85;
          }
        }
        @keyframes steamFloatCenter {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-6px);
            opacity: 0.95;
          }
        }
        @keyframes steamFloatRight {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-5px) translateX(1px);
            opacity: 0.8;
          }
        }
        .steam-left {
          animation: steamFloatLeft 4.5s ease-in-out infinite;
          transform-origin: 24px 20px;
        }
        .steam-center {
          animation: steamFloatCenter 5.2s ease-in-out infinite 0.6s;
          transform-origin: 32px 18px;
        }
        .steam-right {
          animation: steamFloatRight 4.8s ease-in-out infinite 1.2s;
          transform-origin: 40px 20px;
        }
        @media (prefers-reduced-motion: reduce) {
          .steam-left, .steam-center, .steam-right {
            animation: none;
            opacity: 0.6;
          }
        }
      `}</style>

      {/* Steam lines */}
      <path
        d="M24 22c-1.5-3 1-5-1-8"
        className="steam-left"
        strokeWidth="1.75"
      />
      <path
        d="M32 20c-1.5-3.5 1.5-6-1-10"
        className="steam-center"
        strokeWidth="1.75"
      />
      <path
        d="M40 22c-1.5-3 1-5-1-8"
        className="steam-right"
        strokeWidth="1.75"
      />

      {/* Cup bowl */}
      <path d="M16 26h32v14a16 16 0 0 1-32 0V26z" />

      {/* Cup handle */}
      <path d="M48 30h4a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5h-4" />

      {/* Saucer plate */}
      <path d="M10 46h44c2 0 4 1 4 2s-2 2-4 2H10c-2 0-4-1-4-2s2-2 4-2z" />
    </svg>
  );
}

/**
 * Single-color line illustration of paired roasted coffee beans.
 */
export function CoffeeBeans({ className = "w-6 h-6 text-cafe-olive", size, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Bean 1 */}
      <ellipse cx="20" cy="22" rx="10" ry="14" transform="rotate(-25 20 22)" />
      <path d="M15 11c3 6-1 16 3 22" />

      {/* Bean 2 */}
      <ellipse cx="32" cy="28" rx="8" ry="11" transform="rotate(35 32 28)" />
      <path d="M36 19c-2 5 1 12-2 18" />
    </svg>
  );
}

/**
 * Single-color line illustration of a fresh croissant / pastry.
 */
export function Croissant({ className = "w-8 h-8 text-cafe-terracotta", size, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Outer crescent body */}
      <path d="M8 36c4-12 14-24 24-24s20 12 24 24c-8-4-16-6-24-6s-16 2-24 6z" />
      {/* Lamination ribs */}
      <path d="M22 16c2 4 4 10 4 14" />
      <path d="M32 12v18" />
      <path d="M42 16c-2 4-4 10-4 14" />
      {/* Pastry tips */}
      <path d="M8 36c-2 2-3 5-1 7s5 0 7-3" />
      <path d="M56 36c2 2 3 5 1 7s-5 0-7-3" />
    </svg>
  );
}

/**
 * Single-color line illustration of an artisanal tea glass or pour-over kettle.
 */
export function ChaiGlass({ className = "w-6 h-6 text-cafe-olive", size, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Glass rim and body */}
      <path d="M12 8h24l-3 30a3 3 0 0 1-3 2H18a3 3 0 0 1-3-2L12 8z" />
      {/* Horizontal cut line */}
      <line x1="13.5" y1="20" x2="34.5" y2="20" />
      {/* Fluting lines */}
      <line x1="20" y1="20" x2="19" y2="36" />
      <line x1="24" y1="20" x2="24" y2="38" />
      <line x1="28" y1="20" x2="29" y2="36" />
    </svg>
  );
}

/**
 * Single-color botanical coffee leaf and cherry sprig.
 */
export function BotanicalSprig({ className = "w-6 h-6 text-cafe-olive", size, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Stem */}
      <path d="M8 40c8-10 16-20 28-30" />
      {/* Leaf 1 left */}
      <path d="M20 26c-6-2-9-7-8-12 5 0 10 3 12 7" />
      {/* Leaf 2 right */}
      <path d="M26 19c6-2 11 0 13 5-5 2-10 1-13-1" />
      {/* Berries */}
      <circle cx="21" cy="29" r="2.5" />
      <circle cx="27" cy="22" r="2.5" />
    </svg>
  );
}

/**
 * Editorial section divider with delicate diamond center motif.
 */
export function EditorialDivider({ className = "w-full text-cafe-border" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-6 ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-current opacity-60" />
      <div className="flex items-center gap-1.5 opacity-80">
        <span className="block h-1 w-1 rotate-45 bg-current" />
        <span className="block h-2 w-2 rotate-45 border border-current" />
        <span className="block h-1 w-1 rotate-45 bg-current" />
      </div>
      <div className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
