import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "@/components/LocalizedLink";
import BlogArticleView from "@/components/blog/BlogArticleView";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { blogArticles, type BlogArticle } from "@/data/blogArticles";
import { getServerTranslator, openGraphBase } from "@/lib/i18n/server";
import { absoluteUrl, noIndexFollow } from "@/lib/seo/site";
import { SHOP } from "@/lib/shipping/config";

type Params = Promise<{ slug: string }>;

function findArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  const { locale, t } = await getServerTranslator();

  if (!article) {
    return { title: t("meta.not_found"), robots: noIndexFollow };
  }

  const path = `/blog/${encodeURIComponent(article.slug)}`;

  // Articles exist in English only, so every locale points at the English URL.
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase(path, locale),
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: article.image, alt: article.title }],
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const { t } = await getServerTranslator();
  const articleUrl = absoluteUrl(`/blog/${encodeURIComponent(article.slug)}`);
  const related = blogArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SHOP.name,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: articleUrl,
    articleSection: article.category,
    inLanguage: "en",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />

      <section className="pt-24 pb-6">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.back")}
          </Link>
        </div>
      </section>

      <BlogArticleView article={article} />

      {related.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              {t("blog.all_articles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <BlogArticleCard key={item.slug} article={item} layout="grid" />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
