"use client"

import React from 'react';
import {motion} from 'framer-motion';
import {ChevronRight} from 'lucide-react';
import MinProductCard from "@/components/MinProductCard";
import CategoryCard from "@/components/CategoryCard";
import DetailedProductCard from "@/components/DetailedProductCard";
import {BESTSELLERS, FEATURED_CATEGORIES, FEATURES, HERO_PRODUCTS} from "@/lib/apiExample";
import {GastronomHomepageProps} from "@/types";

// @component: GastronomHomepage
export default function GastronomHomepage(props: GastronomHomepageProps) {
    const [cartCount, setCartCount] = React.useState(0);
    const handleAddToCart = () => {
        setCartCount(prev => prev + 1);
    };
    return (
        <div className="min-h-screen bg-background">
            {/*Hero section*/}
            <main className="relative bg-gradient-to-br from-accent via-background to-muted overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{
                            opacity: 0,
                            y: 30
                        }} animate={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            duration: 0.6
                        }}>
                            <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg mb-6">
                                <span className="text-primary font-medium text-sm">Premium Gourmet Selection</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                                Curated Fine Foods for Discerning Palates
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Discover an exquisite collection of artisan products, handpicked from the world's finest
                                producers. Elevate your culinary experience.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <motion.button whileHover={{
                                    scale: 1.05
                                }} whileTap={{
                                    scale: 0.95
                                }}
                                               className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
                                    Shop Collection
                                    <ChevronRight className="w-5 h-5"/>
                                </motion.button>
                                <motion.button whileHover={{
                                    scale: 1.05
                                }} whileTap={{
                                    scale: 0.95
                                }}
                                               className="px-8 py-4 bg-background border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors">
                                    Learn More
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            x: 30
                        }} animate={{
                            opacity: 1,
                            x: 0
                        }} transition={{
                            duration: 0.6,
                            delay: 0.2
                        }} className="grid grid-cols-2 gap-4">
                            {HERO_PRODUCTS.map((product, index) => <MinProductCard key={index} index={index}
                                                                                   product={product}/>)}
                        </motion.div>
                    </div>
                </div>
            </main>
            {/*Features section*/}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => <motion.div key={index} initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} viewport={{
                            once: true
                        }} transition={{
                            delay: index * 0.1
                        }} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-8 h-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </motion.div>)}
                    </div>
                </div>
            </section>
            {/*Categories section*/}
            <section className="py-20 bg-muted">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Browse Categories</h2>
                        <p className="text-lg text-muted-foreground">Explore our carefully curated collections</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_CATEGORIES.map((category, index) => <CategoryCard key={index} category={category}/>)}
                    </div>
                </div>
            </section>
            {/*Bestsellers section*/}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Bestselling Products</h2>
                        <p className="text-lg text-muted-foreground">Customer favorites and award-winning selections</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {BESTSELLERS.map((product, index) => <DetailedProductCard key={index} product={product}/>)}
                    </div>
                </div>
            </section>
            {/*Newsletter section*/}
            <section className="py-20 bg-accent">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }}>
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Join Our Culinary
                            Community</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Subscribe to receive exclusive offers, recipes, and updates on new arrivals
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email"
                                   className="flex-1 px-6 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"/>
                            <motion.button whileHover={{
                                scale: 1.05
                            }} whileTap={{
                                scale: 0.95
                            }}
                                           className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>)
};