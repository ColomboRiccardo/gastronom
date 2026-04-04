"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { type Product } from "@/components/ProductCard";
import ProductFilters, { PRICE_RANGES, type SortOption } from "@/components/ProductFilters";

const allProducts: Product[] = [
  // Vodka & Spirits
  { id: 1, name: "Beluga Noble Vodka", description: "Premium Russian vodka, 700ml", price: "€38.90", priceNum: 38.9, image: "/cat-vodka.jpg", category: "Vodka & Spirits", badge: "Popular" },
  { id: 2, name: "Stolichnaya Vodka", description: "Classic Russian vodka, 1L", price: "€18.90", priceNum: 18.9, image: "/cat-vodka.jpg", category: "Vodka & Spirits" },
  { id: 3, name: "Zubrowka Bison Grass", description: "Polish bison grass vodka, 700ml", price: "€22.50", priceNum: 22.5, image: "/cat-vodka.jpg", category: "Vodka & Spirits" },
  { id: 4, name: "Nemiroff Honey Pepper", description: "Ukrainian honey-pepper vodka, 700ml", price: "€16.90", priceNum: 16.9, image: "/cat-vodka.jpg", category: "Vodka & Spirits" },
  // Caviar & Roe
  { id: 5, name: "Red Salmon Caviar", description: "Wild Pacific salmon roe, 250g", price: "€24.50", priceNum: 24.5, image: "/cat-caviar.jpg", category: "Caviar & Roe" },
  { id: 6, name: "Black Sturgeon Caviar", description: "Premium Caspian sturgeon, 50g", price: "€89.00", priceNum: 89.0, image: "/cat-caviar.jpg", category: "Caviar & Roe", badge: "Premium" },
  { id: 7, name: "Pike Roe Spread", description: "Smoked pike roe pâté, 180g", price: "€8.90", priceNum: 8.9, image: "/cat-caviar.jpg", category: "Caviar & Roe" },
  // Pickles & Preserves
  { id: 8, name: "Pickled Cucumbers", description: "Traditional brine cucumbers, 900ml", price: "€4.90", priceNum: 4.9, image: "/cat-pickles.jpg", category: "Pickles & Preserves" },
  { id: 9, name: "Sauerkraut", description: "Fermented cabbage, classic recipe, 900ml", price: "€3.90", priceNum: 3.9, image: "/cat-pickles.jpg", category: "Pickles & Preserves" },
  { id: 10, name: "Pickled Tomatoes", description: "Green & red tomatoes in brine, 900ml", price: "€5.50", priceNum: 5.5, image: "/cat-pickles.jpg", category: "Pickles & Preserves" },
  { id: 11, name: "Marinated Mushrooms", description: "Forest mushrooms in herb marinade, 500ml", price: "€7.90", priceNum: 7.9, image: "/cat-pickles.jpg", category: "Pickles & Preserves", badge: "New" },
  // Kolbasa & Meats
  { id: 12, name: "Doctor's Kolbasa", description: "Classic boiled sausage, 400g", price: "€7.50", priceNum: 7.5, image: "/cat-meats.jpg", category: "Kolbasa & Meats", badge: "New" },
  { id: 13, name: "Salo with Garlic", description: "Cured pork fatback, Ukrainian style, 200g", price: "€6.50", priceNum: 6.5, image: "/cat-meats.jpg", category: "Kolbasa & Meats" },
  { id: 14, name: "Moskovskaya Kolbasa", description: "Dry-cured salami, smoked, 300g", price: "€9.90", priceNum: 9.9, image: "/cat-meats.jpg", category: "Kolbasa & Meats" },
  { id: 15, name: "Hunting Sausages", description: "Smoked mini sausages, 250g pack", price: "€5.90", priceNum: 5.9, image: "/cat-meats.jpg", category: "Kolbasa & Meats" },
  // Dried Fish
  { id: 16, name: "Vobla Dried Fish", description: "Salted & dried Caspian roach, 300g", price: "€9.90", priceNum: 9.9, image: "/cat-fish.jpg", category: "Dried Fish" },
  { id: 17, name: "Dried Squid Strips", description: "Seasoned dried squid snack, 100g", price: "€4.50", priceNum: 4.5, image: "/cat-fish.jpg", category: "Dried Fish" },
  { id: 18, name: "Smoked Sprats", description: "Latvian smoked sprats in oil, 240g", price: "€3.90", priceNum: 3.9, image: "/cat-fish.jpg", category: "Dried Fish" },
  // Gifts & Souvenirs
  { id: 19, name: "Matryoshka Set", description: "Hand-painted nesting dolls, 5 pcs", price: "€29.00", priceNum: 29.0, image: "/cat-gifts.jpg", category: "Gifts & Souvenirs" },
  { id: 20, name: "Zhostovo Tray", description: "Hand-painted floral metal tray", price: "€45.00", priceNum: 45.0, image: "/cat-gifts.jpg", category: "Gifts & Souvenirs" },
];

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let results = [...allProducts];

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
        break;
    }

    return results;
  }, [selectedCategories, selectedPriceRange, sort]);

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
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              sort={sort}
              onSortChange={setSort}
              resultCount={filtered.length}
            />

            <div className="flex-1">
              {filtered.length === 0 ? (
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
