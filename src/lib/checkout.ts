import { type CartItem } from "@/context/CartContext";

export function buildCheckoutLineItems(items: CartItem[]) {
  return items.map((item) => ({
    name: item.product.name,
    priceNum: item.product.priceNum,
    quantity: item.quantity,
    image: item.product.image.startsWith("http") ? item.product.image : undefined,
  }));
}

export async function startCheckout(
  items: CartItem[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: buildCheckoutLineItems(items) }),
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (data.url) {
    window.location.href = data.url;
    return { ok: true };
  }

  return { ok: false, error: data.error || "Failed to start checkout" };
}
