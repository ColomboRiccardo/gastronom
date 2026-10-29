"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Eye } from "lucide-react";
import Link from "@/components/LocalizedLink";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ProductModal from "@/components/ProductModal";
import { toast } from "sonner";
import {
  resolveCategoryName,
  resolveProductCopy,
  type CategoryTranslationRow,
  type ProductTranslationRow,
} from "@/lib/products/resolve-copy";
import { type ProductTagRef } from "@/lib/products/types";
import { shouldOptimizeImage } from "@/lib/images";

export interface Product {
  id: number;
  /** URL segment for /products/[slug]; absent on legacy cart snapshots. */
  slug?: string;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  categoryId?: number | null;
  categoryTranslations?: CategoryTranslationRow[];
  badge?: string;
  /** Cold-chain; blocks national courier shipping. */
  isFrozen?: boolean;
  /** All known locales; client re-resolves when the UI language changes. */
  translations?: ProductTranslationRow[];
  /** Admin-curated collections this product belongs to (published only on public paths). */
  tags?: ProductTagRef[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const copy = resolveProductCopy(product, product.translations, language);
  const categoryLabel = resolveCategoryName(
    { name: product.category },
    product.categoryTranslations,
    language,
  );
  const displayProduct: Product = {
    ...product,
    name: copy.name,
    description: copy.description,
    category: categoryLabel,
  };

  // Real link for crawlers and new-tab clicks; the modal stays as a quick view.
  const productHref = product.slug ? `/products/${encodeURIComponent(product.slug)}` : null;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const image = (
    <>
      <Image
        src={displayProduct.image}
        alt={displayProduct.name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized={!shouldOptimizeImage(displayProduct.image)}
      />
      {displayProduct.badge && (
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold font-body px-3 py-1 rounded-full">
          {displayProduct.badge}
        </span>
      )}
      <span className="absolute top-3 right-3 max-w-[45%] truncate bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-1 rounded">
        {displayProduct.category}
      </span>
    </>
  );

  return (
    <>
      <div className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden shrink-0">
          {productHref ? (
            <Link href={productHref} className="absolute inset-0 block" aria-label={displayProduct.name}>
              {image}
            </Link>
          ) : (
            <button type="button" className="absolute inset-0 block text-left" onClick={handleQuickView}>
              {image}
            </button>
          )}
          <button
            type="button"
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm"
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
            />
          </button>
          <button
            type="button"
            className="absolute bottom-3 left-3 h-8 px-2.5 rounded-full bg-card/80 backdrop-blur-sm flex items-center gap-1.5 hover:bg-card transition-colors shadow-sm font-body text-xs text-foreground/80"
            onClick={handleQuickView}
            aria-label={t("product.quick_view")}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("product.quick_view")}</span>
          </button>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 min-h-[3.5rem]">
            {productHref ? (
              <Link href={productHref} className="hover:text-primary transition-colors">
                {displayProduct.name}
              </Link>
            ) : (
              <button type="button" className="text-left hover:text-primary transition-colors" onClick={handleQuickView}>
                {displayProduct.name}
              </button>
            )}
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
