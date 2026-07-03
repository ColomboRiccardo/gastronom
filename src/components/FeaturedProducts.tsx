import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { type UiProduct } from "@/lib/products/types";

interface FeaturedProductsProps {
  products: UiProduct[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto items-stretch">
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
