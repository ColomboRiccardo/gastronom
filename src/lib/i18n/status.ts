/**
 * Order and product statuses are stored in English in the database.
 * These maps turn a stored value into a dictionary key so the UI can
 * translate it without ever changing what is persisted.
 */

const ORDER_STATUS_KEYS: Record<string, string> = {
  Received: "status.received",
  Processing: "status.processing",
  Modification: "status.modification",
  Shipped: "status.shipped",
  Delivered: "status.delivered",
  Cancelled: "status.cancelled",
};

const PRODUCT_STATUS_KEYS: Record<string, string> = {
  "In Stock": "product_status.in_stock",
  "Low Stock": "product_status.low_stock",
  "Out of Stock": "product_status.out_of_stock",
  Draft: "product_status.draft",
  Published: "product_status.published",
  Archived: "product_status.archived",
};

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function translateOrderStatus(status: string, t: Translate): string {
  const key = ORDER_STATUS_KEYS[status];
  return key ? t(key) : status;
}

export function translateProductStatus(status: string, t: Translate): string {
  const key = PRODUCT_STATUS_KEYS[status];
  return key ? t(key) : status;
}

const SHIPPING_METHOD_KEYS: Record<string, string> = {
  pickup: "shipping.method_pickup",
  local: "shipping.method_local",
  courier_north: "shipping.method_courier_north",
  courier_rest: "shipping.method_courier_rest",
};

/**
 * Orders placed before shipping methods were stored as identifiers hold the
 * Italian label instead, so those spellings map back to the same keys.
 */
const LEGACY_SHIPPING_LABELS: Record<string, string> = {
  "ritiro in negozio": "shipping.method_pickup",
  "consegna locale": "shipping.method_local",
  "spedizione italia (nord)": "shipping.method_courier_north",
  "spedizione italia (centro/sud)": "shipping.method_courier_rest",
};

export function translateShippingMethod(method: string, t: Translate): string {
  const direct = SHIPPING_METHOD_KEYS[method];
  if (direct) return t(direct);

  // Local delivery is stored with the town appended, such as "Consegna locale - Loano".
  const [head, ...rest] = method.split(/\s+[-–—]\s+/);
  const legacy = LEGACY_SHIPPING_LABELS[head.trim().toLowerCase()];
  if (!legacy) return method;

  const suffix = rest.join(" - ").trim();
  return suffix ? `${t(legacy)} - ${suffix}` : t(legacy);
}
