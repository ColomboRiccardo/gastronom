import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isLanguage, type Language } from "./translate";

/**
 * URL locale handling, shared by middleware, server components and the client.
 * English lives at the root ("/products"); the other languages get a prefix
 * ("/it/products"). Keep this file free of React and Next imports.
 */

export const PREFIXED_LANGUAGES: Language[] = SUPPORTED_LANGUAGES.filter(
  (lang) => lang !== DEFAULT_LANGUAGE,
);

/** og:locale values per language. */
export const OG_LOCALES: Record<Language, string> = {
  en: "en_GB",
  fr: "fr_FR",
  it: "it_IT",
  ru: "ru_RU",
};

export interface SplitPath {
  /** Locale found in the first segment, or null when the path is unprefixed. */
  urlLocale: Language | null;
  /** The path without the locale segment, always starting with "/". */
  pathname: string;
}

export function splitLocaleFromPath(pathname: string): SplitPath {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(pathname);
  if (!match || !isLanguage(match[1])) {
    return { urlLocale: null, pathname: pathname || "/" };
  }
  const rest = pathname.slice(match[0].length);
  return { urlLocale: match[1], pathname: rest || "/" };
}

/** Prefix a path (no query string) with the locale segment when needed. */
export function localizePath(pathname: string, locale: Language): string {
  const clean = splitLocaleFromPath(pathname).pathname;
  if (locale === DEFAULT_LANGUAGE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

function isInternalPagePath(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  if (href.startsWith("/api/") || href.startsWith("/_next/")) return false;
  // Static files such as /hero-shop.jpg or /sitemap.xml
  const lastSegment = href.split(/[?#]/)[0].split("/").pop() ?? "";
  return !lastSegment.includes(".");
}

/** Like localizePath but keeps query string and hash, and leaves external or asset hrefs alone. */
export function localizeHref(href: string, locale: Language): string {
  if (!isInternalPagePath(href)) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const path = match?.[1] || "/";
  const suffix = match?.[2] ?? "";
  return `${localizePath(path, locale)}${suffix}`;
}
