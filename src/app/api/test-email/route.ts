import { NextResponse } from "next/server";

import { buildNewOrderAlertEmail } from "@/lib/emails/send-new-order-alert";
import { buildOrderConfirmationEmail } from "@/lib/emails/send-order-confirmation";
import { buildOrderModificationEmail } from "@/lib/emails/send-order-modification";
import { buildOrderStatusUpdateEmail } from "@/lib/emails/send-order-status-update";
import { toLanguage } from "@/lib/i18n/translate";
import type { OrderStatusEmailType } from "@/lib/emails/types";

/**
 * Renders an email template without sending it, so the four languages can be
 * checked in a browser. Disabled outside development.
 */

const SAMPLE_ITEMS = [
  { product_name: "Beluga Vodka 700ml", qty: 1, unit_price: 55 },
  { product_name: "Red Caviar 100g", qty: 2, unit_price: 42 },
];

const SAMPLE_TOTAL = 139 + 9.9;

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const language = toLanguage(url.searchParams.get("lang") ?? "it");
  const template = url.searchParams.get("template") ?? "confirmation";

  const base = {
    to: "customer@example.com",
    language,
    customerName: "Maria",
    orderId: 1042,
    items: SAMPLE_ITEMS,
    total: SAMPLE_TOTAL,
  };

  let rendered: { subject: string; html: string };

  switch (template) {
    case "status":
      rendered = buildOrderStatusUpdateEmail({
        ...base,
        status: (url.searchParams.get("status") ?? "Shipped") as OrderStatusEmailType,
      });
      break;
    case "modification":
      rendered = buildOrderModificationEmail({
        ...base,
        originalItems: SAMPLE_ITEMS,
        proposedItems: [{ product_name: "Red Caviar 100g", qty: 1, unit_price: 42 }],
        message: "Beluga vodka is out of stock this week.",
      });
      break;
    case "alert":
      rendered = buildNewOrderAlertEmail({
        orderId: base.orderId,
        customerName: base.customerName,
        customerEmail: base.to,
        customerPhone: "+39 348 655 6241",
        items: SAMPLE_ITEMS,
        total: SAMPLE_TOTAL,
        shippingAddress: "Via Roma 42, 17025 Loano (SV)",
        shippingMethod: "courier_north",
        shippingCost: 9.9,
        paymentMethod: "card",
        placedAt: new Date(),
      });
      break;
    default:
      rendered = buildOrderConfirmationEmail({
        ...base,
        shippingAddress: "Via Roma 42, 17025 Loano (SV)",
        shippingMethod: "courier_north",
        shippingCost: 9.9,
        paymentMethod: "card",
      });
  }

  return new NextResponse(
    `<p style="font-family:sans-serif;color:#666;">Subject: <strong>${rendered.subject}</strong></p><hr>${rendered.html}`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
