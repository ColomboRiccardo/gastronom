"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Snowflake } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { resolveCategoryName, resolveProductCopy } from "@/lib/products/resolve-copy";
import { type UiProduct } from "@/lib/products/types";

interface ProductDetailClientProps {
  product: UiProduct;
  related: UiProduct[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { t, language } = useLanguage();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const copy = resolveProductCopy(product, product.translations, language);
  const categoryLabel = resolveCategoryName(
    { name: product.category },
    product.categoryTranslations,
    language,
  );
  const displayProduct = {
    ...product,
    name: copy.name,
    description: copy.description,
    category: categoryLabel,
  };
  const wishlisted = isInWishlist(product.id);

  const categoryHref = product.categorySlug
    ? `/products?category=${encodeURIComponent(product.categorySlug)}`
    : "/products";

  const handleWishlist = () => {
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-4">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  {t("nav.home")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-primary">
                  {t("nav.products")}
                </Link>
              </li>
              {categoryLabel && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={categoryHref} className="hover:text-primary">
                      {categoryLabel}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">
                {copy.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={product.image}
                alt={copy.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-body text-xs font-bold text-primary-foreground">
                  {product.badge}
                </span>
              )}
              <button
                type="button"
                onClick={handleWishlist}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-card"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    wishlisted ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="mb-2 font-body text-sm uppercase tracking-[0.2em] text-accent">
                {categoryLabel}
              </p>
              <h1 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                {copy.name}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="font-display text-3xl font-bold text-primary">{product.price}</span>
                <span
                  className={`rounded px-2 py-0.5 font-body text-xs font-medium ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.inStock ? t("product.in_stock") : t("product.out_of_stock")}
                </span>
                {product.isFrozen && (
                  <span className="inline-flex items-center gap-1 rounded bg-sky-100 px-2 py-0.5 font-body text-xs font-medium text-sky-800">
                    <Snowflake className="h-3 w-3" />
                    {t("product.frozen_label")}
                  </span>
                )}
              </div>

              {copy.description ? (
                <p className="mb-8 whitespace-pre-wrap font-body leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              ) : (
                <p className="mb-8 font-body leading-relaxed text-muted-foreground">
                  {t("product.no_description")}
                </p>
              )}

              <div className="max-w-sm">
                <CartQuantityControl product={displayProduct} size="md" className="w-full" />
              </div>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("product.back_to_shop")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30 py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
              {t("product.related_title")}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
