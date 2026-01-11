"use client"

import React from 'react';
import {Search, ShoppingCart, User} from "lucide-react";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {useCart} from "@/hooks";
import HorizontalAnimatedDiv from "@/animations/HorizontalAnimatedDiv";
import Dropdown from "@/components/Dropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// A simple, reusable Header component
// Matches tests in tests/Header.test.tsx
export default function Header() {
    const {cartCount, setCartOpen} = useCart();
    const t = useTranslations('common');
    const tHeader = useTranslations('header');

    // Get translated category items
    const categoryItems = [
        tHeader('caviar'),
        tHeader('vodka'),
        tHeader('pickles')
    ];

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <HorizontalAnimatedDiv
                        className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-5xl font-serif text-foreground">{t('brandName')}</span>
                        </Link>
                    </HorizontalAnimatedDiv>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/shop"
                              className="text-foreground hover:text-primary transition-colors font-medium py-6">
                            {t('shop')}
                        </Link>
                        <Dropdown title={tHeader('categories')} items={categoryItems}/>
                        <Link href="/about"
                              className="text-foreground hover:text-primary transition-colors font-medium py-6">
                            {t('about')}
                        </Link>
                        <Link href="/contact"
                              className="text-foreground hover:text-primary transition-colors font-medium py-6">
                            {t('contact')}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={t('search')}>
                            <Search className="w-5 h-5 text-foreground"/>
                        </button>
                        <Link href="/account" className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={t('account')}>
                            <User className="w-5 h-5 text-foreground"/>
                        </Link>
                        <LanguageSwitcher />
                        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors" aria-label={t('cart')}>
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
