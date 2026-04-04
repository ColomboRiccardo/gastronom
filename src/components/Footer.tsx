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
              {["Home", "Products", "Categories", "About", "Contact"].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-3">Newsletter</h4>
            <p className="font-body text-sm text-primary-foreground/60 mb-3">
              Get updates on new arrivals and special offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded px-3 py-2 text-sm font-body text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-body font-medium hover:bg-primary/80 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40">
            © 2025 Gastronom. All rights reserved. Made with ❤️ in Liguria.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
