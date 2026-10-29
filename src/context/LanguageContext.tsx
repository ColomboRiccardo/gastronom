"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Language } from "@/lib/i18n/translations";
import {
  createTranslator,
  isLanguage,
  type Translate,
  type TranslateVars,
} from "@/lib/i18n/translate";
import { localizePath, splitLocaleFromPath } from "@/lib/i18n/locale-path";

export type { Language, TranslateVars };

const STORAGE_KEY = "app-language";

interface LanguageInfo {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translate;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  /**
   * Language the server rendered with. Comes from the URL prefix ("/it/...")
   * or defaults to English, so SSR and the first client render agree.
   */
  initialLanguage?: Language;
}

// localStorage is treated as an external store so the saved preference can be
// read without a setState-in-effect dance. Same-tab writes go through
// writeStoredLanguage, which pokes the listeners (the "storage" event only
// fires in other tabs).
const listeners = new Set<() => void>();

function subscribeStored(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function writeStoredLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach((listener) => listener());
}

export const LanguageProvider = ({ children, initialLanguage = "en" }: LanguageProviderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const urlLocale = splitLocaleFromPath(pathname ?? "/").urlLocale;

  const stored = useSyncExternalStore(
    subscribeStored,
    () => localStorage.getItem(STORAGE_KEY),
    () => null,
  );

  // The URL wins when it carries a locale; otherwise the saved preference, then
  // whatever the server rendered with.
  const language: Language = urlLocale ?? (isLanguage(stored) ? stored : initialLanguage);

  // Landing on a prefixed URL updates the preference. Keyed on the URL alone:
  // reacting to `stored` as well would write the old locale back while the
  // navigation triggered by setLanguage is still in flight.
  useEffect(() => {
    if (urlLocale) {
      writeStoredLanguage(urlLocale);
    }
  }, [urlLocale]);

  // Root layout is not re-rendered on client navigation, so keep <html lang> in sync here.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    writeStoredLanguage(lang);

    const current = splitLocaleFromPath(pathname ?? "/").pathname;
    const target = localizePath(current, lang) + window.location.search + window.location.hash;
    if (target !== window.location.pathname + window.location.search + window.location.hash) {
      router.push(target);
      // "/it/products" and "/products" rewrite to the same segments, so the
      // router cache may still hold payloads (title, canonical) rendered in the
      // previous language. Refreshing drops them.
      router.refresh();
    }
  };

  const t = useMemo(() => createTranslator(language), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

/**
 * Reads the stored language outside React, for code paths that need to send it
 * to the server (checkout) before any provider is in scope.
 */
export function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isLanguage(saved) ? saved : "en";
}
