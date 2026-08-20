"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const CartDropdown = () => {
  const { items, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t("cart.title")}
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-body text-sm text-muted-foreground">{t("cart.empty")}</p>
            <Button asChild variant="outline" size="sm" className="mt-4 font-body" onClick={() => setOpen(false)}>
              <Link href="/products">{t("cart.continue_shopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-56 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {quantity} × {product.price}
                    </p>
                  </div>
                  <p className="font-body text-sm font-semibold shrink-0">
                    €{(product.priceNum * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex justify-between font-display font-semibold text-foreground">
                <span>{t("cart.total")}</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>

              {!isAuthenticated && (
                <p className="font-body text-xs text-muted-foreground">
                  <Link href="/login" className="text-primary font-semibold hover:underline" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                  {" "}to complete your purchase.
                </p>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full font-body"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">{t("cart.view_cart")}</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">{t("cart.checkout")}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
