import ProductsPageClient from "./ProductsPageClient";
import { type SortOption } from "@/lib/products/constants";
import {
  fetchPublishedCategorySummaries,
  fetchPublishedProductsPage,
} from "@/lib/products/server-queries";

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string | string[];
    price?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);

  const categoriesFromUrl = (() => {
    if (params.category) {
      const raw = Array.isArray(params.category) ? params.category : [params.category];
      return raw.map((c) => decodeURIComponent(c)).filter(Boolean);
    }
    return [];
  })();

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

  const filterCategories = categorySummaries.map((c) => c.name);

  return (
    <ProductsPageClient
      products={productPage.items}
      totalCount={productPage.totalCount}
      page={productPage.page}
      totalPages={productPage.totalPages}
      categories={filterCategories}
      initialCategories={categoriesFromUrl}
      initialPriceRange={priceRangeIndex}
      initialSort={sort}
    />
  );
}
