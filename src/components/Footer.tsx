import Link from "next/link";

import CookiePreferencesLink from "@/components/CookiePreferencesLink";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="font-display text-2xl font-bold mb-3">ГАСТРОНОМ</h3>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              Authentic Eastern European products in the heart of Liguria. Quality imported goods, traditional recipes, and warm hospitality.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "About", href: "/about" },
              ].map((link) => (
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
            <h4 className="font-display text-lg font-semibold mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link href="/terms" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <CookiePreferencesLink className="font-body text-sm text-left text-primary-foreground/60 hover:text-primary-foreground transition-colors" />
            </div>
            <p className="font-body text-xs text-primary-foreground/40 mt-4 leading-relaxed">
              Newsletter signup will only be enabled with explicit marketing consent.
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Gastronom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
