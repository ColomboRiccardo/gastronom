"use client"

import React, {createContext, useState} from 'react';
import {CartContextType, CartProductType, ProductType} from "@/types";

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children}: { children: React.ReactNode }) => {

    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState<CartProductType[]>([]);

    const addToCart = (product: ProductType, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? {
                    ...item,
                    quantity: item.quantity + quantity
                } : item);
            }
            return [...prev, {
                ...product,
                quantity: quantity
            }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => item.id === productId ? {
            ...item,
            quantity: item.quantity + delta
        } : item).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartOpen,
            setCartOpen,
            cart,
            setCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    )
}