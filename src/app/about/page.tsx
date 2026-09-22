"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Clock, Phone, Heart, Truck, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SHOP } from "@/lib/shipping/config";

const VALUE_KEYS = [
  { icon: Heart, titleKey: "about.value_auth_title", bodyKey: "about.value_auth_body" },
  { icon: Star, titleKey: "about.value_quality_title", bodyKey: "about.value_quality_body" },
  { icon: Truck, titleKey: "about.value_fresh_title", bodyKey: "about.value_fresh_body" },
] as const;

const TIMELINE_KEYS = [
  { year: "2019", titleKey: "about.tl_2019_title", bodyKey: "about.tl_2019_body" },
  { year: "2021", titleKey: "about.tl_2021_title", bodyKey: "about.tl_2021_body" },
  { year: "2023", titleKey: "about.tl_2023_title", bodyKey: "about.tl_2023_body" },
  { year: "2025", titleKey: "about.tl_2025_title", bodyKey: "about.tl_2025_body" },
] as const;

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-16">
        <div className="bg-navy text-primary-foreground py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)",
              }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="font-body text-gold-light text-sm tracking-[0.2em] uppercase mb-3">
              {t("about.eyebrow")}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              {t("about.page_title")}
            </h1>
            <p className="font-body text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              {t("about.page_subtitle")}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
            <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("about.story_title")}
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              {t("about.story_p1")}
            </p>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              {t("about.story_p2")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t("about.values_title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {VALUE_KEYS.map((v) => (
              <div
                key={v.titleKey}
                className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {t(v.titleKey)}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {t(v.bodyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
            {t("about.journey_title")}
          </h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            {TIMELINE_KEYS.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 mt-1 z-10" />
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"
                  }`}
                >
                  <span className="font-display text-2xl font-bold text-primary">{item.year}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {t(item.bodyKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy text-primary-foreground relative">
        <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden rotate-180">
          <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            {t("about.visit_title")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: MapPin, title: t("home.visit_us"), detail: t("home.address_value") },
              { icon: Clock, title: t("home.opening_hours"), detail: t("home.hours_value") },
              { icon: Phone, title: t("home.call_us"), detail: SHOP.phone },
            ].map((c) => (
              <div key={c.title} className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-gold-light" />
                </div>
                <h4 className="font-display text-lg font-semibold">{c.title}</h4>
                <p className="font-body text-sm text-primary-foreground/60">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
          <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
