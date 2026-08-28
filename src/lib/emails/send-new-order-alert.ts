import { getResend } from "@/lib/resend";
import { formatDateTime } from "@/lib/i18n/format";
import { translateShippingMethod } from "@/lib/i18n/status";

import {
  FROM_EMAIL,
  FROM_NAME,
  SHOP_LANGUAGE,
  emailTranslator,
  formatMoney,
  getSiteUrl,
  renderAccountButton,
  renderItemsTable,
} from "./shared";
import type { OrderEmailItem } from "./types";

interface SendNewOrderAlertEmailParams {
  orderId: number;
  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items: OrderEmailItem[];
  total: number;
  shippingAddress?: string | null;
  shippingMethod?: string | null;
  shippingCost?: number | null;
  paymentMethod?: string | null;
  placedAt?: string | Date;
}

export function getOrderAlertRecipient() {
  return process.env.ORDER_ALERT_EMAIL ?? "gastronom.sanremo@gmail.com";
}

/**
 * Internal recap for the shop. Kept separate from the customer confirmation so
 * a failure here can never mark the customer's email as sent, and so staff get
 * the operational details (phone, address) rather than customer-facing copy.
 */
export function buildNewOrderAlertEmail(params: SendNewOrderAlertEmailParams) {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    items,
    total,
    shippingAddress,
    shippingMethod,
    shippingCost,
    paymentMethod,
    placedAt,
  } = params;

  const t = emailTranslator(SHOP_LANGUAGE);

  const rows: string[] = [];
  const addRow = (label: string, value?: string | null) => {
    if (value) rows.push(`<p style="margin:4px 0;"><strong>${label}:</strong> ${value}</p>`);
  };

  addRow(t("orders.customer"), customerName);
  addRow(t("profile.email"), customerEmail);
  addRow(t("profile.phone"), customerPhone);
  addRow(
    t("orders.shipping"),
    shippingMethod
      ? `${translateShippingMethod(shippingMethod, t)}${
          shippingCost == null
            ? ""
            : shippingCost === 0
              ? ` (${t("email.shipping_free")})`
              : ` - ${formatMoney(shippingCost)}`
        }`
      : null,
  );
  addRow(t("orders.shipping_address"), shippingAddress);
  addRow(t("orders.payment"), paymentMethod);
  addRow(t("email.alert_placed_at"), placedAt ? formatDateTime(placedAt) : null);

  const html = `
    <div style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;">
      <h2 style="margin:0 0 16px;">${t("email.alert_heading")} - #${orderId}</h2>
      ${rows.join("")}
      ${renderItemsTable(items, t)}
      <p style="margin:16px 0;font-size:16px;"><strong>${t("email.order_total", { total: formatMoney(total) })}</strong></p>
      ${renderAccountButton(`${getSiteUrl()}/account`, t("email.alert_open_admin"))}
    </div>`;

  return {
    subject: t("email.alert_subject", { id: orderId, total: formatMoney(total) }),
    html,
  };
}

export async function sendNewOrderAlertEmail(params: SendNewOrderAlertEmailParams) {
  const { subject, html } = buildNewOrderAlertEmail(params);

  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: getOrderAlertRecipient(),
    ...(params.customerEmail ? { replyTo: params.customerEmail } : {}),
    subject,
    html,
  });

  if (error) {
    console.error(`New order alert email failed for order ${params.orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}
