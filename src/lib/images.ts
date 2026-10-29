/**
 * Hosts the Next.js image optimizer is allowed to fetch from. Keep in sync with
 * `images.remotePatterns` in next.config.ts. Anything else renders with
 * `unoptimized` so an unexpected host degrades to a plain <img> instead of a
 * runtime error.
 */
const OPTIMIZABLE_HOST_SUFFIXES = [".supabase.co", "images.unsplash.com", "gastronomsanremo.com"];

export function shouldOptimizeImage(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== "https:") return false;
    return OPTIMIZABLE_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix.replace(/^\./, "") || hostname.endsWith(suffix),
    );
  } catch {
    return false;
  }
}
