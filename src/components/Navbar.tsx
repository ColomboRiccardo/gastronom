"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart, UserCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const currentLang = LANGUAGES.find((l) => l.code === language)!;

  const navLinks = [
    { label: t("nav.home"), href: "/", isRoute: true },
    { label: t("nav.products"), href: "/products", isRoute: true },
    { label: t("nav.categories"), href: "/#categories" },
    { label: t("nav.about"), href: "/about", isRoute: true },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="font-display text-2xl font-bold tracking-wide text-primary">
          ГАСТРОНОМ
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <span className="text-base leading-none">{currentLang.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`gap-2 cursor-pointer ${lang.code === language ? "bg-accent" : ""}`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-body text-sm">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {isAuthenticated ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <UserCircle className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-sm font-body">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.signin")}</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </Link>
          </Button>

          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body text-base text-foreground/80 hover:text-primary py-2 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-base text-foreground/80 hover:text-primary py-2 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            {!isAuthenticated && (
              <>
                <div className="border-t border-border my-1" />
                <Link href="/login" className="font-body text-base text-primary font-semibold py-2" onClick={() => setOpen(false)}>
                  {t("nav.signin")}
                </Link>
                <Link href="/signup" className="font-body text-base text-primary/80 py-2" onClick={() => setOpen(false)}>
                  {t("nav.create_account")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
