import { resend } from "@/lib/resend";

import {
  FROM_EMAIL,
  FROM_NAME,
  formatMoney,
  getAccountUrl,
  greeting,
  lineTotal,
  renderAccountButton,
  renderItemsTable,
  wrapEmailLayout,
} from "./shared";
import type { OrderEmailItem } from "./types";

interface SendOrderModificationEmailParams {
  to: string;
  customerName?: string;
  orderId: number;
  originalItems: OrderEmailItem[];
  proposedItems: OrderEmailItem[];
  message?: string;
}

export async function sendOrderModificationEmail(params: SendOrderModificationEmailParams) {
  const { to, customerName, orderId, originalItems, proposedItems, message } = params;
  const accountUrl = getAccountUrl();

  const noteBlock = message
    ? `<p style="margin:16px 0;padding:12px 16px;background:#fff8e6;border-left:4px solid #f5a623;border-radius:4px;">${message}</p>`
    : "";

  const html = wrapEmailLayout(`
    <h2 style="margin:0 0 16px;">Order update — #${orderId}</h2>
    <p>${greeting(customerName)}</p>
    <p>Some items in your order are not available as requested. We would like to propose the following changes:</p>
    ${noteBlock}
    ${renderItemsTable(originalItems, "Your original order")}
    ${renderItemsTable(proposedItems, "Proposed changes")}
    <p style="margin:24px 0 8px;">Please review the changes in your account and let us know if you accept them.</p>
    ${renderAccountButton(accountUrl)}
    <p style="color:#666;font-size:13px;">If you have questions, reply to this email or contact us on WhatsApp.</p>
  `);

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Order #${orderId} — proposed changes`,
    html,
  });

  if (error) {
    console.error(`Order modification email failed for order ${orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

export function buildWhatsAppModificationMessage(params: {
  orderId: number;
  customerName?: string;
  proposedItems: OrderEmailItem[];
  message?: string;
}) {
  const { orderId, customerName, proposedItems, message } = params;
  const lines = proposedItems.map(
    (item) => `• ${item.qty}× ${item.product_name} (${formatMoney(lineTotal(item))})`,
  );
  const total = proposedItems.reduce((sum, item) => sum + lineTotal(item), 0);

  return [
    greeting(customerName),
    "",
    `Regarding your Gastronom order #${orderId}: some items are unavailable.`,
    message ? `\n${message}\n` : "",
    "Proposed order:",
    ...lines,
    "",
    `New total: ${formatMoney(total)}`,
    "",
    "Please confirm if this works for you.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildWhatsAppUrl(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export type { OrderEmailItem as ModificationEmailItem };
