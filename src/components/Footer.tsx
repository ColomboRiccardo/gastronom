"use client";

import Link from "next/link";

import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.categories"), href: "/categories" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <footer id="contact" className="bg-foreground text-primary-foreground py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="font-display text-2xl font-bold mb-3">ГАСТРОНОМ</h3>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-3">{t("footer.quick_links")}</h4>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-3">{t("footer.legal")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/cookies" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                {t("footer.cookies")}
              </Link>
              <Link href="/terms" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                {t("footer.terms")}
              </Link>
              <CookiePreferencesLink className="font-body text-sm text-left text-primary-foreground/60 hover:text-primary-foreground transition-colors" />
            </div>
            <p className="font-body text-xs text-primary-foreground/40 mt-4 leading-relaxed">
              {t("footer.newsletter_note")}
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Gastronom. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
