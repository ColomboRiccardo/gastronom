"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import ListPagination from "@/components/ListPagination";
import { type SortOption } from "@/lib/products/constants";
import { type UiProduct } from "@/lib/products/types";

interface ProductsPageClientProps {
  products: UiProduct[];
  totalCount: number;
  page: number;
  totalPages: number;
  categories: string[];
  initialCategories: string[];
  initialPriceRange: number | null;
  initialSort: SortOption;
}

const ProductsPageClient = ({
  products,
  totalCount,
  page,
  totalPages,
  categories,
  initialCategories,
  initialPriceRange,
  initialSort,
}: ProductsPageClientProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const buildQueryString = useCallback(
    (overrides: {
      page?: number;
      categories?: string[];
      priceRange?: number | null;
      sort?: SortOption;
    }) => {
      const cats = overrides.categories ?? initialCategories;
      const price = overrides.priceRange !== undefined ? overrides.priceRange : initialPriceRange;
      const sort = overrides.sort ?? initialSort;
      const nextPage = overrides.page ?? page;

      const params = new URLSearchParams();
      cats.forEach((c) => params.append("category", c));
      if (price != null) {
        params.set("price", String(price));
      }
      if (sort !== "newest") {
        params.set("sort", sort);
      }
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      const qs = params.toString();
      return qs ? `/products?${qs}` : "/products";
    },
    [initialCategories, initialPriceRange, initialSort, page],
  );

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleCategoriesChange = (cats: string[]) => {
    navigate(buildQueryString({ page: 1, categories: cats }));
  };

  const handlePriceRangeChange = (idx: number | null) => {
    navigate(buildQueryString({ page: 1, priceRange: idx }));
  };

  const handleSortChange = (sort: SortOption) => {
    navigate(buildQueryString({ page: 1, sort }));
  };

  const buildPageHref = (nextPage: number) => buildQueryString({ page: nextPage });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters
              categories={categories}
              selectedCategories={initialCategories}
              onCategoriesChange={handleCategoriesChange}
              selectedPriceRange={initialPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              sort={initialSort}
              onSortChange={handleSortChange}
              resultCount={totalCount}
            />

            <div className="flex-1">
              {totalCount === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">No published products yet.</p>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Publish products from the admin Products tab to make them visible here.
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">No products match your filters.</p>
                  <p className="font-body text-sm text-muted-foreground mt-2">Try adjusting your selection.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <ListPagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPageClient;
