export const PUBLIC_PRODUCTS_PAGE_SIZE = 20;
export const ADMIN_PRODUCTS_PAGE_SIZE = 50;

export const PRICE_RANGES = [
  { label: "Under €10", min: 0, max: 10 },
  { label: "€10 – €25", min: 10, max: 25 },
  { label: "€25 – €50", min: 25, max: 50 },
  { label: "Over €50", min: 50, max: Infinity },
] as const;

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "newest";

export type AdminProductsSortKey =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc"
  | "category-asc"
  | "category-desc";

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function buildPageMeta(totalCount: number, page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return { totalPages, page: safePage };
}
