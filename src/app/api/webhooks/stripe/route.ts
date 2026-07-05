import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/orders/fulfill-checkout";
import type Stripe from "stripe";

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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const result = await fulfillCheckoutSession(session.id);

    if (!result.ok) {
      console.error("Webhook fulfill failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
