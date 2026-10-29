import type { Metadata } from "next";

import AboutPageClient from "./AboutPageClient";
import { localizedPageMetadata } from "@/lib/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/about",
    titleKey: "meta.about_title",
    descriptionKey: "meta.about_description",
  });
}

export default function AboutPage() {
  return <AboutPageClient />;
}
