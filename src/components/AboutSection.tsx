import { MapPin, Clock, Phone } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-navy text-primary-foreground relative">
      {/* Top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden rotate-180">
        <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-gold-light text-sm tracking-[0.2em] uppercase mb-2">
            Since 2019
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            La Nostra Storia
          </h2>
          <p className="font-body text-primary-foreground/80 text-lg leading-relaxed mb-10">
            Gastronom was born from a love of Eastern European flavours and the desire to share them with the beautiful Ligurian coast. 
            Our little shop brings the best of Russia, Ukraine, Georgia, and beyond — from premium vodka and golden caviar 
            to homemade pickles and hand-painted matryoshkas. Every product is carefully selected to bring you an authentic taste of the East.
          </p>

          <div className="grid sm:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">Visit Us</h4>
                <p className="font-body text-sm text-primary-foreground/60">Via Roma 42, Liguria</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">Opening Hours</h4>
                <p className="font-body text-sm text-primary-foreground/60">Mon-Sat: 9:00 - 20:00</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gold-light" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">Call Us</h4>
                <p className="font-body text-sm text-primary-foreground/60">+39 0185 123 456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
        <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
      </div>
    </section>
  );
};

export default AboutSection;
