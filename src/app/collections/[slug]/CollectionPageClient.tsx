"use client";

import Link from "@/components/LocalizedLink";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ListPagination from "@/components/ListPagination";
import { useLanguage } from "@/context/LanguageContext";
import { resolveTagCopy } from "@/lib/products/resolve-copy";
import { type TagSummary, type UiProduct } from "@/lib/products/types";

interface CollectionPageClientProps {
  tag: TagSummary;
  products: UiProduct[];
  totalCount: number;
  page: number;
  totalPages: number;
  otherTags: TagSummary[];
}

export default function CollectionPageClient({
  tag,
  products,
  totalCount,
  page,
  totalPages,
  otherTags,
}: CollectionPageClientProps) {
  const { t, language } = useLanguage();
  const copy = resolveTagCopy(tag, tag.translations, language);
  const base = `/collections/${encodeURIComponent(tag.slug)}`;

  const buildPageHref = (nextPage: number) => (nextPage > 1 ? `${base}?page=${nextPage}` : base);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-4">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  {t("nav.home")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/collections" className="hover:text-primary">
                  {t("collections.title")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">
                {copy.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            {t("collections.eyebrow")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {copy.name}
          </h1>
          {copy.intro && (
            <p className="font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
              {copy.intro}
            </p>
          )}
          <p className="font-body text-sm text-muted-foreground mt-4">
            {totalCount} {t("products.results")}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-xl text-muted-foreground">{t("products.no_results")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <ListPagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
            </>
          )}

          {otherTags.length > 0 && (
            <nav aria-label={t("collections.browse_all")} className="mt-14 pt-10 border-t border-border">
              <h2 className="font-display text-xl font-semibold text-foreground text-center mb-4">
                {t("collections.browse_all")}
              </h2>
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-4xl mx-auto">
                {otherTags.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={`/collections/${encodeURIComponent(other.slug)}`}
                      className="font-body text-sm text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
                    >
                      {resolveTagCopy(other, other.translations, language).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
