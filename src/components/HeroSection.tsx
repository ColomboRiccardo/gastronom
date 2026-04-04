import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-shop.jpg"
          alt="Gastronom - Eastern European delicatessen in Liguria"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="font-body text-gold-light text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
          Eastern European Delicatessen • Liguria, Italia
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s" }}>
          Гастроном
        </h1>
        <p className="font-display text-xl md:text-2xl text-primary-foreground/90 italic mb-2 animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s" }}>
          Gastronom
        </p>
        <p className="font-body text-primary-foreground/70 text-base md:text-lg max-w-lg mx-auto mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s" }}>
          Authentic flavours from Eastern Europe, nestled by the Ligurian Sea. Vodka, caviar, pickles, and more — a taste of home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: "1s" }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base px-8">
            Shop Now
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body text-base px-8">
            Our Story
          </Button>
        </div>
      </div>

      {/* Slavic border decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
        <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-60" />
      </div>
    </section>
  );
};

export default HeroSection;
