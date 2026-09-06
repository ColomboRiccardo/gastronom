import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/translate";

export interface ProductTranslationRow {
  language: Language;
  name: string;
  description: string | null;
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

/** Compact map for client components that re-resolve when the UI language changes. */
export function translationsToList(
  translations: ProductTranslationRow[] | null | undefined,
): ProductTranslationRow[] {
  return (translations ?? []).filter((row) => row.name?.trim());
}
