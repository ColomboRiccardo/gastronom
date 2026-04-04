const categories = [
  { name: "Vodka & Spirits", image: "/cat-vodka.jpg", count: 24 },
  { name: "Caviar & Roe", image: "/cat-caviar.jpg", count: 12 },
  { name: "Pickles & Preserves", image: "/cat-pickles.jpg", count: 36 },
  { name: "Kolbasa & Meats", image: "/cat-meats.jpg", count: 18 },
  { name: "Dried Fish", image: "/cat-fish.jpg", count: 15 },
  { name: "Gifts & Souvenirs", image: "/cat-gifts.jpg", count: 20 },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Browse by
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-lg md:text-xl font-semibold text-primary-foreground">
                  {cat.name}
                </h3>
                <p className="font-body text-sm text-primary-foreground/60">
                  {cat.count} products
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
