"use client"

import {CartProvider} from "./CartContext";

export function AppProviders({children}: { children: any }) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    )
}
