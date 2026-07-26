export type CookieCategory = "necessary" | "preferences" | "analytics" | "marketing";

export interface CookiePreferences {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  version: number;
  decidedAt: string;
  preferences: CookiePreferences;
}

export const COOKIE_CONSENT_STORAGE_KEY = "gastronom_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;

export const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL_PREFERENCES: CookiePreferences = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};

export function canUseCategory(
  state: CookieConsentState | null,
  category: CookieCategory,
): boolean {
  if (category === "necessary") return true;
  if (!state) return false;
  return Boolean(state.preferences[category]);
}

export function readConsentFromStorage(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (!parsed?.preferences || parsed.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }
    return {
      ...parsed,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...parsed.preferences,
        necessary: true,
      },
    };
  } catch {
    return null;
  }
}

export function writeConsentToStorage(preferences: CookiePreferences): CookieConsentState {
  const state: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    preferences: { ...preferences, necessary: true },
  };
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("gastronom:cookie-consent", { detail: state }));
  return state;
}
