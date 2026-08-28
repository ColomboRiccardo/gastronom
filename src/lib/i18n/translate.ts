import { translations, type Language } from "./translations";

export type { Language };

export type TranslateVars = Record<string, string | number>;
export type Translate = (key: string, vars?: TranslateVars) => string;

export const DEFAULT_LANGUAGE: Language = "en";
export const SUPPORTED_LANGUAGES: Language[] = ["en", "fr", "it", "ru"];

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as string[]).includes(value);
}

export function toLanguage(value: unknown): Language {
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (out, [name, value]) => out.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

/**
 * Builds a translator for one language. Deliberately free of React so the same
 * dictionary serves both the browser and server-rendered email templates.
 */
export function createTranslator(language: Language): Translate {
  const dictionary = translations[language] ?? translations[DEFAULT_LANGUAGE];
  const fallback = translations[DEFAULT_LANGUAGE];
  const pluralRules = new Intl.PluralRules(language);

  return (key, vars) => {
    const candidates: string[] = [];

    // "3 results" needs a different noun form per language, so a count picks
    // the suffixed variant (key_one / key_few / key_many / key_other) first.
    if (typeof vars?.count === "number") {
      candidates.push(`${key}_${pluralRules.select(vars.count)}`, `${key}_other`);
    }
    candidates.push(key);

    for (const candidate of candidates) {
      const value = dictionary[candidate] ?? fallback[candidate];
      if (value) return interpolate(value, vars);
    }

    return key;
  };
}
