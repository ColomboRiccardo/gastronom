import { getResend } from "@/lib/resend";
import { translateShippingMethod } from "@/lib/i18n/status";
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
import type { OrderEmailItem } from "./types";

interface SendOrderConfirmationEmailParams {
  to: string;
  language?: Language;
  customerName?: string;
  orderId: number;
  items: OrderEmailItem[];
  total: number;
  shippingAddress?: string | null;
  shippingMethod?: string | null;
  shippingCost?: number | null;
  paymentMethod?: string | null;
}

/** Rendering is kept separate from sending so templates can be previewed. */
export function buildOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  const {
    language = DEFAULT_LANGUAGE,
    customerName,
    orderId,
    items,
    total,
    shippingAddress,
    shippingMethod,
    shippingCost,
    paymentMethod,
  } = params;

  const t = emailTranslator(language);
  const accountUrl = getAccountUrl();

  const details: string[] = [];
  if (shippingMethod) {
    const costLabel =
      shippingCost == null
        ? ""
        : shippingCost === 0
          ? ` (${t("email.shipping_free")})`
          : ` - ${formatMoney(shippingCost)}`;
    const methodLabel = translateShippingMethod(shippingMethod, t);
    details.push(`<p><strong>${t("orders.shipping")}:</strong> ${methodLabel}${costLabel}</p>`);
  }
  if (shippingAddress) {
    details.push(`<p><strong>${t("orders.shipping_address")}:</strong><br>${shippingAddress}</p>`);
  }
  if (paymentMethod) {
    details.push(`<p><strong>${t("orders.payment")}:</strong> ${paymentMethod}</p>`);
  }

  const subject = t("email.confirm_subject", { id: orderId });

  const html = wrapEmailLayout(
    `
    <h2 style="margin:0 0 16px;">${subject}</h2>
    <p>${greeting(t, customerName)}</p>
    <p>${t("email.confirm_body")}</p>
    ${renderItemsTable(items, t)}
    <p style="margin:16px 0;font-size:16px;"><strong>${t("email.order_total", { total: formatMoney(total) })}</strong></p>
    ${details.join("")}
    ${renderAccountButton(accountUrl, t("email.view_order"))}
  `,
    t,
  );

  return { subject, html };
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  const { subject, html } = buildOrderConfirmationEmail(params);

  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject,
    html,
  });

  if (error) {
    console.error(`Order confirmation email failed for order ${params.orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}
