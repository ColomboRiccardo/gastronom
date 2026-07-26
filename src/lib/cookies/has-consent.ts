/**
 * Gate third-party scripts on cookie category consent.
 * Example:
 *   if (hasCookieConsent("analytics")) { loadPlausible(); }
 */
import {
  canUseCategory,
  readConsentFromStorage,
  type CookieCategory,
} from "@/lib/cookies/consent";

export function hasCookieConsent(category: CookieCategory): boolean {
  return canUseCategory(readConsentFromStorage(), category);
}
