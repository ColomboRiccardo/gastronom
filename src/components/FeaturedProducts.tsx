"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";
import { fetchRandomPublishedProducts } from "@/lib/products/queries";

const FEATURED_COUNT = 8;

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      try {
        const randomProducts = await fetchRandomPublishedProducts(FEATURED_COUNT);
        if (!cancelled) {
          setProducts(randomProducts);
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    void loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="products" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Our Selection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Featured Products
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground font-body">
            Featured products will appear here once products are published.
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="font-body border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
