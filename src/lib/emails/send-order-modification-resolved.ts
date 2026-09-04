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
import type { OrderEmailItem } from "./types";

type ModificationAction = "accept" | "decline";

interface SendOrderModificationResolvedEmailParams {
  to: string;
  language?: Language;
  customerName?: string;
  orderId: number;
  action: ModificationAction;
  items: OrderEmailItem[];
  total: number;
}

export function buildOrderModificationResolvedEmail(
  params: SendOrderModificationResolvedEmailParams,
) {
  const {
    language = DEFAULT_LANGUAGE,
    customerName,
    orderId,
    action,
    items,
    total,
  } = params;

  const t = emailTranslator(language);
  const accountUrl = getAccountUrl();
  const prefix = action === "accept" ? "email.mod_accepted" : "email.mod_declined";

  const subject = t(`${prefix}_subject`, { id: orderId });
  const heading = t(`${prefix}_heading`, { id: orderId });
  const body = t(`${prefix}_body`);

  const html = wrapEmailLayout(
    `
    <h2 style="margin:0 0 16px;">${heading}</h2>
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

export async function sendOrderModificationResolvedEmail(
  params: SendOrderModificationResolvedEmailParams,
) {
  const { subject, html } = buildOrderModificationResolvedEmail(params);

  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject,
    html,
  });

  if (error) {
    console.error(
      `Modification ${params.action} email failed for order ${params.orderId}:`,
      error,
    );
    return { ok: false as const, error };
  }

  return { ok: true as const };
}
