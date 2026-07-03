import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import { fetchPublishedCategorySummaries } from "@/lib/products/server-queries";

export default async function CategoriesPage() {
  const categories = await fetchPublishedCategorySummaries();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-body text-accent text-sm tracking-[0.2em] uppercase mb-2">
            Browse by
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            All Categories
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Explore our full range of Eastern European delicacies, spirits, and crafts — organized by category.
          </p>
        </div>
        <img
          src="/slavic-border.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none"
        />
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
