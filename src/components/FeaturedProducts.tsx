"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";

const products: Product[] = [
  { id: 1, name: "Beluga Noble Vodka", description: "Premium Russian vodka, 700ml", price: "€38.90", priceNum: 38.9, image: "/cat-vodka.jpg", category: "Vodka & Spirits", badge: "Popular" },
  { id: 2, name: "Red Salmon Caviar", description: "Wild Pacific salmon roe, 250g", price: "€24.50", priceNum: 24.5, image: "/cat-caviar.jpg", category: "Caviar & Roe" },
  { id: 3, name: "Pickled Cucumbers", description: "Traditional brine cucumbers, 900ml", price: "€4.90", priceNum: 4.9, image: "/cat-pickles.jpg", category: "Pickles & Preserves" },
  { id: 4, name: "Doctor's Kolbasa", description: "Classic boiled sausage, 400g", price: "€7.50", priceNum: 7.5, image: "/cat-meats.jpg", category: "Kolbasa & Meats", badge: "New" },
  { id: 5, name: "Vobla Dried Fish", description: "Salted & dried Caspian roach, 300g", price: "€9.90", priceNum: 9.9, image: "/cat-fish.jpg", category: "Dried Fish" },
  { id: 6, name: "Matryoshka Set", description: "Hand-painted nesting dolls, 5 pcs", price: "€29.00", priceNum: 29.0, image: "/cat-gifts.jpg", category: "Gifts & Souvenirs" },
  { id: 7, name: "Salo with Garlic", description: "Cured pork fatback, Ukrainian style, 200g", price: "€6.50", priceNum: 6.5, image: "/cat-meats.jpg", category: "Kolbasa & Meats" },
  { id: 8, name: "Stolichnaya Vodka", description: "Classic Russian vodka, 1L", price: "€18.90", priceNum: 18.9, image: "/cat-vodka.jpg", category: "Vodka & Spirits" },
];

const FeaturedProducts = () => {
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
