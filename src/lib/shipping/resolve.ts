import {
  LOCAL_DELIVERY_CITIES,
  METHOD_LABELS,
  NORTH_CAP_PREFIXES,
  SHIPPING_RATES,
  SHOP,
  type CourierZone,
  type ResolvedShippingMethod,
  type ShippingMethodKind,
} from "./config";

export interface ShippingRequest {
  method: ShippingMethodKind;
  city?: string;
  postalCode?: string;
}

export interface ResolvedShipping {
  method: ResolvedShippingMethod;
  kind: ShippingMethodKind;
  displayName: string;
  cost: number;
  costCents: number;
  city?: string;
  postalCode?: string;
  courierZone?: CourierZone;
  /** Address stored on the order for pickup. */
  pickupAddress?: string;
}

function normalizeCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function listLocalCities(): string[] {
  return LOCAL_DELIVERY_CITIES.map((c) => c.name);
}

export function matchLocalCity(input: string): string | null {
  const needle = normalizeCity(input);
  if (!needle) return null;

  for (const city of LOCAL_DELIVERY_CITIES) {
    const names = [city.name, ...(city.aliases ?? [])];
    if (names.some((n) => normalizeCity(n) === needle)) {
      return city.name;
    }
  }
  return null;
}

export function normalizePostalCode(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 5) return null;
  return digits;
}

export function resolveCourierZone(postalCode: string): CourierZone | null {
  const cap = normalizePostalCode(postalCode);
  if (!cap) return null;
  const prefix = cap.slice(0, 2);
  return NORTH_CAP_PREFIXES.has(prefix) ? "north" : "rest";
}

export function resolveShipping(
  request: ShippingRequest,
  options: { hasFrozenItems: boolean },
): { ok: true; shipping: ResolvedShipping } | { ok: false; error: string } {
  const { method } = request;

  if (method === "pickup") {
    return {
      ok: true,
      shipping: {
        method: "pickup",
        kind: "pickup",
        displayName: METHOD_LABELS.pickup,
        cost: SHIPPING_RATES.pickup,
        costCents: Math.round(SHIPPING_RATES.pickup * 100),
        pickupAddress: `Pickup — ${SHOP.name}, ${SHOP.address}`,
      },
    };
  }

  if (method === "local") {
    const cityInput = request.city?.trim() ?? "";
    if (!cityInput) {
      return { ok: false, error: "Select a city for local delivery" };
    }
    const city = matchLocalCity(cityInput);
    if (!city) {
      return {
        ok: false,
        error: "Local delivery is not available in that city. Choose pickup or courier.",
      };
    }
    return {
      ok: true,
      shipping: {
        method: "local",
        kind: "local",
        displayName: `${METHOD_LABELS.local} — ${city}`,
        cost: SHIPPING_RATES.local,
        costCents: Math.round(SHIPPING_RATES.local * 100),
        city,
      },
    };
  }

  if (method === "courier") {
    if (options.hasFrozenItems) {
      return {
        ok: false,
        error: "Frozen products cannot be shipped by courier. Choose pickup or local delivery.",
      };
    }
    const postalCode = normalizePostalCode(request.postalCode ?? "");
    if (!postalCode) {
      return { ok: false, error: "Enter a valid 5-digit Italian CAP" };
    }
    const zone = resolveCourierZone(postalCode);
    if (!zone) {
      return { ok: false, error: "Could not resolve shipping zone for that CAP" };
    }
    const resolvedMethod: ResolvedShippingMethod =
      zone === "north" ? "courier_north" : "courier_rest";
    const cost = zone === "north" ? SHIPPING_RATES.courierNorth : SHIPPING_RATES.courierRest;
    return {
      ok: true,
      shipping: {
        method: resolvedMethod,
        kind: "courier",
        displayName: METHOD_LABELS[resolvedMethod],
        cost,
        costCents: Math.round(cost * 100),
        postalCode,
        courierZone: zone,
      },
    };
  }

  return { ok: false, error: "Invalid shipping method" };
}

/** Public preview helpers for the cart UI (same math as the server). */
export function previewCourierCost(postalCode: string): {
  ok: true;
  zone: CourierZone;
  cost: number;
  displayName: string;
} | { ok: false; error: string } {
  const result = resolveShipping(
    { method: "courier", postalCode },
    { hasFrozenItems: false },
  );
  if (!result.ok) return result;
  return {
    ok: true,
    zone: result.shipping.courierZone!,
    cost: result.shipping.cost,
    displayName: result.shipping.displayName,
  };
}
