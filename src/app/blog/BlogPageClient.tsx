"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { useBlogStore } from "@/data/blogStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

export default function BlogPageClient() {
  const { t } = useLanguage();
  const { articles: blogArticles } = useBlogStore();
  const [sort, setSort] = useState<SortOption>("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const sorted = useMemo(() => {
    const items = [...blogArticles];
    switch (sort) {
      case "oldest":
        items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "a-z":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        items.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return items;
  }, [blogArticles, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            {t("blog.subtitle")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("blog.title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("blog.description")}
          </p>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-3">
            {t("blog.intro")}
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <p className="font-body text-sm text-muted-foreground">
            {sorted.length} {t("blog.articles_count")}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setLayout("grid")}
                className={`p-2 transition-colors ${layout === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2 transition-colors ${layout === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-[160px] font-body text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("blog.sort_newest")}</SelectItem>
                <SelectItem value="oldest">{t("blog.sort_oldest")}</SelectItem>
                <SelectItem value="a-z">A to Z</SelectItem>
                <SelectItem value="z-a">Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className={
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }>
            {sorted.map((article) => (
              <BlogArticleCard key={article.slug} article={article} layout={layout} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
