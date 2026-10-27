import { cafeConfig } from "@/config/cafe";
import { isDemoMode } from "@/config/site";

/**
 * Normalizes an Instagram handle by stripping leading @, slashes, and whitespace.
 */
function cleanInstagramHandle(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^@+/, "").replace(/^\/+|\/+$/g, "");
}

/**
 * Normalizes a Facebook page name or id by stripping slashes and whitespace.
 */
function cleanFacebookPage(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^\/+|\/+$/g, "");
}

/**
 * Validates and extracts digits only for WhatsApp (10 to 15 digits).
 * Strips spaces, plus signs, dashes, and other non-digit characters.
 */
function cleanWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 15) {
    return digits;
  }
  return null;
}

/**
 * Returns the Instagram URL.
 * - If handle configured: "https://www.instagram.com/<handle>/"
 * - In demo mode (unconfigured): "https://www.instagram.com/"
 * - In live mode (unconfigured): null
 */
export function instagramUrl(): string | null {
  const handle = cleanInstagramHandle(cafeConfig.social?.instagram);
  if (handle) {
    return `https://www.instagram.com/${handle}/`;
  }
  if (isDemoMode()) {
    return "https://www.instagram.com/";
  }
  return null;
}

/**
 * Returns the Facebook URL.
 * - If page configured: "https://www.facebook.com/<page>"
 * - In demo mode (unconfigured): "https://www.facebook.com/"
 * - In live mode (unconfigured): null
 */
export function facebookUrl(): string | null {
  const page = cleanFacebookPage(cafeConfig.social?.facebook);
  if (page) {
    return `https://www.facebook.com/${page}`;
  }
  if (isDemoMode()) {
    return "https://www.facebook.com/";
  }
  return null;
}

/**
 * Returns the WhatsApp URL.
 * - If valid number (10-15 digits) configured:
 *     "https://wa.me/<digits>?text=<encodeURIComponent(text)>" (or without query if text empty)
 * - In demo mode (unconfigured):
 *     "https://wa.me/?text=<encodeURIComponent(text)>" (or "https://wa.me/" if text empty)
 * - In live mode (unconfigured): null
 */
export function whatsappUrl(text?: string): string | null {
  const rawNumber = cafeConfig.whatsapp || cafeConfig.contact?.whatsapp || cafeConfig.contact?.phone;
  const digits = cleanWhatsAppNumber(rawNumber);
  const encodedText = text && text.trim().length > 0 ? encodeURIComponent(text) : "";

  if (digits) {
    return encodedText ? `https://wa.me/${digits}?text=${encodedText}` : `https://wa.me/${digits}`;
  }

  if (isDemoMode()) {
    return encodedText ? `https://wa.me/?text=${encodedText}` : "https://wa.me/";
  }

  return null;
}

export function getPhoneLink(): { display: string; href: string } | null {
  const phone = cafeConfig.contact?.phone?.trim();
  if (phone) {
    const cleanDigits = phone.replace(/[^0-9+]/g, "");
    return { display: phone, href: `tel:${cleanDigits}` };
  }
  if (isDemoMode()) {
    return { display: "+91 120 456 7890", href: "tel:+911204567890" };
  }
  return null;
}

export function getEmailLink(): { display: string; href: string } | null {
  const email = cafeConfig.contact?.email?.trim();
  if (email) {
    return { display: email, href: `mailto:${email}` };
  }
  if (isDemoMode()) {
    return { display: "hello@monarchbrew.in", href: "mailto:hello@monarchbrew.in" };
  }
  return null;
}

/**
 * Returns live verified social profile URLs for JSON-LD sameAs schema.
 * Strictly returns configured URLs only, never demo platform homepages.
 */
export function getLiveSocialUrls(): string[] {
  const urls: string[] = [];
  const handle = cleanInstagramHandle(cafeConfig.social?.instagram);
  if (handle) {
    urls.push(`https://www.instagram.com/${handle}/`);
  }
  const page = cleanFacebookPage(cafeConfig.social?.facebook);
  if (page) {
    urls.push(`https://www.facebook.com/${page}`);
  }
  return urls;
}
