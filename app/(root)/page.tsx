"use client"

import React from 'react';
import {ChevronRight} from 'lucide-react';
import MinProductCard from "@/components/MinProductCard";
import CategoryCard from "@/components/CategoryCard";
import {FEATURED_CATEGORIES, FEATURES, PRODUCTLIST} from "@/lib/apiExample";
import CustomButton from "@/components/CustomButton";
import VerticalAnimatedDiv from "@/components/VerticalAnimatedDiv";
import ProductCard from "@/components/ProductCard";

// @component: GastronomHomepage
export default function GastronomHomepage() {
    return (
        <main className="min-h-screen bg-background">
            {/*Hero section*/}
            <section className="relative bg-gradient-to-br from-accent via-background to-muted overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <VerticalAnimatedDiv>
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
                                <CustomButton variant={"primary"}>
                                    Shop Collection
                                    <ChevronRight className="w-5 h-5"/>
                                </CustomButton>
                                <CustomButton variant={"secondary"}>
                                    Learn More
                                </CustomButton>
                            </div>
                        </VerticalAnimatedDiv>

                        <VerticalAnimatedDiv delay={0.4} className="grid grid-cols-2 gap-4">
                            {PRODUCTLIST.filter(item => item?.badges?.includes("HERO")).map((product, index) =>
                                <MinProductCard key={index} index={index}
                                                product={product}/>)}
                        </VerticalAnimatedDiv>
                    </div>
                </div>
            </section>
            {/*Features section*/}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => <VerticalAnimatedDiv
                            delay={index * 0.1} key={index}
                            className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-8 h-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </VerticalAnimatedDiv>)}
                    </div>
                </div>
            </section>
            {/*Categories section*/}
            <section className="py-20 bg-muted">
                <div className="max-w-7xl mx-auto px-4">
                    <VerticalAnimatedDiv
                        className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Browse Categories</h2>
                        <p className="text-lg text-muted-foreground">Explore our carefully curated collections</p>
                    </VerticalAnimatedDiv>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_CATEGORIES.map((category, index) => <CategoryCard key={index} index={index}
                                                                                    category={category}/>)}
                    </div>
                </div>
            </section>
            {/*Bestsellers section*/}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <VerticalAnimatedDiv className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Bestselling Products</h2>
                        <p className="text-lg text-muted-foreground">Customer favorites and award-winning selections</p>
                    </VerticalAnimatedDiv>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PRODUCTLIST.map((product, index) => <ProductCard key={index} index={index}
                                                                          product={product}/>)}
                    </div>
                </div>
            </section>
            {/*Newsletter section*/}
            <section className="py-20 bg-accent">
                <VerticalAnimatedDiv className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Join Our Culinary
                        Community</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Subscribe to receive exclusive offers, recipes, and updates on new arrivals
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Enter your email"
                               className="flex-1 px-6 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"/>
                        <CustomButton variant={"primary"}>
                            Subscribe
                        </CustomButton>
                    </div>
                </VerticalAnimatedDiv>
            </section>
        </main>)
};