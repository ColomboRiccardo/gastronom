import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseCheckoutItems, validateCheckoutItems } from "@/lib/checkout-validation";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { items } = await request.json();
    const parsedItems = parseCheckoutItems(items);
    if (!parsedItems) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const admin = createAdminClient();
    const validation = await validateCheckoutItems(admin, parsedItems);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const lineItems = validation.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          ...(item.imageUrl && item.imageUrl.startsWith("http")
            ? { images: [item.imageUrl] }
            : {}),
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const { data: snapshot, error: snapshotError } = await admin
      .from("checkout_snapshots")
      .insert({
        user_id: user.id,
        items: validation.items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          qty: item.quantity,
          unit_price: item.unitPrice,
        })),
      })
      .select("id")
      .single();

    if (snapshotError || !snapshot) {
      console.error("Checkout snapshot insert failed:", snapshotError?.message);
      return NextResponse.json({ error: "Failed to prepare checkout" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        checkout_snapshot_id: snapshot.id,
      },
      shipping_address_collection: {
        allowed_countries: ["IT", "DE", "FR", "ES", "AT", "CH", "NL", "BE", "PT", "GR", "PL", "CZ", "RO", "HU", "SE", "DK", "FI", "IE", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "LU", "MT", "CY"],
      },
      shipping_options: [{ shipping_rate: "shr_1TJGbUIRoE2UiWe4IyYqrbMg" }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    const { error: linkSnapshotError } = await admin
      .from("checkout_snapshots")
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq("id", snapshot.id);

    if (linkSnapshotError) {
      console.error("Checkout snapshot link failed:", linkSnapshotError.message);
      return NextResponse.json({ error: "Failed to prepare checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
