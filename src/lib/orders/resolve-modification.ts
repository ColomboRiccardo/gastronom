import { loadOrderNotificationContext } from "@/lib/emails/order-recipient";
import { sendOrderModificationResolvedEmail } from "@/lib/emails/send-order-modification-resolved";
import { createAdminClient } from "@/lib/supabase/admin";

export type ModificationAction = "accept" | "decline";

interface ProposalItem {
  product_id: number | null;
  product_name: string;
  qty: number;
  unit_price: number;
}

export type ResolveModificationResult =
  | { ok: true; orderId: number; action: ModificationAction; status: string; total?: number }
  | { ok: false; error: string; status?: number };

/**
 * Accepting rewrites order_items and total together so they cannot drift.
 * Declining leaves the paid order untouched. Either way the pending flag clears.
 */
export async function resolveOrderModification(
  orderId: number,
  action: ModificationAction,
): Promise<ResolveModificationResult> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return { ok: false, error: message, status: 500 };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      modification_proposal,
      modification_state,
      order_items ( product_id, product_name, qty, unit_price )
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Order not found", status: 404 };
  }

  if (order.modification_state !== "pending") {
    return { ok: false, error: "This order has no pending proposal", status: 409 };
  }

  const resolvedAt = new Date().toISOString();
  const nextStatus = order.status === "Modification" ? "Processing" : order.status;

  if (action === "decline") {
    const { error } = await supabase
      .from("orders")
      .update({
        status: nextStatus,
        modification_state: "declined",
        modification_resolved_at: resolvedAt,
      })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to decline modification:", error.message);
      return { ok: false, error: error.message, status: 500 };
    }

    await notifyCustomerOfResolution(orderId, "decline");
    return { ok: true, orderId, action, status: nextStatus };
  }

  const proposal = order.modification_proposal as ProposalItem[] | null;
  if (!Array.isArray(proposal) || proposal.length === 0) {
    return { ok: false, error: "Proposal is empty", status: 409 };
  }

  const previousItems = (order.order_items || []).map(
    (item: { product_id: number | null; product_name: string; qty: number; unit_price: number }) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      qty: item.qty,
      unit_price: Number(item.unit_price),
    }),
  );

  const newTotal = proposal.reduce((sum, item) => sum + item.qty * item.unit_price, 0);

  const { error: deleteError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (deleteError) {
    console.error("Failed to clear order items:", deleteError.message);
    return { ok: false, error: deleteError.message, status: 500 };
  }

  const { error: insertError } = await supabase.from("order_items").insert(
    proposal.map((item) => ({
      order_id: orderId,
      product_id: item.product_id ?? null,
      product_name: item.product_name,
      qty: item.qty,
      unit_price: item.unit_price,
    })),
  );

  if (insertError) {
    await supabase.from("order_items").insert(
      previousItems.map((item) => ({ ...item, order_id: orderId })),
    );
    console.error("Failed to apply proposed items:", insertError.message);
    return { ok: false, error: insertError.message, status: 500 };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: nextStatus,
      total: newTotal,
      modification_state: "accepted",
      modification_resolved_at: resolvedAt,
      modification_original_items: previousItems,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Failed to finalise accepted modification:", updateError.message);
    return { ok: false, error: updateError.message, status: 500 };
  }

  await notifyCustomerOfResolution(orderId, "accept");
  return { ok: true, orderId, action, status: nextStatus, total: newTotal };
}

async function notifyCustomerOfResolution(orderId: number, action: ModificationAction) {
  const ctx = await loadOrderNotificationContext(orderId);
  if (!ctx) return;

  const result = await sendOrderModificationResolvedEmail({
    to: ctx.customerEmail,
    language: ctx.language,
    customerName: ctx.customerName,
    orderId: ctx.orderId,
    action,
    items: ctx.items,
    total: ctx.total,
  });

  if (!result.ok) {
    console.warn(
      `Modification ${action} saved for order ${orderId}, but customer email failed`,
    );
  }
}
