"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  badge?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold font-body px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">{product.name}</h3>
        <p className="font-body text-sm text-muted-foreground mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">{product.price}</span>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
