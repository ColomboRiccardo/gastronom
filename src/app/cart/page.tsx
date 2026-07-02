"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.product.name,
            priceNum: i.product.priceNum,
            quantity: i.quantity,
            image: i.product.image.startsWith("http") ? i.product.image : undefined,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
        setCheckoutLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
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
              {/* Cart items */}
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
                      <p className="font-display text-primary font-bold mt-1">{product.price}</p>
                    </div>

                    {/* Quantity controls */}
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

                    {/* Line total */}
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

              {/* Order summary */}
              <div className="lg:w-80">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between font-body text-sm text-muted-foreground">
                        <span className="truncate mr-2">{product.name} × {quantity}</span>
                        <span className="flex-shrink-0">€{(product.priceNum * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-display text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mt-1">Shipping calculated at checkout</p>
                  </div>
                  {!isAuthenticated && (
                    <div className="flex items-start gap-2 bg-accent/10 border border-accent/30 rounded-md px-3 py-2.5 mb-4">
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
                    disabled={!isAuthenticated || checkoutLoading}
                    onClick={handleCheckout}
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
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
