import Link from "next/link";
import { PLACEHOLDER_CATEGORY_IMAGE } from "@/lib/products/mappers";
import { type CategorySummary } from "@/lib/products/types";

interface CategoryGridProps {
  categories: CategorySummary[];
  className?: string;
  columns?: "home" | "page";
}

const CategoryGrid = ({
  categories,
  className = "",
  columns = "page",
}: CategoryGridProps) => {
  if (categories.length === 0) {
    return (
      <p className="text-center text-muted-foreground font-body">
        Categories will appear here once products are published.
      </p>
    );
  }

  const gridClass =
    columns === "home"
      ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";

  return (
    <div className={`${gridClass} ${className}`.trim()}>
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/products?category=${encodeURIComponent(cat.name)}`}
          className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={PLACEHOLDER_CATEGORY_IMAGE}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground line-clamp-2">
              {cat.name}
            </h3>
            <p className="font-body text-sm text-primary-foreground/60">
              {cat.count} {cat.count === 1 ? "product" : "products"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
