import { getResend } from "@/lib/resend";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/translate";

import {
  FROM_EMAIL,
  FROM_NAME,
  REPLY_TO,
  emailTranslator,
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
  language?: Language;
  customerName?: string;
  orderId: number;
  status: OrderStatusEmailType;
  items: OrderEmailItem[];
  total: number;
}

const STATUS_KEYS: Record<OrderStatusEmailType, string> = {
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

export function buildOrderStatusUpdateEmail(params: SendOrderStatusUpdateEmailParams) {
  const {
    language = DEFAULT_LANGUAGE,
    customerName,
    orderId,
    status,
    items,
    total,
  } = params;

  const t = emailTranslator(language);
  const slug = STATUS_KEYS[status];
  const accountUrl = getAccountUrl();

  const subject = t(`email.status_${slug}_subject`, { id: orderId });
  const heading = t(`email.status_${slug}_heading`);
  const body = t(`email.status_${slug}_body`);

  const html = wrapEmailLayout(
    `
    <h2 style="margin:0 0 16px;">${heading} - #${orderId}</h2>
    <p>${greeting(t, customerName)}</p>
    <p>${body}</p>
    ${renderItemsTable(items, t, t("email.order_summary"))}
    <p style="margin:16px 0;font-size:16px;"><strong>${t("email.order_total", { total: formatMoney(total) })}</strong></p>
    ${renderAccountButton(accountUrl, t("email.view_order"))}
  `,
    t,
  );

  return { subject, html };
}

export async function sendOrderStatusUpdateEmail(params: SendOrderStatusUpdateEmailParams) {
  const { subject, html } = buildOrderStatusUpdateEmail(params);

  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject,
    html,
  });

  if (error) {
    console.error(
      `Order status email (${params.status}) failed for order ${params.orderId}:`,
      error,
    );
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

export function shouldSendStatusEmail(status: string): status is OrderStatusEmailType {
  return status === "Processing" || status === "Shipped" || status === "Delivered" || status === "Cancelled";
}
