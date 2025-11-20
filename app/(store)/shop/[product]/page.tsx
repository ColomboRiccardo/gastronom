"use client";

import * as React from 'react';
import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Package,
    Plus,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
    X,
    ZoomIn
} from 'lucide-react';
import {ALLPRODUCTS, DETAILEDPRODUCTDATA, REVIEWS} from "@/lib/apiExample";
import {useCart, useFavourites} from "@/hooks";
import VerticalAnimatedDiv from "@/components/VerticalAnimatedDiv";
import {useParams} from "next/navigation";

const relatedProducts = ALLPRODUCTS.filter(product => product.category === DETAILEDPRODUCTDATA.category);

export default function ProductPage() {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [imageZoom, setImageZoom] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

    const {product} = useParams()
    //TODO: connect product to API from params in url
    //TODO: reunite api params (detailedproducttype, producttype, etc) into one single source

    const {addToCart} = useCart()
    const {favourites, toggleFavourite} = useFavourites()
    const discount = DETAILEDPRODUCTDATA.originalPrice ? Math.round((DETAILEDPRODUCTDATA.originalPrice - DETAILEDPRODUCTDATA.price) / DETAILEDPRODUCTDATA.originalPrice * 100) : 0;
    return <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-900 transition-colors">
                        <ChevronLeft className="w-4 h-4"/>
                        Back to Collections
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <span className="text-red-900 font-medium capitalize">{DETAILEDPRODUCTDATA.category}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400"/>
                    <span className="text-gray-600">{DETAILEDPRODUCTDATA.name}</span>
                </div>
            </div>
        </div>

        {/* Product Content */}
        <div className="container mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <VerticalAnimatedDiv
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
                        onClick={() => setImageZoom(true)}>
                        <img src={DETAILEDPRODUCTDATA.images[selectedImageIndex]} alt={DETAILEDPRODUCTDATA.name}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        {DETAILEDPRODUCTDATA.badge && <div
                            className="absolute top-4 left-4 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded shadow-lg">
                            {DETAILEDPRODUCTDATA.badge}
                        </div>}
                        {discount > 0 && <div
                            className="absolute top-4 right-4 px-4 py-1.5 bg-red-800 text-white text-sm font-bold rounded shadow-lg">
                            -{discount}%
                        </div>}
                        <div
                            className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                            <ZoomIn className="w-5 h-5 text-gray-700"/>
                        </div>
                    </VerticalAnimatedDiv>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                        {DETAILEDPRODUCTDATA.images.map((image, index) => <button key={index}
                                                                                  onClick={() => setSelectedImageIndex(index)}
                                                                                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-red-800 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                            <img src={image} alt={`${DETAILEDPRODUCTDATA.name} view ${index + 1}`}
                                 className="w-full h-full object-cover"/>
                        </button>)}
                    </div>
                </div>

                {/* Right: Product Details */}
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}}>
                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i}
                                      className={`w-5 h-5 ${i < Math.floor(DETAILEDPRODUCTDATA.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)
                            )}
                        </div>
                        <span className="text-sm text-gray-600">
                {DETAILEDPRODUCTDATA.rating} ({DETAILEDPRODUCTDATA.reviews} reviews)
              </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-serif text-red-900 mb-3 leading-tight">
                        {DETAILEDPRODUCTDATA.name}
                    </h1>

                    <p className="text-lg text-gray-600 mb-6">{DETAILEDPRODUCTDATA.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-5xl font-bold text-red-900">${DETAILEDPRODUCTDATA.price}</span>
                        {DETAILEDPRODUCTDATA.originalPrice && <span className="text-2xl text-gray-400 line-through">
                  ${DETAILEDPRODUCTDATA.originalPrice}
                </span>}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-8">
                        {DETAILEDPRODUCTDATA.inStock ? <>
                            <Check className="w-5 h-5 text-green-600"/>
                            <span className="text-green-600 font-medium">
                    In Stock ({DETAILEDPRODUCTDATA.stockCount} available)
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
                                <button
                                    onClick={() => setQuantity(Math.min(DETAILEDPRODUCTDATA.stockCount, quantity + 1))}
                                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                    aria-label="Increase quantity">
                                    <Plus className="w-5 h-5 text-gray-700"/>
                                </button>
                            </div>
                            <span className="text-sm text-gray-600">
                                {DETAILEDPRODUCTDATA.weight} per unit
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={(e) => addToCart(ALLPRODUCTS.filter(product => product.id === "1")[0], quantity)}
                            disabled={!DETAILEDPRODUCTDATA.inStock}
                            className="flex-1 px-8 py-4 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5"/>
                            Add to Cart
                        </button>
                        <button onClick={() => toggleFavourite("1")}
                                className={`px-4 py-4 rounded-lg border-2 transition-all ${favourites.includes("1") ? 'border-red-800 bg-red-50' : 'border-gray-300 hover:border-red-800'}`}
                                aria-label="Add to favorites">
                            <Heart
                                className={`w-6 h-6 ${favourites.includes("1") ? 'fill-red-800 text-red-800' : 'text-gray-600'}`}/>
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
                            {DETAILEDPRODUCTDATA.features.map((feature, index) => <li key={index}
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
                        Reviews ({DETAILEDPRODUCTDATA.reviews})
                        {activeTab === 'reviews' && <motion.div layoutId="activeTab"
                                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900"/>}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'description' &&
                        <motion.div key="description" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}} className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed">{DETAILEDPRODUCTDATA.longDescription}</p>
                        </motion.div>}

                    {activeTab === 'specifications' &&
                        <motion.div key="specifications" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}>
                            <div className="grid md:grid-cols-2 gap-4">
                                {DETAILEDPRODUCTDATA.specifications.map((spec, index) => <div key={index}
                                                                                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{spec.label}</span>
                                    <span className="text-gray-900">{spec.value}</span>
                                </div>)}
                            </div>
                        </motion.div>}

                    {activeTab === 'reviews' &&
                        <motion.div key="reviews" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}} className="space-y-6">
                            {REVIEWS.map(review => <div key={review.id}
                                                        className="border-b border-gray-200 pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                            {review.verified && <span
                                                className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Verified Purchase</span>}
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
                    {relatedProducts.map((relatedProduct, index) => (
                        <VerticalAnimatedDiv key={relatedProduct.id} delay={index * 0.1}
                                             className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer">
                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                                <img src={relatedProduct.image} alt={relatedProduct.name}
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => <Star key={i}
                                                                       className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                                    <span
                                        className="text-sm text-gray-600 ml-2">{relatedProduct.rating} ({relatedProduct.reviews})</span>
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
                        </VerticalAnimatedDiv>)
                    )}
                </div>
            </div>
        </div>

        {/* Image Zoom Modal */}
        <AnimatePresence>
            {imageZoom && (<>
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                            onClick={() => setImageZoom(false)}
                            className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"/>
                <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.9}}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <button onClick={() => setImageZoom(false)}
                            className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close zoom">
                        <X className="w-6 h-6 text-gray-700"/>
                    </button>
                    <img src={DETAILEDPRODUCTDATA.images[selectedImageIndex]} alt={DETAILEDPRODUCTDATA.name}
                         className="max-w-full max-h-full object-contain rounded-lg"/>
                </motion.div>
            </>)}
        </AnimatePresence>
    </div>;
}