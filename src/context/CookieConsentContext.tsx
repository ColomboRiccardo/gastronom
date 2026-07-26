"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ACCEPT_ALL_PREFERENCES,
  DEFAULT_PREFERENCES,
  canUseCategory,
  readConsentFromStorage,
  writeConsentToStorage,
  type CookieCategory,
  type CookieConsentState,
  type CookiePreferences,
} from "@/lib/cookies/consent";

interface CookieConsentContextValue {
  ready: boolean;
  consent: CookieConsentState | null;
  showBanner: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  allows: (category: CookieCategory) => boolean;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsentFromStorage());
    setReady(true);

    const onExternalUpdate = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      if (detail) setConsent(detail);
    };

    window.addEventListener("gastronom:cookie-consent", onExternalUpdate);
    return () => window.removeEventListener("gastronom:cookie-consent", onExternalUpdate);
  }, []);

  const persist = useCallback((preferences: CookiePreferences) => {
    const next = writeConsentToStorage(preferences);
    setConsent(next);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      consent,
      showBanner: ready && !consent,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      acceptAll: () => persist(ACCEPT_ALL_PREFERENCES),
      rejectNonEssential: () => persist(DEFAULT_PREFERENCES),
      savePreferences: persist,
      allows: (category) => canUseCategory(consent, category),
    }),
    [ready, consent, preferencesOpen, persist],
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
