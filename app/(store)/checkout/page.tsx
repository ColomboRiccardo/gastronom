"use client"

import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, ChevronRight, Info, Minus, Package, Plus, ShoppingCart, Tag, Trash2, Truck} from 'lucide-react';
import React, {useState} from 'react'
import {useCart} from "@/hooks";
import HorizontalAnimatedDiv from "@/animations/HorizontalAnimatedDiv";

const CheckoutPage = () => {
    const {cart, cartTotal, addToCart, removeFromCart, updateQuantity} = useCart()
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    // Calculate totals
    const SHIPPING_THRESHOLD = 50
    const shippingCost = cartTotal >= SHIPPING_THRESHOLD ? 0 : 8.99;
    const tax = 22;
    const discount = promoApplied ? cartTotal * 0.1 : 0;
    const total = cartTotal + shippingCost + tax - discount;
    const remainingForFreeShipping = Math.max(0, SHIPPING_THRESHOLD - cartTotal);
    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === 'SAVE10') {
            setPromoApplied(true);
        }
    };

    // Empty cart state
    if (cart.length === 0) {
        return <div className="min-h-screen bg-background">
            {/* Empty Cart Content */}
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    duration: 0.5
                }}>
                    <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground"/>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Your Cart is Empty</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Looks like you haven&apos;t added any gourmet delights yet. Explore our collection and discover
                        something special.
                    </p>
                    <motion.button whileHover={{
                        scale: 1.05
                    }} whileTap={{
                        scale: 0.95
                    }}
                                   className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5"/>
                        Continue Shopping
                    </motion.button>
                </motion.div>
            </div>
        </div>;
    }

    // @return
    return <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
                    <ChevronRight className="w-4 h-4 text-muted-foreground"/>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Shop</a>
                    <ChevronRight className="w-4 h-4 text-muted-foreground"/>
                    <span className="text-foreground font-medium">Shopping Cart</span>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div initial={{
                opacity: 0,
                y: 20
            }} animate={{
                opacity: 1,
                y: 0
            }} className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Shopping Cart</h1>
                <p className="text-muted-foreground">Review your items and proceed to checkout</p>
            </motion.div>

            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && <motion.div initial={{
                opacity: 0,
                y: 20
            }} animate={{
                opacity: 1,
                y: 0
            }} transition={{
                delay: 0.1
            }} className="bg-accent border border-border rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-5 h-5 text-primary"/>
                    <p className="text-sm font-medium text-foreground">
                        You&apos;re <span
                        className="text-primary font-bold">${remainingForFreeShipping.toFixed(2)}</span> away from free
                        shipping!
                    </p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{
                        width: 0
                    }} animate={{
                        width: `22%`
                    }} transition={{
                        duration: 0.5,
                        delay: 0.2
                    }} className="h-full bg-primary rounded-full"/>
                </div>
            </motion.div>}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {cart.map((item: any, index: any) => <motion.div key={item.id} layout initial={{
                            opacity: 0,
                            x: -20
                        }} animate={{
                            opacity: 1,
                            x: 0
                        }} exit={{
                            opacity: 0,
                            x: 20,
                            height: 0
                        }} transition={{
                            delay: index * 0.05
                        }}
                                                                         className="bg-card rounded-xl shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row gap-4 p-4">
                                {/* Product Image */}
                                <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h3 className="font-semibold text-foreground text-lg mb-1">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                        </div>
                                        <motion.button whileHover={{
                                            scale: 1.1
                                        }} whileTap={{
                                            scale: 0.9
                                        }} onClick={() => removeFromCart(item)}
                                                       className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group">
                                            <Trash2
                                                className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors"/>
                                        </motion.button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                                            <motion.button whileHover={{
                                                scale: 1.1
                                            }} whileTap={{
                                                scale: 0.9
                                            }} onClick={() => updateQuantity(item.id, -1)}
                                                           className="p-2 hover:bg-background rounded transition-colors">
                                                <Minus className="w-4 h-4"/>
                                            </motion.button>
                                            <span
                                                className="text-lg font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                                            <motion.button whileHover={{
                                                scale: 1.1
                                            }} whileTap={{
                                                scale: 0.9
                                            }} onClick={() => updateQuantity(item.id, 1)}
                                                           className="p-2 hover:bg-background rounded transition-colors">
                                                <Plus className="w-4 h-4"/>
                                            </motion.button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground mb-1">
                                                ${item.price.toFixed(2)} each
                                            </div>
                                            <div className="text-xl font-bold text-primary">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>)}
                    </AnimatePresence>

                    {/* Continue Shopping Button */}
                    <motion.button initial={{
                        opacity: 0
                    }} animate={{
                        opacity: 1
                    }} transition={{
                        delay: 0.3
                    }} whileHover={{
                        scale: 1.02
                    }} whileTap={{
                        scale: 0.98
                    }}
                                   className="w-full sm:w-auto px-6 py-3 border-2 border-border rounded-lg font-semibold hover:border-primary hover:bg-primary/5 transition-all inline-flex items-center justify-center gap-2">
                        <ArrowLeft className="w-5 h-5"/>
                        Continue Shopping
                    </motion.button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} transition={{
                        delay: 0.2
                    }} className="bg-card rounded-xl shadow-md border border-border p-6 sticky top-24">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Order Summary</h2>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-foreground mb-2 block">Promo Code</label>
                            <div className="flex gap-2">
                                <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                                       placeholder="Enter code" disabled={promoApplied}
                                       className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"/>
                                <motion.button whileHover={{
                                    scale: 1.05
                                }} whileTap={{
                                    scale: 0.95
                                }} onClick={applyPromoCode} disabled={promoApplied}
                                               className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    Apply
                                </motion.button>
                            </div>
                            {promoApplied && <motion.p initial={{
                                opacity: 0,
                                y: -10
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                                <Tag className="w-4 h-4"/>
                                Promo code applied! 10% discount
                            </motion.p>}
                        </div>

                        {/* Summary Details */}
                        <div className="space-y-3 mb-6 pb-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Shipping</span>
                                    {shippingCost === 0 && <span
                                        className="text-xs text-green-600 dark:text-green-400 font-medium">(FREE)</span>}
                                </div>
                                <span className="font-semibold text-foreground">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Tax</span>
                                    <div className="group relative">
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help"/>
                                        <div
                                            className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-foreground text-background text-xs rounded-lg shadow-lg">
                                            Estimated tax at 22
                                        </div>
                                    </div>
                                </div>
                                <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                            </div>
                            {promoApplied && <motion.div initial={{
                                opacity: 0,
                                y: -10
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} className="flex items-center justify-between text-green-600 dark:text-green-400">
                                <span>Discount</span>
                                <span className="font-semibold">-${discount.toFixed(2)}</span>
                            </motion.div>}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                            <span className="text-xl font-serif font-bold text-foreground">Total</span>
                            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>

                        {/* Checkout Button */}
                        <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}
                                       className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all mb-4">
                            Proceed to Checkout
                        </motion.button>

                        {/* Features */}
                        <div className="space-y-3">
                            {[{
                                icon: Package,
                                text: 'Free Returns within 30 days'
                            }, {
                                icon: Truck,
                                text: '2-3 Day Express Delivery'
                            }, {
                                icon: Tag,
                                text: 'Best Price Guarantee'
                            }].map((feature, index) => <HorizontalAnimatedDiv key={index} delay={0.3}
                                                                              className="flex items-center gap-3 text-sm text-muted-foreground">
                                <feature.icon className="w-4 h-4 text-primary"/>
                                <span>{feature.text}</span>
                            </HorizontalAnimatedDiv>)}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-foreground text-background py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                                <span className="text-foreground font-serif text-lg font-bold">G</span>
                            </div>
                            <span className="text-xl font-serif font-bold">Gastronom</span>
                        </div>
                        <p className="text-background/80 text-sm">
                            Premium gourmet foods for discerning tastes since 2024
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">All
                                Products</a></li>
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">New
                                Arrivals</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Bestsellers</a>
                            </li>
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">Gift
                                Sets</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">Contact
                                Us</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">FAQ</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Shipping</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Returns</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">About
                                Us</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Careers</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Privacy</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
                    <p>© 2024 Gastronom. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>;
};
export default CheckoutPage
