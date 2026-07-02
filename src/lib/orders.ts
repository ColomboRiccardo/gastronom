/**
 * Orders data-fetching utilities.
 *
 * These functions query Supabase and transform the raw DB rows
 * into the OrderDetail format that OrdersTab and AdminOrdersTab expect.
 *
 * WHY a separate file?
 * - Keeps data logic out of UI components (separation of concerns)
 * - Both customer and admin components reuse the same transform logic
 * - Easy to test in isolation later
 */

import { createClient } from "@/lib/supabase/client";
import type { OrderDetail, OrderItem } from "@/components/account/OrderDetailModal";

/**
 * Transforms a raw Supabase order row (with nested order_items) into
 * the OrderDetail shape the UI components expect.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformOrder(row: any): OrderDetail {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: OrderItem[] = (row.order_items || []).map((item: any) => ({
    name: item.product_name,
    qty: item.qty,
    price: `€${Number(item.unit_price).toFixed(2)}`,
  }));

  return {
    id: `ORD-${row.id}`,
    date: new Date(row.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    customer: row.profiles?.name || row.profiles?.email || undefined,
    items,
    total: `€${Number(row.total).toFixed(2)}`,
    status: row.status,
    shippingAddress: row.shipping_address || undefined,
    paymentMethod: row.payment_method || undefined,
  };
}

/**
 * Fetch orders for a specific user (customer view).
 * Returns orders sorted newest first.
 */
export async function fetchUserOrders(userId: string): Promise<OrderDetail[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items ( product_name, qty, unit_price )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }

  return (data || []).map(transformOrder);
}

/**
 * Fetch ALL orders (admin view).
 * Joins with profiles to get the customer name.
 * Returns orders sorted newest first.
 */
export async function fetchAllOrders(): Promise<OrderDetail[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items ( product_name, qty, unit_price ),
      profiles ( name, email )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }

  return (data || []).map(transformOrder);
}

/**
 * Update an order's status (admin action).
 * Returns true if successful.
 */
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  const supabase = createClient();

  // orderId comes in as "ORD-123", we need just the numeric part
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

/**
 * Delete an order (admin action).
 * Returns true if successful.
 */
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
