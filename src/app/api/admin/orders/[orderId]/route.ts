import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
 * Removing an order is a bookkeeping action and never notifies the customer.
 * Anything the customer should hear about goes through a status change.
 */
export async function DELETE(
  _request: Request,
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

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) {
    console.error("Failed to delete order:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId });
}
