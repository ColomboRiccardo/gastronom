"use client";

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { type Language } from "@/lib/i18n/translations";
import {
  createTranslator,
  isLanguage,
  type Translate,
  type TranslateVars,
} from "@/lib/i18n/translate";

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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
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
