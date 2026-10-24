import type { Metadata } from "next";

import { fetchPublishedCategorySummaries } from "@/lib/products/server-queries";
import CategoriesPageClient from "./CategoriesPageClient";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse Eastern European food categories at Гастроном in Sanremo: dairy, sausage, preserves, sweets, and more.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await fetchPublishedCategorySummaries();
  return <CategoriesPageClient categories={categories} />;
}
