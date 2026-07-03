import { createClient } from "@/lib/supabase/server";

import type { OrderDetail } from "@/components/account/OrderDetailModal";
import { transformOrder } from "./transform";

/** Fetch orders for the logged-in customer (server-side). */
export async function fetchUserOrdersForAccount(userId: string): Promise<OrderDetail[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items ( product_name, qty, unit_price )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user orders:", error.message);
    return [];
  }

  return (data || []).map(transformOrder);
}

/** Fetch all orders for admin (server-side). */
export async function fetchAllOrdersForAdmin(): Promise<OrderDetail[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items ( product_name, qty, unit_price ),
      profiles ( name, email )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch all orders:", error.message);
    return [];
  }

  return (data || []).map(transformOrder);
}
