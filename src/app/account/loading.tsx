import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <section className="pt-24 pb-12 bg-[hsl(var(--navy))] text-primary-foreground">
        <div className="container mx-auto px-4">
          <p className="font-display text-xl text-[hsl(var(--gold-light))]">Loading account...</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
