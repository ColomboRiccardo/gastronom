import type { Metadata } from "next";

import CheckoutCancelPageClient from "./CheckoutCancelPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  description: "Checkout was cancelled. Your Гастроном cart is still available.",
  robots: noIndexFollow,
};

export default function CheckoutCancelPage() {
  return <CheckoutCancelPageClient />;
}
