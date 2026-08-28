/**
 * Client-side order mutations (status updates, deletes).
 * Reads are handled server-side in ./server-queries.ts.
 */

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  const response = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error("Failed to update order status:", data.error || response.statusText);
    return false;
  }

  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const response = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error("Failed to delete order:", data.error || response.statusText);
    return false;
  }

  return true;
}

export type ModificationAction = "accept" | "decline";

export async function resolveOrderModification(
  orderId: string,
  action: ModificationAction,
): Promise<boolean> {
  const response = await fetch(`/api/admin/orders/${orderId}/resolve-modification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error("Failed to resolve modification:", data.error || response.statusText);
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
