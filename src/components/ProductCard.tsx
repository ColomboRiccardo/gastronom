"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ProductModal from "@/components/ProductModal";
import { toast } from "sonner";
import {
  resolveProductCopy,
  type ProductTranslationRow,
} from "@/lib/products/resolve-copy";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  badge?: string;
  /** Cold-chain; blocks national courier shipping. */
  isFrozen?: boolean;
  /** All known locales; client re-resolves when the UI language changes. */
  translations?: ProductTranslationRow[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const copy = resolveProductCopy(product, product.translations, language);
  const displayProduct: Product = {
    ...product,
    name: copy.name,
    description: copy.description,
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast(t("product.wishlist_signin_title"), {
        description: t("product.wishlist_signin_desc"),
        action: {
          label: t("product.wishlist_signin_action"),
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    toggleItem(displayProduct);
  };

  return (
    <>
      <div
        className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden shrink-0">
          <img
            src={displayProduct.image}
            alt={displayProduct.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {displayProduct.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold font-body px-3 py-1 rounded-full">
              {displayProduct.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 max-w-[45%] truncate bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-1 rounded">
            {displayProduct.category}
          </span>
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
            {displayProduct.name}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem] flex-1">
            {displayProduct.description || "\u00A0"}
          </p>
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <span className="font-display text-xl font-bold text-primary shrink-0">
              {displayProduct.price}
            </span>
            <CartQuantityControl product={displayProduct} size="sm" />
          </div>
        </div>
      </div>

      <ProductModal
        product={displayProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="customer"
      />
    </>
  );
};

export default ProductCard;
