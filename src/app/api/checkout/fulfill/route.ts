import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { fulfillCheckoutSession } from "@/lib/orders/fulfill-checkout";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await fulfillCheckoutSession(sessionId);
    if (!result.ok) {
      console.error("Checkout fulfill failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    revalidatePath("/account");

    return NextResponse.json({
      ok: true,
      orderId: result.orderId,
      alreadyFulfilled: result.alreadyFulfilled ?? false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfill failed";
    console.error("Checkout fulfill error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
