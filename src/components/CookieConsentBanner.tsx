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
import { useLanguage } from "@/context/LanguageContext";
import {
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from "@/lib/cookies/consent";

const CATEGORY_KEYS: Array<{
  key: keyof Omit<CookiePreferences, "necessary">;
  titleKey: string;
  descKey: string;
}> = [
  {
    key: "preferences",
    titleKey: "cookies.cat_preferences",
    descKey: "cookies.cat_preferences_desc",
  },
  {
    key: "analytics",
    titleKey: "cookies.cat_analytics",
    descKey: "cookies.cat_analytics_desc",
  },
  {
    key: "marketing",
    titleKey: "cookies.cat_marketing",
    descKey: "cookies.cat_marketing_desc",
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
  const { t } = useLanguage();

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
                    {t("cookies.title")}
                  </h2>
                  <p id="cookie-consent-desc" className="mt-1 font-body text-sm text-muted-foreground leading-relaxed">
                    {t("cookies.body")}{" "}
                    <Link href="/cookies" className="underline underline-offset-2 hover:text-foreground">
                      {t("cookies.policy")}
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                      {t("cookies.privacy_link")}
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                  <Button variant="ghost" size="sm" className="gap-1.5" onClick={openPreferences}>
                    <Settings2 className="h-3.5 w-3.5" />
                    {t("cookies.customize")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={rejectNonEssential}>
                    {t("cookies.necessary_only")}
                  </Button>
                  <Button size="sm" onClick={acceptAll}>
                    {t("cookies.accept_all")}
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
            <DialogTitle className="font-display">{t("cookies.prefs_title")}</DialogTitle>
            <DialogDescription>
              {t("cookies.prefs_desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{t("cookies.necessary")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("cookies.necessary_desc")}
                </p>
              </div>
              <Switch checked disabled aria-label={t("cookies.necessary")} />
            </div>

            {CATEGORY_KEYS.map((category) => {
              const title = t(category.titleKey);
              return (
                <div
                  key={category.key}
                  className="flex items-start justify-between gap-4 rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t(category.descKey)}</p>
                  </div>
                  <Switch
                    checked={draft[category.key]}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({ ...prev, [category.key]: checked }))
                    }
                    aria-label={`${title} cookies`}
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closePreferences}>
              {t("cookies.cancel")}
            </Button>
            <Button onClick={() => savePreferences(draft)}>{t("cookies.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
