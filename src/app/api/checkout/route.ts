import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lineItems = items.map((item: { name: string; priceNum: number; quantity: number; image?: string }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.priceNum * 100),
      },
      quantity: item.quantity,
    }));

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
      },
      shipping_address_collection: {
        allowed_countries: ["IT", "DE", "FR", "ES", "AT", "CH", "NL", "BE", "PT", "GR", "PL", "CZ", "RO", "HU", "SE", "DK", "FI", "IE", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "LU", "MT", "CY"],
      },
      shipping_options: [{ shipping_rate: "shr_1TJGbUIRoE2UiWe4IyYqrbMg" }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
