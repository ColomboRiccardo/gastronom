"use client"

import React from 'react'
import {AnimatePresence, motion} from "framer-motion";
import {ChevronRight, ShoppingCart, X} from "lucide-react";
import {useCart} from "@/hooks";
import {CartProductType} from "@/types";
import CartProduct from "@/components/CartProduct";

const CartSidebar = () => {
    const {
        cartOpen,
        setCartOpen,
        cartCount,
        cart,
        cartTotal,
        removeFromCart,
        updateQuantity,
        setCart,
        addToCart
    } = useCart()

    return (<AnimatePresence>
        {cartOpen && <>
            <motion.div initial={{
                opacity: 0
            }} animate={{
                opacity: 1
            }} exit={{
                opacity: 0
            }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"/>
            <motion.div initial={{
                x: '100%'
            }} animate={{
                x: 0
            }} exit={{
                x: '100%'
            }} transition={{
                type: 'spring',
                damping: 25
            }} className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto">
                <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-red-900">
                        Shopping Cart ({cartCount})
                    </h3>
                    <button onClick={() => setCartOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close cart">
                        <X className="w-6 h-6 text-gray-600"/>
                    </button>
                </div>

                <div className="p-6">
                    {cart.length === 0 ? <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500">Your cart is empty</p>
                    </div> : <>
                        <div className="space-y-4 mb-6">
                            {cart.map((item: CartProductType) => <CartProduct item={item} key={item.id}/>)}
                        </div>

                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-red-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                className="w-full px-6 py-4 bg-red-800 text-white rounded font-medium hover:bg-red-900 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                                Proceed to Checkout
                                <ChevronRight className="w-5 h-5"/>
                            </button>
                            <button onClick={() => setCartOpen(false)}
                                    className="w-full px-6 py-3 border-2 border-amber-500 text-amber-600 rounded font-medium hover:bg-amber-500 hover:text-white transition-colors">
                                Continue Shopping
                            </button>
                        </div>
                    </>}
                </div>
            </motion.div>
        </>}
    </AnimatePresence>)
}
export default CartSidebar