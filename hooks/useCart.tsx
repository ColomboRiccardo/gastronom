"use client"

import {useContext} from 'react'
import {CartContext} from "@/context/CartContext";

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined || context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const {
        cartOpen,
        setCartOpen,
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartTotal,
        cartCount
    } = context

    return {cartOpen, setCartOpen, cart, setCart, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount}
}
