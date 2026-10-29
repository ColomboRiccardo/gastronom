import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Providers from "./providers";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { getServerTranslator } from "@/lib/i18n/server";
import { OG_LOCALES } from "@/lib/i18n/locale-path";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translate";
import { getSiteUrl } from "@/lib/seo/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getServerTranslator();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("meta.site_title"),
      template: "%s — Гастроном",
    },
    description: t("meta.site_description"),
    openGraph: {
      siteName: "Гастроном",
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: SUPPORTED_LANGUAGES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, { locale }] = await Promise.all([getAuthenticatedUser(), getServerTranslator()]);

  return (
    <html lang={locale} className={`${playfair.variable} ${sourceSans.variable}`}>
      <body>
        <Providers initialUser={user} initialLanguage={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
