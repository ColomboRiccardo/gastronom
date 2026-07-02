"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters, { PRICE_RANGES, type SortOption } from "@/components/ProductFilters";
import { fetchPublishedProducts } from "@/lib/products/queries";
import { type UiProduct } from "@/lib/products/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishedProducts();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filtered = useMemo(() => {
    let results = [...products];

    if (selectedCategories.length > 0) {
      results = results.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      results = results.filter((p) => p.priceNum >= range.min && p.priceNum < (range.max === Infinity ? 99999 : range.max));
    }

    switch (sort) {
      case "price-asc":
        results.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "price-desc":
        results.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "name-asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return results;
  }, [products, selectedCategories, selectedPriceRange, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Browse Our Selection
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            All Products
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Authentic Eastern European delicacies, spirits & crafts — imported directly for our little shop by the Ligurian sea.
          </p>
        </div>
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters
              categories={availableCategories}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              sort={sort}
              onSortChange={setSort}
              resultCount={filtered.length}
            />

            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 space-y-3">
                  <p className="font-display text-xl text-muted-foreground">Could not load products.</p>
                  <p className="font-body text-sm text-muted-foreground">{error}</p>
                  <button
                    type="button"
                    className="font-body text-sm text-primary underline underline-offset-4"
                    onClick={() => void loadProducts()}
                  >
                    Retry
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">No published products yet.</p>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Publish products from the admin Products tab to make them visible here.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">No products match your filters.</p>
                  <p className="font-body text-sm text-muted-foreground mt-2">Try adjusting your selection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
