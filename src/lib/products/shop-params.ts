import { type SortOption } from "./constants";

/** Query-string parsing shared by /products and /categories/[slug]. */

export type ShopSearchParams = {
  page?: string;
  category?: string | string[];
  price?: string;
  sort?: string;
};

export function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value || "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

export function parsePriceRange(value: string | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export function parseSort(value: string | undefined): SortOption {
  const valid: SortOption[] = ["newest", "price-asc", "price-desc", "name-asc"];
  return valid.includes(value as SortOption) ? (value as SortOption) : "newest";
}

export function categoriesFromParams(params: ShopSearchParams): string[] {
  if (!params.category) return [];
  const raw = Array.isArray(params.category) ? params.category : [params.category];
  return raw.map((c) => decodeURIComponent(c)).filter(Boolean);
}

/** Rebuilds the non-category part of the query string (page/sort/price). */
export function shopQueryString(params: {
  page: number;
  sort: SortOption;
  priceRangeIndex: number | null;
  categories?: string[];
}): string {
  const search = new URLSearchParams();
  (params.categories ?? []).forEach((c) => search.append("category", c));
  if (params.priceRangeIndex != null) search.set("price", String(params.priceRangeIndex));
  if (params.sort !== "newest") search.set("sort", params.sort);
  if (params.page > 1) search.set("page", String(params.page));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/** A listing is a ranking target only on page 1 with default sort and no price filter. */
export function isFilteredListing(params: {
  page: number;
  sort: SortOption;
  priceRangeIndex: number | null;
}): boolean {
  return params.page > 1 || params.sort !== "newest" || params.priceRangeIndex != null;
}
