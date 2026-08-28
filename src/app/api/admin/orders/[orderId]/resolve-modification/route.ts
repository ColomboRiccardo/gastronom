import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface ProposalItem {
  product_id: number | null;
  product_name: string;
  qty: number;
  unit_price: number;
}

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  return user;
}

function parseOrderId(raw: string) {
  const numericId = Number.parseInt(raw.replace(/^ORD-/, ""), 10);
  if (!Number.isFinite(numericId)) return null;
  return numericId;
}

/**
 * Resolves a pending modification. Accepting swaps the order's items and total
 * in the same operation, so the two can never drift apart; declining leaves the
 * order exactly as the customer paid for it.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId: rawOrderId } = await context.params;
  const orderId = parseOrderId(rawOrderId);
  if (!orderId) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  let body: { action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = body.action;
  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ error: "Action must be accept or decline" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return NextResponse.json({ error: message }, { status: 500 });
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
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.modification_state !== "pending") {
    return NextResponse.json({ error: "This order has no pending proposal" }, { status: 409 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, orderId, action, status: nextStatus });
  }

  const proposal = order.modification_proposal as ProposalItem[] | null;
  if (!Array.isArray(proposal) || proposal.length === 0) {
    return NextResponse.json({ error: "Proposal is empty" }, { status: 409 });
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
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
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
    // Put the original lines back so the order is never left without items.
    await supabase.from("order_items").insert(
      previousItems.map((item) => ({ ...item, order_id: orderId })),
    );
    console.error("Failed to apply proposed items:", insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
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
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId, action, status: nextStatus, total: newTotal });
}
