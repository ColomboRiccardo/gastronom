"use client";

import { useCookieConsent } from "@/context/CookieConsentContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CookiePreferencesLink({
  className = "text-primary underline underline-offset-2 hover:text-foreground",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const { openPreferences } = useCookieConsent();
  const { t } = useLanguage();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      {label ?? t("footer.cookie_preferences")}
    </button>
  );
}
