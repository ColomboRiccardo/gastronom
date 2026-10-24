import type { Metadata } from "next";

import ProductsPageClient from "./ProductsPageClient";
import { type SortOption } from "@/lib/products/constants";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/translate";
import { resolveCategoryName } from "@/lib/products/resolve-copy";
import {
  fetchPublishedCategorySummaries,
  fetchPublishedProductsPage,
} from "@/lib/products/server-queries";
import { noIndexFollow } from "@/lib/seo/site";

type ProductsSearchParams = {
  page?: string;
  category?: string | string[];
  price?: string;
  sort?: string;
};

function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value || "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

function parsePriceRange(value: string | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function parseSort(value: string | undefined): SortOption {
  const valid: SortOption[] = ["newest", "price-asc", "price-desc", "name-asc"];
  return valid.includes(value as SortOption) ? (value as SortOption) : "newest";
}

function categoriesFromParams(params: ProductsSearchParams): string[] {
  if (!params.category) return [];
  const raw = Array.isArray(params.category) ? params.category : [params.category];
  return raw.map((c) => decodeURIComponent(c)).filter(Boolean);
}

/** Canonical shop URL: at most one category, never page/sort/price. */
function shopCanonicalPath(categorySlug: string | null): string {
  if (!categorySlug) return "/products";
  return `/products?category=${encodeURIComponent(categorySlug)}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePage(params.page);
  const categories = categoriesFromParams(params);
  const sort = parseSort(params.sort);
  const priceRangeIndex = parsePriceRange(params.price);
  const singleCategory = categories.length === 1 ? categories[0] : null;

  const summaries =
    singleCategory != null ? await fetchPublishedCategorySummaries() : [];
  const matched = singleCategory
    ? summaries.find((c) => c.slug === singleCategory)
    : undefined;
  const categoryLabel = matched
    ? resolveCategoryName(
        { name: matched.name },
        matched.translations,
        DEFAULT_LANGUAGE,
      )
    : singleCategory
      ? singleCategory.replace(/-/g, " ")
      : null;

  const titleParts: string[] = [];
  if (categoryLabel) titleParts.push(categoryLabel);
  else titleParts.push("Shop");
  if (page > 1) titleParts.push(`Page ${page}`);

  const isFiltered =
    page > 1 ||
    sort !== "newest" ||
    priceRangeIndex != null ||
    categories.length > 1;

  return {
    title: titleParts.join(" · "),
    description: categoryLabel
      ? `Buy ${categoryLabel} online from Гастроном, Eastern European delicatessen in Sanremo.`
      : "Browse authentic Eastern European products from Гастроном in Sanremo, Liguria.",
    alternates: {
      canonical: shopCanonicalPath(singleCategory),
    },
    robots: isFiltered ? noIndexFollow : undefined,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const categoriesFromUrl = categoriesFromParams(params);
  const priceRangeIndex = parsePriceRange(params.price);
  const sort = parseSort(params.sort);

  const [categorySummaries, productPage] = await Promise.all([
    fetchPublishedCategorySummaries(),
    fetchPublishedProductsPage({
      page,
      categories: categoriesFromUrl,
      priceRangeIndex,
      sort,
    }),
  ]);

  return (
    <ProductsPageClient
      products={productPage.items}
      totalCount={productPage.totalCount}
      page={productPage.page}
      totalPages={productPage.totalPages}
      categories={categorySummaries}
      initialCategories={categoriesFromUrl}
      initialPriceRange={priceRangeIndex}
      initialSort={sort}
    />
  );
}
