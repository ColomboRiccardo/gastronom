import type { Metadata } from "next";

import { localizedPageMetadata } from "@/lib/i18n/server";
import { fetchPublishedCategorySummaries } from "@/lib/products/server-queries";
import CategoriesPageClient from "./CategoriesPageClient";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/categories",
    titleKey: "meta.categories_title",
    descriptionKey: "meta.categories_description",
  });
}

export default async function CategoriesPage() {
  const categories = await fetchPublishedCategorySummaries();
  return <CategoriesPageClient categories={categories} />;
}
