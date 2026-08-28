import { getResend } from "@/lib/resend";
import { createTranslator, DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/translate";

import {
  FROM_EMAIL,
  FROM_NAME,
  REPLY_TO,
  emailTranslator,
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
  language?: Language;
  customerName?: string;
  orderId: number;
  originalItems: OrderEmailItem[];
  proposedItems: OrderEmailItem[];
  message?: string;
}

export function buildOrderModificationEmail(params: SendOrderModificationEmailParams) {
  const {
    language = DEFAULT_LANGUAGE,
    customerName,
    orderId,
    originalItems,
    proposedItems,
    message,
  } = params;

  const t = emailTranslator(language);
  const accountUrl = getAccountUrl();

  const noteBlock = message
    ? `<p style="margin:16px 0;padding:12px 16px;background:#fff8e6;border-left:4px solid #f5a623;border-radius:4px;">${message}</p>`
    : "";

  const html = wrapEmailLayout(
    `
    <h2 style="margin:0 0 16px;">${t("email.mod_heading", { id: orderId })}</h2>
    <p>${greeting(t, customerName)}</p>
    <p>${t("email.mod_body")}</p>
    ${noteBlock}
    ${renderItemsTable(originalItems, t, t("email.mod_original"))}
    ${renderItemsTable(proposedItems, t, t("email.mod_proposed"))}
    <p style="margin:24px 0 8px;">${t("email.mod_review")}</p>
    ${renderAccountButton(accountUrl, t("email.view_order"))}
    <p style="color:#666;font-size:13px;">${t("email.mod_whatsapp")}</p>
  `,
    t,
  );

  return { subject: t("email.mod_subject", { id: orderId }), html };
}

export async function sendOrderModificationEmail(params: SendOrderModificationEmailParams) {
  const { subject, html } = buildOrderModificationEmail(params);

  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject,
    html,
  });

  if (error) {
    console.error(`Order modification email failed for order ${params.orderId}:`, error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

export function buildWhatsAppModificationMessage(params: {
  orderId: number;
  language?: Language;
  customerName?: string;
  proposedItems: OrderEmailItem[];
  message?: string;
}) {
  const {
    orderId,
    language = DEFAULT_LANGUAGE,
    customerName,
    proposedItems,
    message,
  } = params;

  const t = createTranslator(language);
  const lines = proposedItems.map(
    (item) => `• ${item.qty}× ${item.product_name} (${formatMoney(lineTotal(item))})`,
  );
  const total = proposedItems.reduce((sum, item) => sum + lineTotal(item), 0);

  return [
    greeting(t, customerName),
    "",
    t("email.wa_intro", { id: orderId }),
    message ? `\n${message}\n` : "",
    t("email.wa_proposed"),
    ...lines,
    "",
    t("email.wa_new_total", { total: formatMoney(total) }),
    "",
    t("email.wa_confirm"),
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
