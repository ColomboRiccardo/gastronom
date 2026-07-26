"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCookieConsent } from "@/context/CookieConsentContext";
import {
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from "@/lib/cookies/consent";

const CATEGORY_COPY: Array<{
  key: keyof Omit<CookiePreferences, "necessary">;
  title: string;
  description: string;
}> = [
  {
    key: "preferences",
    title: "Preferences",
    description: "Remember language and display choices to improve your browsing experience.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Help us understand how the shop is used. No analytics scripts load without this.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Used for promotional emails or ads if we add them later. Off by default.",
  },
];

export default function CookieConsentBanner() {
  const {
    showBanner,
    preferencesOpen,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    consent,
  } = useCookieConsent();

  const [draft, setDraft] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (preferencesOpen) {
      setDraft(consent?.preferences ?? DEFAULT_PREFERENCES);
    }
  }, [preferencesOpen, consent]);

  if (!showBanner && !preferencesOpen) return null;

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-background shadow-lg">
            <div className="flex gap-3 p-4 sm:p-5">
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h2 id="cookie-consent-title" className="font-display text-lg font-semibold text-foreground">
                    Cookies & privacy
                  </h2>
                  <p id="cookie-consent-desc" className="mt-1 font-body text-sm text-muted-foreground leading-relaxed">
                    We use necessary cookies to run the shop (login, cart, security). Optional cookies
                    for preferences, analytics, and marketing are off until you choose. Read our{" "}
                    <Link href="/cookies" className="underline underline-offset-2 hover:text-foreground">
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                  <Button variant="ghost" size="sm" className="gap-1.5" onClick={openPreferences}>
                    <Settings2 className="h-3.5 w-3.5" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" onClick={rejectNonEssential}>
                    Necessary only
                  </Button>
                  <Button size="sm" onClick={acceptAll}>
                    Accept all
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={preferencesOpen} onOpenChange={(open) => (open ? openPreferences() : closePreferences())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Cookie preferences</DialogTitle>
            <DialogDescription>
              Necessary cookies are always on. Everything else is optional and can be changed anytime
              from the footer or account settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Necessary</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Authentication, cart, security, and storing your consent choice.
                </p>
              </div>
              <Switch checked disabled aria-label="Necessary cookies always enabled" />
            </div>

            {CATEGORY_COPY.map((category) => (
              <div
                key={category.key}
                className="flex items-start justify-between gap-4 rounded-md border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{category.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                </div>
                <Switch
                  checked={draft[category.key]}
                  onCheckedChange={(checked) =>
                    setDraft((prev) => ({ ...prev, [category.key]: checked }))
                  }
                  aria-label={`${category.title} cookies`}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closePreferences}>
              Cancel
            </Button>
            <Button onClick={() => savePreferences(draft)}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
