"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import { useLanguage } from "@/context/LanguageContext";
import { type CategorySummary } from "@/lib/products/types";

export default function CategoriesPageClient({
  categories,
}: {
  categories: CategorySummary[];
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("categories.page_title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            {t("categories.subtitle")}
          </p>
        </div>
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">
              {t("categories.empty")}
            </p>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
