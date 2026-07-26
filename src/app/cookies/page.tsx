import type { Metadata } from "next";

import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";

export const metadata: Metadata = {
  title: "Cookie Policy — Гастроном",
  description: "How Gastronom uses cookies and similar technologies on this website.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy" updatedAt="26 July 2026">
      <LegalSection title="1. What cookies are">
        <p>
          Cookies are small text files stored on your device. We also use similar storage such as
          browser <code className="text-foreground">localStorage</code> for cart and consent
          preferences.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use them">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-semibold text-foreground">Category</th>
                <th className="py-2 pr-3 font-semibold text-foreground">Purpose</th>
                <th className="py-2 font-semibold text-foreground">Consent?</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 text-foreground">Necessary</td>
                <td className="py-2 pr-3">
                  Login session (Supabase Auth), security, cart/wishlist needed to shop, storing
                  your cookie choice.
                </td>
                <td className="py-2">No (required)</td>
              </tr>
              <tr className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 text-foreground">Preferences</td>
                <td className="py-2 pr-3">Remember UI preferences such as language.</td>
                <td className="py-2">Yes</td>
              </tr>
              <tr className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 text-foreground">Analytics</td>
                <td className="py-2 pr-3">
                  Measure traffic and improve the site. No analytics script is loaded unless you
                  allow this category.
                </td>
                <td className="py-2">Yes</td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-3 text-foreground">Marketing</td>
                <td className="py-2 pr-3">
                  Promotional tracking or newsletters if enabled later. Off by default.
                </td>
                <td className="py-2">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="3. Manage your choices">
        <p>
          You can change your mind anytime via the banner controls or this button:{" "}
          <CookiePreferencesLink />.
        </p>
        <p>
          You can also clear cookies and site data in your browser settings. That will reset your
          consent choice and may sign you out.
        </p>
      </LegalSection>

      <LegalSection title="4. Third parties">
        <p>
          Payment is handled by Stripe on their pages/infrastructure. Authentication and database
          sessions are handled by Supabase. Those providers may set their own technical cookies
          needed to provide the service.
        </p>
      </LegalSection>

      <LegalSection title="5. More information">
        <p>
          For personal data beyond cookies, see our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
