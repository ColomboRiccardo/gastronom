import Link from "next/link";
import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export default function LegalPageShell({ title, updatedAt, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Legal</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {updatedAt}</p>
        <article className="prose-legal space-y-8 text-sm leading-relaxed text-foreground/90">
          {children}
        </article>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="text-primary hover:underline">
            Cookie Policy
          </Link>
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
