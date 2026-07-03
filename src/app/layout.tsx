import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Providers from "./providers";
import { getAuthenticatedUser } from "@/lib/auth/server";
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

export const metadata: Metadata = {
  title: "Гастроном — Eastern European Delicatessen",
  description:
    "Authentic Eastern European delicacies, spirits & crafts in Liguria, Italy.",
  openGraph: {
    title: "Гастроном — Eastern European Delicatessen",
    description:
      "Authentic Eastern European delicacies, spirits & crafts in Liguria, Italy.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();

  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body>
        <Providers initialUser={user}>{children}</Providers>
      </body>
    </html>
  );
}
