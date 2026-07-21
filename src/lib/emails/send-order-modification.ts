import { resend } from "@/lib/resend";

export interface ModificationEmailItem {
  product_name: string;
  qty: number;
  unit_price: number;
}

interface SendOrderModificationEmailParams {
  to: string;
  customerName?: string;
  orderId: number;
  originalItems: ModificationEmailItem[];
  proposedItems: ModificationEmailItem[];
  message?: string;
  accountUrl: string;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const FROM_NAME = process.env.RESEND_FROM_NAME ?? "Gastronom";

function formatMoney(amount: number) {
  return `€${amount.toFixed(2)}`;
}

function lineTotal(item: ModificationEmailItem) {
  return item.qty * item.unit_price;
}

function renderItemsTable(items: ModificationEmailItem[], title: string) {
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

  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return `
    <h3 style="margin:24px 0 8px;font-size:16px;">${title}</h3>
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

export async function sendOrderModificationEmail(params: SendOrderModificationEmailParams) {
  const { to, customerName, orderId, originalItems, proposedItems, message, accountUrl } = params;

  const greeting = customerName ? `Hi ${customerName},` : "Hi,";
  const noteBlock = message
    ? `<p style="margin:16px 0;padding:12px 16px;background:#fff8e6;border-left:4px solid #f5a623;border-radius:4px;">${message}</p>`
    : "";

  const html = `
    <div style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;">
      <h2 style="margin:0 0 16px;">Order update — #${orderId}</h2>
      <p>${greeting}</p>
      <p>Some items in your order are not available as requested. We would like to propose the following changes:</p>
      ${noteBlock}
      ${renderItemsTable(originalItems, "Your original order")}
      ${renderItemsTable(proposedItems, "Proposed changes")}
      <p style="margin:24px 0 8px;">Please review the changes in your account and let us know if you accept them.</p>
      <p style="margin:24px 0;">
        <a href="${accountUrl}" style="display:inline-block;padding:12px 24px;background:#b8860b;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
          View order in account
        </a>
      </p>
      <p style="color:#666;font-size:13px;">If you have questions, reply to this email or contact us on WhatsApp.</p>
    </div>`;

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
  proposedItems: ModificationEmailItem[];
  message?: string;
}) {
  const { orderId, customerName, proposedItems, message } = params;
  const greeting = customerName ? `Hi ${customerName},` : "Hi,";
  const lines = proposedItems.map(
    (item) => `• ${item.qty}× ${item.product_name} (${formatMoney(lineTotal(item))})`,
  );
  const total = proposedItems.reduce((sum, item) => sum + lineTotal(item), 0);

  return [
    greeting,
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
