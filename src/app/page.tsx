import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { fetchFeaturedPublishedProducts, fetchPublishedCategorySummaries } from "@/lib/products/server-queries";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    fetchPublishedCategorySummaries(),
    fetchFeaturedPublishedProducts(8),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <AboutSection />
      <Footer />
    </div>
  );
}
