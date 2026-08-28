/** Editable shipping rates and local delivery cities. Change these before launch. */

export type ShippingMethodKind = "pickup" | "local" | "courier";

export type CourierZone = "north" | "rest";

export type ResolvedShippingMethod =
  | "pickup"
  | "local"
  | "courier_north"
  | "courier_rest";

export const SHOP = {
  name: "Gastronom",
  /** Shown on pickup orders and emails. */
  address: "Via Nuvoloni 13, 18038 Sanremo (IM), Italy",
  /** Fallback only. The site renders the translated "home.hours_value" instead. */
  hours: "Mon-Sun 10:00-14:00 / 15:00-20:00",
  phone: "+39 348 655 6241",
} as const;

/** Flat rates in EUR. */
export const SHIPPING_RATES = {
  pickup: 0,
  local: 5,
  courierNorth: 9.9,
  courierRest: 12.9,
} as const;

/**
 * Cities where local van delivery is offered (case-insensitive match).
 * Add aliases under `aliases` when customers type variants.
 */
export const LOCAL_DELIVERY_CITIES: Array<{ name: string; aliases?: string[] }> = [
  { name: "Loano" },
  { name: "Pietra Ligure", aliases: ["Pietra"] },
  { name: "Borghetto Santo Spirito", aliases: ["Borghetto"] },
  { name: "Toirano" },
  { name: "Boissano" },
  { name: "Bardineto" },
  { name: "Ceriale" },
  { name: "Albenga" },
];

/**
 * Italian CAP first two digits → North zone.
 * Rough North Italy band (Piemonte, Lombardia, Veneto, Liguria, Emilia-Romagna, Trentino, Friuli, Valle d'Aosta).
 * Everything else in Italy maps to "rest" (Centre / South / islands).
 */
export const NORTH_CAP_PREFIXES = new Set([
  "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
  "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
]);

export const METHOD_LABELS: Record<ResolvedShippingMethod, string> = {
  pickup: "Ritiro in negozio",
  local: "Consegna locale",
  courier_north: "Spedizione Italia (Nord)",
  courier_rest: "Spedizione Italia (Centro/Sud)",
};
