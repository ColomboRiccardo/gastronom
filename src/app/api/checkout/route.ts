import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  cartHasFrozenItems,
  parseCheckoutItems,
  validateCheckoutItems,
} from "@/lib/checkout-validation";
import {
  resolveShipping,
  type ShippingRequest,
} from "@/lib/shipping/resolve";
import type { ShippingMethodKind } from "@/lib/shipping/config";
import { toLanguage } from "@/lib/i18n/translate";

function parseShippingRequest(input: unknown): ShippingRequest | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as { method?: unknown; city?: unknown; postalCode?: unknown };
  const method = raw.method;
  if (method !== "pickup" && method !== "local" && method !== "courier") {
    return null;
  }
  return {
    method: method as ShippingMethodKind,
    city: typeof raw.city === "string" ? raw.city : undefined,
    postalCode: typeof raw.postalCode === "string" ? raw.postalCode : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const parsedItems = parseCheckoutItems(body.items);
    if (!parsedItems) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const shippingRequest = parseShippingRequest(body.shipping);
    if (!shippingRequest) {
      return NextResponse.json({ error: "Select a shipping method" }, { status: 400 });
    }

    const admin = createAdminClient();
    const validation = await validateCheckoutItems(admin, parsedItems);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const hasFrozenItems = cartHasFrozenItems(validation.items);
    const shippingResult = resolveShipping(shippingRequest, { hasFrozenItems });
    if (!shippingResult.ok) {
      return NextResponse.json({ error: shippingResult.error }, { status: 400 });
    }
    const shipping = shippingResult.shipping;
    const language = toLanguage(body.language);

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
          is_frozen: item.isFrozen,
        })),
        shipping_method: shipping.method,
        shipping_cost: shipping.cost,
        shipping_city: shipping.city ?? null,
        shipping_postal_code: shipping.postalCode ?? null,
        language,
      })
      .select("id")
      .single();

    if (snapshotError || !snapshot) {
      console.error("Checkout snapshot insert failed:", snapshotError?.message);
      return NextResponse.json({ error: "Failed to prepare checkout" }, { status: 500 });
    }

    const shippingOption = {
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: {
          amount: shipping.costCents,
          currency: "eur",
        },
        display_name: shipping.displayName,
      },
    };

    const sessionParams = {
      mode: "payment" as const,
      payment_method_types: ["card" as const],
      line_items: lineItems,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        checkout_snapshot_id: snapshot.id,
        shipping_method: shipping.method,
        language,
      },
      shipping_options: [shippingOption],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      phone_number_collection: { enabled: true },
      ...(shipping.kind !== "pickup"
        ? {
            shipping_address_collection: {
              allowed_countries: ["IT" as const],
            },
          }
        : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

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
