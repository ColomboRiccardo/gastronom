"use client";

import Link from "next/link";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutCancelPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("checkout.cancel_title")}
          </h1>
        </div>
        <img src="/slavic-border.png" alt="" className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none" />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            {t("checkout.cancel_title")}
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            {t("checkout.cancel_body")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {t("checkout.back_cart")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                {t("checkout.continue_shopping")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
