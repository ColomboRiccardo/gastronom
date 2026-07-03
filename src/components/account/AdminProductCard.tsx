"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProductSyncLockButton from "@/components/account/ProductSyncLockButton";
import { hasEditorLocks } from "@/lib/products/editor-locks";
import { type AdminProduct } from "@/lib/products/types";

const stockColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 border-green-200";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Out of Stock":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const publishedColor = (published: boolean) =>
  published
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-muted text-muted-foreground";

interface AdminProductCardProps {
  product: AdminProduct;
  selected: boolean;
  onToggleSelect: () => void;
  onTogglePublished: () => void;
  onEdit: () => void;
  onUnlock: () => void;
}

const AdminProductCard = ({
  product,
  selected,
  onToggleSelect,
  onTogglePublished,
  onEdit,
  onUnlock,
}: AdminProductCardProps) => {
  const locked = hasEditorLocks(product.editorLockedFields);

  return (
    <div className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
      <div
        className="relative aspect-square overflow-hidden shrink-0 cursor-pointer"
        onClick={onEdit}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div
          className="absolute top-3 left-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelect}
            className="bg-card/90 border-border shadow-sm"
          />
        </div>

        {product.badge && (
          <span className="absolute top-3 left-12 bg-primary text-primary-foreground text-xs font-bold font-body px-3 py-1 rounded-full max-w-[40%] truncate">
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 max-w-[50%]">
          <Badge variant="outline" className={`${stockColor(product.status)} text-xs`}>
            {product.status}
          </Badge>
          <Badge variant="outline" className={`${publishedColor(product.published)} text-xs`}>
            {product.published ? "Published" : "Draft"}
          </Badge>
        </div>

        {locked && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-100/95 text-amber-800 text-xs font-medium font-body px-2 py-1 rounded-full border border-amber-200">
            <Lock className="h-3 w-3" />
            Sync locked
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs text-muted-foreground font-body mb-1 truncate">{product.category}</span>
        <h3
          className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 min-h-[3.5rem] cursor-pointer hover:text-primary transition-colors"
          onClick={onEdit}
        >
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem] flex-1">
          {product.description || "\u00A0"}
        </p>

        <div className="mt-auto pt-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-xl font-bold text-primary shrink-0">
              {product.priceDisplay}
            </span>
            <span className="text-sm text-muted-foreground font-body">{product.stock} in stock</span>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary px-2 h-8"
              onClick={onTogglePublished}
            >
              {product.published ? "Unpublish" : "Publish"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary px-2 h-8"
              onClick={onEdit}
            >
              Edit
            </Button>
            <div className="ml-auto">
              <ProductSyncLockButton
                lockedFields={product.editorLockedFields}
                onUnlock={onUnlock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
