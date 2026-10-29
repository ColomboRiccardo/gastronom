import type { MetadataRoute } from "next";

import { blogArticles } from "@/data/blogArticles";
import { localizePath } from "@/lib/i18n/locale-path";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translate";
import {
  fetchCategoryLastModified,
  fetchPublishedCategorySummaries,
  fetchPublishedProductSlugs,
  fetchPublishedTagSlugs,
} from "@/lib/products/server-queries";
import { absoluteUrl } from "@/lib/seo/site";

// The catalogue queries go through the cookie-aware Supabase client, so this
// cannot be prerendered at build time. Saying so up front keeps the build log
// free of "dynamic server usage" noise.
export const dynamic = "force-dynamic";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

/**
 * Pages whose copy is translated get one entry per language, each carrying the
 * full hreflang set. English-only pages (blog, legal) are listed once.
 */
const LOCALIZED_STATIC: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
];

const ENGLISH_ONLY_STATIC: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    out[lang] = absoluteUrl(localizePath(path, lang));
  }
  out["x-default"] = absoluteUrl(path);
  return out;
}

function localizedEntries(
  path: string,
  options: { changeFrequency: ChangeFrequency; priority: number; lastModified?: Date },
): MetadataRoute.Sitemap {
  const alternates = { languages: languageAlternates(path) };
  return SUPPORTED_LANGUAGES.map((lang) => ({
    url: absoluteUrl(localizePath(path, lang)),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates,
  }));
}

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const item of LOCALIZED_STATIC) {
    entries.push(...localizedEntries(item.path, item));
  }
  for (const item of ENGLISH_ONLY_STATIC) {
    entries.push({ url: absoluteUrl(item.path), changeFrequency: item.changeFrequency, priority: item.priority });
  }

  for (const article of blogArticles) {
    entries.push({
      url: absoluteUrl(`/blog/${encodeURIComponent(article.slug)}`),
      lastModified: toDate(article.date),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  try {
    const [categories, lastModified] = await Promise.all([
      fetchPublishedCategorySummaries(),
      fetchCategoryLastModified(),
    ]);
    for (const cat of categories) {
      entries.push(
        ...localizedEntries(`/categories/${encodeURIComponent(cat.slug)}`, {
          changeFrequency: "daily",
          priority: 0.7,
          lastModified: toDate(lastModified.get(cat.id)),
        }),
      );
    }
  } catch (error) {
    console.error("sitemap: failed to load categories", error);
  }

  try {
    const tags = await fetchPublishedTagSlugs();
    for (const tag of tags) {
      entries.push(
        ...localizedEntries(`/collections/${encodeURIComponent(tag.slug)}`, {
          changeFrequency: "weekly",
          priority: 0.7,
          lastModified: toDate(tag.updatedAt),
        }),
      );
    }
  } catch (error) {
    console.error("sitemap: failed to load collections", error);
  }

  try {
    const products = await fetchPublishedProductSlugs();
    for (const p of products) {
      entries.push(
        ...localizedEntries(`/products/${encodeURIComponent(p.slug)}`, {
          changeFrequency: "weekly",
          priority: 0.6,
          lastModified: toDate(p.updatedAt),
        }),
      );
    }
  } catch (error) {
    console.error("sitemap: failed to load products", error);
  }

  return entries;
}
