import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import { localizedPageMetadata, getServerTranslator } from "@/lib/i18n/server";
import { fetchPublishedCategorySummaries } from "@/lib/products/server-queries";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/categories",
    titleKey: "meta.categories_title",
    descriptionKey: "meta.categories_description",
  });
}

export default async function CategoriesPage() {
  const [categories, { t }] = await Promise.all([
    fetchPublishedCategorySummaries(),
    getServerTranslator(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("categories.page_title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("categories.subtitle")}
          </p>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-3">
            {t("categories.intro")}
          </p>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-3">
            {t("categories.seo_extra")}
          </p>
        </div>
        {/* Decorative border; empty alt keeps it out of the accessibility tree. */}
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">{t("categories.empty")}</p>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
