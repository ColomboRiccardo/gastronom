"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Trash2 } from "lucide-react";

const WishlistTab = () => {
  const { items, removeItem, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-16 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-display text-xl font-semibold text-foreground mb-2">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground">Browse products and tap the heart icon to save items here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Wishlist
            <span className="text-sm font-body font-normal text-muted-foreground ml-2">({items.length} items)</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1.5" onClick={clearWishlist}>
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <div key={product.id} className="border border-border rounded-lg overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-0.5 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-primary">{product.price}</span>
                </div>
                <div className="flex gap-2">
                  <CartQuantityControl product={product} size="sm" className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistTab;
