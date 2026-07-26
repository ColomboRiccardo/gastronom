"use client";

import { useCookieConsent } from "@/context/CookieConsentContext";

export default function CookiePreferencesLink({
  className = "text-primary underline underline-offset-2 hover:text-foreground",
  label = "Cookie preferences",
}: {
  className?: string;
  label?: string;
}) {
  const { openPreferences } = useCookieConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      {label}
    </button>
  );
}
