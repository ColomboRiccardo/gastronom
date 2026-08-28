/**
 * Dates are shown as numbers everywhere (DD/MM/YYYY) so they read the same
 * in every language and never need translating.
 */

function toDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDate(value: string | number | Date): string {
  const date = toDate(value);
  if (!date) return "";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatDateTime(value: string | number | Date): string {
  const date = toDate(value);
  if (!date) return "";
  return `${formatDate(date)}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
