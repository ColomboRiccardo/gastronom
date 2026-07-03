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
