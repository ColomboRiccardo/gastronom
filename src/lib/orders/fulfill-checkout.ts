import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export type FulfillCheckoutResult =
  | { ok: true; orderId: number; alreadyFulfilled?: boolean }
  | { ok: false; error: string };

function resolvePaymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }
  if (session.payment_intent && typeof session.payment_intent === "object") {
    return session.payment_intent.id;
  }
  return null;
}

function resolveShippingAddress(session: Stripe.Checkout.Session): string | null {
  const withShipping = session as Stripe.Checkout.Session & {
    shipping_details?: { address?: Stripe.Address | null } | null;
  };
  const address =
    withShipping.shipping_details?.address ?? session.customer_details?.address;

  if (!address) return null;

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

async function listSessionLineItems(sessionId: string) {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
  });
  return lineItems.data;
}

async function findExistingOrder(
  supabase: ReturnType<typeof createAdminClient>,
  sessionId: string,
  paymentIntentId: string | null,
) {
  const { data: bySession, error: sessionError } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (sessionError) {
    return { error: sessionError.message as string };
  }
  if (bySession) {
    return { orderId: bySession.id as number };
  }

  const legacyKeys = [sessionId, paymentIntentId].filter(
    (value): value is string => Boolean(value),
  );

  for (const key of legacyKeys) {
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_intent_id", key)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }
    if (data) {
      return { orderId: data.id as number };
    }
  }

  return { orderId: null };
}

/** Create order + line items for a paid Checkout session (idempotent). */
export async function fulfillCheckoutSession(
  sessionId: string,
): Promise<FulfillCheckoutResult> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  if (session.payment_status !== "paid") {
    return { ok: false, error: `Payment status is ${session.payment_status}` };
  }

  const userId = session.metadata?.user_id;
  if (!userId) {
    return { ok: false, error: "Missing user_id in session metadata" };
  }

  const paymentIntentId = resolvePaymentIntentId(session);

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    console.error("Fulfill checkout: admin client error:", message);
    return { ok: false, error: message };
  }

  const existing = await findExistingOrder(supabase, sessionId, paymentIntentId);
  if ("error" in existing && existing.error) {
    console.error("Fulfill checkout: idempotency check failed:", existing.error);
    return { ok: false, error: existing.error };
  }
  if (existing.orderId) {
    return { ok: true, orderId: existing.orderId, alreadyFulfilled: true };
  }

  const lineItems = await listSessionLineItems(sessionId);
  if (lineItems.length === 0) {
    return { ok: false, error: "Checkout session has no line items" };
  }

  const shippingAddress = resolveShippingAddress(session);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Received",
      total: (session.amount_total || 0) / 100,
      shipping_address: shippingAddress,
      stripe_checkout_session_id: sessionId,
      payment_intent_id: paymentIntentId,
      payment_method: session.payment_method_types?.[0] || "card",
    })
    .select("id")
    .single();

  if (orderError) {
    if (orderError.code === "23505") {
      const raced = await findExistingOrder(supabase, sessionId, paymentIntentId);
      if (raced.orderId) {
        return { ok: true, orderId: raced.orderId, alreadyFulfilled: true };
      }
    }

    console.error("Fulfill checkout: failed to create order:", orderError.message);
    return { ok: false, error: orderError.message };
  }

  if (!order) {
    return { ok: false, error: "Failed to create order" };
  }

  const orderItems = lineItems.map((item) => ({
    order_id: order.id,
    product_name: item.description || "Unknown product",
    qty: item.quantity || 1,
    unit_price: (item.price?.unit_amount || 0) / 100,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("Fulfill checkout: failed to create order items:", itemsError.message);
    return { ok: false, error: itemsError.message };
  }

  await supabase.from("cart_items").delete().eq("user_id", userId);

  console.log(`Order ${order.id} fulfilled for user ${userId} (session ${sessionId})`);
  return { ok: true, orderId: order.id };
}
