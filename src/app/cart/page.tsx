"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  AlertTriangle,
  Snowflake,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { startCheckout } from "@/lib/checkout";
import { SHIPPING_RATES, SHOP, type ShippingMethodKind } from "@/lib/shipping/config";
import { listLocalCities, previewCourierCost, resolveShipping } from "@/lib/shipping/resolve";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [method, setMethod] = useState<ShippingMethodKind | "">("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const localCities = useMemo(() => listLocalCities(), []);
  const hasFrozenItems = items.some((item) => item.product.isFrozen);

  const shippingPreview = useMemo(() => {
    if (!method) return null;
    if (method === "courier" && hasFrozenItems) {
      return { ok: false as const, error: "Frozen products cannot be shipped by courier." };
    }
    return resolveShipping(
      {
        method,
        city: method === "local" ? city : undefined,
        postalCode: method === "courier" ? postalCode : undefined,
      },
      { hasFrozenItems },
    );
  }, [method, city, postalCode, hasFrozenItems]);

  const shippingCost =
    shippingPreview?.ok === true ? shippingPreview.shipping.cost : 0;
  const grandTotal = totalPrice + (shippingPreview?.ok === true ? shippingCost : 0);
  const shippingReady = shippingPreview?.ok === true;

  const courierHint = useMemo(() => {
    if (method !== "courier" || postalCode.replace(/\D/g, "").length !== 5) return null;
    return previewCourierCost(postalCode);
  }, [method, postalCode]);

  const handleCheckout = async () => {
    if (!method || !shippingReady || shippingPreview?.ok !== true) {
      toast.error(shippingPreview && !shippingPreview.ok ? shippingPreview.error : "Select shipping");
      return;
    }

    setCheckoutLoading(true);
    const result = await startCheckout(items, {
      method,
      city: method === "local" ? city : undefined,
      postalCode: method === "courier" ? postalCode : undefined,
    });
    if (!result.ok) {
      toast.error(result.error);
      setCheckoutLoading(false);
    }
  };

  const selectMethod = (next: ShippingMethodKind) => {
    if (next === "courier" && hasFrozenItems) return;
    setMethod(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Your Selection
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Shopping Cart
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Review your chosen delicacies before checkout.
          </p>
        </div>
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
              <p className="font-display text-2xl text-muted-foreground mb-2">Your cart is empty</p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Browse our selection and add some authentic Eastern European delicacies.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-semibold text-foreground truncate">
                        {product.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">{product.category}</p>
                      {product.isFrozen && (
                        <p className="font-body text-xs text-sky-700 flex items-center gap-1 mt-1">
                          <Snowflake className="h-3 w-3" />
                          Frozen — pickup or local delivery only
                        </p>
                      )}
                      <p className="font-display text-primary font-bold mt-1">{product.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-body text-sm w-8 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="font-display text-lg font-bold text-foreground w-20 text-right hidden sm:block">
                      €{(product.priceNum * quantity).toFixed(2)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/80 h-8 w-8"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/products">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lg:w-96">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-5">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between font-body text-sm text-muted-foreground">
                        <span className="truncate mr-2">{product.name} × {quantity}</span>
                        <span className="flex-shrink-0">€{(product.priceNum * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Shipping
                    </p>

                    {hasFrozenItems && (
                      <div className="flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                        <Snowflake className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>
                          Your cart includes frozen items. National courier is unavailable —
                          choose pickup or local delivery.
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {(
                        [
                          {
                            id: "pickup" as const,
                            label: "Ritiro in negozio",
                            hint: `Free · ${SHOP.address}`,
                            price: SHIPPING_RATES.pickup,
                            disabled: false,
                          },
                          {
                            id: "local" as const,
                            label: "Consegna locale",
                            hint: "Selected cities near the shop",
                            price: SHIPPING_RATES.local,
                            disabled: false,
                          },
                          {
                            id: "courier" as const,
                            label: "Spedizione Italia",
                            hint: hasFrozenItems
                              ? "Not available with frozen items"
                              : `From €${SHIPPING_RATES.courierNorth.toFixed(2)} by CAP zone`,
                            price: null,
                            disabled: hasFrozenItems,
                          },
                        ] as const
                      ).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          disabled={option.disabled}
                          onClick={() => selectMethod(option.id)}
                          className={cn(
                            "w-full text-left rounded-md border px-3 py-2.5 transition-colors",
                            option.disabled && "opacity-50 cursor-not-allowed",
                            method === option.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/40",
                          )}
                        >
                          <div className="flex justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">{option.label}</span>
                            <span className="text-sm font-semibold text-foreground shrink-0">
                              {option.price === null
                                ? "—"
                                : option.price === 0
                                  ? "Free"
                                  : `€${option.price.toFixed(2)}`}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.hint}</p>
                        </button>
                      ))}
                    </div>

                    {method === "local" && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Delivery city
                        </label>
                        <Select value={city} onValueChange={setCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city..." />
                          </SelectTrigger>
                          <SelectContent>
                            {localCities.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {method === "courier" && !hasFrozenItems && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          CAP (postal code)
                        </label>
                        <Input
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="e.g. 17025"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        />
                        {courierHint?.ok && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {courierHint.displayName}: €{courierHint.cost.toFixed(2)}
                          </p>
                        )}
                        {courierHint && !courierHint.ok && postalCode.length === 5 && (
                          <p className="text-xs text-destructive mt-1.5">{courierHint.error}</p>
                        )}
                      </div>
                    )}

                    {shippingPreview && !shippingPreview.ok && method && (
                      <p className="text-xs text-destructive">{shippingPreview.error}</p>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between font-body text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>
                        {shippingReady
                          ? shippingCost === 0
                            ? "Free"
                            : `€${shippingCost.toFixed(2)}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between font-display text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>€{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="flex items-start gap-2 bg-accent/10 border border-accent/30 rounded-md px-3 py-2.5">
                      <AlertTriangle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Sign in required</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          You need to{" "}
                          <Link href="/login" className="text-primary font-semibold hover:underline">sign in</Link>
                          {" "}or{" "}
                          <Link href="/signup" className="text-primary font-semibold hover:underline">create an account</Link>
                          {" "}to complete your purchase.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-medium"
                    disabled={!isAuthenticated || checkoutLoading || !shippingReady}
                    onClick={handleCheckout}
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
