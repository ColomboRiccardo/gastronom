"use client"

import React from 'react';
import {Search, ShoppingCart, User} from "lucide-react";
import Link from "next/link";
import {useCart} from "@/hooks";
import HorizontalAnimatedDiv from "@/animations/HorizontalAnimatedDiv";
import Dropdown from "@/components/Dropdown";

// A simple, reusable Header component
// Matches tests in tests/Header.test.tsx
export default function Header() {
    const {cartCount, setCartOpen} = useCart()

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <HorizontalAnimatedDiv
                        className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-5xl font-serif text-foreground">Gastronom</span>
                        </Link>
                    </HorizontalAnimatedDiv>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href={"/shop"}
                              className="text-foreground hover:text-primary transition-colors font-medium">Shop</Link>
                        <Dropdown title="Categories" items={["Caviar", "Vodka", "Pickles"]}/>
                        <Link href="#"
                              className="text-foreground hover:text-primary transition-colors font-medium">About</Link>
                        <Link href="#"
                              className="text-foreground hover:text-primary transition-colors font-medium">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-foreground"/>
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <User className="w-5 h-5 text-foreground"/>
                        </button>
                        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-foreground" onClick={() => setCartOpen(true)}/>
                            <span
                                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}