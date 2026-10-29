"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { type AppUser } from "@/lib/auth/types";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider, type Language } from "@/context/LanguageContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  children,
  initialUser,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialUser: AppUser | null;
  initialLanguage: Language;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider initialLanguage={initialLanguage}>
          <CookieConsentProvider>
            <AuthProvider initialUser={initialUser}>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <CookieConsentBanner />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </CookieConsentProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
