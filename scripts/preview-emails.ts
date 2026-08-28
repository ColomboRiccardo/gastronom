/**
 * Renders every order email in every language to out/email-preview/, so the
 * templates can be eyeballed without sending anything.
 *
 *   npx tsx scripts/preview-emails.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildNewOrderAlertEmail } from "../src/lib/emails/send-new-order-alert";
import { buildOrderConfirmationEmail } from "../src/lib/emails/send-order-confirmation";
import { buildOrderModificationEmail } from "../src/lib/emails/send-order-modification";
import { buildOrderStatusUpdateEmail } from "../src/lib/emails/send-order-status-update";
import { SUPPORTED_LANGUAGES } from "../src/lib/i18n/translate";

const items = [
  { product_name: "Beluga Vodka 700ml", qty: 1, unit_price: 55 },
  { product_name: "Red Caviar 100g", qty: 2, unit_price: 42 },
];
const total = 148.9;

const outDir = join(process.cwd(), "out", "email-preview");
mkdirSync(outDir, { recursive: true });

for (const language of SUPPORTED_LANGUAGES) {
  const base = { to: "customer@example.com", language, customerName: "Maria", orderId: 1042, items, total };

  const templates = {
    confirmation: buildOrderConfirmationEmail({
      ...base,
      shippingAddress: "Via Roma 42, 17025 Loano (SV)",
      shippingMethod: "courier_north",
      shippingCost: 9.9,
      paymentMethod: "card",
    }),
    shipped: buildOrderStatusUpdateEmail({ ...base, status: "Shipped" }),
    cancelled: buildOrderStatusUpdateEmail({ ...base, status: "Cancelled" }),
    modification: buildOrderModificationEmail({
      ...base,
      originalItems: items,
      proposedItems: [{ product_name: "Red Caviar 100g", qty: 1, unit_price: 42 }],
      message: "Beluga vodka is out of stock this week.",
    }),
    alert: buildNewOrderAlertEmail({
      orderId: base.orderId,
      customerName: base.customerName,
      customerEmail: base.to,
      customerPhone: "+39 348 655 6241",
      items,
      total,
      shippingAddress: "Via Roma 42, 17025 Loano (SV)",
      shippingMethod: "courier_north",
      shippingCost: 9.9,
      paymentMethod: "card",
      placedAt: new Date("2026-08-28T10:15:00"),
    }),
  };

  for (const [name, rendered] of Object.entries(templates)) {
    writeFileSync(
      join(outDir, `${language}-${name}.html`),
      `<p style="font-family:sans-serif;color:#666;">Subject: <strong>${rendered.subject}</strong></p><hr>${rendered.html}`,
    );
    console.log(`${language.padEnd(3)} ${name.padEnd(13)} ${rendered.subject}`);
  }
}

console.log(`\nWrote previews to ${outDir}`);
