import Link from "next/link";
import { Button } from "@/components/ui/button";
import CategoryGrid from "@/components/CategoryGrid";
import { type CategorySummary } from "@/lib/products/types";

interface CategoriesSectionProps {
  categories: CategorySummary[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const previewCategories = categories.slice(0, 6);
  const hasMore = categories.length > previewCategories.length;

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

        <CategoryGrid categories={previewCategories} columns="home" />

        {hasMore && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="font-body border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
