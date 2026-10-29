import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import BlogPageClient from "./BlogPageClient";
import { blogArticles } from "@/data/blogArticles";
import { localizedPageMetadata, getRequestLocale } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/locale-path";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/blog",
    titleKey: "meta.blog_title",
    descriptionKey: "meta.blog_description",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ article?: string }>;
}) {
  const { article } = await searchParams;

  // Old deep links used /blog?article=<slug>; articles now have their own routes.
  if (article) {
    const locale = await getRequestLocale();
    const known = blogArticles.some((a) => a.slug === article);
    permanentRedirect(localizePath(known ? `/blog/${encodeURIComponent(article)}` : "/blog", locale));
  }

  return <BlogPageClient />;
}
