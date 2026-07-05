import { deriveStockStatus, formatPrice } from "./mappers";
import { type AdminProduct, type AdminProductUpdate } from "./types";

function mergeEditorLocks(
  current: string[],
  fields: string[],
): string[] {
  return [...new Set([...current, ...fields])];
}

function changedLockFields(
  product: AdminProduct,
  update: AdminProductUpdate,
): string[] {
  const stock = Math.max(0, Math.floor(update.stock));
  const name = update.name.trim();
  const description = update.description.trim();
  const badge = update.badge?.trim() || null;
  const changed: string[] = [];

  if (name !== product.name) changed.push("name");
  if (description !== product.description) changed.push("description");
  if (update.price !== product.price) changed.push("price");
  if (stock !== product.stock) changed.push("stock", "status");
  if (badge !== product.badge) changed.push("badge");

  return changed;
}

export function patchAdminProduct(
  product: AdminProduct,
  update: AdminProductUpdate,
): AdminProduct {
  const stock = Math.max(0, Math.floor(update.stock));
  const name = update.name.trim();
  const description = update.description.trim();
  const price = update.price;
  const badge = update.badge?.trim() || null;
  const lockFields = changedLockFields(product, update);

  return {
    ...product,
    name,
    description,
    price,
    priceDisplay: formatPrice(price),
    stock,
    status: deriveStockStatus(stock),
    badge,
    editorLockedFields:
      lockFields.length > 0
        ? mergeEditorLocks(product.editorLockedFields, lockFields)
        : product.editorLockedFields,
  };
}

export interface AdminProductFilterState {
  search: string;
  category: string;
  published: string;
  status: string;
}

const STATUS_FILTER_MAP: Record<string, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export function matchesAdminProductFilters(
  product: AdminProduct,
  filters: AdminProductFilterState,
): boolean {
  if (filters.search.trim()) {
    const term = filters.search.trim().toLowerCase();
    if (!product.name.toLowerCase().includes(term)) return false;
  }

  if (filters.category !== "all" && product.category !== filters.category) {
    return false;
  }

  if (filters.published === "published" && !product.published) return false;
  if (filters.published === "draft" && product.published) return false;

  if (filters.status !== "all") {
    const statusValue = STATUS_FILTER_MAP[filters.status];
    if (statusValue && product.status !== statusValue) return false;
  }

  return true;
}

export function upsertAdminProductInList(
  products: AdminProduct[],
  updated: AdminProduct,
  filters: AdminProductFilterState,
): AdminProduct[] {
  if (!matchesAdminProductFilters(updated, filters)) {
    return products.filter((p) => p.id !== updated.id);
  }

  const exists = products.some((p) => p.id === updated.id);
  if (!exists) return products;

  return products.map((p) => (p.id === updated.id ? updated : p));
}
