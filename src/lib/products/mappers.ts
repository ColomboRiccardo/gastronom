import { type AdminProduct, type DbProductRow, type UiProduct } from "./types";

const EUR_FORMATTER = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const FALLBACK_IMAGE = "/cat-gifts.jpg";
const FALLBACK_CATEGORY = "Other";

function resolveCategory(row: DbProductRow): string {
  return (
    row.lackmann_data?.maingroup?.trim() ||
    (row.category_id !== null ? `Category ${row.category_id}` : FALLBACK_CATEGORY)
  );
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
    category: resolveCategory(row),
    badge: row.badge || undefined,
    createdAt: row.created_at,
  };
}

export function mapDbProductToAdminProduct(row: DbProductRow): AdminProduct {
  const price = Number(row.price);

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    category: resolveCategory(row),
    price,
    priceDisplay: EUR_FORMATTER.format(price),
    stock: row.stock,
    status: row.status,
    published: row.published,
    image: row.image_url || FALLBACK_IMAGE,
  };
}
