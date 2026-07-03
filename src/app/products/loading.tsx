import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-xl text-muted-foreground">Loading products...</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
