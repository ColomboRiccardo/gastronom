import { type AdminProduct, type DbProductRow, type UiProduct } from "./types";

const EUR_FORMATTER = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const FALLBACK_IMAGE = "/cat-gifts.jpg";
const FALLBACK_CATEGORY = "Other";
const LOW_STOCK_THRESHOLD = 10;

export function deriveStockStatus(stock: number): string {
  if (stock <= 0) return "Out of Stock";
  if (stock < LOW_STOCK_THRESHOLD) return "Low Stock";
  return "In Stock";
}

/** Placeholder until per-category images are added in Supabase. */
export const PLACEHOLDER_CATEGORY_IMAGE = FALLBACK_IMAGE;

export function resolveCategory(
  row: Pick<DbProductRow, "lackmann_data" | "category_id">,
): string {
  return (
    row.lackmann_data?.maingroup?.trim() ||
    (row.category_id !== null ? `Category ${row.category_id}` : FALLBACK_CATEGORY)
  );
}

function resolveCategoryRow(row: DbProductRow): string {
  return resolveCategory(row);
}

export function mapDbProductToUiProduct(row: DbProductRow): UiProduct {
  const priceNum = Number(row.price);

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: EUR_FORMATTER.format(priceNum),
    priceNum,
    image: row.image_url || FALLBACK_IMAGE,
    category: resolveCategoryRow(row),
    badge: row.badge || undefined,
    createdAt: row.created_at,
  };
}

export function formatPrice(price: number): string {
  return EUR_FORMATTER.format(price);
}

export function mapDbProductToAdminProduct(row: DbProductRow): AdminProduct {
  const price = Number(row.price);

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    category: resolveCategoryRow(row),
    price,
    priceDisplay: EUR_FORMATTER.format(price),
    stock: row.stock,
    status: row.status,
    published: row.published,
    badge: row.badge,
    image: row.image_url || FALLBACK_IMAGE,
    editorLockedFields: row.editor_locked_fields ?? [],
  };
}
