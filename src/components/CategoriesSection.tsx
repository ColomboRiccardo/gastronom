"use client";

import Link from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import CategoryGrid from "@/components/CategoryGrid";
import { useLanguage } from "@/context/LanguageContext";
import { resolveCategoryName } from "@/lib/products/resolve-copy";
import { type CategorySummary } from "@/lib/products/types";

interface CategoriesSectionProps {
  categories: CategorySummary[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const { t, language } = useLanguage();
  const previewCategories = categories.slice(0, 6);
  const hasMore = categories.length > previewCategories.length;

  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            {t("home.categories_eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("home.categories_title")}
          </h2>
        </div>

        <CategoryGrid categories={previewCategories} columns="home" />

        {categories.length > 0 && (
          <nav
            aria-label={t("home.categories_all_label")}
            className="mt-10 max-w-5xl mx-auto"
          >
            <p className="font-body text-sm text-muted-foreground text-center mb-3">
              {t("home.categories_all_label")}
            </p>
            <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${encodeURIComponent(cat.slug)}`}
                    className="font-body text-sm text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
                  >
                    {resolveCategoryName(cat, cat.translations, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="font-body border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10">
              <Link href="/categories">{t("home.view_all_categories")}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
