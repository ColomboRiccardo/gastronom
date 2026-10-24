import type { Metadata } from "next";

import CheckoutCancelPageClient from "./CheckoutCancelPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: noIndexFollow,
};

export default function CheckoutCancelPage() {
  return <CheckoutCancelPageClient />;
}
