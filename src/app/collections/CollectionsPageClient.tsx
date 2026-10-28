"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { PLACEHOLDER_CATEGORY_IMAGE } from "@/lib/products/mappers";
import { resolveTagCopy } from "@/lib/products/resolve-copy";
import { type TagSummary } from "@/lib/products/types";

export default function CollectionsPageClient({ tags }: { tags: TagSummary[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("collections.title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("collections.subtitle")}
          </p>
        </div>
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {tags.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">{t("collections.empty")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {tags.map((tag) => {
                const copy = resolveTagCopy(tag, tag.translations, language);
                return (
                  <Link
                    key={tag.id}
                    href={`/collections/${encodeURIComponent(tag.slug)}`}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={tag.imageUrl || PLACEHOLDER_CATEGORY_IMAGE}
                      alt={copy.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h2 className="font-display text-lg md:text-xl font-semibold text-primary-foreground line-clamp-2">
                        {copy.name}
                      </h2>
                      <p className="font-body text-sm text-primary-foreground/60">
                        {tag.count}{" "}
                        {tag.count === 1 ? t("products.product_one") : t("products.product_other")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
