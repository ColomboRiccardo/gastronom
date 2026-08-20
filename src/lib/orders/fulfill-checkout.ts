import type Stripe from "stripe";

import { sendOrderConfirmationEmail } from "@/lib/emails/send-order-confirmation";
import { METHOD_LABELS, SHOP, type ResolvedShippingMethod } from "@/lib/shipping/config";
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

function resolveCustomerEmail(session: Stripe.Checkout.Session): string | null {
  return session.customer_details?.email ?? session.customer_email ?? null;
}

function resolveStripeShippingCost(session: Stripe.Checkout.Session): number | null {
  const total = session.total_details?.amount_shipping;
  if (typeof total === "number") return total / 100;
  return null;
}

async function listSessionLineItems(sessionId: string) {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
  });
  return lineItems.data;
}

interface SnapshotItem {
  product_id: number;
  product_name: string;
  qty: number;
  unit_price: number;
}

interface SnapshotShipping {
  method: string | null;
  cost: number | null;
  city: string | null;
  postalCode: string | null;
}

async function getSnapshotForSession(
  supabase: ReturnType<typeof createAdminClient>,
  sessionId: string,
) {
  const { data, error } = await supabase
    .from("checkout_snapshots")
    .select("id, items, shipping_method, shipping_cost, shipping_city, shipping_postal_code")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error) {
    return {
      error: error.message,
      items: null as SnapshotItem[] | null,
      snapshotId: null as string | null,
      shipping: null as SnapshotShipping | null,
    };
  }

  if (!data || !Array.isArray(data.items)) {
    return {
      error: null,
      items: null as SnapshotItem[] | null,
      snapshotId: null as string | null,
      shipping: null as SnapshotShipping | null,
    };
  }

  const items: SnapshotItem[] = [];
  for (const item of data.items as Array<Record<string, unknown>>) {
    const productId = Number(item.product_id);
    const qty = Number(item.qty);
    const unitPrice = Number(item.unit_price);
    const productName = typeof item.product_name === "string" ? item.product_name : "Unknown product";

    if (!Number.isFinite(productId) || !Number.isFinite(qty) || !Number.isFinite(unitPrice)) {
      continue;
    }

    items.push({
      product_id: productId,
      product_name: productName,
      qty,
      unit_price: unitPrice,
    });
  }

  const shipping: SnapshotShipping = {
    method: (data.shipping_method as string | null) ?? null,
    cost: data.shipping_cost != null ? Number(data.shipping_cost) : null,
    city: (data.shipping_city as string | null) ?? null,
    postalCode: (data.shipping_postal_code as string | null) ?? null,
  };

  return { error: null, items, snapshotId: data.id as string, shipping };
}

function resolveOrderShipping(
  session: Stripe.Checkout.Session,
  snapshotShipping: SnapshotShipping | null,
) {
  const method = snapshotShipping?.method
    ?? (session.metadata?.shipping_method as string | undefined)
    ?? null;

  const costFromSnapshot =
    snapshotShipping?.cost != null && Number.isFinite(snapshotShipping.cost)
      ? snapshotShipping.cost
      : null;
  const cost = costFromSnapshot ?? resolveStripeShippingCost(session) ?? 0;

  const stripeAddress = resolveShippingAddress(session);
  const isPickup = method === "pickup";

  let shippingAddress = stripeAddress;
  if (isPickup) {
    shippingAddress = `Pickup — ${SHOP.name}, ${SHOP.address}`;
  } else if (!shippingAddress && snapshotShipping?.city) {
    shippingAddress = snapshotShipping.city;
  }

  const methodLabel =
    method && method in METHOD_LABELS
      ? METHOD_LABELS[method as ResolvedShippingMethod]
      : method;

  return {
    shippingMethod: methodLabel || method,
    shippingCost: cost,
    shippingAddress,
  };
}

async function findExistingOrder(
  supabase: ReturnType<typeof createAdminClient>,
  sessionId: string,
  paymentIntentId: string | null,
) {
  const { data: bySession, error: sessionError } = await supabase
    .from("orders")
    .select("id, confirmation_email_sent_at")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (sessionError) {
    return { error: sessionError.message as string };
  }
  if (bySession) {
    return {
      orderId: bySession.id as number,
      confirmationEmailSentAt: bySession.confirmation_email_sent_at as string | null,
    };
  }

  const legacyKeys = [sessionId, paymentIntentId].filter(
    (value): value is string => Boolean(value),
  );

  for (const key of legacyKeys) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, confirmation_email_sent_at")
      .eq("payment_intent_id", key)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }
    if (data) {
      return {
        orderId: data.id as number,
        confirmationEmailSentAt: data.confirmation_email_sent_at as string | null,
      };
    }
  }

  return { orderId: null, confirmationEmailSentAt: null };
}

async function sendConfirmationIfNeeded(
  supabase: ReturnType<typeof createAdminClient>,
  params: {
    orderId: number;
    confirmationEmailSentAt: string | null;
    to: string | null;
    customerName?: string;
    items: SnapshotItem[];
    total: number;
    shippingAddress: string | null;
    shippingMethod?: string | null;
    shippingCost?: number | null;
    paymentMethod: string;
  },
) {
  if (params.confirmationEmailSentAt || !params.to || params.items.length === 0) {
    return;
  }

  const emailResult = await sendOrderConfirmationEmail({
    to: params.to,
    customerName: params.customerName,
    orderId: params.orderId,
    items: params.items.map((item) => ({
      product_name: item.product_name,
      qty: item.qty,
      unit_price: item.unit_price,
    })),
    total: params.total,
    shippingAddress: params.shippingAddress,
    shippingMethod: params.shippingMethod,
    shippingCost: params.shippingCost,
    paymentMethod: params.paymentMethod,
  });

  if (emailResult.ok) {
    await supabase
      .from("orders")
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq("id", params.orderId);
  }
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
  const customerEmail = resolveCustomerEmail(session);

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    console.error("Fulfill checkout: admin client error:", message);
    return { ok: false, error: message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", userId)
    .maybeSingle();

  const recipientEmail = profile?.email ?? customerEmail;
  const customerName = profile?.name ?? undefined;

  const existing = await findExistingOrder(supabase, sessionId, paymentIntentId);
  if ("error" in existing && existing.error) {
    console.error("Fulfill checkout: idempotency check failed:", existing.error);
    return { ok: false, error: existing.error };
  }
  if (existing.orderId) {
    const snapshotResult = await getSnapshotForSession(supabase, sessionId);
    const items = snapshotResult.items ?? [];
    const shipping = resolveOrderShipping(session, snapshotResult.shipping);

    await sendConfirmationIfNeeded(supabase, {
      orderId: existing.orderId,
      confirmationEmailSentAt: existing.confirmationEmailSentAt ?? null,
      to: recipientEmail,
      customerName,
      items,
      total: (session.amount_total || 0) / 100,
      shippingAddress: shipping.shippingAddress,
      shippingMethod: shipping.shippingMethod,
      shippingCost: shipping.shippingCost,
      paymentMethod: session.payment_method_types?.[0] || "card",
    });

    return { ok: true, orderId: existing.orderId, alreadyFulfilled: true };
  }

  const lineItems = await listSessionLineItems(sessionId);
  if (lineItems.length === 0) {
    return { ok: false, error: "Checkout session has no line items" };
  }

  const snapshotResult = await getSnapshotForSession(supabase, sessionId);
  if (snapshotResult.error) {
    console.error("Fulfill checkout: failed loading checkout snapshot:", snapshotResult.error);
    return { ok: false, error: snapshotResult.error };
  }

  const shipping = resolveOrderShipping(session, snapshotResult.shipping);
  const paymentMethod = session.payment_method_types?.[0] || "card";
  const orderTotal = (session.amount_total || 0) / 100;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Received",
      total: orderTotal,
      shipping_address: shipping.shippingAddress,
      shipping_method: shipping.shippingMethod,
      shipping_cost: shipping.shippingCost,
      stripe_checkout_session_id: sessionId,
      payment_intent_id: paymentIntentId,
      payment_method: paymentMethod,
    })
    .select("id")
    .single();

  if (orderError) {
    if (orderError.code === "23505") {
      const raced = await findExistingOrder(supabase, sessionId, paymentIntentId);
      if (raced.orderId) {
        const racedSnapshot = await getSnapshotForSession(supabase, sessionId);
        const racedShipping = resolveOrderShipping(session, racedSnapshot.shipping);
        await sendConfirmationIfNeeded(supabase, {
          orderId: raced.orderId,
          confirmationEmailSentAt: raced.confirmationEmailSentAt ?? null,
          to: recipientEmail,
          customerName,
          items: racedSnapshot.items ?? [],
          total: orderTotal,
          shippingAddress: racedShipping.shippingAddress,
          shippingMethod: racedShipping.shippingMethod,
          shippingCost: racedShipping.shippingCost,
          paymentMethod,
        });
        return { ok: true, orderId: raced.orderId, alreadyFulfilled: true };
      }
    }

    console.error("Fulfill checkout: failed to create order:", orderError.message);
    return { ok: false, error: orderError.message };
  }

  if (!order) {
    return { ok: false, error: "Failed to create order" };
  }

  const orderItems = snapshotResult.items?.length
    ? snapshotResult.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        qty: item.qty,
        unit_price: item.unit_price,
      }))
    : lineItems.map((item) => ({
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

  if (snapshotResult.snapshotId) {
    await supabase
      .from("checkout_snapshots")
      .update({ fulfilled_at: new Date().toISOString() })
      .eq("id", snapshotResult.snapshotId);
  }

  await supabase.from("cart_items").delete().eq("user_id", userId);

  const emailItems: SnapshotItem[] = snapshotResult.items?.length
    ? snapshotResult.items
    : orderItems.map((item) => ({
        product_id: 0,
        product_name: item.product_name,
        qty: item.qty,
        unit_price: item.unit_price,
      }));

  await sendConfirmationIfNeeded(supabase, {
    orderId: order.id,
    confirmationEmailSentAt: null,
    to: recipientEmail,
    customerName,
    items: emailItems,
    total: orderTotal,
    shippingAddress: shipping.shippingAddress,
    shippingMethod: shipping.shippingMethod,
    shippingCost: shipping.shippingCost,
    paymentMethod,
  });

  console.log(`Order ${order.id} fulfilled for user ${userId} (session ${sessionId})`);
  return { ok: true, orderId: order.id };
}
