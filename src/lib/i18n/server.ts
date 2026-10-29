import type { Metadata } from "next";
import { headers } from "next/headers";

import { localizePath, OG_LOCALES } from "./locale-path";
import { createTranslator, toLanguage, SUPPORTED_LANGUAGES, type Language, type Translate } from "./translate";

/** Header set by middleware after stripping the locale prefix from the URL. */
export const LOCALE_HEADER = "x-locale";

export async function getRequestLocale(): Promise<Language> {
  const store = await headers();
  return toLanguage(store.get(LOCALE_HEADER));
}

export async function getServerTranslator(): Promise<{ locale: Language; t: Translate }> {
  const locale = await getRequestLocale();
  return { locale, t: createTranslator(locale) };
}

/**
 * Self-referencing canonical plus hreflang for every language and x-default.
 * `path` is the unprefixed route ("/products/foo"), optionally with a query string.
 */
export function localeAlternates(path: string, locale: Language): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    languages[lang] = localizePath(path, lang);
  }
  languages["x-default"] = localizePath(path, "en");
  return {
    canonical: localizePath(path, locale),
    languages,
  };
}

/**
 * Page-level openGraph replaces the layout's object wholesale, so pages that
 * add images need to repeat the shared bits.
 */
export function openGraphBase(path: string, locale: Language) {
  return {
    siteName: "Гастроном",
    type: "website" as const,
    locale: OG_LOCALES[locale],
    url: localizePath(path, locale),
  };
}

/** Metadata for a static, fully indexable page with dictionary-based copy. */
export async function localizedPageMetadata(options: {
  path: string;
  titleKey?: string;
  descriptionKey: string;
}): Promise<Metadata> {
  const { locale, t } = await getServerTranslator();
  return {
    title: options.titleKey ? t(options.titleKey) : undefined,
    description: t(options.descriptionKey),
    alternates: localeAlternates(options.path, locale),
  };
}
