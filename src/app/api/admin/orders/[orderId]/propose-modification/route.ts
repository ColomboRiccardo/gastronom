import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import {
  buildWhatsAppModificationMessage,
  buildWhatsAppUrl,
  sendOrderModificationEmail,
} from "@/lib/emails/send-order-modification";
import { type ProposeModificationPayload } from "@/lib/orders/types";
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

  let body: ProposeModificationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "At least one proposed item is required" }, { status: 400 });
  }

  for (const item of body.items) {
    if (!item.product_name || !Number.isFinite(item.qty) || item.qty < 1) {
      return NextResponse.json({ error: "Invalid item in proposal" }, { status: 400 });
    }
    if (!Number.isFinite(item.unit_price) || item.unit_price < 0) {
      return NextResponse.json({ error: "Invalid item price in proposal" }, { status: 400 });
    }
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
      user_id,
      order_items ( product_id, product_name, qty, unit_price ),
      profiles ( name, email, phone )
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
  const customerEmail = profile?.email;
  if (!customerEmail) {
    return NextResponse.json({ error: "Customer email not found" }, { status: 400 });
  }

  const originalItems = (order.order_items || []).map(
    (item: { product_name: string; qty: number; unit_price: number }) => ({
      product_name: item.product_name,
      qty: item.qty,
      unit_price: Number(item.unit_price),
    }),
  );

  const proposedTotal = body.items.reduce((sum, item) => sum + item.qty * item.unit_price, 0);
  const sentAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "Modification",
      total: proposedTotal,
      modification_proposal: body.items,
      modification_message: body.message?.trim() || null,
      modification_sent_at: sentAt,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Failed to save modification proposal:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const emailResult = await sendOrderModificationEmail({
    to: customerEmail,
    customerName: profile?.name ?? undefined,
    orderId,
    originalItems,
    proposedItems: body.items,
    message: body.message?.trim(),
    accountUrl: `${siteUrl}/account`,
  });

  if (!emailResult.ok) {
    return NextResponse.json(
      { error: "Proposal saved but email failed to send", emailError: emailResult.error },
      { status: 502 },
    );
  }

  const whatsappMessage = buildWhatsAppModificationMessage({
    orderId,
    customerName: profile?.name ?? undefined,
    proposedItems: body.items,
    message: body.message?.trim(),
  });
  const whatsappUrl = profile?.phone ? buildWhatsAppUrl(profile.phone, whatsappMessage) : null;

  return NextResponse.json({
    ok: true,
    orderId,
    status: "Modification",
    modificationSentAt: sentAt,
    whatsappUrl,
  });
}
