"use client";

import * as React from 'react';
import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Heart,
    Menu,
    Minus,
    Package,
    Plus,
    Search,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Trash2,
    Truck,
    User,
    X,
    ZoomIn
} from 'lucide-react';
import type {CartItem as GenericCartItem} from '@/types';

type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    images: string[];
    description: string;
    longDescription: string;
    badge?: string;
    weight: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    stockCount: number;
    features: string[];
    specifications: {
        label: string;
        value: string;
    }[];
};
type Review = {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
};

type CartItem = GenericCartItem<Product>;

export interface ProductPageProps {
    productId?: string;
    onNavigateBack?: () => void;
}

// Sample product data
const productData: Product = {
    id: '1',
    name: 'Beluga Caviar Imperial',
    price: 280,
    originalPrice: 320,
    category: 'caviar',
    images: ['https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1200', 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=1200', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=1200'],
    description: '50g Imperial Selection - Rare Beluga',
    longDescription: 'Our Beluga Caviar Imperial represents the pinnacle of luxury and refinement. Sourced from the pristine waters of the Caspian Sea, these large, delicate pearls are hand-selected and processed using traditional methods passed down through generations. Each tin contains only the finest roe, characterized by its buttery texture and complex, nuanced flavor profile that develops beautifully on the palate.',
    badge: 'PREMIUM',
    weight: '50g',
    rating: 5.0,
    reviews: 127,
    inStock: true,
    stockCount: 8,
    features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
    specifications: [{
        label: 'Origin',
        value: 'Caspian Sea'
    }, {
        label: 'Species',
        value: 'Huso Huso (Beluga Sturgeon)'
    }, {
        label: 'Grade',
        value: 'Imperial Selection'
    }, {
        label: 'Color',
        value: 'Light to Dark Gray'
    }, {
        label: 'Bead Size',
        value: '3.0-3.5mm'
    }, {
        label: 'Salt Content',
        value: '3-4% (Malossol)'
    }, {
        label: 'Storage',
        value: '-2°C to 2°C'
    }, {
        label: 'Shelf Life',
        value: '6 months sealed, 6 weeks opened'
    }]
};
const reviews: Review[] = [{
    id: '1',
    author: 'James Morrison',
    rating: 5,
    date: 'March 15, 2024',
    comment: 'Absolutely exceptional caviar. The texture is perfect and the flavor is sublime. Worth every penny for special occasions.',
    verified: true
}, {
    id: '2',
    author: 'Sofia Petrov',
    rating: 5,
    date: 'March 10, 2024',
    comment: 'This is the real deal. Having grown up with authentic caviar, I can say this is as good as it gets. The delivery packaging was also impressive.',
    verified: true
}, {
    id: '3',
    author: 'Michael Chen',
    rating: 4,
    date: 'March 5, 2024',
    comment: 'Outstanding quality, though quite pricey. Perfect for our anniversary dinner. The buttery flavor is exactly what you want from Beluga.',
    verified: true
}];
const relatedProducts = [{
    id: '2',
    name: 'Osetra Caviar Classic',
    price: 180,
    image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
    description: '30g Classic Selection',
    rating: 4.8,
    reviews: 89
}, {
    id: '3',
    name: 'Sevruga Caviar Reserve',
    price: 145,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    description: '30g Reserve Selection',
    rating: 4.7,
    reviews: 64
}, {
    id: '4',
    name: 'Kaluga Hybrid Caviar',
    price: 210,
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800',
    description: '50g Premium Selection',
    rating: 4.9,
    reviews: 45
}, {
    id: '5',
    name: 'Imperial Reserve Vodka',
    price: 85,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    description: '750ml Premium Reserve',
    rating: 4.9,
    reviews: 234
}];
export default function ProductPage({
                                        productId = '1',
                                        onNavigateBack
                                    }: ProductPageProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [imageZoom, setImageZoom] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const product = productData;
    const addToCart = () => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? {
                    ...item,
                    quantity: item.quantity + quantity
                } : item);
            }
            return [...prev, {
                product,
                quantity
            }];
        });
        setCartOpen(true);
    };
    const updateCartQuantity = (productId: string, delta: number) => {
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
    const discount = product.originalPrice ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100) : 0;
    return <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-serif tracking-wider text-red-900">
                            GASTRONOM
                        </h1>
                    </div>

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
                    <button onClick={onNavigateBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-900 transition-colors">
                        <ChevronLeft className="w-4 h-4"/>
                        Back to Collections
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <span className="text-red-900 font-medium capitalize">{product.category}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <span className="text-gray-600">{product.name}</span>
                </div>
            </div>
        </div>

        {/* Product Content */}
        <div className="container mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
                                onClick={() => setImageZoom(true)}>
                        <img src={product.images[selectedImageIndex]} alt={product.name}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        {product.badge && <div
                            className="absolute top-4 left-4 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded shadow-lg">
                            {product.badge}
                        </div>}
                        {discount > 0 && <div
                            className="absolute top-4 right-4 px-4 py-1.5 bg-red-800 text-white text-sm font-bold rounded shadow-lg">
                            -{discount}%
                        </div>}
                        <div
                            className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                            <ZoomIn className="w-5 h-5 text-gray-700"/>
                        </div>
                    </motion.div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                        {product.images.map((image, index) => <button key={index}
                                                                      onClick={() => setSelectedImageIndex(index)}
                                                                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-red-800 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                            <img src={image} alt={`${product.name} view ${index + 1}`}
                                 className="w-full h-full object-cover"/>
                        </button>)}
                    </div>
                </div>

                {/* Right: Product Details */}
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    delay: 0.1
                }}>
                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i}
                                                               className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                        </div>
                        <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-serif text-red-900 mb-3 leading-tight">
                        {product.name}
                    </h1>

                    <p className="text-lg text-gray-600 mb-6">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-5xl font-bold text-red-900">${product.price}</span>
                        {product.originalPrice && <span className="text-2xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-8">
                        {product.inStock ? <>
                            <Check className="w-5 h-5 text-green-600"/>
                            <span className="text-green-600 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                        </> : <span className="text-red-600 font-medium">Out of Stock</span>}
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Quantity
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                        aria-label="Decrease quantity">
                                    <Minus className="w-5 h-5 text-gray-700"/>
                                </button>
                                <span className="px-8 py-3 font-semibold text-lg border-x-2 border-gray-300">
                    {quantity}
                  </span>
                                <button onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                        aria-label="Increase quantity">
                                    <Plus className="w-5 h-5 text-gray-700"/>
                                </button>
                            </div>
                            <span className="text-sm text-gray-600">
                  {product.weight} per unit
                </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <button onClick={addToCart} disabled={!product.inStock}
                                className="flex-1 px-8 py-4 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5"/>
                            Add to Cart
                        </button>
                        <button onClick={() => setIsFavorite(!isFavorite)}
                                className={`px-4 py-4 rounded-lg border-2 transition-all ${isFavorite ? 'border-red-800 bg-red-50' : 'border-gray-300 hover:border-red-800'}`}
                                aria-label="Add to favorites">
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-800 text-red-800' : 'text-gray-600'}`}/>
                        </button>
                        <button
                            className="px-4 py-4 border-2 border-gray-300 rounded-lg hover:border-amber-600 transition-colors"
                            aria-label="Share product">
                            <Share2 className="w-6 h-6 text-gray-600"/>
                        </button>
                    </div>

                    {/* Features */}
                    <div className="border-t border-gray-200 pt-8 mb-8">
                        <h3 className="text-xl font-semibold text-red-900 mb-4">Key Features</h3>
                        <ul className="space-y-3">
                            {product.features.map((feature, index) => <li key={index}
                                                                          className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
                                <span className="text-gray-700">{feature}</span>
                            </li>)}
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="text-center">
                            <Package className="w-8 h-8 text-amber-600 mx-auto mb-2"/>
                            <p className="text-xs font-medium text-gray-700">Secure Packaging</p>
                        </div>
                        <div className="text-center">
                            <Truck className="w-8 h-8 text-amber-600 mx-auto mb-2"/>
                            <p className="text-xs font-medium text-gray-700">Express Delivery</p>
                        </div>
                        <div className="text-center">
                            <Shield className="w-8 h-8 text-amber-600 mx-auto mb-2"/>
                            <p className="text-xs font-medium text-gray-700">Authenticity Guaranteed</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200 pt-12 mb-16">
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button onClick={() => setActiveTab('description')}
                            className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'description' ? 'text-red-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        Description
                        {activeTab === 'description' && <motion.div layoutId="activeTab"
                                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900"/>}
                    </button>
                    <button onClick={() => setActiveTab('specifications')}
                            className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'specifications' ? 'text-red-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        Specifications
                        {activeTab === 'specifications' && <motion.div layoutId="activeTab"
                                                                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900"/>}
                    </button>
                    <button onClick={() => setActiveTab('reviews')}
                            className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'reviews' ? 'text-red-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        Reviews ({product.reviews})
                        {activeTab === 'reviews' && <motion.div layoutId="activeTab"
                                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900"/>}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'description' && <motion.div key="description" initial={{
                        opacity: 0,
                        y: 10
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} exit={{
                        opacity: 0,
                        y: -10
                    }} className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
                    </motion.div>}

                    {activeTab === 'specifications' && <motion.div key="specifications" initial={{
                        opacity: 0,
                        y: 10
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} exit={{
                        opacity: 0,
                        y: -10
                    }}>
                        <div className="grid md:grid-cols-2 gap-4">
                            {product.specifications.map((spec, index) => <div key={index}
                                                                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{spec.label}</span>
                                <span className="text-gray-900">{spec.value}</span>
                            </div>)}
                        </div>
                    </motion.div>}

                    {activeTab === 'reviews' && <motion.div key="reviews" initial={{
                        opacity: 0,
                        y: 10
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} exit={{
                        opacity: 0,
                        y: -10
                    }} className="space-y-6">
                        {reviews.map(review => <div key={review.id}
                                                    className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                        {review.verified && <span
                                            className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Verified Purchase
                            </span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => <Star key={i}
                                                                               className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>)}
                    </motion.div>}
                </AnimatePresence>
            </div>

            {/* Related Products */}
            <div className="border-t border-gray-200 pt-12">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-serif text-red-900">You May Also Like</h3>
                    <a href="#all"
                       className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 group">
                        View All
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct, index) => <motion.div key={relatedProduct.id} initial={{
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
                                                                                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img src={relatedProduct.image} alt={relatedProduct.name}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => <Star key={i}
                                                                   className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                                <span className="text-sm text-gray-600 ml-2">
                      {relatedProduct.rating} ({relatedProduct.reviews})
                    </span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-900 transition-colors">
                                {relatedProduct.name}
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">{relatedProduct.description}</p>
                            <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-900">
                      ${relatedProduct.price}
                    </span>
                                <button
                                    className="p-2.5 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors shadow-md hover:shadow-lg"
                                    aria-label="Quick add to cart">
                                    <Plus className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </motion.div>)}
                </div>
            </div>
        </div>

        {/* Image Zoom Modal */}
        <AnimatePresence>
            {imageZoom && <>
                <motion.div initial={{
                    opacity: 0
                }} animate={{
                    opacity: 1
                }} exit={{
                    opacity: 0
                }} onClick={() => setImageZoom(false)} className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"/>
                <motion.div initial={{
                    opacity: 0,
                    scale: 0.9
                }} animate={{
                    opacity: 1,
                    scale: 1
                }} exit={{
                    opacity: 0,
                    scale: 0.9
                }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <button onClick={() => setImageZoom(false)}
                            className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close zoom">
                        <X className="w-6 h-6 text-gray-700"/>
                    </button>
                    <img src={product.images[selectedImageIndex]} alt={product.name}
                         className="max-w-full max-h-full object-contain rounded-lg"/>
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
                                    <img src={item.product.images[0]} alt={item.product.name}
                                         className="w-20 h-20 object-cover rounded"/>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            ${item.product.price}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateCartQuantity(item.product.id, -1)}
                                                    className="p-1 hover:bg-white rounded transition-colors"
                                                    aria-label="Decrease quantity">
                                                <Minus className="w-4 h-4 text-gray-600"/>
                                            </button>
                                            <span className="text-sm font-medium px-3">
                                {item.quantity}
                              </span>
                                            <button onClick={() => updateCartQuantity(item.product.id, 1)}
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