"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductModal from "@/components/ProductModal";
import { toast } from "sonner";

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
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast("Sign in required", {
        description: "Please sign in to add items to your wishlist.",
        action: { label: "Sign In", onClick: () => router.push("/login") },
      });
      return;
    }
    toggleItem(product);
  };

  return (
    <>
      <div
        className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden shrink-0">
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
          <span className="absolute top-3 right-3 max-w-[45%] truncate bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-1 rounded">
            {product.category}
          </span>
          {/* Wishlist heart */}
          <button
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm"
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
            />
          </button>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem] flex-1">
            {product.description || "\u00A0"}
          </p>
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <span className="font-display text-xl font-bold text-primary shrink-0">{product.price}</span>
            <CartQuantityControl product={product} size="sm" />
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="customer"
      />
    </>
  );
};

export default ProductCard;
