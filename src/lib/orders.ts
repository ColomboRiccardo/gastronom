/**
 * Client-side order mutations (status updates, deletes).
 * Reads are handled server-side in ./server-queries.ts.
 */

import { createClient } from "@/lib/supabase/client";

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  const supabase = createClient();
  const numericId = orderId.replace("ORD-", "");

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", numericId);

  if (error) {
    console.error("Failed to update order status:", error);
    return false;
  }
  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const supabase = createClient();
  const numericId = orderId.replace("ORD-", "");

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", numericId);

  if (error) {
    console.error("Failed to delete order:", error);
    return false;
  }
  return true;
}

export interface ProposeModificationInput {
  productId?: number;
  name: string;
  qty: number;
  price: string;
}

export interface ProposeModificationResult {
  ok: boolean;
  whatsappUrl?: string | null;
  error?: string;
}

export async function proposeOrderModification(
  orderId: string,
  items: ProposeModificationInput[],
  message?: string,
): Promise<ProposeModificationResult> {
  const payload = {
    items: items.map((item) => ({
      product_id: item.productId ?? null,
      product_name: item.name,
      qty: item.qty,
      unit_price: parseFloat(item.price.replace("€", "")),
    })),
    message,
  };

  const response = await fetch(`/api/admin/orders/${orderId}/propose-modification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { ok: false, error: data.error || "Failed to send modification proposal" };
  }

  return { ok: true, whatsappUrl: data.whatsappUrl ?? null };
}
