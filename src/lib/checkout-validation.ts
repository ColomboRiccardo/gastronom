import type { SupabaseClient } from "@supabase/supabase-js";

export interface CheckoutRequestItem {
  productId: number;
  quantity: number;
}

export interface ValidatedCheckoutItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string | null;
}

interface ProductRow {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
  image_url: string | null;
  published: boolean;
}

export function parseCheckoutItems(input: unknown): CheckoutRequestItem[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }

  const parsed: CheckoutRequestItem[] = [];

  for (const raw of input) {
    if (!raw || typeof raw !== "object") {
      return null;
    }

    const candidate = raw as { productId?: unknown; quantity?: unknown };
    const productId = Number(candidate.productId);
    const quantity = Number(candidate.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      return null;
    }
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 99) {
      return null;
    }

    parsed.push({ productId, quantity });
  }

  return parsed;
}

export async function validateCheckoutItems(
  supabase: SupabaseClient,
  items: CheckoutRequestItem[],
): Promise<{ ok: true; items: ValidatedCheckoutItem[] } | { ok: false; error: string }> {
  const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,stock,status,image_url,published")
    .in("id", uniqueProductIds);

  if (error) {
    return { ok: false, error: "Could not validate cart against current products" };
  }

  const products = new Map<number, ProductRow>(
    ((data || []) as ProductRow[]).map((row) => [row.id, row]),
  );

  const validated: ValidatedCheckoutItem[] = [];
  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      return { ok: false, error: "Some products in your cart are no longer available" };
    }

    if (!product.published) {
      return { ok: false, error: `${product.name} is not available right now` };
    }

    if (product.stock <= 0 || product.status === "Out of Stock") {
      return { ok: false, error: `${product.name} is out of stock` };
    }

    if (item.quantity > product.stock) {
      return { ok: false, error: `Only ${product.stock} left for ${product.name}` };
    }

    validated.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice: Number(product.price),
      imageUrl: product.image_url,
    });
  }

  return { ok: true, items: validated };
}
