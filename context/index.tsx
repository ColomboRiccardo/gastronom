"use client"

import {CartProvider} from "./CartContext";
import {FavouritesProvider} from "@/context/FavouritesContext";

export function AppProviders({children}: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <FavouritesProvider>
                {children}
            </FavouritesProvider>
        </CartProvider>
    )
}
