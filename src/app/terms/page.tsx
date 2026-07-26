import type { Metadata } from "next";

import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — Гастроном",
  description: "Terms governing use of the Gastronom online shop.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" updatedAt="26 July 2026">
      <LegalSection title="1. Agreement">
        <p>
          By using this website and placing orders with Gastronom, you agree to these Terms and to
          our Privacy Policy. If you do not agree, please do not use the shop.
        </p>
      </LegalSection>

      <LegalSection title="2. The shop">
        <p>
          We sell Eastern European food products and related goods for delivery / collection as
          described at checkout. Product descriptions and prices are shown in euros and may change
          without notice until an order is confirmed.
        </p>
        <p>
          Availability can change. If an item cannot be fulfilled, we may contact you to propose a
          modification or cancel that line with an appropriate refund path.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          You must provide accurate registration details and keep your password confidential. You
          are responsible for activity under your account.
        </p>
      </LegalSection>

      <LegalSection title="4. Orders & payment">
        <p>
          Orders are paid through Stripe Checkout. A contract is formed when payment succeeds and
          we confirm the order (including by email). We may refuse or cancel orders in case of
          pricing errors, stock issues, suspected fraud, or force majeure.
        </p>
      </LegalSection>

      <LegalSection title="5. Delivery">
        <p>
          Shipping options, costs, and restrictions (for example frozen goods) will be shown or
          communicated during checkout as the service matures. Delivery times are estimates.
        </p>
      </LegalSection>

      <LegalSection title="6. Consumer rights">
        <p>
          If you buy as a consumer in the EU/Italy, you may have a legal right of withdrawal for
          distance contracts, with exceptions for perishable food and sealed goods that are not
          suitable for return for health protection reasons once unsealed. Contact us promptly if
          you receive damaged or incorrect items.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable use">
        <p>
          Do not misuse the site (attempts to break security, scrape abusively, or place fraudulent
          orders). We may suspend accounts that violate these Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Liability">
        <p>
          To the extent permitted by law, we are not liable for indirect losses. Nothing in these
          Terms limits liability for death or personal injury caused by negligence, fraud, or other
          liability that cannot be excluded under Italian law.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These Terms are governed by Italian law. Mandatory consumer protections in your country of
          residence still apply where relevant.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:privacy@gastronom.local" className="text-primary hover:underline">
            privacy@gastronom.local
          </a>{" "}
          (replace before launch).
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
