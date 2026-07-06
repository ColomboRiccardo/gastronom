"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Package, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [fulfillState, setFulfillState] = useState<"pending" | "ok" | "error">("pending");

  useEffect(() => {
    if (!sessionId) {
      setFulfillState("error");
      return;
    }

    const fulfillKey = `checkout-fulfill:${sessionId}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(fulfillKey) === "done") {
      clearCart();
      setFulfillState("ok");
      return;
    }

    let cancelled = false;

    const fulfillOrder = async () => {
      try {
        const res = await fetch("/api/checkout/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (cancelled) return;

        if (res.ok) {
          sessionStorage.setItem(fulfillKey, "done");
          clearCart();
          setFulfillState("ok");
        } else {
          console.error("Fulfill failed:", await res.text());
          setFulfillState("error");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fulfill request failed:", error);
          setFulfillState("error");
        }
      }
    };

    void fulfillOrder();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Thank You
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Order Confirmed
          </h1>
        </div>
        <img src="/slavic-border.png" alt="" className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none" />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          {fulfillState === "pending" && (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Finalizing your order...
              </h2>
              <p className="font-body text-muted-foreground">
                Please wait a moment while we save your order.
              </p>
            </>
          )}

          {fulfillState === "ok" && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Payment Successful!
              </h2>
              <p className="font-body text-muted-foreground mb-8">
                Your order has been received and is being prepared. You will receive a confirmation email shortly with your order details.
              </p>
            </>
          )}

          {fulfillState === "error" && (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Payment received
              </h2>
              <p className="font-body text-muted-foreground mb-8">
                Your payment went through, but we could not save the order automatically. Please contact us with your payment confirmation and we will resolve it.
              </p>
            </>
          )}

          {fulfillState !== "pending" && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Link href="/account">
                  <Package className="h-4 w-4" />
                  View Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
