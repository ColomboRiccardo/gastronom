import { fetchPublishedCategorySummaries } from "@/lib/products/server-queries";
import CategoriesPageClient from "./CategoriesPageClient";

export default async function CategoriesPage() {
  const categories = await fetchPublishedCategorySummaries();
  return <CategoriesPageClient categories={categories} />;
}
