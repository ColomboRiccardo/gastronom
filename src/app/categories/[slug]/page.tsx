import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductsPageClient from "@/app/products/ProductsPageClient";
import { getServerTranslator, localeAlternates, openGraphBase } from "@/lib/i18n/server";
import { resolveCategoryIntro, resolveCategoryName } from "@/lib/products/resolve-copy";
import {
  fetchPublishedCategorySummaries,
  fetchPublishedProductsPage,
  fetchPublishedTags,
} from "@/lib/products/server-queries";
import {
  isFilteredListing,
  parsePage,
  parsePriceRange,
  parseSort,
  type ShopSearchParams,
} from "@/lib/products/shop-params";
import { type CategorySummary } from "@/lib/products/types";
import { absoluteUrl, noIndexFollow } from "@/lib/seo/site";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<ShopSearchParams>;

async function findCategory(slug: string): Promise<{ category: CategorySummary | null; all: CategorySummary[] }> {
  const all = await fetchPublishedCategorySummaries();
  return { category: all.find((c) => c.slug === slug) ?? null, all };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const [{ slug }, query, { locale, t }] = await Promise.all([params, searchParams, getServerTranslator()]);
  const { category } = await findCategory(slug);

  if (!category) {
    return { title: t("meta.not_found"), robots: noIndexFollow };
  }

  const page = parsePage(query.page);
  const sort = parseSort(query.sort);
  const priceRangeIndex = parsePriceRange(query.price);

  const name = resolveCategoryName(category, category.translations, locale);
  const intro = resolveCategoryIntro(category.translations, locale);
  const description = intro
    ? intro.replace(/\s+/g, " ").slice(0, 155)
    : t("meta.category_description", { category: name });
  const path = `/categories/${encodeURIComponent(category.slug)}`;
  const pageSuffix = page > 1 ? ` · ${t("meta.page_n", { page })}` : "";

  return {
    title: `${name}${pageSuffix}`,
    description,
    alternates: localeAlternates(path, locale),
    robots: isFilteredListing({ page, sort, priceRangeIndex }) ? noIndexFollow : undefined,
    openGraph: {
      ...openGraphBase(path, locale),
      title: `${name} — Гастроном`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ slug }, query, { locale }] = await Promise.all([params, searchParams, getServerTranslator()]);
  const { category, all } = await findCategory(slug);
  if (!category) notFound();

  const page = parsePage(query.page);
  const sort = parseSort(query.sort);
  const priceRangeIndex = parsePriceRange(query.price);

  const [productPage, tags] = await Promise.all([
    fetchPublishedProductsPage({ page, categories: [category.slug], priceRangeIndex, sort }),
    fetchPublishedTags(),
  ]);

  // Collections that overlap with this category, judged from the products on this page.
  const tagIdsOnPage = new Set(productPage.items.flatMap((p) => p.tags.map((tag) => tag.id)));
  const relatedTags = tags.filter((tag) => tagIdsOnPage.has(tag.id));

  const name = resolveCategoryName(category, category.translations, locale);
  const categoryUrl = absoluteUrl(`/categories/${encodeURIComponent(category.slug)}`);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Categories", item: absoluteUrl("/categories") },
      { "@type": "ListItem", position: 3, name, item: categoryUrl },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productPage.totalCount,
      itemListElement: productPage.items.map((p, i) => ({
        "@type": "ListItem",
        position: (productPage.page - 1) * productPage.pageSize + i + 1,
        url: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
        name: p.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <ProductsPageClient
        products={productPage.items}
        totalCount={productPage.totalCount}
        page={productPage.page}
        totalPages={productPage.totalPages}
        categories={all}
        tags={tags}
        relatedTags={relatedTags}
        initialCategories={[category.slug]}
        initialPriceRange={priceRangeIndex}
        initialSort={sort}
        basePath={`/categories/${encodeURIComponent(category.slug)}`}
      />
    </>
  );
}
