import { readStoredLanguage } from "@/context/LanguageContext";
import { type CartItem } from "@/context/CartContext";
import type { ShippingMethodKind } from "@/lib/shipping/config";

export function buildCheckoutLineItems(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }));
}

export interface CheckoutShippingPayload {
  method: ShippingMethodKind;
  city?: string;
  postalCode?: string;
}

export async function startCheckout(
  items: CartItem[],
  shipping: CheckoutShippingPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: buildCheckoutLineItems(items),
      shipping,
      // Emails about this order are written in the language chosen here.
      language: readStoredLanguage(),
    }),
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (data.url) {
    window.location.href = data.url;
    return { ok: true };
  }

  return { ok: false, error: data.error || "Failed to start checkout" };
}
