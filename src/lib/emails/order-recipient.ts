import { createAdminClient } from "@/lib/supabase/admin";

import type { OrderEmailItem } from "./types";

export interface OrderNotificationContext {
  orderId: number;
  userId: string;
  customerEmail: string;
  customerName?: string;
  items: OrderEmailItem[];
  total: number;
  shippingAddress?: string | null;
  paymentMethod?: string | null;
}

export async function loadOrderNotificationContext(
  orderId: number,
): Promise<OrderNotificationContext | null> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return null;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      total,
      shipping_address,
      payment_method,
      order_items ( product_name, qty, unit_price ),
      profiles ( name, email )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error(`Failed to load order ${orderId} for email:`, error?.message);
    return null;
  }

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
  const customerEmail = profile?.email;
  if (!customerEmail) {
    console.error(`No customer email for order ${orderId}`);
    return null;
  }

  const items: OrderEmailItem[] = (order.order_items || []).map(
    (item: { product_name: string; qty: number; unit_price: number }) => ({
      product_name: item.product_name,
      qty: item.qty,
      unit_price: Number(item.unit_price),
    }),
  );

  return {
    orderId: order.id as number,
    userId: order.user_id as string,
    customerEmail,
    customerName: profile?.name ?? undefined,
    items,
    total: Number(order.total),
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
  };
}
