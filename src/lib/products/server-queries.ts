import { createClient } from "@/lib/supabase/server";

import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  buildPageMeta,
  PRICE_RANGES,
  PUBLIC_PRODUCTS_PAGE_SIZE,
  type AdminProductsSortKey,
  type PaginatedResult,
  type SortOption,
} from "./constants";
import {
  mapDbProductToAdminProduct,
  mapDbProductToUiProduct,
  resolveCategory,
} from "./mappers";
import {
  type AdminProduct,
  type CategorySummary,
  type DbProductRow,
  type UiProduct,
} from "./types";

const FEATURED_SAMPLE_SIZE = 120;

const PUBLISHED_PRODUCTS_SELECT = `
  id,
  name,
  slug,
  description,
  category_id,
  price,
  stock,
  status,
  image_url,
  badge,
  published,
  created_at,
  lackmann_data
`;

const FEATURED_PRODUCTS_SELECT = PUBLISHED_PRODUCTS_SELECT;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface PublishedProductsPageParams {
  page?: number;
  pageSize?: number;
  categories?: string[];
  priceRangeIndex?: number | null;
  sort?: SortOption;
}

function applyPublishedSort(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  sort: SortOption,
) {
  switch (sort) {
    case "price-asc":
      return query.order("price", { ascending: true });
    case "price-desc":
      return query.order("price", { ascending: false });
    case "name-asc":
      return query.order("name", { ascending: true });
    default:
      return query.order("created_at", { ascending: false });
  }
}

/** Paginated published products for the catalog page. */
export async function fetchPublishedProductsPage(
  params: PublishedProductsPageParams = {},
): Promise<PaginatedResult<UiProduct>> {
  const pageSize = params.pageSize ?? PUBLIC_PRODUCTS_PAGE_SIZE;
  const requestedPage = params.page ?? 1;
  const sort = params.sort ?? "newest";
  const categories = params.categories?.filter(Boolean) ?? [];

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PUBLISHED_PRODUCTS_SELECT, { count: "exact" })
    .eq("published", true);

  if (categories.length === 1) {
    query = query.eq("lackmann_data->>maingroup", categories[0]);
  } else if (categories.length > 1) {
    query = query.in("lackmann_data->>maingroup", categories);
  }

  if (params.priceRangeIndex != null && PRICE_RANGES[params.priceRangeIndex]) {
    const range = PRICE_RANGES[params.priceRangeIndex];
    query = query.gte("price", range.min);
    if (range.max !== Infinity) {
      query = query.lt("price", range.max);
    }
  }

  query = applyPublishedSort(query, sort);

  const from = (Math.max(1, requestedPage) - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch published products page:", error.message);
    return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 1 };
  }

  const totalCount = count ?? 0;
  const meta = buildPageMeta(totalCount, requestedPage, pageSize);

  return {
    items: ((data || []) as DbProductRow[]).map(mapDbProductToUiProduct),
    totalCount,
    page: meta.page,
    pageSize,
    totalPages: meta.totalPages,
  };
}

/** @deprecated Use fetchPublishedProductsPage for the catalog. */
export async function fetchPublishedProducts(): Promise<UiProduct[]> {
  const result = await fetchPublishedProductsPage({ page: 1, pageSize: 1000 });
  return result.items;
}

/** Server-side category aggregation — lightweight columns only. */
export async function fetchPublishedCategorySummaries(): Promise<CategorySummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("lackmann_data, category_id")
    .eq("published", true);

  if (error) {
    console.error("Failed to fetch category summaries:", error.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of data || []) {
    const name = resolveCategory(
      row as Pick<DbProductRow, "lackmann_data" | "category_id">,
    );
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Pick random published products for the homepage featured grid. */
export async function fetchFeaturedPublishedProducts(
  count: number = 8,
): Promise<UiProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(FEATURED_PRODUCTS_SELECT)
    .eq("published", true)
    .limit(FEATURED_SAMPLE_SIZE);

  if (error) {
    console.error("Failed to fetch featured products:", error.message);
    return [];
  }

  const mapped = ((data || []) as DbProductRow[]).map(mapDbProductToUiProduct);
  return shuffle(mapped).slice(0, count);
}

export interface AdminProductsPageParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  published?: "all" | "published" | "draft";
  status?: "all" | "in-stock" | "low-stock" | "out-of-stock";
  sort?: AdminProductsSortKey;
}

const STATUS_FILTER_MAP: Record<string, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

function applyAdminSort(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  sort: AdminProductsSortKey,
) {
  const [key, dir] = sort.split("-") as [string, string];
  const ascending = dir === "asc";

  switch (key) {
    case "price":
      return query.order("price", { ascending });
    case "stock":
      return query.order("stock", { ascending });
    case "category":
      return query.order("lackmann_data->>maingroup", { ascending, nullsFirst: false });
    default:
      return query.order("name", { ascending });
  }
}

/** Paginated products for admin management. */
export async function fetchAdminProductsPage(
  params: AdminProductsPageParams = {},
): Promise<PaginatedResult<AdminProduct>> {
  const pageSize = params.pageSize ?? ADMIN_PRODUCTS_PAGE_SIZE;
  const requestedPage = params.page ?? 1;
  const sort = params.sort ?? "name-asc";

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PUBLISHED_PRODUCTS_SELECT, { count: "exact" });

  if (params.search?.trim()) {
    query = query.ilike("name", `%${params.search.trim()}%`);
  }

  if (params.category && params.category !== "all") {
    query = query.eq("lackmann_data->>maingroup", params.category);
  }

  if (params.published === "published") {
    query = query.eq("published", true);
  } else if (params.published === "draft") {
    query = query.eq("published", false);
  }

  if (params.status && params.status !== "all") {
    const statusValue = STATUS_FILTER_MAP[params.status];
    if (statusValue) {
      query = query.eq("status", statusValue);
    }
  }

  query = applyAdminSort(query, sort);

  const from = (Math.max(1, requestedPage) - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch admin products page:", error.message);
    return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 1 };
  }

  const totalCount = count ?? 0;
  const meta = buildPageMeta(totalCount, requestedPage, pageSize);

  return {
    items: ((data || []) as DbProductRow[]).map(mapDbProductToAdminProduct),
    totalCount,
    page: meta.page,
    pageSize,
    totalPages: meta.totalPages,
  };
}

/** Distinct category names for admin filters. */
export async function fetchAdminProductCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("lackmann_data, category_id");

  if (error) {
    console.error("Failed to fetch admin categories:", error.message);
    return [];
  }

  const names = new Set<string>();
  for (const row of data || []) {
    names.add(resolveCategory(row as Pick<DbProductRow, "lackmann_data" | "category_id">));
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

/** @deprecated Use fetchAdminProductsPage. */
export async function fetchAllProductsForAdmin(): Promise<AdminProduct[]> {
  const result = await fetchAdminProductsPage({ page: 1, pageSize: 1000 });
  return result.items;
}
