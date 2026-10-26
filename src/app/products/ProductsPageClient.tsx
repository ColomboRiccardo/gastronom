"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import ListPagination from "@/components/ListPagination";
import Link from "next/link";
import { type SortOption } from "@/lib/products/constants";
import { resolveCategoryName } from "@/lib/products/resolve-copy";
import { type UiProduct, type CategorySummary } from "@/lib/products/types";
import { useLanguage } from "@/context/LanguageContext";

interface ProductsPageClientProps {
  products: UiProduct[];
  totalCount: number;
  page: number;
  totalPages: number;
  categories: CategorySummary[];
  initialCategories: string[];
  initialPriceRange: number | null;
  initialSort: SortOption;
}

const ProductsPageClient = ({
  products,
  totalCount,
  page,
  totalPages,
  categories,
  initialCategories,
  initialPriceRange,
  initialSort,
}: ProductsPageClientProps) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [, startTransition] = useTransition();

  const activeCategory =
    initialCategories.length === 1
      ? categories.find((c) => c.slug === initialCategories[0])
      : undefined;
  const activeCategoryLabel = activeCategory
    ? resolveCategoryName(activeCategory, activeCategory.translations, language)
    : null;

  const buildQueryString = useCallback(
    (overrides: {
      page?: number;
      categories?: string[];
      priceRange?: number | null;
      sort?: SortOption;
    }) => {
      const cats = overrides.categories ?? initialCategories;
      const price = overrides.priceRange !== undefined ? overrides.priceRange : initialPriceRange;
      const sort = overrides.sort ?? initialSort;
      const nextPage = overrides.page ?? page;

      const params = new URLSearchParams();
      cats.forEach((c) => params.append("category", c));
      if (price != null) {
        params.set("price", String(price));
      }
      if (sort !== "newest") {
        params.set("sort", sort);
      }
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      const qs = params.toString();
      return qs ? `/products?${qs}` : "/products";
    },
    [initialCategories, initialPriceRange, initialSort, page],
  );

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleCategoriesChange = (cats: string[]) => {
    navigate(buildQueryString({ page: 1, categories: cats }));
  };

  const handlePriceRangeChange = (idx: number | null) => {
    navigate(buildQueryString({ page: 1, priceRange: idx }));
  };

  const handleSortChange = (sort: SortOption) => {
    navigate(buildQueryString({ page: 1, sort }));
  };

  const buildPageHref = (nextPage: number) => buildQueryString({ page: nextPage });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {activeCategoryLabel ?? t("products.title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {activeCategoryLabel
              ? t("products.category_intro", { category: activeCategoryLabel })
              : t("products.subtitle")}
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
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters
              categories={categories}
              selectedCategories={initialCategories}
              onCategoriesChange={handleCategoriesChange}
              selectedPriceRange={initialPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              sort={initialSort}
              onSortChange={handleSortChange}
              resultCount={totalCount}
            />

            <div className="flex-1">
              {totalCount === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">{t("products.no_results")}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">{t("products.no_results")}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <ListPagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
                </>
              )}
            </div>
          </div>

          {categories.length > 1 && (
            <nav
              aria-label={t("products.browse_categories")}
              className="mt-14 pt-10 border-t border-border"
            >
              <h2 className="font-display text-xl font-semibold text-foreground text-center mb-4">
                {t("products.browse_categories")}
              </h2>
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-4xl mx-auto">
                {categories.map((cat) => {
                  const label = resolveCategoryName(cat, cat.translations, language);
                  const isActive = initialCategories.length === 1 && cat.slug === initialCategories[0];
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/products?category=${encodeURIComponent(cat.slug)}`}
                        className={`font-body text-sm underline-offset-4 hover:underline ${
                          isActive
                            ? "text-primary font-medium"
                            : "text-foreground/80 hover:text-primary"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPageClient;
