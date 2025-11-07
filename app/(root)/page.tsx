"use client";

import * as React from 'react';
import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingCart, Trash2, User, X} from 'lucide-react';

type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    badge?: string;
    weight: string;
};
type CartItem = {
    product: Product;
    quantity: number;
};
type GastronomShopProps = Record<string, never>;
const products: Product[] = [{
    id: '1',
    name: 'Beluga Caviar',
    price: 280,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
    description: '50g Imperial Selection',
    badge: 'PREMIUM',
    weight: '50g'
}, {
    id: '2',
    name: 'Imperial Vodka',
    price: 85,
    category: 'vodka',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    description: '750ml Premium Reserve',
    weight: '750ml'
}, {
    id: '3',
    name: 'Osetra Caviar',
    price: 180,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
    description: '30g Classic Selection',
    weight: '30g'
}, {
    id: '4',
    name: 'Dill Pickles',
    price: 18,
    category: 'pickles',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
    description: '500g Traditional Recipe',
    badge: 'ORGANIC',
    weight: '500g'
}];
const collections = [{
    id: 'caviar',
    name: 'Caviar',
    price: 'From $180',
    image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
    bgColor: 'from-slate-800 to-slate-900'
}, {
    id: 'vodka',
    name: 'Vodka',
    price: 'From $45',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    bgColor: 'from-red-900 to-red-950'
}, {
    id: 'pickles',
    name: 'Pickles',
    price: 'From $12',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
    bgColor: 'from-red-800 to-red-900'
}];
export default function GastronomShop(_props: GastronomShopProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };
    const addToCart = (product: Product) => {
        setCart(prev => {
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
    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => item.product.id === productId ? {
                ...item,
                quantity: item.quantity + delta
            } : item).filter(item => item.quantity > 0);
        });
    };
    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };
    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-3xl font-serif tracking-wider text-red-900">
                            GASTRONOM
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#shop" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            Shop
                        </a>
                        <a href="#collections"
                           className="text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium">
                            Collections
                        </a>
                        <a href="#about" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            About
                        </a>
                        <a href="#contact" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            Contact
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors" aria-label="Search">
                            <Search className="w-5 h-5 text-gray-700"/>
                        </button>
                        <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors hidden sm:block"
                                aria-label="Account">
                            <User className="w-5 h-5 text-gray-700"/>
                        </button>
                        <button onClick={() => setCartOpen(true)}
                                className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                                aria-label="Shopping cart">
                            <ShoppingCart className="w-5 h-5 text-gray-700"/>
                            {cartCount > 0 && <span
                                className="absolute -top-0.5 -right-0.5 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>}
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                                aria-label="Menu">
                            <Menu className="w-5 h-5 text-gray-700"/>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && <motion.nav initial={{
                        height: 0,
                        opacity: 0
                    }} animate={{
                        height: 'auto',
                        opacity: 1
                    }} exit={{
                        height: 0,
                        opacity: 0
                    }} className="md:hidden border-t border-gray-100 overflow-hidden">
                        <div className="py-4 space-y-1">
                            <a href="#shop" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                Shop
                            </a>
                            <a href="#collections" className="block px-4 py-2 text-amber-600 hover:bg-gray-50 rounded">
                                Collections
                            </a>
                            <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                About
                            </a>
                            <a href="#contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                Contact
                            </a>
                        </div>
                    </motion.nav>}
                </AnimatePresence>
            </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-50 via-white to-amber-50 overflow-hidden">
            <div className="container mx-auto px-6 py-16 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} transition={{
                        duration: 0.6
                    }}>
                        <div className="inline-block mb-6">
                <span
                    className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  Authentic Russian Delicacies
                </span>
                        </div>

                        <h2 className="text-5xl lg:text-6xl font-serif mb-4 leading-tight">
                            <span className="text-gray-900">Experience the</span>
                            <br/>
                            <span className="text-red-800">Finest Traditions</span>
                            <br/>
                            <span className="text-gray-900">of Russia</span>
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                            Discover premium caviar, artisanal vodka, and traditional
                            pickles crafted with centuries-old recipes and the
                            highest quality ingredients.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                className="px-8 py-3.5 bg-red-800 text-white rounded font-medium hover:bg-red-900 transition-colors shadow-md hover:shadow-lg">
                                Shop Collection
                            </button>
                            <button
                                className="px-8 py-3.5 border-2 border-amber-600 text-amber-700 rounded font-medium hover:bg-amber-600 hover:text-white transition-colors">
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div initial={{
                        opacity: 0,
                        scale: 0.95
                    }} animate={{
                        opacity: 1,
                        scale: 1
                    }} transition={{
                        duration: 0.6,
                        delay: 0.2
                    }} className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-amber-200/50">
                            <img src="https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800"
                                 alt="Premium Caviar" className="w-full h-[500px] object-cover"/>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Collections Section */}
        <section id="collections" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-serif text-red-900 mb-3">
                        Our Collections
                    </h3>
                    <p className="text-gray-600">
                        Curated selections of Russia's finest culinary treasures
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {collections.map((collection, index) => <motion.div key={collection.id} initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        delay: index * 0.1
                    }} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer">
                        <img src={collection.image} alt={collection.name}
                             className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div className={`absolute inset-0 bg-gradient-to-t ${collection.bgColor} opacity-60`}/>

                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                            <h4 className="text-3xl font-serif mb-2">{collection.name}</h4>
                            <p className="text-sm text-amber-200 mb-4">{collection.price}</p>
                            <button
                                className="w-full py-3 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors shadow-lg">
                                Explore Collection
                            </button>
                        </div>
                    </motion.div>)}
                </div>
            </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50/30">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-4xl font-serif text-red-900 mb-2">
                            Featured Products
                        </h3>
                        <p className="text-gray-600">
                            Handpicked selections for the connoisseur
                        </p>
                    </div>
                    <a href="#all"
                       className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 group">
                        View All
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => <motion.div key={product.id} initial={{
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
                            <img src={product.image} alt={product.name}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            {product.badge && <div
                                className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                {product.badge}
                            </div>}
                            <button onClick={() => toggleFavorite(product.id)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                    aria-label="Add to favorites">
                                <Heart
                                    className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-800 text-red-800' : 'text-gray-600'}`}/>
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
                                <div>
                      <span className="text-2xl font-bold text-red-900">
                        ${product.price}
                      </span>
                                </div>
                                <button onClick={() => addToCart(product)}
                                        className="p-2.5 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors shadow-md hover:shadow-lg"
                                        aria-label="Add to cart">
                                    <Plus className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </motion.div>)}
                </div>
            </div>
        </section>

        {/* Heritage Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-red-50">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{
                        opacity: 0,
                        x: -20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }} className="relative h-[500px] rounded-2xl overflow-hidden ring-4 ring-amber-200/50">
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800" alt="Heritage"
                             className="w-full h-full object-cover"/>
                    </motion.div>

                    <motion.div initial={{
                        opacity: 0,
                        x: 20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }}>
                        <div className="inline-block mb-4">
                <span className="text-sm text-amber-600 font-semibold">
                  Our Heritage
                </span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-serif text-red-900 mb-6 leading-tight">
                            Preserving Centuries of
                            <br/>
                            Culinary Excellence
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Since 1895, Gastronom has been dedicated to bringing the
                            authentic flavors of Russia to discerning customers around
                            the world. Our commitment to quality and tradition ensures
                            that every product meets the highest standards.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            From our carefully sourced caviar to our traditionally
                            fermented pickles, each item tells a story of Russian
                            culinary heritage passed down through generations.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-red-950 text-gray-300 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h5 className="font-serif text-xl text-amber-400 mb-4">
                            GASTRONOM
                        </h5>
                        <p className="text-sm leading-relaxed">
                            Bringing authentic Russian delicacies to discerning
                            customers since 1895.
                        </p>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Shop</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Caviar
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Vodka
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Pickles
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Company</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Shipping
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Legal</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-red-900 pt-8 text-center text-sm">
                    <p>&copy; 2024 Gastronom. All rights reserved.</p>
                </div>
            </div>
        </footer>

        {/* Shopping Cart Sidebar */}
        <AnimatePresence>
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
                                {cart.map(item => <div key={item.product.id}
                                                       className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    <img src={item.product.image} alt={item.product.name}
                                         className="w-20 h-20 object-cover rounded"/>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            ${item.product.price}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="p-1 hover:bg-white rounded transition-colors"
                                                    aria-label="Decrease quantity">
                                                <Minus className="w-4 h-4 text-gray-600"/>
                                            </button>
                                            <span className="text-sm font-medium px-3">
                                {item.quantity}
                              </span>
                                            <button onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="p-1 hover:bg-white rounded transition-colors"
                                                    aria-label="Increase quantity">
                                                <Plus className="w-4 h-4 text-gray-600"/>
                                            </button>
                                            <button onClick={() => removeFromCart(item.product.id)}
                                                    className="ml-auto p-1 hover:bg-white rounded transition-colors"
                                                    aria-label="Remove from cart">
                                                <Trash2 className="w-4 h-4 text-red-800"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>)}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-red-900">
                          ${cartTotal.toFixed(2)}
                        </span>
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
        </AnimatePresence>
    </div>;
};