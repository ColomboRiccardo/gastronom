import { resend } from "@/lib/resend";

import {
  FROM_EMAIL,
  FROM_NAME,
  formatMoney,
  getAccountUrl,
  greeting,
  renderAccountButton,
  renderItemsTable,
  wrapEmailLayout,
} from "./shared";
import type { OrderEmailItem } from "./types";

interface SendOrderConfirmationEmailParams {
  to: string;
  customerName?: string;
  orderId: number;
  items: OrderEmailItem[];
  total: number;
  shippingAddress?: string | null;
  shippingMethod?: string | null;
  shippingCost?: number | null;
  paymentMethod?: string | null;
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  const {
    to,
    customerName,
    orderId,
    items,
    total,
    shippingAddress,
    shippingMethod,
    shippingCost,
    paymentMethod,
  } = params;
  const accountUrl = getAccountUrl();

  const details: string[] = [];
  if (shippingMethod) {
    const costLabel =
      shippingCost == null
        ? ""
        : shippingCost === 0
          ? " (free)"
          : ` — ${formatMoney(shippingCost)}`;
    details.push(`<p><strong>Shipping:</strong> ${shippingMethod}${costLabel}</p>`);
  }
  if (shippingAddress) {
    details.push(`<p><strong>Shipping address:</strong><br>${shippingAddress}</p>`);
  }
  if (paymentMethod) {
    details.push(`<p><strong>Payment:</strong> ${paymentMethod}</p>`);
  }

  const html = wrapEmailLayout(`
    <h2 style="margin:0 0 16px;">Order confirmed — #${orderId}</h2>
    <p>${greeting(customerName)}</p>
    <p>Thank you for your order! We have received your payment and will start preparing it shortly.</p>
    ${renderItemsTable(items)}
    <p style="margin:16px 0;font-size:16px;"><strong>Order total: ${formatMoney(total)}</strong></p>
    ${details.join("")}
    ${renderAccountButton(accountUrl)}
  `);

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Order confirmed — #${orderId}`,
    html,
  });

  if (error) {
    console.error(`Order confirmation email failed for order ${orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}
