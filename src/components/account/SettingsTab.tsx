"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import { useLanguage } from "@/context/LanguageContext";

const SettingsTab = () => {
  const { t } = useLanguage();

  const preferences = [
    { title: t("settings.email_notifications"), desc: "Receive order updates and promotions", action: "On" },
    { title: t("settings.language"), desc: "Display language preference", action: "English" },
    { title: t("settings.currency"), desc: "Preferred display currency", action: "EUR (€)" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">{t("settings.preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.map((item, i, arr) => (
            <div key={item.title} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Button variant="outline" size="sm">{item.action}</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">{t("settings.account")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-muted">
            {t("settings.change_password")}
          </Button>
          <div className="rounded-md border border-border p-3 space-y-2">
            <p className="text-sm font-medium text-foreground">{t("settings.privacy")}</p>
            <p className="text-xs text-muted-foreground">
              Manage optional cookies and read how we handle personal data.
            </p>
            <div className="flex flex-wrap gap-3 text-sm pt-1">
              <CookiePreferencesLink label={t("footer.cookie_preferences")} />
              <Link href="/privacy" className="text-primary underline underline-offset-2">
                {t("footer.privacy")}
              </Link>
              <Link href="/cookies" className="text-primary underline underline-offset-2">
                {t("footer.cookies")}
              </Link>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="w-4 h-4" />
            {t("settings.logout")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
