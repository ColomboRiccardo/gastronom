import type { Metadata } from "next";

import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Гастроном: Eastern European delicacies, spirits, and crafts in Sanremo, Liguria.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
