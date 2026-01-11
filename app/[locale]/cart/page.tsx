"use client";

import * as React from 'react';
import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    AlertCircle,
    ChevronRight,
    Heart,
    Info,
    Minus,
    Package,
    Plus,
    ShoppingCart,
    Tag,
    Trash2,
    TruckIcon
} from 'lucide-react';
import {ProductType} from "@/types";

export type CartItem = {
    product: ProductType;
    quantity: number;
};

const defaultRecommendedProducts: ProductType[] = [{
    id: 'r1',
    name: 'Sevruga Caviar',
    price: 150,
    category: 'caviar',
    images: ['https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800'],
    description: '30g Premium Selection',
    badges: ['NEW'],
    originalPrice: 0,
    discount: 0,
    weightInGrams: 0,
    rating: 0,
    reviews: 0,
    inStock: false,
    longDescription: '',
    stockCount: 0,
    features: [],
    specifications: []
}, {
    id: 'r2',
    name: 'Crystal Vodka',
    price: 65,
    category: 'vodka',
    images: ['https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800'],
    description: '500ml Premium Crystal',
    badges: ['NEW'],
    originalPrice: 0,
    discount: 0,
    weightInGrams: 0,
    rating: 0,
    reviews: 0,
    inStock: false,
    longDescription: '',
    stockCount: 0,
    features: [],
    specifications: []
}, {
    id: 'r3',
    name: 'Pickled Mushrooms',
    price: 22,
    category: 'pickles',
    images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
    description: '400g Forest Selection',
    badges: ['ORGANIC'],
    originalPrice: 0,
    discount: 0,
    weightInGrams: 0,
    rating: 0,
    reviews: 0,
    inStock: false,
    longDescription: '',
    stockCount: 0,
    features: [],
    specifications: []
}];
export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [recommendedProducts] = useState<ProductType[]>(defaultRecommendedProducts);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    const [promoError, setPromoError] = useState('');

    // Calculate cart totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Handlers
    const onContinueShopping = () => {
        window.history.back();
    };

    const onCheckout = (items: CartItem[], total: number) => {
        console.log('Proceeding to checkout with items:', items, 'Total:', total);
    };

    const onUpdateQuantity = (productId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId
                    ? {...item, quantity: Math.max(1, quantity)}
                    : item
            )
        );
    };

    const onRemoveItem = (productId: string) => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.product.id !== productId)
        );
    };
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const shippingEstimate = subtotal > 200 ? 0 : 15;
    const taxEstimate = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shippingEstimate + taxEstimate;
    const handleQuantityChange = (productId: string, delta: number) => {
        setCartItems(prev => {
            const updated = prev.map(item => item.product.id === productId ? {
                ...item,
                quantity: Math.max(1, item.quantity + delta)
            } : item);
            const newItem = updated.find(item => item.product.id === productId);
            if (newItem && onUpdateQuantity) {
                onUpdateQuantity(productId, newItem.quantity);
            }
            return updated;
        });
    };
    const handleRemoveItem = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
        if (onRemoveItem) {
            onRemoveItem(productId);
        }
    };
    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === 'gastronom10') {
            setPromoApplied(true);
            setPromoError('');
        } else {
            setPromoError('Invalid promo code');
            setPromoApplied(false);
        }
    };
    const handleAddRecommended = (product: ProductType) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? {
                    ...item,
                    quantity: item.quantity + 1
                } : item);
            }
            return [...prev, {
                product,
                quantity: 1
            }];
        });
    };
    const handleCheckout = () => {
        if (onCheckout) {
            onCheckout(cartItems, total);
        }
    };
    const isEmpty = cartItems.length === 0;
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {isEmpty ? (/* Empty Cart State */
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} className="max-w-md mx-auto text-center py-16">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-red-800"/>
                    </div>
                    <h2 className="text-3xl font-serif text-red-900 mb-3">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Discover our curated selection of premium Russian delicacies
                    </p>
                    <button onClick={onContinueShopping}
                            className="px-8 py-3.5 bg-red-800 text-white rounded font-medium hover:bg-red-900 transition-colors shadow-md hover:shadow-lg">
                        Start Shopping
                    </button>
                </motion.div>) : <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Cart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl sm:text-4xl font-serif text-red-900">
                            Shopping Cart
                        </h2>
                        <p className="text-gray-600">
                            <span className="font-semibold text-red-900">{cartItems.length}</span> items
                        </p>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item, index) => <motion.div key={item.product.id} initial={{
                                opacity: 0,
                                y: 20
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} exit={{
                                opacity: 0,
                                x: -100
                            }} transition={{
                                delay: index * 0.05
                            }}
                                                                        className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    {/* Product Image */}
                                    <div
                                        className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 group">
                                        <img src={item.product.images[0]} alt={item.product.name}
                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        {item.product.badges[0] && <div
                                            className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                            {item.product.badges[0]}
                                        </div>}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {item.product.description}
                                                </p>
                                                <div className="flex items-center gap-3 text-sm">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Package className="w-4 h-4"/>
                                    {item.product.weightInGrams}
                                </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-amber-600 font-medium capitalize">
                                  {item.product.category}
                                </span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.product.id)}
                                                    className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                                    aria-label="Remove item">
                                                <Trash2
                                                    className="w-5 h-5 text-gray-400 group-hover:text-red-800 transition-colors"/>
                                            </button>
                                        </div>

                                        {/* Price and Quantity Controls */}
                                        <div
                                            className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                <button onClick={() => handleQuantityChange(item.product.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label="Decrease quantity">
                                                    <Minus className="w-4 h-4 text-gray-600"/>
                                                </button>
                                                <span className="text-base font-semibold px-3 min-w-[3ch] text-center">
                                {item.quantity}
                              </span>
                                                <button onClick={() => handleQuantityChange(item.product.id, 1)}
                                                        className="p-2 hover:bg-white rounded transition-colors"
                                                        aria-label="Increase quantity">
                                                    <Plus className="w-4 h-4 text-gray-600"/>
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-red-900">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ${item.product.price} each
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>)}
                        </AnimatePresence>
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <label htmlFor="order-notes"
                               className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                            <Info className="w-4 h-4 text-amber-600"/>
                            Order Notes (Optional)
                        </label>
                        <textarea id="order-notes" value={orderNotes} onChange={e => setOrderNotes(e.target.value)}
                                  placeholder="Special delivery instructions, gift message, or other notes..."
                                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent resize-none transition-shadow"
                                  rows={4}/>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-xl font-serif text-red-900 mb-6">
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                {promoApplied && <motion.div initial={{
                                    opacity: 0,
                                    height: 0
                                }} animate={{
                                    opacity: 1,
                                    height: 'auto'
                                }} className="flex items-center justify-between text-green-700">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4"/>
                          Discount (10%)
                        </span>
                                    <span className="font-medium">-${discount.toFixed(2)}</span>
                                </motion.div>}

                                <div className="flex items-center justify-between text-gray-700">
                      <span className="flex items-center gap-1">
                        <TruckIcon className="w-4 h-4"/>
                        Shipping
                      </span>
                                    <span className="font-medium">
                        {shippingEstimate === 0 ?
                            <span className="text-green-600">FREE</span> : `$${shippingEstimate.toFixed(2)}`}
                      </span>
                                </div>

                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Tax (8%)</span>
                                    <span className="font-medium">${taxEstimate.toFixed(2)}</span>
                                </div>

                                {subtotal < 200 && <div
                                    className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                                    <span>Add ${(200 - subtotal).toFixed(2)} more for free shipping</span>
                                </div>}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-red-900 text-2xl">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handleCheckout}
                                    className="w-full px-6 py-4 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                                Proceed to Checkout
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                            </button>

                            <button onClick={onContinueShopping}
                                    className="w-full mt-3 px-6 py-3 border-2 border-amber-500 text-amber-700 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-colors">
                                Continue Shopping
                            </button>
                        </div>

                        {/* Promo Code Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                                <Tag className="w-4 h-4 text-amber-600"/>
                                Promo Code
                            </h4>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input type="text" value={promoCode} onChange={e => {
                                        setPromoCode(e.target.value);
                                        setPromoError('');
                                    }} placeholder="Enter code" disabled={promoApplied}
                                           className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"/>
                                    {!promoApplied ? <button onClick={handleApplyPromo}
                                                             className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm whitespace-nowrap">
                                        Apply
                                    </button> : <button onClick={() => {
                                        setPromoApplied(false);
                                        setPromoCode('');
                                    }}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                                        Remove
                                    </button>}
                                </div>
                                {promoError && <motion.p initial={{
                                    opacity: 0,
                                    y: -10
                                }} animate={{
                                    opacity: 1,
                                    y: 0
                                }} className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3"/>
                                    {promoError}
                                </motion.p>}
                                {promoApplied && <motion.p initial={{
                                    opacity: 0,
                                    y: -10
                                }} animate={{
                                    opacity: 1,
                                    y: 0
                                }} className="text-xs text-green-600 font-medium">
                                    ✓ Promo code applied successfully!
                                </motion.p>}
                                <p className="text-xs text-gray-500">
                                    Try: <span className="font-mono text-amber-600">GASTRONOM10</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {/* Recommended Products Section */}
            {!isEmpty && recommendedProducts.length > 0 && <motion.section initial={{
                opacity: 0,
                y: 20
            }} whileInView={{
                opacity: 1,
                y: 0
            }} viewport={{
                once: true
            }} className="mt-16 pt-12 border-t border-gray-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-3xl font-serif text-red-900 mb-2">
                            You May Also Like
                        </h3>
                        <p className="text-gray-600">
                            Complete your order with these premium selections
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedProducts.map((product, index) => <motion.div key={product.id} initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        delay: index * 0.1
                    }}
                                                                             className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="relative aspect-square overflow-hidden">
                            <img src={product.images[0]} alt={product.name}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            {product.badges[0] && <div
                                className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                {product.badges[0]}
                            </div>}
                            <button
                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Add to favorites">
                                <Heart className="w-4 h-4 text-gray-600"/>
                            </button>
                        </div>

                        <div className="p-5">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-900">
                        ${product.price}
                      </span>
                                <button onClick={() => handleAddRecommended(product)}
                                        className="p-2.5 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors shadow-md hover:shadow-lg"
                                        aria-label="Add to cart">
                                    <Plus className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </motion.div>)}
                </div>
            </motion.section>}
        </div>
    </div>;
}