import type { OrderDetail, OrderItem } from "@/components/account/OrderDetailModal";
import { formatDate } from "@/lib/i18n/format";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrderItem(item: any): OrderItem {
  return {
    productId: item.product_id ?? undefined,
    name: item.product_name,
    qty: item.qty,
    price: `€${Number(item.unit_price).toFixed(2)}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProposalItems(proposal: any): OrderItem[] | undefined {
  if (!Array.isArray(proposal)) return undefined;
  return proposal.map((item) => ({
    productId: item.product_id ?? undefined,
    name: item.product_name,
    qty: item.qty,
    price: `€${Number(item.unit_price).toFixed(2)}`,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformOrder(row: any): OrderDetail {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const items: OrderItem[] = (row.order_items || []).map(mapOrderItem);

  return {
    id: `ORD-${row.id}`,
    date: formatDate(row.created_at),
    createdAt: row.created_at,
    customer: profile?.name || profile?.email || undefined,
    customerEmail: profile?.email || undefined,
    customerPhone: profile?.phone || undefined,
    items,
    modificationProposal: mapProposalItems(row.modification_proposal),
    modificationOriginalItems: mapProposalItems(row.modification_original_items),
    modificationMessage: row.modification_message || undefined,
    modificationSentAt: row.modification_sent_at || undefined,
    modificationState: row.modification_state || undefined,
    total: `€${Number(row.total).toFixed(2)}`,
    status: row.status,
    shippingAddress: row.shipping_address || undefined,
    shippingMethod: row.shipping_method || undefined,
    shippingCost:
      row.shipping_cost != null ? `€${Number(row.shipping_cost).toFixed(2)}` : undefined,
    paymentMethod: row.payment_method || undefined,
  };
}
