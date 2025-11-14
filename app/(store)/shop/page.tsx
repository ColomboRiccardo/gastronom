"use client";

import * as React from 'react';
import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronRight, Home, SlidersHorizontal, X} from 'lucide-react';
import {ALLPRODUCTS, collectionData} from "@/lib/apiExample";
import {SortOption} from "@/types";
import DetailedProductCard from "@/components/DetailedProductCard";

export default function CollectionsPage() {
    const collection = "caviar"

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const currentCollection = collectionData[collection];
    const categoryProducts = ALLPRODUCTS.filter(p => p.category === collection);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        const filtered = categoryProducts.filter(p => {
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

    return <div className="min-h-screen bg-white">
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
                        {paginatedProducts.map((product, index) => <DetailedProductCard key={product.id}
                                                                                        product={product}
                                                                                        index={index}/>)
                        }
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
    </div>;
}