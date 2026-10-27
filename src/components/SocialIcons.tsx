import React from "react";

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8A9 9 0 1 1 21 12a9 9 0 0 1-9 9 8.96 8.96 0 0 1-4.6-1.28L3 21" />
      <path d="M8.5 9.5c.2-.5.5-.5.8-.5h.6c.2 0 .4.1.5.3l.8 1.9c.1.3.1.5 0 .7l-.5.7c-.1.2-.1.3 0 .5.4.8 1.1 1.5 1.9 1.9.2.1.3.1.5 0l.7-.5c.2-.1.4-.1.7 0l1.9.8c.2.1.3.3.3.5v.6c0 .3 0 .6-.5.8-.6.2-1.6.4-3.5-.6-2.2-1.1-3.6-3.3-3.7-3.5-.2-.3-.9-1.2-.9-2.3 0-1.1.6-1.7.8-1.9z" />
    </svg>
  );
}
