"use client";

import * as React from 'react';
import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    ChevronRight,
    Heart,
    Home,
    Menu,
    Minus,
    Plus,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    Trash2,
    User,
    X
} from 'lucide-react';

type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    description: string;
    badge?: string;
    weight: string;
    rating: number;
    reviews: number;
    inStock: boolean;
};
type CartItem = {
    product: Product;
    quantity: number;
};
type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
type CollectionType = 'caviar' | 'vodka' | 'pickles';

//export interface CollectionsPageProps {
//    collection?: CollectionType;
//}

const collectionData = {
    caviar: {
        title: 'Premium Caviar Collection',
        description: 'The finest selection of sturgeon roe, sourced from pristine waters and prepared with centuries-old techniques. Each tin represents the pinnacle of luxury and taste.',
        hero: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1200',
        bgGradient: 'from-slate-800 to-slate-900'
    },
    vodka: {
        title: 'Imperial Vodka Collection',
        description: 'Distilled to perfection using traditional Russian methods. Our vodka collection showcases the pure essence of craftsmanship with smooth, refined flavors.',
        hero: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200',
        bgGradient: 'from-red-900 to-red-950'
    },
    pickles: {
        title: 'Traditional Pickles Collection',
        description: 'Authentic Russian pickles fermented using time-honored recipes. Crisp, flavorful, and made with the finest organic vegetables and natural spices.',
        hero: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200',
        bgGradient: 'from-red-800 to-red-900'
    }
};
const allProducts: Product[] = [{
    id: '1',
    name: 'Beluga Caviar Imperial',
    price: 280,
    originalPrice: 320,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
    description: '50g Imperial Selection - Rare Beluga',
    badge: 'PREMIUM',
    weight: '50g',
    rating: 5.0,
    reviews: 127,
    inStock: true
}, {
    id: '2',
    name: 'Osetra Caviar Classic',
    price: 180,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
    description: '30g Classic Selection - Golden Osetra',
    weight: '30g',
    rating: 4.8,
    reviews: 89,
    inStock: true
}, {
    id: '3',
    name: 'Sevruga Caviar Reserve',
    price: 145,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    description: '30g Reserve Selection - Fine Sevruga',
    weight: '30g',
    rating: 4.7,
    reviews: 64,
    inStock: true
}, {
    id: '4',
    name: 'Kaluga Hybrid Caviar',
    price: 210,
    category: 'caviar',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800',
    description: '50g Premium Selection - Kaluga Hybrid',
    badge: 'LIMITED',
    weight: '50g',
    rating: 4.9,
    reviews: 45,
    inStock: true
}, {
    id: '5',
    name: 'Imperial Reserve Vodka',
    price: 85,
    originalPrice: 95,
    category: 'vodka',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    description: '750ml Premium Reserve - Crystal Clear',
    weight: '750ml',
    rating: 4.9,
    reviews: 234,
    inStock: true
}, {
    id: '6',
    name: 'Platinum Edition Vodka',
    price: 120,
    category: 'vodka',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800',
    description: '750ml Platinum Edition - Triple Distilled',
    badge: 'PREMIUM',
    weight: '750ml',
    rating: 5.0,
    reviews: 167,
    inStock: true
}, {
    id: '7',
    name: 'Heritage Vodka 1895',
    price: 65,
    category: 'vodka',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    description: '750ml Heritage Edition - Classic Recipe',
    weight: '750ml',
    rating: 4.6,
    reviews: 312,
    inStock: true
}, {
    id: '8',
    name: 'Imperial Gold Vodka',
    price: 155,
    category: 'vodka',
    image: 'https://images.unsplash.com/photo-1585870938850-2d447a611b57?w=800',
    description: '750ml Gold Edition - Luxury Blend',
    badge: 'LIMITED',
    weight: '750ml',
    rating: 4.8,
    reviews: 98,
    inStock: false
}, {
    id: '9',
    name: 'Traditional Dill Pickles',
    price: 18,
    category: 'pickles',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
    description: '500g Traditional Recipe - Crispy Dill',
    badge: 'ORGANIC',
    weight: '500g',
    rating: 4.7,
    reviews: 423,
    inStock: true
}, {
    id: '10',
    name: 'Garlic & Herb Pickles',
    price: 20,
    category: 'pickles',
    image: 'https://images.unsplash.com/photo-1619419152703-15cbe2a2e93e?w=800',
    description: '500g Gourmet Blend - Bold Garlic',
    badge: 'ORGANIC',
    weight: '500g',
    rating: 4.8,
    reviews: 289,
    inStock: true
}, {
    id: '11',
    name: 'Spicy Pickled Vegetables',
    price: 22,
    originalPrice: 26,
    category: 'pickles',
    image: 'https://images.unsplash.com/photo-1599021662715-eb19bb62c3eb?w=800',
    description: '650g Mixed Vegetables - Fiery Blend',
    weight: '650g',
    rating: 4.6,
    reviews: 198,
    inStock: true
}, {
    id: '12',
    name: 'Artisan Pickled Tomatoes',
    price: 24,
    category: 'pickles',
    image: 'https://images.unsplash.com/photo-1592921869218-8c8bf5d1497c?w=800',
    description: '550g Cherry Tomatoes - Sweet & Tangy',
    badge: 'NEW',
    weight: '550g',
    rating: 4.9,
    reviews: 156,
    inStock: true
}];

export default function CollectionsPage(props: any) {
    const collection = "caviar"
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [comparedProducts, setComparedProducts] = useState<string[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const currentCollection = collectionData[collection];
    const categoryProducts = allProducts.filter(p => p.category === collection);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = categoryProducts.filter(p => {
            const inPriceRange = p.price >= priceRange[0] && p.price <= priceRange[1];
            const stockFilter = showOutOfStock || p.inStock;
            return inPriceRange && stockFilter;
        });

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.reverse();
                break;
            default:
                // featured - keep original order
                break;
        }
        return filtered;
    }, [categoryProducts, priceRange, showOutOfStock, sortBy]);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };
    const toggleCompare = (productId: string) => {
        setComparedProducts(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : prev.length < 3 ? [...prev, productId] : prev);
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
        setCart(prev => prev.map(item => item.product.id === productId ? {
            ...item,
            quantity: item.quantity + delta
        } : item).filter(item => item.quantity > 0));
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
                    <div className="flex items-center">
                        <h1 className="text-3xl font-serif tracking-wider text-red-900">
                            Gastronom
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="shop" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
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

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-gray-500"/>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <a href="#collections" className="text-gray-600 hover:text-red-900 transition-colors">
                        Collections
                    </a>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <span className="text-red-900 font-medium capitalize">{collection}</span>
                </div>
            </div>
        </div>

        {/* Hero Section */}
        <section className={`relative bg-gradient-to-br ${currentCollection.bgGradient} text-white overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
                <img src={currentCollection.hero} alt={currentCollection.title} className="w-full h-full object-cover"/>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

            <div className="relative container mx-auto px-6 py-16 lg:py-20">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    duration: 0.6
                }} className="max-w-3xl">
                    <div className="inline-block mb-4">
    <span className="px-4 py-1.5 bg-amber-500/90 text-white text-xs font-bold rounded-full">
        {filteredProducts.length} PRODUCTS
    </span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-serif mb-6 leading-tight">
                        {currentCollection.title}
                    </h2>
                    <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
                        {currentCollection.description}
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        {/* Filters Header */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-red-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5"/>
                                    Filters
                                </h3>
                                <button onClick={() => {
                                    setPriceRange([0, 500]);
                                    setShowOutOfStock(true);
                                    setSortBy('featured');
                                }} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                                    Reset
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Price Range
                                </label>
                                <div className="space-y-2">
                                    <input type="range" min="0" max="500" value={priceRange[1]}
                                           onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                                           className="w-full accent-red-800"/>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Sort By
                                </label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent">
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                            </div>

                            {/* Stock Filter */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={showOutOfStock}
                                           onChange={e => setShowOutOfStock(e.target.checked)}
                                           className="w-4 h-4 text-red-800 rounded focus:ring-red-800"/>
                                    <span className="text-sm text-gray-700">Show out of stock items</span>
                                </label>
                            </div>
                        </div>

                        {/* Product Comparison */}
                        {comparedProducts.length > 0 && <motion.div initial={{
                            opacity: 0,
                            y: 10
                        }} animate={{
                            opacity: 1,
                            y: 0
                        }} className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <h4 className="text-sm font-semibold text-amber-900 mb-3">
                                Compare Products ({comparedProducts.length}/3)
                            </h4>
                            <button
                                className="w-full px-4 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                                Compare Now
                            </button>
                        </motion.div>}
                    </div>
                </aside>

                {/* Mobile Filters Button */}
                <button onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-40 px-6 py-3 bg-red-800 text-white rounded-full shadow-lg hover:bg-red-900 transition-colors flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5"/>
                    Filters
                </button>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {filteredProducts.length} Products
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Showing {(currentPage - 1) * itemsPerPage + 1}-
                                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                            </p>
                        </div>

                        {/* Mobile Sort */}
                        <div className="lg:hidden">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-800 focus:border-transparent">
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                        {paginatedProducts.map((product, index) => <motion.div key={product.id} initial={{
                            opacity: 0,
                            y: 20
                        }} animate={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: index * 0.05
                        }}
                                                                               className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                                <img src={product.image} alt={product.name}
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                {product.badge && <div
                                    className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                    {product.badge}
                                </div>}
                                {!product.inStock &&
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
            Out of Stock
        </span>
                                    </div>}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <button onClick={() => toggleFavorite(product.id)}
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                            aria-label="Add to favorites">
                                        <Heart
                                            className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-800 text-red-800' : 'text-gray-600'}`}/>
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => <Star key={i}
                                                                       className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                                    <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
            </span>
                                </div>

                                <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-900 transition-colors">
                                    {product.name}
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">{product.description}</p>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-red-900">
            ${product.price}
            </span>
                                            {product.originalPrice &&
                                                <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
                </span>}
                                        </div>
                                        <span className="text-xs text-gray-500">{product.weight}</span>
                                    </div>
                                    <button onClick={() => addToCart(product)} disabled={!product.inStock}
                                            className="p-2.5 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Add to cart">
                                        <Plus className="w-5 h-5"/>
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <label
                                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-amber-600 transition-colors">
                                        <input type="checkbox" checked={comparedProducts.includes(product.id)}
                                               onChange={() => toggleCompare(product.id)}
                                               disabled={comparedProducts.length >= 3 && !comparedProducts.includes(product.id)}
                                               className="w-4 h-4 text-amber-600 rounded focus:ring-amber-600"/>
                                        Compare
                                    </label>
                                </div>
                            </div>
                        </motion.div>)}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)}
                                                                      className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-red-800 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
                            {i + 1}
                        </button>)}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>}
                </div>
            </div>
        </div>

        {/* Mobile Filters Sidebar */}
        <AnimatePresence>
            {mobileFiltersOpen && <>
                <motion.div initial={{
                    opacity: 0
                }} animate={{
                    opacity: 1
                }} exit={{
                    opacity: 0
                }} onClick={() => setMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"/>
                <motion.div initial={{
                    x: '-100%'
                }} animate={{
                    x: 0
                }} exit={{
                    x: '-100%'
                }} transition={{
                    type: 'spring',
                    damping: 25
                }} className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto lg:hidden">
                    <div
                        className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                        <h3 className="text-xl font-semibold text-red-900">Filters</h3>
                        <button onClick={() => setMobileFiltersOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close filters">
                            <X className="w-6 h-6 text-gray-600"/>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Price Range
                            </label>
                            <div className="space-y-2">
                                <input type="range" min="0" max="500" value={priceRange[1]}
                                       onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                                       className="w-full accent-red-800"/>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={showOutOfStock}
                                       onChange={e => setShowOutOfStock(e.target.checked)}
                                       className="w-4 h-4 text-red-800 rounded focus:ring-red-800"/>
                                <span className="text-sm text-gray-700">Show out of stock items</span>
                            </label>
                        </div>

                        <button onClick={() => {
                            setPriceRange([0, 500]);
                            setShowOutOfStock(true);
                            setSortBy('featured');
                        }}
                                className="w-full px-4 py-2.5 border-2 border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-colors">
                            Reset Filters
                        </button>

                        <button onClick={() => setMobileFiltersOpen(false)}
                                className="w-full px-4 py-3 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </motion.div>
            </>}
        </AnimatePresence>

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
        </AnimatePresence>
    </div>;
}