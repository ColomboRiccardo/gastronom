import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import ProductsPageClient from "../ProductsPageClient";
import { getRequestLocale, getServerTranslator, localeAlternates } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/locale-path";
import {
  fetchPublishedCategorySummaries,
  fetchPublishedProductsPage,
  fetchPublishedTags,
} from "@/lib/products/server-queries";
import {
  categoriesFromParams,
  isFilteredListing,
  parsePage,
  parsePriceRange,
  parseSort,
  shopQueryString,
  type ShopSearchParams,
} from "@/lib/products/shop-params";
import { noIndexFollow } from "@/lib/seo/site";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePage(params.page);
  const sort = parseSort(params.sort);
  const priceRangeIndex = parsePriceRange(params.price);
  const categories = categoriesFromParams(params);
  const { locale, t } = await getServerTranslator();

  const title = page > 1 ? `${t("meta.shop_title")} · ${t("meta.page_n", { page })}` : t("meta.shop_title");
  const description =
    page > 1 ? `${t("meta.shop_description")} ${t("meta.page_n", { page })}.` : t("meta.shop_description");

  const filtered = isFilteredListing({ page, sort, priceRangeIndex }) || categories.length > 0;

  return {
    title,
    description,
    alternates: localeAlternates("/products", locale),
    robots: filtered ? noIndexFollow : undefined,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const categoriesFromUrl = categoriesFromParams(params);
  const priceRangeIndex = parsePriceRange(params.price);
  const sort = parseSort(params.sort);

  // A single category has its own clean URL. The proxy already 308s this shape;
  // this is the fallback should a request slip past it.
  if (categoriesFromUrl.length === 1) {
    const locale = await getRequestLocale();
    const target = localizePath(`/categories/${encodeURIComponent(categoriesFromUrl[0])}`, locale);
    permanentRedirect(`${target}${shopQueryString({ page, sort, priceRangeIndex })}`);
  }

  const [categorySummaries, productPage, tags] = await Promise.all([
    fetchPublishedCategorySummaries(),
    fetchPublishedProductsPage({
      page,
      categories: categoriesFromUrl,
      priceRangeIndex,
      sort,
    }),
    fetchPublishedTags(),
  ]);

  return (
    <ProductsPageClient
      products={productPage.items}
      totalCount={productPage.totalCount}
      page={productPage.page}
      totalPages={productPage.totalPages}
      categories={categorySummaries}
      tags={tags}
      initialCategories={categoriesFromUrl}
      initialPriceRange={priceRangeIndex}
      initialSort={sort}
    />
  );
}
