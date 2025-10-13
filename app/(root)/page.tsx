import Header from "@/components/custom/Header";
import OverHeader from "@/components/custom/OverHeader";
import Hero from "@/components/custom/Hero";
import UnderHero from "@/components/custom/UnderHero";
import {ProductCarousel} from "@/components/custom/ProductCarousel";
import {ProductCategories} from "@/components/custom/ProductCategories";
import {Footer} from "@/components/custom/Footer";

export default function Home() {
    return (
        <div className="flex gap-0 min-h-screen home-wrapper text-stone-700">
            <OverHeader/>
            <Header/>
            <Hero/>
            <UnderHero/>
            <ProductCarousel/>
            <ProductCategories/>
            <Footer/>
        </div>
    );
}
