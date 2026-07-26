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
import type { OrderEmailItem, OrderStatusEmailType } from "./types";

interface SendOrderStatusUpdateEmailParams {
  to: string;
  customerName?: string;
  orderId: number;
  status: OrderStatusEmailType;
  items: OrderEmailItem[];
  total: number;
}

const STATUS_COPY: Record<
  OrderStatusEmailType,
  { subject: string; heading: string; body: string }
> = {
  Processing: {
    subject: "is being prepared",
    heading: "Your order is being prepared",
    body: "Good news — we have started preparing your order.",
  },
  Shipped: {
    subject: "has been shipped",
    heading: "Your order is on its way",
    body: "Your order has been shipped and should arrive soon.",
  },
  Delivered: {
    subject: "has been delivered",
    heading: "Your order has been delivered",
    body: "Your order has been delivered. We hope you enjoy it!",
  },
  Cancelled: {
    subject: "has been cancelled",
    heading: "Your order has been cancelled",
    body: "Your order has been cancelled. If you have questions about refunds, please contact us.",
  },
};

export async function sendOrderStatusUpdateEmail(params: SendOrderStatusUpdateEmailParams) {
  const { to, customerName, orderId, status, items, total } = params;
  const copy = STATUS_COPY[status];
  const accountUrl = getAccountUrl();

  const html = wrapEmailLayout(`
    <h2 style="margin:0 0 16px;">${copy.heading} — #${orderId}</h2>
    <p>${greeting(customerName)}</p>
    <p>${copy.body}</p>
    ${renderItemsTable(items, "Order summary")}
    <p style="margin:16px 0;font-size:16px;"><strong>Order total: ${formatMoney(total)}</strong></p>
    ${renderAccountButton(accountUrl)}
  `);

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Order #${orderId} ${copy.subject}`,
    html,
  });

  if (error) {
    console.error(`Order status email (${status}) failed for order ${orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

export function shouldSendStatusEmail(status: string): status is OrderStatusEmailType {
  return status === "Processing" || status === "Shipped" || status === "Delivered" || status === "Cancelled";
}
