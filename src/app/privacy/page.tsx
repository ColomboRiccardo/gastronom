import type { Metadata } from "next";

import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Гастроном",
  description: "How Gastronom collects, uses, and protects your personal data under the GDPR.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" updatedAt="26 July 2026">
      <LegalSection title="1. Who we are">
        <p>
          This website is operated by <strong className="text-foreground">Gastronom</strong> (the
          &quot;Controller&quot;), an Eastern European delicatessen based in Liguria, Italy.
        </p>
        <p>
          <strong className="text-foreground">Contact for privacy requests:</strong>{" "}
          <a href="mailto:privacy@gastronom.local" className="text-primary hover:underline">
            privacy@gastronom.local
          </a>
          {" "}(replace with your real contact email before launch).
        </p>
        <p>
          Shop address (placeholder until company details are finalized): Via Roma 42, Liguria,
          Italy. Phone: +39 0185 123 456.
        </p>
      </LegalSection>

      <LegalSection title="2. What data we collect">
        <p>Depending on how you use the shop, we may process:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Account data:</strong> name, email, phone, delivery
            address, password (hashed by our auth provider).
          </li>
          <li>
            <strong className="text-foreground">Order data:</strong> items purchased, amounts,
            shipping details, payment status, order history.
          </li>
          <li>
            <strong className="text-foreground">Payment data:</strong> processed by Stripe. We do
            not store full card numbers on our servers.
          </li>
          <li>
            <strong className="text-foreground">Technical data:</strong> session cookies needed to
            keep you logged in, and cart/wishlist data stored locally or in our database when you
            are signed in.
          </li>
          <li>
            <strong className="text-foreground">Communications:</strong> emails about orders
            (confirmation, status updates, modification proposals).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Why we process your data (legal bases)">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Contract (Art. 6(1)(b) GDPR):</strong> creating an
            account, processing orders, delivering products, sending order-related emails.
          </li>
          <li>
            <strong className="text-foreground">Legal obligation (Art. 6(1)(c)):</strong> tax and
            accounting retention of invoices and order records.
          </li>
          <li>
            <strong className="text-foreground">Legitimate interests (Art. 6(1)(f)):</strong> shop
            security, fraud prevention, improving service reliability.
          </li>
          <li>
            <strong className="text-foreground">Consent (Art. 6(1)(a)):</strong> optional cookies
            (analytics/marketing) and any future newsletter signup.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Who we share data with">
        <p>We use processors who help us run the shop:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Supabase</strong> — authentication, database,
            file storage (hosting may include regions outside the EU; covered by their DPA and
            Standard Contractual Clauses where required).
          </li>
          <li>
            <strong className="text-foreground">Stripe</strong> — payment processing.
          </li>
          <li>
            <strong className="text-foreground">Resend</strong> — transactional email delivery.
          </li>
          <li>
            <strong className="text-foreground">Hosting / CDN</strong> — e.g. Vercel for serving
            the website.
          </li>
        </ul>
        <p>
          We do not sell your personal data. We only share what is needed for each provider to
          perform their service.
        </p>
      </LegalSection>

      <LegalSection title="5. How long we keep data">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong className="text-foreground">Account profile:</strong> while your account is
            active, then deleted or anonymized on verified deletion request (except records we
            must keep by law).
          </li>
          <li>
            <strong className="text-foreground">Orders & invoices:</strong> typically retained for
            the Italian tax/accounting period (commonly up to 10 years).
          </li>
          <li>
            <strong className="text-foreground">Cookie consent choice:</strong> stored in your
            browser until you clear site data or change preferences.
          </li>
          <li>
            <strong className="text-foreground">Support emails:</strong> as long as needed to
            resolve the request, then archived or deleted.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>Under the GDPR you can ask us to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete data (where no legal duty to retain applies)</li>
          <li>Restrict or object to certain processing</li>
          <li>Receive a portable copy of data you provided</li>
          <li>Withdraw consent for optional cookies / marketing at any time</li>
        </ul>
        <p>
          You may also lodge a complaint with the Italian Data Protection Authority (
          <em>Garante per la protezione dei dati personali</em>).
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies">
        <p>
          Details about cookie categories and how to manage them are in our{" "}
          <a href="/cookies" className="text-primary hover:underline">
            Cookie Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          The shop is not directed at children under 16. We do not knowingly collect their data.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes">
        <p>
          We may update this policy when our practices or legal requirements change. The
          &quot;Last updated&quot; date at the top will reflect the latest version.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
