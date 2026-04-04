"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "Vodka & Spirits",
  "Caviar & Roe",
  "Pickles & Preserves",
  "Kolbasa & Meats",
  "Dried Fish",
  "Gifts & Souvenirs",
];

const PRICE_RANGES = [
  { label: "Under €10", min: 0, max: 10 },
  { label: "€10 – €25", min: 10, max: 25 },
  { label: "€25 – €50", min: 25, max: 50 },
  { label: "Over €50", min: 50, max: Infinity },
];

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "newest";

interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoriesChange: (cats: string[]) => void;
  selectedPriceRange: number | null;
  onPriceRangeChange: (idx: number | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const ProductFilters = ({
  selectedCategories,
  onCategoriesChange,
  selectedPriceRange,
  onPriceRangeChange,
  sort,
  onSortChange,
  resultCount,
}: ProductFiltersProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    onCategoriesChange(
      selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  const hasFilters = selectedCategories.length > 0 || selectedPriceRange !== null;

  const clearAll = () => {
    onCategoriesChange([]);
    onPriceRangeChange(null);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Active filters */}
      {hasFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Active Filters</span>
            <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0" onClick={clearAll}>
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-body px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20"
                onClick={() => toggleCategory(cat)}
              >
                {cat}
                <X className="h-3 w-3" />
              </span>
            ))}
            {selectedPriceRange !== null && (
              <span
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-body px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20"
                onClick={() => onPriceRangeChange(null)}
              >
                {PRICE_RANGES[selectedPriceRange].label}
                <X className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Categories</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span className="font-body text-sm text-foreground/80 group-hover:text-primary transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedPriceRange === idx}
                onCheckedChange={() => onPriceRangeChange(selectedPriceRange === idx ? null : idx)}
              />
              <span className="font-body text-sm text-foreground/80 group-hover:text-primary transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Sort By</h3>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <span className="font-body text-sm text-muted-foreground">{resultCount} products</span>
        <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setMobileOpen(!mobileOpen)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border border-border rounded-lg p-5 mb-6">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
            <span className="font-body text-xs text-muted-foreground">{resultCount} products</span>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
};

export { CATEGORIES, PRICE_RANGES };
export default ProductFilters;
