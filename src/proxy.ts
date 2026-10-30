import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { localizePath, splitLocaleFromPath } from "@/lib/i18n/locale-path";
import { type Language } from "@/lib/i18n/translate";

const LOCALE_HEADER = "x-locale";

/**
 * Legacy URL shapes that now have clean routes. Done here so the browser gets a
 * real 308 instead of the streamed redirect a page inside a loading boundary
 * would produce.
 */
/** Blog articles and legal pages are English-only; locale prefixes are soft duplicates. */
const ENGLISH_ONLY_PREFIXES = ["/terms", "/privacy", "/cookies"] as const;

function isEnglishOnlyPath(pathname: string): boolean {
  if (ENGLISH_ONLY_PREFIXES.some((path) => pathname === path)) return true;
  // /blog/<slug> is English-only; the /blog index stays localized.
  return /^\/blog\/[^/]+$/.test(pathname);
}

function legacyRedirect(request: NextRequest, pathname: string, locale: Language): URL | null {
  const search = request.nextUrl.searchParams;

  if (pathname === "/products") {
    const categories = search.getAll("category").filter(Boolean);
    if (categories.length === 1) {
      const url = request.nextUrl.clone();
      url.pathname = localizePath(`/categories/${encodeURIComponent(categories[0])}`, locale);
      url.searchParams.delete("category");
      return url;
    }
  }

  if (pathname === "/blog") {
    const article = search.get("article");
    if (article) {
      // Articles are English-only: always land on the unprefixed URL.
      const url = request.nextUrl.clone();
      url.pathname = `/blog/${encodeURIComponent(article)}`;
      url.searchParams.delete("article");
      return url;
    }
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { urlLocale, pathname } = splitLocaleFromPath(request.nextUrl.pathname);
  const locale: Language = urlLocale ?? "en";

  // English is served at the root; "/en/..." would only create a duplicate.
  if (urlLocale === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url, 308);
  }

  // Locale-prefixed English-only pages → strip the prefix (308).
  if (urlLocale && isEnglishOnlyPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url, 308);
  }

  const legacy = legacyRedirect(request, pathname, locale);
  if (legacy) {
    return NextResponse.redirect(legacy, 308);
  }

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);

  return await updateSession(request, {
    locale,
    pathname,
    rewriteTo: urlLocale ? pathname : null,
    headers,
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml)$).*)",
  ],
};
