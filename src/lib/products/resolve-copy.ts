import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/translate";

export interface ProductTranslationRow {
  language: Language;
  name: string;
  description: string | null;
}

export interface CategoryTranslationRow {
  language: Language;
  name: string;
  /** Landing-page intro for /categories/<slug>; optional, admin-written. */
  intro?: string | null;
}

export interface TagTranslationRow {
  language: Language;
  name: string;
  intro?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface LocalizedTagCopy {
  name: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
}

export interface LocalizedProductCopy {
  name: string;
  description: string;
}

/**
 * Strategy: requested language → English translation → canonical products row.
 * Empty names are treated as missing so a half-filled row never blanks the shop.
 */
export function resolveProductCopy(
  canonical: { name: string; description: string | null | undefined },
  translations: ProductTranslationRow[] | null | undefined,
  language: Language,
): LocalizedProductCopy {
  const byLanguage = new Map(
    (translations ?? [])
      .filter((row) => row.name?.trim())
      .map((row) => [row.language, row] as const),
  );

  const preferred = byLanguage.get(language) ?? byLanguage.get(DEFAULT_LANGUAGE);

  if (preferred) {
    return {
      name: preferred.name.trim(),
      description: (preferred.description ?? "").trim(),
    };
  }

  return {
    name: canonical.name,
    description: (canonical.description ?? "").trim(),
  };
}

export function resolveCategoryName(
  canonical: { name: string },
  translations: CategoryTranslationRow[] | null | undefined,
  language: Language,
): string {
  const byLanguage = new Map(
    (translations ?? [])
      .filter((row) => row.name?.trim())
      .map((row) => [row.language, row] as const),
  );

  const preferred = byLanguage.get(language) ?? byLanguage.get(DEFAULT_LANGUAGE);
  if (preferred?.name?.trim()) return preferred.name.trim();
  return canonical.name?.trim() || "Other";
}

/** Compact map for client components that re-resolve when the UI language changes. */
export function translationsToList(
  translations: ProductTranslationRow[] | null | undefined,
): ProductTranslationRow[] {
  return (translations ?? []).filter((row) => row.name?.trim());
}

/** Intro paragraph in the requested language, falling back to English. Null when nobody wrote one. */
export function resolveCategoryIntro(
  translations: CategoryTranslationRow[] | null | undefined,
  language: Language,
): string | null {
  const rows = (translations ?? []).filter((row) => row.intro?.trim());
  const exact = rows.find((row) => row.language === language);
  if (exact?.intro) return exact.intro.trim();
  const english = rows.find((row) => row.language === "en");
  return english?.intro?.trim() ?? null;
}

export function categoryTranslationsToList(
  translations: CategoryTranslationRow[] | null | undefined,
): CategoryTranslationRow[] {
  return (translations ?? []).filter((row) => row.name?.trim());
}

/** Same language → en → canonical strategy, with per-field fallback for intro/SEO. */
export function resolveTagCopy(
  canonical: { name: string },
  translations: TagTranslationRow[] | null | undefined,
  language: Language,
): LocalizedTagCopy {
  const byLanguage = new Map(
    (translations ?? [])
      .filter((row) => row.name?.trim())
      .map((row) => [row.language, row] as const),
  );

  const preferred = byLanguage.get(language);
  const english = byLanguage.get(DEFAULT_LANGUAGE);
  const name = preferred?.name?.trim() || english?.name?.trim() || canonical.name?.trim() || "";

  const pick = (key: "intro" | "seoTitle" | "seoDescription"): string =>
    (preferred?.[key] ?? "").trim() || (english?.[key] ?? "").trim();

  return {
    name,
    intro: pick("intro"),
    seoTitle: pick("seoTitle") || name,
    seoDescription: pick("seoDescription"),
  };
}

export function tagTranslationsToList(
  translations: TagTranslationRow[] | null | undefined,
): TagTranslationRow[] {
  return (translations ?? []).filter((row) => row.name?.trim());
}
