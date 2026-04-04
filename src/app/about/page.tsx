import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Clock, Phone, Heart, Truck, Star } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description:
      "Every product is sourced directly from trusted producers across Russia, Ukraine, Georgia, and beyond — no imitations, only the real thing.",
  },
  {
    icon: Star,
    title: "Quality",
    description:
      "We taste and test every item ourselves. If it wouldn't earn a place on our family table, it won't earn a place on our shelves.",
  },
  {
    icon: Truck,
    title: "Fresh Imports",
    description:
      "Regular shipments ensure our shelves are always stocked with fresh goods — from smoked kolbasa to just-packed pickles.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "A Dream Takes Root",
    text: "Founded by a family of Eastern European expats who missed the flavours of home, Gastronom opened its doors on a quiet street near the Ligurian coast.",
  },
  {
    year: "2021",
    title: "Growing Community",
    text: "Word spread fast. Our little shop became a gathering point for the Eastern European community — and curious Italian neighbours who fell in love with our products.",
  },
  {
    year: "2023",
    title: "Expanding Horizons",
    text: "We expanded our selection to include Georgian wines, Uzbek spices, and handcrafted souvenirs. The shop doubled in size to welcome even more treasures.",
  },
  {
    year: "2025",
    title: "Online & Beyond",
    text: "Gastronom goes online, bringing the best of Eastern Europe to customers across Italy — while our brick-and-mortar shop remains the heart of it all.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <section className="relative pt-16">
        <div className="bg-navy text-primary-foreground py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`,
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="font-body text-gold-light text-sm tracking-[0.2em] uppercase mb-3">
              Our Story
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Chi Siamo
            </h1>
            <p className="font-body text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              A little corner of Eastern Europe on the beautiful Ligurian coast
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
            <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Born from Nostalgia, Built with Love
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              Gastronom was born from a simple longing — the taste of home. When our founders settled on
              the sun-drenched Ligurian coast, they fell in love with Italy but missed the bold, soulful
              flavours of Eastern Europe: the sharp bite of a proper pickle, the smoky richness of dried
              fish, the warmth of a good vodka shared among friends.
            </p>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              So they created a place where those flavours could live alongside Italian olive oil and
              focaccia — a shop that bridges two culinary worlds. Today, Gastronom is a destination for
              anyone who craves authenticity, whether they grew up in Moscow or Genova.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {v.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
            Our Journey
          </h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            {timeline.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 mt-1 z-10" />

                {/* Content */}
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"
                  }`}
                >
                  <span className="font-display text-2xl font-bold text-primary">
                    {item.year}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Visit info */}
      <section className="py-16 bg-navy text-primary-foreground relative">
        <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden rotate-180">
          <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Come Visit Us
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: MapPin, title: "Address", detail: "Via Roma 42, Liguria" },
              { icon: Clock, title: "Hours", detail: "Mon–Sat: 9:00 – 20:00" },
              { icon: Phone, title: "Phone", detail: "+39 0185 123 456" },
            ].map((c) => (
              <div key={c.title} className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-gold-light" />
                </div>
                <h4 className="font-display text-lg font-semibold">{c.title}</h4>
                <p className="font-body text-sm text-primary-foreground/60">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
          <img src="/slavic-border.png" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
