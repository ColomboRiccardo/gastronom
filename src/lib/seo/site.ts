import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://www.gastronomsanremo.com";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
}

/** Utility / transactional pages: crawlable for links, not ranking targets. */
export const noIndexFollow: Metadata["robots"] = {
  index: false,
  follow: true,
};

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
