import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { localizePath } from "@/lib/i18n/locale-path";
import { type Language } from "@/lib/i18n/translate";

interface SessionOptions {
  /** Locale resolved from the URL prefix (or "en"). */
  locale: Language;
  /** Request path with the locale prefix removed. */
  pathname: string;
  /** When set, the response rewrites to this unprefixed path. */
  rewriteTo: string | null;
  /** Request headers to forward to the rendered route (carries x-locale). */
  headers: Headers;
}

export async function updateSession(request: NextRequest, options: SessionOptions) {
  const buildResponse = () => {
    if (options.rewriteTo) {
      const url = request.nextUrl.clone();
      url.pathname = options.rewriteTo;
      return NextResponse.rewrite(url, { request: { headers: options.headers } });
    }
    return NextResponse.next({ request: { headers: options.headers } });
  };

  let supabaseResponse = buildResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = buildResponse();
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            supabaseResponse.cookies.set(name, value, cookieOptions)
          );
        },
      },
    }
  );

  // Refresh the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, locale } = options;

  // Protect /account route - redirect to /login if not authenticated
  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath("/login", locale);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /login and /signup
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath("/", locale);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
