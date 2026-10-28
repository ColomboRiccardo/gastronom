import type { MetadataRoute } from "next";

import {
  fetchPublishedCategorySummaries,
  fetchPublishedProductSlugs,
} from "@/lib/products/server-queries";
import { absoluteUrl } from "@/lib/seo/site";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const categories = await fetchPublishedCategorySummaries();
    categoryEntries = categories.map((cat) => ({
      url: absoluteUrl(`/products?category=${encodeURIComponent(cat.slug)}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("sitemap: failed to load categories", error);
  }

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchPublishedProductSlugs();
    productEntries = products.map((p) => ({
      url: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("sitemap: failed to load products", error);
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
