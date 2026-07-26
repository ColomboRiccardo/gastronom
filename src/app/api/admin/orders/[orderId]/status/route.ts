import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { loadOrderNotificationContext } from "@/lib/emails/order-recipient";
import {
  sendOrderStatusUpdateEmail,
  shouldSendStatusEmail,
} from "@/lib/emails/send-order-status-update";
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

export async function PATCH(
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

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status } = body;
  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const allowed = ["Received", "Processing", "Modification", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (updateError) {
    console.error("Failed to update order status:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  let emailSent = false;
  if (shouldSendStatusEmail(status)) {
    const ctx = await loadOrderNotificationContext(orderId);
    if (ctx) {
      const emailResult = await sendOrderStatusUpdateEmail({
        to: ctx.customerEmail,
        customerName: ctx.customerName,
        orderId: ctx.orderId,
        status,
        items: ctx.items,
        total: ctx.total,
      });
      emailSent = emailResult.ok;
      if (!emailResult.ok) {
        console.warn(`Status updated to ${status} but email failed for order ${orderId}`);
      }
    }
  }

  return NextResponse.json({ ok: true, orderId, status, emailSent });
}
