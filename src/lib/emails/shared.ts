import { createTranslator, type Language, type Translate } from "@/lib/i18n/translate";

import type { OrderEmailItem } from "./types";

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
export const FROM_NAME = process.env.RESEND_FROM_NAME ?? "Gastronom";
export const REPLY_TO = process.env.RESEND_REPLY_TO ?? "gastronom.sanremo@gmail.com";

/** Internal notifications are always read by the shop, so they use one fixed language. */
export const SHOP_LANGUAGE: Language = "it";

export function emailTranslator(language: Language): Translate {
  return createTranslator(language);
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    console.error(
      "NEXT_PUBLIC_SITE_URL is not set: outgoing emails will link to localhost.",
    );
  }
  return "http://localhost:3000";
}

export function getAccountUrl() {
  return `${getSiteUrl()}/account`;
}

export function formatMoney(amount: number) {
  return `€${amount.toFixed(2)}`;
}

export function lineTotal(item: OrderEmailItem) {
  return item.qty * item.unit_price;
}

export function orderItemsTotal(items: OrderEmailItem[]) {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function renderItemsTable(items: OrderEmailItem[], t: Translate, title?: string) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product_name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(item.unit_price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(lineTotal(item))}</td>
        </tr>`,
    )
    .join("");

  const total = orderItemsTotal(items);
  const titleBlock = title
    ? `<h3 style="margin:24px 0 8px;font-size:16px;">${title}</h3>`
    : "";

  return `
    ${titleBlock}
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f8f8f8;">
          <th style="padding:8px 12px;text-align:left;">${t("admin_products.col_product")}</th>
          <th style="padding:8px 12px;text-align:center;">${t("email.col_qty")}</th>
          <th style="padding:8px 12px;text-align:right;">${t("email.col_unit")}</th>
          <th style="padding:8px 12px;text-align:right;">${t("email.col_subtotal")}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:12px;text-align:right;font-weight:600;">${t("orders.total")}</td>
          <td style="padding:12px;text-align:right;font-weight:600;">${formatMoney(total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

export function wrapEmailLayout(content: string, t: Translate) {
  return `
    <div style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;">
      ${content}
      <p style="color:#666;font-size:13px;margin-top:32px;">
        ${t("email.footer_questions")}
      </p>
    </div>`;
}

export function renderAccountButton(accountUrl: string, label: string) {
  return `
    <p style="margin:24px 0;">
      <a href="${accountUrl}" style="display:inline-block;padding:12px 24px;background:#b8860b;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        ${label}
      </a>
    </p>`;
}

export function greeting(t: Translate, name?: string) {
  return name ? t("email.greeting", { name }) : t("email.greeting_anon");
}
