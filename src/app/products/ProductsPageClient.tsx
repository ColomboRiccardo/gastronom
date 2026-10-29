"use client";

import { useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import ListPagination from "@/components/ListPagination";
import Link from "@/components/LocalizedLink";
import { type SortOption } from "@/lib/products/constants";
import { resolveCategoryIntro, resolveCategoryName, resolveTagCopy } from "@/lib/products/resolve-copy";
import { shopQueryString } from "@/lib/products/shop-params";
import { type UiProduct, type CategorySummary, type TagSummary } from "@/lib/products/types";
import { localizeHref } from "@/lib/i18n/locale-path";
import { useLanguage } from "@/context/LanguageContext";

interface ProductsPageClientProps {
  products: UiProduct[];
  totalCount: number;
  page: number;
  totalPages: number;
  categories: CategorySummary[];
  tags?: TagSummary[];
  /** Collections that overlap with the current category (category pages only). */
  relatedTags?: TagSummary[];
  initialCategories: string[];
  initialPriceRange: number | null;
  initialSort: SortOption;
  /** "/categories/<slug>" when rendering a category landing page; defaults to "/products". */
  basePath?: string;
}

const ProductsPageClient = ({
  products,
  totalCount,
  page,
  totalPages,
  categories,
  tags = [],
  relatedTags = [],
  initialCategories,
  initialPriceRange,
  initialSort,
  basePath = "/products",
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
  const activeIntro = activeCategory
    ? resolveCategoryIntro(activeCategory.translations, language)
    : null;

  const buildHref = useCallback(
    (overrides: {
      page?: number;
      categories?: string[];
      priceRange?: number | null;
      sort?: SortOption;
    }) => {
      const cats = overrides.categories ?? initialCategories;
      const priceRangeIndex =
        overrides.priceRange !== undefined ? overrides.priceRange : initialPriceRange;
      const sort = overrides.sort ?? initialSort;
      const nextPage = overrides.page ?? page;

      // Exactly one category lives at its clean URL; anything else goes through /products.
      if (cats.length === 1) {
        const path = `/categories/${encodeURIComponent(cats[0])}`;
        return `${path}${shopQueryString({ page: nextPage, sort, priceRangeIndex })}`;
      }
      return `/products${shopQueryString({ page: nextPage, sort, priceRangeIndex, categories: cats })}`;
    },
    [initialCategories, initialPriceRange, initialSort, page],
  );

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(localizeHref(href, language));
    });
  };

  const handleCategoriesChange = (cats: string[]) => {
    navigate(buildHref({ page: 1, categories: cats }));
  };

  const handlePriceRangeChange = (idx: number | null) => {
    navigate(buildHref({ page: 1, priceRange: idx }));
  };

  const handleSortChange = (sort: SortOption) => {
    navigate(buildHref({ page: 1, sort }));
  };

  const buildPageHref = (nextPage: number) => buildHref({ page: nextPage });
  const isCategoryPage = basePath !== "/products";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          {isCategoryPage && (
            <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
              {t("category.eyebrow")}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {activeCategoryLabel ?? t("products.title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
            {activeCategoryLabel
              ? activeIntro ?? t("products.category_intro", { category: activeCategoryLabel })
              : t("products.subtitle")}
          </p>
        </div>
        <Image
          src="/slavic-border.png"
          alt=""
          width={1920}
          height={512}
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
              {totalCount === 0 || products.length === 0 ? (
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

          {relatedTags.length > 0 && (
            <nav aria-label={t("category.related_collections")} className="mt-14 pt-10 border-t border-border">
              <h2 className="font-display text-xl font-semibold text-foreground text-center mb-4">
                {t("category.related_collections")}
              </h2>
              <ul className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                {relatedTags.map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/collections/${encodeURIComponent(tag.slug)}`}
                      className="inline-block rounded-full border border-border px-3 py-1 font-body text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                    >
                      {resolveTagCopy(tag, tag.translations, language).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {categories.length > 1 && (
            <nav
              aria-label={isCategoryPage ? t("category.other_categories") : t("products.browse_categories")}
              className={`mt-14 pt-10 border-t border-border ${relatedTags.length > 0 ? "mt-10" : ""}`}
            >
              <h2 className="font-display text-xl font-semibold text-foreground text-center mb-4">
                {isCategoryPage ? t("category.other_categories") : t("products.browse_categories")}
              </h2>
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-4xl mx-auto">
                {categories.map((cat) => {
                  const label = resolveCategoryName(cat, cat.translations, language);
                  const isActive = initialCategories.length === 1 && cat.slug === initialCategories[0];
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/categories/${encodeURIComponent(cat.slug)}`}
                        aria-current={isActive ? "page" : undefined}
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

          {tags.length > 0 && (
            <nav aria-label={t("products.collections_title")} className="mt-10">
              <h2 className="font-display text-xl font-semibold text-foreground text-center mb-4">
                {t("products.collections_title")}
              </h2>
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-4xl mx-auto">
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/collections/${encodeURIComponent(tag.slug)}`}
                      className="font-body text-sm text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
                    >
                      {resolveTagCopy(tag, tag.translations, language).name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/collections"
                    className="font-body text-sm text-primary font-medium underline-offset-4 hover:underline"
                  >
                    {t("collections.browse_all")}
                  </Link>
                </li>
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
