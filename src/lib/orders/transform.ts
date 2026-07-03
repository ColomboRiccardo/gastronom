import type { OrderDetail, OrderItem } from "@/components/account/OrderDetailModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformOrder(row: any): OrderDetail {
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
