import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { localizedPageMetadata } from "@/lib/i18n/server";
import { fetchFeaturedPublishedProducts, fetchPublishedCategorySummaries } from "@/lib/products/server-queries";
import { localBusinessJsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/structured-data";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/",
    descriptionKey: "meta.home_description",
  });
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    fetchPublishedCategorySummaries(),
    fetchFeaturedPublishedProducts(8),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()]),
        }}
      />
      <Navbar />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <AboutSection />
      <Footer />
    </div>
  );
}
