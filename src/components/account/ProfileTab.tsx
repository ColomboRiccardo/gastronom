"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";
import { type AppUser } from "@/lib/auth/types";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileTabProps {
  user: AppUser;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  const { t } = useLanguage();
  const emptyLabel = t("profile.empty");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {t("profile.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: t("profile.name"), value: user.name || emptyLabel },
            { label: t("profile.email"), value: user.email || emptyLabel },
            { label: t("profile.phone"), value: user.phone || emptyLabel },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {field.label}
              </label>
              <p className="text-foreground font-medium mt-1">{field.value}</p>
            </div>
          ))}
          <Button
            variant="outline"
            className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            disabled
          >
            {t("profile.edit")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("profile.address")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {t("profile.address")}
            </label>
            <p className="text-foreground font-medium mt-1">{user.address || emptyLabel}</p>
          </div>
          <Button
            variant="outline"
            className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            disabled
          >
            {t("profile.manage_addresses")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
