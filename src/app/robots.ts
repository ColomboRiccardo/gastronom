import type { MetadataRoute } from "next";

import { PREFIXED_LANGUAGES } from "@/lib/i18n/locale-path";
import { getSiteUrl } from "@/lib/seo/site";

const PRIVATE_PATHS = [
  "/account",
  "/cart",
  "/checkout/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/",
];

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();

  // Same private paths under every locale prefix (/it/account, /ru/cart, ...)
  const disallow = [
    "/api/",
    ...PRIVATE_PATHS,
    ...PREFIXED_LANGUAGES.flatMap((lang) => PRIVATE_PATHS.map((path) => `/${lang}${path}`)),
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${site}/sitemap.xml`,
    host: site.replace(/^https?:\/\//, ""),
  };
}
