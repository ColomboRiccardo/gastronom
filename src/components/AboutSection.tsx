"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SHOP } from "@/lib/shipping/config";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-navy text-primary-foreground relative">
      {/* Top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden rotate-180">
        <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-gold-light text-sm tracking-[0.2em] uppercase mb-2">
            {t("home.about_since")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            {t("home.about_title")}
          </h2>
          <p className="font-body text-primary-foreground/80 text-lg leading-relaxed mb-10">
            {t("home.about_body")}
          </p>

          <div className="grid sm:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">{t("home.visit_us")}</h4>
                <p className="font-body text-sm text-primary-foreground/60">{SHOP.address}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">{t("home.opening_hours")}</h4>
                <p className="font-body text-sm text-primary-foreground/60">{SHOP.hours}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">{t("home.call_us")}</h4>
                <p className="font-body text-sm text-primary-foreground/60">{SHOP.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
        <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
      </div>
    </section>
  );
};

export default AboutSection;
