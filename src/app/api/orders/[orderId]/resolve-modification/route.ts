import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import {
  resolveOrderModification,
  type ModificationAction,
} from "@/lib/orders/resolve-modification";
import { createAdminClient } from "@/lib/supabase/admin";

function parseOrderId(raw: string) {
  const numericId = Number.parseInt(raw.replace(/^ORD-/, ""), 10);
  if (!Number.isFinite(numericId)) return null;
  return numericId;
}

/**
 * Customer entry point. Ownership is checked before the shared resolver runs,
 * so a logged-in shopper can only settle their own pending proposal.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const user = await getAuthenticatedUser();
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
    .select("id, user_id, modification_state")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.modification_state !== "pending") {
    return NextResponse.json({ error: "This order has no pending proposal" }, { status: 409 });
  }

  const result = await resolveOrderModification(orderId, action as ModificationAction);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 500 });
  }

  return NextResponse.json(result);
}
