"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PLACEHOLDER_CATEGORY_IMAGE } from "@/lib/products/mappers";
import { fetchPublishedProducts } from "@/lib/products/queries";
import { type CategorySummary } from "@/lib/products/types";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await fetchPublishedProducts();
      const counts = new Map<string, number>();
      for (const product of products) {
        counts.set(product.category, (counts.get(product.category) || 0) + 1);
      }

      setCategories(
        Array.from(counts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setCategories([]);
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Browse by
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Categories
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground font-body">
            Loading categories...
          </p>
        ) : error ? (
          <div className="text-center text-muted-foreground font-body space-y-2">
            <p>Could not load categories.</p>
            <p className="text-xs">{error}</p>
            <button
              type="button"
              onClick={() => void loadCategories()}
              className="text-primary underline underline-offset-4 text-sm"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">
            Categories will appear here once products are published.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={PLACEHOLDER_CATEGORY_IMAGE}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground">
                    {cat.name}
                  </h3>
                  <p className="font-body text-sm text-primary-foreground/60">
                    {cat.count} {cat.count === 1 ? "product" : "products"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
