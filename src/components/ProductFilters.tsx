"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  PRICE_RANGES,
  type SortOption,
} from "@/lib/products/constants";
import { useLanguage } from "@/context/LanguageContext";

interface ProductFiltersProps {
  selectedCategories: string[];
  categories?: string[];
  onCategoriesChange: (cats: string[]) => void;
  selectedPriceRange: number | null;
  onPriceRangeChange: (idx: number | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const ProductFilters = ({
  selectedCategories,
  categories,
  onCategoriesChange,
  selectedPriceRange,
  onPriceRangeChange,
  sort,
  onSortChange,
  resultCount,
}: ProductFiltersProps) => {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const categoryOptions = categories ?? [];

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

  const resultsLabel = `${resultCount} ${t("products.results")}`;

  const filterContent = (
    <div className="space-y-6">
      {hasFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
              {t("products.active_filters")}
            </span>
            <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0" onClick={clearAll}>
              {t("products.clear_all")}
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

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          {t("products.category")}
        </h3>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {categoryOptions.map((cat) => (
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

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          {t("products.price_range")}
        </h3>
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

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          {t("products.sort")}
        </h3>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("products.sort_newest")}</SelectItem>
            <SelectItem value="price-asc">{t("products.sort_price_asc")}</SelectItem>
            <SelectItem value="price-desc">{t("products.sort_price_desc")}</SelectItem>
            <SelectItem value="name-asc">{t("products.sort_name")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <span className="font-body text-sm text-muted-foreground">{resultsLabel}</span>
        <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setMobileOpen(!mobileOpen)}>
          <SlidersHorizontal className="h-4 w-4" />
          {mobileOpen ? t("products.hide_filters") : t("products.show_filters")}
        </Button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-card border border-border rounded-lg p-5 mb-6 max-h-[70vh] overflow-y-auto">
          {filterContent}
        </div>
      )}

      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-card border border-border rounded-lg p-5 sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
          <div className="flex items-center justify-between mb-5 shrink-0">
            <h2 className="font-display text-lg font-semibold text-foreground">{t("products.filters")}</h2>
            <span className="font-body text-xs text-muted-foreground">{resultsLabel}</span>
          </div>
          <div className="overflow-y-auto min-h-0 flex-1 pr-1">
            {filterContent}
          </div>
        </div>
      </aside>
    </>
  );
};

export { PRICE_RANGES, type SortOption } from "@/lib/products/constants";
export default ProductFilters;
