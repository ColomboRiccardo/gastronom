import type { OrderEmailItem } from "./types";

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
export const FROM_NAME = process.env.RESEND_FROM_NAME ?? "Gastronom";

export function getAccountUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/account`;
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

export function renderItemsTable(items: OrderEmailItem[], title?: string) {
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
          <th style="padding:8px 12px;text-align:left;">Product</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Unit</th>
          <th style="padding:8px 12px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:12px;text-align:right;font-weight:600;">Total</td>
          <td style="padding:12px;text-align:right;font-weight:600;">${formatMoney(total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

export function wrapEmailLayout(content: string) {
  return `
    <div style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;">
      ${content}
      <p style="color:#666;font-size:13px;margin-top:32px;">
        Questions? Reply to this email or visit your account.
      </p>
    </div>`;
}

export function renderAccountButton(accountUrl: string, label = "View order in account") {
  return `
    <p style="margin:24px 0;">
      <a href="${accountUrl}" style="display:inline-block;padding:12px 24px;background:#b8860b;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        ${label}
      </a>
    </p>`;
}

export function greeting(name?: string) {
  return name ? `Hi ${name},` : "Hi,";
}
