import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Use the service role key for webhook handler (bypasses RLS)
// For now we use the anon key since we don't have a service role key configured
// TODO: Add SUPABASE_SERVICE_ROLE_KEY to .env.local for production
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminSupabase();
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error("Webhook: No user_id in session metadata");
    return;
  }

  // Get line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  // Build shipping address string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shipping = (session as any).shipping_details?.address;
  const shippingAddress = shipping
    ? [shipping.line1, shipping.line2, shipping.city, shipping.state, shipping.postal_code, shipping.country]
      .filter(Boolean)
      .join(", ")
    : null;

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Received",
      total: (session.amount_total || 0) / 100,
      shipping_address: shippingAddress,
      payment_intent_id: session.payment_intent as string,
      payment_method: session.payment_method_types?.[0] || "card",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Webhook: Failed to create order:", orderError);
    return;
  }

  // Create order items
  const orderItems = lineItems.data.map((item) => ({
    order_id: order.id,
    product_name: item.description || "Unknown product",
    qty: item.quantity || 1,
    unit_price: (item.price?.unit_amount || 0) / 100,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Webhook: Failed to create order items:", itemsError);
  }

  // Clear the user's cart after successful purchase
  await supabase.from("cart_items").delete().eq("user_id", userId);

  console.log(`Order ${order.id} created for user ${userId}`);
}
