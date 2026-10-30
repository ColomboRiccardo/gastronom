/** Shared helpers for product <title> / meta description length and uniqueness. */

const TITLE_SEGMENT_MAX = 55;
const DESCRIPTION_MAX = 155;

/** Word-aware trim so long supplier names do not blow past SERP limits. */
export function truncateTitleSegment(text: string, max = TITLE_SEGMENT_MAX): string {
  const oneLine = text.trim().replace(/\s+/g, " ");
  if (oneLine.length <= max) return oneLine;
  const slice = oneLine.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace >= Math.floor(max * 0.5) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

export function trimMetaDescription(text: string, max = DESCRIPTION_MAX): string {
  const oneLine = text.trim().replace(/\s+/g, " ");
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Trailing numeric id from the slug (e.g. millet-16169 → "16169"). Used to
 * tell SKU twins apart in <title> without a DB uniqueness check.
 */
export function slugDisambiguator(slug: string): string | null {
  const match = /-(\d+)$/.exec(slug.trim());
  return match?.[1] ?? null;
}

/** "{name} – {category}" plus optional (sku), then truncated for the layout template. */
export function buildProductTitleSegment(options: {
  name: string;
  category: string;
  slug: string;
}): string {
  const id = slugDisambiguator(options.slug);
  const withId = id ? `${options.name} (${id})` : options.name;
  const base = options.category ? `${withId} – ${options.category}` : withId;
  return truncateTitleSegment(base);
}

/**
 * Always lead with the product name so shared ingredient/storage boilerplate
 * cannot produce identical meta descriptions across SKUs.
 */
export function buildProductMetaDescription(options: {
  name: string;
  category: string;
  body: string;
  fallback: string;
}): string {
  const body = options.body.trim().replace(/\s+/g, " ");
  if (!body) return trimMetaDescription(options.fallback);

  const lead = options.category
    ? `${options.name} (${options.category}). `
    : `${options.name}. `;

  // Avoid "Name. Name. …" when the body already starts with the product name.
  const rest = body.toLowerCase().startsWith(options.name.toLowerCase())
    ? body
    : `${lead}${body}`;

  return trimMetaDescription(rest);
}
